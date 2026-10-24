import path from 'node:path';
import { mvError, ERR } from '../core/errors.js';
import { AUDIO_SAMPLE_RATE, MS_PER_CHAR_CN } from '../core/constants.js';
import { ensureDir } from './fs-utils.js';
import { readWavDurationMs, toneSamples, writeWav } from './wav.js';

export interface TtsResult {
  file: string;
  durationMs: number;
}

export interface TtsClient {
  readonly name: string;
  synthesize(text: string, outFile: string, voice?: string): Promise<TtsResult>;
}

export class SilentTtsClient implements TtsClient {
  readonly name = 'silent';

  async synthesize(text: string, outFile: string, _voice?: string): Promise<TtsResult> {
    await ensureDir(path.dirname(outFile));
    const durationMs = Math.max(800, text.length * MS_PER_CHAR_CN);
    await writeWav(outFile, toneSamples(durationMs), AUDIO_SAMPLE_RATE);
    return { file: outFile, durationMs: await readWavDurationMs(outFile) };
  }
}

export class EdgeTtsClient implements TtsClient {
  readonly name = 'edge-tts';

  constructor(private readonly opts: { voice?: string; rate?: string } = {}) {}

  async synthesize(text: string, outFile: string, voice?: string): Promise<TtsResult> {
    const mod = await loadEdgeTts();
    if (!mod) {
      throw mvError(ERR.TTS, 'edge-tts 模块不可用（npm i edge-tts）');
    }
    const voiceName = voice ?? this.opts.voice ?? 'zh-CN-XiaoxiaoNeural';
    const buf = await mod.tts(text, { voice: voiceName, rate: this.opts.rate });
    if (!buf || buf.length === 0) throw mvError(ERR.TTS, 'edge-tts 返回空音频');
    await ensureDir(path.dirname(outFile));
    const { writeFile } = await import('node:fs/promises');
    await writeFile(outFile, buf);
    const ms = await estimateMp3DurationMs(buf);
    return { file: outFile, durationMs: ms };
  }
}

async function estimateMp3DurationMs(buf: Buffer): Promise<number> {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const { writeFile, readFile, unlink } = await import('node:fs/promises');
  const tmp = `${process.cwd()}/.mv-tts-${Date.now()}.mp3`;
  await writeFile(tmp, buf);
  try {
    const { stdout } = await promisify(execFile)('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'json',
      tmp,
    ]);
    const parsed = JSON.parse(stdout) as { format?: { duration?: string } };
    return Math.round(Number(parsed.format?.duration ?? 0) * 1000);
  } finally {
    await unlink(tmp).catch(() => undefined);
    void readFile;
  }
}

async function loadEdgeTts(): Promise<{
  tts: (text: string, opts?: { voice?: string; rate?: string }) => Promise<Buffer>;
} | null> {
  try {
    // 包的 main 指向 TS 源码（Node 拒绝 strip node_modules 内类型），引编译产物；
    // 用变量 specifier 绕过 TS 对可选依赖的解析（未安装时不报错）
    const moduleName = 'edge-tts/out/index.js';
    const mod = (await import(moduleName)) as unknown as {
      tts: (text: string, opts?: { voice?: string; rate?: string }) => Promise<Buffer>;
    };
    return { tts: mod.tts };
  } catch {
    return null;
  }
}

export class RecordingTtsClient implements TtsClient {
  readonly name = 'recording';

  async synthesize(_text: string, outFile: string, _voice?: string): Promise<TtsResult> {
    throw mvError(ERR.TTS, `RecordingTtsClient 只支持 adopt: ${outFile}`);
  }
}

export class PythonEdgeTtsClient implements TtsClient {
  readonly name = 'edge-py';

  constructor(
    private readonly opts: { voice?: string; rate?: string; python?: string } = {},
  ) {}

  async synthesize(text: string, outFile: string, voice?: string): Promise<TtsResult> {
    const py = this.opts.python ?? 'python';
    const voiceName = voice ?? this.opts.voice ?? 'zh-CN-XiaoxiaoNeural';
    await ensureDir(path.dirname(outFile));
    const args = [
      '-m',
      'edge_tts',
      '--voice',
      voiceName,
      '--text',
      text,
      '--write-media',
      outFile,
    ];
    if (this.opts.rate) args.push('--rate', this.opts.rate);
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const run = promisify(execFile);
    try {
      await run(py, args, { maxBuffer: 16 * 1024 * 1024, timeout: 120000 });
    } catch (e) {
      throw mvError(ERR.TTS, `python edge-tts 合成失败: ${(e as Error).message}`);
    }
    const ms = await ffprobeDurationMs(outFile);
    if (ms <= 0) throw mvError(ERR.TTS, `python edge-tts 输出异常: ${outFile}`);
    return { file: outFile, durationMs: ms };
  }
}

async function ffprobeDurationMs(file: string): Promise<number> {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  try {
    const { stdout } = await promisify(execFile)('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'json',
      file,
    ]);
    const parsed = JSON.parse(stdout) as { format?: { duration?: string } };
    return Math.round(Number(parsed.format?.duration ?? 0) * 1000);
  } catch {
    return 0;
  }
}

async function pythonEdgeTtsAvailable(python = 'python'): Promise<boolean> {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  try {
    await promisify(execFile)(python, ['-c', 'import edge_tts'], { timeout: 30000 });
    return true;
  } catch {
    return false;
  }
}

/** 惰性 TTS 客户端：首次合成时才探测线路，调用点无需改异步 */
class LazyTtsClient implements TtsClient {
  readonly name = 'auto';
  private inner: TtsClient | null = null;

  private async resolve(): Promise<TtsClient> {
    if (!this.inner) {
      this.inner = (await pythonEdgeTtsAvailable())
        ? new PythonEdgeTtsClient()
        : (await loadEdgeTts())
          ? new EdgeTtsClient()
          : new SilentTtsClient();
    }
    return this.inner;
  }

  async synthesize(text: string, outFile: string, voice?: string): Promise<TtsResult> {
    const inner = await this.resolve();
    return inner.synthesize(text, outFile, voice);
  }
}

export type TtsProvider = 'silent' | 'edge' | 'edge-py' | 'auto';

export function createTtsClient(provider: TtsProvider): TtsClient {
  if (provider === 'edge-py') return new PythonEdgeTtsClient();
  if (provider === 'edge') return new EdgeTtsClient();
  if (provider === 'silent') return new SilentTtsClient();
  return new LazyTtsClient();
}

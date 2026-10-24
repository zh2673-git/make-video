// 声音部混音执行（docs/07）：三层声音 + ducking 包络 + 音效落点
// V-SND-001 三层各司其职 / V-SND-003 落点对齐 / V-SND-005 ducking / V-CMP-004
import path from 'node:path';
import fs from 'node:fs/promises';
import type { MixPlan, Project, Timeline } from '../core/schema.js';
import { runFfmpeg } from '../infrastructure/ffmpeg-utils.js';
import { ensureDir, exists } from '../infrastructure/fs-utils.js';
import { DUCK_RATIO } from '../core/constants.js';

// 旁白全轨：各镜按时间线起点延迟对齐后混音（时间真源 = timeline）
export async function buildVoTrack(
  project: Project,
  timeline: Timeline,
  dir: string,
): Promise<string> {
  await ensureDir(dir);
  const out = path.join(dir, 'vo-mix.wav');
  const voiced = timeline.shots.filter((t) => {
    const shot = project.shots.find((s) => s.id === t.shotId);
    return shot?.voice && exists(shot.voice.file);
  });
  if (voiced.length === 0) throw new Error('无可用旁白音轨');
  const args: string[] = [];
  const filters: string[] = [];
  voiced.forEach((t, i) => {
    const shot = project.shots.find((s) => s.id === t.shotId)!;
    args.push('-i', shot.voice!.file);
    filters.push(`[${i}:a]adelay=${t.startMs}|${t.startMs}[a${i}]`);
  });
  const mixIn = voiced.map((_, i) => `[a${i}]`).join('');
  const totalS = (
    (timeline.shots.at(-1)!.startMs + timeline.shots.at(-1)!.durationMs) / 1000
  ).toFixed(3);
  filters.push(`${mixIn}amix=inputs=${voiced.length}:normalize=0,apad=whole_dur=${totalS}[out]`);
  args.push('-filter_complex', filters.join(';'), '-map', '[out]', '-t', totalS, out);
  await runFfmpeg(args);
  return out;
}

// 程序化 BGM：低沉 pad（三正弦叠加 + 慢颤音 + 低通），无音源依赖
export async function buildBgm(totalMs: number, dir: string): Promise<string> {
  await ensureDir(dir);
  const out = path.join(dir, 'bgm-raw.wav');
  const d = (totalMs / 1000).toFixed(3);
  await runFfmpeg([
    '-f', 'lavfi', '-i', `sine=f=55:d=${d}`,
    '-f', 'lavfi', '-i', `sine=f=110.3:d=${d}`,
    '-f', 'lavfi', '-i', `sine=f=164.8:d=${d}`,
    '-f', 'lavfi', '-i', `sine=f=220.6:d=${d}`,
    '-filter_complex',
    '[0:a]volume=0.5[a];[1:a]volume=0.35[b];[2:a]volume=0.22[c];[3:a]volume=0.12[d];' +
      '[a][b][c][d]amix=4:normalize=0,tremolo=f=0.13:d=0.55,lowpass=f=420,volume=0.9[out]',
    '-map', '[out]', out,
  ]);
  return out;
}

// ducking：旁白区间 BGM 经 sidechaincompress 压至约 DUCK_RATIO（V-SND-005 / V-CMP-004）
export async function duckBgm(bgm: string, voTrack: string, dir: string): Promise<string> {
  const out = path.join(dir, 'bgm.wav');
  await runFfmpeg([
    '-i', bgm,
    '-i', voTrack,
    '-filter_complex',
    '[1:a]volume=1[sc];[0:a][sc]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=450[out]',
    '-map', '[out]', out,
  ]);
  return out;
}

// 音效合成：whoosh（粉色噪声扫频）/ hit（低频锤点）
export async function buildSfx(dir: string): Promise<{ whoosh: string; hit: string }> {
  await ensureDir(dir);
  const whoosh = path.join(dir, 'whoosh.wav');
  await runFfmpeg([
    '-f', 'lavfi', '-i', 'anoisesrc=color=pink:d=0.7:a=0.7',
    '-af', 'lowpass=f=1400,highpass=f=300,afade=t=in:d=0.3,afade=t=out:st=0.32:d=0.38,volume=0.55',
    whoosh,
  ]);
  const hit = path.join(dir, 'hit.wav');
  await runFfmpeg([
    '-f', 'lavfi', '-i', 'sine=f=58:d=0.5',
    '-af', 'afade=t=out:st=0.06:d=0.44,volume=0.75',
    hit,
  ]);
  return { whoosh, hit };
}

// 混音计划（A9 工件）：whoosh@每个转场剪切点；hit@重音镜起点（V-SND-003 落点对齐）
export function planMix(project: Project, timeline: Timeline, audioDir: string): MixPlan {
  const cues: MixPlan['sfxCues'] = [];
  for (const t of timeline.shots) {
    if (t.transition !== 'none' && t.startMs > 0) {
      cues.push({ file: 'audio/sfx/whoosh.wav', atMs: t.startMs, kind: 'whoosh' });
    }
    const shot = project.shots.find((s) => s.id === t.shotId);
    const seg = project.script?.segments.find((x) => x.id === shot?.segmentId);
    if (seg?.mood === 'tense' || seg?.mood === 'awe') {
      cues.push({ file: 'audio/sfx/hit.wav', atMs: t.startMs, kind: 'hit' });
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    tracks: [
      { kind: 'vo', file: path.join(audioDir, 'vo-mix.wav'), gainDb: 0 },
      { kind: 'bgm', file: path.join(audioDir, 'bgm.wav'), gainDb: 0 },
      { kind: 'sfx', file: path.join(audioDir, 'sfx'), gainDb: -4 },
    ],
    duckRatio: DUCK_RATIO,
    sfxCues: cues,
  };
}

// srt 导出（docs/07 字幕工件；词边界策略：emphasis 优先 → 已在 cue.keywords 实现）
export async function exportSrt(timeline: Timeline, out: string): Promise<void> {
  const fmt = (ms: number): string => {
    const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const f = String(Math.floor(ms % 1000)).padStart(3, '0');
    return `${h}:${m}:${s},${f}`;
  };
  const blocks = timeline.subtitles.map((c, i) => {
    const kw = c.keywords.length > 0 ? ` 【${c.keywords.join('、')}】` : '';
    return `${i + 1}\n${fmt(c.startMs)} --> ${fmt(c.endMs)}\n${c.text}${kw}\n`;
  });
  await fs.writeFile(out, blocks.join('\n'), 'utf8');
}

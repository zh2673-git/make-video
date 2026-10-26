import { spawnSync } from 'node:child_process';

// 已定档的配音设置：Qwen3-TTS 0.6B 零样本克隆 + take4 参考音频（6 句逐字校验全对）
const env = {
  ...process.env,
  MV_TTS: 'qwen3',
  MAKEVIDEO_QWEN3_PYTHON: 'C:\\Users\\LX\\.cache\\qwen3tts-venv\\Scripts\\python.exe',
  MAKEVIDEO_QWEN3_MODEL: 'C:\\Users\\LX\\.cache\\qwen3-tts\\Qwen3-TTS-12Hz-0.6B-Base',
  // 参考音频存放在个人文档（不入库）：c:\Users\LX\Documents\录音\make-video语音资产\
  MAKEVIDEO_QWEN3_REF_AUDIO:
    'C:\\Users\\LX\\Documents\\录音\\make-video语音资产\\my-voice-take4-ref.wav',
  MAKEVIDEO_QWEN3_PROMPT_TEXT:
    '今天风不大，阳光正好。我们慢慢来，把这件事说清楚，不着急，一句一句讲明白了。',
  MAKEVIDEO_QWEN3_LANG: 'Chinese',
  // qwen_tts 依赖 SoX 可执行文件
  PATH: `C:\\Users\\LX\\.cache\\sox\\sox-14.4.2;${process.env.PATH ?? ''}`,
};

const project = process.argv[2] ?? '秋天叶子为什么变红-mvokpcik';
const r = spawnSync(
  process.execPath,
  ['dist/interfaces/cli.js', 'voice', '--project', project],
  { env, stdio: 'inherit', encoding: 'utf8' },
);
process.exit(r.status ?? 1);

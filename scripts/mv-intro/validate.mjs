// 场景本地预检：复刻 src/core/validators/scene.ts 的校验规则（避免逐镜试错）
export const MOTION_WHITELIST = [
  'MV.enter', 'MV.exit', 'MV.emphasis', 'MV.camera',
  'MV.performance', 'MV.subtitle', 'MV.idle', 'MV.use', 'MV.timeline',
];

const TIME_ATTRS = ['data-start', 'data-duration', 'data-track-index'];

const EASING_WHITELIST = [
  'power1.out', 'power1.in', 'power1.inOut', 'power2.out', 'power2.in', 'power2.inOut',
  'power3.out', 'power3.in', 'power3.inOut', 'power4.out', 'sine.out', 'sine.in', 'sine.inOut',
  'expo.out', 'expo.in', 'back.out', 'elastic.out', 'none',
];

function stripSubtitleAreas(html, title) {
  let out = html.replace(
    /<(div|span|p)[^>]*class="[^"]*\b(caption|hint|sub|subtitle)\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g,
    ' ',
  );
  if (title && title.length >= 4) out = out.split(title).join(' ');
  return out;
}

const CJK = /[\u4e00-\u9fff]/;

export function findSharedRuns(narration, html, minLen = 4) {
  const cleaned = narration.replace(/[，。！？、；：""''（）\s,.!?;:()]/g, '');
  const runs = new Set();
  if (CJK.test(cleaned)) {
    for (let i = 0; i + minLen <= cleaned.length; i += 1) {
      const run = cleaned.slice(i, i + minLen);
      if (CJK.test(run) && html.includes(run)) runs.add(run);
    }
  }
  for (const word of narration.split(/[^A-Za-z0-9]+/)) {
    if (word.length >= 4 && html.toLowerCase().includes(word.toLowerCase())) runs.add(word);
  }
  return [...runs].slice(0, 3);
}

/** 复刻 validateSceneFile（src/core/validators/scene.ts） */
export function validateSceneFile(html, opts) {
  const issues = [];
  if (!html.includes('data-scene-id')) issues.push('[error] V-SCENE-002: 场景缺少根元素 data-scene-id');
  for (const attr of TIME_ATTRS) {
    if (html.includes(attr)) issues.push(`[error] V-SCENE-002: 场景禁止包含时间轴属性 ${attr}`);
  }
  for (const call of html.match(/MV\.[a-zA-Z]+/g) ?? []) {
    if (!MOTION_WHITELIST.includes(call)) issues.push(`[error] V-SCENE-003: 非白名单原语 ${call}`);
  }
  for (const m of html.match(/duration:\s*(\d{3,})/g) ?? []) {
    const ms = Number(m.match(/(\d+)/)[1]);
    const ok = (ms >= 200 && ms <= 400) || (ms >= 400 && ms <= 800) || (ms >= 300 && ms <= 600) || (ms >= 1200 && ms <= 2000);
    if (!ok) issues.push(`[error] V-MOT-008: 时长 ${ms}ms 不在区间`);
  }
  for (const m of html.match(/(?:ease|easing):\s*'([^']+)'/g) ?? []) {
    const val = m.match(/'([^']+)'/)?.[1];
    if (!val || val.startsWith('{{') || val.includes('(')) continue;
    if (!EASING_WHITELIST.includes(val)) issues.push(`[error] V-MOT-001: 缓动 '${val}' 不在白名单`);
  }
  for (const m of html.match(/\.[a-zA-Z]+\([^)]*x:\s*-?\d+[^)]*ease:\s*'none'[^)]*\)/g) ?? []) {
    issues.push(`[error] V-MOT-005: 直线匀速位移：${m.slice(0, 50)}`);
  }
  for (const m of html.match(/\.[a-zA-Z]+\([^)]*y:\s*-?\d+[^)]*ease:\s*'none'[^)]*\)/g) ?? []) {
    issues.push('[error] V-ACT-004: 位移急停');
  }
  for (const m of html.match(/\.(?:note|hint|sub|deco)\s*\{[^}]*opacity:\s*(0?\.\d+|1)\b/g) ?? []) {
    const op = Number(m.match(/opacity:\s*(0?\.\d+|1)/)[1]);
    if (op > 0.7) issues.push(`[error] V-MOT-004: 辅助元素透明度 ${op} > 0.7`);
  }
  const isCanvas = html.includes('canvas');
  if (!isCanvas) {
    const targets = new Set([...html.matchAll(/MV\.(?:enter|to|from|fromTo|emphasis)\('([^']+)'/g)].map((m) => m[1]));
    if (targets.size > 4) issues.push(`[error] V-MOT-010: 同屏运动元素 ${targets.size} > 3`);
    let dirs = 0;
    if (/\bx:\s*-/.test(html)) dirs += 1;
    if (/\bx:\s*\d/.test(html)) dirs += 1;
    if (/\by:\s*-/.test(html)) dirs += 1;
    if (dirs > 2) issues.push('[error] V-MOT-011: 同屏运动方向 > 2');
    const subjects = (html.match(/class="[^"]*\b(subject|title|hero)\b[^"]*"/g) ?? []).length;
    if (subjects !== 1) issues.push(`[error] V-COMP-001: 视觉主语数量 ${subjects} ≠ 1`);
  }
  const estSec = opts.narration.length * 0.22;
  if (estSec > 4 && !/MV\.idle|MV\.emphasis|MV\.performance|pulse/.test(html)) {
    issues.push(`[warn] V-ACT-005: 长镜（≈${estSec.toFixed(1)}s）无 idle 微动`);
  }
  const visualText = stripSubtitleAreas(html, opts.title);
  for (const run of findSharedRuns(opts.narration, visualText)) {
    issues.push(`[error] V-SCENE-005: 画面元素复述旁白原文「${run}」`);
  }
  return issues;
}

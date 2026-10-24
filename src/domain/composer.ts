import path from 'node:path';
import type {
  ContinuityReport,
  Project,
  StylePack,
  SubtitlePolicy,
  Timeline,
} from '../core/schema.js';
import { V } from '../core/index.js';
import { mvError, ERR } from '../core/errors.js';
import { TEMPLATES_DIR } from '../core/constants.js';
import type { ProjectStore } from '../infrastructure/project-store.js';
import { atomicWriteText, copyFile, ensureDir, exists } from '../infrastructure/fs-utils.js';
import { extractKeywords } from '../core/validators/scene.js';
import { copyDir } from './composer-utils.js';
import { escapeHtml } from './scene-forge.js';
import { buildVoTrack, buildBgm, duckBgm, buildSfx, planMix, exportSrt } from './audiomix.js';
import { DUCK_RATIO } from '../core/constants.js';

export function validateReadiness(project: Project): V.Issue[] {
  const issues: V.Issue[] = [];
  if (!project.style) issues.push(V.err('V-STYLE-001', '缺少风格决策'));
  for (const shot of project.shots) {
    if (!shot.asset) {
      issues.push(V.err('V-AST-005', `镜头 ${shot.id} 缺少素材资产`));
    } else if (!exists(shot.asset.path)) {
      issues.push(V.err('V-AST-005', `镜头 ${shot.id} 素材文件不存在: ${shot.asset.path}`));
    }
    if (!shot.voice) {
      issues.push(V.err('V-SND-002', `镜头 ${shot.id} 缺少旁白（无实测时长）`));
    }
  }
  if (project.timeline) {
    issues.push(...V.validateTimelineSync(project.shots, project.timeline));
    issues.push(...V.validateSfxLanding(project.timeline));
  }
  issues.push(...V.validateContinuity(project.shots));
  return issues;
}

export function continuityReport(project: Project): ContinuityReport {
  const items: ContinuityReport['items'] = [];
  const byScene = new Map<string, Project['shots']>();
  for (const s of project.shots) {
    const scene = String(s.visual.params['scene'] ?? s.id);
    byScene.set(scene, [...(byScene.get(scene) ?? []), s]);
  }
  for (const [scene, list] of byScene) {
    if (list.length < 2) continue;
    const dirs = new Set(list.map((s) => String(s.visual.params['side'] ?? 'center')));
    const allGag = list.every((s) => s.gag);
    if (dirs.size > 1) {
      items.push({
        rule: 'V-CON-001',
        status: allGag ? 'declared-gag' : 'violation',
        detail: `场景「${scene}」方位 ${[...dirs].join('/')}`,
      });
    } else {
      items.push({ rule: 'V-CON-001', status: 'ok', detail: `场景「${scene}」方位一致` });
    }
  }
  const zooms = project.shots.map((s) => s.zoom);
  if (new Set(zooms).size < 2 && project.shots.length > 3) {
    items.push({
      rule: 'V-COMP-008',
      status: 'violation',
      detail: '全片景别无变化（缺少景别序列）',
    });
  }
  return { generatedAt: new Date().toISOString(), items };
}

export function computeTimeline(project: Project): Timeline {
  const shots: Timeline['shots'] = [];
  const subtitles: Timeline['subtitles'] = [];
  let acc = 0;
  for (const shot of project.shots) {
    const durationMs = shot.voice?.durationMs ?? 0;
    shots.push({ shotId: shot.id, startMs: acc, durationMs, transition: shot.transition });
    // V-SND-004：按句读切分 cue，句内各 cue 时长按字符数比例分配（标点等分的句子级实现）
    const sentences = splitSentences(shot.narration);
    const totalChars = sentences.reduce((a, s) => a + s.length, 0) || 1;
    let cueStart = acc;
    const segment = project.script?.segments.find((x) => x.id === shot.segmentId);
    for (const sentence of sentences) {
      const cueMs = Math.max(800, Math.round((sentence.length / totalChars) * durationMs));
      const endMs = Math.min(acc + durationMs, cueStart + cueMs);
      // V-SND-004 词边界优先：编剧声明的重音词优先于前缀截取
      const emphasisHits = (segment?.emphasis ?? []).filter((w) => sentence.includes(w));
      const keywords = [...new Set([...emphasisHits, ...extractKeywords(sentence)])].slice(0, 3);
      subtitles.push({
        shotId: shot.id,
        startMs: cueStart,
        endMs,
        text: sentence,
        keywords,
        emphasis: emphasisHits,
      });
      cueStart = endMs;
    }
    acc += durationMs;
  }
  return { shots, subtitles, bgm: undefined, sfx: [] };
}

const SENTENCE_SPLIT_RE = /(?<=[。！？；!?;])/;
export function splitSentences(text: string): string[] {
  return text
    .split(SENTENCE_SPLIT_RE)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function compose(
  store: ProjectStore,
  project: Project,
  pack: StylePack,
): Promise<Timeline> {
  const gate = validateReadiness(project);
  if (V.hasError(gate)) {
    throw mvError(ERR.VALIDATION, `质量闸门未过:\n${V.formatIssues(gate)}`);
  }
  const report = continuityReport(project);
  const hasViolation = report.items.some((i) => i.status === 'violation');
  const timeline = computeTimeline(project);

  const syncIssues = V.validateTimelineSync(project.shots, timeline);
  if (V.hasError(syncIssues)) {
    throw mvError(ERR.VALIDATION, `音画同步校验失败:\n${V.formatIssues(syncIssues)}`);
  }

  // 声音部混音执行（docs/07）：三层声音 + ducking + 音效落点
  const dir = store.projectDir(project.meta.id);
  const audioDir = path.join(dir, 'audio', 'mix');
  const voTrack = await buildVoTrack(project, timeline, audioDir);
  const bgmRaw = await buildBgm(
    timeline.shots.at(-1)!.startMs + timeline.shots.at(-1)!.durationMs,
    audioDir,
  );
  const bgm = await duckBgm(bgmRaw, voTrack, audioDir);
  const sfxFiles = await buildSfx(path.join(audioDir, 'sfx'));
  timeline.bgm = path.relative(dir, bgm).split(path.sep).join('/');
  timeline.sfx = planMix(project, timeline, audioDir).sfxCues;

  // A9 混音计划工件
  project.mixPlan = {
    generatedAt: new Date().toISOString(),
    tracks: [
      { kind: 'vo', file: path.relative(dir, voTrack), gainDb: 0 },
      { kind: 'bgm', file: path.relative(dir, bgm), gainDb: 0 },
      { kind: 'sfx', file: path.relative(dir, sfxFiles.whoosh), gainDb: -4 },
    ],
    duckRatio: DUCK_RATIO,
    sfxCues: timeline.sfx.map((c) => ({ ...c, kind: c.kind === 'hit' ? 'hit' : 'whoosh' as const })),
  };

  // A8 剪切点审计报告（Rule of Six 候选集）
  const audit = timeline.shots.slice(1).map((t, idx) => {
    const prev = timeline.shots[idx]!;
    const prevShot = project.shots.find((s) => s.id === prev.shotId);
    const curShot = project.shots.find((s) => s.id === t.shotId);
    return {
      cut: `${prev.shotId}→${t.shotId}`,
      atMs: t.startMs,
      candidates: [
        prevShot && /[，。！？；.!?;]$/.test(prevShot.narration.trim()) ? '句读停顿' : null,
        prevShot && curShot && prevShot.zoom !== curShot.zoom ? '景别变化' : null,
        prevShot && curShot && prevShot.colorTemp !== curShot.colorTemp ? '色温变化' : null,
      ].filter(Boolean),
    };
  });
  await appendLog(store, project, 'cut-audit.json', JSON.stringify(audit, null, 2));

  // 剪辑节奏 + 声音部 error 级校验
  const sceneDir = path.join(dir, 'scenes');
  const scenePulse = new Map<string, boolean>();
  const sceneBeats = new Map<string, number>();
  for (const shot of project.shots) {
    const file = path.join(sceneDir, `Scene_${shot.id}.html`);
    if (!exists(file)) continue;
    const html = await import('node:fs/promises').then((m) => m.readFile(file, 'utf8'));
    scenePulse.set(shot.id, /MV\.idle|MV\.performance|MV\.emphasis|pulse/.test(html));
    const beats = html.match(/data-beats="(\d+)"/);
    if (beats) {
      sceneBeats.set(shot.id, Number(beats[1]));
    } else {
      sceneBeats.set(shot.id, (html.match(/\.(to|from|fromTo)\(/g) ?? []).length);
    }
  }
  const gateIssues = [
    ...V.validateCutCandidates(project.shots, timeline),
    ...V.validateEmphasisTriangle(project.shots, timeline, scenePulse),
    ...V.validateMixPlan(project.mixPlan),
  ];
  if (V.hasError(gateIssues)) {
    throw mvError(ERR.VALIDATION, `剪辑/声音部校验失败:\n${V.formatIssues(gateIssues)}`);
  }
  const warnIssues = [
    ...V.validateCutPoints(project.shots, timeline),
    ...V.validateDensity(timeline, pack.pacing.shotLenMs[0], pack.pacing.shotLenMs[1]),
    ...V.validateBreath(timeline, pack.pacing.breathEvery),
    ...V.validateVisualChange(timeline, sceneBeats),
  ];
  await appendLog(store, project, 'validation.log', warnIssues.map((i) => `[warn] ${i.id}: ${i.message}`).join('\n'));

  project.timeline = timeline;
  project.continuity = { ...report, items: hasViolation ? report.items : report.items };
  if (hasViolation) {
    const violations = report.items.filter((i) => i.status === 'violation');
    throw mvError(
      ERR.VALIDATION,
      `连续性报告存在违规:\n${violations.map((v) => `${v.rule}: ${v.detail}`).join('\n')}`,
    );
  }
  project.stage = 'compose';
  // 字幕工件（srt）
  const outDir = path.join(dir, 'out');
  await ensureDir(outDir);
  await exportSrt(timeline, path.join(outDir, 'subtitles.srt'));
  await emitHyperframesProject(store, project, pack, timeline);
  await store.save(project);
  return timeline;
}

async function emitHyperframesProject(
  store: ProjectStore,
  project: Project,
  pack: StylePack,
  timeline: Timeline,
): Promise<void> {
  const dir = store.projectDir(project.meta.id);
  const hfDir = path.join(dir, 'remotion');
  const compDir = path.join(hfDir, 'compositions');
  await ensureDir(compDir);
  await copyDir(path.join(store.root, TEMPLATES_DIR, 'motion'), path.join(hfDir, 'motion'));
  await copyDir(path.join(store.root, TEMPLATES_DIR, 'canvas'), path.join(hfDir, 'canvas'));

  // 旁白音频复制进渲染项目根（音频引用不得 ../ 越界，否则文件服务器拒绝 → 成片无声）
  const voDir = path.join(hfDir, 'audio', 'vo');
  await ensureDir(voDir);
  for (const shot of project.shots) {
    if (shot.voice && exists(shot.voice.file)) {
      await copyFile(shot.voice.file, path.join(voDir, path.basename(shot.voice.file)));
    }
  }

  const size = project.meta.aspect === '9:16' ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 };
  // 字幕策略：project 覆写 > 风格包声明 > full（docs/07）
  const policy: SubtitlePolicy = project.subtitlePolicy ?? (pack as { subtitlePolicy?: SubtitlePolicy }).subtitlePolicy ?? 'full';

  // 感知画面排版：读场景 CSS 里主语（.subject）的纵向位置，字幕放对侧（V-CAP-001）
  const sideByShot = new Map<string, 'top' | 'bottom'>();
  for (const shot of project.shots) {
    const src = path.join(dir, 'scenes', `Scene_${shot.id}.html`);
    if (!exists(src)) {
      throw mvError(ERR.VALIDATION, `镜头 ${shot.id} 场景文件缺失（请先 draw）`);
    }
    const fs = await import('node:fs/promises');
    const sceneHtml = await fs.readFile(src, 'utf8');
    sideByShot.set(shot.id, pickCaptionSide(sceneHtml));
    const durMs = timeline.shots.find((t) => t.shotId === shot.id)?.durationMs ?? 20000;
    const wrapped = wrapComposition(sceneHtml, shot.id, size, durMs / 1000);
    await atomicWriteText(path.join(compDir, `Scene_${shot.id}.html`), wrapped);
  }

  const captions = timeline.subtitles.map((c) => ({
    start: +(c.startMs / 1000).toFixed(3),
    duration: +((c.endMs - c.startMs) / 1000).toFixed(3),
    text: c.text,
    keywords: c.keywords,
    shotId: c.shotId,
  }));

  const tracks: string[] = [];
  timeline.shots.forEach((t, i) => {
    const start = (t.startMs / 1000).toFixed(3);
    const dur = (t.durationMs / 1000).toFixed(3);
    // 官方 lint 契约：composition-src 宿主必须带 data-composition-id（渲染器据此挂载并驱动子合成时间线）
    tracks.push(
      `  <div class="clip" id="clip-${t.shotId}" data-composition-id="scene-${t.shotId}" data-composition-src="compositions/Scene_${t.shotId}.html" data-track-index="0" data-start="${start}" data-duration="${dur}"></div>`,
    );
    const shot = project.shots[i];
    if (shot?.voice) {
      // 音频必须位于渲染项目根内（../ 越界路径会被文件服务器拒绝导致无声）
      const rel = `audio/vo/${path.basename(shot.voice.file)}`;
      tracks.push(
        `  <audio class="clip" id="aud-${t.shotId}" data-track-index="1" data-start="${start}" data-duration="${dur}" src="${rel}"></audio>`,
      );
    }
    // 字幕策略落地（V-CAP-001/002）：off 不出画面字幕；keyword 出关键词梗卡（避让主体+错位摆动）；
    // full 出整句条（关键词内联高亮，不再叠加独立黄词条）。srt 工件三种策略下都全量导出（无障碍）。
    const side = sideByShot.get(t.shotId) ?? 'bottom';
    if (policy !== 'off') {
      for (const cue of timeline.subtitles.filter((c) => c.shotId === t.shotId)) {
        const cs = (cue.startMs / 1000).toFixed(3);
        const cd = ((cue.endMs - cue.startMs) / 1000).toFixed(3);
        if (policy === 'keyword') {
          // 卡词只用编剧声明的重音词（可信来源）；声明缺失时退回 ≤6 字的切分词，宁缺毋滥
          const declared = cleanKeywords(cue.emphasis ?? [], 2);
          const kws = declared.length > 0 ? declared : cleanKeywords(cue.keywords.filter((k) => k.length <= 6), 1);
          if (kws.length === 0) continue;
          const j = hashJitter(`${cue.shotId}:${cue.startMs}`);
          const h = ['cap-h-c', 'cap-h-l', 'cap-h-r'][j % 3];
          const tilt = ((j % 7) - 3) * 0.8;
          const inner = kws.map((k) => `<em>${escapeHtml(k)}</em>`).join('');
          tracks.push(
            `  <div class="clip kwcard cap-${side} ${h}" data-track-index="2" data-start="${cs}" data-duration="${cd}"><span class="kw-stack" style="--tilt:${tilt.toFixed(1)}deg">${inner}</span></div>`,
          );
        } else {
          tracks.push(
            `  <div class="clip caption cap-${side}" data-track-index="2" data-start="${cs}" data-duration="${cd}"><span class="caption-text">${highlightSentence(cue.text, cue.keywords)}</span></div>`,
          );
        }
      }
    }
  });

  // 三层声音轨：BGM（已 ducking）+ 音效落点（V-SND-001/003）
  const totalDurS = ((timeline.shots.at(-1)?.startMs ?? 0) + (timeline.shots.at(-1)?.durationMs ?? 0)) / 1000;
  if (timeline.bgm && exists(path.join(dir, timeline.bgm))) {
    const bgmDest = path.join(hfDir, 'audio', 'bgm.wav');
    if (!exists(bgmDest)) await copyFile(path.join(dir, timeline.bgm), bgmDest);
    tracks.push(
      `  <audio class="clip" id="aud-bgm" data-track-index="1" data-start="0" data-duration="${totalDurS.toFixed(3)}" src="audio/bgm.wav"></audio>`,
    );
  }
  for (const [i, cue] of timeline.sfx.entries()) {
    await ensureDir(path.join(hfDir, 'audio', 'sfx'));
    const base = path.basename(cue.file);
    const src = path.join(dir, 'audio', 'mix', 'sfx', base);
    const dest = path.join(hfDir, 'audio', 'sfx', base);
    if (exists(src) && !exists(dest)) await copyFile(src, dest);
    if (exists(dest)) {
      const cs = (cue.atMs / 1000).toFixed(3);
      tracks.push(
        `  <audio class="clip" id="aud-sfx-${i}" data-track-index="1" data-start="${cs}" data-duration="0.7" src="audio/sfx/${base}"></audio>`,
      );
    }
  }

  // 转场：按 IR transition 词表在剪切点生成交叉溶解（dissolve）/硬切（none/slide 暂按 dissolve 退化）
  const transitionsScript = buildTransitionsScript(timeline);

  const totalS = (((timeline.shots.at(-1)?.startMs ?? 0) + (timeline.shots.at(-1)?.durationMs ?? 0)) / 1000).toFixed(3);
  const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>${escapeHtml(project.meta.title)}</title>
<style>
  :root { --primary: ${pack.palette.primary}; --accent: ${pack.palette.accent}; }
  html, body { margin: 0; padding: 0; background: ${pack.palette.neutral[4]}; font-family: ${pack.type.families[0]}; }
  /* 字幕必须绝对定位满屏：clip div 在文档流中无高度，否则文字堆在页面顶部 */
  /* V-CAP-001 排版感知：cap-top/cap-bottom 由场景主语位置决定，字幕放对侧 */
  .clip.caption { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; }
  .caption.cap-bottom { justify-content: flex-end; padding-bottom: 6%; }
  .caption.cap-top { justify-content: flex-start; padding-top: 5.5%; }
  /* 电影风字幕：细黑衬底 + 白字，关键词内联高亮（不再叠加独立黄词条） */
  .caption-text { font-size: ${Math.round(pack.type.scale.body * size.h * 0.9)}px; color: #f5f5f4; background: rgba(10,10,14,0.55); padding: 0.25em 0.9em; border-radius: 0.18em; letter-spacing: 0.04em; text-shadow: 0 1px 6px rgba(0,0,0,0.6); }
  .caption-text em { font-style: normal; color: ${pack.palette.accent}; font-weight: 700; }
  /* V-CAP-002 关键词梗卡：贴纸式卡片，微倾角+水平错位，避让主体，只落关键词 */
  .clip.kwcard { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 9%; }
  .kwcard.cap-top { align-items: flex-start; padding-top: 6.5%; padding-bottom: 0; }
  .kwcard.cap-h-l { justify-content: flex-start; padding-left: 9%; }
  .kwcard.cap-h-r { justify-content: flex-end; padding-right: 9%; }
  .kw-stack { display: inline-flex; gap: 0.6em; background: rgba(10,10,14,0.62); border: 2px solid ${pack.palette.accent}; border-radius: 0.35em; padding: 0.3em 0.9em; transform: rotate(var(--tilt, 0deg)); box-shadow: 0 6px 24px rgba(0,0,0,0.45); }
  .kw-stack em { font-style: normal; color: ${pack.palette.accent}; font-weight: 800; font-size: ${Math.round(pack.type.scale.body * size.h * 1.15)}px; letter-spacing: 0.08em; text-shadow: 0 1px 6px rgba(0,0,0,0.6); }
</style>
</head>
<body>
<div data-composition-id="root" data-width="${size.w}" data-height="${size.h}" data-duration="${totalS}" data-fps="${project.meta.fps}">
${tracks.join('\n')}
</div>
<script>window.__captions = ${JSON.stringify(captions, null, 2)};</script>
<script src="motion/gsap.min.js"></script>
<script src="motion/motion-lib.js"></script>
<script>
window.__timelines = window.__timelines || {};
window.__timelines['root'] = window.gsap ? gsap.timeline({ paused: true }) : null;
${transitionsScript}
</script>
</body>
</html>
`;
  await atomicWriteText(path.join(hfDir, 'index.html'), indexHtml);
}

// V-CAP-001 排版感知：从场景 CSS 的 .subject 块读主语纵向位置，字幕落到对侧。
// 读不出来（无 .subject / calc 等无法静态判定）时保守落底部。
export function pickCaptionSide(sceneHtml: string): 'top' | 'bottom' {
  const block = sceneHtml.match(/\.subject\s*\{([^}]*)\}/)?.[1];
  if (block) {
    const top = block.match(/(?:^|[;\s])top:\s*([\d.]+)%/);
    if (top) return parseFloat(top[1]) > 55 ? 'top' : 'bottom';
    const bottom = block.match(/(?:^|[;\s])bottom:\s*([\d.]+)%/);
    if (bottom) return parseFloat(bottom[1]) < 30 ? 'top' : 'bottom';
  }
  return 'bottom';
}

// 关键词梗卡用：去标点空白、限长、限量（编剧重音词优先级已在 cue.keywords 保序）
export function cleanKeywords(keywords: string[], max: number): string[] {
  const out: string[] = [];
  for (const raw of keywords) {
    const k = raw.replace(/[，。！？、；：""''（）\s,.!?;:()\-]/g, '');
    if (k.length < 2 || k.length > 12) continue;
    if (!out.includes(k)) out.push(k);
    if (out.length >= max) break;
  }
  return out;
}

// full 模式：关键词在句内以 <em> 高亮（转义后按转义词切分，避免 XSS/标签注入）
export function highlightSentence(text: string, keywords: string[]): string {
  let html = escapeHtml(text);
  for (const kw of cleanKeywords(keywords, 3)) {
    const esc = escapeHtml(kw);
    if (html.includes(esc)) {
      html = html.replace(esc, `<em>${esc}</em>`);
    }
  }
  return html;
}

// 确定性抖动（同一 cue 永远同一结果）：梗卡的倾角与水平位置按 seed 哈希错位，去机械感
function hashJitter(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// 转场生成：剪切点处前一镜淡出、后一镜淡入（交叉溶解 0.5s）。
// dissolve/slide 均以交叉溶解落地；'none' 不产生动画。
function buildTransitionsScript(timeline: Timeline): string {
  const DISSOLVE_S = 0.5;
  const cuts: Array<{ out: string; inn: string; at: number }> = [];
  for (let i = 1; i < timeline.shots.length; i += 1) {
    const prev = timeline.shots[i - 1];
    const cur = timeline.shots[i];
    if (!prev || !cur) continue;
    if (cur.transition === 'none') continue;
    cuts.push({ out: prev.shotId, inn: cur.shotId, at: +(cur.startMs / 1000).toFixed(3) });
  }
  if (cuts.length === 0) return '';
  const lines = cuts.map(
    (c) => `  tl.to('#clip-${c.out}', { opacity: 0, duration: ${DISSOLVE_S / 2}, ease: 'power1.in' }, ${c.at - DISSOLVE_S / 2});
  tl.fromTo('#clip-${c.inn}', { opacity: 0 }, { opacity: 1, duration: ${DISSOLVE_S / 2}, ease: 'power1.out' }, ${c.at - DISSOLVE_S / 2});`,
  );
  return `(function () {
  var tl = window.__timelines && window.__timelines['root'];
  if (!tl) return;
${lines.join('\n')}
})();`;
}

function wrapComposition(sceneHtml: string, shotId: string, size: { w: number; h: number }, durationS: number): string {
  let out = sceneHtml;
  // HyperFrames 契约：GSAP 必须先于 motion-lib 加载；时间线注册到 window.__timelines[compositionId]
  if (!out.includes('gsap.min.js')) {
    out = out.replace('</head>', '<script src="../motion/gsap.min.js"></script>\n</head>');
  }
  if (!out.includes('data-composition-id')) {
    // 子合成根：独立包装元素承载 data-composition-id + data-width/height（官方 card.html 同款）。
    // 根元素不得靠 class 取样式（lint: subcomposition_root_styled_by_class——作用域改写后丢失），
    // 因此根用内联尺寸样式，原 .stage 作为内层元素照常被作用域规则命中。
    out = out.replace(
      /(<body[^>]*>)(\s*)(<[\s\S]*>)([\s\S]*)(<\/body>)/,
      (_m, body: string, ws: string, firstTag: string, rest: string, close: string) =>
        `${body}${ws}<div data-composition-id="scene-${shotId}" data-width="${size.w}" data-height="${size.h}" style="width:100%;height:100%">${firstTag}${rest}</div>${close}`,
    );
  }
  if (!out.includes('window.__timelines')) {
    out = out.replace(
      '</body>',
      `<script>window.__timelines = window.__timelines || {}; if (window.gsap && !window.__timelines['scene-${shotId}']) { window.__timelines['scene-${shotId}'] = gsap.timeline({ paused: true }); }</script>
</body>`,
    );
  }
  // 内联合并（swap）后多场景共存：动画入口必须先绑定本场景，否则全部动画错挂到根时间线
  out = out.replace(
    /DOMContentLoaded',\s*function\s*\(\)\s*\{/,
    `DOMContentLoaded', function () {
      window.__shotDurationS = ${durationS.toFixed(3)};
      MV.use('scene-${shotId}');`,
  );
  return out;
}

async function appendLog(
  store: ProjectStore,
  project: Project,
  name: string,
  text: string,
): Promise<void> {
  if (!text.trim()) return;
  const fs = await import('node:fs/promises');
  await ensureDir(path.join(store.projectDir(project.meta.id), 'logs'));
  await fs.appendFile(path.join(store.projectDir(project.meta.id), 'logs', name), `${text}\n`);
}

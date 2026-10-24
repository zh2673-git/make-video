import type { Project, Timeline } from '../schema.js';
import { SYNC_TOLERANCE_MS } from '../constants.js';
import { err, warn, type Issue } from './types.js';

export function validateTimelineSync(shots: Project['shots'], timeline: Timeline): Issue[] {
  const issues: Issue[] = [];
  let acc = 0;
  timeline.shots.forEach((t, i) => {
    if (Math.abs(t.startMs - acc) > SYNC_TOLERANCE_MS) {
      issues.push(
        err(
          'V-CMP-001',
          `第 ${i + 1} 镜 startMs=${t.startMs} 与前序时长累加 ${acc} 偏差超 ${SYNC_TOLERANCE_MS}ms`,
        ),
      );
    }
    const shot = shots.find((s) => s.id === t.shotId);
    if (shot?.voice && Math.abs(t.durationMs - shot.voice.durationMs) > SYNC_TOLERANCE_MS) {
      issues.push(
        err(
          'V-CMP-001',
          `镜头 ${t.shotId} 时长 ${t.durationMs} ≠ 旁白实测 ${shot.voice.durationMs}`,
        ),
      );
    }
    acc += t.durationMs;
  });
  return issues;
}

export function validateCutPoints(shots: Project['shots'], timeline: Timeline): Issue[] {
  const issues: Issue[] = [];
  for (let i = 1; i < timeline.shots.length; i += 1) {
    const prev = timeline.shots[i - 1];
    const cur = timeline.shots[i];
    if (!prev || !cur) continue;
    const prevShot = shots.find((s) => s.id === prev.shotId);
    if (prevShot && !/[，。！？；.!?;]$/.test(prevShot.narration.trim())) {
      issues.push(
        err('V-RHY-002', `剪切点 ${prev.shotId}→${cur.shotId} 落在句中（无句读边界，心理眨眼铁律）`),
      );
    }
  }
  return issues;
}

export function validateDensity(timeline: Timeline, minMs: number, maxMs: number): Issue[] {
  const issues: Issue[] = [];
  for (const t of timeline.shots) {
    if (t.durationMs < minMs - 300 || t.durationMs > maxMs + 1500) {
      issues.push(
        warn(
          'V-RHY-003',
          `镜头 ${t.shotId} 时长 ${t.durationMs}ms 偏离档位区间 [${minMs}, ${maxMs}]`,
        ),
      );
    }
  }
  return issues;
}

export function validateBreath(timeline: Timeline, every: number): Issue[] {
  const issues: Issue[] = [];
  if (timeline.shots.length >= every) {
    issues.push(warn('V-RHY-005', `共 ${timeline.shots.length} 镜，需检查呼吸镜间隔 ≤${every}`));
  }
  return issues;
}

export function validateContinuity(shots: Project['shots']): Issue[] {
  const issues: Issue[] = [];
  const byScene = new Map<string, Project['shots']>();
  for (const s of shots) {
    const scene = String(s.visual.params['scene'] ?? s.id);
    byScene.set(scene, [...(byScene.get(scene) ?? []), s]);
  }
  for (const [scene, list] of byScene) {
    if (list.length < 2) continue;
    const dirs = new Set(list.map((s) => String(s.visual.params['side'] ?? 'center')));
    if (dirs.size > 1 && !list.every((s) => s.gag)) {
      issues.push(
        err('V-CON-001', `场景「${scene}」跨镜主体方位不一致（轴线违规且未声明 gag）`),
      );
    }
  }
  return issues;
}

export function validateSfxLanding(timeline: Timeline): Issue[] {
  const issues: Issue[] = [];
  const cutSet = new Set(timeline.shots.map((t) => t.startMs));
  for (const sfx of timeline.sfx) {
    const near = [...cutSet].some((c) => Math.abs(c - sfx.atMs) <= SYNC_TOLERANCE_MS);
    if (!near) {
      issues.push(err('V-CMP-005', `音效 ${sfx.file} 落点 ${sfx.atMs} 未对齐任何剪切点`));
    }
  }
  return issues;
}

// V-RHY-001 剪切点候选集审计：每个剪切点必须落在 {句读停顿, 重音词, 景别变化点, 色温变化点}
export function validateCutCandidates(shots: Project['shots'], timeline: Timeline): Issue[] {
  const issues: Issue[] = [];
  for (let i = 1; i < timeline.shots.length; i += 1) {
    const prev = timeline.shots[i - 1]!;
    const cur = timeline.shots[i]!;
    const prevShot = shots.find((s) => s.id === prev.shotId);
    const curShot = shots.find((s) => s.id === cur.shotId);
    if (!prevShot || !curShot) continue;
    const atSentenceEnd = /[，。！？；.!?;]$/.test(prevShot.narration.trim());
    const atZoomChange = prevShot.zoom !== curShot.zoom;
    const atTempChange = prevShot.colorTemp !== undefined && prevShot.colorTemp !== curShot.colorTemp;
    const atEmphasis = (curShot.visual.params['emphasisLanding'] as boolean) === true;
    if (!atSentenceEnd && !atZoomChange && !atTempChange && !atEmphasis) {
      issues.push(
        err('V-RHY-001', `剪切点 ${prev.shotId}→${cur.shotId} 不在候选集（句读/重音词/景别/色温）`),
      );
    }
  }
  return issues;
}

// V-RHY-004 重音三联动：关键词落点 = 字幕高亮 + 主体 pulse + 相机微推（error）
export function validateEmphasisTriangle(
  shots: Project['shots'],
  timeline: Timeline,
  scenePulse: Map<string, boolean>,
): Issue[] {
  const issues: Issue[] = [];
  for (const t of timeline.shots) {
    const shot = shots.find((s) => s.id === t.shotId);
    if (!shot) continue;
    const hasHighlight = timeline.subtitles.some(
      (c) => c.shotId === t.shotId && c.keywords.length > 0,
    );
    const hasPulse = scenePulse.get(t.shotId) === true;
    const hasCameraPush = shot.camera !== 'none';
    if (!hasHighlight || !hasPulse || !hasCameraPush) {
      const missing = [
        !hasHighlight ? '字幕高亮' : '',
        !hasPulse ? '主体pulse' : '',
        !hasCameraPush ? '相机微推' : '',
      ]
        .filter(Boolean)
        .join('/');
      issues.push(err('V-RHY-004', `镜头 ${t.shotId} 重音三联动缺失：${missing}`));
    }
  }
  return issues;
}

// V-RHY-006 每 2-3s 一次视觉变化（doc 定级 warn）：节拍数须覆盖镜头时长
export function validateVisualChange(timeline: Timeline, sceneBeats: Map<string, number>): Issue[] {
  const issues: Issue[] = [];
  for (const t of timeline.shots) {
    const beats = sceneBeats.get(t.shotId) ?? 0;
    const required = Math.ceil(t.durationMs / 3000);
    if (beats < required) {
      issues.push(
        warn('V-RHY-006', `镜头 ${t.shotId} ${t.durationMs}ms 仅 ${beats} 个节拍（需 ≥${required}，每 2-3s 一次视觉变化）`),
      );
    }
  }
  return issues;
}

// V-SND-001 三层声音各司其职：混音计划必须含 vo/bgm/sfx 且 ducking 生效
export function validateMixPlan(
  plan: { tracks: Array<{ kind: string }>; duckRatio: number } | undefined,
): Issue[] {
  if (!plan) return [err('V-SND-001', '缺少混音计划工件（MixPlan）')];
  const kinds = new Set(plan.tracks.map((t) => t.kind));
  const missing = ['vo', 'bgm', 'sfx'].filter((k) => !kinds.has(k));
  if (missing.length > 0) {
    return [err('V-SND-001', `混音计划缺层：${missing.join('/')}`)];
  }
  if (plan.duckRatio <= 0 || plan.duckRatio >= 1) {
    return [err('V-SND-001', `ducking 比例非法: ${plan.duckRatio}`)];
  }
  return [];
}

import type { LlmClient } from '../infrastructure/llm-client.js';
import type {
  DirectorNote,
  MaterialDecision,
  Project,
  Recipe,
  Shot,
  StyleDecision,
  VisualKind,
} from '../core/schema.js';
import { V } from '../core/index.js';
import { mvError, ERR } from '../core/errors.js';
import type { ProjectStore } from '../infrastructure/project-store.js';
import type { StyleRegistry } from './style-registry.js';

export interface MaterialIndexItem {
  path: string;
  type: 'image' | 'video' | 'audio' | 'other';
  durationMs?: number;
  tags: string[];
}

export interface MaterialIndex {
  items: MaterialIndexItem[];
}

export async function writeDirectorNotes(
  project: Project,
  llm: LlmClient,
  recipe: Recipe,
): Promise<DirectorNote[]> {
  if (!project.script) throw mvError(ERR.SCHEMA, '缺少讲稿，无法写导演批注');
  const raw = await llm.generate({
    kind: 'director-notes',
    payload: {
      segments: project.script.segments,
      recipeNotes: recipe.directorialNotes,
      genre: recipe.id,
    },
  });
  const notes = (raw as unknown[]).map((n, i) => {
    const note = n as Partial<DirectorNote>;
    if (!note.segmentId || !note.visualIntent) {
      throw mvError(ERR.LLM_SCHEMA, `导演批注第 ${i + 1} 条缺字段`);
    }
    return {
      segmentId: note.segmentId,
      visualIntent: note.visualIntent,
      emotionGoal: note.emotionGoal ?? '稳定推进',
      referenceMood: note.referenceMood ?? '',
      counterpoint: note.counterpoint ?? 'metaphor',
    } satisfies DirectorNote;
  });
  project.directorNotes = notes;
  return notes;
}

export function decideMaterials(
  segments: Array<{ id: string; text: string }>,
  index: MaterialIndex,
  policy: Project['meta']['assetPolicy'],
): MaterialDecision[] {
  return segments.map((seg) => {
    const hit = matchMaterial(index, seg.text);
    if (hit) {
      return {
        kind: 'user-material' as VisualKind,
        source: hit.path,
        reason: `具体指称物命中用户素材（${hit.tags.join('/') || hit.type}）`,
      };
    }
    if (policy === 'code-first' || policy === 'auto') {
      return { kind: 'code-scene' as VisualKind, reason: '抽象概念/数据 → 代码绘制（默认）' };
    }
    if (policy === 'real-first') {
      return { kind: 'cloud' as VisualKind, reason: 'real-first 策略且库存无匹配 → 云端生成' };
    }
    return { kind: 'code-scene' as VisualKind, reason: 'ask 策略默认先画，确认表可改' };
  });
}

export function matchMaterial(index: MaterialIndex, text: string): MaterialIndexItem | null {
  const t = text.toLowerCase();
  let best: { item: MaterialIndexItem; score: number } | null = null;
  for (const item of index.items) {
    if (item.type === 'audio') continue;
    const score = item.tags.reduce((acc, tag) => (t.includes(tag.toLowerCase()) ? acc + 2 : acc), 0);
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }
  return best?.item ?? null;
}

export function decideStyle(
  registry: StyleRegistry,
  recipe: Recipe,
  userStyleId?: string,
): StyleDecision {
  if (userStyleId) {
    const pack = registry.getStyle(userStyleId);
    return {
      id: pack.id,
      source: 'user-specified',
      rationale: `用户指定风格 ${pack.userFacing.name}（${pack.userFacing.vibe}）`,
      lineage: {},
      overrides: {},
    };
  }
  const recommended = recipe.style.recommended.find((id) => {
    try {
      registry.getStyle(id);
      return true;
    } catch {
      return false;
    }
  });
  if (recommended) {
    const pack = registry.getStyle(recommended);
    return {
      id: pack.id,
      source: 'recipe-recommended',
      rationale: `${recipe.name}配方推荐：${recipe.style.rationale}`,
      lineage: {},
      overrides: {},
    };
  }
  const fallback = registry.listStyles()[0];
  if (!fallback) throw mvError(ERR.STYLE_UNKNOWN, '风格库为空');
  return {
    id: fallback.id,
    source: 'agent-chosen',
    rationale: `配方推荐不可用，按分类轴选择最近包 ${fallback.id}`,
    lineage: { base: fallback.id },
    overrides: {},
  };
}

export async function storyboard(
  store: ProjectStore,
  project: Project,
  llm: LlmClient,
  recipe: Recipe,
  registry: StyleRegistry,
  materialIndex: MaterialIndex,
  userStyleId?: string,
): Promise<Shot[]> {
  if (!project.script) throw mvError(ERR.SCHEMA, '缺少讲稿，无法分镜');
  if (project.directorNotes.length === 0) {
    await writeDirectorNotes(project, llm, recipe);
  }
  const styleDecision = decideStyle(registry, recipe, userStyleId);
  const stylePack = registry.resolveStyle(styleDecision);
  const decisions = decideMaterials(
    project.script.segments.map((s) => ({ id: s.id, text: s.text })),
    materialIndex,
    project.meta.assetPolicy,
  );
  const raw = await llm.generate({
    kind: 'storyboard',
    payload: {
      segments: project.script.segments,
      directorNotes: project.directorNotes,
      templates: recipe.templates,
      shotScaleBias: stylePack.shotScaleBias,
      materialDecisions: decisions,
    },
  });
  const shots = (raw as unknown[]).map((s, i) => {
    const shot = s as Partial<Shot>;
    if (!shot.narration || !shot.visual) {
      throw mvError(ERR.LLM_SCHEMA, `分镜第 ${i + 1} 条缺字段`);
    }
    // V-COL-002 色彩脚本：按 cool→neutral→warm 循环分配色温（三幕冷暖节奏）
    const colorTemp = (['cool', 'neutral', 'warm'] as const)[i % 3];
    const visual = { ...shot.visual, params: { ...(shot.visual.params ?? {}) } };
    // canvas 程序化场景：kicker = 该段 beat 的名称（观众可读的章节标签）
    if ((visual.template ?? '').startsWith('canvas:')) {
      const seg = project.script?.segments.find((x) => x.id === (shot.segmentId ?? project.script?.segments[i]?.id));
      const beatName = recipe.beats.find((b) => b.id === seg?.beat)?.name;
      visual.params['kicker'] = beatName ?? visual.params['kicker'] ?? '';
    }
    return {
      id: `s${String(i + 1).padStart(2, '0')}`,
      segmentId: shot.segmentId ?? project.script?.segments[i]?.id ?? `seg-${i + 1}`,
      narration: shot.narration,
      visual,
      zoom: shot.zoom ?? 'MS',
      // V-CAM-006：静态画面必须过相机运动——分镜层默认缓推，禁止 none 蒙混
      camera: shot.camera && shot.camera !== 'none' ? shot.camera : 'push-in',
      motivation: shot.motivation ?? '',
      counterpoint: shot.counterpoint ?? 'metaphor',
      gag: shot.counterpoint === 'parody' ? true : false,
      colorTemp,
      transition: stylePack.transitions[i % stylePack.transitions.length] ?? 'dissolve',
      state: 'pending' as const,
    } satisfies Shot;
  });
  project.shots = shots;
  project.style = styleDecision;
  project.materialDecisions = Object.fromEntries(
    shots.map((s, i) => [s.id, decisions[i] ?? { kind: 'code-scene', reason: '默认' }]),
  );
  project.stage = 'storyboard';
  const issues = V.validateStoryboard(project);
  if (V.hasError(issues)) {
    throw mvError(ERR.STORYBOARD_RULE, `分镜校验失败:\n${V.formatIssues(issues)}`);
  }
  await store.save(project);
  return shots;
}

export function buildConfirmation(project: Project): string {
  const lines: string[] = [];
  lines.push('=== 分镜前确认表（素材决策 + 风格决策 + 导演批注摘要）===');
  if (project.style) {
    lines.push(
      `风格：${project.style.id}（${project.style.source}）—— ${project.style.rationale}`,
    );
  }
  for (const shot of project.shots) {
    const dec = project.materialDecisions[shot.id];
    const note = project.directorNotes.find((n) => n.segmentId === shot.segmentId);
    lines.push(
      `  ${shot.id} [${shot.zoom}/${shot.camera}] ${dec?.kind ?? 'code-scene'}：${dec?.reason ?? ''}`,
    );
    lines.push(`      对位=${shot.counterpoint} 批注：${note?.visualIntent ?? '-'}`);
  }
  lines.push('确认后进入采购阶段；修改请直接编辑 project.json 或重跑 storyboard。');
  return lines.join('\n');
}

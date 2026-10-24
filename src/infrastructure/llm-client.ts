import { mvError, ERR } from '../core/errors.js';
import { LLM_RETRY_MAX } from '../core/constants.js';
import { pickCanvasProgram, bestTemplate, pickTemplateBySemantics } from '../domain/scene-semantics.js';

export type LlmTaskKind = 'script' | 'director-notes' | 'storyboard' | 'scene' | 'style-analyze';

export interface LlmTask {
  kind: LlmTaskKind;
  payload: Record<string, unknown>;
}

export interface LlmClient {
  readonly name: string;
  generate(task: LlmTask): Promise<unknown>;
}

export class ApiLlmClient implements LlmClient {
  readonly name = 'api';

  constructor(
    private readonly opts: {
      baseUrl: string;
      apiKey: string;
      model: string;
    },
  ) {}

  async generate(task: LlmTask): Promise<unknown> {
    const prompt = buildPrompt(task);
    const res = await fetch(`${this.opts.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.opts.apiKey}`,
      },
      body: JSON.stringify({
        model: this.opts.model,
        messages: prompt,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(`LLM API ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content ?? '';
    try {
      return JSON.parse(content);
    } catch {
      throw mvError(ERR.LLM_SCHEMA, 'LLM 返回非 JSON');
    }
  }
}

function buildPrompt(task: LlmTask): Array<{ role: string; content: string }> {
  const sys =
    task.kind === 'scene'
      ? SCENE_SYSTEM_PROMPT
      : `你是视频编译器的${task.kind}部门引擎。只输出合法 JSON，遵守给定 schema。`;
  return [
    { role: 'system', content: sys },
    { role: 'user', content: JSON.stringify(task.payload) },
  ];
}

/** 场景生成系统提示词（docs/04 美术摄影部）：按剧本语义拍，不吃大锅饭 */
const SCENE_SYSTEM_PROMPT = `你是视频编译器的美术摄影部场景画师。根据给定镜头的旁白语义与导演视觉意图，生成一个 HyperFrames 单场景 HTML。只输出合法 JSON：{"html": "<!doctype html>..."}。

硬性契约（校验器逐条把关，违反即打回）：
1. 完整骨架：<body data-scene-id="给定的sceneId"> 内有 .stage 容器；末尾 <script src="../motion/motion-lib.js"></script> 与一个 document.addEventListener('DOMContentLoaded', ...) 注册动画。
2. 画面必须表达本镜旁白的具体含义（人/物/数字/因果/过程），禁止通用装饰凑数，禁止出现旁白原文或导演指令文本。
3. 动画只用给定白名单原语 MV.enter/idle/to/from/fromTo/emphasis/performance/camera，缓动只用给定的 easing，时长只允许 200-400/400-800/300-600/1200-2000ms。
4. 主语唯一（.subject 或 .title 等恰好 1 个），辅助元素 opacity ≤ 0.7，同屏运动元素 ≤ 3、位移方向 ≤ 2。
5. 禁止属性 data-start/data-duration/data-track-index（时序只归剪辑部）；禁止 repeat:-1；位移不得 ease:'none' 急停。
6. 颜色只用给定 token（{{PRIMARY}} 等替换后的真实值），字体只用给定 fontFamily，字号用给定 px。
7. 若给了相机与景别，用 MV.camera('.stage', { move, zoom }) 表达；静态画面必须有相机运动。`;

export interface LlmRetryClient extends LlmClient {
  readonly inner: LlmClient;
}

export class RetryingLlmClient implements LlmClient {
  readonly name: string;

  constructor(readonly inner: LlmClient) {
    this.name = `retry(${inner.name})`;
  }

  async generate(task: LlmTask): Promise<unknown> {
    let lastErr: unknown = null;
    for (let i = 1; i <= LLM_RETRY_MAX; i += 1) {
      try {
        return await this.inner.generate(task);
      } catch (e) {
        lastErr = e;
      }
    }
    throw mvError(
      ERR.LLM_RETRY_EXCEEDED,
      `LLM 任务 ${task.kind} 重试 ${LLM_RETRY_MAX} 次仍失败: ${(lastErr as Error).message}`,
    );
  }
}

export function createLlmClientFromEnv(): LlmClient {
  const baseUrl = process.env['LLM_BASE_URL'];
  const apiKey = process.env['LLM_API_KEY'];
  const model = process.env['LLM_MODEL'] ?? 'gpt-4o-mini';
  if (baseUrl && apiKey) {
    return new RetryingLlmClient(new ApiLlmClient({ baseUrl, apiKey, model }));
  }
  return new RetryingLlmClient(new TemplateLlmClient());
}

export class TemplateLlmClient implements LlmClient {
  readonly name = 'template';

  async generate(task: LlmTask): Promise<unknown> {
    switch (task.kind) {
      case 'script':
        return templateScript(task.payload);
      case 'director-notes':
        return templateDirectorNotes(task.payload);
      case 'storyboard':
        return templateStoryboard(task.payload);
      case 'scene':
        return { html: '', note: 'template-mode: 由 scene-forge 本地模板生成' };
      case 'style-analyze':
        return templateStyleAnalyze(task.payload);
      default:
        throw mvError(ERR.LLM_SCHEMA, `template 引擎不支持的任务: ${task.kind}`);
    }
  }
}

interface ScriptPayload {
  topic: string;
  beats: Array<{ id: string; name: string; function?: string; note?: string }>;
  wordsPerMin: number;
  targetSegments: number;
}

function templateScript(payload: Record<string, unknown>): unknown {
  const p = payload as unknown as ScriptPayload;
  const beats = p.beats?.length ? p.beats : [{ id: 'b1', name: '展开', function: 'inform' }];
  const target = Math.max(beats.length, p.targetSegments ?? beats.length);
  // 密度优先（V-RHY-003）：目标段数多于 beats 时循环填充，beat 覆盖率仍由前几段保证
  const segments = Array.from({ length: target }, (_, i) => {
    const b = beats[i % beats.length]!;
    return {
      id: `seg-${i + 1}`,
      text: templateSegmentText(p.topic, i),
      function: (b.function ?? 'inform') as string,
      beat: b.id,
      mood: (['curious', 'neutral', 'tense', 'awe'] as const)[i % 4],
    };
  });
  const fullText = segments.map((s) => s.text).join('');
  return { fullText, segments };
}

function templateSegmentText(topic: string, i: number): string {
  const templates = [
    `${topic}，远比表面看起来更有意思。`,
    `先从一个基本事实说起：它的核心机制可以拆成几步。`,
    `最反直觉的一点来了：关键变量常常被忽略。`,
    `把镜头拉近，细节开始显形。`,
    `再退一步看，结构就完整了。`,
    `这里有一个容易被带过的转折。`,
    `把上面连起来，脉络浮出水面。`,
    `回到最初的问题，答案已经在眼前。`,
  ];
  return templates[i % templates.length]!;
}

interface NotesPayload {
  segments: Array<{ id: string; text: string; beat?: string }>;
  recipeNotes: Array<{ beatId: string; visualIntent: string; emotionGoal: string; counterpoint: string }>;
}

function templateDirectorNotes(payload: Record<string, unknown>): unknown {
  const p = payload as unknown as NotesPayload;
  const byBeat = new Map(p.recipeNotes.map((n) => [n.beatId, n]));
  return p.segments.map((s, i) => {
    const tpl = s.beat ? byBeat.get(s.beat) : undefined;
    return {
      segmentId: s.id,
      visualIntent: tpl?.visualIntent ?? `为第 ${i + 1} 段配图：与「${s.text.slice(0, 12)}…」构成对位`,
      emotionGoal: tpl?.emotionGoal ?? '稳定推进',
      referenceMood: tpl?.visualIntent?.slice(0, 20) ?? '',
      counterpoint: tpl?.counterpoint ?? (i === 0 ? 'emotion' : 'metaphor'),
    };
  });
}

interface StoryboardPayload {
  segments: Array<{ id: string; text: string; beat?: string }>;
  directorNotes: Array<{ segmentId: string; visualIntent: string; counterpoint: string }>;
  templates: string[];
  shotScaleBias: string[];
  materialDecisions: Array<{ segmentId: string; kind: string; source?: string; reason: string }>;
}

function templateStoryboard(payload: Record<string, unknown>): unknown {
  const p = payload as unknown as StoryboardPayload;
  const noteBy = new Map(p.directorNotes.map((n) => [n.segmentId, n]));
  const decBy = new Map(p.materialDecisions.map((d) => [d.segmentId, d]));
  const zooms = p.shotScaleBias.length ? p.shotScaleBias : ['MS', 'CU'];
  // 模板按旁白语义分配（禁止索引轮转——"凑镜头数"的根源）：
  // canvas 程序按内容主题选（s01 引力钩子…s08 终幕），MV 模板按叙事形式选（流程/对比/数据/氛围）
  const canvasPrograms = p.templates
    .filter((t) => t.startsWith('canvas:'))
    .map((t) => t.slice('canvas:'.length));
  const mvTemplates = p.templates.filter((t) => !t.startsWith('canvas:'));
  const recentUsed: string[] = [];
  return p.segments.map((seg, i) => {
    const note = noteBy.get(seg.id);
    const dec = decBy.get(seg.id);
    let template: string;
    if (canvasPrograms.length > 0) {
      // 混合评分：强语义 MV 形式（数据/对比 ≥2 线索命中）压过程序化背景，
      // 让数字段出真图表、对比段出真对峙卡——异质画面形式打破"暗场小元素"的同质感
      const mv = mvTemplates.length > 0 ? bestTemplate(seg.text, mvTemplates) : null;
      if (mv && mv.score >= 2) {
        template = mv.template;
      } else {
        const pick = pickCanvasProgram(seg.text, canvasPrograms, recentUsed);
        recentUsed.push(pick.program);
        template = `canvas:${pick.program}`;
      }
    } else {
      template = pickTemplateBySemantics(seg.text, mvTemplates.length ? mvTemplates : ['typography']);
    }
    return {
      segmentId: seg.id,
      narration: seg.text,
      visual: {
        kind: dec?.kind ?? 'code-scene',
        prompt: note?.visualIntent ?? `示意图：${seg.text.slice(0, 16)}`,
        template,
        params: { scene: `scene-${i + 1}`, side: 'center' },
        ...(dec?.source ? { source: dec.source } : {}),
      },
      zoom: zooms[i % zooms.length] ?? 'MS',
      camera: i === 0 ? 'push-in' : 'none',
      motivation: i === 0 ? '定场揭示' : '静态呈现',
      counterpoint: note?.counterpoint ?? 'metaphor',
    };
  });
}

interface StyleAnalyzePayload {
  description: string;
}

function templateStyleAnalyze(payload: Record<string, unknown>): unknown {
  const p = payload as unknown as StyleAnalyzePayload;
  const d = p.description;
  const pick = (words: string[], fallback: string): string =>
    words.find((w) => d.includes(w)) ?? fallback;
  return {
    anatomy: {
      script: pick(['三翻四抖', '包袱', '幽默'], '常规叙事结构'),
      directing: pick(['戏仿', '反差', '荒诞'], '常规对位'),
      art: pick(['霓虹', '鲜艳', '暗调', '黑白'], '中性色板'),
      camera: pick(['仰拍', '低角度', '慢动作', '推镜'], '静态为主'),
      performance: pick(['夸张', '定格', '表情'], '常规动效'),
      sourcing: '按内容类型决策',
      sound: pick(['急停', '音效', '怀旧'], '常规三层声音'),
      editing: pick(['卡点', '硬切', '快节奏'], '常规节奏'),
    },
    suggestedBase: d.includes('暗') || d.includes('黑') ? 'noir-contrast' : 'keynote-minimal',
  };
}

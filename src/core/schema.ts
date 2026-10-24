import { z } from 'zod';
import {
  ANATOMY_KEYS,
  ASPECTS,
  DURATION_TIERS,
  GENRES,
  SCHEMA_VERSION,
} from './constants.js';

export const ShotStateSchema = z.enum([
  'pending',
  'sourcing',
  'sourced',
  'voicing',
  'voiced',
  'ready',
  'failed',
]);
export type ShotState = z.infer<typeof ShotStateSchema>;

export const StageSchema = z.enum([
  'init',
  'script',
  'storyboard',
  'sourcing',
  'voice',
  'compose',
  'render',
  'done',
]);
export type Stage = z.infer<typeof StageSchema>;

export const VisualKindSchema = z.enum(['code-scene', 'user-material', 'imported', 'cloud']);
export type VisualKind = z.infer<typeof VisualKindSchema>;

export const CounterpointSchema = z.enum(['metaphor', 'evidence', 'emotion', 'parody']);
export type Counterpoint = z.infer<typeof CounterpointSchema>;

export const SegmentFunctionSchema = z.enum(['advance', 'inform', 'emotion']);

export const ScriptSegmentSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  function: SegmentFunctionSchema,
  beat: z.string().optional(),
  // docs/03：表演/剪辑联动字段（情绪基调 / 重音词 / 停顿标记 ms）
  mood: z.enum(['neutral', 'curious', 'tense', 'awe', 'warm', 'urgent']).optional(),
  emphasis: z.array(z.string()).optional(),
  pausesMs: z.array(z.number().int().nonnegative()).optional(),
});
export type ScriptSegment = z.infer<typeof ScriptSegmentSchema>;

export const ScriptSchema = z.object({
  fullText: z.string().min(1),
  segments: z.array(ScriptSegmentSchema).min(1),
});
export type Script = z.infer<typeof ScriptSchema>;

export const ZoomSchema = z.enum(['ELS', 'LS', 'MLS', 'MS', 'MCU', 'CU', 'ECU']);

export const VisualSpecSchema = z.object({
  kind: VisualKindSchema,
  prompt: z.string().default(''),
  template: z.string().optional(),
  source: z.string().optional(),
  params: z.record(z.unknown()).default({}),
});
export type VisualSpec = z.infer<typeof VisualSpecSchema>;

export const AssetRefSchema = z.object({
  kind: VisualKindSchema,
  path: z.string(),
  durationMs: z.number().nonnegative().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  meta: z.record(z.unknown()).default({}),
});
export type AssetRef = z.infer<typeof AssetRefSchema>;

export const VoiceRefSchema = z.object({
  file: z.string(),
  durationMs: z.number().nonnegative(),
  voice: z.string().default('default'),
  rate: z.number().default(1),
  source: z.enum(['tts', 'recording']),
  estimated: z.boolean().default(false),
});
export type VoiceRef = z.infer<typeof VoiceRefSchema>;

export const DirectorNoteSchema = z.object({
  segmentId: z.string(),
  visualIntent: z.string(),
  emotionGoal: z.string(),
  referenceMood: z.string().default(''),
  counterpoint: CounterpointSchema,
});
export type DirectorNote = z.infer<typeof DirectorNoteSchema>;

export const ShotSchema = z.object({
  id: z.string(),
  segmentId: z.string(),
  narration: z.string().min(1),
  visual: VisualSpecSchema,
  zoom: ZoomSchema,
  camera: z.string().default('none'),
  motivation: z.string().default(''),
  counterpoint: CounterpointSchema,
  gag: z.boolean().default(false),
  // V-COL-002 色彩脚本：每镜色温标注（cool/neutral/warm）
  colorTemp: z.enum(['cool', 'neutral', 'warm']).optional(),
  transition: z.string().default('dissolve'),
  state: ShotStateSchema.default('pending'),
  stage: z.string().optional(),
  asset: AssetRefSchema.optional(),
  voice: VoiceRefSchema.optional(),
  failReason: z.string().optional(),
});
export type Shot = z.infer<typeof ShotSchema>;

export const MaterialDecisionSchema = z.object({
  kind: VisualKindSchema,
  source: z.string().optional(),
  reason: z.string(),
});
export type MaterialDecision = z.infer<typeof MaterialDecisionSchema>;

export const StyleDecisionSchema = z.object({
  id: z.string(),
  source: z.enum(['recipe-recommended', 'agent-chosen', 'user-specified']),
  rationale: z.string().min(1),
  lineage: z.record(z.unknown()).default({}),
  overrides: z.record(z.unknown()).default({}),
});
export type StyleDecision = z.infer<typeof StyleDecisionSchema>;

export const ProjectMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  aspect: z.enum(ASPECTS).default('16:9'),
  durationTier: z.enum(DURATION_TIERS).default('0-5'),
  fps: z.number().default(30),
  genre: z.enum(GENRES).default('science-explainer'),
  assetPolicy: z.enum(['auto', 'ask', 'code-first', 'real-first']).default('auto'),
});
export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;

export const SubtitleCueSchema = z.object({
  shotId: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  text: z.string(),
  keywords: z.array(z.string()).default([]),
  // 编剧声明的重音词（命中本句者）：梗卡字幕的可信来源；keywords 则混有机械切分词（仅 srt/兜底）
  emphasis: z.array(z.string()).default([]),
});
export type SubtitleCue = z.infer<typeof SubtitleCueSchema>;

// 字幕策略（docs/07）：full=整句条（关键词内联高亮）；keyword=关键词梗卡（感知画面排版避让主体）；
// off=不出画面字幕（srt 工件仍全量导出）。风格包声明默认，project 顶层可覆写。
export const SubtitlePolicySchema = z.enum(['full', 'keyword', 'off']);
export type SubtitlePolicy = z.infer<typeof SubtitlePolicySchema>;

export const TimelineSchema = z.object({
  shots: z.array(
    z.object({
      shotId: z.string(),
      startMs: z.number(),
      durationMs: z.number(),
      transition: z.string(),
    }),
  ),
  subtitles: z.array(SubtitleCueSchema).default([]),
  bgm: z.string().optional(),
  sfx: z.array(z.object({ file: z.string(), atMs: z.number(), kind: z.string() })).default([]),
});
export type Timeline = z.infer<typeof TimelineSchema>;

export const ContinuityReportSchema = z.object({
  generatedAt: z.string(),
  items: z.array(
    z.object({
      rule: z.string(),
      status: z.enum(['ok', 'declared-gag', 'violation']),
      detail: z.string(),
    }),
  ),
});
export type ContinuityReport = z.infer<typeof ContinuityReportSchema>;

// docs/07 混音计划（A9）：三层声音 + ducking 包络 + 音效落点
export const MixPlanSchema = z.object({
  generatedAt: z.string(),
  tracks: z.array(
    z.object({
      kind: z.enum(['vo', 'bgm', 'sfx']),
      file: z.string(),
      gainDb: z.number().default(0),
    }),
  ),
  duckRatio: z.number().min(0).max(1),
  sfxCues: z.array(
    z.object({
      file: z.string(),
      atMs: z.number().int().nonnegative(),
      kind: z.enum(['whoosh', 'hit', 'riser']),
    }),
  ),
});
export type MixPlan = z.infer<typeof MixPlanSchema>;

export const ProjectSchema = z.object({
  schemaVersion: z.number().default(SCHEMA_VERSION),
  meta: ProjectMetaSchema,
  stage: StageSchema.default('init'),
  script: ScriptSchema.optional(),
  directorNotes: z.array(DirectorNoteSchema).default([]),
  shots: z.array(ShotSchema).default([]),
  materialDecisions: z.record(MaterialDecisionSchema).default({}),
  style: StyleDecisionSchema.optional(),
  timeline: TimelineSchema.optional(),
  continuity: ContinuityReportSchema.optional(),
  mixPlan: MixPlanSchema.optional(),
  subtitlePolicy: SubtitlePolicySchema.optional(),
  confirmed: z.boolean().default(false),
});
export type Project = z.infer<typeof ProjectSchema>;

export const StylePackSchema = z.object({
  id: z.string(),
  name: z.string(),
  grade: z.enum(['A', 'B', 'C']),
  status: z.enum(['draft', 'candidate', 'registered']).default('registered'),
  userFacing: z.object({
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    vibe: z.string(),
    bestFor: z.array(z.string()).default([]),
  }),
  anatomy: z.record(z.enum(ANATOMY_KEYS), z.string()),
  palette: z.object({
    primary: z.string(),
    accent: z.string(),
    neutral: z.array(z.string()).length(5),
    colorArc: z.string(),
  }),
  type: z.object({
    families: z.array(z.string()).max(2),
    scale: z.object({ title: z.number(), body: z.number() }),
    tracking: z.record(z.number()).default({}),
  }),
  layout: z.object({
    density: z.number().min(0).max(1),
    maxElementsPerShot: z.number().int().min(1).max(5),
    whitespace: z.number().min(0).max(1),
  }),
  motion: z.object({
    easing: z.string(),
    intensity: z.number().min(0).max(1),
    staggerMs: z.number(),
    spring: z.object({ stiffness: z.number(), damping: z.number() }),
  }),
  pacing: z.object({
    curve: z.string(),
    shotLenMs: z.tuple([z.number(), z.number()]),
    breathEvery: z.number().int().positive(),
  }),
  effects: z.record(z.union([z.number(), z.boolean()])),
  transitions: z.array(z.string()).min(1),
  shotScaleBias: z.array(ZoomSchema).min(1),
  provenance: z.object({
    source: z.enum(['absorbed', 'manual']),
    from: z.string(),
    version: z.string(),
    absorbedAt: z.string().default(''),
    review: z.string().default(''),
  }),
  references: z.string().default(''),
  antiPatterns: z.string().default(''),
  subtitlePolicy: SubtitlePolicySchema.default('full'),
});
export type StylePack = z.infer<typeof StylePackSchema>;

export const RecipeSchema = z.object({
  id: z.enum(GENRES),
  name: z.string(),
  beats: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        note: z.string().default(''),
        function: SegmentFunctionSchema.optional(),
      }),
    )
    .min(1),
  directorialNotes: z
    .array(
      z.object({
        beatId: z.string(),
        visualIntent: z.string(),
        emotionGoal: z.string(),
        counterpoint: CounterpointSchema.default('emotion'),
      }),
    )
    .default([]),
  style: z.object({
    recommended: z.array(z.string()).min(1),
    rationale: z.string(),
  }),
  pacing: z.object({
    curve: z.string(),
    shotLenMs: z.tuple([z.number(), z.number()]),
    breathEvery: z.number().int().positive(),
    comedyBeat: z.boolean().default(false),
  }),
  density: z.enum(['low', 'medium', 'high']),
  subtitles: z.string(),
  headTail: z.object({ head: z.string(), tail: z.string() }),
  sound: z.object({ bgmArc: z.string(), sfxSet: z.array(z.string()).default([]) }),
  templates: z.array(z.string()).min(1),
  durationTiers: z.record(
    z.object({
      wordsPerMin: z.number(),
      structure: z.string(),
      chapters: z.number().int().nonnegative(),
    }),
  ),
});
export type Recipe = z.infer<typeof RecipeSchema>;

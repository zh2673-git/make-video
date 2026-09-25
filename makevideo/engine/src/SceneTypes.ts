// [时空层级：数据规范（规则）] SceneTypes.ts —— 分镜契约（与 makevideo/core/schema.py 对偶）
export type Caption = {from: number; to: number; text: string};

export type SceneType =
  | 'title' | 'ending'
  | 'bullets' | 'flow' | 'stat'
  | 'table' | 'panorama'
  | 'quote' | 'compare' | 'timeline' | 'chart' | 'code' | 'image';

export type Scene = {
  id: string;
  /** 规则模式 = 13 型版式名；创意模式 = 场景名（对应工程 scenes/<名>.tsx，经 custom.gen 注册表挂载）。 */
  type: string;
  title: string;
  narration: string;
  frames: number;
  audio: string;
  captions: Caption[];
  subtitle?: string[];
  bullets?: string[];
  header?: string[];
  rows?: string[][];
  pairs?: string[][];
  highlight?: string;
  cellColors?: Record<string, string>;
  note?: string;
  quote?: string;
  attribution?: string;
  lang?: string;
  image?: string;
  imageNote?: string;
  leftTitle?: string;
  rightTitle?: string;
  icons?: string[];      // bullets/stat 条目图标名（按序对应，缺项回退序号）
  stats?: string[][];    // stat 版式：[值, 标签, 图标?] 行
};

/** 工程 meta（meta.gen.json），全部可选。 */
export type ProjectMeta = {
  unit?: string;
  author?: string;
  compliance?: string;
  footer?: string;
};

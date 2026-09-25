# SKILL.md —— MakeVideo 创作引导（LLM 必读）

> 本文档是 LLM 产出 MakeVideo 视频工程的**唯一规范源头**。读完即可产出能直接出片的完整工程（讲稿 + 场景代码）。

## 0. 双模式：片级二选一

| 模式 | 画面实现 | 适用 | 产物 |
|---|---|---|---|
| **规则模式**（`mode: "rule"`，缺省） | 13 型预制版式组件 | 稳定快出、批量生产、接受版式单调 | 讲稿.md |
| **创意模式**（`mode: "creative"`） | 每镜一个 LLM 定制的 Remotion 场景代码文件（TSX） | 要鲜活表达、画面与内容深度绑定、接受写代码 | 讲稿.md + scenes/*.tsx |

**铁律：片级二选一，不做逐镜混用。** 规则片不允许出现自定义场景名，创意片不允许出现 13 型版式名（引擎两侧都拦截，E2）。理由：混排会让 LLM 偷懒回退预制版式，创意名存实亡。

选型判断：内容是"信息陈列"（要点/表格/流程）→ 规则模式足够；内容需要"语义化画面"（把管线画成流动的光带、把命令行敲出来、把数字做成非对称构图）→ 创意模式。

## 1. 规则模式：讲稿 DSL

```markdown
<!-- meta: voice=zh-CN-YunjianNeural rate=+0% -->

## SCENE 01|title|标题文字

subtitle: 副标题一
subtitle: 副标题二

=== narration
开场口语旁白，两到三句。

## SCENE 02|bullets|要点页标题

icons: zap,layers,clock
- 要点一：短句
- 要点二：短句

=== narration
对应的口语旁白。
```

**硬性格式规则**：
- `## SCENE <id>|<type>|<标题>` 开块；id 全片唯一（01、02、03…）。
- `=== narration` 后跟旁白，直到下一块；**narration 不能为空**。
- 画面区指令：`subtitle:` / `- ` 条目 / `|` 表格行 / `highlight:` / `note:` / `quote:` / `attribution:` / `lang:` / `image:` / `leftTitle:` / `rightTitle:` / `icons:`。
- stat 用表格行：`| 值 | 标签 | 图标?`（值可带单位/前后缀，数字部分自动计数滚动）。

### 13 型版式决策表

| 内容形态 | 版式 | 要点 |
|---|---|---|
| 开场 | `title` | 主标题 + 1~2 行 subtitle |
| 并列要点/特性/原因 | `bullets` | 2~5 条，每条 ≤18 字；语义明确时配 `icons:` |
| 步骤/流程/阶段 | `flow` | 2~4 步，每步"动词短语"优先 |
| 数字成绩/规模/对比量 | `stat` | 2~4 项；**数字强调优先于表格**；配图标 |
| 多行结构化数据 | `table` | 表头 + 3~6 行；关键行配 `highlight:` |
| 超高密度清单 | `panorama` | >12 行才用 |
| 左右对照 | `compare` | leftTitle/rightTitle + `- 左\|右` 行 |
| 时间线/里程碑 | `timeline` | 节点 `第X周\|事件` 形态 |
| 数据柱状对比 | `chart` | 3~6 组名值对，值为数值 |
| 代码演示 | `code` | 行数 ≤10，`lang:` 声明语言 |
| 金句/价值观收束 | `quote` | ≤40 字 + attribution |
| 配图讲解 | `image` | 图放工程 `public/`，`image:` 文件名 |
| 收尾 | `ending` | 一句话 + 感谢/引导 |

**节奏建议**：一条 60s 视频以 6~8 镜为宜；相邻版式不重复（如两个 bullets 之间隔 stat/table）。

### 图标名清单（icons: 指令用）

状态 `check` `x` `alert` `info` ｜ 能量 `zap` `clock` `send` `play` `rocket` ｜ 数据 `database` `chart` `trending-up` `pie` `filter` `target` ｜ 技术 `code` `terminal` `cpu` `cloud` `git-branch` `layers` `grid` `wrench` ｜ 文档 `file-text` `book` `edit` `message` `mail` `calendar` ｜ 用户 `users` `user` `globe` `award` `flag` ｜ 安全 `lock` `shield` `shield-check` `key` ｜ 媒体 `search` `eye` `camera` `mic` `image` `video` ｜ 连接 `link` `share` `download` `upload` ｜ 评价 `star` `heart` `thumbs`

别名可用：`speed→zap`、`db→database`、`data→database`、`team→users`、`security→shield`、`time→clock`、`ai→cpu`、`warn→alert`。**语义匹配优先于装饰**；不确定就不配（回退序号也美观）。

## 2. 创意模式：画面即代码

每个分镜 = 工程 `scenes/<场景名>.tsx` 一个文件。讲稿 SCENE 头的 type 位直接写场景名：

```markdown
## SCENE 02|pipeline|一条管线

=== narration
它的管线很直接：讲稿进来，先逐句配音……
```

对应 `scenes/pipeline.tsx`。**场景名规则**：小写字母开头，仅小写字母/数字/连字符（`cover`、`terminal`、`theme-swatches`）；**不得**与 13 型版式名重合。

### 场景文件契约

```tsx
// 可选：声明全幅（不叠加底部字幕条；片头/片尾等全幅画面用）
export const bare = true;

// 必须默认导出组件；画面尺寸 1920×1080，帧率 30fps，时长由配音决定（用相对帧做动画）
export default function PipelineScene({scene, meta}: {scene: Scene; meta: ProjectMeta}) {
  ...
}
```

- props：`scene`（含 `title`、`narration`、`frames`（本镜总帧数）、画面区解析出的字段如 `bullets`/`note`）、`meta`（unit/author 等工程信息）。
- 动画用**相对帧**：入场安排在前 40 帧内完成，勿依赖本镜总长（TTS 时长决定 frames）。

### 画笔（可 import，全部来自引擎白名单）

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon, useEntrance, useFade, useCountUp, useEntranceStyle, staggerDelay} from '../primitives';
```

- **主题 token（必须消费）**：所有颜色/字体/字号一律用 CSS 变量——`var(--c-primary)` `var(--c-accent)` `var(--c-ink)` `var(--c-ink-muted)` `var(--c-on-primary)` `var(--c-surface-card)` `var(--bg-cover)` `var(--bg-content)` `var(--c-terminal-bg)` `var(--c-terminal-fg)` `var(--c-success/--c-info/--c-warning)`；字号 `var(--fs-display/--fs-title/--fs-header/--fs-h1/--fs-h2/--fs-body/--fs-caption)`；字体 `var(--font-body)` `var(--font-mono)`；圆角 `var(--radius)`；安全区 `var(--shell-x)` `var(--content-top)` `var(--content-bottom)`。**禁止硬编码色值/字号**——79 套主题必须即换即生效。
- **primitives 画笔**：`useEntrance(delay)` 入场 spring 进度 0→1；`useFade(from, dur)` 线性淡入；`useCountUp(value, delay, decimals)` 数字计数；`useEntranceStyle(delay, kind)` 常用入场组合（fade/rise/slide/scale）；`staggerDelay(i, base)` 逐项错峰；`<Icon name size>` 内嵌 40+ 图标（名字同规则模式图标清单）。
- **import 白名单**（E8 拦截）：仅 `react` / `react-dom` / `remotion` / `@remotion/*` / 相对导入（`../SceneTypes`、`../primitives` 等，`../` 至多一层）。禁 fs/网络/其他 npm 包/`../../`。

### 构图原则（启发，不是套路）

- **画面是内容的一部分**：为"这段旁白在讲什么"设计专属视觉——讲管线就画流动，讲命令就敲终端，讲数字就做数字面；不要把旁白原文贴到画面上。
- 每镜一个**主视觉焦点**；文字是点睛不是正文（正文在配音和字幕里）。
- 复用主题 token 的渐变/圆角/阴影语言，让创意片与规则片共享同一气质。
- 动效三段式：入场（spring 弹入/生长）→ 保持（呼吸/微动）→ 不做退场（切镜即退）。
- 装饰元素（网格点阵/星点/水印）用**确定性计算**（序号取模/正弦相位），禁止随机数——渲染必须逐帧可复现。

### 校验闭环（写完必须过三道闸）

```bash
python -m makevideo validate <工程目录>   # 闸1+2：装载、import 白名单、tsc 编译（快）
python -m makevideo build <工程目录> --no-render   # 闸3：逐镜试帧（中点帧渲染，跑通即画面无运行时错误）
python -m makevideo build <工程目录>      # 全量出片
```

失败会抛 **E8** 并附具体文件/行/原因——按错误逐条修复后重跑。迭代画面时用 `build --no-render`（试帧结果有内容指纹缓存，代码没变秒过）。

## 3. 旁白与时长纪律（两模式通用）

- **语速基准 ≈ 4.2 字/秒**：60s 视频全片 narration 合计 **240~280 字**。逐镜估算：`镜时长 ≈ 该镜 narration 字数 ÷ 4.2`。
- narration 是给 TTS 念的：**口语化、无列表符号、无 markdown、无括号补充**；画面是给眼睛看的，两者不逐字重复但语义一致。
- 每镜 narration 2~3 句（30~45 字）；开头镜可加一句钩子，收尾镜引导行动。

## 4. 主题建议

用 `python -m makevideo list-themes` 查看全部主题（79 套）。建议逻辑：科技/产品 → `techdark` / `linear-app` / `spotify`；政务/正式 → `govgold`；教育/温暖 → `warmedu`；杂志/极简 → `magazine`；手写/亲和 → `chalkboard`。主题在 `project.json` 的 `"theme"` 字段；模式在 `"mode"` 字段（`"rule"`/`"creative"`）。

## 5. 自检清单（产出前逐项过）

通用：
- [ ] 每块 `## SCENE id|type|title` 三段齐全，id 唯一；每块都有非空 `=== narration`
- [ ] narration 合计字数 ≈ 目标时长 × 4.2
- [ ] project.json：`theme` 合法；`mode` 与内容一致
- [ ] 无 markdown 语法混入画面区（**、#、链接等）

规则模式追加：
- [ ] 首镜 `title`、末镜 `ending`；type 全部在 13 型枚举内
- [ ] bullets 条目 ≤5 且 ≤18 字；icons 名在清单内；stat 行三列（值|标签|图标?）；table 有表头行
- [ ] 相邻镜版式不重复

创意模式追加：
- [ ] type 全部为合法场景名（小写字母开头/数字/连字符，不与 13 型重合），且每个都有 `scenes/<名>.tsx`
- [ ] 场景默认导出组件；颜色/字号全部走 CSS 变量；无硬编码色值
- [ ] 动画用相对帧且入场在前 40 帧内；无 Math.random（用确定性计算）
- [ ] import 全在白名单内；`validate` 与 `build --no-render` 三道闸全过

## 6. 上机验证

产出后执行：`python -m makevideo validate <工程目录>` → `python -m makevideo build <工程目录>`。若校验报错（E2 DSL / E3 主题 / E8 场景），按错误信息逐条修复后重跑。

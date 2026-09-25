# MakeVideo

讲稿驱动的微视频生成工具：一份 Markdown 讲稿 + 一个风格主题 → 一键输出 1080P MP4，零人工剪辑。

## 双模式示范（同一份旁白，两种画面实现）

**创意模式** `mode: "creative"`——每镜画面由 LLM 为内容定制，无固定版式套路（推荐）：

<video src="https://github.com/user-attachments/assets/025d0c6a-e368-481f-b4fe-c397af7a48ec" controls muted playsinline></video>

**规则模式** `mode: "rule"`——13 型预制版式直接消费，稳定快出：

<video src="https://github.com/user-attachments/assets/d3282f77-9509-4a86-8069-dec32592980a" controls muted playsinline></video>

两片旁白逐字相同、时长完全一致（53.7s）——画面实现与时间轴层彻底解耦；创意片每镜对应工程 `scenes/<场景名>.tsx`（弹入封面 / 生长管线 / 非对称数字面 / 打字机终端 / 色板矩阵扫光 / 公式片尾），规则片为 title / flow / stat / code / quote / ending。

> 本项目由 [project-dev-skill](https://github.com/zh2673-git/project-dev-skill)（时空运行时项目开发方法论）驱动开发：以空间/时间/规则三公理推导架构，以 P/Q/I 验证契约驱动实现与测试。完整方案与文档见 [program.md](program.md) 与 [docs/](docs/)。

## 特性

- **讲稿进、成片出**：配音、帧对齐、渲染、拼接全链路自动化，人只负责写讲稿。
- **双模式画面实现（v0.0.6）**：`mode=rule` 走 13 型预制版式，稳定快出；`mode=creative` 每镜画面由 LLM 写 Remotion 场景代码（`scenes/*.tsx`），为内容定制构图与动效，配 tsc + import 白名单 + 逐镜试帧三道校验闸（E8）。片级二选一，时间轴层完全共享。
- **自动分镜**：`compose` 分析纯文本讲稿的内容形态（数据/步骤/对比/引语…），自动产出带版式声明的讲稿草稿。
- **13 种分镜版式**：title / bullets / flow / stat / table / panorama / ending / quote / compare / timeline / chart / code / image；bullets 支持 `icons:` 图标指令，stat 大数字计数动画。
- **主题系统**：视觉风格沉淀为 theme.json token，组件零硬编码风格，换主题即换风格、内容零改动；79 套主题（含 awesome-design-md 全量移植）对创意模式同样生效。
- **动效变体池**：7 个常用版式各配入场动效池，按分镜顺序轮换、相邻不重复，消除机械感。
- **增量渲染**：`--only` 只重画改动的分镜，其余片段缓存复用，无损拼接。
- **词级时间戳对齐**：TTS 词级时间戳驱动帧数换算与字幕帧窗，音画逐句对齐。

## 架构

```
讲稿.md ──┐                                          ┌── 整片 MP4
          ├─[domain 解析/对齐]─[application 编排]─[infrastructure 渲染]┤
theme.json┘        ↑ schema 校验        ↑ 生命周期钩子          └── 分段缓存
styles/DESIGN.md ──→ themes/theme.json（AI 转换 + 人审试帧定稿）
```

| 层 | 目录 | 职责 |
|---|---|---|
| core | `makevideo/core/` | DSL schema、主题契约、错误码（E1~E8） |
| domain | `makevideo/domain/` | 讲稿解析、字幕切句、帧对齐（纯函数） |
| infrastructure | `makevideo/infrastructure/` | edge-tts、Remotion 调用、ffmpeg 拼接、主题 IO、创意场景装载校验 |
| application | `makevideo/application/` | 出片用例编排（全量 / 增量 / 试帧） |
| runtime | `makevideo/runtime/` | CLI 入口（init/start/stop/destroy 生命周期映射） |
| engine | `makevideo/engine/` | Remotion 组件库 + 主题消费层 |
| themes | `makevideo/themes/` | 主题 token 库（全局共享只读） |
| styles | `styles/` | 各主题设计系统文档 DESIGN.md（人审源头） |

依赖铁律：themes/engine 只被消费不被反向依赖；domain 不直接调用 Remotion；CLI 是唯一调度入口。

## 快速开始

环境要求：Python 3.11+、Node.js 18+、Chrome（Remotion 渲染用）；`pip install edge-tts mutagen`，engine 依赖 `npm install`。

1. **建工程**：`projects/<名称>/` 下放两份文件——

   `project.json`：

   ```json
   {
     "name": "demo",
     "theme": "techdark",
     "meta": {
       "voice": "zh-CN-YunjianNeural",
       "rate": "+0%",
       "unit": "示例单位",
       "author": "主讲人",
       "compliance": "演示内容"
     },
     "output": "out/demo.mp4"
   }
   ```

   `讲稿.md`（分镜语法见下节）。

2. **校验**：`python -m makevideo validate projects/demo`

3. **出片**：`python -m makevideo build projects/demo`

## 讲稿 DSL

`## SCENE id|type|title` 开块，`=== narration` 分隔画面区与旁白区：

```markdown
<!-- meta: voice=zh-CN-YunjianNeural rate=+0% -->

## SCENE 01|title|示例：从讲稿到成片
subtitle: 副标题一行
=== narration
开场旁白，按句号分句，自动生成字幕帧窗。

## SCENE 02|table|数据表版式
| 列一 | 列二 |
| 甲 | 86 |
| 乙 | 43 |
highlight: 甲
note: 表格下方的备注
=== narration
表格版式的旁白。
```

| 版式 | 用途 | 专属字段 |
|---|---|---|
| title | 片头标题页 | `subtitle:`（多行） |
| bullets | 要点列表 | `- ` 条目 |
| flow | 流程步骤卡片 | `- ` 条目 |
| table / panorama | 表格 / 全景表 | `\|` 表格行、`highlight:`、`note:`、`cellColor:` |
| quote | 金句页 | `quote:`、`attribution:` |
| compare | 左右对比 | `leftTitle:`、`rightTitle:`、`左\|右` 条目 |
| timeline | 时间轴 | `标签\|说明` 条目 |
| chart | 数据图表 | `\|` 表格行（末列为数值）、`note:` |
| code | 代码演示 | `lang:`、`- ` 代码行 |
| image | 配图注解 | `image:`、`imageNote:` |
| ending | 片尾致谢 | — |

meta 可写在讲稿内嵌注释或 project.json（后者优先）：`voice` / `rate` / `unit` / `author` / `compliance` / `footer`。

## 双模式（规则 / 创意）

`project.json` 的 `"mode"` 字段控制画面实现方式，**片级二选一**：

- **`"rule"`（缺省）**：type 位写 13 型版式名，画面由预制组件渲染——稳定快出，接受版式单调。适合批量生产、信息陈列类内容。
- **`"creative"`**：type 位写自定义场景名，每个场景对应工程 `scenes/<场景名>.tsx`（LLM 按内容理解写 Remotion 代码，如打字机终端、生长管线、非对称数字面）——画面与内容深度绑定，无固定版式套路。

创意模式的三道校验闸（E8，失败即停并附定位信息）：import 白名单（禁文件系统/网络/任意 npm 包）→ tsc 编译（engine strict 全量）→ 逐镜试帧（内容变更后自动重试）。场景代码消费主题 CSS 变量与 `primitives.tsx` 画笔（入场/计数/错峰/图标），79 套主题即换即生效。详见根目录 `SKILL.md` 创作引导。

## 自动分镜（compose）

手头只有纯文本讲稿？`compose` 按**内容形态**自动选择版式，产出带版式声明的讲稿草稿，微调后 `build`：

```
python -m makevideo compose 讲稿.txt            # 产出 讲稿_分镜.md
python -m makevideo compose 讲稿.txt --dry-run  # 仅预览分镜决策（版式 + 判定依据）
```

| 内容形态 | 判定依据 | 版式 |
|---|---|---|
| 首段 / 收束语 | 首段；谢谢/感谢/下期开头 | title / ending |
| 表格行 | `\|` 分隔行（>12 行升全景） | table / panorama |
| 数据名值对 | ≥3 条「名称：数值」 | chart |
| 时间序列 | 年份/月份/阶段标记 ≥3 | timeline |
| 左右对照 | 「A vs B」且对照行 ≥2 | compare |
| 步骤叙述 | 首先/然后/最后、编号条目 | flow |
| 引语金句 | 引号包裹、破折号出处、单句收束 | quote |
| 要点/默认兜底 | 列表行、短句切分 | bullets |

所有条目逐字取自原文，不增写内容；产出即校验（DSL round-trip），AI 判断在先、确定性执行在后、人审兜底。

## CLI 命令

```
python -m makevideo build <工程目录> [--only 03,05] [--no-tts] [--no-render] [--theme 主题名]
python -m makevideo compose <文本文件> [-o 输出.md] [--dry-run]   # 纯文本 → 自动分镜讲稿草稿
python -m makevideo preview <主题名>             # 固定样例分镜渲染试帧 PNG
python -m makevideo validate <工程目录>          # 仅校验讲稿 DSL + 主题 token
python -m makevideo list-themes                  # 列出可用主题
python -m makevideo import-themes <design-md目录> [--only 名,名] [--force]   # awesome-design-md 批量移植
```

- `--only`：增量渲染，只重渲指定分镜，其余复用 `engine/out/segments/` 缓存后无损拼接。
- `--no-tts`：复用现有 mp3；音频时长取自 `projects/<工程>/gen/tts.json` 缓存（首次真实 TTS 自动生成），保证二次运行时长零漂移。
- 退出码即错误码序号：E1 工程 / E2 DSL 校验 / E3 主题 / E4 TTS 数量断言 / E5 渲染 / E6 拼接。

## 主题系统

设计系统文档（`styles/<主题>/DESIGN.md`，双源头：移植自 awesome-design-md 开源设计系统 / 按 canvas-design 方法论原创，均附第 10 节 Motion & Video Rules）→ `themes/<主题>/theme.json`（过滤交互态与响应式断点、阴影转层次参数、字体层级转字幕层级）→ 试帧人审定稿 → Remotion 组件只读 token 渲染。

当前主题库 **79 套**：5 套预置（govgold 政务红金 / chalkboard 黑板手写 / magazine 极简杂志 / techdark 科技暗色 / warmedu 暖色教育）+ 74 套自 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 批量移植（linear-app、spotify、vercel、stripe、notion、figma、nvidia、tesla…）。

**批量移植（import-themes）**：上游 DESIGN.md 是结构化的 token 文档（64 份 YAML frontmatter + 10 份散文角色标注），导入器按编译期固定规则确定性转换——核心 token（primary/ink/canvas/rounded 等）直取原文；缺省 token 用色彩数学推导（mix/darken/hue_rotate + 对比度校验）；字号阶映射视频画布常量；动效/变体池为默认档。转换即校验（E3 先拦截后落盘），每套主题同步产出带溯源头与推导备注的 styles 文档，供试帧后人工微调：

```
git clone --depth 1 https://github.com/VoltAgent/awesome-design-md
python -m makevideo import-themes awesome-design-md/design-md
```

新增手移植主题只需两份文件：`styles/<名>/DESIGN.md` + `themes/<名>/theme.json`。

**动效变体池**（可选段 `variants`）：7 个常用版式（bullets / flow / stat / table / quote / compare / timeline）各配入场动效池，组件按同版式出现序号轮换、相邻分镜不重复——同一条片里每次出现的版式动效不再雷同。缺省该段即用各版式默认动效，旧主题零改动兼容；变体仅动效维度，布局与色彩 token 不变。

## 示范工程

两支示范片（见 README 顶部内嵌）来自同一段旁白的两个工程，可直接复用体验：

- `projects/makevideo-创意一分钟/`：创意模式——讲稿 + 6 个场景代码（`scenes/*.tsx`），`build` 前自动过 E8 三道闸（import 白名单 / tsc / 逐镜试帧）。
- `projects/makevideo-规则一分钟/`：规则模式——纯讲稿，6 型预制版式，零代码。

修改任一工程的讲稿（或场景代码）后重跑 `python -m makevideo build <工程>`，即可体验完整出片流程。

## 设计文档

| 文档 | 内容 |
|---|---|
| [program.md](program.md) | 项目方案（时空契约、验证契约 P/Q/I） |
| [docs/01-项目方案.md](docs/01-项目方案.md) | 本质定义、竞品锚定、架构总览 |
| [docs/02-架构设计.md](docs/02-架构设计.md) | 技术选型论证、执行流类型 |
| [docs/03-模块设计.md](docs/03-模块设计.md) | 模块划分、DSL 契约、接口清单 |
| [docs/04~07-*-四层设计.md](docs/) | 讲稿解析 / 主题系统 / 渲染引擎 / CLI 运行时的四层设计 |

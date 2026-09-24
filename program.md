# program.md —— MakeVideo：讲稿驱动的多风格微视频生成工具

> 状态：**正式版**（用户已于 2026-09-24 确认）。
> 运行模式：**生产**（产出完整文档树 docs/01~07 + 测试报告）。
> 用户确认决定：运行模式=生产；技术栈=沿用 Python3.11+Remotion+edge-tts+ffmpeg；时空契约=按草稿；工具形态=CLI + skill 化；主题系统=双源头（awesome-design-md 移植 / canvas-design 原创）。

## 项目目标

MakeVideo：**讲稿驱动的微视频生成工具**（Remotion + edge-tts + ffmpeg + Python 编排）：

- **讲稿进、成片出**：任意符合分镜 DSL 的讲稿.md → 一键 1080P MP4，零人工剪辑。
- **风格进、主题出**：引入 design skill（canvas-design 设计哲学方法论），把"风格"沉淀为可复用主题库，换主题即换风格，内容零改动。
- **增量迭代**：`--only` 分段增量渲染，改哪个分镜重渲哪个，几十秒换段。

## 本质定义（时空契约校验——待确认项）

**本质**：一个把"人的讲稿时间"调度为"机器的逐帧渲染时间"的成片运行时；风格空间（主题）与内容空间（分镜）双向解耦。

- **空间契约**：主题空间（themes/，全局共享只读）与工程空间（projects/，每视频独立）分离；中间产物（分镜 JSON、音频、分段 MP4）全部落盘可复用，运行结束无驻留。
- **时间契约**：**顺序管道**——解析讲稿 → 逐分镜 TTS → 帧数对齐 → 写分镜 JSON → Remotion 渲染（整片或分段）→ 拼接封装。单向推进、失败即停、可一键重跑。
- **规则契约**：讲稿 DSL 与 theme.json 双 schema 校验（运行时拦截）；分镜 type ↔ 组件一一对应（编译期映射表）；TTS 音频数 = 分镜数断言（stop 钩子）；缺失主题 token 用默认值兜底 + 告警。

## 技术栈（待确认）

| 层 | 选型 | 理由（时空需求推导） |
|---|---|---|
| 编排语言 | Python 3.11 | 沿用已验证管线；脚本管道 + subprocess 调度 |
| 渲染引擎 | Remotion（React/TS） | 逐帧渲染、字幕生态、数据驱动分镜、Studio 实时预览 |
| 配音 | edge-tts | 免费中文、词级时间戳驱动时长 |
| 合成 | Remotion 自带 ffmpeg | 免系统安装、无损拼接 |
| 风格方法论 | anthropics/skills `canvas-design` + VoltAgent/awesome-design-md | 原创设计哲学先行 + 现成 DESIGN.md 移植，双源头落为主题 token；均为宽松许可可引用 |

## design 风格系统集成方案（核心增量）

落地为**主题生产线**，双源头供给、单一契约面：

1. **设计系统文档**（styles/{主题名}/DESIGN.md）：两个来源——
   - **移植型**：从 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)（Google Stitch DESIGN.md 标准，73+ 份真实产品设计系统，MIT）选底稿；
   - **原创型**：按 anthropics/skills `canvas-design` 方法论自写设计哲学（政务等需避开品牌联想的场景）。
   - 无论哪种来源，一律追加**第 10 节「Motion & Video Rules」**：入场/强调/退场动效曲线、转场节奏、字幕样式、信息密度节奏（Web 版 9 章节不含视频维度）。
2. **主题 token**（themes/{主题名}/theme.json）：DESIGN.md → 机器可读 token 的转换产物——色板（主/辅/底/强调）、字体栈（标题/正文/数字）、间距/构图参数（安全边距、栅格）、动效曲线、组件变体。**转换规则（编译期固定）**：过滤 hover/active/disabled 交互态与响应式断点（视频为固定 1920×1080 画布）；阴影层级转为卡片/表格层次参数。转换由 skill 流程执行（AI 读 DESIGN.md 生成，人审试帧定稿）。
3. **组件消费**：Remotion 组件只读 token 渲染，**组件零硬编码色彩字体**，对主题来源无感知。
4. **主题试帧**：`makevideo preview --theme X` 用固定样例分镜渲染 6 宫格试帧 PNG，选型不盲渲。

预置主题（首发 5 个）：政务红金（原创型）、黑板手写（原创型）、极简杂志（移植型）、科技暗色（移植型）、暖色教育（原创型）。

## 目录规划（第0级时空映射）

```
make-video/
├── program.md                  # 本文件
├── makevideo/                  # 通用工具包
│   ├── core/                   # 数据规范：DSL schema、theme schema、常量、错误码（❌不依赖他层）
│   ├── domain/                 # 流转-规则：讲稿解析器、字幕引擎（切句/帧窗）、帧对齐（❌不依赖基础设施实现，经接口注入）
│   ├── infrastructure/         # 数据存储：edge-tts 封装、Remotion 调用、ffmpeg 拼接、文件 IO（仅依赖 core 接口）
│   ├── application/            # 流转-编排：出片用例（全量/增量/预览/试帧）、事务边界（失败即停）
│   ├── runtime/                # 运行时/内核：CLI 入口，init=解析校验 / start=TTS+对齐 / stop=数量断言 / destroy=落盘清理
│   ├── engine/                 # Remotion 工程：分镜组件库 + 主题消费层
│   └── themes/                 # 主题 token 库（design 流程产出，全局只读共享）
├── styles/                     # 各主题的设计哲学文档（人审源头）
├── projects/                   # 视频工程（每工程：讲稿.md + 素材 + 工程配置）
│   └── makevideo-使用指南/       # 示例工程：介绍工具用法（README 演示片）
└── docs/                       # 生产模式文档树（探索模式仅 01-项目方案.md）
```

**依赖铁律**：themes/engine 只被消费不被反向依赖；domain 不直接调 Remotion；CLI（runtime）是唯一调度入口。

## 分镜 DSL（12 型）

title（片头）/ bullets（要点）/ flow（流程）/ table（表格）/ panorama（全景表）/ ending（片尾）/ quote（金句）/ chart（数据图）/ compare（对比）/ timeline（时间轴）/ code（代码）/ image（配图）。
兼容性：仅用基础六型的早期格式讲稿零改动可跑。

## 验证契约（P/Q/I 框架——具体值待确认）

| 维度 | 检查项 |
|---|---|
| P 前置 | Node+Remotion 可用；Chrome 路径存在；主题 token 校验通过；讲稿 DSL 校验通过 |
| Q 后置 | 示例工程端到端出片成功；各分镜类型渲染正确；换主题后同讲稿出片风格生效、时长不变 |
| I 不变量 | 基础六型讲稿向后兼容；分段增量结果与整片渲染逐帧一致；重复运行幂等；无临时文件泄漏；移植型主题出片与原 DESIGN.md 色板/字体层级抽查一致 |

## 研究方向（优先级）

1. 主题 token schema 的粒度设计（token 过粗→风格趋同，过细→主题库难维护）；组件与 token 的消费契约。
2. DESIGN.md → theme.json 转换规则：9 章节 Web 语义到视频画布的映射（过滤交互态/响应式，阴影转层次，字体层级转字幕层级）；第 10 节 Motion & Video Rules 的 token 化。
3. Remotion 组件库扩展：6 个新分镜类型的动效规范与主题适配。
4. 主题试帧管线（单组合多样例帧低成本渲染）与 preview 体验。

## 项目愿景

- 短期：工具与主题系统落地，示例工程端到端出片验证。
- 中期：沉淀为 skill（结合 essence-workshop 工作流），"讲稿+主题"两参数出片。
- 长期：批量视频生产线（系列课程换讲稿即换片），风格资产持续积累。

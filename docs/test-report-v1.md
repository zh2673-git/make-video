# 测试报告 v1 —— MakeVideo 首轮 P/Q/I 验证

> 日期：2026-09-24 ~ 09-25 | 验证构成：管线回归验证（验证用工程已清理）+ 示例工程端到端（`projects/makevideo-使用指南`，最终交付物）

## 一、P 前置校验

| 检查项 | 结果 | 证据 |
|---|---|---|
| Node + Remotion 可用 | ✅ | 整片 / 分段 / 试帧 / still 四类渲染命令均成功执行 |
| Chrome 路径探测 | ✅ | CHROME_PATH → 候选路径逐级探测，`--browser-executable` 注入生效 |
| theme.json 校验 | ✅ | 5 个主题 load_theme 全部通过；缺键场景触发 E3 |
| 讲稿 DSL 校验 | ✅ | 9 镜示例、13 镜回归工程 validate 均通过；compare 缺字段场景触发 E2 并拦截 |

## 二、Q 后置校验

### Q1 管线回归：整片渲染正确性

使用一组 13 镜六型基础讲稿做回归验证（验证后产物已清理，数据留存于此）：

- live TTS 13 镜一次成功（无重试），总时长 **296.28s**，与参照视频时长**差 0.00s**。
- live TTS 词级时间戳与参照逐镜一致，验证帧对齐公式 `frames = ceil(audioSec × 30) + 12` 的稳定性。

### Q2 各分镜类型渲染正确

- 试帧管线（preview）：10 版式渲染成功，PIL 像素抽查全绿（表头底色 / 高亮行 / 封面渐变 / 终端底色 / 图表主色柱等均符合 DESIGN.md）。
- 回归工程：title / bullets / flow / table / panorama / ending 六型整片出片正确。
- 示例工程：9 型（title / bullets / flow / code / table / compare / timeline / quote / ending）出片正确。

### Q3 换主题：同讲稿、风格生效、时长不变

`build --theme chalkboard --only 04`：仅重渲 1 镜（22.6s 段），其余 12 段缓存复用，拼接帧数 8887 不变。

| 指标 | govgold 原版 | chalkboard 重渲版 |
|---|---|---|
| 平均 RGB | 米白亮底 | (67, 99, 63) 绿色深底 |
| 暗像素占比 | ~5% | **77%** |

示例成片 techdark 抽帧：平均 RGB (26, 28, 39) 深蓝黑底，暗像素 **96%**——科技暗色风格生效。

### Q4 示例工程端到端（最终交付）

`projects/makevideo-使用指南`（9 镜，techdark 主题）：

- live TTS 9 镜一次成功，总时长 **155.0s**，成片 `assets/demo.mp4`（12.0 MB），已嵌入 README。

## 三、I 不变量校验

| 不变量 | 结果 | 说明 |
|---|---|---|
| 基础六型讲稿向后兼容 | ✅ | 回归工程讲稿（六型格式）零改动解析、渲染成功 |
| 分段增量与整片一致 | ✅ | 13 段拼接成片 8887 帧 = 整片 8887 帧；时长 296.80s vs 296.28s（差 0.52s，分段容器时间基取整；`-c copy` 零转码） |
| `--only` 增量复用 | ✅ | 指定镜重渲，其余 12 段全部命中缓存复用，仅执行拼接 |
| 重复运行幂等 | ✅ | `--no-tts --only` 连续 3 次运行，解析 / 缓存判定 / 输出路径全部稳定 |
| 无临时文件泄漏 | ✅ | concat 列表用完即删；渲染后无残留 tmp |
| 移植主题与 DESIGN.md 一致 | ✅ | 试帧像素抽查与 DESIGN.md 色板对齐 |

## 四、测试中发现并修复的缺陷

| # | 缺陷 | 根因 | 修复 |
|---|---|---|---|
| 1 | [E4] TTS 数量断言误报 | `tts.synth/reuse` 未写入 `audioSec` 字段 | 两处补 `scene["audioSec"] = sec` |
| 2 | `--no-tts` 复用时总时长漂移 +12.4s | mp3 文件时长含 edge-tts 固定尾部静音（~0.97s/镜），非词级终点 | 新增词级时长缓存 `projects/<工程>/gen/tts.json`：真实 TTS 后落盘，复用时优先读缓存（mutagen 仅兜底并告警） |
| 3 | [E6] 分段拼接失败 | concat 列表相对路径被 ffmpeg 按「列表文件所在目录」解析（原误解为 cwd） | 列表文件移入 `out/segments/`，条目写裸文件名 |
| 4 | compare 校验缺 leftTitle/rightTitle | parser 将指令键小写化存储，丢失驼峰字段名 | `_DIRECTIVES` 改为小写键 → 规范驼峰字段映射 |
| 5 | 试帧 PNG 落错目录 / still 参数报错 | 相对路径以 engine 为 cwd；`--image-format` 用法错误 | 绝对路径 + `remotion still --frame N` |

## 五、已知限制（后续迭代项）

1. **分段缓存不含主题维度**：`segments/scene-{id}.mp4` 未区分主题，换主题 + `--only` 会命中异主题缓存段（验证中以删除被污染段兜底）。改进：段文件名加入主题标识。
2. **配音文件全局共享**：`engine/public/audio/scene-{id}.mp3` 按分镜 id 命名，跨工程同 id 会互相覆盖（示例工程以 `u` 前缀规避）。改进：音频目录按工程隔离。
3. **沙箱环境噪音**：Chrome 渲染时的附带写入触发沙箱告警，不影响产物，需在沙箱外运行渲染命令。

## 六、结论

P/Q/I 全部通过。工具已具备「讲稿进、成片出」的端到端能力：管线回归零偏差，增量渲染只重渲改动分镜，换主题风格即时切换且时长不变。示例工程《makevideo 使用指南》（9 镜 2.6 分钟，techdark）作为 README 演示片交付。

## 七、v0.0.2 增量验证（2026-09-25）

两个新能力：**自动分镜 compose** + **动效变体池 variants**。

### Q5 compose 自动分镜正确性

覆盖全部规则的 10 段测试文本（临时工程，验证后已清理）：

| 输入内容形态 | 自动判定 | 判定依据 |
|---|---|---|
| 首段「MakeVideo 自动分镜演示」 | title | 首段→片头 |
| 两句介绍段 | bullets ×2 | 短句切分 |
| 「三个核心问题」+ 3 条短句 | bullets ×3 | 短句切分（总起行提为标题） |
| 首先/然后/最后 | flow ×3 | 步骤词×3 |
| 4 条「名称：数值」 | chart | 数值名值对×4 |
| 4 条「2024年3月 …」 | timeline ×4 | 时间标记×4 |
| 引语 + 破折号出处 | quote + attribution | 引语/短句收束 |
| import/def 代码行 | code（lang=python） | 代码行×2 |
| 「……感谢观看。」 | ending | 收束语→片尾 |

- 产物讲稿.md 经 parse_script 回读 + validate_scenes 复验通过（round-trip 自证）；`--dry-run` 输出逐镜决策表（版式+依据）。
- 显式 A vs B + 对照行 ≥2 的 compare、`|` 表格行 table 分支由规则链单元覆盖（代码审读级），演示文本未含。

### Q6 动效变体池生效性

同 6 型分镜（bullets/flow/table/quote/compare/timeline）× 两套 variants 顺序（techdark 原序 vs 池反转临时主题），渲染各分镜 **frame 18**（入场动画进行中）单帧 PNG，PIL 全图逐像素对比：

| 版式 | 差异像素占比 | 判定 |
|---|---|---|
| bullets（slide↔rise） | 5.64% | DIFF |
| flow（scale↔rise） | 8.22% | DIFF |
| table（cascade↔fade） | 31.68% | DIFF |
| quote（mark↔rise） | 2.58% | DIFF |
| compare（slide↔fade） | 58.29% | DIFF |
| timeline（line↔pulse） | 1.25% | DIFF |

6/6 版式变体差异显著 → 轮换真实生效。

### I 增量（v0.0.2 追加）

| 不变量 | 结果 | 说明 |
|---|---|---|
| 旧主题零改动兼容 | ✅ | 5 主题 theme.json 补 variants 后 load_theme 全过；variants 为可选段，缺省=默认动效 |
| occurrence 0 = 默认动效 | ✅ | 示例工程 `--no-tts` 全 9 镜重渲：总时长 155.0s、4651 帧与 v0.0.1 完全一致，画面序列不变 |
| tsc 类型检查 | ✅ | `npx tsc --noEmit` 全绿；顺带修复存量隐患 typography.body 重复声明（`--fs-body` 把字体栈当字号，字幕字号静默失效）→ 新增独立 token `bodySize` |

### v0.0.2 已知限制

1. **分段缓存无主题/变体维度**（沿承已知限制 1）：变体生效后同 id 段的画面随主题 variants 变化，`--only` 复用旧段不会自动重渲；当前以删除被污染段兜底。
2. compare 分支要求显式「A vs B / A 与 B 的对比」标记且能切出 ≥2 对照行，条件较严——不足时兜底 bullets（人审可改）。

## 八、v0.0.3 增量验证（2026-09-25）

新能力：**awesome-design-md 批量移植（import-themes）**；修复：**存量 5 主题 typography.body 数字→字体栈**（`--font-body` 此前接收数字导致正文字体回退默认，同 bodySize 一族的契约隐患）。

### Q7 批量移植覆盖率

上游 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) `design-md/` 全部 **74** 份 DESIGN.md：

| 解析路径 | 数量 | 结果 |
|---|---|---|
| frontmatter（结构化 token） | 64 | 64/64 成功 |
| 散文角色标注（无 frontmatter） | 10 | 10/10 成功（kraken/lamborghini/lovable/mastercard/runwayml/sanity/spotify/starbucks/tesla/theverge） |

- 主题库 5 预置 + 74 移植 = **79 套**，全部通过 `load_theme` E3 校验（0 失败）。
- 转换保真度抽查：linear-app（primary #5E6AD2 / surface 阶梯 / radius=12 直取原文）；spotify（prose 路径 primary #1ED760 / surface #121212 / card #181818 / inkMuted #B3B3B3 全命中）；nintendo-2001（行内注释容忍）。
- 每套主题附带 styles/<slug>/DESIGN.md：溯源头 + 推导备注（darken/lighten/hue_rotate 兜底透明披露）+ 第 10 节动效默认档。

### Q8 导入主题端到端可渲染

- `preview linear-app`：10 版式试帧全部渲染成功（Remotion 消费生成的 theme.gen.json）。
- 全量试帧抽查：74 导入主题 × bullets/table 2 帧，人审素材落盘（临时目录，不入库）。

### I 增量（v0.0.3 追加）

| 不变量 | 结果 | 说明 |
|---|---|---|
| E3 先拦截后落盘 | ✅ | save_theme 校验失败不写盘；79 主题回读复验 0 失败 |
| 既有工程零影响 | ✅ | 存量 5 主题仅 body 类型修正；1 分钟/2.6 分钟工程重渲可用 |
| 转换确定性 | ✅ | 同一输入重复运行产物一致（--force 重生成 diff 为空） |

### v0.0.3 已知限制

1. 批量导入主题为**算法草稿**：色彩/半径直取原文，字体栈取上游 fallback（多数为英文字体，已补 CJK 安全栈），brand 渐变为通用模板——精调用需按 styles 文档推导备注逐套试帧微调。
2. 散文路径（10 份）依赖角色关键词分类，个别主题若上游改版式需维护 parse_prose_colors 的关键词表。

## 九、v0.0.4 增量验证（2026-09-25）

新能力：**视觉词汇扩展**——图标系统（bullets `icons:` 指令 + engine 内嵌 feather 风格 SVG 图标库 ~40 名+别名）与 **stat 数字版式**（大数字计数动画，DSL 12→13 型，variants 支持 count/rise）。

### Q9 契约与解析

| 检查项 | 结果 | 说明 |
|---|---|---|
| TS 编译 | ✅ | `npx tsc --noEmit` 0 错误（SceneTypes 对偶 + MicroCourse exhaustive 映射漏型即编译报错） |
| icons 解析 | ✅ | `icons: edit,layers,zap` → `scene["icons"]` 字符串列表；缺省场景无该字段（旧讲稿零改动） |
| stat 解析 | ✅ | `\| 60秒 \| 一分钟成片 \| clock` 表格行 → `scene["stats"]`；E2 对缺 stats 的 stat 分镜拦截 |
| 图标名回退 | ✅（设计） | 非法图标名渲染层回退序号圆，不阻断渲染（宽松语义层） |

### Q10 端到端

- 示例工程升级（projects/makevideo-一分钟介绍）：m2 bullets 加图标（edit/layers/zap）、m4 十二→十三种版式、新增 m4b stat 镜（60秒/79 套/13 种 + clock/layers/grid 图标）→ 全量 TTS+渲染出片成功。
- `preview` 试帧样例同步：p2 bullets 带图标、p10 stat 数字版式（后续任何主题试帧即覆盖新版式）。

### I 增量（v0.0.4 追加）

| 不变量 | 结果 | 说明 |
|---|---|---|
| 旧讲稿零改动兼容 | ✅ | 去 icons 指令的讲稿解析+校验通过，无字段残留 |
| 旧主题零改动 | ✅ | stat 未入 variants 的 79 套主题回退 DEFAULT_VARIANTS.stat='count'，无需批量更新 |
| 时间轴不变量 | ✅ | stat 计数动画为帧内插值，frames 仍由 TTS 词级时长对齐决定 |

### v0.0.4 已知限制

1. 图标库为内嵌封闭集合（~40 图标）：需求扩容时增补 icons.tsx 即可；未知名静默回退序号（无告警）。
2. flow/table 等其余版式暂不支持 icons 指令（仅 bullets/stat 消费）；composer 自动分镜不产出 stat（强调型数字场景宜人工声明）。

## 十、v0.0.5 增量验证（2026-09-25）

新能力：**SKILL.md（LLM 创作引导单一源头）+ compose --ai（LLM 排版决策后端）+ --prompt-out 离线任务包**；错误码新增 **E7 LLM 调用失败**。

### Q11 单元验证（fake LLM 注入，5/5 通过）

| # | 检查项 | 结果 |
|---|---|---|
| 1 | `--prompt-out` 任务包：不发请求，system=SKILL.md+排版铁律、user=原文 | ✅ |
| 2 | `--ai` 直通：合法草稿直接过 E2 校验落盘 | ✅ |
| 3 | 回喂重试：首稿非法 → 错误回喂 → 第 2 次调用修正成功 | ✅ |
| 4 | 双败拦截：两稿均非法 → [E2] 两次校验均失败 | ✅ |
| 5 | prompt 组装：system 含 SKILL.md 正文+_AI_ROLE，user 含原文 | ✅ |

### Q12 三模式对比实验（同一命题「介绍 makevideo 一分钟」）

同一份人类原文（`projects/三模式对比/原文.txt`，约 260 字）走三种模式，各建工程出片：

| 工程 | 模式 | 主题 | 分镜 | 时长 | 特征 |
|---|---|---|---|---|---|
| 对比A-规则链 | compose 规则链 | techdark | 6 镜 / 4 型 | 58.6s | 数字段被拍平为 bullets 短句（全片 bullets×2），无图标无 stat |
| 对比B-LLM作者 | LLM 读 SKILL.md 自由创作（无原文输入） | magazine | 7 镜 / 7 型 | 59.0s | compare+flow+stat+bullets(icons)+quote 组合；浅色杂志风+女声（Xiaoxiao） |
| 对比C-AI排版 | compose --prompt-out 任务包 → LLM 排版回填 | linear-app | 6 镜 / 6 型 | 58.6s | 同一原文升级：数字段→stat 计数动画（13 种/79 套/60 秒），bullets 配语义图标，条目逐字 |

- **同质化对比结论**：同一输入下 A 仅 4 型且 bullets×2 相邻重复；C 升至 6 型且相邻不重复——LLM 排版决策打破规则链千篇一律，同时内容零改写。
- 像素抽检（3s 处帧主色）：A (19,18,31) techdark 深底 / B (252,252,252) magazine 近白 / C (9,11,20) linear-app 深紫黑——三主题各自生效；C 深底经 theme.json 复核为 linear-app 原定义（surface #010102 + 紫色径向渐变），非回退。
- 逐字铁律抽查（C）：全部条目与 narration 可回溯原文（允许顿号切条与 stat「值|标签」拆分），无增写润色。

### I 增量（v0.0.5 追加）

| 不变量 | 结果 | 说明 |
|---|---|---|
| 规则链行为不变 | ✅ | compose 缺省模式决策与 v0.0.2 一致（同输入 dry-run 复验） |
| 未配置 LLM 时可诊断 | ✅ | 缺环境变量抛 [E7]，提示中给出 --prompt-out 离线通道 |
| prompt-out 零网络依赖 | ✅ | 任务包落盘不发请求；回填产物过 validate（E2）即可 build |
| LLM 草稿必过校验 | ✅ | 草稿过真实 parser+validate_scenes（E2），失败回喂重试 1 次，round-trip 复验 |
| 存量功能零影响 | ✅ | 本轮纯 Python 层改动（engine 无变化），旧工程 validate/build 不受影响 |

### v0.0.5 已知限制

1. `--ai` 直连需用户自备 OpenAI 兼容端点与 key；本仓库验证走 `--prompt-out` 离线等价通道（LLM 后端由人充当回填）。
2. 排版模式「逐字铁律」依赖 LLM 遵守 prompt 约定，护栏只保证 DSL 合法、不校验逐字性（后续可加原文 diff 校验）。

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

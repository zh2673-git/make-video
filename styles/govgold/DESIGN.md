# DESIGN.md —— govgold 政务红金

> 源头：原创（canvas-design 方法论）| 消费方式：AI/人工按本文件维护 themes/govgold/theme.json
> 本文是主题的人审源头；theme.json 是机器契约面。二者不一致时，以试帧定稿为准。

## 1. Visual Theme & Atmosphere

美学运动命名：**「政务静水」**。庄重红金对撞，金线为骨，米白为底。信息密度中低、留白充足、字重分明——像一份盖了红章的公文摊开在阳光下的办公桌上。观感关键词：权威、克制、温润、可信。

## 2. Color Palette & Roles

| 语义名 | Hex | 角色 |
|---|---|---|
| primary | #8C1F28 | 主色：页眉页脚底、卡片边条、表头、序号圆 |
| primaryDark | #5A121A | 主色深端：渐变起点、封面底色 |
| primaryLight | #A8323C | 主色浅端：渐变终点 |
| accent | #C9A063 | 强调：金线、徽章描边、单位名、STEP 标签 |
| accentSoft | #F5D9A8 | 强调柔化：页脚文字、副标题 |
| surface | #FAF6EF | 内容区底色（米白宣纸） |
| surfaceCard | #FFFFFF | 卡片/表格白面 |
| surfaceAlt | #F6F1E7 | 斑马纹、边框淡色 |
| ink | #2B2B2B | 正文墨色 |
| inkMuted | #8A7B6A | 注释、表注 |
| onPrimary | #FFFFFF | 主色上的反白字 |
| success | #1E7B34 | 语义：交叉命中（如"双平台交叉"） |
| info | #2B6CB0 | 语义：单源存在（如"仅话单"） |
| warning | #B7791F | 语义：待核（如"仅账单"） |
| highlightRow | #C6EFCE | 命中行底色 |
| terminalBg / Fg | #1A1A2E / #EAEAEA | 代码终端 |

## 3. Typography Rules

| 层级 | 字号 | 字重 | 用途 |
|---|---|---|---|
| display | 110 | 800 | 片尾大字 |
| title | 88 | 800 | 封面主标题、金句 |
| header | 50 | 700 | 内页页眉标题 |
| h1 | 42 | 600/700 | 要点、步骤、图注 |
| h2 | 36 | 400-800 | 副标题、表格普通单元格 |
| body | 34 | 400 | 字幕条 |
| caption | 28 | 400 | 单位名、说明 |
| micro | 24 | 400 | 页脚、全景表格 |

字体栈：正文「Microsoft YaHei / PingFang SC / SimHei」；代码「Consolas」。金线（120×6px accent）是全片唯一的装饰语言，禁止多余纹样。

## 4. Component Stylings（视频化裁剪）

- **页眉**：headerBg 横向渐变，标题反白 + 88px 金线下划；右侧单位徽章（accent 描边、圆角 10）。
- **页脚**：headerBg 同源，上缘 3px accent 金线；左「单位 · 栏目名」右「分镜号」。
- **要点卡**：白底圆角 16，左 8px primary 边条，序号圆（primary 渐变 + accent 描边）。
- **表格**：表头 primary 纵向渐变反白；斑马纹 surfaceAlt；命中行 highlightRow + 前三列加粗；语义单元格着色 + color-mix 18% 底色。
- ~~按钮 hover/active~~、~~响应式断点~~：视频为固定 1920×1080 画布，无交互态，全部裁剪。

## 5. Layout Principles

安全区：左右 90px；内容区上 150 / 下 150（页眉页脚之外）。栅格：内容单列居中，表格通栏，对比页 1:1 双栏 + 中央 VS 圆章。留白优先于填充——每屏要点 ≤5 条。

## 6. Depth & Elevation

三级阴影：卡片 `0 6px 18px rgba(0,0,0,0.08)`；悬浮 `0 8px 24px rgba(0,0,0,0.12)`；代码/封面 `0 10px 30px rgba(0,0,0,0.25)`。禁止更重的投影（政务气质忌浮夸）。

## 7. Do's and Don'ts

- Do：金线只用水平细线；语义色只用于数据判定词；渐变只用于主色两端。
- Don't：禁止引入第四种色相；禁止斜体；禁止页面切换动画超过 0.5s；禁止业务色硬编码进组件（一律走 cellColors 数据或 semantic token）。

## 8. Responsive Behavior

不适用（固定 1920×1080）。字号阶已按 4K 缩放预校准，等比缩放到 720P 仍可读。

## 9. Agent Prompt Guide

> 色板速查：主 #8C1F28 · 深 #5A121A · 金 #C9A063 · 底 #FAF6EF · 墨 #2B2B2B。
> 改主题时：改本文 → 同步 theme.json → `python -m makevideo preview govgold` 出试帧 → 人审定稿。

## 10. Motion & Video Rules（视频扩展段）

| 维度 | 规则 |
|---|---|
| 入场 | spring damping=120 / stiffness=100（稳重不弹跳） |
| 逐项 stagger | 10 帧；表格逐行 7 帧 |
| 转场 | 每分镜 fade 12 帧（0.4s），禁止滑动/翻页 |
| 节奏 | 分镜末尾留 12 帧呼吸；单屏文字停留 ≥2s |
| 字幕 | body 字号反白半透明黑条，底部 84px，逐句淡入 |

## 10.1 动效变体池（v0.0.2）

6 个常用版式各配入场动效池；组件按同版式出现序号轮换（相邻分镜不重复），第 1 变体为默认动效。本主题取值：

| 版式 | 池（按轮换序） |
|---|---|
| 要点 | slide → fade |
| 流程 | scale → rise |
| 表格 | cascade → fade |
| 金句 | mark → rise |
| 对比 | slide → fade |
| 时间轴 | line → pulse |

变体仅动效维度（位移方向/时序），布局与色彩 token 不变；主题可增删变体名（bullets 另有 fade）。

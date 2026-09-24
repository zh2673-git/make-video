# DESIGN.md —— techdark 科技暗色

> 源头：移植型（awesome-design-md:linear.app 底稿）| 完整范式见 govgold 版。

## 1. Visual Theme

美学运动：**「深空仪表」**。Linear 系深空底、紫青双强调、发光感数据面板。适合技术教学、工具演示。

## 2-3. 色板与字体（要点）

- 底色三阶：#0F1015（内容）/ #171821（卡片）/ #1E2030（斑马纹）；ink #E8EAF2。
- primary #5E6AD2（Linear 紫），accent #4CC9F0（青，发光感）；封面用紫色 radial 光晕。
- 字体 Segoe UI 栈 + JetBrains Mono；高亮行用 accent 的 14% 透明（暗色主题不能用品实色高亮）。

## 4-6. 组件/布局/层次（裁剪决策）

- 页眉页脚 #17182A→#1E2038 渐变；上缘金线改为 1px accent 半透明。
- 语义色：success #3ED598 / info=accent / warning #F5C15C；terminalBg #0B0C10（比内容更深）。
- 阴影在暗底上无效——用 1px rgba(255,255,255,0.06) 描边 + accent 光晕（0 0 24px rgba(76,201,240,0.15)）替代。

## 7. Do / Don't

- Do：数字/代码一律 mono；卡片描边比阴影重要。
- Don't：禁止大面积纯白；禁止暖色系；禁止浅色主题的实体高亮行。

## 10. Motion & Video Rules

spring damping=140/stiffness=110（利落）；fade 12；stagger 9；字幕条 rgba(5,6,10,0.72) 浅灰字。

## 10.1 动效变体池（v0.0.2）

6 个常用版式各配入场动效池；组件按同版式出现序号轮换（相邻分镜不重复），第 1 变体为默认动效。本主题取值：

| 版式 | 池（按轮换序） |
|---|---|
| 要点 | slide → rise |
| 流程 | scale → rise |
| 表格 | cascade → fade |
| 金句 | mark → rise |
| 对比 | slide → fade |
| 时间轴 | line → pulse |

变体仅动效维度（位移方向/时序），布局与色彩 token 不变；主题可增删变体名（bullets 另有 fade）。

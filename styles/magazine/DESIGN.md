# DESIGN.md —— magazine 极简杂志

> 源头：移植型（awesome-design-md 极简编辑风底稿 + Linear 单强调色）| 完整范式见 govgold 版。

## 1. Visual Theme

美学运动：**「静默字距」**。黑白灰为骨、Linear 紫 #5E6AD2 唯一强调、大留白细字距。像一本印刷精良的杂志内页——克制、精确、呼吸感。

## 2-3. 色板与字体（要点）

- 主色是"墨黑" #111111（页眉页脚是黑色而非彩色）；accent 紫只允许出现在：STEP 标签、高亮行、图例、VS 章。
- surface 纯白；斑马纹 #F7F7F8；inkMuted #6B6F76。
- display/title 比政务版 +10px（杂志大标题气质）；动效 damping=200（几乎无弹跳，像纸面平移）。

## 4-6. 组件/布局/层次（裁剪决策）

- 安全区 110px（更宽留白）；页眉高度 100（更扁）；radius 12。
- 语义色克制：success #0E9F6E / info=accent 紫 / warning #D97706。
- 阴影两级且更淡（0.06/0.10）——纸面不悬浮。

## 7. Do / Don't

- Do：黑底白字页眉是"杂志刊头"；数据数字可用 mono 字体。
- Don't：禁止第二强调色；禁止渐变彩色；禁止装饰性图形。

## 10. Motion & Video Rules

fade 10 帧；stagger 8；tableRowDelay 5——整体比 govgold 快 20%（杂志阅读节奏）。字幕条 rgba(17,17,17,0.72)。

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

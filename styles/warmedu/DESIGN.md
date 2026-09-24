# DESIGN.md —— warmedu 暖色教育

> 源头：原创（canvas-design 方法论）| 完整范式见 govgold 版。

## 1. Visual Theme

美学运动：**「奶油橙光」**。奶油底、暖橙主色、大圆角亲和气质。适合大众科普、少儿向、生活技巧类微课。

## 2-3. 色板与字体（要点）

- primary #E8590C 暖橙（页眉页脚/序号/边条）；accent #F59F00 芒果黄；底 #FFFBF5 奶油。
- ink #3D2E23 暖墨（不用纯黑——暖主题里纯黑太硬）；斑马纹 #FFF0E0。
- radius 24（全库最大圆角）；字号与 govgold 同阶。

## 4-6. 组件/布局/层次（裁剪决策）

- 卡片白底 + 橙边条；高亮行 #FFF3BF（柠檬奶油）。
- 语义色正常饱和（success #2F9E44 / info #1971C2 / warning=accent）。
- 阴影暖化：统一 rgba(61,46,35,0.10)（阴影带棕调不发灰）。

## 7. Do / Don't

- Do：圆角加大、图形圆润；徽章可用 accent 填充。
- Don't：禁止冷灰蓝；禁止直角；禁止暗黑系终端以外的深色块。

## 10. Motion & Video Rules

spring damping=100/stiffness=90（活泼一点）；stagger 11；fade 13；字幕条 rgba(43,26,12,0.62) 奶白字。

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

# DESIGN.md —— chalkboard 黑板手写

> 源头：原创（canvas-design 方法论）| 完整规范范式见 styles/govgold/DESIGN.md，本文只记差异决策。

## 1. Visual Theme

美学运动：**「粉笔晨课」**。墨绿板面、粉笔白字、粉笔黄强调，楷体手写气质。像老师清晨在黑板上写下的板书——亲切、手作、专注。信息用"板书块"组织，禁止精密商务感。

## 2-3. 色板与字体（要点）

- 板面 #2E5D3E（内容底），深端 #1F3F2B（页眉页脚渐变）；粉笔白 #F5F1E6 为 ink；粉笔黄 #F2C94C 为 primary/accent 双角色（onPrimary 用板面深绿保证对比）。
- 卡片=浅一档的板面 #356A49（不做白卡！白卡破坏黑板隐喻）；斑马纹 #274D35。
- 字体：正文楷体栈「KaiTi / STKaiti」，代码 Cascadia Code；字号整体 +2px（手写感需要更大呼吸）。

## 4-6. 组件/布局/层次（裁剪决策）

- 页眉页脚横渐变同 govgold 结构，但**无金线**——用 2px 粉笔白虚线边框代替装饰线。
- 语义色降饱和（success #8FD694 / info #8FC7E8），像彩色粉笔点缀。
- 阴影禁止（黑板是平面的）；用 1px rgba(255,255,255,0.08) 内描边区隔层次。

## 7. Do / Don't

- Do：圆形/手绘感圆角（10px）；板书块可轻微不规则。
- Don't：禁止纯白背景；禁止锐利直角；禁止高饱和商务色。

## 10. Motion & Video Rules

spring damping=110/stiffness=80（比 govgold 更绵软，像手写节奏）；stagger 12 帧；fade 14 帧；字幕条 rgba(0,0,0,0.45) 粉笔黄白字。

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

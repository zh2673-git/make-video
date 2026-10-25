# PLAN v3：12 文档全量对齐（电影级完备 skill）

> 依据 2026-10-24 全量审计：99 条 V-* 条款 → 完整实现 24 / 部分 20 / 缺失 43 / 错标 8。
> 验收样例：黑洞是怎么形成的-mvmb1dqz（56 镜 / 196.7s / 端到端无人工救场）✓
>
> 下方 P0-P4 为 2026-10-24 的历史快照；后续迭代记录接在本节之后。

## 2026-10-25 运镜自由度与硬约束降级 ✓（代码/测试完成，待确认后重渲）

**问题（用户反馈）**：每一镜结尾都像"突然放大一下"；运镜与动效不够自由、盲重复。

**取证结论**：确实来自项目硬约束，而非模型风格。

1. `planCameraRig` 末段 ease 强制 `power2.in`（加速收势），且 push-in 终值是
   `1 + amp*1.16`（最大）——每镜都在最高速时切走。
2. `deriveCoverage` 对 ≥3.8s 且含重音词的镜头**自动**插 `punch-in 1.16` 硬跳；
   本片 37 镜派生 29 刀，与 V-CAM-005「急推全片≤2 次」自相矛盾。
3. `camera:'none'/'static'` 是**假静止**：default 分支仍从 `amp*0.10` 推到 `amp*0.54`。
4. 幅度只由景别决定（与镜头长短无关），方向由 `shotId` 哈希决定（与构图无关）。
5. V-CAM-002（error）与 V-RHY-010（逐镜 warn）把"每镜必有外层机位"写成铁律。

**理论依据与项目文档的对照**

| 结论 | 依据 | 项目文档现状 |
|---|---|---|
| 运动要有动机，静止也是选择 | Lumet《Making Movies》：没有理由就别动机位；Bordwell《电影艺术》：静止构图 + 镜内表演是成熟语言（小津/北野武/死板喜剧） | V-CAM-002/V-RHY-010 把"无外层机位"等同于幻灯片，误判 |
| Ken Burns 只用于静态图 | Ken Burns 是为**静态照片**注入运动的纪录片手法 | V-CAM-006 已正确限定"静态用户图片"；V-RHY-010 却引用它要求每镜必动，属越界扩写 |
| 切点前应收住运动 | Murch《眨眼之间》Rule of Six：情绪 51% > 眼位 7%；切在视线静止处最不刺眼 | 引擎反其道而行：末段加速到切点 |
| 急推是标点不是常态 | 韦斯·安德森式 snap zoom / 港片急推是低频强调 | V-CAM-005 写"全片≤2 次"，自动派生却造了 29 次 |
| 覆盖是开机前的导演决策 | 镜头清单（master/单人/插入）在拍摄前定，不能由后期代剪 | docs/04 把 coverage 写成导演可选字段，代码却默认自动派生 |
| 表演语汇自带静止 | comedy-pop 风格包 `performance` 写"定格+内心独白" | 与"每镜必动"直接冲突 |

**方案（保留不可例外的安全边界，降级创作类约束）**

- 末段 ease 默认 `power2.out`（减速落定）；`punchOut` 显式开启才 `power2.in`。
- `deriveCoverage` 自动派生默认关闭，逐镜 `visual.params.autoCoverage=true` 才开；
  导演声明的 `coverage` 始终生效（那是导演的镜头清单）。
- `static/none` 变成真静止：不生成机位分段，`buildRigScript` 返回空串。
- 行程随镜长缩放（`clamp(镜长/3.5, 0.45, 1)`）：短节拍镜不给满幅位移。
- 方向改由构图推导（主体偏左就往右带，回到中轴），哈希只做正中的平局裁决。
- 新增逐镜覆写 `cameraAmp`（0-2.5）/ `cameraPunchOut` / `cameraDir`（读 `visual.params`）。
- V-CAM-002 改为**词表校验**（未登记词报 error，static 合法）；V-RHY-010 改为
  **全片配比统计**（静止占比 >60% 或运动式 <2 种才 warn）；V-RHY-004 由"三路全中"
  改为"三路至少两路"（静止镜的机位腿由主体 pulse 承担）。

**替代选项与取舍**

- 只改默认值、保留"每镜必动"：不解决 V-CAM-002 的 error 级拦截，用户仍无法写静止镜。
- 完全删掉 V-CAM-002/V-RHY-010：失去"全片全是静止"的兜底报警，且拼错运镜词会静默退化。
- 选当前方案：**安全边界（词表/同步/重叠/累积上限）不动，创作自由度（动不动、多快、往哪、切不切）交还导演**。
  静止镜仍有 60% 配比闸、重音仍有 ≥2 路载体闸，画面不会退化成真幻灯片。

**验收**

- 71/71 单元测试通过（新增：覆盖切默认关、末段 settle/punchOut、真静止、amp/dir 覆写）。
- 存量工程：`--only` 重合成后 `logs/camera-rig.json` 应出现 `segments: []` 的静止镜、
  末段 `ease` 全为 `power2.out`（除显式 punchOut）；`cut-audit.json` 的 microCuts 归零。
- **重渲待用户确认后执行**（本方案只出代码，不出片）。

## 2026-10-25 风格素材语言 + 3D 原语 ✓（全部完成）

**审计结论**：风格包此前只管配色/字体/节奏，场景按旁白语义独立选型，两条链路正交——
结果可能是"配色像这一派、画材不像"；引擎也没有真正的 3D 能力，纵深只能靠缩放糊弄。

**方案与取舍**

- 风格包新增 `visuals` 素材语言契约（`dimension` / `motifs` / `sceneBias` / `sceneDeny` /
  `texture` / `note`）。为什么这么做：风格是"画什么 + 怎么画"的统一约束，配色只是其中一层。
  替代选项：只在 prompt 里写风格描述（不可校验、每次漂移）／维护固定模板表（无风格自由度）。
  为什么这样选：契约可 schema 校验、路由确定性可测，LLM 链与离线链共用同一份约束。
- 分镜候选池路由：`sceneDeny` 剔除、`sceneBias` 同分前置、全禁用回退原池；
  LLM 选到池外形态强制回退，漂移由 V-STYLE-008 记录。
- 5 个 CSS 3D 原语（orbit / depth / tilt3d 等）+ 2 个 3D 场景模板（iso-stage / depth-layers）。
  替代选项：WebGL/three.js（新增依赖、快照不稳定）／只写 prompt（不可复现）。
  为什么这样选：零依赖、GSAP 有界补间、逐帧 seek 纯函数可复现。
- V-STYLE-008 一致性校验（场景侧 + compose 闸门）：bias/deny 冲突报错；镜头用禁用形态、
  2d 场景混 3D、css3d 场景无 3D/无母题逐镜告警。
- 7 个风格包全部登记 `visuals`（周星驰式 css3d / 电影感暗调 mixed / 苹果发布会 2d …）。

**完成情况**：代码、7 个风格包配置、文档（docs/05、docs/10、docs/11、SKILL.md、README.md）全部落地。

**验收**

- 70/70 单元测试通过（含 tests/style-visual.test.ts 13 条）。
- 真实 Chromium 逐帧 seek：同一 t 两次截图 SHA256 完全一致（3D 可复现）；不同 t 画面确实变化。
- 两个 3D 模板在 css3d 风格下过校验、在 2d 风格下正确触发 V-STYLE-008 告警。
- 演示片 `demos/style-material-3d.mp4`（12s / 1920×1080 / 30fps，无音轨）：
  ① 周星驰式 css3d 等距舞台 ② 电影感暗调 mixed 三层纵深 ③ 苹果发布会 2d 平面排版，
  三镜帧间像素变化均确认（3D 转台/景深推进/排版进入各自生效）。

**附带修复**：`MV.camera` 的 `fromTo/set` 未传 position，被 GSAP 追加到时间线末尾
（实测 camera 起点排到 47s，整镜推轨等于没发生）→ 全部显式传 `0`，全片机位运动恢复。

## P0 错标与失效修复 ✓（全部完成）

- [x] V-SCENE-005 ID 冲突归位；V-RHY-002 warn→error；V-STYLE-004 warn→error
- [x] V-RHY-007 借号修正；V-SCP-001 去架空（缺功能即 error）；render.log ensureDir

## P1 电影级密度核心 ✓（全部完成）

- [x] W1 编剧密度：TARGET_SEGMENTS 按密度推导（30/90/144）；Script IR 补 mood/emphasis/pausesMs；
  V-SCP-004 钩子前置（error）+ V-SCP-005 字数档位（warn）；--script 注入同过校验（堵豁免通道）
- [x] W2 剪辑节奏：V-RHY-001 剪切点候选集（error）+ A8 cut-audit.json；
  V-RHY-004 重音三联动（error，compose 联合检查）；V-RHY-006 节拍密度（warn，data-beats）
- [x] W3 分层画面引擎：canvas 程序时长自适应缩放（K 系数）；主体 pulse 节拍；
  V-CAM-006 分镜层默认运镜（none 禁止）；V-COMP-005 排版律下限扫描（error）
- [x] W4 镜头库：canvas:s01~s08 程序族轮转 + beat 章节名 kicker + 色温三循环

## P2 声音部完备 ✓（全部完成）

- [x] MixPlan schema + 工件入 IR（A9）；DUCK_RATIO 死代码激活（sidechaincompress ducking）
- [x] 程序化 BGM（三正弦 pad + tremolo + lowpass）；whoosh@甩镜/擦除/横推 / hit@冲击切与重音镜（硬切、溶解不出音效）
- [x] timeline.sfx 真数据（V-CMP-005 校验器停止空转）；BGM/音效 clip 进渲染工程
- [x] subtitles.srt 导出（emphasis 词优先高亮）；V-SND-001 三层混音校验（error）

## P3 导演/美术工件（部分完成，余项见"遗留"）

- [x] 色彩脚本：Shot.colorTemp 字段 + V-COL-002（error）/ V-COL-003（warn）
- [x] A6 摄影计划 / A7 表演设计工件（logs/artifacts/*.json）
- [x] V-MOT-008 时长 token 纪律（warn）；V-SCENE-005 复述旁白归位
- [x] 场景扫描族（2026-10-24）：V-MOT-001 缓动白名单 / V-MOT-004 staging 透明度 / V-MOT-005+V-ACT-004 位移急停 /
  V-MOT-008 时长档位(error) / V-MOT-010+011 并发约束 / V-COMP-001 主语唯一 / V-ACT-005 长镜微动（warn）；
  模板实修：comparison 运动目标 5→3（V-MOT-010）、comic-symbol 强调 900→1200（V-MOT-008）、
  atmosphere 云层 4000→2000、hint 0.85→0.7（V-MOT-004）；scripts/check-templates.ts 消除 {{token}} 盲区
- [x] V-STYLE-003 组合确认门（error：流程门）：agent 自由组合（lineage/overrides 非空且非 user-specified）
  即使 --yes 也停在 storyboard，须 make-video confirm 显式放行；3 条单测
- [x] 「根据剧本拍电影」两层落地（2026-10-24）：
  ① 语义分镜确定性层 src/domain/scene-semantics.ts——templateStoryboard 禁止索引轮转（凑镜头数根源），
  按旁白关键词选 MV 模板（流程/对比/数据/氛围）与 canvas 程序主题（s01 引力钩子…s08 终幕）；
  零命中走全历史 LRU，8 程序全片均匀覆盖、相邻不重复；scripts/semantics-report.ts 用参考片 56 段实测
  （分布 s01:11/s02:7/s03:6/s04:9/s05:6/s06:5/s07:7/s08:5，恒星死亡章节集中命中 s04、EHT 章节命中 s07）
  ② LLM scene 个性化接线 + 带反馈重试——drawScene 先走 LLM 生成（SCENE_SYSTEM_PROMPT 硬性契约），
  校验器意见回传重试 SCENE_LLM_RETRIES=2 次，耗尽/无 scene 能力回退 forge 兜底；工件记 origin=llm/forge；
  ensureAssets/state-engine 贯穿 llm；tests/semantics.test.ts 8 条
- [x] agent 场景接入面（2026-10-24）：CLI `scene --shot <id> --from <html>`（adoptSceneFile）校验+落盘+时间线作废，
  未过校验返回逐条反馈；drawScene 幂等化——Scene_*.html 已存在则校验后沿用（agent/人工精修受保护），
  违规精修带反馈报错；canvas+MV 混合评分（强语义 ≥2 线索切异质形式，cosmos 配方混入 chart/comparison/flow；
  flow/comparison 卡片去裸色 #fff→token）；跨阶段自动重试修复（failed 只许→pending，runBatch 回退上游
  sourcing 幂等重做并返回回退标志）；验收片3：黑洞是怎么形成的-mvmdcr9y（56镜/5900帧/196.7s，
  chart 落位 s39）；【渲染铁律】长渲染必须台前进程跑，Start-Process 后台链路会被环境回收
  （render_cancelled_parent_exited 两次复现）
- [x] 逐镜原创成为默认（SKILL.md 工作规则第 8 条铁律）：配音完成后、合成前，agent 必须逐镜亲手作画
  （读旁白+导演批注 → 专属构图与动效 → make-video scene 过闸落盘，不过闸按反馈改）；
  模板 forge/语义轮转仅为无 agent 兜底；已落盘场景受幂等保护
- [x] 端到端实证：黑洞是怎么形成的-mvmffyrf——agent 逐镜手写 56 幕原创场景（scripts/scenes-a/b/c.cjs，
  美术方向「观测者之眼」，每镜独立构图：命名环/问号/拔河/点云坍缩/双钟/漏斗/天平/暂停符/秒表/
  分叉图/条形对比/旋臂星系/质量阶梯/银心/数字读出/轨迹追踪/噪声显影金环/对勾纸页/瞳孔/双联画/
  帷幕揭示/心轨/书页掀角），56/56 过 V-* 闸门，196.7s 1080p h264+aac；
  scripts/adopt-all.mts 批量接入 + scripts/reset-stage.mts 阶段回拨（done→compose 重合成）
- [ ] 遗留：V-MOT-002/003/006/007/012、V-ACT-001~003/006、V-COMP-003/004/006/007、
  V-CHT-002/003/004、template-gallery 索引 + SceneProps zod、LLM scene 个性化接线 + 带反馈重试、
  V-COL-005 色板家族、V-STYLE-002 弱项补齐/003 组合确认门/007 漂移检测

## P4 工程完备（部分完成，余项见"遗留"）

- [x] V-RND-002 渲染锁；V-RND-003 补分辨率校验；doctor 补 chrome 检查
- [x] V-STE-002 逐镜先持久化（并发 save 原子写按文件串行化 + EPERM 退避重试）；
  V-STE-005 destroy 逆序（stop→释放副本；clean 只回收中间产物，out/与 project.json 永不回收）；
  logs/run.log append-only JSONL 事件日志（emit 统一出口，带 ts）；tests/engineering.test.ts 3 条
- [x] 新配方 cosmos-cinematic（canvas 模板族）+ 风格包 cinematic-dark
- [ ] 遗留：CLI ChangeStyle/ReplaceMaterial、recipe-save、v1.5 两风格包、
  测试矩阵（每 V-* 一条单测；当前 35 条测试）

## 验收记录（2026-10-24）

- 参考片：projects/黑洞是怎么形成的-mvmb1dqz/out/*.mp4 — 196.67s（3:16），56 镜，
  全流程 `init --script → storyboard → confirm → run --yes` 一次通过，零人工救场。
- 触发并拦截过的真实违规（证明闸门有效）：beat 名不匹配（V-SCP-003）、注入讲稿缺功能（V-SCP-001）、
  运镜缺失（V-RHY-004）、模板表演缺位（flow.html 静默失配被三联动暴露）。
- 交付物：mp4 + subtitles.srt + cut-audit.json + mixPlan（IR）+ photography/performance 工件。
- 测试：29/29 通过（tsc 0 错误）。

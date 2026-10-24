# PLAN v3：12 文档全量对齐（电影级完备 skill）

> 依据 2026-10-24 全量审计：99 条 V-* 条款 → 完整实现 24 / 部分 20 / 缺失 43 / 错标 8。
> 验收样例：黑洞是怎么形成的-mvmb1dqz（56 镜 / 196.7s / 端到端无人工救场）✓

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
- [x] 程序化 BGM（三正弦 pad + tremolo + lowpass）；whoosh@剪切点 / hit@重音镜
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

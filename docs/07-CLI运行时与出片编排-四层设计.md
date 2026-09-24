# 07-CLI 运行时与出片编排-四层设计（runtime/ + application/ + infrastructure/）

- **本质**：在"成片运行时"的时空约束下，本模块是把外部命令调度为确定性出片管道的**时空管家**——显式管理 init/start/stop/destroy 全生命周期。
- **数据规范**：命令契约（docs/03 §5）；错误码：E1 工程配置缺失、E2 DSL 校验失败、E3 主题缺失、E4 TTS 数量不一致、E5 渲染非零退出、E6 拼接失败。
- **数据存储**：工程空间 `projects/{name}/`（讲稿/project.json/输出）；引擎缓存 `engine/public/audio/`、`engine/out/segments/`（按 scene id 命名，增量复用单位）。
- **数据流转**：
  - `application/pipeline.py` 三用例：`build_full`（TTS→对齐→写 gen→整片渲染）、`build_incremental(only)`（对齐→逐段命中判断→补渲缺失段→`-c copy` 拼接）、`preview_theme`（固定 6 样例分镜定长帧→渲染 PNG）。
  - Chrome 路径探测：环境变量 `CHROME_PATH` → 默认 `C:\Program Files\...\chrome.exe`（绕开被墙的无头浏览器下载）。
- **数据接口**：CLI 四命令（docs/03 §5）；infrastructure 三个封装：`tts.synth(scene,voice,rate)→audioSec`、`renderer.render_full/segment/concat/preview`、`themeio.load/validate/list`。
- **生命周期钩子**（runtime/cli.py 显式编排）：
  - `init`：读 project.json → parse_script（含 DSL 断言）→ load_theme（含校验）→ 解析 --only/--no-tts 开关。
  - `start`：逐分镜 TTS（edge-tts 词级时间戳取末词终点）→ align_timeline → split_captions → 写 scenes.gen.json + theme.gen.json。
  - `stop`：断言 mp3 数=分镜数（增量模式断言分段文件集完整）。
  - `destroy`：调 renderer 渲染/拼接 → 成片落盘 → 打印产物路径；失败 E5/E6 即 exit，不覆盖旧成片。
- **脱密边界**：引擎不读业务 CSV；分镜 JSON 仅含讲稿演示内容；合规文案由 meta 显式注入。
- **幂等性**：全流程可重跑（覆盖输出不报错）；TTS 可 `--no-tts` 复用（mutagen 读时长）。

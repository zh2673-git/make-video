# -*- coding: utf-8 -*-
"""[时空层级：流转-编排（调度时空）] application/pipeline.py —— 出片用例编排

三种时间线组装：build 全量 / build --only 增量 / preview 主题试帧。
init=解析+校验 → start=TTS+对齐 → stop=数量断言 → destroy=渲染落盘，失败即停。
"""
import json
import os
import re

from makevideo.core.errors import ProjectError, TtsCountError
from makevideo.core.schema import validate_scenes
from makevideo.domain.composer import compose_script as compose_draft
from makevideo.domain.composer import render_markdown
from makevideo.domain.parser import parse_script
from makevideo.domain.timeline import FPS, TAIL_FRAMES, align_timeline
from makevideo.infrastructure import renderer, tts
from makevideo.infrastructure.themeio import load_theme

PKG_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(PKG_DIR, "engine")
GEN_JSON = os.path.join(ENGINE, "src", "scenes.gen.json")
THEME_GEN = os.path.join(ENGINE, "src", "theme.gen.json")
META_GEN = os.path.join(ENGINE, "src", "meta.gen.json")
AUDIO_DIR = os.path.join(ENGINE, "public", "audio")

PREVIEW_FRAMES = 90  # 试帧每分镜定长 3s

# 主题试帧固定样例（覆盖主要版式；跳过 TTS，caption 用旁白首句）
SAMPLE_SCENES = [
    {"id": "p1", "type": "title", "title": "主题试帧标题", "subtitle": ["副标题一", "副标题二"]},
    {"id": "p2", "type": "bullets", "title": "要点版式", "bullets": ["第一要点：空间与时间双契约", "第二要点：主题 token 消费", "第三要点：增量渲染提速"]},
    {"id": "p3", "type": "flow", "title": "流程版式", "bullets": ["讲稿", "配音", "渲染", "成片"]},
    {"id": "p4", "type": "table", "title": "表格版式", "header": ["指标", "数值", "等级"], "rows": [["指标A", "86", "优秀"], ["指标B", "43", "良好"], ["指标C", "17", "合格"]], "highlight": "指标A"},
    {"id": "p5", "type": "quote", "title": "金句版式", "quote": "让数据说话，让线索浮出水面。", "attribution": "—— makevideo"},
    {"id": "p6", "type": "compare", "title": "对比版式", "leftTitle": "传统方式", "rightTitle": "自动管线", "bullets": ["逐页排版|一键出片", "风格写死|主题可换"]},
    {"id": "p7", "type": "timeline", "title": "时间轴版式", "bullets": ["第1周|需求确认", "第2周|设计评审", "第3周|发布上线"]},
    {"id": "p8", "type": "chart", "title": "图表版式", "header": ["项目", "数值"], "rows": [["项目A", "86"], ["项目B", "43"], ["项目C", "17"]], "note": "单位：分"},
    {"id": "p9", "type": "code", "title": "代码版式", "lang": "python", "bullets": ["import pandas as pd", "df = pd.read_csv('微信账单.csv')", "freq = df.groupby(['本方', '对方']).agg(金额=('金额', 'sum'))"]},
    {"id": "p10", "type": "ending", "title": "谢谢观看"},
]


def load_project(project_dir: str) -> dict:
    """读工程配置（init 前置：空间就绪检查），缺省字段自动填充。"""
    cfg_path = os.path.join(project_dir, "project.json")
    if not os.path.isfile(cfg_path):
        raise ProjectError(f"工程配置缺失: {cfg_path}")
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    cfg.setdefault("name", os.path.basename(os.path.abspath(project_dir)))
    cfg.setdefault("script", "讲稿.md")
    cfg.setdefault("theme", "govgold")
    cfg.setdefault("meta", {})
    cfg.setdefault("output", f"out/{cfg['name']}.mp4")
    script_path = os.path.join(project_dir, cfg["script"])
    if not os.path.isfile(script_path):
        raise ProjectError(f"讲稿缺失: {script_path}")
    cfg["_project_dir"] = os.path.abspath(project_dir)
    cfg["_script_path"] = script_path
    return cfg


def _write_gen(theme: dict, meta: dict, scenes: list) -> None:
    """start 产物落盘：三份 gen 文件（engine 的唯一输入空间）。"""
    meta_view = {k: meta[k] for k in ("unit", "author", "compliance", "footer") if k in meta}
    json.dump(meta_view, open(META_GEN, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(theme, open(THEME_GEN, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(scenes, open(GEN_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def build(project_dir: str, only: set | None = None, skip_tts: bool = False,
          skip_render: bool = False, theme_override: str | None = None) -> dict:
    """出片主用例。返回统计信息。"""
    # ---- init：解析 + 校验（空间开辟） ----
    cfg = load_project(project_dir)
    meta, scenes = parse_script(cfg["_script_path"], overrides=cfg["meta"])
    validate_scenes(scenes)
    theme = load_theme(theme_override or cfg["theme"])
    os.makedirs(AUDIO_DIR, exist_ok=True)

    # ---- start：TTS + 帧对齐（时间流启动） ----
    tts_cache = os.path.join(cfg["_project_dir"], "gen", "tts.json")
    if skip_tts:
        cache = json.load(open(tts_cache, encoding="utf-8")) if os.path.isfile(tts_cache) else {}
        for s in scenes:
            if s["id"] not in cache:
                print(f"[TTS][WARN] scene-{s['id']} 无时长缓存，用 mp3 实际时长（含尾部静音，略长）")
            tts.reuse(s, AUDIO_DIR, cache.get(s["id"]))
    else:
        for s in scenes:
            tts.synth(s, AUDIO_DIR, meta.get("voice", "zh-CN-YunjianNeural"), meta.get("rate", "+0%"))
        os.makedirs(os.path.dirname(tts_cache), exist_ok=True)  # 词级时长缓存：--no-tts 复用的对齐依据
        json.dump({s["id"]: s["audioSec"] for s in scenes}, open(tts_cache, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if not all("audioSec" in s for s in scenes):  # stop 断言：音频数=分镜数
        raise TtsCountError("TTS 音频与分镜数量不一致")
    total = align_timeline(scenes, FPS, TAIL_FRAMES)
    _write_gen(theme, meta, scenes)
    print(f"[OK] scenes.gen.json：{len(scenes)} 分镜，总时长 {total / FPS:.1f}s（{total / FPS / 60:.1f} 分钟）")

    # ---- destroy：渲染落盘 ----
    out_rel = cfg["output"].replace("\\", "/")
    if not skip_render:
        os.makedirs(os.path.join(ENGINE, "out", "segments"), exist_ok=True)
        if only is not None:
            start = 0
            for s in scenes:
                n, end = s["frames"], start + s["frames"] - 1
                seg_abs = os.path.join(ENGINE, "out", "segments", f"scene-{s['id']}.mp4")
                if s["id"] in only or not os.path.exists(seg_abs):
                    renderer.render_segment(ENGINE, s["id"], start, end)
                    print(f"[SEG] scene-{s['id']} 已渲染（帧 {start}-{end}，{n / FPS:.1f}s）")
                else:
                    print(f"[SEG] scene-{s['id']} 复用缓存")
                start += n
            renderer.concat_segments(ENGINE, [s["id"] for s in scenes], out_rel)
        else:
            renderer.render_full(ENGINE, out_rel)
        print(f"[OK] 成片 -> {os.path.join(ENGINE, out_rel.replace('/', os.sep))}")
    return {"scenes": len(scenes), "frames": total, "output": out_rel}


def validate_project(project_dir: str) -> dict:
    """仅校验不出片：DSL + 主题 + 工程配置。"""
    cfg = load_project(project_dir)
    meta, scenes = parse_script(cfg["_script_path"], overrides=cfg["meta"])
    validate_scenes(scenes)
    load_theme(cfg["theme"])
    return {"project": cfg["name"], "theme": cfg["theme"], "scenes": len(scenes),
            "types": sorted({s["type"] for s in scenes})}


def compose_script(input_path: str, out_path: str | None = None, dry_run: bool = False) -> dict:
    """纯文本讲稿 → 自动分镜讲稿.md（草稿）。生成即校验，落盘后回读复验（round-trip 自证）。"""
    try:
        text = open(input_path, encoding="utf-8").read()
    except OSError as e:
        raise ProjectError(f"输入文本不可读: {input_path} ({e})")
    if "## SCENE" in text:
        raise ProjectError("输入已含 SCENE 分镜块：该讲稿已有版式声明，直接 build 即可")
    scenes = compose_draft(text)
    validate_scenes(scenes)  # 生成即校验：草稿保证 E2 干净
    out_path = out_path or re.sub(r"\.(txt|md)$", "", input_path) + "_分镜.md"
    if not dry_run:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(render_markdown(scenes))
        _, reread = parse_script(out_path)  # round-trip：产物必须能被 parser 原样解析
        validate_scenes(reread)
    print(f"[COMPOSE] {len(scenes)} 镜（" + ("dry-run 预览" if dry_run else f"-> {out_path}") + "）")
    for s in scenes:
        print(f"  {s['id']}  {s['type']:<9} {s.get('why', ''):<24} | {s['title'][:20]}")
    return {"scenes": len(scenes), "out": None if dry_run else out_path}


def preview_theme(theme_name: str, out_dir: str | None = None) -> list:
    """主题试帧：6 样例分镜 × 中间帧 PNG（跳过 TTS，定长帧）。"""
    theme = load_theme(theme_name)
    out_dir = out_dir or os.path.join(PKG_DIR, "preview", theme_name)
    os.makedirs(out_dir, exist_ok=True)
    scenes = []
    for tpl in SAMPLE_SCENES:
        s = {**tpl, "narration": tpl.get("quote") or tpl["title"],
             "frames": PREVIEW_FRAMES, "audio": "audio/silent.mp3",
             "captions": [{"from": 0, "to": PREVIEW_FRAMES, "text": tpl["title"]}]}
        scenes.append(s)
    _write_gen(theme, {"unit": "主题试帧", "compliance": "STYLE PREVIEW"}, scenes)
    produced = []
    start = 0
    for s in scenes:  # 逐分镜渲染中间帧（绝对路径：render cwd 在 engine）
        frame = start + PREVIEW_FRAMES // 2
        abs_png = os.path.join(out_dir, f"{s['type']}.png").replace("\\", "/")
        renderer.render_still(ENGINE, frame, abs_png)
        produced.append(abs_png)
        start += PREVIEW_FRAMES
        print(f"[PREVIEW] {s['type']} -> {abs_png}")
    print(f"[OK] 主题试帧 x{len(produced)} -> {out_dir}")
    return produced

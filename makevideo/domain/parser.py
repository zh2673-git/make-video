# -*- coding: utf-8 -*-
"""[时空层级：数据流转-规则（业务时空）] domain/parser.py —— 讲稿解析器（纯函数）

讲稿.md（唯一源头）→ Scene 列表。DSL v2：支持 12 型分镜与全量画面指令。
基础子集：仅用六型基础版式 + meta 三键的早期格式讲稿零改动可解析。
"""
import re

from makevideo.core.errors import ProjectError

# 画面区 "key: value" 指令（小写键）→ Scene 规范驼峰字段
_DIRECTIVES = {"subtitle": "subtitle", "highlight": "highlight", "note": "note",
               "quote": "quote", "attribution": "attribution", "lang": "lang",
               "image": "image", "imagenote": "imageNote", "lefttitle": "leftTitle",
               "righttitle": "rightTitle", "cellcolor": "cellColor"}


def parse_meta(text: str) -> dict:
    """解析 `<!-- meta: k=v k=v -->`。"""
    meta = {}
    m = re.search(r"<!-- meta: (.*?) -->", text)
    if m:
        for kv in m.group(1).split():
            k, _, v = kv.partition("=")
            if k:
                meta[k] = v
    return meta


def _parse_cell_colors(line: str) -> dict:
    """`cellColor: 双平台交叉=#1E7B34, 仅话单=#2B6CB0` → dict。"""
    out = {}
    for pair in line.split(","):
        k, _, v = pair.partition("=")
        k, v = k.strip(), v.strip()
        if k and v:
            out[k] = v
    return out


def parse_script(md_path: str, overrides: dict | None = None):
    """解析讲稿 → (meta, scenes)。overrides（project.json meta）优先于讲稿内嵌 meta。"""
    try:
        text = open(md_path, encoding="utf-8").read()
    except OSError as e:
        raise ProjectError(f"讲稿不可读: {md_path} ({e})")
    meta = {"voice": "zh-CN-YunjianNeural", "rate": "+0%"}
    meta.update(parse_meta(text))
    if overrides:
        meta.update({k: v for k, v in overrides.items() if v})

    scenes, subs, bullets, rows = [], [], [], []
    for block in re.split(r"\n## SCENE ", text)[1:]:
        head, _, body = block.partition("\n")
        parts = [p.strip() for p in head.split("|")]
        if len(parts) < 3:
            raise ProjectError(f"SCENE 头格式错误（应为 id|type|title）: {head[:60]}")
        sid, stype, title = parts[0], parts[1], "|".join(parts[2:])
        visual, _, narration = body.partition("=== narration")
        scene = {"id": sid, "type": stype, "title": title}
        subs, bullets, rows = [], [], []
        for line in visual.strip().splitlines():
            line = line.strip()
            if not line:
                continue
            if line.startswith("- "):
                bullets.append(line[2:].strip())
            elif line.startswith("|"):
                rows.append([c.strip() for c in line.strip("|").split("|")])
            else:
                key, _, val = line.partition(":")
                key = key.strip().lower()
                val = val.strip()
                if key in _DIRECTIVES and val:
                    field = _DIRECTIVES[key]
                    if field == "subtitle":
                        subs.append(val)
                    elif field == "cellColor":
                        scene["cellColors"] = {**scene.get("cellColors", {}), **_parse_cell_colors(val)}
                    else:
                        scene[field] = val
        if stype in ("table", "panorama", "chart") and rows:
            scene["header"], scene["rows"] = rows[0], rows[1:]
        elif stype == "compare" and rows:  # compare 亦可用表格行（左|右）
            scene["pairs"] = rows
        elif bullets:
            scene["bullets"] = bullets
        if subs:
            scene["subtitle"] = subs
        scene["narration"] = narration.strip()
        scenes.append(scene)
    return meta, scenes

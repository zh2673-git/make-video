# -*- coding: utf-8 -*-
"""[时空层级：数据流转-规则（业务时空）] domain/composer.py —— 自动分镜引擎（纯函数）

纯文本讲稿 → 带 `## SCENE id|type|title` 版式声明的讲稿.md（AI 判断在先、人审微调在后）。
启发式规则链（每段落自上而下首中即停）：
  code（代码行）→ table/panorama（| 表格行）→ chart（数值名值对）→ timeline（时间标记）
  → compare（A vs B）→ flow（步骤词/编号）→ quote（引语短句）→ bullets（短句/默认兜底）
结构规则：首段→title、收束语段→ending；段首"总起短行"提为标题、不混入条目。
产出仅为草稿：所有条目逐字取自原文，不增写内容；分镜决策随 `_why` 打印供人复核。
"""
import re

from makevideo.core.errors import SchemaError

# ---- 文本形态判别用正则（编译期固定） ----
_CODE_LINE = re.compile(r"^\s*(import |from |def |class |function |const |let |var |#include|</?\w+>|SELECT |INSERT |UPDATE |DELETE )")
_CODE_FENCE = re.compile(r"```")
_TABLE_LINE = re.compile(r"^\s*\|.*\|\s*$")
_NUM_VAL = re.compile(r"^[\d.,，]+\s*[%％万亿元件条人岁天次分秒个kKwW]{0,3}$")
_PAIR_LINE = re.compile(r"^([^：:|]{1,14})[：:]\s*(\S{1,12})\s*$")
_TIME_TOKEN = re.compile(r"^(?:19|20)\d{2}\s*年(?:\d{1,2}月)?|\d{1,2}月|第[一二三四五六1-9]+[阶段期步]|Q[1-4]|\d{4}[./-]\d{1,2}")
_STEP_WORDS = ("首先", "其次", "再次", "然后", "接着", "随后", "最后", "第一步", "第二步", "第三步", "步骤", "流程")
_NUM_ITEM = re.compile(r"^\s*(\d+)[.、)]\s*(.+)$")
_VS = re.compile(r"([^，。；、\s]{2,12})\s*(?:vs|VS|Vs)\s*([^，。；、\s]{2,12})")
_VS_AND = re.compile(r"([^，。；\s]{2,12})与([^，。；\s]{2,12})的(?:对比|区别|差异)")
_QUOTE_WRAP = re.compile(r"^[「“\"'](.+)[」”\"']$", re.S)
_QUOTE_LEAD = ("俗话说", "常言道", "正如", "有人说", "曾说过", "曾道", "名言")
_ENDING_LEAD = ("谢谢", "感谢", "欢迎", "祝", "再见", "下期")
_ENDING_HIT = ("谢谢观看", "感谢观看", "下期再见", "欢迎交流")
_BULLET_MARK = re.compile(r"^[-•·]\s*")

# 条目上限（超出即分块成多镜，防溢出画布）
_BULLET_CAP, _FLOW_CAP, _CHART_CAP = 6, 4, 6
_ITEM_LEN = 40   # 条目超长阈值：句内再按逗号/顿号切分
_HEAD_MAX = 16   # "总起短行"判定的最大长度


def _is_num(v: str) -> bool:
    return bool(_NUM_VAL.match(v.strip()))


def _is_headline(line: str) -> bool:
    """总起短行：无句末标点且不超过 _HEAD_MAX——提为标题，不混入条目。"""
    return len(line) <= _HEAD_MAX and not re.search(r"[。！？!?；;]$", line)


def _split_sentences(lines: list) -> list:
    """逐行 + 行内按。！？!?切句，保留顺序（逐行条目型段落由此进入规则链）。"""
    sents = []
    for ln in lines:
        sents.extend(s.strip() for s in re.split(r"(?<=[。！？!?])", ln) if s.strip())
    return sents


def _split_clauses(sent: str) -> list:
    """超长句按，、；,;切短句，保留顺序。"""
    parts = [p.strip() for p in re.split(r"[，、；,;]", sent) if p.strip()]
    return parts or [sent]


def _clip_title(text: str, limit: int = 18) -> str:
    """从段首提取标题：首行首句 → 超长取首个逗号前分句 → 仍超长按字截断。"""
    head = re.split(r"[。！？；;\n]", text.strip(), 1)[0].strip()
    if len(head) > limit:
        head = re.split(r"[，,、：:—-]", head, 1)[0].strip()
    if len(head) > limit:
        head = head[:limit]
    return head or "未命名"


def _chunk(items: list, cap: int) -> list:
    return [items[i:i + cap] for i in range(0, len(items), cap)] or [[]]


def _classify(lines: list) -> dict:
    """段落（行列表）→ 分镜字段 + 决策依据 _why。规则链首中即停。"""
    head = _is_headline(lines[0])
    title = _clip_title(lines[0])
    body = lines[1:] if head else lines       # 总起短行提为标题，不进条目
    sents = _split_sentences(body)
    if head and not sents:                    # 整段仅一行总起短行
        sents = [lines[0]]

    # 1) 代码：围栏块或 ≥2 行代码起始模式
    code_lines = [ln for ln in body if _CODE_LINE.match(ln) or ln.strip() in ("{", "}", "};")]
    if _CODE_FENCE.search("\n".join(body)) or len(code_lines) >= 2:
        src = [ln.strip() for ln in body if ln.strip() and not ln.strip().startswith("```")]
        lang = "python" if re.search(r"\b(def |import )", "\n".join(body)) else \
               "js" if re.search(r"\b(function |const |=>)", "\n".join(body)) else \
               "sql" if re.search(r"\b(SELECT |INSERT )", "\n".join(body), re.I) else "text"
        return {"type": "code", "title": title, "lang": lang, "bullets": src[:12],
                "why": f"代码行×{len(code_lines)}或围栏块"}

    # 2) 表格：| 分隔行（>12 数据行自动升全景表）
    trows = [ln for ln in body if _TABLE_LINE.match(ln)]
    if trows:
        rows = [[c.strip() for c in ln.strip().strip("|").split("|")] for ln in trows]
        if len(rows) < 2:
            raise SchemaError(f"段落「{title}…」只有表头行，无法构成表格")
        stype = "panorama" if len(rows) > 13 else "table"
        return {"type": stype, "title": title, "header": rows[0], "rows": rows[1:],
                "why": f"| 表格行×{len(trows)}" + ("（高密度→panorama）" if stype == "panorama" else "")}

    # 3) 图表：≥3 条名值对且值多为数值
    pairs = [(m.group(1), m.group(2)) for ln in body if (m := _PAIR_LINE.match(ln))]
    if len(pairs) >= 3 and sum(_is_num(v) for _, v in pairs) / len(pairs) >= 0.6:
        note = f"共 {len(pairs)} 项" if len(pairs) > _CHART_CAP else None
        return {"type": "chart", "title": title, "header": ["项目", "数值"],
                "rows": [[k, v] for k, v in pairs[:_CHART_CAP]], "note": note,
                "why": f"数值名值对×{len(pairs)}"}

    # 4) 时间轴：≥3 个时间标记开头的句子
    tl = []
    for s in sents:
        m = _TIME_TOKEN.match(s)
        if m:
            rest = s[len(m.group(0)):].strip("：: ，,")
            tl.append(f"{m.group(0)}|{rest}" if rest else s)
    if len(tl) >= 3:
        return {"type": "timeline", "title": title, "bullets": tl, "why": f"时间标记×{len(tl)}"}

    # 5) 对比：显式 A vs B（或「A 与 B 的对比」）且逐行切出 ≥2 组对照
    m = _VS.search("\n".join(body)) or _VS_AND.search("\n".join(body))
    if m:
        prs = []
        for ln in body:
            mm = re.split(r"而|则|相比", ln, 1)
            if len(mm) == 2 and all(x.strip(" ，,。") for x in mm):
                prs.append([mm[0].strip(" ，,。"), mm[1].strip(" ，,。")])
        if len(prs) >= 2:
            return {"type": "compare", "title": title, "leftTitle": m.group(1), "rightTitle": m.group(2),
                    "pairs": prs[:6], "why": f"「{m.group(1)} vs {m.group(2)}」且对照行×{len(prs)}"}

    # 6) 流程：编号条目 ≥3 或步骤词 ≥2
    numbered = [(m.group(2) if (m := _NUM_ITEM.match(ln)) else None) for ln in body]
    numbered = [x for x in numbered if x]
    step_hits = sum("\n".join(body).count(w) for w in _STEP_WORDS)
    if len(numbered) >= 3 or step_hits >= 2:
        steps = numbered if len(numbered) >= 3 else sents
        return {"type": "flow", "title": title, "bullets": steps[:_FLOW_CAP], "why": f"步骤词×{step_hits}/编号×{len(numbered)}"}

    # 7) 金句：引语包裹 / 引语引导词 / 破折号出处 / 单句收束
    joined = "\n".join(body) if body else lines[0]
    body_text, attribution = joined.strip(), None
    if "——" in body_text:
        body_text, _, attribution = body_text.partition("——")
        body_text, attribution = body_text.strip(), attribution.strip()
    qm = _QUOTE_WRAP.match(body_text)
    if (qm and len(qm.group(1)) <= 60) or body_text.startswith(_QUOTE_LEAD) \
            or (attribution and len(body_text) <= 40 and body_text) \
            or (len(sents) == 1 and len(body_text) <= 50 and body_text):
        quote = qm.group(1) if qm else body_text
        return {"type": "quote", "title": title, "quote": quote, "attribution": attribution, "why": "引语/短句收束"}

    # 8) 要点（兜底）：列表行 / 短句切分
    marks = [_BULLET_MARK.sub("", ln).strip() for ln in body if _BULLET_MARK.match(ln)]
    items = marks if len(marks) >= 2 else sents
    norm = []
    for it in items:
        norm.extend(_split_clauses(it) if len(it) > _ITEM_LEN and not marks else [it.rstrip("。")])
    return {"type": "bullets", "title": title, "bullets": norm,
            "why": f"{'列表行' if marks else '短句切分'}×{len(norm)}"}


def compose_script(text: str) -> list:
    """纯文本 → 分镜草稿列表（含 _why 决策依据）。首段→title，收束段→ending，其余逐段分类。"""
    paras = []
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = [ln.strip() for ln in block.strip().splitlines() if ln.strip() and not ln.strip().startswith("#")]
        if lines:
            paras.append(lines)
    if not paras:
        raise SchemaError("输入文本为空：未找到任何有效段落")

    seq = []  # (chunkable, fields) 按出现顺序
    for pi, lines in enumerate(paras):
        is_first, is_last = pi == 0, pi == len(paras) - 1
        plain = " ".join(lines)
        if is_first:  # 片头：首行标题 + 多余行作副标题
            seq.append((False, {"type": "title", "title": _clip_title(lines[0]),
                                "subtitle": lines[1:][:3] or None, "narration": plain, "why": "首段→片头"}))
            continue
        if is_last and (plain.startswith(_ENDING_LEAD) or any(w in plain for w in _ENDING_HIT)):
            seq.append((False, {"type": "ending", "title": _clip_title(plain, 12), "narration": plain, "why": "收束语→片尾"}))
            continue
        fields = _classify(lines)
        fields["narration"] = plain
        seq.append((True, fields))

    # 中段条目超限分块（bullets>6 / flow>4），标题加序号；首尾镜直通
    out = []
    for chunkable, f in seq:
        cap = {"bullets": _BULLET_CAP, "flow": _FLOW_CAP}.get(f["type"])
        groups = _chunk(f["bullets"], cap) if chunkable and cap and len(f.get("bullets", [])) > cap else [None]
        for gi, _ in enumerate(groups):
            g = dict(f)
            if len(groups) > 1:
                g["title"] = f"{f['title']}（{gi + 1}/{len(groups)}）"
                g["bullets"] = f["bullets"][gi * cap:(gi + 1) * cap]
            g.pop("_", None)
            s = {k: v for k, v in g.items() if v is not None}
            s["id"] = f"{len(out) + 1:02d}"
            out.append(s)
    return out


def render_markdown(scenes: list, meta: dict | None = None) -> str:
    """分镜草稿 → 讲稿.md 文本（与 parser.py 语法对偶，可被 parse_script 原样解析）。"""
    m = meta or {"voice": "zh-CN-YunjianNeural", "rate": "+0%"}
    out = ["<!-- meta: " + " ".join(f"{k}={v}" for k, v in m.items()) + " -->", ""]
    for s in scenes:
        out.append(f"## SCENE {s['id']}|{s['type']}|{s['title']}")
        for sub in s.get("subtitle") or []:
            out.append(f"subtitle: {sub}")
        for k in ("lang", "leftTitle", "rightTitle", "quote", "attribution", "highlight", "note"):
            if s.get(k):
                out.append(f"{k}: {s[k]}")
        if s.get("header"):
            out.append("| " + " | ".join(s["header"]) + " |")
        for row in s.get("rows") or []:
            out.append("| " + " | ".join(row) + " |")
        for pair in s.get("pairs") or []:
            out.append(f"- {pair[0]}|{pair[1]}")
        for b in s.get("bullets") or []:
            out.append(f"- {b}")
        out.append("=== narration")
        out.append(s.get("narration", ""))
        out.append("")
    return "\n".join(out).rstrip() + "\n"

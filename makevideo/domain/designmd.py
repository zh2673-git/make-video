# -*- coding: utf-8 -*-
"""[时空层级：数据流转-规则（业务时空）] domain/designmd.py —— DESIGN.md → theme.json 转换器（纯函数）

awesome-design-md（Google Stitch DESIGN.md 标准）批量移植：
一级解析 = YAML frontmatter（colors/typography/rounded 结构化 token，64/74）；
二级解析 = 散文角色标注（`**名称** (`#hex`)：角色` 行，10/74）。
转换规则（编译期固定）：过滤交互态/响应式断点（固定 1920×1080 画布）、
缺省 token 用色彩数学确定性推导（mix/darken/hue_rotate + 对比度校验）、字号阶为画布常量。
"""
import re

# ---------------- 色彩基元（纯函数） ----------------

_HEX_RE = re.compile(r"^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$")


def _rgb(hexs: str) -> tuple:
    h = hexs.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _hex(rgb: tuple) -> str:
    return "#{:02X}{:02X}{:02X}".format(*[max(0, min(255, round(v))) for v in rgb])


def lum(hexs: str) -> float:
    """相对亮度 0~1（WCAG）。"""
    srgb = [v / 255 for v in _rgb(hexs)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def mix(a: str, b: str, t: float) -> str:
    """a 向 b 混合 t∈[0,1]。"""
    ra, rb = _rgb(a), _rgb(b)
    return _hex(tuple(x + (y - x) * t for x, y in zip(ra, rb)))


def darken(h: str, t: float) -> str:
    return mix(h, "#000000", t)


def lighten(h: str, t: float) -> str:
    return mix(h, "#FFFFFF", t)


def rgba(hexs: str, a: float) -> str:
    r, g, b = _rgb(hexs)
    return f"rgba({r},{g},{b},{a})"


def on_color(hexs: str) -> str:
    """primary 上的可读文字色：按亮度取白/近黑。"""
    return "#FFFFFF" if lum(hexs) < 0.45 else "#111318"


def hue_rotate(hexs: str, deg: float) -> str:
    import colorsys
    r, g, b = [v / 255 for v in _rgb(hexs)]
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    hh = (hh + deg / 360.0) % 1.0
    r2, g2, b2 = colorsys.hls_to_rgb(hh, ll, ss)
    return _hex((r2 * 255, g2 * 255, b2 * 255))


def _is_hex(v: str) -> bool:
    return bool(_HEX_RE.match(v.strip()))


def _dist(a: str, b: str) -> float:
    """RGB 欧氏距离归一化 0~1（深色主题亮度差失效时用）。"""
    ra, rb = _rgb(a), _rgb(b)
    return (sum((x - y) ** 2 for x, y in zip(ra, rb)) / 3) ** 0.5 / 255


# ---------------- frontmatter 子集解析（缩进式 YAML，标量全为字符串） ----------------

def parse_frontmatter(text: str) -> dict | None:
    if not text.startswith("---"):
        return None
    parts = text.split("\n---", 1)
    if len(parts) < 2:
        return None
    root: dict = {}
    stack = [(-1, root)]
    for raw in parts[0].splitlines()[1:] + [""]:  # 尾哨兵：收尾提交最后一段
        if not raw.strip() or raw.strip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        line = raw.strip()
        m = re.match(r'^([A-Za-z0-9_-]+):\s*(.*)$', line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        while stack and indent <= stack[-1][0]:
            stack.pop()
        parent = stack[-1][1]
        if val == "":
            node: dict = {}
            parent[key] = node
            stack.append((indent, node))
        else:
            if val[:1] in "\"'":  # 引号包裹：取配对引号内内容（容忍行内 # 注释）
                q = val[0]
                end = val.find(q, 1)
                val = val[1:end] if end > 0 else val.strip(q)
            else:
                val = re.split(r"\s+#", val, 1)[0].strip()  # 无引号：剥行内注释
            parent[key] = val
    return root or None


# ---------------- 散文角色标注解析（无 frontmatter 的 10 份） ----------------

_PROSE_LINE = re.compile(
    r"[-*]\s*\*\*(.+?)\*\*[^\n#]*?(`?#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])`?)")


def parse_prose_colors(text: str) -> dict:
    """从「**名称** (`#hex`)：角色说明」行提取角色 → hex。

    ink 不做首中即停：先按章节收集文字色候选，扫描后取与 surface 对比度最大者
    （防止 "promotional text" 之类的品牌色描述抢占 ink）。
    """
    section = ""
    out: dict = {}
    ink_cands: list = []
    muted: str | None = None
    for raw in text.splitlines():
        h = re.match(r"^#{2,3}\s+(.*)", raw)
        if h:
            section = h.group(1).lower()
            continue
        m = _PROSE_LINE.search(raw)
        if not m:
            continue
        label, hexv = m.group(1).strip(), m.group(2).strip("`").strip()
        if not _is_hex(hexv):
            continue
        blob = f"{section} {label} {raw[m.end():]}".lower()  # 分类依据含角色说明
        if re.search(r"primary|brand", blob) and "primary" not in out:
            out["primary"] = hexv
        elif re.search(r"background|canvas|deepest", blob) and "surface" not in out:
            out["surface"] = hexv
        elif re.search(r"card", blob) and "surface-card" not in out:
            out["surface-card"] = hexv
        elif re.search(r"secondary text|muted|silver|mute", blob) and muted is None:
            muted = hexv
        elif re.search(r"success", blob) and "success" not in out:
            out["success"] = hexv
        elif re.search(r"warning", blob) and "warning" not in out:
            out["warning"] = hexv
        elif re.search(r"announcement|info", blob) and "info" not in out:
            out["info"] = hexv
        elif re.search(r"text|ink|foreground|neutral", section):
            ink_cands.append(hexv)  # 文字章节候选：扫描完再择优
    if "surface" in out and ink_cands:
        out["ink"] = max(ink_cands, key=lambda c: abs(lum(c) - lum(out["surface"])))
        if muted is None and len(ink_cands) > 1:  # 无显式 muted：取次高对比候选
            ranked = sorted(ink_cands, key=lambda c: abs(lum(c) - lum(out["surface"])), reverse=True)
            out["ink-muted"] = ranked[1]
    elif ink_cands:  # surface 缺失：退回首中候选
        out["ink"] = ink_cands[0]
    if muted:
        out["ink-muted"] = muted
    return out


# ---------------- 字体栈提取 ----------------

_GENERIC = {"system-ui", "-apple-system", "sans-serif", "serif", "monospace",
            "ui-monospace", "ui-sans-serif", "ui-serif", "cursive", "fantasy",
            "arial", "helvetica", "consolas", "menlo", "georgia"}
_SCRIPT_CUT = re.compile(r"arab|hebr|cyrl|grek|deva|gothic|meiryo|hiragino|devanagari|thai|cjk", re.I)


def _stack_from_backticks(stack: str, cap: int = 3) -> list:
    names = []
    for part in stack.split(","):
        p = part.strip().strip("\"'")
        if not p or _SCRIPT_CUT.search(p):
            continue
        if p.lower() not in _GENERIC:
            names.append(f'"{p}"')
        else:
            names.append(p.lower() if p.lower() in ("system-ui", "-apple-system", "sans-serif",
                                                    "serif", "monospace", "ui-monospace") else f'"{p}"')
        if len(names) >= cap:
            break
    return names


def extract_font_stacks(body: str) -> tuple[str, str]:
    """从 Font Family 章节的 fallback 反引号串提取正文字体栈；mono 恒用默认栈。"""
    fam_section = re.search(r"#{2,3}\s+Font Famil(?:y|ies)(.*?)(?=\n#{2,3}\s|\Z)", body, re.S)
    picked: list | None = None
    if fam_section:
        for ln in fam_section.group(1).splitlines():
            label = re.match(r"[-*]\s*\*\*(.+?)\*\*", ln)
            fb = re.search(r"`([^`]+)`", ln)
            if not fb:
                continue
            names = _stack_from_backticks(fb.group(1))
            if not names:
                continue
            if label and re.search(r"text|body|ui|sans", label.group(1), re.I):
                picked = names  # 正文族优先
                break
            if picked is None:
                picked = names
    names = picked or ["Inter"]
    ordered: list = []
    for n in names:
        if n.lower().strip('"') != "system-ui" or "system-ui" not in ordered:
            ordered.append(n)  # 去重（system-ui 可能来自原文档又出现在补尾部）
    body_stack = ", ".join(ordered + ['system-ui', '"PingFang SC"', '"Microsoft YaHei"', "sans-serif"])
    mono_stack = '"JetBrains Mono", ui-monospace, Consolas, "Courier New", monospace'
    return body_stack, mono_stack


# ---------------- token 映射（候选链首中即停 + 推导兜底） ----------------

def _clip_desc(text: str, limit: int = 60) -> str:
    """描述截断：按词边界，不带残词。"""
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    cut = text[:limit]
    return cut[:cut.rfind(" ")] if " " in cut else cut

def _first(colors: dict, *keys):
    for k in keys:
        v = colors.get(k)
        if isinstance(v, str) and _is_hex(v):
            return v
    return None


def _accent_of(colors: dict, primary: str) -> str:
    accent_keys = sorted((k for k in colors if k.startswith("accent") and _is_hex(colors[k])))
    if accent_keys:
        return colors[accent_keys[0]]
    link = _first(colors, "link")
    if link and lum(link) > 0.2:
        return link
    return hue_rotate(primary, 35)


def build_theme(slug: str, folder: str, colors: dict, body_md: str, desc: str,
                radius: int | None = None) -> tuple[dict, list]:
    """colors（一级扁平 token 或二级散文角色）→ 六段式 theme dict。返回 (theme, 兜底备注)。"""
    notes: list = []

    def fb(note: str):
        notes.append(note)

    primary = _first(colors, "primary")
    if not primary:
        raise ValueError("无法确定 primary 品牌色")
    ink = _first(colors, "ink")
    if not ink:
        ink = "#F7F8F8" if primary and lum(primary) < 0.5 else "#1A1A1A"
        fb("ink=推导")

    dark = lum(ink) > 0.5  # 文字为浅色 → 深色主题
    contrast_ok = abs(lum(ink) - lum(primary)) > 0.12

    # palette
    on_primary = _first(colors, "on-primary") or on_color(primary)
    pd = _first(colors, "primary-deep", "primary-dark")
    if not pd:
        pa = _first(colors, "primary-active")
        pd = pa if pa and lum(pa) < lum(primary) - 0.06 else None
        if pd is None:
            pd = darken(primary, 0.28)
            fb("primaryDark=darken(0.28)")
    pl = None
    for k in ("primary-hover", "primary-light", "primary-active"):
        v = _first(colors, k)
        if v and lum(v) > lum(primary) + 0.05:
            pl = v
            break
    if not pl:
        pl = lighten(primary, 0.18)
        fb("primaryLight=lighten(0.18)")
    accent = _accent_of(colors, primary)
    if not any(k.startswith("accent") or k == "link" for k in colors):
        fb("accent=hue_rotate(35°)")
    surface = _first(colors, "canvas", "surface", "canvas-soft")
    if not surface or abs(lum(surface) - lum(ink)) < 0.30:
        surface = "#0F1218" if dark else "#FBFBFC"
        fb("surface=按 ink 亮度推导")
    surface_card = _first(colors, "surface-card", "surface-1", "surface-elevated", "surface-soft")
    if not surface_card or _dist(surface_card, surface) < 0.02:
        surface_card = mix(surface, ink, 0.06)
        fb("surfaceCard=mix(0.06)")
    surface_alt = _first(colors, "surface-2", "surface-strong", "surface-dark-elevated",
                         "canvas-soft", "surface-dark", "surface-soft")
    if not surface_alt or _dist(surface_alt, surface_card) < 0.02:
        surface_alt = mix(surface, ink, 0.12)
        fb("surfaceAlt=mix(0.12)")
    ink_muted = _first(colors, "muted", "mute", "muted-soft", "ink-muted", "ink-subtle",
                       "ink-soft", "on-dark-mute", "on-dark-soft")
    if not ink_muted:
        ink_muted = mix(ink, surface, 0.42)
        fb("inkMuted=mix(0.42)")

    palette = {
        "primary": primary.upper(), "primaryDark": pd.upper(), "primaryLight": pl.upper(),
        "accent": accent.upper(), "accentSoft": lighten(accent, 0.65).upper(),
        "surface": surface.upper(), "surfaceCard": surface_card.upper(), "surfaceAlt": surface_alt.upper(),
        "ink": ink.upper(), "inkMuted": ink_muted.upper(), "onPrimary": on_primary.upper(),
    }

    # semantic
    success = _first(colors, "semantic-success", "success") or ("#3ED598" if dark else "#1E7B34")
    warning = _first(colors, "warning") or ("#F5C15C" if dark else "#B7791F")
    semantic = {
        "success": success.upper(), "info": accent.upper(), "warning": warning.upper(),
        "highlightRow": rgba(accent, 0.14) if dark else mix(accent, "#FFFFFF", 0.75).upper(),
        "terminalBg": darken(surface, 0.35).upper() if dark else "#1A1A2E",
        "terminalFg": mix(accent, "#FFFFFF", 0.6).upper() if dark else "#EAEAEA",
    }

    # typography（字号阶=画布常量；字体栈来自文档 fallback）
    body_stack, mono_stack = extract_font_stacks(body_md)
    typography = {"body": body_stack, "mono": mono_stack,
                  "display": 116, "title": 90, "header": 50, "h1": 42, "h2": 36,
                  "bodySize": 32, "caption": 28, "micro": 24}

    motion = {"entranceSpring": {"damping": 120, "stiffness": 105},
              "stagger": 9, "tableRowDelay": 6, "fadeFrames": 12}

    layout = {"safeX": 96, "contentTop": 150, "contentBottom": 148, "headerHeight": 108,
              "footerHeight": 54, "subtitleBottom": 84, "subtitleMaxWidth": 1500,
              "radius": max(10, min(20, int(radius))) if radius else 14}
    if not radius:
        fb("radius=默认14")
    if not contrast_ok:
        fb("对比度弱：primary 与 ink 亮度接近")

    # brand（封面=底色基调 + 主色辉光，遵循源系统"克制气氛渐变"的取向）
    glow = rgba(primary, 0.22 if dark else 0.10)
    glow2 = rgba(accent, 0.08 if dark else 0.14)
    brand = {
        "coverBg": (f"radial-gradient(circle at 50% 32%, {glow}, transparent 55%), "
                    f"linear-gradient(160deg, {surface.upper()} 0%, {mix(surface, primary, 0.10).upper()} 60%, {surface.upper()} 100%)"),
        "headerBg": f"linear-gradient(90deg, {surface_card.upper()}, {mix(surface_card, primary, 0.12).upper()})",
        "footerBg": f"linear-gradient(90deg, {surface_card.upper()}, {mix(surface_card, primary, 0.12).upper()})",
        "contentBg": (f"radial-gradient(circle at 85% 10%, {glow2}, transparent 40%), "
                      f"radial-gradient(circle at 10% 90%, {glow}, transparent 45%), {surface.upper()}"),
        "subtitleBg": rgba(darken(surface, 0.5), 0.7),
        "subtitleColor": "#FFFFFF",
        "serialLabel": slug.upper(),
    }

    variants = {"bullets": ["slide", "rise"], "flow": ["scale", "rise"],
                "table": ["cascade", "fade"], "quote": ["mark", "rise"],
                "compare": ["slide", "fade"], "timeline": ["line", "pulse"]}

    theme = {"name": slug, "version": 1,
             "source": f"ported/awesome-design-md:{folder}",
             "desc": _clip_desc(desc or folder),
             "palette": palette, "semantic": semantic, "typography": typography,
             "motion": motion, "layout": layout, "brand": brand, "variants": variants}
    return theme, notes

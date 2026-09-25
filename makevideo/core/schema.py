# -*- coding: utf-8 -*-
"""[时空层级：数据规范（规则）] core/schema.py —— 分镜 DSL v2 与主题 token 契约

Scene 为 dict（与 engine/src/SceneTypes.ts 对偶，TS 侧编译期守门）；
Python 侧由 validate_scenes / validate_theme 在运行时拦截越界。
"""
import re

from makevideo.core.errors import SchemaError, ThemeError

# 分镜类型枚举（组件映射表见 engine/src/MicroCourse.tsx，一一对应）
SCENE_TYPES = {
    "title", "ending",            # 全幅版式（无页眉页脚）
    "bullets", "flow",            # 卡片要点 / 步骤流
    "stat",                       # 数字版式（大数字计数动画）
    "table", "panorama",          # 表格（普通 / 全景高密度）
    "quote",                      # 金句
    "compare",                    # 左右对比
    "timeline",                   # 时间轴
    "chart",                      # 柱状数据图
    "code",                       # 代码演示
    "image",                      # 配图+注解
}

# 需要特定字段的类型 → 必备字段
REQUIRED_FIELDS = {
    "table": ("header", "rows"),
    "panorama": ("header", "rows"),
    "chart": ("header", "rows"),
    "stat": ("stats",),
    "quote": ("quote",),
    "compare": ("leftTitle", "rightTitle"),
    "image": ("image",),
}

# 主题六段契约（段 → 必备键）
THEME_CONTRACT = {
    "palette": ["primary", "primaryDark", "primaryLight", "accent", "accentSoft",
                "surface", "surfaceCard", "surfaceAlt", "ink", "inkMuted", "onPrimary"],
    "semantic": ["success", "info", "warning", "highlightRow", "terminalBg", "terminalFg"],
    "typography": ["body", "mono",
                   "display", "title", "header", "h1", "h2", "bodySize", "caption", "micro"],
    "motion": ["entranceSpring", "stagger", "tableRowDelay", "fadeFrames"],
    "layout": ["safeX", "contentTop", "contentBottom", "headerHeight", "footerHeight",
               "subtitleBottom", "subtitleMaxWidth", "radius"],
    "brand": ["coverBg", "headerBg", "footerBg", "contentBg",
              "subtitleBg", "subtitleColor", "serialLabel"],
}

# 主题元信息段（非 token，不参与校验、不告警）
THEME_META_SECTIONS = {"name", "version", "source", "desc"}

# 动效变体池（可选段：缺省=组件默认动效，向后兼容旧主题）
# 形态：{版式: ["变体A", "变体B", ...]}，组件按同版式出现序号轮换（相邻不重复）
THEME_VARIANT_TYPES = {"bullets", "flow", "table", "quote", "compare", "timeline", "stat"}

# 字段别名校验用：这些键只允许以字符串出现
_STR_FIELDS = {"id", "type", "title", "narration", "highlight", "note", "quote",
               "attribution", "lang", "image", "imageNote", "leftTitle", "rightTitle"}

# 创意模式场景名：小写字母开头，小写字母/数字/连字符（对应工程 scenes/<名>.tsx）
_CREATIVE_NAME_RE = re.compile(r"^[a-z][a-z0-9-]*$")


def validate_scenes(scenes: list, mode: str = "rule") -> None:
    """分镜 DSL 运行时校验，违规即 SchemaError（E2，stop 前置拦截）。

    mode=rule：type 必须在 13 型枚举内（预制件层）。
    mode=creative：type 即创意场景名——必须匹配场景名规则且**不得**落在 13 型枚举内
    （片级二选一：防逐镜混用让 LLM 偷懒回退规则版式）。
    """
    if not scenes:
        raise SchemaError("讲稿解析结果为空：未找到任何 SCENE 块")
    ids, errs = set(), []
    for i, s in enumerate(scenes, 1):
        where = f"第{i}块(id={s.get('id', '?')})"
        sid = s.get("id", "").strip()
        if not sid:
            errs.append(f"{where}: id 为空")
        elif sid in ids:
            errs.append(f"{where}: id 重复")
        else:
            ids.add(sid)
        stype = s.get("type")
        if mode == "creative":
            if stype in SCENE_TYPES:
                errs.append(f"{where}: 创意模式不允许规则版式 '{stype}'（片级二选一，全部场景须为自定义场景代码）")
            elif not (isinstance(stype, str) and _CREATIVE_NAME_RE.match(stype)):
                errs.append(f"{where}: 创意场景名 '{stype}' 非法（需小写字母开头，仅小写字母/数字/连字符，对应 scenes/<名>.tsx）")
        elif stype not in SCENE_TYPES:
            errs.append(f"{where}: type '{stype}' 不在枚举 {sorted(SCENE_TYPES)}（若为创意场景，请在 project.json 设 \"mode\": \"creative\"）")
        if not (s.get("narration") or "").strip():
            errs.append(f"{where}: narration 为空")
        for field in REQUIRED_FIELDS.get(stype if mode == "rule" else None, ()):
            v = s.get(field)
            if not v or (isinstance(v, (list, dict)) and not v):
                errs.append(f"{where}: type={s['type']} 缺少必备字段 {field}")
        for k in _STR_FIELDS:
            if k in s and not isinstance(s[k], str):
                errs.append(f"{where}: 字段 {k} 应为字符串")
    if errs:
        raise SchemaError("讲稿 DSL 校验失败：\n  " + "\n  ".join(errs))


def validate_theme(theme: dict, name: str = "?") -> None:
    """主题 token 校验，缺失键即 ThemeError（E3）。未知键告警不阻断（向前兼容）。"""
    errs, warns = [], []
    for section, keys in THEME_CONTRACT.items():
        seg = theme.get(section)
        if seg is None:
            errs.append(f"缺少段落 [{section}]")
            continue
        if not isinstance(seg, dict):
            errs.append(f"段落 [{section}] 应为对象")
            continue
        for k in keys:
            if k not in seg:
                errs.append(f"[{section}] 缺少键 '{k}'")
    known = set(THEME_CONTRACT) | THEME_META_SECTIONS | {"variants"}
    for section in theme:
        if section not in known:
            warns.append(f"未知段落 [{section}]（忽略）")
    if "variants" in theme:  # 可选段：结构错了要拦（防笔误静默失效），缺省不告警
        v = theme["variants"]
        if not isinstance(v, dict):
            errs.append("[variants] 应为对象（{版式: [变体名, ...]}）")
        else:
            for k, pool in v.items():
                if k not in THEME_VARIANT_TYPES:
                    errs.append(f"[variants] 版式 '{k}' 不在 {sorted(THEME_VARIANT_TYPES)}")
                elif not (isinstance(pool, list) and pool and all(isinstance(x, str) and x for x in pool)
                          and len(pool) <= 4):
                    errs.append(f"[variants] {k} 应为 1~4 个非空字符串的数组")
    if warns:
        print(f"[THEME][{name}] 告警: " + "; ".join(warns))
    if errs:
        raise ThemeError(f"主题 '{name}' token 校验失败：\n  " + "\n  ".join(errs))

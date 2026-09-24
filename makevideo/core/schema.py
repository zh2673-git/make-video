# -*- coding: utf-8 -*-
"""[时空层级：数据规范（规则）] core/schema.py —— 分镜 DSL v2 与主题 token 契约

Scene 为 dict（与 engine/src/SceneTypes.ts 对偶，TS 侧编译期守门）；
Python 侧由 validate_scenes / validate_theme 在运行时拦截越界。
"""
from makevideo.core.errors import SchemaError, ThemeError

# 分镜类型枚举（组件映射表见 engine/src/MicroCourse.tsx，一一对应）
SCENE_TYPES = {
    "title", "ending",            # 全幅版式（无页眉页脚）
    "bullets", "flow",            # 卡片要点 / 步骤流
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
                   "display", "title", "header", "h1", "h2", "body", "caption", "micro"],
    "motion": ["entranceSpring", "stagger", "tableRowDelay", "fadeFrames"],
    "layout": ["safeX", "contentTop", "contentBottom", "headerHeight", "footerHeight",
               "subtitleBottom", "subtitleMaxWidth", "radius"],
    "brand": ["coverBg", "headerBg", "footerBg", "contentBg",
              "subtitleBg", "subtitleColor", "serialLabel"],
}

# 主题元信息段（非 token，不参与校验、不告警）
THEME_META_SECTIONS = {"name", "version", "source", "desc"}

# 字段别名校验用：这些键只允许以字符串出现
_STR_FIELDS = {"id", "type", "title", "narration", "highlight", "note", "quote",
               "attribution", "lang", "image", "imageNote", "leftTitle", "rightTitle"}


def validate_scenes(scenes: list) -> None:
    """分镜 DSL 运行时校验，违规即 SchemaError（E2，stop 前置拦截）。"""
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
        if s.get("type") not in SCENE_TYPES:
            errs.append(f"{where}: type '{s.get('type')}' 不在枚举 {sorted(SCENE_TYPES)}")
        if not (s.get("narration") or "").strip():
            errs.append(f"{where}: narration 为空")
        for field in REQUIRED_FIELDS.get(s.get("type"), ()):
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
    known = set(THEME_CONTRACT) | THEME_META_SECTIONS
    for section in theme:
        if section not in known:
            warns.append(f"未知段落 [{section}]（忽略）")
    if warns:
        print(f"[THEME][{name}] 告警: " + "; ".join(warns))
    if errs:
        raise ThemeError(f"主题 '{name}' token 校验失败：\n  " + "\n  ".join(errs))

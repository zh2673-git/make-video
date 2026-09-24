# -*- coding: utf-8 -*-
"""[时空层级：数据存储（空间落地）] infrastructure/themeio.py —— 主题库 IO

themes/ 全局共享只读；load 即校验（E3 越界拦截）。
"""
import json
import os

from makevideo.core.errors import ThemeError
from makevideo.core.schema import validate_theme

THEMES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "themes")


def list_themes() -> list:
    if not os.path.isdir(THEMES_DIR):
        return []
    return sorted(d for d in os.listdir(THEMES_DIR)
                  if os.path.isfile(os.path.join(THEMES_DIR, d, "theme.json")))


def load_theme(name: str) -> dict:
    path = os.path.join(THEMES_DIR, name, "theme.json")
    if not os.path.isfile(path):
        raise ThemeError(f"主题不存在: {name}（可用: {', '.join(list_themes()) or '无'}）")
    theme = json.load(open(path, encoding="utf-8"))
    validate_theme(theme, name)
    return theme

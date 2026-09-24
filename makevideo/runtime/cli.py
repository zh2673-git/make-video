# -*- coding: utf-8 -*-
"""[时空层级：运行时/内核（时空管家）+ 数据接口] runtime/cli.py —— CLI 唯一调度入口

生命周期显式映射：
  init   = load_project + parse_script + validate + load_theme
  start  = TTS + 帧对齐 + gen 落盘
  stop   = 音频数=分镜数断言 / 分段缓存完整性断言
  destroy= Remotion 渲染/拼接 → 成片落盘
失败即停：MakeVideoError 统一捕获，退出码=错误码序号。
"""
import argparse
import sys

from makevideo.application.pipeline import build, preview_theme, validate_project
from makevideo.core.errors import MakeVideoError
from makevideo.infrastructure.themeio import list_themes


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="makevideo", description="讲稿驱动的多风格微视频生成工具")
    sub = p.add_subparsers(dest="cmd", required=True)

    pb = sub.add_parser("build", help="讲稿+主题 → 1080P MP4")
    pb.add_argument("project", help="工程目录（含 project.json + 讲稿）")
    pb.add_argument("--only", help="分段增量渲染：仅重渲指定分镜（逗号分隔 id）")
    pb.add_argument("--no-tts", action="store_true", help="复用现有配音")
    pb.add_argument("--no-render", action="store_true", help="仅生成 gen 文件不渲染")
    pb.add_argument("--theme", help="覆盖工程配置的主题名")

    pp = sub.add_parser("preview", help="主题 6 宫格试帧")
    pp.add_argument("theme", help="主题名")
    pp.add_argument("--out", help="输出目录（默认 makevideo/preview/<theme>）")

    pv = sub.add_parser("validate", help="校验工程（DSL+主题），不出片")
    pv.add_argument("project", help="工程目录")

    sub.add_parser("list-themes", help="列出主题库")

    a = p.parse_args(argv)
    try:
        if a.cmd == "build":
            only = {x.strip() for x in a.only.split(",") if x.strip()} if a.only else None
            build(a.project, only=only, skip_tts=a.no_tts,
                  skip_render=a.no_render, theme_override=a.theme)
        elif a.cmd == "preview":
            preview_theme(a.theme, a.out)
        elif a.cmd == "validate":
            info = validate_project(a.project)
            print(f"[VALID] {info}")
        elif a.cmd == "list-themes":
            themes = list_themes()
            print("\n".join(themes) if themes else "(主题库为空)")
    except MakeVideoError as e:
        print(f"[STOP] {e}", file=sys.stderr)
        return int(e.code[1]) if e.code[1:].isdigit() else 1
    return 0

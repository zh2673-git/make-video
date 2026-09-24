# -*- coding: utf-8 -*-
"""[时空层级：数据存储（空间落地）] infrastructure/renderer.py —— Remotion 渲染封装

整片 / 分段增量 / 无损拼接 / 主题试帧，全部经 `npx remotion` 子进程；失败即停（E5/E6）。
"""
import os
import subprocess

from makevideo.core.errors import ConcatError, RenderError

# Chrome 探测：CHROME_PATH 环境变量 → 常见安装位（绕开被墙的无头浏览器下载）
_CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
]


def chrome_path() -> str | None:
    env = os.environ.get("CHROME_PATH")
    if env and os.path.exists(env):
        return env
    for p in _CHROME_CANDIDATES:
        if os.path.exists(p):
            return p
    return None  # 交给 Remotion 自行查找


def _run(cmd: list, engine: str) -> None:
    ret = subprocess.run(cmd, cwd=engine, shell=True).returncode
    if ret != 0:
        raise RenderError(f"Remotion 渲染失败（退出码 {ret}）：{' '.join(cmd[:6])}...")


def _chrome_args() -> list:
    cp = chrome_path()
    return ["--browser-executable", cp] if cp else []


def render_full(engine: str, out_rel: str, comp: str = "microcourse") -> None:
    """整片渲染：out_rel 相对 engine 目录（纯 ASCII 更稳）。"""
    _run(["npx", "remotion", "render", "src/index.ts", comp, out_rel,
          "--log=error", *_chrome_args()], engine)


def render_segment(engine: str, sid: str, start: int, end: int,
                   seg_dir: str = "out/segments", comp: str = "microcourse") -> None:
    """渲染单个分镜帧区间到独立片段（增量复用单位）。"""
    seg_rel = f"{seg_dir}/scene-{sid}.mp4"  # 相对路径保持纯 ASCII
    _run(["npx", "remotion", "render", "src/index.ts", comp, seg_rel,
          "--log=error", "--frames", f"{start}-{end}", *_chrome_args()], engine)


def concat_segments(engine: str, sids: list, out_rel: str,
                    seg_dir: str = "out/segments") -> None:
    """Remotion 自带 ffmpeg 按分镜顺序无损拼接（-c copy 零转码）。

    concat 列表须放在 seg_dir 内：ffmpeg 相对「列表文件所在目录」解析条目相对路径。
    """
    lst = os.path.join(engine, seg_dir.replace("/", os.sep), "mv-concat.txt")
    with open(lst, "w", encoding="utf-8") as f:
        for sid in sids:
            f.write(f"file 'scene-{sid}.mp4'\n")
    cmd = ["npx", "remotion", "ffmpeg", "-y", "-f", "concat", "-safe", "0",
           "-i", lst, "-c", "copy", out_rel]
    ret = subprocess.run(cmd, cwd=engine, shell=True).returncode
    if ret != 0:
        raise ConcatError(f"分段拼接失败（退出码 {ret}）")
    os.remove(lst)


def render_still(engine: str, frame: int, out_rel: str, comp: str = "microcourse") -> None:
    """渲染单帧 PNG（主题试帧）。remotion still: --frame 指定帧号。"""
    _run(["npx", "remotion", "still", "src/index.ts", comp, out_rel,
          "--frame", str(frame), "--log=error", *_chrome_args()], engine)

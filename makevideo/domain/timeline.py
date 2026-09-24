# -*- coding: utf-8 -*-
"""[时空层级：数据流转-规则（业务时空）] domain/timeline.py —— 帧对齐器（纯函数）

配音时长 → 帧数（ceil(时长×fps) + 尾帧呼吸），音画不漂移的时间锚点。
"""
import math

from makevideo.domain.captions import split_captions

FPS = 30
TAIL_FRAMES = 12  # 每分镜末尾 0.4s 呼吸


def align_timeline(scenes: list, fps: int = FPS, tail: int = TAIL_FRAMES) -> int:
    """就地填充 scenes[*].frames/captions，返回总帧数。"""
    total = 0
    for s in scenes:
        s["frames"] = math.ceil(s.pop("audioSec") * fps) + tail
        s["captions"] = split_captions(s["narration"], s["frames"] - tail)
        total += s["frames"]
    return total

# -*- coding: utf-8 -*-
"""[时空层级：数据流转-规则（业务时空）] domain/captions.py —— 字幕引擎（纯函数）

按标点切句、按句长比例分配帧窗，末句对齐总帧数；帧窗并集恰好覆盖 [0, frames)。
"""
import re


def split_captions(narration: str, frames: int) -> list:
    """narration → [{from,to,text}]，帧窗并集恰覆盖 [0, frames)。"""
    sents = [s for s in re.split(r"(?<=[。！？；])", narration) if s.strip()]
    if not sents:
        return []
    total_len = sum(len(s) for s in sents)
    caps, cur = [], 0
    for s in sents:
        f = round(frames * len(s) / total_len)
        caps.append({"from": cur, "to": cur + f, "text": s.strip()})
        cur += f
    if caps:
        caps[-1]["to"] = frames
    return caps

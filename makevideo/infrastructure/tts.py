# -*- coding: utf-8 -*-
"""[时空层级：数据存储（空间落地）] infrastructure/tts.py —— edge-tts 配音封装

逐分镜合成 mp3；词级时间戳取末词终点=音频时长（时间锚点），失败兜底读 mp3 实际时长。
"""
import asyncio
import os


async def _synth_async(text: str, path: str, voice: str, rate: str) -> float:
    import edge_tts
    last_end, attempts, delay = 0.0, 0, 3
    while True:
        try:
            last_end = 0.0
            com = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
            with open(path, "wb") as f:
                async for chunk in com.stream():
                    if chunk["type"] == "audio":
                        f.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        last_end = (chunk["offset"] + chunk["duration"]) / 1e7
            break
        except Exception as e:  # 服务端 503/网络抖动：退避重试 3 次
            attempts += 1
            if attempts > 3:
                raise
            print(f"[TTS][RETRY {attempts}] {type(e).__name__}: {e}（{delay}s 后重试）")
            await asyncio.sleep(delay)
            delay *= 2
    if last_end <= 0:  # 兜底：直接读 mp3 实际时长
        from mutagen.mp3 import MP3
        last_end = MP3(path).info.length
    return round(last_end, 3)


def synth(scene: dict, audio_dir: str, voice: str, rate: str) -> float:
    """为单个分镜配音，返回音频秒数；scene 增加相对 audio 路径。"""
    path = os.path.join(audio_dir, f"scene-{scene['id']}.mp3")
    sec = asyncio.run(_synth_async(scene["narration"], path, voice, rate))
    scene["audio"] = f"audio/scene-{scene['id']}.mp3"
    scene["audioSec"] = sec
    print(f"[TTS] scene-{scene['id']} {sec:.1f}s")
    return sec


def reuse(scene: dict, audio_dir: str, sec: float | None = None) -> float:
    """--no-tts 模式：复用现有 mp3。时长优先取 TTS 缓存（词级时间戳），缺失兜底 mutagen（含尾部静音，会略长）。"""
    path = os.path.join(audio_dir, f"scene-{scene['id']}.mp3")
    if not os.path.exists(path):
        raise FileNotFoundError(f"缺少配音 {path}，请先不带 --no-tts 全量运行一次")
    if sec is None:
        from mutagen.mp3 import MP3
        sec = round(MP3(path).info.length, 3)
    scene["audio"] = f"audio/scene-{scene['id']}.mp3"
    scene["audioSec"] = sec
    print(f"[TTS] scene-{scene['id']} 复用 {sec}s")
    return sec

import asyncio
import json
import os
import subprocess
import sys

import edge_tts

VOICE = os.environ.get("MV_VOICE", "zh-CN-YunjianNeural")
RATE = os.environ.get("MV_RATE", "+0%")


def dur(path):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path]
    )
    return float(out.decode().strip())


async def main():
    project_json = sys.argv[1]
    with open(project_json, "r", encoding="utf-8") as f:
        project = json.load(f)
    root = os.path.dirname(os.path.abspath(project_json))
    vo_dir = os.path.join(root, "audio", "vo")
    os.makedirs(vo_dir, exist_ok=True)
    total = 0.0
    for shot in project["shots"]:
        out = os.path.join(vo_dir, shot["id"] + ".mp3")
        if not os.path.exists(out):
            comm = edge_tts.Communicate(shot["narration"], VOICE, rate=RATE)
            await comm.save(out)
        d = dur(out)
        total += d
        print(shot["id"] + " " + format(d, ".2f") + "s " + str(len(shot["narration"])) + "chars")
    print("TOTAL " + format(total, ".2f") + "s")


asyncio.run(main())

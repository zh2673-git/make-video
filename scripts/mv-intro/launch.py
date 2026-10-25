import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOG = os.path.join(ROOT, "tmp", "render.log")
os.makedirs(os.path.dirname(LOG), exist_ok=True)

NO_WINDOW = 0x08000000
with open(LOG, "w", encoding="utf-8") as log:
    p = subprocess.Popen(
        ["node", os.path.join(ROOT, "scripts", "mv-intro", "step-render.mjs")],
        cwd=ROOT,
        stdout=log,
        stderr=subprocess.STDOUT,
        creationflags=NO_WINDOW,
    )
print("pid=" + str(p.pid))

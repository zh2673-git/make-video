# -*- coding: utf-8 -*-
"""[时空层级：数据存储（空间落地）] infrastructure/sceneio.py —— 创意场景装载与校验闭环

创意模式（mode=creative）：工程 scenes/<场景名>.tsx → 拷入 engine/src/custom/ → 生成静态注册表
custom.gen.ts（打包期可见）。校验闭环三道闸（失败即停 E8，错误文本供 LLM 外环消费回改）：
  1. import 白名单（禁文件系统/网络/未声明依赖，静态扫描）
  2. tsc 编译（engine tsconfig strict 全量检查）
  3. 逐镜试帧（remotion still 中点帧；内容 hash 缓存，未变更不重试）
"""
import hashlib
import json
import os
import re
import shutil
import subprocess

from makevideo.core.errors import CreativeSceneError

PKG_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(PKG_DIR, "engine")
CUSTOM_DIR = os.path.join(ENGINE, "src", "custom")
GEN_TS = os.path.join(ENGINE, "src", "custom.gen.ts")
STILLS_DIR = os.path.join(ENGINE, "out", "stills")

# import 白名单：react / remotion 系官方包 + 相对导入（限 src 内一层向上）
_ALLOWED_BARE = re.compile(r"^(react|react-dom|remotion)(/[\w./-]*)?$|^@remotion/")
_REL_MAX_UP = 1  # src/custom/<file> 下 `../` 一层即 src 根，足够触达 theme/primitives/icons
# import 语句 + 动态 import() + require() 的模块名提取
_IMPORT_RE = re.compile(
    r"""(?:import\s+(?:[\w*{},\s$]+\s+from\s+)?|export\s+(?:[\w*{},\s$]+\s+from\s+)?|
        import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]""", re.VERBOSE)


def collect_scene_files(project_dir: str, names: list) -> dict:
    """场景名 → 工程 scenes/<名>.tsx 绝对路径；缺失即 E8（列出全部缺失清单）。"""
    scenes_dir = os.path.join(project_dir, "scenes")
    missing = [n for n in names if not os.path.isfile(os.path.join(scenes_dir, n + ".tsx"))]
    if missing:
        raise CreativeSceneError(
            f"创意场景代码缺失（{scenes_dir}）：{', '.join(missing)}"
            f"\n  → 每个讲稿场景名须有同名 .tsx 文件（默认导出组件，见 SKILL.md 创意模式章节）")
    return {n: os.path.join(scenes_dir, n + ".tsx") for n in names}


def scan_imports(text: str, name: str) -> None:
    """import 白名单静态扫描：违规模块即 E8（附文件/模块名/允许范围）。"""
    errs = []
    for lineno, line in enumerate(text.splitlines(), 1):
        for mod in _IMPORT_RE.findall(line):
            if mod.startswith("."):
                up_count = 0
                for part in mod.split("/"):
                    if part == "..":
                        up_count += 1
                    else:
                        break
                if up_count > _REL_MAX_UP:
                    errs.append(f"  scenes/{name}.tsx:{lineno}  相对导入 '{mod}' 越界"
                                f"（最多 {_REL_MAX_UP} 层 ../，触达 src 内模块足够）")
            elif not _ALLOWED_BARE.match(mod):
                errs.append(f"  scenes/{name}.tsx:{lineno}  不允许的依赖 '{mod}'"
                            f"（白名单：react / react-dom / remotion / @remotion/* / 相对导入 ../theme 等 src 内模块）")
    if errs:
        raise CreativeSceneError("创意场景 import 白名单校验失败：\n" + "\n".join(errs))


def _pascal(name: str) -> str:
    return "".join(p.capitalize() for p in name.split("-")) + "Scene"


def deploy_custom_scenes(files: dict) -> str:
    """拷贝场景代码到 engine/src/custom/（先清残防串场）并生成注册表 custom.gen.ts。
    生成前即执行 import 白名单扫描（第一道闸）。返回场景内容指纹（试帧缓存键）。"""
    os.makedirs(CUSTOM_DIR, exist_ok=True)
    for f in os.listdir(CUSTOM_DIR):
        if f.endswith((".tsx", ".ts")):
            os.remove(os.path.join(CUSTOM_DIR, f))
    hash_ctx = hashlib.sha256()  # 内容指纹（check_stills 缓存键的一部分，随 build 传给 gen 目录）
    entries = []
    for name, path in sorted(files.items()):
        text = open(path, encoding="utf-8").read()
        scan_imports(text, name)
        with open(os.path.join(CUSTOM_DIR, name + ".tsx"), "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
        bare = bool(re.search(r"export\s+(?:const|let|var)\s+bare\s*=\s*true", text))
        entries.append((name, bare))
        hash_ctx.update(name.encode())
        hash_ctx.update(text.encode())
    lines = [
        "// [自动生成] custom.gen.ts —— 创意场景注册表（makevideo pipeline 生成；手工修改会被覆盖）",
        "import type {FC} from 'react';",
        "import type {ProjectMeta, Scene} from './SceneTypes';",
        "",
        "/** 创意场景 props（与规则组件签名对齐；variant 由编排层下发，创意场景可自行忽略）。 */",
        "export type CustomSceneProps = {scene: Scene; meta: ProjectMeta; variant?: string};",
        "/** bare=true 的场景不叠加字幕条（全幅画面，如片头片尾）。 */",
        "export type CustomSceneModule = {Component: FC<CustomSceneProps>; bare: boolean};",
        "",
    ]
    for name, _ in entries:
        lines.append(f"import {_pascal(name)} from './custom/{name}';")
    lines += ["", "export const CUSTOM_SCENES: Record<string, CustomSceneModule> = {"]
    lines += [f"  '{name}': {{Component: {_pascal(name)}, bare: {str(bare).lower()}}}," for name, bare in entries]
    lines += ["};", ""]
    with open(GEN_TS, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines))
    return hash_ctx.hexdigest()[:16]


def tsc_check() -> None:
    """engine 全量 tsc 编译（strict），失败即 E8（附输出尾部供定位）。"""
    ret = subprocess.run("npx tsc --noEmit", cwd=ENGINE, shell=True,
                         capture_output=True, text=True, encoding="utf-8", errors="replace")
    if ret.returncode != 0:
        tail = "\n".join((ret.stdout or "").strip().splitlines()[-40:]) or "(无输出)"
        raise CreativeSceneError("创意场景 tsc 编译失败（engine strict 全量）：\n" + tail)


def check_stills(scenes: list, content_hash: str = "") -> None:
    """逐镜试帧：每个分镜渲中点帧 PNG（remotion still）。
    缓存键 = 场景内容指纹 + 分镜帧表，任一变更即全部重试。"""
    digest = hashlib.sha256((content_hash + json.dumps(
        [[s["id"], s["type"], s["frames"]] for s in scenes], ensure_ascii=False)).encode()).hexdigest()[:16]
    cache_path = os.path.join(STILLS_DIR, ".cache")
    if os.path.isfile(cache_path):
        try:
            if json.load(open(cache_path, encoding="utf-8")).get("hash") == digest:
                print(f"[STILL] 场景代码未变更，试帧缓存命中（{digest}）")
                return
        except (OSError, ValueError):
            pass
    os.makedirs(STILLS_DIR, exist_ok=True)
    start = 0
    for s in scenes:
        mid = start + s["frames"] // 2
        out = os.path.join(STILLS_DIR, f"scene-{s['id']}.png")
        ret = subprocess.run(
            ["npx", "remotion", "still", "src/index.ts", "microcourse", out.replace("\\", "/"),
             "--frame", str(mid), "--log=error"],
            cwd=ENGINE, shell=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if ret.returncode != 0:
            tail = "\n".join((ret.stderr or ret.stdout or "").strip().splitlines()[-40:]) or "(无输出)"
            raise CreativeSceneError(
                f"创意场景试帧失败（scene-{s['id']} / '{s['type']}' 帧号 {mid}）——"
                f"通常是场景代码运行时错误（Hook 顺序 / 除零 / undefined 访问等）：\n{tail}")
        start += s["frames"]
        print(f"[STILL] scene-{s['id']} ({s['type']}) 帧 {mid} OK")
    json.dump({"hash": digest}, open(cache_path, "w", encoding="utf-8"))

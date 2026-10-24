import path from 'node:path';
import type { AssetRef, Project, Shot } from '../core/schema.js';
import { V } from '../core/index.js';
import { mvError, ERR } from '../core/errors.js';
import type { ProjectStore } from '../infrastructure/project-store.js';
import type { BuddyCloudBridge } from '../infrastructure/buddy-cloud-bridge.js';
import { copyFile, exists, readJson, atomicWriteJson } from '../infrastructure/fs-utils.js';
import { extractFrame, probeDurationMs, probeSize, sliceClip } from '../infrastructure/ffmpeg-utils.js';
import type { MaterialIndex, MaterialIndexItem } from './storyboard.js';
import { drawScene } from './scene-forge.js';
import type { StylePack } from '../core/schema.js';

export async function indexMaterials(
  store: ProjectStore,
  project: Project,
  paths: string[],
): Promise<MaterialIndex> {
  const dir = store.projectDir(project.meta.id);
  const matDir = path.join(dir, 'materials');
  const indexFile = path.join(matDir, 'index.json');
  const index: MaterialIndex = exists(indexFile)
    ? await readJson<MaterialIndex>(indexFile)
    : { items: [] };
  for (const src of paths) {
    if (!exists(src)) throw mvError(ERR.FS, `素材不存在: ${src}`);
    const base = path.basename(src);
    const dest = path.join(matDir, base);
    await copyFile(src, dest);
    const item = await probeMaterial(dest);
    index.items = index.items.filter((i) => i.path !== dest);
    index.items.push(item);
  }
  await atomicWriteJson(indexFile, index);
  return index;
}

async function probeMaterial(file: string): Promise<MaterialIndexItem> {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  if (['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) {
    const durationMs = await probeDurationMs(file).catch(() => undefined);
    const size = await probeSize(file).catch(() => undefined);
    return {
      path: file,
      type: 'video',
      ...(durationMs ? { durationMs } : {}),
      tags: tokenize(base),
      ...(size ? {} : {}),
    };
  }
  if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
    return { path: file, type: 'image', tags: tokenize(base) };
  }
  if (['.mp3', '.wav', '.m4a', '.aac'].includes(ext)) {
    const durationMs = await probeDurationMs(file).catch(() => undefined);
    return {
      path: file,
      type: 'audio',
      ...(durationMs ? { durationMs } : {}),
      tags: tokenize(base),
    };
  }
  return { path: file, type: 'other', tags: tokenize(base) };
}

function tokenize(name: string): string[] {
  return name
    .split(/[-_.\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

export async function ensureAssets(
  store: ProjectStore,
  project: Project,
  shot: Shot,
  bridge: BuddyCloudBridge,
  pack: StylePack,
  llm?: import('../infrastructure/index.js').LlmClient,
): Promise<AssetRef> {
  const dir = store.projectDir(project.meta.id);
  const kind = shot.visual.kind;
  if (kind === 'code-scene') {
    const { file } = await drawScene(store, project, shot, pack, llm);
    return { kind, path: file, meta: { scene: shot.id, kenBurns: true } };
  }
  if (kind === 'user-material') {
    const src = shot.visual.source;
    if (!src || !exists(src)) {
      throw mvError(ERR.ASSET_MISSING, `镜头 ${shot.id} 的用户素材缺失: ${src ?? '(未指定)'}`);
    }
    const dest = path.join(dir, 'assets', shot.id, path.basename(src));
    await copyFile(src, dest);
    return { kind, path: dest, meta: { source: src, kenBurns: true } };
  }
  if (kind === 'imported') {
    const src = shot.visual.source;
    if (!src || !exists(src)) {
      throw mvError(ERR.ASSET_MISSING, `镜头 ${shot.id} 的导入源缺失: ${src ?? '(未指定)'}`);
    }
    const outDir = path.join(dir, 'assets', shot.id);
    const range = shot.visual.params['range'] as [number, number] | undefined;
    const dest = path.join(outDir, `clip-${shot.id}.mp4`);
    if (range) {
      await sliceClip(src, range[0], range[1] - range[0], dest);
    } else {
      const destFrame = path.join(outDir, `frame-${shot.id}.png`);
      await extractFrame(src, 0, destFrame);
      return { kind, path: destFrame, meta: { source: src, kenBurns: true } };
    }
    return { kind, path: dest, meta: { source: src } };
  }
  return bridge.generate(
    { kind: 'video', prompt: shot.visual.prompt || shot.narration.slice(0, 80) },
    path.join(dir, 'assets', shot.id),
    '',
  );
}

export async function importAsset(
  store: ProjectStore,
  project: Project,
  shotId: string,
  source: string,
  mode: 'frame' | 'clip',
  range?: [number, number],
): Promise<AssetRef> {
  const dir = store.projectDir(project.meta.id);
  const outDir = path.join(dir, 'assets', shotId);
  if (!exists(source)) throw mvError(ERR.IMPORT_FAIL, `导入源不存在: ${source}`);
  if (mode === 'frame') {
    const out = path.join(outDir, `frame-${shotId}.png`);
    await extractFrame(source, range?.[0] ?? 0, out);
    return { kind: 'imported', path: out, meta: { source, kenBurns: true } };
  }
  const out = path.join(outDir, `clip-${shotId}.mp4`);
  await sliceClip(source, range?.[0] ?? 0, (range?.[1] ?? 5) - (range?.[0] ?? 0), out);
  const issues = await checkAsset(out);
  if (V.hasError(issues)) {
    throw mvError(ERR.IMPORT_FAIL, `导入资产不合格:\n${V.formatIssues(issues)}`);
  }
  return { kind: 'imported', path: out, meta: { source } };
}

async function checkAsset(file: string): Promise<V.Issue[]> {
  const issues: V.Issue[] = [];
  try {
    const dur = await probeDurationMs(file);
    if (dur <= 0) issues.push(V.err('V-AST-005', '资产时长为 0'));
  } catch (e) {
    issues.push(V.err('V-AST-005', `资产不可解码: ${(e as Error).message}`));
  }
  return issues;
}

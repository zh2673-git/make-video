// 步骤 4：compose（质量闸门 + 混音 + HyperFrames 合成项目）→ render（成片）
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { runCliOrThrow, ROOT } from './cli-run.mjs';

async function resolveProjectId(explicit) {
  if (explicit) return explicit;
  const dir = path.join(ROOT, 'projects');
  const entries = await fs.readdir(dir);
  let best = null;
  let bestTime = 0;
  for (const e of entries) {
    const p = path.join(dir, e, 'project.json');
    try {
      const st = await fs.stat(p);
      if (st.mtimeMs > bestTime) { bestTime = st.mtimeMs; best = e; }
    } catch { /* 非项目目录 */ }
  }
  if (!best) throw new Error('未找到项目');
  return best;
}

async function main() {
  const projectId = await resolveProjectId(process.argv[2]);
  console.log(`project=${projectId}`);
  const c = await runCliOrThrow(['compose', '--project', projectId]);
  console.log(c.out.trim());
  if (process.env['MV_COMPOSE_ONLY'] === '1') return;
  const r = await runCliOrThrow(['render', '--project', projectId]);
  console.log(r.out.trim());
}

main().catch((e) => { console.error(e); process.exit(1); });

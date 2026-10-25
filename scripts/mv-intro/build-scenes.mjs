// 逐镜原创场景构建器：组装 36 镜 HTML → 本地过闸 → 落 staging 目录
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildScene } from './scene-base.mjs';
import { validateSceneFile } from './validate.mjs';
import { scenes as a } from './scenes-a.mjs';
import { scenes as b } from './scenes-b.mjs';
import { scenes as c } from './scenes-c.mjs';
import { scenes as d } from './scenes-d.mjs';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const ALL = [...a, ...b, ...c, ...d];
const OUT_DIR = path.join(ROOT, 'tmp', 'mv-intro-scenes');

async function main() {
  const projectId = process.argv[2];
  if (!projectId) throw new Error('usage: node build-scenes.mjs <project-id>');
  const pj = path.join(ROOT, 'projects', projectId, 'project.json');
  const project = JSON.parse(await fs.readFile(pj, 'utf8'));
  await fs.mkdir(OUT_DIR, { recursive: true });
  let bad = 0;
  const seen = new Set();
  for (const shot of project.shots) {
    const def = ALL.find((s) => s.id === shot.id);
    if (!def) { console.error(`MISS ${shot.id}`); bad += 1; continue; }
    seen.add(shot.id);
    const html = buildScene(def);
    const issues = validateSceneFile(html, { narration: shot.narration, title: project.meta.title });
    const errs = issues.filter((i) => i.startsWith('[error]'));
    if (errs.length) { bad += 1; console.error(`FAIL ${shot.id} ${errs.join(' | ')}`); }
    else {
      const warns = issues.filter((i) => i.startsWith('[warn]'));
      if (warns.length) console.warn(`WARN ${shot.id} ${warns.join(' | ')}`);
    }
    await fs.writeFile(path.join(OUT_DIR, `Scene_${shot.id}.html`), html, 'utf8');
  }
  const missing = ALL.filter((s) => !seen.has(s.id)).map((s) => s.id);
  if (missing.length) console.error(`UNUSED ${missing.join(',')}`);
  console.log(`built=${project.shots.length} fail=${bad} out=${OUT_DIR}`);
  if (bad > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });

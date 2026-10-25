// 步骤 2：构建 36 镜场景 → 逐镜过闸落盘（make-video scene）→ 写入 asset/state
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { runCliOrThrow, ROOT } from './cli-run.mjs';
import { buildScene } from './scene-base.mjs';
import { validateSceneFile } from './validate.mjs';
import { scenes as a } from './scenes-a.mjs';
import { scenes as b } from './scenes-b.mjs';
import { scenes as c } from './scenes-c.mjs';
import { scenes as d } from './scenes-d.mjs';

const ALL = [...a, ...b, ...c, ...d];
const STAGE = path.join(ROOT, 'tmp', 'mv-intro-scenes');

async function main() {
  const projectId = process.argv[2];
  if (!projectId) throw new Error('usage: node step-adopt.mjs <project-id>');
  const pj = path.join(ROOT, 'projects', projectId, 'project.json');
  const project = JSON.parse(await fs.readFile(pj, 'utf8'));
  await fs.mkdir(STAGE, { recursive: true });

  let fails = 0;
  for (const shot of project.shots) {
    const def = ALL.find((s) => s.id === shot.id);
    if (!def) throw new Error(`缺少场景定义 ${shot.id}`);
    const html = buildScene(def);
    const issues = validateSceneFile(html, { narration: shot.narration, title: project.meta.title });
    const errs = issues.filter((i) => i.startsWith('[error]'));
    if (errs.length) { fails += 1; console.error(`LOCAL-FAIL ${shot.id} ${errs.join(' | ')}`); continue; }
    const file = path.join(STAGE, `Scene_${shot.id}.html`);
    await fs.writeFile(file, html, 'utf8');
    const r = await runCliOrThrow(['scene', '--project', projectId, '--shot', shot.id, '--from', file]);
    const res = JSON.parse(r.out);
    if (!res.adopted) { fails += 1; console.error(`ADOPT-FAIL ${shot.id} ${res.feedback}`); }
  }
  console.log(`adopt: shots=${project.shots.length} fails=${fails}`);
  if (fails > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });

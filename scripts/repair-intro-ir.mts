// 修复 IR：把每镜 asset 指回已采用的原创场景（scenes/Scene_<id>.html），状态回 voiced
// 背景：run 尾部保存丢失了 sourcing 阶段写入的 asset/state；音频与场景文件均健在
import fs from 'node:fs';
import path from 'node:path';
import { ProjectStore } from '../src/infrastructure/project-store.js';

const id = process.argv[2];
if (!id) {
  console.error('usage: npx tsx scripts/repair-intro-ir.mts <project-id>');
  process.exit(1);
}
const store = new ProjectStore(process.cwd());
const project = await store.load(id);
const dir = store.projectDir(project.meta.id);
let fixed = 0;
for (const shot of project.shots) {
  const sceneFile = path.join(dir, 'scenes', `Scene_${shot.id}.html`);
  if (!fs.existsSync(sceneFile)) {
    console.error(`缺场景: ${sceneFile}`);
    continue;
  }
  shot.asset = { kind: 'code-scene', path: sceneFile, meta: { scene: shot.id, kenBurns: true } };
  if (shot.state === 'pending' || shot.state === 'sourced' || shot.state === 'failed') {
    shot.state = 'voiced';
  }
  fixed += 1;
}
await store.save(project);
console.log(`repaired ${fixed}/${project.shots.length}`);

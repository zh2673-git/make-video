
import { V } from '../src/core/index.js';
import fs from 'node:fs';
import path from 'node:path';
const project = JSON.parse(fs.readFileSync(path.join("D:\\ZH\\vibe code\\skills\\tool\\make-video\\projects\\make-video-周星驰风项目大片-mvmgld4t", 'project.json'), 'utf8'));
const nar = new Map(project.shots.map((s) => [s.id, s.narration]));
const dir = 'gen-scenes-intro';
let bad = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html')).sort()) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const id = f.replace('.html', '');
  const issues = V.validateSceneFile(html, { narration: nar.get(id) ?? '', title: project.meta.title });
  if (issues.length) {
    bad++;
    console.log(f, '=>', issues.map((i) => i.id + ':' + i.message.slice(0, 70)).join(' | '));
  }
}
console.log(bad === 0 ? '全部 ' + project.shots.length + ' 镜预检通过' : bad + ' 镜未过预检');
process.exit(bad === 0 ? 0 : 1);

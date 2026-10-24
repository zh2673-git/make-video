// 组装 54 个原创场景为完整 HTML 并预校验（validateSceneFile 与流水线同源）
// 用法：node scripts/gen-intro-scenes.cjs <project-id>
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const A = require('./scenes-intro-a.cjs');
const B = require('./scenes-intro-b.cjs');
const C = require('./scenes-intro-c.cjs');

const projectId = process.argv[2];
if (!projectId) {
  console.error('usage: node scripts/gen-intro-scenes.cjs <project-id>');
  process.exit(1);
}
const projRoot = path.join(__dirname, '..', 'projects', projectId);
if (!fs.existsSync(path.join(projRoot, 'project.json'))) {
  console.error('项目不存在: ' + projRoot);
  process.exit(1);
}
const project = JSON.parse(fs.readFileSync(path.join(projRoot, 'project.json'), 'utf8'));
const shots = new Map(project.shots.map((s) => [s.id, s]));

const BG = '#141110';
function page(s, camera, zoom) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>
html,body{margin:0;height:100%;overflow:hidden}body{font-family:'Microsoft YaHei','PingFang SC',sans-serif;background:${BG}}
.stage{position:relative;width:100%;height:100%;overflow:hidden}
${s.css}
.grain,.vignette,.letterbox{position:absolute;inset:0;pointer-events:none}
.letterbox{display:none}
.vignette{background:radial-gradient(ellipse at center,transparent 58%,#000 135%);opacity:.38}
</style></head><body data-scene-id="${s.id}">
<div class="stage">${s.markup}</div>
<div class="vignette"></div>
<div class="letterbox"></div>
<script src="../motion/motion-lib.js"></script>
<script>document.addEventListener('DOMContentLoaded',function(){
${s.anim}
MV.camera('.stage',{move:'${camera}',zoom:'${zoom}'});
});</script></body></html>`;
}

const all = [...A, ...B, ...C];
const outDir = path.join(__dirname, '..', 'gen-scenes-intro');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const ids = new Set();
for (const s of all) {
  if (ids.has(s.id)) throw new Error('重复 id: ' + s.id);
  ids.add(s.id);
  const shot = shots.get(s.id);
  if (!shot) throw new Error('project.json 缺少镜头: ' + s.id);
  const camera = shot.camera === 'none' ? 'push-in' : shot.camera;
  fs.writeFileSync(path.join(outDir, `${s.id}.html`), page(s, camera, shot.zoom), 'utf8');
}
console.log(`写出 ${all.length} 个原创场景 → gen-scenes-intro/（镜头 ${project.shots.length}）`);
if (project.shots.length !== all.length) {
  console.error('镜头数与场景数不一致！');
  process.exit(1);
}
// 预校验（与流水线同一校验器；narration 取真实旁白，title 取项目标题）
const checker = `
import { V } from '../src/core/index.js';
import fs from 'node:fs';
import path from 'node:path';
const project = JSON.parse(fs.readFileSync(path.join(${JSON.stringify(projRoot)}, 'project.json'), 'utf8'));
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
`;
fs.writeFileSync(path.join(__dirname, 'precheck-intro.ts'), checker, 'utf8');
console.log(execSync('npx tsx scripts/precheck-intro.ts', { encoding: 'utf8', cwd: path.join(__dirname, '..') }));

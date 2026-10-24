// 组装 56 个原创场景为完整 HTML 并预校验（validateSceneFile 与流水线同源）
const fs = require('fs');
const path = require('path');
const A = require('./scenes-a.cjs');
const B = require('./scenes-b.cjs');
const C = require('./scenes-c.cjs');
const { execSync } = require('child_process');

const BG = '#05070f';
function page(s) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>
html,body{margin:0;height:100%;overflow:hidden}body{font-family:sans-serif;background:${BG}}
.stage{position:relative;width:100%;height:100%;overflow:hidden}
${s.css}
.grain,.vignette,.letterbox{position:absolute;inset:0;pointer-events:none}
.letterbox{display:block;background:linear-gradient(to bottom,#000 0 8%,transparent 8% 92%,#000 92% 100%)}
.vignette{background:radial-gradient(ellipse at center,transparent 55%,#000 130%);opacity:.4}
</style></head><body data-scene-id="${s.id}">
<div class="stage">${s.markup}</div>
<div class="vignette"></div>
<div class="letterbox"></div>
<script src="../motion/motion-lib.js"></script>
<script>document.addEventListener('DOMContentLoaded',function(){
${s.anim}
});</script></body></html>`;
}

const all = [...A, ...B, ...C];
const outDir = path.join(__dirname, '..', 'gen-scenes');
fs.mkdirSync(outDir, { recursive: true });
const ids = new Set();
for (const s of all) {
  if (ids.has(s.id)) throw new Error('重复 id: ' + s.id);
  ids.add(s.id);
  fs.writeFileSync(path.join(outDir, `${s.id}.html`), page(s), 'utf8');
}
console.log(`写出 ${all.length} 个原创场景 → gen-scenes/`);
// 预校验（与流水线同一校验器；TS 源经 tsx 跑）
const checker = `
import { V } from '../src/core/index.js';
import fs from 'node:fs';
import path from 'node:path';
const dir = 'gen-scenes';
let bad = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html')).sort()) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const issues = V.validateSceneFile(html, { narration: '占位旁白用于预检'.repeat(2), title: '黑洞是怎么形成的' });
  if (issues.length) {
    bad++;
    console.log(f, '=>', issues.map((i) => i.id + ':' + i.message.slice(0, 60)).join(' | '));
  }
}
console.log(bad === 0 ? '全部 56 镜预检通过' : bad + ' 镜未过预检');
`;
fs.writeFileSync(path.join(__dirname, 'precheck-scenes.ts'), checker, 'utf8');
console.log(execSync('npx tsx scripts/precheck-scenes.ts', { encoding: 'utf8', cwd: path.join(__dirname, '..') }));

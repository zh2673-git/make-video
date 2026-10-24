
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

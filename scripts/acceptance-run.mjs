// 端到端验收：参考片同款讲稿 → 语义分镜 → 全流程真实渲染
// 用 spawn args 数组传中文参数（绕开 PowerShell 内联中文损坏）
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const REF = 'projects/黑洞是怎么形成的-mvmb1dqz/project.json';
const ref = JSON.parse(fs.readFileSync(REF, 'utf8'));
fs.writeFileSync('scripts/blackhole-script.json', JSON.stringify(ref.script, null, 2));

function run(args) {
  return new Promise((resolve) => {
    const p = spawn('npx', ['tsx', 'src/interfaces/cli.ts', ...args], {
      shell: true,
      cwd: process.cwd(),
    });
    let out = '';
    p.stdout.on('data', (d) => {
      out += d;
      process.stdout.write(d);
    });
    p.stderr.on('data', (d) => {
      out += d;
      process.stderr.write(d);
    });
    p.on('close', (code) => resolve({ code, out }));
  });
}

console.log('=== init（注入讲稿，cosmos-cinematic）===');
const init = await run([
  'init',
  '黑洞是怎么形成的',
  '--genre',
  String(ref.meta.genre),
  '--script',
  'scripts/blackhole-script.json',
]);
const m = init.out.match(/"project":\s*"([^"]+)"/);
if (!m) {
  console.error('init 失败，未拿到项目 id');
  process.exit(1);
}
const id = m[1];
console.log('=== run --yes（真实渲染）project=' + id + ' ===');
const t0 = Date.now();
const r = await run(['run', '--project', id, '--yes']);
console.log(`=== run 退出码 ${r.code}，耗时 ${((Date.now() - t0) / 1000).toFixed(1)}s ===`);

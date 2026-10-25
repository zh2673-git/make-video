// CLI 调用助手：以 UTF-8 安全方式 spawn make-video CLI（绕开 PowerShell 内联中文 GBK 问题）
import { spawn } from 'node:child_process';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');

export function runCli(args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs'), path.join(ROOT, 'src', 'interfaces', 'cli.ts'), ...args],
      { cwd: ROOT, shell: false, env: { ...process.env, ...(opts.env ?? {}) } },
    );
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', (d) => { err += d.toString(); });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, out, err }));
  });
}

export async function runCliOrThrow(args, opts = {}) {
  const r = await runCli(args, opts);
  if (r.code !== 0) {
    throw new Error(`CLI failed (${r.code}) ${args.join(' ')}\n${r.out}\n${r.err}`);
  }
  return r;
}

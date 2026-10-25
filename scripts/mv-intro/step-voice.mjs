// 步骤 3：登记场景资产 → 批量 TTS 旁白 → 逐镜采纳配音 → 进入 compose
import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { runCliOrThrow, ROOT } from './cli-run.mjs';

async function main() {
  const projectId = process.argv[2];
  if (!projectId) throw new Error('usage: node step-voice.mjs <project-id>');
  const projDir = path.join(ROOT, 'projects', projectId);
  const pj = path.join(projDir, 'project.json');
  const project = JSON.parse(await fs.readFile(pj, 'utf8'));

  // 场景即素材（code-scene）：asset 指向已过闸的场景文件
  for (const shot of project.shots) {
    shot.asset = {
      kind: 'code-scene',
      path: path.join(projDir, 'scenes', `Scene_${shot.id}.html`),
      meta: { scene: shot.id, kenBurns: true },
    };
    shot.state = 'sourced';
  }
  await fs.writeFile(pj, `${JSON.stringify(project, null, 2)}\n`, 'utf8');

  // TTS：edge-tts 批量合成（mp3 直采，避免 mp3 数据写 .wav 扩展名）
  const tts = await new Promise((resolve, reject) => {
    const child = spawn('python', [path.join(ROOT, 'scripts', 'mv-intro', 'tts.py'), pj], {
      cwd: ROOT, shell: false, env: process.env,
    });
    let out = '';
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', (d) => process.stderr.write(d.toString()));
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, out }));
  });
  console.log(tts.out.trim());
  if (tts.code !== 0) throw new Error('TTS 失败');

  // 逐镜采纳旁白（实测时长即时间真源）
  for (const shot of project.shots) {
    const mp3 = path.join(projDir, 'audio', 'vo', `${shot.id}.mp3`);
    await runCliOrThrow(['voice', '--project', projectId, '--shot', shot.id, '--from', mp3]);
  }

  // 状态推进到 compose
  const fresh = JSON.parse(await fs.readFile(pj, 'utf8'));
  for (const shot of fresh.shots) shot.state = 'voiced';
  fresh.stage = 'compose';
  await fs.writeFile(pj, `${JSON.stringify(fresh, null, 2)}\n`, 'utf8');
  const total = fresh.shots.reduce((a, s) => a + (s.voice?.durationMs ?? 0), 0);
  console.log(`voice: shots=${fresh.shots.length} totalMs=${total} (${(total / 1000).toFixed(1)}s)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

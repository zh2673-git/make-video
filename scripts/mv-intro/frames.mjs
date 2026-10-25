// 验收抽帧：按时间线在每镜中点抽一帧，用于人工视觉检查
import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { ROOT } from './cli-run.mjs';

const IDS = process.env['MV_FRAMES'] ? process.env['MV_FRAMES'].split(',') : [
  's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09',
  's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18',
  's19', 's20', 's21', 's22', 's23', 's24', 's25', 's26', 's27',
  's28', 's29', 's30', 's31', 's32', 's33', 's34', 's35', 's36',
];

async function main() {
  const dir = path.join(ROOT, 'projects');
  const entries = await fs.readdir(dir);
  let best = null;
  let bestTime = 0;
  for (const e of entries) {
    try {
      const st = await fs.stat(path.join(dir, e, 'project.json'));
      if (st.mtimeMs > bestTime) { bestTime = st.mtimeMs; best = e; }
    } catch { /* ignore */ }
  }
  const project = JSON.parse(await fs.readFile(path.join(dir, best, 'project.json'), 'utf8'));
  const mp4 = path.join(dir, best, 'out', `${best}.mp4`);
  const outDir = path.join(ROOT, 'tmp', 'frames');
  await fs.mkdir(outDir, { recursive: true });
  for (const id of IDS) {
    const s = project.timeline.shots.find((x) => x.shotId === id);
    if (!s) continue;
    const mid = ((s.startMs + s.durationMs / 2) / 1000).toFixed(2);
    await new Promise((resolve, reject) => {
      const c = spawn('ffmpeg', ['-y', '-v', 'error', '-ss', mid, '-i', mp4, '-frames:v', '1', path.join(outDir, `${id}.jpg`)], { shell: false });
      c.on('error', reject);
      c.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${id} ${code}`))));
    });
    console.log(`${id} @ ${mid}s`);
  }
  // 九宫格拼图（4 张）
  const groups = [];
  for (let i = 0; i < IDS.length; i += 9) groups.push(IDS.slice(i, i + 9));
  for (let gi = 0; gi < groups.length; gi += 1) {
    const g = groups[gi];
    if (g.length < 9) continue;
    const args = [];
    for (const id of g) args.push('-i', path.join(outDir, `${id}.jpg`));
    const fc = '[0][3][6]hstack=3[r0];[1][4][7]hstack=3[r1];[2][5][8]hstack=3[r2];[r0][r1][r2]vstack=3,scale=1400:-1';
    args.push('-filter_complex', fc, '-frames:v', '1', '-y', path.join(ROOT, 'tmp', `m${gi}.jpg`));
    await new Promise((resolve, reject) => {
      const c = spawn('ffmpeg', args, { shell: false });
      c.on('error', reject);
      c.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`montage ${gi} ${code}`))));
    });
    console.log(`montage m${gi}.jpg`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

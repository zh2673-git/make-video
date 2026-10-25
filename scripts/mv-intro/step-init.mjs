// 步骤 1：init + storyboard + 人工策展（导演批注/景别/对位/色温/字幕策略）
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { runCliOrThrow, ROOT } from './cli-run.mjs';
import { plan } from './plan.mjs';

const TOPIC = '键盘就是片场';
const SCRIPT = path.join(ROOT, 'scripts', 'mv-intro', 'script.json');

async function main() {
  const init = await runCliOrThrow([
    'init', TOPIC,
    '--aspect', '16:9',
    '--duration-tier', '0-5',
    '--genre', 'product-promo',
    '--style', 'comedy-pop',
    '--script', SCRIPT,
  ]);
  console.log(init.out.trim());
  const projectId = JSON.parse(init.out).project;

  const sb = await runCliOrThrow(['storyboard', '--project', projectId, '--style', 'comedy-pop']);
  console.log(sb.err.trim());

  const pj = path.join(ROOT, 'projects', projectId, 'project.json');
  const project = JSON.parse(await fs.readFile(pj, 'utf8'));

  // 导演批注：逐镜视觉意图（agent 亲撰，不是模板兜底）
  project.directorNotes = project.shots.map((shot) => {
    const seg = project.script.segments.find((s) => s.id === shot.segmentId);
    const p = plan[shot.id];
    return {
      segmentId: shot.segmentId,
      visualIntent: p.intent,
      emotionGoal: seg?.mood ?? '稳定推进',
      referenceMood: '周星驰式一本正经的荒诞：庄重形式 × 琐碎内容',
      counterpoint: p.cp,
    };
  });

  // 逐镜策展：景别 / 运镜 / 对位 / 破功声明 / 色温 / 转场 / 视觉规格
  project.shots = project.shots.map((shot, i) => {
    const p = plan[shot.id];
    if (!p) throw new Error(`策展表缺少 ${shot.id}`);
    return {
      ...shot,
      zoom: p.zoom,
      camera: p.camera,
      counterpoint: p.cp,
      gag: p.gag,
      colorTemp: p.temp,
      transition: p.tr,
      motivation: p.intent,
      visual: {
        ...shot.visual,
        kind: 'code-scene',
        template: 'typography',
        prompt: p.intent,
        params: { scene: `scene-${i + 1}`, side: 'center' },
      },
    };
  });

  project.materialDecisions = Object.fromEntries(
    project.shots.map((s) => [s.id, { kind: 'code-scene', reason: '逐镜原创场景（代码绘制，不使用外部素材）' }]),
  );
  project.style = {
    id: 'comedy-pop',
    source: 'user-specified',
    rationale: '用户指定周星驰式无厘头：庄重形式 × 琐碎内容，大制作质感与喜剧反差同片',
    lineage: {},
    overrides: {},
  };
  project.subtitlePolicy = 'keyword';
  project.confirmed = true;

  await fs.writeFile(pj, `${JSON.stringify(project, null, 2)}\n`, 'utf8');
  console.log(`project=${projectId} shots=${project.shots.length} curated`);
}

main().catch((e) => { console.error(e); process.exit(1); });

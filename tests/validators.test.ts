import { describe, expect, it } from 'vitest';
import { V } from '../src/core/index.js';
import { parseScript, validateCharBudget } from '../src/domain/scriptwriter.js';
import type { Project } from '../src/core/schema.js';

describe('V-STYLE-003 组合确认门', () => {
  const decision = {
    id: 'noir-contrast',
    source: 'agent-chosen' as const,
    rationale: '自由组合：base + noir effects',
    lineage: { base: 'keynote-minimal' },
    overrides: {},
  };
  const gate = (style: unknown, confirmed: boolean) =>
    V.validateStyleGate({ style, confirmed } as unknown as Project);

  it('agent 自由组合未确认 → error', () => {
    expect(V.hasError(gate(decision, false))).toBe(true);
  });
  it('用户显式确认后放行', () => {
    expect(V.hasError(gate(decision, true))).toBe(false);
  });
  it('user-specified 组合不需要二次确认；recipe 预绑不触发', () => {
    expect(V.hasError(gate({ ...decision, source: 'user-specified' }, false))).toBe(false);
    expect(
      V.hasError(gate({ ...decision, source: 'recipe-recommended', lineage: {} }, false)),
    ).toBe(false);
  });
});

describe('场景校验器', () => {
  // 合法场景夹具必须含母题循环（V-MOT-021）：入场动作之外还要有持续运动，
  // 否则镜头后半段是死画面。夹具跟随不变量一起演进。
  const goodScene = `<body data-scene-id="s01"><div class="subject">hi</div>
<script>MV.enter('.subject', {duration: 600});
MV.motifLoop('.subject', {kind: 'pulse', amp: 0.6});</script></body>`;

  it('合法场景通过', () => {
    const issues = V.validateSceneFile(goodScene, { narration: '这是一段旁白。' });
    expect(V.hasError(issues)).toBe(false);
  });

  it('禁时间轴属性', () => {
    const bad = goodScene.replace('data-scene-id="s01"', 'data-scene-id="s01" data-start="0"');
    expect(V.hasError(V.validateSceneFile(bad, { narration: '旁白' }))).toBe(true);
  });

  it('禁非白名单原语', () => {
    const bad = goodScene.replace("MV.enter('.subject'", "MV.fly('.subject'");
    const issues = V.validateSceneFile(bad, { narration: '旁白' });
    expect(issues.some((i) => i.id === 'V-SCENE-003')).toBe(true);
  });

  it('对位铁律：画面复述旁白原文被拦', () => {
    const bad = goodScene.replace('hi', '黑洞的形成');
    const issues = V.validateSceneFile(bad, { narration: '今天讲讲黑洞的形成。' });
    expect(issues.some((i) => i.id === 'V-SCENE-005')).toBe(true);
  });

  it('对位铁律：仅两字巧合不误报', () => {
    const ok = goodScene.replace('hi', '黑洞');
    const issues = V.validateSceneFile(ok, { narration: '今天讲讲黑洞的形成。' });
    expect(issues.some((i) => i.id === 'V-SCENE-005')).toBe(false);
  });

  it('图表禁 3D 装饰（Tufte）', () => {
    const bad = '<div>立体饼图 3d 效果</div>';
    expect(V.hasError(V.validateChartScene(bad))).toBe(true);
  });
});

describe('风格校验器', () => {
  const pack = {
    id: 'p',
    name: 'n',
    grade: 'A' as const,
    status: 'registered' as const,
    userFacing: { name: 'n', aliases: [], vibe: 'v', bestFor: [] },
    anatomy: {
      script: 's', directing: 'd', art: 'a', camera: 'c',
      performance: 'p', sourcing: 'so', sound: 'sd', editing: 'e',
    },
    palette: { primary: '#111111', accent: '#222222', neutral: ['#1','#2','#3','#4','#5'], colorArc: 'x' },
    type: { families: ['sans'], scale: { title: 0.1, body: 0.03 }, tracking: {} },
    layout: { density: 0.3, maxElementsPerShot: 3, whitespace: 0.4 },
    motion: { easing: 'e', intensity: 0.5, staggerMs: 80, spring: { stiffness: 180, damping: 20 } },
    pacing: { curve: 'c', shotLenMs: [1500, 3000] as [number, number], breathEvery: 5 },
    effects: {},
    transitions: ['dissolve'],
    shotScaleBias: ['MS' as const],
    provenance: { source: 'manual' as const, from: 'x', version: '1.0' },
  };

  it('无 rationale 的风格决策被拦', () => {
    expect(V.hasError(V.validateStyleDecision({ id: 'p', source: 'agent-chosen', rationale: '' }))).toBe(true);
  });

  it('组合覆写未知参数组被拦', () => {
    const issues = V.validateCombination(pack, { bogus: 1 }, [pack]);
    expect(V.hasError(issues)).toBe(true);
  });

  it('合法覆写通过', () => {
    const issues = V.validateCombination(pack, { effects: { grain: 0.2 }, _lineage: [] }, [pack]);
    expect(V.hasError(issues)).toBe(false);
  });

  it('沉淀包缺 review 不许上架', () => {
    const absorbed = { ...pack, provenance: { ...pack.provenance, source: 'absorbed' as const, review: '' } };
    expect(V.hasError(V.validateProvenance(absorbed))).toBe(true);
    const reviewed = { ...absorbed, provenance: { ...absorbed.provenance, review: '对拍通过' } };
    expect(V.hasError(V.validateProvenance(reviewed))).toBe(false);
  });

  it('agent-chosen 风格缺谱系是 error（V-STYLE-004）', () => {
    const issues = V.validateStyleDecision({ id: 'p', source: 'agent-chosen', rationale: '理由充分' });
    const hit = issues.find((i) => i.id === 'V-STYLE-004');
    expect(hit?.level).toBe('error');
  });
});

describe('剪辑节奏校验器', () => {
  const mkShot = (id: string, narration: string) =>
    ({ id, narration, visual: { kind: 'code-scene', template: 'typography', params: {} }, state: 'ready', zoom: 'MS', camera: 'none', transition: 'dissolve', gag: false } as never);
  const mkTimeline = (narrations: string[]) => ({
    shots: narrations.map((_, i) => ({ shotId: `s${String(i + 1).padStart(2, '0')}`, startMs: i * 5000, durationMs: 5000, transition: 'dissolve' })),
    subtitles: [],
    sfx: [],
  } as never);

  it('句中切镜是 error（V-RHY-002，心理眨眼铁律）', () => {
    const shots = [mkShot('s01', '这是一句没有说完的旁白'), mkShot('s02', '第二句。')];
    const issues = V.validateCutPoints(shots, mkTimeline(['a', 'b']));
    const hit = issues.find((i) => i.id === 'V-RHY-002');
    expect(hit?.level).toBe('error');
  });

  it('句读边界切镜通过', () => {
    const shots = [mkShot('s01', '第一句完整。'), mkShot('s02', '第二句。')];
    expect(V.hasError(V.validateCutPoints(shots, mkTimeline(['a', 'b'])))).toBe(false);
  });

  it('段数≠镜数报 V-RHY-007（非借号）', () => {
    const p = {
      script: { fullText: '', segments: [{ id: 'seg-1', text: 'a', function: 'inform' }] },
      shots: [mkShot('s01', 'a'), mkShot('s02', 'b')],
    } as never;
    const issues = V.validateStoryboard(p);
    expect(issues.some((i) => i.id === 'V-RHY-007')).toBe(true);
    expect(issues.some((i) => i.id === 'V-STE-003')).toBe(false);
  });
});

// v1.1.0 事故复现：8 句套话按 i % 8 轮转填满 30 段、画面按 8 模板循环 3.75 遍，
// 当时所有形式校验全绿。以下用例锁死「内容空转必须被拦」。
describe('内容门（v1.1.1）', () => {
  const mkShot = (id: string, narration: string, template = 'typography') =>
    ({ id, narration, segmentId: id, visual: { kind: 'code-scene', template, params: {} }, state: 'ready' } as never);

  it('V-SCP-011 台词重复：8 句循环填 30 段判 error', () => {
    const pool = Array.from({ length: 8 }, (_, i) => `第 ${i + 1} 句套话。`);
    const segments = Array.from({ length: 30 }, (_, i) => ({
      id: `seg-${i + 1}`,
      text: pool[i % 8]!,
      function: 'advance' as const,
    }));
    const issues = V.validateScriptContent({ fullText: '', segments } as never, 'CPU 流水线');
    expect(issues.find((i) => i.id === 'V-SCP-011')?.level).toBe('error');
  });

  it('V-SCP-012 套话黑名单：可套任意主题的空话命中 ≥2 段判 error', () => {
    const segments = [
      { id: 'seg-1', text: '把镜头拉近，看看这条流水线。', function: 'advance' as const },
      { id: 'seg-2', text: '回到最初的问题：它为什么快？', function: 'advance' as const },
      { id: 'seg-3', text: '取指阶段每秒搬运 4 条指令。', function: 'advance' as const },
    ];
    const issues = V.validateScriptContent({ fullText: '', segments } as never, 'CPU 流水线');
    expect(issues.find((i) => i.id === 'V-SCP-012')?.level).toBe('error');
  });

  it('V-SCP-013 主题落地：写通用叙事不写主题判 error', () => {
    const segments = Array.from({ length: 6 }, (_, i) => ({
      id: `seg-${i + 1}`,
      text: `这是第 ${i + 1} 个通用的观察，和它背后的故事。`,
      function: 'advance' as const,
    }));
    const issues = V.validateScriptContent({ fullText: '', segments } as never, 'CPU 流水线');
    expect(issues.some((i) => i.id === 'V-SCP-013' && i.level === 'error')).toBe(true);
  });

  it('V-SCP-015 离线占位标记直接判 error（硬闸）', () => {
    const segments = [
      { id: 'seg-1', text: '【离线占位】第 1 段待 LLM 填写：CPU 流水线', function: 'advance' as const },
      { id: 'seg-2', text: '【离线占位】第 2 段待 LLM 填写：CPU 流水线', function: 'advance' as const },
    ];
    const issues = V.validateScriptContent({ fullText: '', segments } as never, 'CPU 流水线');
    expect(issues.find((i) => i.id === 'V-SCP-015')?.level).toBe('error');
  });

  it('真有内容的讲稿零 error（门不能误伤正常稿）', () => {
    const lines = [
      '主频 4GHz 不等于每秒执行四十亿条指令。',
      '流水线把一条指令拆成取指、译码、执行、访存、写回五级。',
      '数据冒险时后一条指令要等前一条写回。',
      '转发技术绕过寄存器直接传结果，省下两个周期。',
      '分支预测猜错要清空流水线，损失十几个周期。',
      '所以电脑很快，一半是流水线替你藏起来的错觉。',
    ];
    const segments = lines.map((text, i) => ({ id: `seg-${i + 1}`, text, function: 'advance' as const }));
    const issues = V.validateScriptContent({ fullText: lines.join(''), segments } as never, '流水线');
    expect(issues.filter((i) => i.level === 'error')).toEqual([]);
  });

  it('V-RHY-012 画面形态周期重复：8 模板循环 3.75 遍判 error', () => {
    const forms = Array.from({ length: 8 }, (_, i) => `tpl-${i}`);
    const shots = Array.from({ length: 30 }, (_, i) => mkShot(`s${i + 1}`, `第 ${i + 1} 句旁白。`, forms[i % 8]!));
    const issues = V.validateRhythmPeriodicity({ shots } as never);
    expect(issues.find((i) => i.id === 'V-RHY-012')?.level).toBe('error');
  });

  it('V-RHY-012 全片单一形态判 error', () => {
    const shots = Array.from({ length: 10 }, (_, i) => mkShot(`s${i + 1}`, `第 ${i + 1} 句旁白。`));
    const issues = V.validateRhythmPeriodicity({ shots } as never);
    expect(issues.some((i) => i.id === 'V-RHY-012')).toBe(true);
  });

  it('V-RHY-012 形态多样且无周期时放行', () => {
    const forms = ['paper-stage', 'flow', 'chart', 'comparison', 'process-track', 'kinetic-type', 'atmosphere'];
    const shots = Array.from({ length: 14 }, (_, i) => mkShot(`s${i + 1}`, `第 ${i + 1} 句不同的旁白内容。`, forms[i % forms.length]!));
    expect(V.validateRhythmPeriodicity({ shots } as never)).toEqual([]);
  });
});

describe('编剧校验器', () => {
  it('parseScript 缺功能直接报错（V-SCP-001 不被默认值架空）', () => {
    const raw = { fullText: '文本', segments: [{ id: 'seg-1', text: '无功能段' }] };
    expect(() => parseScript(raw)).toThrow(/V-SCP-001|未标功能/);
  });

  // V-SCP-005 字数口径：中文按字算（60000/MS_PER_CHAR_CN ≈ 273 字/分），不是英文 wordsPerMin。
  // 旧口径把 2.5 分钟档目标定成 325 字，正常中文讲稿（~680 字）全被判「偏离」——警告变噪音。
  it('V-SCP-005 中文正常字数不告警（按字/durationTier 推导，不按 wordsPerMin）', () => {
    const recipe = {
      durationTiers: { '0-5': { wordsPerMin: 130, structure: 'x', chapters: 2 } },
    } as never;
    // 2.5min × 60000ms / 220ms ≈ 682 字，取 660 字（-3%）应落在 ±20% 内
    const text = '流'.repeat(22);
    const script = {
      fullText: '',
      segments: Array.from({ length: 30 }, (_, i) => ({
        id: `seg-${i + 1}`,
        text,
        function: 'advance' as const,
      })),
    };
    expect(validateCharBudget(script as never, recipe, '0-5')).toEqual([]);
    // 明显过短（150 字）仍要告警，门没被放松成永不触发
    const thin = {
      fullText: '',
      segments: [{ id: 'seg-1', text: '短'.repeat(150), function: 'advance' as const }],
    };
    expect(validateCharBudget(thin as never, recipe, '0-5').some((i) => i.id === 'V-SCP-005')).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import type { Project, Timeline } from '../src/core/schema.js';
import {
  cleanKeywords,
  computeTimeline,
  continuityReport,
  highlightSentence,
  pickCaptionSide,
  validateReadiness,
} from '../src/domain/composer.js';
import { V } from '../src/core/index.js';

function makeProject(): Project {
  const shot = (id: string, dur: number, scene: string, side = 'center') => ({
    id,
    segmentId: `seg-${id}`,
    narration: `第${id}段旁白，`,
    visual: {
      kind: 'code-scene' as const,
      prompt: '',
      params: { scene, side },
    },
    zoom: 'MS' as const,
    camera: 'none',
    motivation: 'static',
    counterpoint: 'metaphor' as const,
    gag: false,
    transition: 'dissolve',
    state: 'voiced' as const,
    asset: { kind: 'code-scene' as const, path: `/tmp/${id}.html`, meta: {} },
    voice: { file: `/tmp/${id}.wav`, durationMs: dur, voice: 'silent', rate: 1, source: 'tts' as const, estimated: false },
  });
  return {
    schemaVersion: 1,
    meta: {
      id: 'p1',
      title: 't',
      topic: 'topic',
      aspect: '16:9',
      durationTier: '0-5',
      fps: 30,
      genre: 'science-explainer',
      assetPolicy: 'auto',
    },
    stage: 'compose',
    directorNotes: [],
    shots: [shot('s01', 2000, 'scene-1'), shot('s02', 3000, 'scene-1'), shot('s03', 2500, 'scene-2')],
    materialDecisions: {},
    confirmed: true,
  };
}

describe('composer', () => {
  it('时间线满足音画同步不变量', () => {
    const p = makeProject();
    const tl = computeTimeline(p);
    expect(tl.shots.map((s) => s.startMs)).toEqual([0, 2000, 5000]);
    expect(tl.shots.map((s) => s.durationMs)).toEqual([2000, 3000, 2500]);
    expect(V.hasError(V.validateTimelineSync(p.shots, tl))).toBe(false);
  });

  it('时长不齐被检出', () => {
    const p = makeProject();
    const tl = computeTimeline(p);
    const broken: Timeline = {
      ...tl,
      shots: tl.shots.map((s, i) => (i === 1 ? { ...s, startMs: 9999 } : s)),
    };
    const issues = V.validateTimelineSync(p.shots, broken);
    expect(V.hasError(issues)).toBe(true);
  });

  it('同场景跨镜跳轴被检出，声明 gag 后放行', () => {
    const p = makeProject();
    p.shots[1]!.visual.params['side'] = 'right';
    const report = continuityReport(p);
    expect(report.items.some((i) => i.status === 'violation')).toBe(true);
    p.shots.forEach((s) => (s.gag = true));
    const report2 = continuityReport(p);
    expect(report2.items.some((i) => i.status === 'violation')).toBe(false);
    expect(report2.items.some((i) => i.status === 'declared-gag')).toBe(true);
  });

  it('缺旁白/缺素材被 readiness 拦下', () => {
    const p = makeProject();
    delete p.shots[2]!.voice;
    delete p.shots[1]!.asset;
    const issues = validateReadiness(p);
    expect(V.hasError(issues)).toBe(true);
    expect(issues.some((i) => i.id === 'V-SND-002')).toBe(true);
    expect(issues.some((i) => i.id === 'V-AST-005')).toBe(true);
  });

  it('音效落点不对齐被检出', () => {
    const p = makeProject();
    const tl = computeTimeline(p);
    tl.sfx = [{ file: 'x.wav', atMs: 12345, kind: 'hit' }];
    expect(V.hasError(V.validateSfxLanding(tl))).toBe(true);
    tl.sfx = [{ file: 'x.wav', atMs: 2000, kind: 'hit' }];
    expect(V.hasError(V.validateSfxLanding(tl))).toBe(false);
  });

  it('V-CAP-001 排版感知：主语在下方则字幕落顶部，反之落底部，读不出保守落底', () => {
    const lowSubject = `.subject{position:absolute;left:50%;top:72%;width:20vmin}`;
    const highSubject = `.subject{position:absolute;left:50%;top:30%;width:20vmin}`;
    const bottomAnchored = `.subject{position:absolute;left:20%;bottom:12%;width:20vmin}`;
    expect(pickCaptionSide(lowSubject)).toBe('top');
    expect(pickCaptionSide(highSubject)).toBe('bottom');
    expect(pickCaptionSide(bottomAnchored)).toBe('top');
    expect(pickCaptionSide('<div class="foo">无主语</div>')).toBe('bottom');
    expect(pickCaptionSide(`.subject{top:calc(50% - 10vmin)}`)).toBe('bottom');
  });

  it('V-CAP-002 关键词清洗：去标点、限长、去重、限量', () => {
    expect(cleanKeywords(['曾经，有', '机会摆在', 'make-video', '机会摆在'], 2)).toEqual(['曾经有', '机会摆在']);
    expect(cleanKeywords(['让代码来', '机会'], 2)).toEqual(['让代码来', '机会']);
    expect(cleanKeywords(['这是一个远远超过十二个字上限的关键词'], 2)).toEqual([]);
    expect(cleanKeywords(['project.json', 'comedypop'], 2)).toEqual(['projectjson', 'comedypop']);
  });

  it('full 模式句内高亮：首个命中关键词包 em', () => {
    const html = highlightSentence('让代码来，让代码来。', ['让代码来']);
    expect(html).toBe('<em>让代码来</em>，让代码来。');
    expect(highlightSentence('没有命中。', ['让代码来'])).toBe('没有命中。');
  });
});

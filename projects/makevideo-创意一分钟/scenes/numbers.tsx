// 创意场景 numbers —— 非对称数字面：主数字超大左置，副数字右列堆叠，背景淡描边水印
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {useCountUp, useEntrance} from '../primitives';

export default function NumbersScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const main = useCountUp(79, 8);
  const sub1 = useCountUp(60, 20);
  const sub2 = useCountUp(13, 28);
  const mainIn = useEntrance(4);
  const watermark = interpolate(frame, [0, 30], [0, 0.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      {/* 水印：超大 79 描边字压底，信息即装饰 */}
      <div style={{position: 'absolute', right: -40, bottom: -70, fontSize: 'calc(var(--fs-display) * 6)',
        fontWeight: 900, color: 'transparent', WebkitTextStroke: '2px var(--c-primary-light)', opacity: watermark, lineHeight: 1}}>
        79
      </div>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
      </div>
      {/* 主数字区（左 55%）：79 套主题 */}
      <div style={{position: 'absolute', left: 'var(--shell-x)', top: 320, opacity: mainIn,
        transform: `translateY(${(1 - mainIn) * 50}px)`}}>
        <div style={{fontSize: 'calc(var(--fs-display) * 3.6)', fontWeight: 900, lineHeight: 1,
          color: 'var(--c-ink)', fontFamily: 'var(--font-mono)'}}>{main}</div>
        <div style={{fontSize: 'var(--fs-h1)', color: 'var(--c-accent)', fontWeight: 700, marginTop: 14}}>套设计主题</div>
        <div style={{fontSize: 'var(--fs-body)', color: 'var(--c-ink-muted)', marginTop: 12, maxWidth: 560, lineHeight: 1.7}}>
          全部来自设计系统文档的确定性移植，换主题即换风格
        </div>
      </div>
      {/* 副数字卡（右列堆叠）：60 秒 / 13 型 */}
      <div style={{position: 'absolute', right: 'var(--shell-x)', top: 300, display: 'flex', flexDirection: 'column', gap: 34}}>
        {[[sub1, '秒 · 讲稿到成片', 'clock'], [sub2, '种预制版式', 'grid']].map(([v, label], i) => (
          <div key={i} style={{width: 430, padding: '30px 40px', borderRadius: 'var(--radius)',
            background: 'var(--c-surface-card)', borderLeft: '6px solid var(--c-accent)',
            boxShadow: '0 8px 26px rgba(0,0,0,0.3)'}}>
            <div style={{fontSize: 'calc(var(--fs-display) * 1.1)', fontWeight: 800, color: 'var(--c-ink)',
              fontFamily: 'var(--font-mono)'}}>{v as string}</div>
            <div style={{fontSize: 'var(--fs-h2)', color: 'var(--c-ink-muted)', marginTop: 6}}>{label as string}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

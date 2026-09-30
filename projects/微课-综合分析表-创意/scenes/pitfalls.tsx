// 创意场景 pitfalls —— 三张警示卡横排；坑三内嵌深色小窗，"#N/A"散落闪现（确定性坐标）
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const PITS = [
  {label: '坑一', name: '辅助键连错列', note: '键和键对不上，查出来全是空值', chip: '键 ≠ 键'},
  {label: '坑二', name: '同一对方多个号码', note: '先按本方＋对方合并成一行，再拿去查', chip: '多号码 → 合并'},
  {label: '坑三', name: '漏写 IFERROR', note: '查不到就报错，表格没法看', chip: ''},
];
const NA_POS = [[16, 8], [150, 40], [262, 14], [92, 52], [220, 56], [40, 34]];

export default function PitfallsScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardW = 500;
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          每一个坑，都让表格前功尽弃
        </div>
      </div>
      <div style={{position: 'absolute', top: 320, left: 0, width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 60}}>
          {PITS.map((p, i) => {
            const s = spring({frame: frame - 8 - i * 12, fps, config: {damping: 15, stiffness: 100}});
            return (
              <div key={p.label} style={{width: cardW, padding: '32px 36px', borderRadius: 'var(--radius)',
                background: 'var(--c-surface-card)', border: '1px solid var(--c-primary-light)',
                borderTop: '6px solid var(--c-warning)', boxShadow: '0 14px 36px rgba(90,18,26,0.12)',
                opacity: s, transform: `translateY(${(1 - s) * 46}px)`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <div style={{width: 60, height: 60, borderRadius: 30, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--c-warning)', color: 'var(--c-on-primary)'}}>
                    <Icon name="alert" size={30} />
                  </div>
                  <div>
                    <div style={{color: 'var(--c-warning)', fontSize: 'var(--fs-caption)',
                      fontWeight: 800, letterSpacing: 6}}>{p.label}</div>
                    <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 800,
                      marginTop: 2}}>{p.name}</div>
                  </div>
                </div>
                <div style={{marginTop: 16, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>{p.note}</div>
                {p.chip ? (
                  <div style={{marginTop: 16, display: 'inline-block', padding: '8px 20px', borderRadius: 10,
                    background: 'var(--c-terminal-bg)', color: 'var(--c-terminal-fg)',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body)'}}>
                    {p.chip}
                  </div>
                ) : (
                  <div style={{marginTop: 16, height: 76, borderRadius: 10, position: 'relative',
                    background: 'var(--c-terminal-bg)', overflow: 'hidden'}}>
                    {NA_POS.map(([x, y], k) => (
                      <span key={k} style={{position: 'absolute', left: x, top: y,
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)', fontWeight: 700,
                        color: 'var(--c-primary-light)',
                        opacity: (0.45 + 0.55 * Math.abs(Math.sin(frame / 7 + k * 1.3))) *
                          interpolate(frame, [40 + i * 12 + k * 3, 48 + i * 12 + k * 3], [0, 1],
                            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
                        #N/A
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)',
        opacity: interpolate(frame, [56, 74], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        先对键 · 再合并 · 后兜底
      </div>
    </AbsoluteFill>
  );
}

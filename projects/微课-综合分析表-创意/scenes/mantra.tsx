// 创意场景 mantra —— 大字口诀居中展开：一键 · 两查 · 三判定，下挂三注，底部保密纪律金条
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const WORDS = [
  {w: '一键', note: '造辅助键'},
  {w: '两查', note: 'VLOOKUP 查四表'},
  {w: '三判定', note: '标出交叉类型'},
];

export default function MantraScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
      </div>
      {/* 口诀大字 */}
      <div style={{display: 'flex', alignItems: 'baseline', gap: 44, marginTop: -80}}>
        {WORDS.map((it, i) => {
          const s = spring({frame: frame - 8 - i * 10, fps, config: {damping: 13, stiffness: 90}});
          return (
            <React.Fragment key={it.w}>
              {i > 0 ? (
                <span style={{color: 'var(--c-accent)', fontSize: 'var(--fs-h1)',
                  opacity: s, transform: `scale(${s})`}}>·</span>
              ) : null}
              <div style={{textAlign: 'center', opacity: s, transform: `scale(${0.7 + s * 0.3})`}}>
                <div style={{fontSize: 'calc(var(--fs-display) * 1.1)', fontWeight: 900,
                  color: 'var(--c-ink)', letterSpacing: 6, lineHeight: 1.1}}>{it.w}</div>
                <div style={{marginTop: 18, display: 'inline-block', padding: '8px 24px', borderRadius: 999,
                  background: 'var(--c-surface-card)', border: '1px solid var(--c-accent-soft)',
                  color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>
                  {it.note}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {/* 方法复用 */}
      <div style={{marginTop: 90, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-h2)', letterSpacing: 2,
        opacity: interpolate(frame, [44, 62], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        方法不变，换一批数据，就是一份新的综合分析表
      </div>
      {/* 保密纪律金条 */}
      <div style={{position: 'absolute', bottom: 190, left: 260, right: 260,
        padding: '22px 36px', borderRadius: 'var(--radius)', background: 'var(--c-accent-soft)',
        border: '1px solid var(--c-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 18, opacity: spring({frame: frame - 56, fps, config: {damping: 16, stiffness: 90}})}}>
        <Icon name="shield" size={34} />
        <span style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 2}}>
          数据均为脚本模拟生成 · 实际工作严守保密纪律
        </span>
      </div>
    </AbsoluteFill>
  );
}

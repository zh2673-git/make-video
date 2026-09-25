// 创意场景 swatches —— 主题色板矩阵：当前主题 token 逐格弹入 + 扫光掠过（讲"换主题即换风格"）
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {staggerDelay} from '../primitives';

const SWATCHES: Array<[string, string]> = [
  ['primary', 'var(--c-primary)'], ['primaryDark', 'var(--c-primary-dark)'],
  ['primaryLight', 'var(--c-primary-light)'], ['accent', 'var(--c-accent)'],
  ['accentSoft', 'var(--c-accent-soft)'], ['surface', 'var(--c-surface)'],
  ['surfaceCard', 'var(--c-surface-card)'], ['ink', 'var(--c-ink)'],
  ['inkMuted', 'var(--c-ink-muted)'], ['success', 'var(--c-success)'],
  ['info', 'var(--c-info)'], ['warning', 'var(--c-warning)'],
];

export default function SwatchesScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sweep = interpolate(frame, [36, 78], [-30, 130], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tailIn = interpolate(frame, [70, 88], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          换主题，即换风格
        </div>
      </div>
      {/* 色板矩阵 4x3：每格 = token 色 + token 名 */}
      <div style={{position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 300px)',
        gap: 26, marginTop: 30, padding: '34px 38px', borderRadius: 'calc(var(--radius) * 1.5)',
        background: 'var(--c-surface)', border: '1px solid var(--c-primary-dark)'}}>
        {SWATCHES.map(([name, color], i) => {
          const pop = spring({frame: frame - staggerDelay(i, 6), fps, config: {damping: 14, stiffness: 120}});
          return (
            <div key={name} style={{display: 'flex', alignItems: 'center', gap: 16, opacity: pop,
              transform: `scale(${0.6 + pop * 0.4})`}}>
              <div style={{width: 58, height: 58, borderRadius: 14, background: color,
                border: '1px solid var(--c-primary-dark)', boxShadow: '0 4px 14px rgba(0,0,0,0.35)'}} />
              <div style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-caption)', color: 'var(--c-ink-muted)'}}>
                {name}
              </div>
            </div>
          );
        })}
        {/* 扫光：一道斜向光带掠过矩阵，扫完即收 */}
        <div style={{position: 'absolute', top: 0, bottom: 0, width: 220, pointerEvents: 'none',
          transform: `translateX(${sweep}%) rotate(8deg)`,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)'}} />
      </div>
      <div style={{marginTop: 36, display: 'flex', alignItems: 'center', gap: 18, opacity: tailIn}}>
        <span style={{fontSize: 'var(--fs-h2)', fontWeight: 700, color: 'var(--c-ink)'}}>颜色 · 字体 · 动效曲线</span>
        <span style={{fontSize: 'var(--fs-h2)', color: 'var(--c-accent)', fontFamily: 'var(--font-mono)'}}>=</span>
        <span style={{fontSize: 'var(--fs-h2)', color: 'var(--c-ink-muted)'}}>统一令牌契约，内容零改动</span>
      </div>
    </AbsoluteFill>
  );
}

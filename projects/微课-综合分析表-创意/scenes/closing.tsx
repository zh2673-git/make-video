// 创意场景 closing —— 片尾（全幅）：谢谢观看 + 金线生长 + 收束句 + 单位署名
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';

export const bare = true;

export default function ClosingScene({scene, meta}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame + 4, fps, config: {damping: 14, stiffness: 80}});
  const lineGrow = interpolate(frame, [16, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const breath = 0.75 + 0.25 * Math.sin(frame / 15);
  return (
    <AbsoluteFill style={{background: 'var(--bg-cover)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.10,
        backgroundImage: 'radial-gradient(var(--c-accent) 1.5px, transparent 1.5px)',
        backgroundSize: '56px 56px'}} />
      <div style={{textAlign: 'center', transform: `scale(${pop})`}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-h2)', letterSpacing: 14, opacity: breath}}>
          数据分析微课
        </div>
        <div style={{fontSize: 'calc(var(--fs-display) * 1.3)', fontWeight: 900, letterSpacing: 20,
          color: 'var(--c-on-primary)', marginTop: 26, lineHeight: 1.15}}>
          谢谢观看
        </div>
        <div style={{width: 380 * lineGrow, height: 5, margin: '34px auto',
          background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)'}} />
        <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-h1)', letterSpacing: 6}}>
          把方法沉淀成口诀 · 让数据支撑起判断
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 150, width: '100%', textAlign: 'center',
        color: 'var(--c-accent-soft)', fontSize: 'var(--fs-body)', letterSpacing: 4,
        opacity: interpolate(frame, [40, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {meta.unit ?? '姑苏区纪委监委'}　·　制作人：{meta.author ?? '张行'}　·　我们下期再见
      </div>
    </AbsoluteFill>
  );
}

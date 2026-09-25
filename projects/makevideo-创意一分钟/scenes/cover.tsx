// 创意场景 cover —— 片头：产品名弹入 + "讲稿进/成片出"双词组相向合拢 + 底部管线光带生长
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';

export const bare = true;

export default function CoverScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const breath = 0.55 + 0.45 * Math.sin(frame / 14);  // 光标呼吸
  const beam = interpolate(frame, [24, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const words = ['讲稿进', '成片出'];
  return (
    <AbsoluteFill style={{background: 'var(--bg-cover)', fontFamily: 'var(--font-body)', justifyContent: 'center', alignItems: 'center'}}>
      {/* 背景网格点阵：极淡，克制的空间感 */}
      <div style={{position: 'absolute', inset: 0, opacity: 0.10,
        backgroundImage: 'radial-gradient(var(--c-primary-light) 1.5px, transparent 1.5px)',
        backgroundSize: '54px 54px'}} />
      <div style={{textAlign: 'center', transform: `scale(${pop})`}}>
        <div style={{fontSize: 'calc(var(--fs-display) * 2.6)', fontWeight: 900, letterSpacing: 8,
          color: 'var(--c-on-primary)', lineHeight: 1.1}}>
          Make<span style={{color: 'var(--c-accent)'}}>Video</span>
        </div>
        <div style={{marginTop: 18, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-h2)', letterSpacing: 6}}>
          讲稿驱动的微视频生成工具
        </div>
      </div>
      {/* 双词组相向合拢：语义是"输入→输出" */}
      <div style={{position: 'absolute', bottom: 250, display: 'flex', gap: 26, alignItems: 'center'}}>
        {words.map((w, i) => {
          const dir = i === 0 ? -1 : 1;
          const slide = spring({frame: frame - 16 - i * 8, fps, config: {damping: 16, stiffness: 110}});
          return (
            <React.Fragment key={w}>
              {i === 1 ? (
                <div style={{fontSize: 'var(--fs-h1)', color: 'var(--c-accent)', opacity: breath, fontFamily: 'var(--font-mono)'}}>
                  →
                </div>
              ) : null}
              <div style={{
                padding: '14px 38px', borderRadius: 999, fontSize: 'var(--fs-h1)', fontWeight: 700,
                color: 'var(--c-on-primary)', background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                border: '1px solid var(--c-accent-soft)',
                transform: `translateX(${dir * (1 - slide) * 140}px)`, opacity: slide,
              }}>{w}</div>
            </React.Fragment>
          );
        })}
      </div>
      {/* 底部管线光带：代表被调度的时间轴层 */}
      <div style={{position: 'absolute', bottom: 120, width: 760, height: 4, borderRadius: 2,
        background: 'var(--c-surface-alt)', overflow: 'hidden'}}>
        <div style={{width: `${beam * 100}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--c-primary), var(--c-accent))',
          boxShadow: '0 0 18px var(--c-accent)'}} />
      </div>
    </AbsoluteFill>
  );
}

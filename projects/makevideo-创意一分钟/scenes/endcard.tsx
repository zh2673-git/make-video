// 创意场景 endcard —— 片尾公式页："讲稿 + 主题 = 微视频" 三胶囊公式 + 星点呼吸背景（bare 全幅）
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';

export const bare = true;

// 确定性星点：位置由序号派生，闪烁相位各异（无随机数，重复渲染逐帧一致）
const STARS = Array.from({length: 34}, (_, i) => ({
  x: (i * 7919) % 1870 + 25,
  y: (i * 6079) % 960 + 40,
  r: 1.6 + (i % 3) * 0.9,
  phase: i * 1.7,
}));

export default function EndcardScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 6, fps, config: {damping: 15, stiffness: 95}});
  const chips = ['讲稿', '主题'];
  const glow = 0.5 + 0.5 * Math.sin(frame / 16);
  return (
    <AbsoluteFill style={{background: 'var(--bg-cover)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      {STARS.map((s, i) => (
        <div key={i} style={{position: 'absolute', left: s.x, top: s.y, width: s.r * 2, height: s.r * 2,
          borderRadius: s.r, background: 'var(--c-primary-light)',
          opacity: 0.25 + 0.35 * Math.abs(Math.sin(frame / 22 + s.phase))}} />
      ))}
      <div style={{textAlign: 'center', transform: `scale(${pop})`}}>
        <div style={{fontSize: 'var(--fs-display)', fontWeight: 900, letterSpacing: 6, color: 'var(--c-on-primary)'}}>
          Make<span style={{color: 'var(--c-accent)'}}>Video</span>
        </div>
        {/* 公式行：讲稿 + 主题 = 你的微视频 */}
        <div style={{marginTop: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22}}>
          {chips.map((c, i) => (
            <React.Fragment key={c}>
              {i === 1 ? (
                <span style={{fontSize: 'var(--fs-h1)', color: 'var(--c-accent)', fontFamily: 'var(--font-mono)'}}>+</span>
              ) : null}
              <span style={{padding: '16px 44px', borderRadius: 999, fontSize: 'var(--fs-h1)', fontWeight: 700,
                color: 'var(--c-on-primary)', background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                border: '1px solid var(--c-accent-soft)'}}>{c}</span>
            </React.Fragment>
          ))}
          <span style={{fontSize: 'var(--fs-h1)', color: 'var(--c-accent)', fontFamily: 'var(--font-mono)'}}>=</span>
          <span style={{fontSize: 'var(--fs-h1)', color: 'var(--c-ink)', fontWeight: 800}}>你的微视频</span>
        </div>
        <div style={{marginTop: 60, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-h2)',
          color: 'var(--c-ink-muted)'}}>
          github.com/zh2673-git/make-video
        </div>
        <div style={{marginTop: 18, fontSize: 'var(--fs-body)', color: 'var(--c-accent-soft)', opacity: 0.6 + glow * 0.4}}>
          {scene.title} · 感谢观看
        </div>
      </div>
    </AbsoluteFill>
  );
}

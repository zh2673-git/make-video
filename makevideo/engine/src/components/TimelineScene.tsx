// [画面组件] TimelineScene —— 横向时间轴（bullets "时间|事件"，逐节点生长）
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

export const TimelineScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({scene, meta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = (scene.bullets ?? []).map((s) => {
    const idx = s.indexOf('|');
    return idx < 0 ? {t: '', label: s.trim()} : {t: s.slice(0, idx).trim(), label: s.slice(idx + 1).trim()};
  });
  const line = interpolate(frame, [10, 40], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 4, background: 'var(--c-surface-alt)', width: `${line}%`}} />
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
          {nodes.map((n, i) => {
            const pop = spring({frame: frame - 15 - i * (theme.motion.stagger + 6), fps, config: theme.motion.entranceSpring});
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${100 / Math.max(nodes.length, 1)}%`, opacity: pop}}>
                <div style={{fontSize: 'var(--fs-h2)', color: 'var(--c-primary)', fontWeight: 800, marginBottom: 14, minHeight: 40}}>{n.t}</div>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: 15, transform: `scale(${pop})`,
                    background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                    border: '4px solid var(--c-accent)',
                  }}
                />
                <div
                  style={{
                    marginTop: 16, background: 'var(--c-surface-card)', borderRadius: 'var(--radius)',
                    padding: '16px 20px', fontSize: 'var(--fs-h2)', color: 'var(--c-ink)',
                    textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', maxWidth: 320,
                  }}
                >
                  {n.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
};

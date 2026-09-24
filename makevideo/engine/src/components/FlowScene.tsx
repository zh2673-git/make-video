// [画面组件] FlowScene —— 步骤流（横向卡片 + 箭头）
// 动效变体：scale=居中放大（默认）/ rise=下方上浮
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

export const FlowScene: React.FC<{scene: Scene; meta: ProjectMeta; variant?: string}> = ({scene, meta, variant = 'scale'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = scene.bullets ?? [];
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, height: '100%'}}>
        {steps.map((s, i) => {
          const pop = spring({frame: frame - 15 - i * (theme.motion.stagger + 4), fps, config: {...theme.motion.entranceSpring, damping: theme.motion.entranceSpring.damping - 10}});
          const shift = variant === 'rise' ? `translateY(${(1 - pop) * 56}px)` : `scale(${pop})`;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div style={{fontSize: 64, color: 'var(--c-primary)', fontWeight: 800, opacity: pop}}>→</div>}
              <div
                style={{
                  background: 'var(--c-surface-card)', border: '3px solid var(--c-primary)',
                  borderRadius: 'var(--radius)', padding: '38px 40px', maxWidth: 420,
                  textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  transform: shift,
                }}
              >
                <div style={{fontSize: 'var(--fs-caption)', color: 'var(--c-accent)', fontWeight: 800, marginBottom: 10}}>STEP {i + 1}</div>
                <div style={{fontSize: 'var(--fs-h1)', color: 'var(--c-ink)', fontWeight: 700}}>{s}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Shell>
  );
};

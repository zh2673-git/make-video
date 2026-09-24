// [画面组件] QuoteScene —— 金句页（大引号 + 出处；token: --c-accent/--fs-title）
// 动效变体：mark=引号弹入+正文淡入（默认）/ rise=正文上浮入场
import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

export const QuoteScene: React.FC<{scene: Scene; meta: ProjectMeta; variant?: string}> = ({scene, meta, variant = 'mark'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 10, fps, config: theme.motion.entranceSpring});
  const rise = interpolate(frame, [10, 26], [40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '0 60px'}}>
        <div style={{fontSize: 140, color: 'var(--c-accent)', lineHeight: 0.6, opacity: variant === 'mark' ? pop : 1, fontFamily: 'var(--font-body)'}}>“</div>
        <div
          style={{
            fontSize: 'var(--fs-title)', color: 'var(--c-ink)', fontWeight: 700,
            textAlign: 'center', lineHeight: 1.5, maxWidth: 1400,
            opacity: variant === 'mark'
              ? interpolate(frame, [10, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
              : interpolate(frame, [8, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            transform: variant === 'rise' ? `translateY(${rise}px)` : 'none',
          }}
        >
          {scene.quote}
        </div>
        {scene.attribution ? (
          <div style={{fontSize: 'var(--fs-h2)', color: 'var(--c-ink-muted)', marginTop: 40, opacity: interpolate(frame, [30, 44], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            {scene.attribution}
          </div>
        ) : null}
      </div>
    </Shell>
  );
};

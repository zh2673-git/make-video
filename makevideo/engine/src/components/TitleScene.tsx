// [画面组件] TitleScene —— 封面（token: --bg-cover/--fs-display/--c-accent）
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';

export const TitleScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({scene, meta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: theme.motion.entranceSpring});
  return (
    <AbsoluteFill style={{background: 'var(--bg-cover)', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-body)'}}>
      <div style={{textAlign: 'center', transform: `scale(${scale})`}}>
        {meta.unit ? (
          <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 14, marginBottom: 40, opacity: 0.9}}>
            {meta.unit}
          </div>
        ) : null}
        <div style={{width: 120, height: 6, background: 'var(--c-accent)', margin: '0 auto 44px'}} />
        <div style={{color: 'var(--c-on-primary)', fontSize: 'var(--fs-title)', fontWeight: 800, letterSpacing: 4}}>{scene.title}</div>
        <div style={{width: 120, height: 6, background: 'var(--c-accent)', margin: '44px auto'}} />
        {(scene.subtitle ?? []).map((s, i) => (
          <div
            key={i}
            style={{
              color: 'var(--c-accent-soft)', fontSize: i === 0 ? 'var(--fs-h2)' : 'var(--fs-h1)',
              margin: '10px 0',
              opacity: interpolate(frame, [20 + i * 10, 34 + i * 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// [画面组件] EndingScene —— 片尾致谢（token: --bg-cover/--fs-display）
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';

export const EndingScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({meta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: theme.motion.entranceSpring});
  return (
    <AbsoluteFill style={{background: 'var(--bg-cover)', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-body)'}}>
      <div style={{textAlign: 'center', transform: `scale(${scale})`}}>
        <div style={{width: 120, height: 6, background: 'var(--c-accent)', margin: '0 auto 44px'}} />
        <div style={{color: 'var(--c-on-primary)', fontSize: 'var(--fs-display)', fontWeight: 800, letterSpacing: 18}}>谢谢观看</div>
        <div style={{width: 120, height: 6, background: 'var(--c-accent)', margin: '44px auto'}} />
        {meta.unit ? (
          <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 6, margin: '14px 0'}}>{meta.unit}</div>
        ) : null}
        {meta.author ? <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-h1)', margin: '8px 0'}}>{meta.author}</div> : null}
        {meta.compliance ? (
          <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-caption)', opacity: 0.75, marginTop: 10}}>{meta.compliance}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

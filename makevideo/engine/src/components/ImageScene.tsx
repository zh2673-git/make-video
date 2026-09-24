// [画面组件] ImageScene —— 配图+注解（素材位于 engine/public/media/，staticFile 引用）
import React from 'react';
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

export const ImageScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({scene, meta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 8, fps, config: theme.motion.entranceSpring});
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 22}}>
        <div
          style={{
            transform: `scale(${pop})`, borderRadius: 'var(--radius)', overflow: 'hidden',
            boxShadow: '0 12px 34px rgba(0,0,0,0.18)', border: '3px solid var(--c-accent)',
            maxHeight: '100%',
          }}
        >
          <Img src={staticFile(`media/${scene.image}`)} style={{maxWidth: 1500, maxHeight: 560, display: 'block'}} />
        </div>
        {scene.imageNote ? (
          <div style={{fontSize: 'var(--fs-h2)', color: 'var(--c-ink)', background: 'var(--c-surface-card)', borderRadius: 'var(--radius)', padding: '12px 30px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)'}}>
            {scene.imageNote}
          </div>
        ) : null}
      </div>
    </Shell>
  );
};

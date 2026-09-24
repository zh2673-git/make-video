// [画面组件] CompareScene —— 左右对比（leftTitle/rightTitle；条目 "左|右" 或 pairs 表行）
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

const splitPair = (s: string): [string, string] => {
  const idx = s.indexOf('|');
  if (idx < 0) return [s.trim(), ''];
  return [s.slice(0, idx).trim(), s.slice(idx + 1).trim()];
};

export const CompareScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({scene, meta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pairs: [string, string][] = scene.pairs
    ? (scene.pairs as string[][]).map((r) => [r[0] ?? '', r[1] ?? ''])
    : (scene.bullets ?? []).map(splitPair);
  const pop = spring({frame: frame - 10, fps, config: theme.motion.entranceSpring});
  const col = (title: string | undefined, side: 0 | 1, accent: string) => (
    <div
      style={{
        flex: 1, background: 'var(--c-surface-card)', borderRadius: 'var(--radius)',
        border: `3px solid ${accent}`, padding: '30px 34px',
        transform: `translateX(${side === 0 ? (1 - pop) * -60 : (1 - pop) * 60}px)`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      }}
    >
      <div style={{fontSize: 'var(--fs-h1)', fontWeight: 800, color: accent, textAlign: 'center', marginBottom: 24}}>
        {title}
      </div>
      {pairs.map(([l, r], i) => (
        <div
          key={i}
          style={{
            fontSize: 'var(--fs-h2)', color: 'var(--c-ink)', padding: '14px 0',
            borderTop: i ? '1px dashed var(--c-surface-alt)' : 'none',
            opacity: spring({frame: frame - 22 - i * theme.motion.stagger, fps, config: theme.motion.entranceSpring}),
          }}
        >
          {side === 0 ? l : r}
        </div>
      ))}
    </div>
  );
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', gap: 34, alignItems: 'stretch', height: '100%', padding: '20px 0'}}>
        {col(scene.leftTitle, 0, 'var(--c-info)')}
        <div
          style={{
            alignSelf: 'center', minWidth: 96, height: 96, borderRadius: 48,
            background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
            color: 'var(--c-on-primary)', fontSize: 'var(--fs-h2)', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid var(--c-accent)', transform: `scale(${pop})`,
          }}
        >
          VS
        </div>
        {col(scene.rightTitle, 1, 'var(--c-success)')}
      </div>
    </Shell>
  );
};

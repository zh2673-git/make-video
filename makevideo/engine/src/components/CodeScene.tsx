// [画面组件] CodeScene —— 代码演示（终端卡片；token: --c-terminal-bg/--c-terminal-fg/--font-mono）
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

export const CodeScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({scene, meta}) => {
  const frame = useCurrentFrame();
  const lines = scene.bullets ?? [];
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 14}}>
        <div
          style={{
            background: theme.semantic.terminalBg, color: theme.semantic.terminalFg,
            borderRadius: 'var(--radius)', padding: '28px 36px',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-h2)', lineHeight: 1.7,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}
        >
          {scene.lang ? (
            <div style={{fontSize: 'var(--fs-caption)', color: 'color-mix(in srgb, currentColor 55%, transparent)', marginBottom: 14}}>
              {scene.lang}
            </div>
          ) : null}
          {lines.map((ln, i) => (
            <div
              key={i}
              style={{
                whiteSpace: 'pre-wrap',
                opacity: interpolate(frame, [8 + i * 5, 16 + i * 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              }}
            >
              <span style={{color: 'color-mix(in srgb, currentColor 45%, transparent)', marginRight: 22, userSelect: 'none'}}>{String(i + 1).padStart(2, '0')}</span>
              {ln}
            </div>
          ))}
        </div>
        {scene.note ? <div style={{fontSize: 'var(--fs-caption)', color: 'var(--c-ink-muted)', textAlign: 'center'}}>{scene.note}</div> : null}
      </div>
    </Shell>
  );
};

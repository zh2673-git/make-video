// [画面组件] BulletsScene —— 要点卡片（逐项 spring stagger；token: --c-surface-card/--c-primary）
// 动效变体：slide=左入（默认）/ rise=下起上浮 / fade=纯淡入
// 图标：scene.icons[i] 有对应图标 → 图标圆片替代序号圆；缺项/未知名回退序号。
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {hasIcon, Icon} from '../icons';
import {theme} from '../theme';
import {Shell} from './Shell';

export const BulletsScene: React.FC<{scene: Scene; meta: ProjectMeta; variant?: string}> = ({scene, meta, variant = 'slide'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 34}}>
        {(scene.bullets ?? []).map((b, i) => {
          const drop = spring({frame: frame - 12 - i * theme.motion.stagger, fps, config: theme.motion.entranceSpring});
          const shift = variant === 'rise'
            ? `translateY(${(1 - drop) * 60}px)`
            : variant === 'fade' ? 'none' : `translateX(${(1 - drop) * 60}px)`;
          const iconName = scene.icons?.[i];
          const withIcon = hasIcon(iconName);
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 28, opacity: drop,
                transform: shift,
                background: 'var(--c-surface-card)', borderRadius: 'var(--radius)',
                padding: '24px 36px', borderLeft: '8px solid var(--c-primary)',
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              }}
            >
              <div
                style={{
                  minWidth: 54, height: 54, borderRadius: 27,
                  background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                  color: 'var(--c-on-primary)', fontSize: 'var(--fs-h2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, border: '2px solid var(--c-accent)',
                }}
              >
                {withIcon ? <Icon name={iconName!} size={30} /> : i + 1}
              </div>
              <div style={{fontSize: 'var(--fs-h1)', color: 'var(--c-ink)', fontWeight: 600}}>{b}</div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};

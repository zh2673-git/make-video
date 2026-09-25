// [画面组件] StatScene —— 数字版式：横排卡片 + 大数字计数动画（token: --c-primary/--c-surface-card）
// 动效变体：count=数字滚动（默认）/ rise=整体上浮（数字静态）
// 数据形态：stats = [[值, 标签, 图标?], ...]；值中数字部分自动提取滚动，前后缀（单位）静态。
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {hasIcon, Icon} from '../icons';
import {theme} from '../theme';
import {Shell} from './Shell';

const COUNT_FRAMES = 55; // 数字滚动时长（帧）

/** 值 → [前缀, 数字, 小数位, 后缀]；无数字返回 null（整体静态展示）。 */
function splitValue(value: string): [string, number, number, string] | null {
  const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return null;
  const raw = m[2].replace(/,/g, '');
  const num = parseFloat(raw);
  if (!isFinite(num)) return null;
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return [m[1], num, decimals, m[3]];
}

export const StatScene: React.FC<{scene: Scene; meta: ProjectMeta; variant?: string}> = ({scene, meta, variant = 'count'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stats = scene.stats ?? [];
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, paddingBottom: 40}}>
        {stats.map((row, i) => {
          const [value, label, icon] = row;
          const drop = spring({frame: frame - 10 - i * theme.motion.stagger, fps, config: theme.motion.entranceSpring});
          const shift = variant === 'rise' ? `translateY(${(1 - drop) * 60}px)` : 'none';
          const sv = variant === 'count' ? splitValue(value) : null;
          const progress = sv
            ? interpolate(frame - 14 - i * theme.motion.stagger, [0, COUNT_FRAMES], [0, 1],
                {easing: Easing.out(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
            : 0;
          const shown = sv
            ? `${sv[0]}${(sv[1] * progress).toLocaleString('en-US', {minimumFractionDigits: sv[2], maximumFractionDigits: sv[2]})}${sv[3]}`
            : value;
          return (
            <div
              key={i}
              style={{
                flex: 1, maxWidth: 480, opacity: drop, transform: shift,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
                background: 'var(--c-surface-card)', borderRadius: 'var(--radius)',
                padding: '48px 28px', borderTop: '6px solid var(--c-primary)',
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              }}
            >
              {hasIcon(icon) && (
                <div
                  style={{
                    width: 84, height: 84, borderRadius: 42,
                    background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                    color: 'var(--c-on-primary)', border: '2px solid var(--c-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon name={icon!} size={44} />
                </div>
              )}
              <div style={{fontSize: 'var(--fs-display)', fontWeight: 800, color: 'var(--c-primary)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1}}>
                {shown}
              </div>
              <div style={{fontSize: 'var(--fs-h2)', color: 'var(--c-ink-muted)', fontWeight: 500}}>{label}</div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};

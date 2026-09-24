// [画面组件] TableScene —— 表格（table 普通 / panorama 全景双密度）
// 业务语义色由 scene.cellColors 数据携带；公式列走 mono 字体。
// 动效变体：cascade=逐行显影（默认）/ fade=整表淡入
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

export const TableScene: React.FC<{scene: Scene; meta: ProjectMeta; variant?: string}> = ({scene, meta, variant = 'cascade'}) => {
  const frame = useCurrentFrame();
  const dense = scene.type === 'panorama';
  const whole = variant === 'fade'
    ? interpolate(frame, [10, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const isFormula = (v: string) => v.trim().startsWith('=');
  // 业务语义色由数据携带（cellColors: 值→色），背景用 color-mix 淡化
  const cellColor = (v: string): {color?: string; bg?: string} => {
    const map = scene.cellColors ?? {};
    if (v in map) return {color: map[v], bg: `color-mix(in srgb, ${map[v]} 18%, transparent)`};
    return {};
  };
  const hitColor = theme.semantic.highlightRow;
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', gap: dense ? 14 : 26, opacity: whole}}>
        <table
          style={{
            borderCollapse: 'collapse', width: '100%', background: 'var(--c-surface-card)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)', border: '2px solid var(--c-primary)',
          }}
        >
          <thead>
            <tr>
              {(scene.header ?? []).map((h, i) => (
                <th
                  key={i}
                  style={{
                    background: 'linear-gradient(180deg, var(--c-primary), var(--c-primary-dark))',
                    color: 'var(--c-on-primary)',
                    fontSize: dense ? 'var(--fs-micro)' : 'var(--fs-h2)',
                    padding: dense ? '12px 16px' : '20px 26px',
                    border: '1px solid var(--c-surface-alt)', fontWeight: 700,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(scene.rows ?? []).map((row, r) => {
              const joined = row.join('|');
              const hit = scene.highlight ? joined.includes(scene.highlight) : false;
              const opacity = variant === 'fade' ? 1 : interpolate(
                frame,
                [18 + r * theme.motion.tableRowDelay, 26 + r * theme.motion.tableRowDelay],
                [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
              );
              return (
                <tr key={r} style={{background: hit ? hitColor : r % 2 ? 'var(--c-surface-alt)' : 'var(--c-surface-card)', opacity}}>
                  {row.map((cell, c) => {
                    const cc = cellColor(cell);
                    return (
                      <td
                        key={c}
                        style={{
                          fontSize: isFormula(cell)
                            ? (dense ? 'var(--fs-micro)' : 'var(--fs-h2)')
                            : (dense ? 'var(--fs-micro)' : 'var(--fs-h2)'),
                          padding: dense ? '9px 16px' : '18px 26px',
                          border: '1px solid var(--c-surface-alt)',
                          color: cc.color ?? 'var(--c-ink)',
                          background: cc.bg,
                          fontFamily: isFormula(cell) ? 'var(--font-mono)' : 'var(--font-body)',
                          fontWeight: cc.color ? 800 : hit && c <= 2 ? 800 : 500,
                          textAlign: isFormula(cell) ? 'left' : 'center',
                        }}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {scene.note ? (
          <div style={{fontSize: 'var(--fs-caption)', color: 'var(--c-ink-muted)', textAlign: 'center'}}>{scene.note}</div>
        ) : null}
      </div>
    </Shell>
  );
};

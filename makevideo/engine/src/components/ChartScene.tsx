// [画面组件] ChartScene —— 柱状数据图（rows=[类别, 数值...]，多系列；纯 div 渲染 + 生长动画）
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';
import {Shell} from './Shell';

const SERIES_VARS = ['--c-primary', '--c-accent', '--c-success', '--c-info', '--c-warning'];

export const ChartScene: React.FC<{scene: Scene; meta: ProjectMeta}> = ({scene, meta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const header = scene.header ?? [];
  const seriesNames = header.slice(1);
  const rows = scene.rows ?? [];
  const maxVal = Math.max(...rows.flatMap((r) => r.slice(1).map((v) => parseFloat(v) || 0)), 1);
  const areaH = 420;
  return (
    <Shell scene={scene} meta={meta}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', gap: 20}}>
        <div style={{display: 'flex', gap: 30, justifyContent: 'center'}}>
          {seriesNames.map((n, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--fs-caption)', color: 'var(--c-ink)'}}>
              <div style={{width: 22, height: 22, borderRadius: 5, background: `var(${SERIES_VARS[i % SERIES_VARS.length]})`}} />
              {n}
            </div>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: areaH, borderBottom: '3px solid var(--c-surface-alt)', padding: '0 20px'}}>
          {rows.map((row, r) => {
            const values = row.slice(1).map((v) => parseFloat(v) || 0);
            return (
              <div key={r} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1}}>
                <div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: areaH - 60}}>
                  {values.map((v, vi) => {
                    const grow = spring({frame: frame - 15 - r * theme.motion.tableRowDelay - vi * 6, fps, config: theme.motion.entranceSpring});
                    return (
                      <div key={vi} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                        <div style={{fontSize: 'var(--fs-micro)', color: 'var(--c-ink-muted)'}}>{v}</div>
                        <div
                          style={{
                            width: 56, height: `${(v / maxVal) * (areaH - 100) * grow}px`,
                            background: `var(${SERIES_VARS[vi % SERIES_VARS.length]})`,
                            borderRadius: '8px 8px 0 0',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div style={{fontSize: 'var(--fs-caption)', color: 'var(--c-ink)', fontWeight: 600}}>{row[0]}</div>
              </div>
            );
          })}
        </div>
        {scene.note ? <div style={{fontSize: 'var(--fs-caption)', color: 'var(--c-ink-muted)', textAlign: 'center'}}>{scene.note}</div> : null}
      </div>
    </Shell>
  );
};

// 创意场景 insight —— 人·钱·通讯三线索连成三角互相印证，中心锁定"重点对手"；右侧数字带 + 职务信息条
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon, useCountUp} from '../primitives';

const NODES = [
  {icon: 'users', label: '人', x: 560, y: 380},
  {icon: 'database', label: '钱', x: 340, y: 690},
  {icon: 'message', label: '通讯', x: 780, y: 690},
];

export default function InsightScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const targetPop = spring({frame: frame - 36, fps, config: {damping: 13, stiffness: 100}});
  const lineGrow = (i: number) => spring({frame: frame - 20 - i * 6, fps,
    config: {damping: 200, stiffness: 70}, durationInFrames: 14});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          人 · 钱 · 通讯，互相印证
        </div>
      </div>
      {/* 左：三角印证 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 920, height: '100%'}}>
        {NODES.map((n, i) => {
          const m = NODES[(i + 1) % NODES.length];
          const mx = (n.x + m.x) / 2, my = (n.y + m.y) / 2;
          const len = Math.hypot(m.x - n.x, m.y - n.y);
          const ang = Math.atan2(m.y - n.y, m.x - n.x) * 180 / Math.PI;
          const g = lineGrow(i);
          return (
            <div key={`l${i}`} style={{position: 'absolute', left: mx - len / 2, top: my - 2,
              width: len, height: 4, borderRadius: 2, transform: `rotate(${ang}deg)`,
              transformOrigin: 'center', background: 'var(--c-surface-alt)', overflow: 'hidden'}}>
              <div style={{width: `${Math.min(g, 1) * 100}%`, height: '100%',
                background: 'linear-gradient(90deg, var(--c-primary), var(--c-accent))'}} />
            </div>
          );
        })}
        {NODES.map((n, i) => {
          const s = spring({frame: frame - 8 - i * 8, fps, config: {damping: 15, stiffness: 100}});
          return (
            <div key={n.label} style={{position: 'absolute', left: n.x - 78, top: n.y - 78,
              width: 156, height: 156, borderRadius: 78, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'var(--c-surface-card)', border: '2px solid var(--c-accent)',
              boxShadow: '0 12px 32px rgba(90,18,26,0.14)', opacity: s,
              transform: `scale(${0.7 + s * 0.3})`}}>
              <Icon name={n.icon} size={40} />
              <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 800, marginTop: 6}}>
                {n.label}
              </div>
            </div>
          );
        })}
        {/* 中心锁定徽章（三角重心处） */}
        <div style={{position: 'absolute', left: 560 - 62, top: 587 - 62, width: 124, height: 124,
          borderRadius: 62, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
          border: '2px solid var(--c-accent)', opacity: targetPop,
          transform: `scale(${0.6 + targetPop * 0.4})`,
          boxShadow: `0 0 ${30 + 10 * Math.sin(frame / 14)}px var(--c-accent-soft)`}}>
          <Icon name="target" size={36} />
          <div style={{color: 'var(--c-on-primary)', fontSize: 'var(--fs-micro)', fontWeight: 700, marginTop: 4}}>
            重点对手
          </div>
        </div>
      </div>
      {/* 右：数字带 + 职务条 */}
      <div style={{position: 'absolute', right: 'var(--shell-x)', top: 300, width: 800}}>
        <div style={{display: 'flex', gap: 24}}>
          <div style={{flex: 1, padding: '26px 30px', borderRadius: 'var(--radius)',
            background: 'var(--c-surface-card)', borderTop: '5px solid var(--c-accent)',
            border: '1px solid var(--c-primary-light)', opacity: spring({frame: frame - 24, fps,
              config: {damping: 16, stiffness: 100}})}}>
            <div style={{fontFamily: 'var(--font-mono)', fontSize: 'calc(var(--fs-display) * 0.56)',
              fontWeight: 800, color: 'var(--c-primary)'}}>
              {useCountUp(25, 30)}<span style={{fontSize: 'var(--fs-h1)'}}>+</span>
            </div>
            <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)', marginTop: 6}}>
              小时 · 通话累计
            </div>
          </div>
          <div style={{flex: 1, padding: '26px 30px', borderRadius: 'var(--radius)',
            background: 'var(--c-surface-card)', borderTop: '5px solid var(--c-accent)',
            border: '1px solid var(--c-primary-light)', opacity: spring({frame: frame - 32, fps,
              config: {damping: 16, stiffness: 100}})}}>
            <div style={{fontFamily: 'var(--font-mono)', fontSize: 'calc(var(--fs-display) * 0.56)',
              fontWeight: 800, color: 'var(--c-primary)'}}>
              {useCountUp(93, 38)}
            </div>
            <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)', marginTop: 6}}>
              次 · 主叫呼叫
            </div>
          </div>
        </div>
        <div style={{marginTop: 24, padding: '20px 28px', borderRadius: 'var(--radius)',
          background: 'var(--c-surface-alt)', border: '1px solid var(--c-accent-soft)',
          display: 'flex', alignItems: 'center', gap: 16,
          opacity: interpolate(frame, [48, 64], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <Icon name="calendar" size={30} />
          <span style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 700}}>
            集中在节假日前后
          </span>
        </div>
      </div>
      {/* 底部职务信息条（y≈786-864，避开最高 y≈872 的折行字幕条） */}
      <div style={{position: 'absolute', left: 'var(--shell-x)', right: 'var(--shell-x)',
        bottom: 210, padding: '20px 30px', borderRadius: 'var(--radius)',
        background: 'var(--c-surface-card)', border: '1px solid var(--c-primary-light)',
        borderLeft: '6px solid var(--c-accent)', display: 'flex', alignItems: 'center', gap: 18,
        opacity: interpolate(frame, [66, 84], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <Icon name="file-text" size={32} />
        <span style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)'}}>
          许某 · <b>宏某建设工程有限公司总经理</b> —— 单位职务随话单一并带出
        </span>
      </div>
    </AbsoluteFill>
  );
}

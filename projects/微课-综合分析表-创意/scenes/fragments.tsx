// 创意场景 fragments —— 四类数据四散漂浮（碎片感），虚线向中心"合"字汇聚：分散是碎片，拼起来才是全景
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const CARDS = [
  {icon: 'database', label: '银行流水', tell: '谁和谁有资金往来', x: 250, y: 310, rotate: -4},
  {icon: 'message', label: '通话记录', tell: '谁和谁联系密切', x: 1360, y: 295, rotate: 3},
  {icon: 'send', label: '微信账单', tell: '日常收与支', x: 220, y: 665, rotate: 2.5},
  {icon: 'pie', label: '支付宝账单', tell: '日常收与支', x: 1390, y: 650, rotate: -3},
];
const CX = 960, CY = 470; // 中心"合"字圆心

export default function FragmentsScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const corePop = spring({frame: frame - 26, fps, config: {damping: 13, stiffness: 90}});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          分散着看，都只是碎片
        </div>
      </div>
      {/* 中心"合"：金色圆环 + 呼吸微光 */}
      <div style={{position: 'absolute', left: CX - 105, top: CY - 105, width: 210, height: 210,
        borderRadius: 105, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
        border: '3px solid var(--c-accent)',
        boxShadow: `0 0 ${46 + 14 * Math.sin(frame / 16)}px var(--c-accent-soft)`,
        opacity: corePop, transform: `scale(${0.6 + corePop * 0.4})`}}>
        <div style={{color: 'var(--c-on-primary)', fontSize: 104, fontWeight: 900}}>合</div>
      </div>
      {/* 四张碎片卡 + 汇聚虚线 */}
      {CARDS.map((c, i) => {
        const s = spring({frame: frame - 8 - i * 7, fps, config: {damping: 16, stiffness: 100}});
        const float = Math.sin(frame / 19 + i * 1.7) * 7;
        const mx = (c.x + 150 + CX) / 2, my = (c.y + 80 + CY) / 2;
        const ang = Math.atan2(CY - (c.y + 80), CX - (c.x + 150)) * 180 / Math.PI;
        const len = Math.hypot(CX - (c.x + 150), CY - (c.y + 80));
        const link = spring({frame: frame - 26 - i * 6, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 14});
        return (
          <React.Fragment key={c.label}>
            <div style={{position: 'absolute', left: mx - len / 2, top: my - 2, width: len, height: 3,
              transform: `rotate(${ang}deg)`, transformOrigin: 'center', borderRadius: 2,
              background: 'var(--c-surface-alt)', opacity: 0.9, overflow: 'hidden'}}>
              <div style={{width: `${Math.min(link, 1) * 100}%`, height: '100%',
                backgroundImage: 'repeating-linear-gradient(90deg, var(--c-accent) 0 14px, transparent 14px 24px)'}} />
            </div>
            <div style={{position: 'absolute', left: c.x, top: c.y + float, width: 300,
              padding: '26px 28px', borderRadius: 'var(--radius)', background: 'var(--c-surface-card)',
              border: '1px solid var(--c-primary-light)', borderTop: '5px solid var(--c-accent)',
              boxShadow: '0 14px 34px rgba(90,18,26,0.14)', opacity: s,
              transform: `rotate(${c.rotate}deg) scale(${0.8 + s * 0.2})`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{width: 56, height: 56, borderRadius: 28, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                  color: 'var(--c-on-primary)'}}>
                  <Icon name={c.icon} size={28} />
                </div>
                <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 700}}>{c.label}</div>
              </div>
              <div style={{marginTop: 12, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>{c.tell}</div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)',
        opacity: interpolate(frame, [40, 56], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        同一个对手，在不同平台留下不同的痕迹
      </div>
    </AbsoluteFill>
  );
}

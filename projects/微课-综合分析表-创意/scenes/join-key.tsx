// 创意场景 join-key —— 四张表卡片向底部"共同主键"徽章汇聚：口径统一了，才能拼接
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const CARDS = [
  {icon: 'database', label: '银行频率表', tag: '看金额与笔数'},
  {icon: 'send', label: '微信频率表', tag: '看金额与笔数'},
  {icon: 'pie', label: '支付宝频率表', tag: '看金额与笔数'},
  {icon: 'mic', label: '话单频率表', tag: '看次数与时长'},
];

export default function JoinKeyScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const busGrow = spring({frame: frame - 26, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 16});
  const dropGrow = spring({frame: frame - 40, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 12});
  const badgePop = spring({frame: frame - 48, fps, config: {damping: 13, stiffness: 90}});
  const cardW = 356, gap = 40;
  const rowW = CARDS.length * cardW + (CARDS.length - 1) * gap;
  const rowLeft = (1920 - rowW) / 2;
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          口径不同，但主键相同
        </div>
      </div>
      {/* 四张表卡片 */}
      <div style={{position: 'absolute', top: 300, left: 0, width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap}}>
          {CARDS.map((c, i) => {
            const s = spring({frame: frame - 8 - i * 7, fps, config: {damping: 16, stiffness: 100}});
            return (
              <div key={c.label} style={{width: cardW, marginRight: i < CARDS.length - 1 ? gap : 0,
                padding: '28px 30px', borderRadius: 'var(--radius)', background: 'var(--c-surface-card)',
                border: '1px solid var(--c-primary-light)', borderTop: '5px solid var(--c-accent)',
                opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <div style={{width: 58, height: 58, borderRadius: 14, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                    color: 'var(--c-on-primary)'}}>
                    <Icon name={c.icon} size={28} />
                  </div>
                  <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 700}}>{c.label}</div>
                </div>
                <div style={{marginTop: 14, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>{c.tag}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 汇聚：下行短杆 → 横向母线 → 中央下行 → 主键徽章 */}
      <div style={{position: 'absolute', top: 470, left: 0, width: '100%'}}>
        {CARDS.map((_, i) => {
          const s = spring({frame: frame - 24 - i * 5, fps, config: {damping: 200, stiffness: 70}, durationInFrames: 10});
          const cx = rowLeft + i * (cardW + gap) + cardW / 2;
          return (
            <div key={i} style={{position: 'absolute', left: cx - 2, top: 0, width: 4, height: 34 * s,
              background: 'linear-gradient(180deg, var(--c-primary), var(--c-accent))'}} />
          );
        })}
        <div style={{position: 'absolute', left: rowLeft + cardW / 2, top: 34, width: rowW - cardW, height: 4,
          borderRadius: 2, background: 'var(--c-surface-alt)', overflow: 'hidden'}}>
          <div style={{width: `${Math.min(busGrow, 1) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--c-accent), var(--c-primary), var(--c-accent))'}} />
        </div>
        <div style={{position: 'absolute', left: 958, top: 38, width: 4, height: 46 * dropGrow,
          background: 'linear-gradient(180deg, var(--c-accent), var(--c-primary))'}} />
      </div>
      {/* 共同主键徽章 */}
      <div style={{position: 'absolute', top: 560, left: 0, width: '100%', display: 'flex',
        justifyContent: 'center', opacity: badgePop, transform: `scale(${0.7 + badgePop * 0.3})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '30px 56px',
          borderRadius: 'var(--radius)', background: 'var(--c-surface-card)',
          border: '2px solid var(--c-accent)', boxShadow: '0 18px 50px rgba(201,160,99,0.35)'}}>
          <div style={{width: 84, height: 84, borderRadius: 42, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
            color: 'var(--c-accent)'}}>
            <Icon name="key" size={40} />
          </div>
          <div>
            <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)', letterSpacing: 6}}>共同主键</div>
            <div style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-h1)', fontWeight: 700,
              color: 'var(--c-ink)', marginTop: 4}}>
              本方姓名 <span style={{color: 'var(--c-accent)'}}>&amp;</span> "│" <span style={{color: 'var(--c-accent)'}}>&amp;</span> 对方姓名
            </div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)',
        opacity: interpolate(frame, [60, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        口径统一了，才能拼接
      </div>
    </AbsoluteFill>
  );
}

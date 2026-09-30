// 创意场景 cross-type —— 左：通话∩资金韦恩图，交集"双平台交叉"；右：三行判定结果卡，张某→许某四表全中
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const RESULTS = [
  {a: '张某', b: '许某', call: 165, money: 325, type: '双平台交叉', all4: true},
  {a: '赵某', b: '马某', call: 163, money: 113, type: '双平台交叉', all4: false},
  {a: '赵某', b: '钱某', call: 14, money: 0, type: '仅话单', all4: false},
];
const PLATFORMS = ['银行', '微信', '支付宝', '话单'];
const C1X = 380, C2X = 640, CY = 470, R = 165;

export default function CrossTypeScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c1 = spring({frame: frame - 6, fps, config: {damping: 15, stiffness: 80}});
  const c2 = spring({frame: frame - 14, fps, config: {damping: 15, stiffness: 80}});
  const badgePop = spring({frame: frame - 34, fps, config: {damping: 13, stiffness: 110}});
  const chipColors: Record<string, {bg: string; fg: string}> = {
    '双平台交叉': {bg: 'var(--c-highlight-row)', fg: 'var(--c-ink)'},
    '仅话单': {bg: 'var(--c-info)', fg: 'var(--c-on-primary)'},
    '仅账单': {bg: 'var(--c-warning)', fg: 'var(--c-on-primary)'},
  };
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
      </div>
      {/* 左：韦恩图 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1020, height: '100%'}}>
        <div style={{position: 'absolute', left: C1X - R, top: CY - R, width: R * 2, height: R * 2,
          borderRadius: R, background: 'var(--c-info)', opacity: 0.2 * c1,
          border: '3px solid var(--c-info)', transform: `scale(${c1})`}} />
        <div style={{position: 'absolute', left: C2X - R, top: CY - R, width: R * 2, height: R * 2,
          borderRadius: R, background: 'var(--c-accent)', opacity: 0.22 * c2,
          border: '3px solid var(--c-accent)', transform: `scale(${c2})`}} />
        <div style={{position: 'absolute', left: C1X - 80, top: CY - 200, width: 160, textAlign: 'center',
          color: 'var(--c-info)', fontSize: 'var(--fs-h2)', fontWeight: 700, opacity: c1}}>
          通话
        </div>
        <div style={{position: 'absolute', left: C2X - 80, top: CY - 200, width: 160, textAlign: 'center',
          color: 'var(--c-accent)', fontSize: 'var(--fs-h2)', fontWeight: 700, opacity: c2}}>
          资金
        </div>
        {/* 交集徽章 */}
        <div style={{position: 'absolute', left: (C1X + C2X) / 2 - 150, top: CY - 44, width: 300,
          textAlign: 'center', opacity: badgePop, transform: `scale(${0.6 + badgePop * 0.4})`}}>
          <div style={{display: 'inline-block', padding: '14px 34px', borderRadius: 999,
            background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
            border: '2px solid var(--c-accent)', color: 'var(--c-on-primary)',
            fontSize: 'var(--fs-h2)', fontWeight: 800, boxShadow: '0 10px 30px rgba(90,18,26,0.35)'}}>
            双平台交叉
          </div>
        </div>
        {/* 两侧仅其一 */}
        <div style={{position: 'absolute', left: C1X - 210, top: CY + 210, display: 'flex', gap: 60}}>
          <span style={{padding: '6px 22px', borderRadius: 999, border: '2px solid var(--c-info)',
            color: 'var(--c-info)', fontSize: 'var(--fs-body)', fontWeight: 700,
            opacity: interpolate(frame, [44, 58], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            仅话单
          </span>
          <span style={{padding: '6px 22px', borderRadius: 999, border: '2px solid var(--c-warning)',
            color: 'var(--c-warning)', fontSize: 'var(--fs-body)', fontWeight: 700,
            opacity: interpolate(frame, [50, 64], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            仅账单
          </span>
        </div>
      </div>
      {/* 右：判定结果 */}
      <div style={{position: 'absolute', right: 'var(--shell-x)', top: 240, width: 780}}>
        <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)', letterSpacing: 4,
          marginBottom: 16}}>判定结果（节选）</div>
        {RESULTS.map((r, i) => {
          const s = spring({frame: frame - 20 - i * 12, fps, config: {damping: 16, stiffness: 100}});
          const cc = chipColors[r.type] ?? {bg: 'var(--c-surface-alt)', fg: 'var(--c-ink)'};
          return (
            <div key={i} style={{marginBottom: 20, padding: r.all4 ? '22px 28px' : '18px 28px',
              borderRadius: 'var(--radius)', background: r.type === '双平台交叉' ? 'var(--c-highlight-row)' : 'var(--c-surface-card)',
              border: '1px solid var(--c-surface-alt)', boxShadow: '0 8px 22px rgba(90,18,26,0.08)',
              opacity: s, transform: `translateX(${(1 - s) * 44}px)`}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{fontSize: 'var(--fs-h2)', fontWeight: 800, color: 'var(--c-ink)'}}>
                  {r.a} <span style={{color: 'var(--c-accent)'}}>→</span> {r.b}
                </div>
                <div style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body)', color: 'var(--c-ink-muted)'}}>
                  通话 {r.call} · 资金 {r.money}
                </div>
                <div style={{padding: '6px 20px', borderRadius: 999, background: cc.bg, color: cc.fg,
                  fontSize: 'var(--fs-body)', fontWeight: 700}}>
                  {r.type}
                </div>
              </div>
              {r.all4 ? (
                <div style={{display: 'flex', gap: 14, marginTop: 16}}>
                  {PLATFORMS.map((p, k) => {
                    const lit = interpolate(frame, [46 + k * 6, 54 + k * 6], [0.2, 1],
                      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
                    return (
                      <div key={p} style={{display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px', borderRadius: 999, background: 'var(--c-surface-card)',
                        border: '1px solid var(--c-accent)', opacity: lit}}>
                        <Icon name="check" size={20} />
                        <span style={{fontSize: 'var(--fs-micro)', color: 'var(--c-ink)', fontWeight: 700}}>{p}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>
        {scene.note ?? ''}
      </div>
    </AbsoluteFill>
  );
}

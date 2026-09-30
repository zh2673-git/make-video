// 创意场景 opening —— 片头（全幅）：政务红金基调，"四表合一"主标题弹入，四张数据卡汇聚成排
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

export const bare = true;

const CARDS = [
  {icon: 'database', label: '银行流水'},
  {icon: 'message', label: '通话记录'},
  {icon: 'send', label: '微信账单'},
  {icon: 'pie', label: '支付宝账单'},
];

export default function OpeningScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const subs = scene.subtitle ?? [];
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 80}});
  const lineGrow = interpolate(frame, [16, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'var(--bg-cover)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      {/* 金点阵：克制的空间感 */}
      <div style={{position: 'absolute', inset: 0, opacity: 0.10,
        backgroundImage: 'radial-gradient(var(--c-accent) 1.5px, transparent 1.5px)',
        backgroundSize: '56px 56px'}} />
      {/* 顶部机构名 */}
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center',
        opacity: spring({frame: frame - 6, fps, config: {damping: 200, stiffness: 120}, durationInFrames: 14})}}>
        <span style={{color: 'var(--c-accent)', fontSize: 'var(--fs-h2)', letterSpacing: 14}}>
          {subs[0] ?? ''}
        </span>
      </div>
      {/* 主标题 */}
      <div style={{textAlign: 'center', transform: `scale(${pop})`}}>
        <div style={{fontSize: 'calc(var(--fs-display) * 1.45)', fontWeight: 900, letterSpacing: 18,
          color: 'var(--c-on-primary)', lineHeight: 1.15}}>
          四表合一
        </div>
        <div style={{width: 420 * lineGrow, height: 5, margin: '30px auto',
          background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)'}} />
        <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-h1)', letterSpacing: 8}}>
          综合分析表的 Excel 拼接实战
        </div>
      </div>
      {/* 四张数据卡：相向汇聚 */}
      <div style={{position: 'absolute', bottom: 220, display: 'flex', gap: 34}}>
        {CARDS.map((c, i) => {
          const dir = i < 2 ? -1 : 1;
          const s = spring({frame: frame - 22 - i * 8, fps, config: {damping: 15, stiffness: 110}});
          return (
            <div key={c.label} style={{
              width: 268, padding: '26px 0 22px', textAlign: 'center', borderRadius: 'var(--radius)',
              background: 'rgba(255,255,255,0.07)', border: '1px solid var(--c-accent-soft)',
              opacity: s, transform: `translateX(${dir * (1 - s) * 120}px)`}}>
              <div style={{width: 62, height: 62, margin: '0 auto 12px', borderRadius: 31,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                border: '1px solid var(--c-accent)', color: 'var(--c-on-primary)'}}>
                <Icon name={c.icon} size={30} />
              </div>
              <div style={{color: 'var(--c-on-primary)', fontSize: 'var(--fs-h2)', fontWeight: 700}}>{c.label}</div>
            </div>
          );
        })}
      </div>
      {/* 底部信息行 */}
      <div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center',
        color: 'var(--c-accent-soft)', fontSize: 'var(--fs-body)', letterSpacing: 4,
        opacity: interpolate(frame, [44, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {[subs[1], subs[2]].filter(Boolean).join('　·　')}
      </div>
    </AbsoluteFill>
  );
}

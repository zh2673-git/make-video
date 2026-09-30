// 创意场景 three-steps —— 拼接三步大卡横排：造辅助键 / VLOOKUP / IFERROR，金色大序号压阵
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const STEPS = [
  {no: '01', icon: 'key', name: '造辅助键', chip: '本方&"│"&对方', note: '给每组往来一个唯一的门牌号'},
  {no: '02', icon: 'search', name: 'VLOOKUP', chip: '按键查四张表', note: '拿着门牌号，把数据查过来'},
  {no: '03', icon: 'shield-check', name: 'IFERROR', chip: '查不到 → 填 0', note: '统一填零，不让表格报错'},
];

export default function ThreeStepsScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardW = 500, gap = 60;
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          拼接的钥匙，只有三步
        </div>
      </div>
      <div style={{position: 'absolute', top: 300, left: 0, width: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          {STEPS.map((st, i) => {
            const s = spring({frame: frame - 8 - i * 12, fps, config: {damping: 15, stiffness: 100}});
            const chev = i > 0 ? spring({frame: frame - i * 12, fps,
              config: {damping: 200, stiffness: 90}, durationInFrames: 12}) : 1;
            return (
              <React.Fragment key={st.no}>
                {i > 0 ? (
                  <div style={{width: gap, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: chev * 0.9}}>
                    <span style={{color: 'var(--c-accent)', fontSize: 56, fontWeight: 800,
                      fontFamily: 'var(--font-mono)'}}>→</span>
                  </div>
                ) : null}
                <div style={{width: cardW, marginRight: i < STEPS.length - 1 ? 0 : 0,
                  padding: '34px 40px 30px', borderRadius: 'var(--radius)',
                  background: 'var(--c-surface-card)', border: '1px solid var(--c-primary-light)',
                  borderTop: '6px solid var(--c-accent)', boxShadow: '0 16px 40px rgba(90,18,26,0.12)',
                  opacity: s, transform: `translateY(${(1 - s) * 46}px)`}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontFamily: 'var(--font-mono)', fontSize: 'calc(var(--fs-display) * 0.62)',
                      fontWeight: 800, color: 'var(--c-accent)', lineHeight: 1}}>{st.no}</span>
                    <div style={{width: 64, height: 64, borderRadius: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                      color: 'var(--c-on-primary)'}}>
                      <Icon name={st.icon} size={30} />
                    </div>
                  </div>
                  <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h1)', fontWeight: 800, marginTop: 12}}>
                    {st.name}
                  </div>
                  <div style={{marginTop: 14, display: 'inline-block', padding: '8px 20px', borderRadius: 10,
                    background: 'var(--c-terminal-bg)', color: 'var(--c-terminal-fg)',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body)'}}>
                    {st.chip}
                  </div>
                  <div style={{marginTop: 16, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>{st.note}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-primary)', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: 10,
        opacity: interpolate(frame, [50, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        一键 · 两查 · 三兜底
      </div>
    </AbsoluteFill>
  );
}

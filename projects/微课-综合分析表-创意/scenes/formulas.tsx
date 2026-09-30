// 创意场景 formulas —— Excel 公式栏深色窗：三行公式逐行敲出（打字机），公式文本在此处硬编码（规避表格竖线分隔符歧义）
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';

type Tok = {t: string; c: string};
const FG = 'var(--c-terminal-fg)';
const GOLD = 'var(--c-accent)';
const SOFT = 'var(--c-accent-soft)';
const OK = 'var(--c-success)';

// 每行 = [左侧用途标签, 公式分色 token 流]
const LINES: Array<{tag: string; toks: Tok[]}> = [
  {tag: '辅助键', toks: [
    {t: '=C2', c: FG}, {t: '&', c: GOLD}, {t: '"', c: FG}, {t: '|', c: OK}, {t: '"', c: FG},
    {t: '&', c: GOLD}, {t: 'D2', c: FG},
  ]},
  {tag: '查通话次数', toks: [
    {t: '=', c: FG}, {t: 'IFERROR', c: GOLD}, {t: '(', c: FG}, {t: 'VLOOKUP', c: GOLD},
    {t: '($A2,', c: FG}, {t: '话单频率表', c: SOFT}, {t: '!$A:$N,', c: FG}, {t: '8', c: OK},
    {t: ',0),', c: FG}, {t: '0', c: OK}, {t: ')', c: FG},
  ]},
  {tag: '查银行收入', toks: [
    {t: '=', c: FG}, {t: 'IFERROR', c: GOLD}, {t: '(', c: FG}, {t: 'VLOOKUP', c: GOLD},
    {t: '($A2,', c: FG}, {t: '银行频率表', c: SOFT}, {t: '!$A:$H,', c: FG}, {t: '5', c: OK},
    {t: ',0),', c: FG}, {t: '0', c: OK}, {t: ')', c: FG},
  ]},
];

const CHAR_RATE = 1.4; // 每字符帧数
const ROW_START = 22;
const ROW_GAP = 24;

export default function FormulasScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  // 逐行排程：上一行敲完 + ROW_GAP 后下一行开始
  const starts: number[] = [];
  let acc = ROW_START;
  for (const l of LINES) {
    starts.push(acc);
    acc += Math.ceil(l.toks.reduce((n, tk) => n + tk.t.length, 0) * CHAR_RATE) + ROW_GAP;
  }
  const winIn = interpolate(frame, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cursorOn = 0.35 + 0.65 * Math.abs(Math.sin(frame / 8));
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
      </div>
      {/* 公式窗口 */}
      <div style={{width: 1500, borderRadius: 'calc(var(--radius) * 1.4)', overflow: 'hidden',
        background: 'var(--c-terminal-bg)', border: '1px solid var(--c-primary-dark)',
        boxShadow: '0 26px 70px rgba(90,18,26,0.4)', opacity: winIn,
        transform: `translateY(${(1 - winIn) * 40}px)`, marginTop: -20}}>
        <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px',
          background: 'var(--c-surface-card)'}}>
          {['var(--c-primary-light)', 'var(--c-accent)', 'var(--c-success)'].map((c) => (
            <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.9}} />
          ))}
          <div style={{marginLeft: 16, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)',
            fontFamily: 'var(--font-mono)'}}>
            综合分析表.xlsx
          </div>
          <div style={{marginLeft: 'auto', color: 'var(--c-primary)', fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-h2)', fontStyle: 'italic', fontWeight: 700}}>
            fx
          </div>
        </div>
        <div style={{padding: '36px 44px 44px', minHeight: 380}}>
          {LINES.map((l, i) => {
            const start = starts[i];
            const typed = Math.max(0, Math.floor((frame - start) / CHAR_RATE));
            const total = l.toks.reduce((n, tk) => n + tk.t.length, 0);
            const rowIn = interpolate(frame, [start - 8, start - 1], [0, 1],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            let remain = typed;
            const spans: React.ReactNode[] = [];
            for (let k = 0; k < l.toks.length; k++) {
              const tk = l.toks[k];
              if (remain <= 0) break;
              const cut = Math.min(tk.t.length, remain);
              spans.push(<span key={k} style={{color: tk.c}}>{tk.t.slice(0, cut)}</span>);
              remain -= cut;
            }
            const active = typed > 0 && typed < total;
            const done = typed >= total;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', minHeight: 92,
                opacity: rowIn, transform: `translateX(${(1 - rowIn) * 26}px)`}}>
                <div style={{width: 210, flexShrink: 0, color: 'var(--c-accent)', fontWeight: 700,
                  fontSize: 'var(--fs-h2)', fontFamily: 'var(--font-body)'}}>
                  {l.tag}
                </div>
                <div style={{flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-h2)',
                  color: FG, whiteSpace: 'nowrap'}}>
                  {spans}
                  {active ? <span style={{opacity: cursorOn, color: GOLD}}>▍</span> : null}
                  {done ? <span style={{color: OK, marginLeft: 18, fontSize: 'var(--fs-body)'}}>✓</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)',
        opacity: interpolate(frame, [70, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        {scene.note ?? ''}
      </div>
    </AbsoluteFill>
  );
}

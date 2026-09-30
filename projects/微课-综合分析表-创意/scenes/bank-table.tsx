// 创意场景 bank-table —— 银行频率表逐行点亮，张某→许某行绿色高亮，右侧"348万 / 133笔"数字面压阵
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon, useCountUp} from '../primitives';

export default function BankTableScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const header = scene.header ?? [];
  const rows = scene.rows ?? [];
  const isHit = (r: string[]) => r[0] === '张某' && r[1] === '许某';
  const hitIdx = rows.findIndex(isHit);
  const panelPop = spring({frame: frame - 34, fps, config: {damping: 14, stiffness: 90}});
  const colW = [118, 118, 218, 218, 128, 218]; // 共 1018
  const rowDelay = (i: number) => 10 + i * 7;
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          排在最前的：张某 <span style={{color: 'var(--c-accent)'}}>→</span> 许某
        </div>
      </div>
      {/* 左：频率表 */}
      <div style={{position: 'absolute', left: 'var(--shell-x)', top: 320, width: 1018}}>
        <div style={{display: 'flex', padding: '0 18px', height: 54, alignItems: 'center',
          background: 'linear-gradient(90deg, var(--c-primary-dark), var(--c-primary))',
          borderRadius: 'var(--radius) var(--radius) 0 0'}}>
          {header.map((h, i) => (
            <div key={i} style={{width: colW[i], color: 'var(--c-on-primary)',
              fontSize: 'var(--fs-caption)', fontWeight: 700, textAlign: i < 2 ? 'left' : 'right'}}>
              {h}
            </div>
          ))}
        </div>
        {rows.map((r, i) => {
          const hit = i === hitIdx;
          const p = spring({frame: frame - rowDelay(i), fps, config: {damping: 200, stiffness: 90}, durationInFrames: 14});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', height: 62, padding: '0 18px',
              background: hit ? 'var(--c-highlight-row)' : i % 2 === 0 ? 'var(--c-surface-card)' : 'var(--c-surface-alt)',
              boxShadow: hit ? 'inset 6px 0 0 var(--c-accent)' : 'none',
              borderBottom: '1px solid var(--c-surface-alt)', opacity: p,
              transform: `translateX(${(1 - p) * -24}px)`}}>
              {r.map((cell, j) => (
                <div key={j} style={{width: colW[j], fontFamily: j >= 2 ? 'var(--font-mono)' : 'var(--font-body)',
                  color: j >= 2 ? 'var(--c-ink)' : 'var(--c-ink)',
                  fontWeight: hit && j < 2 ? 800 : 500,
                  fontSize: j >= 2 ? 'var(--fs-body)' : 'var(--fs-body)',
                  textAlign: j < 2 ? 'left' : 'right'}}>
                  {cell}
                </div>
              ))}
            </div>
          );
        })}
        <div style={{marginTop: 14, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)'}}>
          {scene.note ?? ''}
        </div>
      </div>
      {/* 右：数字面 */}
      <div style={{position: 'absolute', right: 'var(--shell-x)', top: 320, width: 560, padding: '38px 42px',
        borderRadius: 'var(--radius)', background: 'var(--c-surface-card)',
        border: '1px solid var(--c-primary-light)', borderTop: '6px solid var(--c-accent)',
        boxShadow: '0 18px 44px rgba(90,18,26,0.14)', opacity: panelPop,
        transform: `translateY(${(1 - panelPop) * 40}px)`}}>
        <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)', letterSpacing: 4}}>交易总金额</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4}}>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: 'calc(var(--fs-display) * 0.86)',
            fontWeight: 800, color: 'var(--c-primary)'}}>
            {useCountUp(348, 44)}
          </span>
          <span style={{fontSize: 'var(--fs-h1)', color: 'var(--c-ink)', fontWeight: 700}}>万</span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 18}}>
          <span style={{fontFamily: 'var(--font-mono)', fontSize: 'calc(var(--fs-display) * 0.5)',
            fontWeight: 800, color: 'var(--c-accent)'}}>
            {useCountUp(133, 56)}
          </span>
          <span style={{fontSize: 'var(--fs-h2)', color: 'var(--c-ink-muted)'}}>笔往来</span>
        </div>
        <div style={{height: 1, background: 'var(--c-surface-alt)', margin: '26px 0'}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, color: 'var(--c-ink)',
            fontSize: 'var(--fs-h2)'}}>
            <Icon name="trending-up" size={26} /> 收入 150万
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, color: 'var(--c-ink)',
            fontSize: 'var(--fs-h2)'}}>
            <Icon name="chart" size={26} /> 支出 198万
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)', fontStyle: 'italic',
        opacity: interpolate(frame, [70, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        有资金往来 ≠ 关系清楚 —— 还要把另外三张表拼过来看
      </div>
    </AbsoluteFill>
  );
}

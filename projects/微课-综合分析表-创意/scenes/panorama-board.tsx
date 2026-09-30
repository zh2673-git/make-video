// 创意场景 panorama-board —— 综合分析表全景：315×22 数字徽章 + 14 行三色分类表逐行浮现
// 排版纪律：表格止于 y≈860（长字幕折行时字幕条顶部可达 y≈872，须留出安全间距）；标题区只留一行 kicker + 右侧徽章/图例
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {useCountUp} from '../primitives';

const COLW = ['12%', '16%', '12%', '11%', '11%', '11%', '27%'];
const TYPE_STYLE: Record<string, {rowBg: string; bar: string; chipBg: string; chipFg: string}> = {
  '双平台交叉': {rowBg: 'var(--c-highlight-row)', bar: 'var(--c-success)',
    chipBg: 'var(--c-success)', chipFg: 'var(--c-on-primary)'},
  '仅话单': {rowBg: 'var(--c-surface-card)', bar: 'var(--c-info)',
    chipBg: 'var(--c-info)', chipFg: 'var(--c-on-primary)'},
  '仅账单': {rowBg: 'var(--c-surface-card)', bar: 'var(--c-warning)',
    chipBg: 'var(--c-warning)', chipFg: 'var(--c-on-primary)'},
};
const LEGEND: Array<[string, string]> = [
  ['双平台交叉', 'var(--c-highlight-row)'],
  ['仅话单', 'var(--c-info)'],
  ['仅账单', 'var(--c-warning)'],
];

export default function PanoramaBoardScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const header = scene.header ?? [];
  const rows = scene.rows ?? [];
  const topIn = spring({frame, fps, config: {damping: 200, stiffness: 110}, durationInFrames: 12});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      {/* 标题行：kicker 居左；图例 + 数字徽章居右（同一行，给表格让出最大空间） */}
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)', right: 'var(--shell-x)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: topIn}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          {LEGEND.map(([label, color]) => (
            <div key={label} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{width: 18, height: 18, borderRadius: 5, background: color,
                border: '1px solid var(--c-ink-muted)'}} />
              <span style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-micro)'}}>{label}</span>
            </div>
          ))}
          <div style={{width: 1, height: 26, background: 'var(--c-surface-alt)'}} />
          <div style={{padding: '5px 18px', borderRadius: 999, background: 'var(--c-primary)', color: 'var(--c-on-primary)',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)', fontWeight: 700}}>
            {useCountUp(315, 26)} 组往来
          </div>
          <div style={{padding: '5px 18px', borderRadius: 999, background: 'var(--c-surface-card)',
            border: '1px solid var(--c-accent)', color: 'var(--c-ink)',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)', fontWeight: 700}}>
            {useCountUp(22, 34)} 列信息
          </div>
        </div>
      </div>
      {/* 全景表：header 48 + 14 行×43 = 650，自 y210 起止于 y860（字幕条安全线上方） */}
      <div style={{position: 'absolute', left: 'var(--shell-x)', right: 'var(--shell-x)', top: 210}}>
        <div style={{display: 'flex', alignItems: 'center', height: 48, padding: '0 20px',
          background: 'linear-gradient(90deg, var(--c-primary-dark), var(--c-primary))',
          borderRadius: 'var(--radius) var(--radius) 0 0'}}>
          {header.map((h, i) => (
            <div key={i} style={{width: COLW[i], color: 'var(--c-on-primary)', fontSize: 'var(--fs-caption)',
              fontWeight: 700, textAlign: i >= 2 && i <= 5 ? 'center' : i === 6 ? 'center' : 'left'}}>
              {h}
            </div>
          ))}
        </div>
        {rows.map((r, i) => {
          const typ = r[6] ?? '';
          const st = TYPE_STYLE[typ] ?? {rowBg: 'var(--c-surface-card)', bar: 'var(--c-surface-alt)',
            chipBg: 'var(--c-surface-alt)', chipFg: 'var(--c-ink)'};
          const p = spring({frame: frame - 12 - i * 4, fps,
            config: {damping: 200, stiffness: 90}, durationInFrames: 12});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', height: 43, padding: '0 20px',
              background: st.rowBg, boxShadow: `inset 5px 0 0 ${st.bar}`,
              borderBottom: '1px solid var(--c-surface-alt)', opacity: p,
              transform: `translateY(${(1 - p) * -10}px)`}}>
              {r.map((cell, j) => {
                if (j === 6) {
                  return (
                    <div key={j} style={{width: COLW[j], textAlign: 'center'}}>
                      <span style={{display: 'inline-block', padding: '2px 16px', borderRadius: 999,
                        background: st.chipBg, color: st.chipFg, fontSize: 'var(--fs-micro)', fontWeight: 700}}>
                        {cell}
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={j} style={{width: COLW[j],
                    fontFamily: j >= 2 ? 'var(--font-mono)' : 'var(--font-body)',
                    fontSize: 'var(--fs-caption)',
                    color: j >= 2 && cell === '0' ? 'var(--c-ink-muted)' : 'var(--c-ink)',
                    fontWeight: j === 1 ? 700 : 400,
                    textAlign: j >= 2 && j <= 5 ? 'center' : 'left'}}>
                    {cell}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

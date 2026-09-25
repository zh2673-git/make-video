// 创意场景 terminal —— 仿终端打字机：命令逐字敲出、日志逐行点亮、光标呼吸（讲"一键出片"）
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';

const CMD = 'python -m makevideo build demo';
const LOGS = [
  {tag: 'PARSE', text: '讲稿解析 · 6 分镜', tone: 'var(--c-info)'},
  {tag: 'TTS', text: '逐句配音 · 词级对齐', tone: 'var(--c-info)'},
  {tag: 'RENDER', text: 'Remotion 逐帧渲染 1080P', tone: 'var(--c-warning)'},
  {tag: 'OK', text: '成片 out/demo.mp4', tone: 'var(--c-success)'},
];

export default function TerminalScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const typed = CMD.slice(0, Math.max(0, Math.floor((frame - 14) / 2)));
  const cursorOn = 0.35 + 0.65 * Math.abs(Math.sin(frame / 9));
  const winIn = interpolate(frame, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
      </div>
      {/* 终端窗口 */}
      <div style={{width: 1240, borderRadius: 'calc(var(--radius) * 1.6)', overflow: 'hidden',
        background: 'var(--c-terminal-bg)', boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
        border: '1px solid var(--c-primary-dark)', opacity: winIn,
        transform: `translateY(${(1 - winIn) * 40}px)`}}>
        <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px',
          background: 'var(--c-surface-card)'}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.9}} />
          ))}
          <div style={{marginLeft: 14, color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)', fontFamily: 'var(--font-mono)'}}>
            makevideo — zsh
          </div>
        </div>
        <div style={{padding: '34px 40px 44px', fontFamily: 'var(--font-mono)', minHeight: 330}}>
          <div style={{fontSize: 'var(--fs-h2)', color: 'var(--c-terminal-fg)'}}>
            <span style={{color: 'var(--c-success)'}}>➜</span>
            <span style={{color: 'var(--c-accent)', marginLeft: 14}}>~/demo</span>
            <span style={{marginLeft: 18}}>{typed}</span>
            <span style={{opacity: cursorOn, color: 'var(--c-accent)'}}>▍</span>
          </div>
          {LOGS.map((l, i) => {
            const from = 14 + CMD.length * 2 + 16 + i * 11;
            const show = interpolate(frame, [from, from + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={l.tag} style={{marginTop: 18, fontSize: 'var(--fs-h2)', opacity: show,
                transform: `translateX(${(1 - show) * 24}px)`}}>
                <span style={{color: l.tone, fontWeight: 700}}>[{l.tag}]</span>
                <span style={{color: 'var(--c-terminal-fg)', opacity: 0.92, marginLeft: 16}}>{l.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 'var(--content-bottom)', left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>
        改哪个分镜，重渲哪个分镜 —— 增量出片
      </div>
    </AbsoluteFill>
  );
}

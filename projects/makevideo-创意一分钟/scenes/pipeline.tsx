// 创意场景 pipeline —— 四节点管线：节点错峰弹入，连线逐段生长（讲"工作流"就要让流动可见）
import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon} from '../primitives';

const NODES = [
  {icon: 'file-text', label: '讲稿', note: '唯一源头'},
  {icon: 'mic', label: '配音', note: '词级时间戳'},
  {icon: 'cpu', label: '对齐', note: '帧数锚定'},
  {icon: 'play', label: '成片', note: '逐帧渲染'},
];

export default function PipelineScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)',
      justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          一条讲稿的旅程
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 0, marginTop: 40}}>
        {NODES.map((n, i) => {
          const pop = spring({frame: frame - 10 - i * 9, fps, config: {damping: 15, stiffness: 100}});
          const link = spring({frame: frame - 18 - i * 9, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 12});
          return (
            <React.Fragment key={n.label}>
              {i > 0 ? (
                <div style={{width: 96, height: 4, marginRight: -6, overflow: 'hidden', borderRadius: 2,
                  background: 'var(--c-surface-alt)'}}>
                  <div style={{width: `${Math.min(link, 1) * 100}%`, height: '100%',
                    transformOrigin: 'left',
                    background: 'linear-gradient(90deg, var(--c-primary), var(--c-accent))'}} />
                </div>
              ) : null}
              <div style={{
                width: 250, padding: '34px 0 26px', textAlign: 'center', borderRadius: 'var(--radius)',
                background: 'var(--c-surface-card)', border: '1px solid var(--c-primary-light)',
                borderTop: '5px solid var(--c-accent)',
                opacity: pop, transform: `scale(${0.7 + pop * 0.3})`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              }}>
                <div style={{width: 74, height: 74, margin: '0 auto 16px', borderRadius: 37,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                  color: 'var(--c-on-primary)'}}>
                  <Icon name={n.icon} size={36} />
                </div>
                <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 700}}>{n.label}</div>
                <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)', marginTop: 8}}>{n.note}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 'var(--content-bottom)', left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)'}}>
        单向推进 · 失败即停 · 一键重跑
      </div>
    </AbsoluteFill>
  );
}

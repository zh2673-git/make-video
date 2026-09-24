// [画面组件] Shell —— 内容版式通用壳：页眉（标题+金线+单位徽章）+ 内容区 + 页脚
// 全部视觉走主题 token，零硬编码色彩字体。
import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {theme} from '../theme';

export const Shell: React.FC<{
  scene: Scene;
  meta: ProjectMeta;
  children: React.ReactNode;
}> = ({scene, meta, children}) => {
  const unit = meta.unit ?? '';
  const label = meta.footer ?? theme.brand.serialLabel;
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div
        style={{
          background: 'var(--bg-header)',
          padding: '30px var(--shell-x)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{color: 'var(--c-on-primary)', fontSize: 'var(--fs-header)', fontWeight: 700}}>
            {scene.title}
          </div>
          <div style={{width: 88, height: 5, background: 'var(--c-accent)', marginTop: 12}} />
        </div>
        {unit ? (
          <div
            style={{
              color: 'var(--c-accent-soft)', fontSize: 'var(--fs-micro)',
              border: '2px solid var(--c-accent)', borderRadius: 10,
              padding: '8px 22px', letterSpacing: 3, whiteSpace: 'nowrap',
            }}
          >
            {unit}
          </div>
        ) : null}
      </div>
      <div style={{position: 'absolute', top: 'var(--content-top)', bottom: 'var(--content-bottom)', left: 'var(--shell-x)', right: 'var(--shell-x)'}}>
        {children}
      </div>
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 'var(--footer-h)',
          background: 'var(--bg-footer)', borderTop: '3px solid var(--c-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 var(--shell-x)',
        }}
      >
        <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-micro)', letterSpacing: 2}}>
          {[unit, label].filter(Boolean).join(' · ')}
        </div>
        <div style={{color: 'var(--c-accent-soft)', fontSize: 'var(--fs-micro)'}}>分镜 {scene.id}</div>
      </div>
    </AbsoluteFill>
  );
};

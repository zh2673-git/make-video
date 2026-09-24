// [画面组件] SubtitleBar —— 字幕条（token: --subtitle-bg/--subtitle-color/--subtitle-bottom/--subtitle-maxw/--font-body）
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Caption} from '../SceneTypes';

export const SubtitleBar: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const cap = captions.find((c) => frame >= c.from && frame < c.to);
  if (!cap) return null;
  const opacity = interpolate(frame - cap.from, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--subtitle-bottom)',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'var(--subtitle-maxw)',
        background: 'var(--subtitle-bg)',
        color: 'var(--subtitle-color)',
        fontSize: 'var(--fs-body)',
        lineHeight: 1.5,
        padding: '14px 34px',
        borderRadius: 'var(--radius)',
        opacity,
        fontFamily: 'var(--font-body)',
        textAlign: 'center',
      }}
    >
      {cap.text}
    </div>
  );
};

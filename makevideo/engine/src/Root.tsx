// [时空层级：画面组件（Composition 入口）] Root —— 装配 gen 产物：分镜 + 主题 + 工程 meta
// gen 三件套由 makevideo pipeline 生成；CSS 变量在此注入一次，全组件消费。
import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import scenesData from './scenes.gen.json';
import themeData from './theme.gen.json';
import metaData from './meta.gen.json';
import {MicroCourse} from './MicroCourse';
import type {ProjectMeta, Scene} from './SceneTypes';
import {themeVars} from './theme';

export const RemotionRoot: React.FC = () => {
  const scenes = scenesData as unknown as Scene[];
  const meta = metaData as ProjectMeta;
  const total = scenes.reduce((acc, s) => acc + s.frames, 0);
  return (
    <Composition
      id="microcourse"
      component={(props: {scenes: Scene[]; meta: ProjectMeta}) => (
        <AbsoluteFill style={themeVars(themeData as never)}>{/* 主题变量注入根 */}
          <MicroCourse {...props} />
        </AbsoluteFill>
      )}
      durationInFrames={total}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{scenes, meta}}
    />
  );
};

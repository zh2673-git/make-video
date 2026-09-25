// [时空层级：画面组件（消费侧编排）] MicroCourse —— Sequence 编排 + 组件映射表（exhaustive，编译期守门）
import React from 'react';
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene, SceneType} from './SceneTypes';
import {pickVariant, theme} from './theme';
import {BulletsScene} from './components/BulletsScene';
import {ChartScene} from './components/ChartScene';
import {CodeScene} from './components/CodeScene';
import {CompareScene} from './components/CompareScene';
import {EndingScene} from './components/EndingScene';
import {FlowScene} from './components/FlowScene';
import {ImageScene} from './components/ImageScene';
import {QuoteScene} from './components/QuoteScene';
import {StatScene} from './components/StatScene';
import {TableScene} from './components/TableScene';
import {TimelineScene} from './components/TimelineScene';
import {TitleScene} from './components/TitleScene';
import {SubtitleBar} from './components/SubtitleBar';

// 分镜 type ↔ 组件一一对应（漏型 TS 编译报错）；variant 由编排层按同版式出现序号轮换下发
const COMPONENTS: Record<SceneType, React.FC<{scene: Scene; meta: ProjectMeta; variant?: string}>> = {
  title: TitleScene,
  ending: EndingScene,
  bullets: BulletsScene,
  flow: FlowScene,
  stat: StatScene,
  table: TableScene,
  panorama: TableScene,
  quote: QuoteScene,
  compare: CompareScene,
  timeline: TimelineScene,
  chart: ChartScene,
  code: CodeScene,
  image: ImageScene,
};

const BARE: Partial<Record<SceneType, boolean>> = {title: true, ending: true};

// 单分镜包装：画面 + 配音 + 字幕（整体 fade 入场）
const SceneView: React.FC<{scene: Scene; meta: ProjectMeta; variant: string}> = ({scene, meta, variant}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const Body = COMPONENTS[scene.type];
  const fade = spring({frame, fps, config: {damping: 200, stiffness: 120}, durationInFrames: theme.motion.fadeFrames});
  const overlay = BARE[scene.type] ? null : <SubtitleBar captions={scene.captions} />;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: fade}}>
        <Body scene={scene} meta={meta} variant={variant} />
        {overlay}
      </AbsoluteFill>
      <Audio src={staticFile(scene.audio)} />
    </AbsoluteFill>
  );
};

export const MicroCourse: React.FC<{scenes: Scene[]; meta: ProjectMeta}> = ({scenes, meta}) => {
  let offset = 0;
  const occurrence: Record<string, number> = {};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s) => {
        const from = offset;
        offset += s.frames;
        const k = occurrence[s.type] ?? 0;
        occurrence[s.type] = k + 1;
        return (
          <Sequence key={s.id} from={from} durationInFrames={s.frames} name={`S${s.id}`}>
            <SceneView scene={s} meta={meta} variant={pickVariant(s.type, k)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

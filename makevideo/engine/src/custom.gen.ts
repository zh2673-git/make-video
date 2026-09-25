// [自动生成] custom.gen.ts —— 创意场景注册表（makevideo pipeline 生成；手工修改会被覆盖）
import type {FC} from 'react';
import type {ProjectMeta, Scene} from './SceneTypes';

/** 创意场景 props（与规则组件签名对齐；variant 由编排层下发，创意场景可自行忽略）。 */
export type CustomSceneProps = {scene: Scene; meta: ProjectMeta; variant?: string};
/** bare=true 的场景不叠加字幕条（全幅画面，如片头片尾）。 */
export type CustomSceneModule = {Component: FC<CustomSceneProps>; bare: boolean};

import CoverScene from './custom/cover';
import EndcardScene from './custom/endcard';
import NumbersScene from './custom/numbers';
import PipelineScene from './custom/pipeline';
import SwatchesScene from './custom/swatches';
import TerminalScene from './custom/terminal';

export const CUSTOM_SCENES: Record<string, CustomSceneModule> = {
  'cover': {Component: CoverScene, bare: true},
  'endcard': {Component: EndcardScene, bare: true},
  'numbers': {Component: NumbersScene, bare: false},
  'pipeline': {Component: PipelineScene, bare: false},
  'swatches': {Component: SwatchesScene, bare: false},
  'terminal': {Component: TerminalScene, bare: false},
};

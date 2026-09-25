// [画面原语] primitives.tsx —— 创意模式画笔 SDK（画笔不是组件库：只提供时序/计数/图标等最薄原语，构图完全自由）
// 纪律：视觉一律消费主题 CSS 变量（var(--c-*)/var(--fs-*)/var(--bg-*)），仅 motion 参数走 JS。
import type {CSSProperties} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from './theme';

export {Icon, hasIcon} from './icons';

/** 入场 spring 进度（主题 entranceSpring 配置），delay 帧后启动，0→1。 */
export function useEntrance(delay = 0): number {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: theme.motion.entranceSpring});
}

/** 纯淡入进度：from 帧 → from+dur 帧线性 0→1（clamp）。 */
export function useFade(from = 0, dur = 12): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, from + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
}

/** 数字计数文本：0→value 按入场 spring 收敛；decimals 控制小数位。 */
export function useCountUp(value: number, delay = 0, decimals = 0): string {
  const p = useEntrance(delay);
  return (value * p).toFixed(decimals);
}

/** 常用入场组合样式：fade=纯淡入 / rise=淡入+上浮 40px / slide=淡入+左移 60px / scale=淡入+放大 0.92→1。 */
export function useEntranceStyle(delay = 0, kind: 'fade' | 'rise' | 'slide' | 'scale' = 'rise'): CSSProperties {
  const p = useEntrance(delay);
  const transform = kind === 'rise' ? `translateY(${(1 - p) * 40}px)`
    : kind === 'slide' ? `translateX(${(1 - p) * 60}px)`
    : kind === 'scale' ? `scale(${0.92 + p * 0.08})`
    : 'none';
  return {opacity: p, transform};
}

/** 逐项错峰延迟（主题 stagger 步长）：第 i 项的入场延迟帧数。 */
export function staggerDelay(i: number, base = 8): number {
  return base + i * theme.motion.stagger;
}

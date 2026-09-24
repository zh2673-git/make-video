// [时空层级：数据规范（规则）] theme.ts —— 主题 token 类型与 CSS 变量注入
// 组件消费纪律：视觉一律 var(--c-*) / var(--fs-*) / var(--bg-*)；仅 motion 参数走 JS。
import themeJson from './theme.gen.json';

export type RGB = string; // #RRGGBB / rgba() / 完整 CSS 渐变串

export interface Theme {
  palette: {
    primary: RGB; primaryDark: RGB; primaryLight: RGB; accent: RGB; accentSoft: RGB;
    surface: RGB; surfaceCard: RGB; surfaceAlt: RGB; ink: RGB; inkMuted: RGB; onPrimary: RGB;
  };
  semantic: {
    success: RGB; info: RGB; warning: RGB; highlightRow: RGB;
    terminalBg: RGB; terminalFg: RGB;
  };
  typography: {
    body: string; mono: string;
    display: number; title: number; header: number;
    h1: number; h2: number; body: number; caption: number; micro: number;
  };
  motion: {
    entranceSpring: {damping: number; stiffness: number};
    stagger: number; tableRowDelay: number; fadeFrames: number;
  };
  layout: {
    safeX: number; contentTop: number; contentBottom: number;
    headerHeight: number; footerHeight: number;
    subtitleBottom: number; subtitleMaxWidth: number; radius: number;
  };
  brand: {
    coverBg: string; headerBg: string; footerBg: string; contentBg: string;
    subtitleBg: string; subtitleColor: string; serialLabel: string;
  };
}

export const theme = themeJson as unknown as Theme;

/** 主题 → CSS 变量表（Root 注入一次，全组件消费）。 */
export function themeVars(t: Theme): Record<string, string> {
  const p = t.palette;
  const s = t.semantic;
  const ty = t.typography;
  const l = t.layout;
  const b = t.brand;
  return {
    '--c-primary': p.primary,
    '--c-primary-dark': p.primaryDark,
    '--c-primary-light': p.primaryLight,
    '--c-accent': p.accent,
    '--c-accent-soft': p.accentSoft,
    '--c-surface': p.surface,
    '--c-surface-card': p.surfaceCard,
    '--c-surface-alt': p.surfaceAlt,
    '--c-ink': p.ink,
    '--c-ink-muted': p.inkMuted,
    '--c-on-primary': p.onPrimary,
    '--c-success': s.success,
    '--c-info': s.info,
    '--c-warning': s.warning,
    '--c-highlight-row': s.highlightRow,
    '--c-terminal-bg': s.terminalBg,
    '--c-terminal-fg': s.terminalFg,
    '--font-body': ty.body,
    '--font-mono': ty.mono,
    '--fs-display': `${ty.display}px`,
    '--fs-title': `${ty.title}px`,
    '--fs-header': `${ty.header}px`,
    '--fs-h1': `${ty.h1}px`,
    '--fs-h2': `${ty.h2}px`,
    '--fs-body': `${ty.body}px`,
    '--fs-caption': `${ty.caption}px`,
    '--fs-micro': `${ty.micro}px`,
    '--radius': `${l.radius}px`,
    '--subtitle-bottom': `${l.subtitleBottom}px`,
    '--subtitle-maxw': `${l.subtitleMaxWidth}px`,
    '--shell-x': `${l.safeX}px`,
    '--content-top': `${l.contentTop}px`,
    '--content-bottom': `${l.contentBottom}px`,
    '--header-h': `${l.headerHeight}px`,
    '--footer-h': `${l.footerHeight}px`,
    '--bg-cover': b.coverBg,
    '--bg-header': b.headerBg,
    '--bg-footer': b.footerBg,
    '--bg-content': b.contentBg,
    '--subtitle-bg': b.subtitleBg,
    '--subtitle-color': b.subtitleColor,
  } as React.CSSProperties;
}

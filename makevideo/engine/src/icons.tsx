// [时空层级：数据规范（规则）] icons.tsx —— 内嵌图标库（feather 风格 24×24 stroke path，编译期常量）
// 讲稿层语义选择（icons: zap,rocket），渲染层只按名称查表；未知名回退 null（调用方回退序号圆）。
import React from 'react';

const F = (...children: React.ReactNode[]): React.ReactNode => <>{children}</>;

export const ICONS: Record<string, React.ReactNode> = {
  // 状态与确认
  check: <polyline points="20 6 9 17 4 12" />,
  x: F(<line x1="18" y1="6" x2="6" y2="18" />, <line x1="6" y1="6" x2="18" y2="18" />),
  alert: F(
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />,
    <line x1="12" y1="9" x2="12" y2="13" />, <line x1="12" y1="17" x2="12.01" y2="17" />,
  ),
  info: F(
    <circle cx="12" cy="12" r="10" />,
    <line x1="12" y1="16" x2="12" y2="12" />, <line x1="12" y1="8" x2="12.01" y2="8" />,
  ),
  // 能量与速度
  zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  clock: F(<circle cx="12" cy="12" r="10" />, <polyline points="12 6 12 12 16 14" />),
  send: F(<line x1="22" y1="2" x2="11" y2="13" />, <polygon points="22 2 15 22 11 13 2 9 22 2" />),
  play: <polygon points="5 3 19 12 5 21 5 3" />,
  // 数据与图表
  database: F(
    <ellipse cx="12" cy="5" rx="9" ry="3" />,
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />,
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />,
  ),
  chart: F(
    <line x1="12" y1="20" x2="12" y2="10" />,
    <line x1="18" y1="20" x2="18" y2="4" />, <line x1="6" y1="20" x2="6" y2="16" />,
  ),
  'trending-up': F(
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
    <polyline points="17 6 23 6 23 12" />,
  ),
  pie: F(<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />, <path d="M22 12A10 10 0 0 0 12 2v10z" />),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  target: F(
    <circle cx="12" cy="12" r="10" />, <circle cx="12" cy="12" r="6" />, <circle cx="12" cy="12" r="2" />,
  ),
  // 技术与代码
  code: F(<polyline points="16 18 22 12 16 6" />, <polyline points="8 6 2 12 8 18" />),
  terminal: F(<polyline points="4 17 10 11 4 5" />, <line x1="12" y1="19" x2="20" y2="19" />),
  cpu: F(
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />, <rect x="9" y="9" width="6" height="6" />,
    <line x1="9" y1="1" x2="9" y2="4" />, <line x1="15" y1="1" x2="15" y2="4" />,
    <line x1="9" y1="20" x2="9" y2="23" />, <line x1="15" y1="20" x2="15" y2="23" />,
    <line x1="20" y1="9" x2="23" y2="9" />, <line x1="20" y1="14" x2="23" y2="14" />,
    <line x1="1" y1="9" x2="4" y2="9" />, <line x1="1" y1="14" x2="4" y2="14" />,
  ),
  cloud: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
  'git-branch': F(
    <line x1="6" y1="3" x2="6" y2="15" />,
    <circle cx="18" cy="6" r="3" />, <circle cx="6" cy="18" r="3" />,
    <path d="M18 9a9 9 0 0 1-9 9" />,
  ),
  layers: F(
    <polygon points="12 2 2 7 12 12 22 7 12 2" />,
    <polyline points="2 17 12 22 22 17" />, <polyline points="2 12 12 17 22 12" />,
  ),
  grid: F(
    <rect x="3" y="3" width="7" height="7" />, <rect x="14" y="3" width="7" height="7" />,
    <rect x="14" y="14" width="7" height="7" />, <rect x="3" y="14" width="7" height="7" />,
  ),
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  // 文档与内容
  'file-text': F(
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
    <polyline points="14 2 14 8 20 8" />, <line x1="16" y1="13" x2="8" y2="13" />,
    <line x1="16" y1="17" x2="8" y2="17" />, <polyline points="10 9 9 9 8 9" />,
  ),
  book: F(
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />,
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
  ),
  edit: F(
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />,
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
  ),
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  mail: F(
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />, <polyline points="22,6 12,13 2,6" />,
  ),
  calendar: F(
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />,
    <line x1="16" y1="2" x2="16" y2="6" />, <line x1="8" y1="2" x2="8" y2="6" />,
    <line x1="3" y1="10" x2="21" y2="10" />,
  ),
  // 用户与组织
  users: F(
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />, <circle cx="9" cy="7" r="4" />,
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />, <path d="M16 3.13a4 4 0 0 1 0 7.75" />,
  ),
  user: F(<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />, <circle cx="12" cy="7" r="4" />),
  globe: F(
    <circle cx="12" cy="12" r="10" />, <line x1="2" y1="12" x2="22" y2="12" />,
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />,
  ),
  award: F(<circle cx="12" cy="8" r="7" />, <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />),
  flag: F(
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />,
    <line x1="4" y1="22" x2="4" y2="15" />,
  ),
  // 安全与信任
  lock: F(<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />, <path d="M7 11V7a5 5 0 0 1 10 0v4" />),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  'shield-check': F(
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    <polyline points="9 12 11 14 15 10" />,
  ),
  key: <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />,
  // 视觉与媒体
  search: F(<circle cx="11" cy="11" r="8" />, <line x1="21" y1="21" x2="16.65" y2="16.65" />),
  eye: F(<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />, <circle cx="12" cy="12" r="3" />),
  camera: F(
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />,
    <circle cx="12" cy="13" r="4" />,
  ),
  mic: F(
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />,
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />, <line x1="12" y1="19" x2="12" y2="23" />,
  ),
  image: F(
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />, <circle cx="8.5" cy="8.5" r="1.5" />,
    <polyline points="21 15 16 10 5 21" />,
  ),
  video: F(<polygon points="23 7 16 12 23 17 23 7" />, <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />),
  // 沟通与连接
  link: F(
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />,
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  ),
  share: F(
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />,
    <polyline points="16 6 12 2 8 6" />, <line x1="12" y1="2" x2="12" y2="15" />,
  ),
  download: F(
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />,
    <polyline points="7 10 12 15 17 10" />, <line x1="12" y1="15" x2="12" y2="3" />,
  ),
  upload: F(
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />,
    <polyline points="17 8 12 3 7 8" />, <line x1="12" y1="3" x2="12" y2="15" />,
  ),
  // 情感与评价
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  thumbs: <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />,
  // 火箭（lucide：推进/上线隐喻）
  rocket: F(
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />,
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />,
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />,
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />,
  ),
};

// 常用别名（讲稿里更好记的短名）
const ALIASES: Record<string, string> = {
  bar: 'chart', doc: 'file-text', file: 'file-text',
  warn: 'alert', warning: 'alert', ok: 'check', done: 'check',
  speed: 'zap', fast: 'zap', light: 'zap', launch: 'rocket', start: 'rocket',
  db: 'database', data: 'database', team: 'users', person: 'user',
  security: 'shield', safe: 'shield-check', time: 'clock', web: 'globe',
  pic: 'image', photo: 'camera', chat: 'message', ai: 'cpu',
};

export function hasIcon(name: string | undefined): boolean {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return n in ICONS || n in ALIASES;
}

/** 按名称渲染图标；未知名返回 null（调用方回退序号）。stroke=currentColor，尺寸随容器字号。 */
export const Icon: React.FC<{name: string; size?: number; strokeWidth?: number}> = ({name, size = 28, strokeWidth = 2}) => {
  let n = (name || '').trim().toLowerCase();
  n = ALIASES[n] ?? n;
  const body = ICONS[n];
  if (!body) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-label={n}>
      {body}
    </svg>
  );
};

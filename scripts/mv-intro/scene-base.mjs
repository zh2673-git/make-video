// 场景骨架：共享底座（grain/vignette/stage）+ 单镜专属 CSS/结构/动效
// 铁律：每个镜头的内容与构图由 agent 逐镜原创（scripts/mv-intro/scenes-*.mjs）
// 注意：单镜 CSS 排在 BASE_CSS 之前——compose 的 pickCaptionSide 读取首个 .subject 块，
// 需由单镜规则提供 top/bottom 以决定字幕落位；BASE_CSS 只提供不冲突的兜底属性。

export const BASE_CSS = `
  html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #0a0807; }
  body { font-family: 'Microsoft YaHei','PingFang SC','Arial Black',sans-serif; -webkit-font-smoothing: antialiased; }
  .stage { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .grain { position: absolute; inset: 0; opacity: 0.1; pointer-events: none; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E"); }
  .vig { position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 46%, transparent 40%, rgba(0,0,0,0.86) 118%); }
  .subject { position: absolute; margin: 0; font-weight: 800; white-space: nowrap; }
  .tag { position: absolute; }
`;

export function buildScene(shot) {
  const { id, css = '', body, anim, beats = 4 } = shot;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>${css}${BASE_CSS}</style>
</head>
<body data-scene-id="${id}" data-beats="${beats}">
  <div class="stage">
${body}
  </div>
  <div class="grain"></div>
  <div class="vig"></div>
  <script src="../motion/motion-lib.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
${anim}
    });
  </script>
</body>
</html>
`;
}

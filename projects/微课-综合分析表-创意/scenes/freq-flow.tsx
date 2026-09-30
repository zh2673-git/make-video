// 创意场景 freq-flow —— 明细台账流入"分组汇总"节点，右侧产出四张频率表：压缩过程可视化
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {ProjectMeta, Scene} from '../SceneTypes';
import {Icon, staggerDelay, useEntrance} from '../primitives';

const ROWS = [
  '01-03　孙某 → 刘某　　转账　5,000.00',
  '01-07　孙某 → 刘某　　转账　12,000.00',
  '01-12　刘某 → 孙某　　转账　3,800.00',
  '01-19　孙某 → 周某　　转账　8,600.00',
  '01-26　孙某 → 刘某　　消费　920.00',
  '02-02　周某 → 孙某　　转账　6,000.00',
];
const OUTS = [
  {icon: 'grid', label: '银行频率表', note: '收入 · 支出 · 次数'},
  {icon: 'grid', label: '话单频率表', note: '次数 · 时长'},
  {icon: 'grid', label: '微信频率表', note: '收入 · 支出 · 次数'},
  {icon: 'grid', label: '支付宝频率表', note: '收入 · 支出 · 次数'},
];
const NX = 960, NY = 500; // 分组汇总节点圆心

export default function FreqFlowScene({scene}: {scene: Scene; meta: ProjectMeta}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodePop = spring({frame: frame - 26, fps, config: {damping: 13, stiffness: 90}});
  const inBar = spring({frame: frame - 20, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 16});
  const outBar = spring({frame: frame - 40, fps, config: {damping: 200, stiffness: 60}, durationInFrames: 16});
  return (
    <AbsoluteFill style={{background: 'var(--bg-content)', fontFamily: 'var(--font-body)'}}>
      <div style={{position: 'absolute', top: 'var(--content-top)', left: 'var(--shell-x)'}}>
        <div style={{color: 'var(--c-accent)', fontSize: 'var(--fs-caption)', letterSpacing: 8}}>{scene.title}</div>
        <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-header)', fontWeight: 800, marginTop: 10}}>
          把明细压成台账
        </div>
      </div>
      {/* 左：原始明细（流水的行） */}
      <div style={{position: 'absolute', left: 'var(--shell-x)', top: 320, width: 560}}>
        {ROWS.map((r, i) => {
          const p = useEntrance(staggerDelay(i, 2));
          return (
            <div key={i} style={{marginBottom: 16, padding: '14px 22px', borderRadius: 12,
              background: 'var(--c-surface-card)', border: '1px solid var(--c-surface-alt)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-micro)', color: 'var(--c-ink)',
              opacity: p, transform: `translateX(${(1 - p) * -36}px)`}}>
              {r}
            </div>
          );
        })}
      </div>
      {/* 汇入线 */}
      <div style={{position: 'absolute', left: 680, top: NY - 2, width: 150, height: 4, borderRadius: 2,
        background: 'var(--c-surface-alt)', overflow: 'hidden'}}>
        <div style={{width: `${Math.min(inBar, 1) * 100}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--c-primary), var(--c-accent))'}} />
      </div>
      {/* 中：分组汇总节点 */}
      <div style={{position: 'absolute', left: NX - 95, top: NY - 95, width: 190, height: 190,
        borderRadius: 95, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
        border: '2px solid var(--c-accent)', opacity: nodePop, transform: `scale(${0.7 + nodePop * 0.3})`,
        boxShadow: '0 16px 40px rgba(90,18,26,0.3)'}}>
        <Icon name="filter" size={44} />
        <div style={{color: 'var(--c-on-primary)', fontSize: 'var(--fs-h2)', fontWeight: 700, marginTop: 8}}>
          分组汇总
        </div>
      </div>
      <div style={{position: 'absolute', left: NX - 260, top: NY + 120, width: 520, textAlign: 'center',
        opacity: nodePop}}>
        <div style={{display: 'inline-block', padding: '8px 26px', borderRadius: 999,
          background: 'var(--c-surface-card)', border: '1px solid var(--c-accent)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-body)', color: 'var(--c-ink)'}}>
          本方姓名 ＋ 对方姓名
        </div>
      </div>
      {/* 引出线 */}
      <div style={{position: 'absolute', left: 1090, top: NY - 2, width: 150, height: 4, borderRadius: 2,
        background: 'var(--c-surface-alt)', overflow: 'hidden'}}>
        <div style={{width: `${Math.min(outBar, 1) * 100}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--c-accent), var(--c-primary))'}} />
      </div>
      {/* 右：四张频率表产出 */}
      <div style={{position: 'absolute', right: 'var(--shell-x)', top: 268, width: 560}}>
        {OUTS.map((o, i) => {
          const s = spring({frame: frame - 48 - i * 9, fps, config: {damping: 15, stiffness: 110}});
          return (
            <div key={o.label} style={{marginBottom: 18, padding: '20px 26px', borderRadius: 'var(--radius)',
              background: 'var(--c-surface-card)', border: '1px solid var(--c-primary-light)',
              borderLeft: '5px solid var(--c-accent)', display: 'flex', alignItems: 'center', gap: 18,
              opacity: s, transform: `translateX(${(1 - s) * 44}px)`}}>
              <div style={{width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))',
                color: 'var(--c-on-primary)'}}>
                <Icon name={o.icon} size={26} />
              </div>
              <div>
                <div style={{color: 'var(--c-ink)', fontSize: 'var(--fs-h2)', fontWeight: 700}}>{o.label}</div>
                <div style={{color: 'var(--c-ink-muted)', fontSize: 'var(--fs-caption)', marginTop: 2}}>{o.note}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 210, left: 0, right: 0, textAlign: 'center',
        color: 'var(--c-ink-muted)', fontSize: 'var(--fs-body)',
        opacity: interpolate(frame, [60, 78], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        全程无需写代码 · 省大数据平台多维分析工具
      </div>
    </AbsoluteFill>
  );
}

// s31-s36：逐镜原创场景（周星驰式 · 一本正经地荒诞）
export const scenes = [
  {
    id: 's31',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#08090d; }
  .ruler { position:absolute; left:8%; top:56%; width:84%; height:26px; border-radius:13px; background:#1d2530; }
  .ruler i { display:block; height:100%; width:5%; border-radius:13px; background:linear-gradient(90deg,#facc15,#f97316); box-shadow:0 0 22px rgba(250,204,21,.65); }
  .marks { position:absolute; left:8%; top:64%; width:84%; display:flex; justify-content:space-between; font-family:Consolas,'Courier New',monospace; font-size:24px; color:#5d6b78; }
  .cell1 { position:absolute; left:8%; top:22%; width:130px; height:230px; border:5px solid #facc15; background:rgba(250,204,21,.1); box-shadow:0 0 30px rgba(250,204,21,.3); }
  .subject { left:76%; top:36%; transform:translateX(-50%); font-size:104px; color:#fde68a; letter-spacing:.14em; }
  .tag { left:76%; top:50%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#7c8b98; }
`,
    body: `    <div class="bg"></div>
    <div class="cell1"></div>
    <div class="ruler"><i></i></div>
    <div class="marks"><span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span><span>00:20</span></div>
    <h1 class="subject">第一格</h1>
    <div class="tag">FRAME ZERO</div>`,
    anim: `      MV.enter('.cell1', { easing: 'power4.out', duration: 500, from: { opacity: 0, scale: 0.7 } });
      MV.enter('.ruler', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.cell1', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's32',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#1d1a13 0%,#090806 100%); }
  .paper2 { position:absolute; left:15%; top:16%; width:54%; height:60%; background:#fdf6e3; transform:rotate(-4deg); box-shadow:0 26px 48px rgba(0,0,0,.62); }
  .pen { position:absolute; left:60%; top:20%; width:42px; height:340px; border-radius:10px; background:linear-gradient(180deg,#1f2937,#0a0e13); transform:rotate(28deg); box-shadow:0 20px 34px rgba(0,0,0,.6); }
  .pen::after { content:''; position:absolute; left:7px; bottom:-36px; border-left:14px solid transparent; border-right:14px solid transparent; border-top:38px solid #eab308; }
  .subject { left:78%; top:82%; transform:translateX(-50%); font-size:100px; color:#fff3c4; letter-spacing:.14em; }
  .tag { left:78%; top:66%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#a89878; }
`,
    body: `    <div class="bg"></div>
    <div class="paper2"></div>
    <div class="pen"></div>
    <h1 class="subject">写一句</h1>
    <div class="tag">ONE SENTENCE</div>`,
    anim: `      MV.enter('.paper2', { easing: 'power2.out', duration: 700, from: { opacity: 0, y: 50 } });
      MV.enter('.pen', { easing: 'power3.out', duration: 600, from: { opacity: 0, y: -60 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.pen', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's33',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(circle at 50% 40%, #251d13 0%,#080605 74%); }
  .studio { position:absolute; right:9%; top:26%; width:430px; height:330px; border:11px solid #5b4a33; background:linear-gradient(180deg,#2a2118,#120d09); box-shadow:0 26px 46px rgba(0,0,0,.62); }
  .roof { position:absolute; right:9%; top:14%; width:452px; height:120px; background:linear-gradient(180deg,#8a3728,#4a1a12); clip-path:polygon(9% 100%, 91% 100%, 100% 0, 0 0); }
  .fly { position:absolute; left:22%; top:42%; width:250px; height:132px; background:#fdf6e3; transform:rotate(-13deg); box-shadow:0 18px 30px rgba(0,0,0,.55); }
  .subject { left:30%; top:80%; transform:translateX(-50%); font-size:100px; color:#ffe7a8; letter-spacing:.12em; }
  .tag { left:30%; top:64%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#b39a6c; }
`,
    body: `    <div class="bg"></div>
    <div class="roof"></div>
    <div class="studio"></div>
    <div class="fly"></div>
    <h1 class="subject">交给片场</h1>
    <div class="tag">HAND IT OVER</div>`,
    anim: `      MV.enter('.studio', { easing: 'power2.out', duration: 700, from: { opacity: 0, scale: 0.94 } });
      MV.enter('.fly', { easing: 'power3.out', duration: 600, from: { opacity: 0, x: -60 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.subject', { duration: 1500 });
      MV.camera('.stage', { move: 'pan', zoom: 'MLS', duration: 6 });`,
  },
  {
    id: 's34',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(circle at 50% 42%, #2c1220 0%,#08060a 74%); }
  .heart { position:absolute; left:50%; top:38%; width:430px; height:410px; margin-left:-215px; background:linear-gradient(180deg,#fda4af,#e11d48); clip-path:polygon(50% 100%, 6% 52%, 6% 30%, 18% 12%, 34% 9%, 44% 22%, 50% 36%, 56% 22%, 66% 9%, 82% 12%, 94% 30%, 94% 52%); filter:drop-shadow(0 0 46px rgba(244,63,94,.55)); }
  .row2 { position:absolute; left:50%; top:76%; width:720px; margin-left:-360px; display:flex; gap:7px; justify-content:center; }
  .sq { width:26px; height:26px; background:rgba(252,165,165,.82); box-shadow:0 0 14px rgba(252,165,165,.55); }
  .sq.off { background:rgba(252,165,165,.16); box-shadow:none; }
  .subject { left:50%; top:88%; transform:translateX(-50%); font-size:96px; color:#fecdd3; letter-spacing:.16em; }
`,
    body: `    <div class="bg"></div>
    <div class="heart"></div>
    <div class="row2">
      <div class="sq"></div><div class="sq"></div><div class="sq"></div><div class="sq"></div>
      <div class="sq"></div><div class="sq off"></div><div class="sq"></div><div class="sq"></div>
      <div class="sq"></div><div class="sq"></div><div class="sq"></div><div class="sq"></div>
      <div class="sq"></div><div class="sq"></div><div class="sq off"></div><div class="sq"></div>
      <div class="sq"></div><div class="sq"></div><div class="sq"></div><div class="sq"></div>
    </div>
    <h1 class="subject">问心</h1>`,
    anim: `      MV.enter('.heart', { easing: 'power4.out', duration: 700, from: { opacity: 0, scale: 0.6 } });
      MV.enter('.row2', { easing: 'power2.out', duration: 800, stagger: 40, from: { opacity: 0, y: 30 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.heart', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's35',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#0b0b0e; }
  .tabbar { position:absolute; left:13%; top:10%; width:74%; height:72px; display:flex; gap:10px; align-items:flex-end; }
  .tab { height:72px; padding:0 28px; border-radius:12px 12px 0 0; background:#1d1f24; color:#8b929c; font-size:26px; display:flex; align-items:center; }
  .tab.on { background:#fdf6e3; color:#1b1b1f; box-shadow:0 -6px 20px rgba(253,246,227,.22); }
  .viewport { position:absolute; left:13%; top:18%; width:74%; height:62%; background:radial-gradient(circle at 50% 40%, #31281a 0%,#0a0806 74%); border:2px solid #33343a; }
  .mini { position:absolute; left:50%; top:44%; width:250px; height:150px; margin-left:-125px; background:linear-gradient(160deg,#4b3b23,#241a10); border:9px solid #6b563a; box-shadow:0 18px 34px rgba(0,0,0,.6); }
  .subject { left:50%; top:86%; transform:translateX(-50%); font-size:100px; color:#f4e3b6; letter-spacing:.14em; }
  .tag { left:50%; top:15%; transform:translateX(-50%); font-size:24px; letter-spacing:.36em; color:#6f7784; }
`,
    body: `    <div class="bg"></div>
    <div class="viewport"><div class="mini"></div></div>
    <div class="tabbar"><div class="tab">docs</div><div class="tab on">make-video</div><div class="tab">logs</div></div>
    <h1 class="subject">标签页</h1>
    <div class="tag">ONE TAB</div>`,
    anim: `      MV.enter('.viewport', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.tabbar', { easing: 'power3.out', duration: 600, from: { opacity: 0, y: -40 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.tab.on', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's36',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#050505; }
  .slate2 { position:absolute; left:50%; top:42%; width:640px; height:290px; margin-left:-320px; transform:rotate(-3deg); background:#0f1013; border:9px solid #e9dcbe; box-shadow:0 32px 58px rgba(0,0,0,.75); overflow:hidden; }
  .slate2::before { content:''; position:absolute; left:-10%; top:42%; width:120%; height:46px; transform:rotate(-9deg); background:repeating-linear-gradient(112deg,#e9dcbe 0 26px,#0f1013 26px 52px); }
  .lamp2 { position:absolute; left:50%; top:82%; width:120px; height:120px; margin-left:-60px; border-radius:50%; background:radial-gradient(circle at 40% 34%, #86efac, #16a34a 60%, #14532d); box-shadow:0 0 44px rgba(34,197,94,.6); }
  .subject { left:50%; top:20%; transform:translateX(-50%); font-size:140px; color:#ffe7a8; letter-spacing:.2em; text-shadow:0 0 50px rgba(255,200,120,.6); }
  .tag { left:50%; top:68%; transform:translateX(-50%); font-size:26px; letter-spacing:.5em; color:#9ca3af; }
`,
    body: `    <div class="bg"></div>
    <div class="slate2"></div>
    <div class="lamp2"></div>
    <h1 class="subject">开机</h1>
    <div class="tag">ROLL</div>`,
    anim: `      MV.enter('.slate2', { easing: 'power4.out', duration: 600, from: { opacity: 0, scale: 1.3 } });
      MV.enter('.lamp2', { easing: 'power2.out', duration: 600, delay: 500, from: { opacity: 0, scale: 0.6 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 1.5 } });
      MV.emphasis('.subject', { duration: 1600 });
      MV.camera('.stage', { move: 'push-in', zoom: 'CU', duration: 6 });`,
  },
];

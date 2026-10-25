// s13-s24：逐镜原创场景（周星驰式 · 一本正经地荒诞）
export const scenes = [
  {
    id: 's13',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#16202b 0%,#070b10 100%); }
  .meg { position:absolute; left:6%; top:26%; width:300px; height:230px; border-radius:44px 150px 44px 44px; background:linear-gradient(160deg,#59697a,#1c242c); transform:rotate(-6deg); box-shadow:0 22px 40px rgba(0,0,0,.62); }
  .meg::before { content:''; position:absolute; left:8%; top:42%; width:130px; height:62px; border-radius:24px; background:#2b343d; }
  .meg::after { content:''; position:absolute; right:-58px; top:42%; width:78px; height:78px; border-radius:50%; background:radial-gradient(circle at 40% 34%, #fff2c0, #b45309); }
  .queue { position:absolute; left:33%; top:18%; width:60%; display:flex; flex-direction:column; gap:13px; }
  .qrow { height:44px; display:flex; align-items:center; gap:16px; font-family:Consolas,'Courier New',monospace; font-size:24px; color:#9fd6ff; }
  .qrow b { color:#facc15; font-weight:700; }
  .tip { width:0; height:0; border-top:15px solid transparent; border-bottom:15px solid transparent; border-right:24px solid #4ade80; }
  .subject { left:72%; top:78%; transform:translateX(-50%); font-size:104px; color:#bbf7d0; letter-spacing:.14em; }
  .tag { left:33%; top:88%; font-size:26px; letter-spacing:.4em; color:#5b8ca8; }
`,
    body: `    <div class="bg"></div>
    <div class="meg"></div>
    <div class="queue">
      <div class="qrow"><span class="tip"></span><b>mv.enter</b><span>('.stage', ...)</span></div>
      <div class="qrow"><span class="tip"></span><b>mv.enter</b><span>('.light', ...)</span></div>
      <div class="qrow"><span class="tip"></span><b>mv.enter</b><span>('.actor', ...)</span></div>
      <div class="qrow"><span class="tip"></span><b>mv.camera</b><span>('.stage', ...)</span></div>
      <div class="qrow"><span class="tip"></span><b>mv.camera</b><span>('.stage', ...)</span></div>
      <div class="qrow"><span class="tip"></span><b>mv.camera</b><span>('.stage', ...)</span></div>
    </div>
    <h1 class="subject">向左</h1>
    <div class="tag">300 LINES</div>`,
    anim: `      MV.enter('.meg', { easing: 'power3.out', duration: 600, from: { opacity: 0, scale: 1.2 } });
      MV.enter('.queue', { easing: 'power2.out', duration: 800, stagger: 60, from: { opacity: 0, x: -40 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.subject', { duration: 1500 });
      MV.camera('.stage', { move: 'pan-left', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's14',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#1f1927 0%,#0a0810 100%); }
  .shelf { position:absolute; left:9%; top:17%; width:42%; height:64%; border:9px solid #4c4058; background:repeating-linear-gradient(180deg, transparent 0 116px, #4c4058 116px 126px); }
  .bin { position:absolute; left:12%; top:22%; width:36%; height:9%; background:#2b2433; border-radius:6px; }
  .dust { position:absolute; left:20%; top:24%; width:44%; height:40%; background:radial-gradient(circle at 42% 40%, rgba(255,240,200,.34), rgba(255,240,200,0) 62%); }
  .cloud { position:absolute; right:12%; top:24%; width:420px; height:280px; border-radius:50%; background:radial-gradient(circle at 32% 38%, #fff8e1, #facc15 44%, #fb923c 80%); box-shadow:0 0 74px rgba(250,204,21,.42); }
  .shape { position:absolute; right:20%; top:36%; width:140px; height:140px; border:9px solid #fffdf5; transform:rotate(22deg); }
  .subject { left:71%; top:74%; transform:translateX(-50%); font-size:104px; color:#fff3c4; letter-spacing:.1em; text-shadow:0 4px 0 rgba(0,0,0,.45); }
  .tag { left:12%; top:86%; font-size:26px; letter-spacing:.4em; color:#9b8fb0; }
`,
    body: `    <div class="bg"></div>
    <div class="shelf"></div>
    <div class="bin"></div>
    <div class="dust"></div>
    <div class="cloud"></div>
    <div class="shape"></div>
    <h1 class="subject">想象力</h1>
    <div class="tag">EMPTY LIBRARY</div>`,
    anim: `      MV.enter('.shelf', { easing: 'power2.out', duration: 700, from: { opacity: 0, y: 50 } });
      MV.enter('.cloud', { easing: 'power4.out', duration: 700, from: { opacity: 0, scale: 0.6 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.cloud', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's15',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#2b1322 0%,#120810 100%); }
  .mirror { position:absolute; left:11%; top:20%; width:42%; height:62%; border:14px solid #d9b26a; border-radius:220px 220px 18px 18px; background:linear-gradient(160deg,#fdf7e8,#d6ccb8); box-shadow:0 28px 52px rgba(0,0,0,.6), inset 0 0 60px rgba(255,255,255,.55); }
  .bulbs { position:absolute; left:11%; top:11%; width:42%; height:8%; display:flex; justify-content:space-between; }
  .bulb { width:40px; height:40px; border-radius:50%; background:radial-gradient(circle at 40% 34%, #fffbeb, #facc15 58%, #a16207); box-shadow:0 0 28px rgba(250,204,21,.85); }
  .faces { position:absolute; right:12%; top:22%; display:flex; gap:24px; }
  .face { width:146px; height:186px; border-radius:72px 72px 18px 18px; background:linear-gradient(180deg,#f3d9bb,#c49a6a); box-shadow:0 16px 30px rgba(0,0,0,.55); }
  .face.f2 { background:linear-gradient(180deg,#dfe7ef,#8fa3b5); }
  .face.f3 { background:linear-gradient(180deg,#f9d0e8,#b4559a); }
  .subject { left:70%; top:80%; transform:translateX(-50%); font-size:104px; color:#fde2b0; letter-spacing:.14em; }
  .tag { right:12%; top:62%; font-size:26px; letter-spacing:.4em; color:#c99bb4; }
`,
    body: `    <div class="bg"></div>
    <div class="mirror"></div>
    <div class="bulbs"><div class="bulb"></div><div class="bulb"></div><div class="bulb"></div><div class="bulb"></div><div class="bulb"></div><div class="bulb"></div></div>
    <div class="faces"><div class="face"></div><div class="face f2"></div><div class="face f3"></div></div>
    <h1 class="subject">化妆间</h1>
    <div class="tag">STYLE PACKS</div>`,
    anim: `      MV.enter('.mirror', { easing: 'power2.out', duration: 700, from: { opacity: 0, scale: 1.05 } });
      MV.enter('.faces', { easing: 'power3.out', duration: 700, stagger: 110, from: { opacity: 0, y: 40 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.bulb', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's16',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#0b0a12; }
  .wall { position:absolute; left:6%; top:15%; width:58%; height:64%; display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(3,1fr); gap:12px; }
  .frame { position:relative; background:linear-gradient(160deg,#39344f,#1a1628); border:3px solid rgba(250,204,21,.24); }
  .frame.fix { background:linear-gradient(160deg,#6d5c20,#2a2210); border-color:#facc15; box-shadow:0 0 32px rgba(250,204,21,.42); }
  .strike { position:absolute; left:8%; top:44%; width:84%; height:8px; background:#dc2626; transform:rotate(-9deg); }
  .subject { left:76%; top:42%; transform:translate(-50%,-50%); font-size:112px; color:#fde68a; letter-spacing:.1em; }
  .tag { left:76%; top:56%; transform:translateX(-50%); font-size:26px; letter-spacing:.36em; color:#a78bfa; }
  .chip { position:absolute; right:9%; top:16%; width:165px; height:165px; border-radius:18px; background:repeating-conic-gradient(#facc15 0 12deg, #111 12deg 24deg); opacity:.9; }
`,
    body: `    <div class="bg"></div>
    <div class="wall">
      <div class="frame"></div><div class="frame"></div><div class="frame"></div><div class="frame"></div>
      <div class="frame"></div><div class="frame fix"><div class="strike"></div></div><div class="frame"></div><div class="frame"></div>
      <div class="frame"></div><div class="frame"></div><div class="frame"></div><div class="frame"></div>
    </div>
    <div class="chip"></div>
    <h1 class="subject">重绘</h1>
    <div class="tag">ONE WORD</div>`,
    anim: `      MV.enter('.wall', { easing: 'power2.out', duration: 800, from: { opacity: 0 } });
      MV.enter('.chip', { easing: 'power3.out', duration: 600, from: { opacity: 0, scale: 0.5 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.chip', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's17',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#251b30 0%,#0c0812 100%); }
  .faces { position:absolute; left:8%; top:16%; width:84%; display:flex; justify-content:center; gap:42px; }
  .face { position:relative; width:214px; height:264px; border-radius:108px 108px 22px 22px; background:linear-gradient(180deg,#f0d3ae,#c49a6a); box-shadow:0 22px 42px rgba(0,0,0,.6); }
  .face.f2 { background:linear-gradient(180deg,#dfe7ef,#8fa3b5); }
  .face.f3 { background:linear-gradient(180deg,#f9d0e8,#b4559a); }
  .face::before { content:''; position:absolute; left:42px; top:92px; width:32px; height:32px; border-radius:50%; background:#241d18; box-shadow:96px 0 0 #241d18; }
  .face::after { content:''; position:absolute; left:72px; top:164px; width:70px; height:14px; border-radius:8px; background:#7a3a3a; }
  .subject { left:50%; top:84%; transform:translateX(-50%); font-size:100px; color:#f4e3b6; letter-spacing:.14em; }
  .tag { left:50%; top:20%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#a08fb5; }
`,
    body: `    <div class="bg"></div>
    <div class="faces"><div class="face"></div><div class="face f2"></div><div class="face f3"></div></div>
    <h1 class="subject">换脸</h1>
    <div class="tag">SAME STORY</div>`,
    anim: `      MV.enter('.faces', { easing: 'power2.out', duration: 800, stagger: 120, from: { opacity: 0, y: 50 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.25 } });
      MV.performance('.face.f3', {});
      MV.idle('.face.f2', { delay: 400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's18',
    beats: 6,
    css: `
  .bg { position:absolute; inset:0; background:#07070a; }
  .split { position:absolute; inset:0; display:grid; grid-template-columns:1fr 1fr; }
  .cool { position:relative; background:radial-gradient(circle at 50% 40%, #16202c, #05080c 72%); }
  .warm { position:relative; background:radial-gradient(circle at 50% 40%, #3d0c2c, #12040c 72%); }
  .word { position:absolute; left:50%; top:60%; transform:translateX(-50%); font-size:68px; letter-spacing:.28em; }
  .cool .word { color:#d6e6f5; }
  .warm .word { color:#ff6fd8; text-shadow:0 0 34px rgba(255,60,190,.75); }
  .neon { position:absolute; left:8%; top:14%; width:60%; height:40%; border:6px solid rgba(255,80,190,.6); border-radius:12px; box-shadow:0 0 34px rgba(255,60,190,.35) inset, 0 0 24px rgba(255,60,190,.4); }
  .subject { left:50%; top:22%; transform:translateX(-50%); font-size:104px; color:#ffe9b4; letter-spacing:.16em; text-shadow:0 0 40px rgba(255,200,120,.5); }
`,
    body: `    <div class="bg"></div>
    <div class="split">
      <div class="cool"><span class="word">冷光</span></div>
      <div class="warm"><span class="word">霓虹</span><div class="neon"></div></div>
    </div>
    <h1 class="subject">两副面孔</h1>`,
    anim: `      MV.enter('.split', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 1.3 } });
      MV.emphasis('.neon', { duration: 1500 });
      MV.camera('.stage', { move: 'pan', zoom: 'MLS', duration: 6 });`,
  },
  {
    id: 's19',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#1b1b23 0%,#08080b 100%); }
  .clock { position:absolute; left:50%; top:40%; width:330px; height:330px; margin-left:-165px; border-radius:50%; border:16px solid #f4e3b6; background:radial-gradient(circle at 50% 38%, #2b2b34, #121217); box-shadow:0 0 56px rgba(255,220,150,.28); }
  .hand { position:absolute; left:50%; top:50%; width:8px; height:124px; margin-left:-4px; background:#dc2626; transform-origin:50% 100%; transform:rotate(24deg); }
  .hand.h2 { height:92px; background:#facc15; transform:rotate(126deg); }
  .crack { position:absolute; left:57%; top:14%; width:12px; height:72%; background:linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,90,60,.12)); transform:rotate(9deg); }
  .burst { position:absolute; left:63%; top:22%; width:190px; height:190px; background:repeating-conic-gradient(rgba(252,165,165,.85) 0 6deg, transparent 6deg 16deg); border-radius:50%; }
  .subject { left:50%; top:85%; transform:translateX(-50%); font-size:104px; color:#fca5a5; letter-spacing:.16em; }
  .tag { left:50%; top:20%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#a1a1aa; }
`,
    body: `    <div class="bg"></div>
    <div class="clock"><div class="hand"></div><div class="hand h2"></div></div>
    <div class="crack"></div>
    <div class="burst"></div>
    <h1 class="subject">破功</h1>
    <div class="tag">MIN 03 : 59</div>`,
    anim: `      MV.enter('.clock', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.3 } });
      MV.enter('.burst', { easing: 'power4.out', duration: 500, delay: 700, from: { opacity: 0, scale: 0.4 } });
      MV.enter('.subject', { easing: 'power4.out', duration: 600, delay: 700, from: { opacity: 0, scale: 1.5 } });
      MV.performance('.subject', {});
      MV.camera('.stage', { move: 'push-in', zoom: 'CU', duration: 6 });`,
  },
  {
    id: 's20',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(circle at 50% 36%, #1e1a28 0%,#07060a 74%); }
  .bigclock { position:absolute; left:50%; top:38%; width:500px; height:500px; margin-left:-250px; border-radius:50%; border:22px solid #facc15; background:radial-gradient(circle at 50% 34%, #262032, #0d0b13 72%); box-shadow:0 0 76px rgba(250,204,21,.34); }
  .digits { position:absolute; left:50%; top:38%; transform:translate(-50%,-50%); font-family:Consolas,'Courier New',monospace; font-size:118px; letter-spacing:.06em; color:#fff3c4; }
  .tick { position:absolute; left:50%; top:10%; width:6px; height:44px; margin-left:-3px; background:#facc15; transform-origin:50% 800%; }
  .subject { left:50%; top:83%; transform:translateX(-50%); font-size:104px; color:#fde68a; letter-spacing:.14em; }
  .tag { left:50%; top:16%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#9aa3b2; }
`,
    body: `    <div class="bg"></div>
    <div class="bigclock">
      <div class="tick" style="transform:rotate(0deg)"></div>
      <div class="tick" style="transform:rotate(90deg)"></div>
      <div class="tick" style="transform:rotate(180deg)"></div>
      <div class="tick" style="transform:rotate(270deg)"></div>
    </div>
    <div class="digits">00:00</div>
    <h1 class="subject">更在意</h1>
    <div class="tag">TIME IS TRUTH</div>`,
    anim: `      MV.enter('.bigclock', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 0.82 } });
      MV.enter('.digits', { easing: 'power3.out', duration: 600, from: { opacity: 0, scale: 1.2 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.digits', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'CU', duration: 6 });`,
  },
  {
    id: 's21',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#121a1e 0%,#06090b 100%); }
  .tape { position:absolute; left:7%; top:44%; width:68%; height:72px; background:repeating-linear-gradient(90deg, #facc15 0 38px, #191d20 38px 76px); transform:rotate(-3deg); box-shadow:0 16px 28px rgba(0,0,0,.6); }
  .dial { position:absolute; right:9%; top:22%; width:250px; height:250px; border-radius:50%; border:12px solid #6b7480; background:radial-gradient(circle at 42% 34%, #3b4249, #13171a); box-shadow:0 22px 40px rgba(0,0,0,.6); }
  .needle { position:absolute; left:50%; top:50%; width:6px; height:96px; margin-left:-3px; background:#dc2626; transform-origin:50% 100%; transform:rotate(-56deg); }
  .subject { left:25%; top:29%; transform:translateX(-50%); font-size:104px; color:#fde68a; letter-spacing:.14em; }
  .tag { left:25%; top:62%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#7e8b95; }
`,
    body: `    <div class="bg"></div>
    <div class="tape"></div>
    <div class="dial"><div class="needle"></div></div>
    <h1 class="subject">靠量</h1>
    <div class="tag">MEASURED</div>`,
    anim: `      MV.enter('.tape', { easing: 'power2.out', duration: 700, from: { opacity: 0, x: -60 } });
      MV.enter('.dial', { easing: 'power3.out', duration: 600, from: { opacity: 0, scale: 0.8 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.needle', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's22',
    beats: 6,
    css: `
  .bg { position:absolute; inset:0; background:#080a0d; }
  .wave { position:absolute; left:7%; top:18%; width:54%; height:52%; display:flex; align-items:center; gap:9px; }
  .wbar { width:13px; border-radius:7px; background:linear-gradient(180deg,#facc15,#dc2626); }
  .tline { position:absolute; left:7%; top:79%; width:86%; height:18px; border-radius:9px; background:#1e2731; }
  .tline i { display:block; height:100%; width:64%; border-radius:9px; background:linear-gradient(90deg,#4ade80,#16a34a); }
  .subject { left:80%; top:42%; transform:translate(-50%,-50%); font-size:112px; color:#a7f3d0; letter-spacing:.12em; }
  .tag { left:80%; top:56%; transform:translateX(-50%); font-size:26px; letter-spacing:.36em; color:#4f8f6b; }
`,
    body: `    <div class="bg"></div>
    <div class="wave">
      <div class="wbar" style="height:90px"></div><div class="wbar" style="height:170px"></div><div class="wbar" style="height:120px"></div>
      <div class="wbar" style="height:230px"></div><div class="wbar" style="height:150px"></div><div class="wbar" style="height:70px"></div>
      <div class="wbar" style="height:200px"></div><div class="wbar" style="height:110px"></div><div class="wbar" style="height:180px"></div>
      <div class="wbar" style="height:90px"></div><div class="wbar" style="height:140px"></div><div class="wbar" style="height:60px"></div>
    </div>
    <div class="tline"><i></i></div>
    <h1 class="subject">对齐</h1>
    <div class="tag">VOICE = SHOT</div>`,
    anim: `      MV.enter('.wave', { easing: 'power2.out', duration: 800, stagger: 45, from: { opacity: 0, y: 40 } });
      MV.enter('.tline', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.subject', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's23',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#1d1b28 0%,#0a0910 100%); }
  .frame { position:absolute; left:12%; top:17%; width:50%; height:58%; border:4px solid #413a56; box-shadow:inset 0 0 60px rgba(0,0,0,.6); }
  .actor { position:absolute; left:30%; top:26%; width:200px; height:286px; border-radius:100px 100px 20px 20px; background:linear-gradient(180deg,#e8c9a0,#a97c52); box-shadow:0 18px 34px rgba(0,0,0,.55); }
  .card { position:absolute; right:11%; top:24%; padding:18px 30px; border-radius:12px; background:#facc15; color:#1b1307; font-size:46px; transform:rotate(-6deg); box-shadow:0 18px 32px rgba(0,0,0,.55); }
  .shift { position:absolute; right:30%; top:54%; width:130px; height:10px; border-radius:5px; background:#facc15; transform:rotate(18deg); }
  .subject { left:74%; top:76%; transform:translateX(-50%); font-size:100px; color:#fde68a; letter-spacing:.14em; }
  .tag { left:12%; top:80%; font-size:26px; letter-spacing:.4em; color:#8d84a3; }
`,
    body: `    <div class="bg"></div>
    <div class="frame"></div>
    <div class="actor"></div>
    <div class="card">KEY WORD</div>
    <div class="shift"></div>
    <h1 class="subject">让位</h1>
    <div class="tag">CAPTION DODGES</div>`,
    anim: `      MV.enter('.actor', { easing: 'power3.out', duration: 700, from: { opacity: 0, y: 50 } });
      MV.enter('.card', { easing: 'power4.out', duration: 500, delay: 400, from: { opacity: 0, scale: 1.4 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.performance('.card', {});
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's24',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#0a0a0c; }
  .strip { position:absolute; left:4%; top:19%; width:92%; height:52%; display:flex; gap:9px; }
  .cell { flex:1; border:2px solid #3a3a44; background:linear-gradient(160deg,#2a2a30,#121216); }
  .cell.redo { border-color:#f87171; background:linear-gradient(160deg,#6a2020,#2a0d0d); box-shadow:0 0 30px rgba(248,113,113,.42); }
  .cell::after { content:''; position:absolute; inset:18% 22%; border:3px dashed rgba(255,255,255,.14); }
  .sprocket { position:absolute; left:4%; right:4%; top:12%; height:26px; background:repeating-linear-gradient(90deg, #3a3a44 0 18px, transparent 18px 44px); }
  .subject { left:50%; top:84%; transform:translateX(-50%); font-size:100px; color:#fca5a5; letter-spacing:.14em; }
  .tag { left:50%; top:74%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#8d8d99; }
`,
    body: `    <div class="bg"></div>
    <div class="sprocket"></div>
    <div class="strip">
      <div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div>
      <div class="cell redo"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div>
      <div class="cell"></div><div class="cell"></div><div class="cell"></div><div class="cell"></div>
    </div>
    <h1 class="subject">重拍</h1>
    <div class="tag">ONE SHOT ONLY</div>`,
    anim: `      MV.enter('.strip', { easing: 'power2.out', duration: 800, from: { opacity: 0 } });
      MV.enter('.cell.redo', { easing: 'power4.out', duration: 500, from: { opacity: 0, scale: 1.35 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.subject', { duration: 1500 });
      MV.camera('.stage', { move: 'pan', zoom: 'MLS', duration: 6 });`,
  },
];

// s25-s30：逐镜原创场景（周星驰式 · 一本正经地荒诞）
export const scenes = [
  {
    id: 's25',
    beats: 6,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#15181c 0%,#070809 100%); }
  .gates { position:absolute; left:7%; top:15%; width:56%; height:66%; display:flex; flex-wrap:wrap; gap:15px; align-content:flex-start; }
  .lamp { width:70px; height:70px; border-radius:50%; background:radial-gradient(circle at 38% 34%, #63201f, #290b0b); border:5px solid #241012; }
  .lamp.on { background:radial-gradient(circle at 38% 34%, #ff8f85, #dc2626 58%, #7f1d1d); box-shadow:0 0 24px rgba(220,38,38,.75); }
  .door { position:absolute; right:16%; top:23%; width:300px; height:330px; border:14px solid #3a3f46; background:linear-gradient(180deg,#20242a,#0e1013); box-shadow:0 24px 44px rgba(0,0,0,.6); }
  .chain { position:absolute; right:22%; top:43%; width:240px; height:22px; background:repeating-linear-gradient(90deg,#eab308 0 16px,#a16207 16px 32px); transform:rotate(-12deg); }
  .counter { position:absolute; right:17%; top:66%; font-family:Consolas,'Courier New',monospace; font-size:52px; color:#f87171; }
  .subject { left:78%; top:80%; transform:translateX(-50%); font-size:104px; color:#fca5a5; letter-spacing:.14em; }
  .tag { left:7%; top:86%; font-size:26px; letter-spacing:.4em; color:#9ca3af; }
`,
    body: `    <div class="bg"></div>
    <div class="gates">
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
      <div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div><div class="lamp on"></div>
    </div>
    <div class="door"></div>
    <div class="chain"></div>
    <div class="counter">50/50</div>
    <h1 class="subject">红灯</h1>
    <div class="tag">GATE CLOSED</div>`,
    anim: `      MV.enter('.gates', { easing: 'power2.out', duration: 800, from: { opacity: 0 } });
      MV.enter('.chain', { easing: 'power4.out', duration: 500, from: { opacity: 0, scale: 0.5 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.counter', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's26',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#07070a; }
  .posters { position:absolute; left:8%; top:19%; width:84%; display:flex; gap:34px; justify-content:center; }
  .poster { position:relative; width:268px; height:372px; border-radius:8px; background:#14141a; border:6px solid #2b2b34; box-shadow:0 24px 46px rgba(0,0,0,.62); overflow:hidden; }
  .poster.p1 { background:radial-gradient(circle at 50% 40%, #fde68a 5%, #141414 40%, #000 100%); }
  .poster.p2 { background:radial-gradient(circle at 28% 26%, #ffffff 2%, #1b2a6b 38%, #05060f 100%); }
  .poster.p3 { background:linear-gradient(160deg,#3a2412,#0c0708 70%); }
  .stars { position:absolute; inset:0; background-image:radial-gradient(circle, #fff 0 1px, transparent 1.7px); background-size:58px 58px; }
  .kbd2 { position:absolute; left:22%; top:34%; width:56%; height:26%; border-radius:8px; background:linear-gradient(180deg,#2a2c33,#0f1013); box-shadow:0 8px 0 #050607; }
  .subject { left:50%; top:85%; transform:translateX(-50%); font-size:100px; color:#f4e3b6; letter-spacing:.14em; }
  .tag { left:50%; top:20%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#8e8e9c; }
`,
    body: `    <div class="bg"></div>
    <div class="posters">
      <div class="poster p1"></div>
      <div class="poster p2"><div class="stars"></div></div>
      <div class="poster p3"><div class="kbd2"></div></div>
    </div>
    <h1 class="subject">三张海报</h1>
    <div class="tag">THE SAME TOOL</div>`,
    anim: `      MV.enter('.posters', { easing: 'power2.out', duration: 800, stagger: 130, from: { opacity: 0, y: 50 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.poster.p3', { duration: 1500 });
      MV.camera('.stage', { move: 'pull-out', zoom: 'LS', duration: 7 });`,
  },
  {
    id: 's27',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(circle at 50% 28%, #2c2417 0%,#0a0806 74%); }
  .iso { position:absolute; left:50%; top:46%; width:1080px; height:500px; margin-left:-540px; transform:perspective(1100px) rotateX(54deg); background:repeating-linear-gradient(90deg, #322c23 0 90px, #26211a 90px 180px); border:12px solid #4c4030; box-shadow:0 40px 70px rgba(0,0,0,.6); }
  .hut { position:absolute; width:110px; height:80px; background:linear-gradient(180deg,#4a3c26,#241c12); border-radius:6px; }
  .hut::before { content:''; position:absolute; left:-8px; top:-34px; width:126px; height:38px; background:#7a2f22; clip-path:polygon(8% 100%, 92% 100%, 100% 0, 0 0); }
  .lamp3 { position:absolute; width:16px; height:150px; background:#4a4034; }
  .lamp3::after { content:''; position:absolute; left:-22px; top:-26px; width:60px; height:30px; border-radius:8px; background:#fde68a; box-shadow:0 0 34px rgba(253,230,138,.85); }
  .subject { left:50%; top:84%; transform:translateX(-50%); font-size:104px; color:#ffe7a8; letter-spacing:.16em; }
  .tag { left:50%; top:18%; transform:translateX(-50%); font-size:26px; letter-spacing:.44em; color:#b09a6d; }
`,
    body: `    <div class="bg"></div>
    <div class="iso">
      <div class="hut" style="left:120px; top:90px"></div>
      <div class="hut" style="left:420px; top:150px"></div>
      <div class="hut" style="left:700px; top:80px"></div>
      <div class="lamp3" style="left:330px; top:60px"></div>
      <div class="lamp3" style="left:620px; top:40px"></div>
    </div>
    <h1 class="subject">这样的</h1>
    <div class="tag">THE STUDIO</div>`,
    anim: `      MV.enter('.iso', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 0.9 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.idle('.lamp3', { delay: 700 });
      MV.camera('.stage', { move: 'push-in', zoom: 'ELS', duration: 7 });`,
  },
  {
    id: 's28',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#060608; }
  .kbd { position:absolute; left:50%; top:46%; width:940px; height:300px; margin-left:-470px; border-radius:18px; background:linear-gradient(180deg,#23252b,#0d0e11); border:6px solid #3a3d44; box-shadow:0 32px 62px rgba(0,0,0,.72); }
  .key { position:absolute; width:56px; height:56px; border-radius:8px; background:linear-gradient(180deg,#3d414a,#1e2126); box-shadow:0 4px 0 #090a0c; }
  .cmd { position:absolute; left:9%; top:80%; font-family:Consolas,'Courier New',monospace; font-size:38px; color:#4ade80; letter-spacing:.04em; }
  .prompt { position:absolute; left:9%; top:72%; font-family:Consolas,'Courier New',monospace; font-size:30px; color:#64748b; }
  .subject { left:50%; top:22%; transform:translateX(-50%); font-size:104px; color:#e2e8f0; letter-spacing:.16em; }
`,
    body: `    <div class="bg"></div>
    <div class="kbd">
      <div class="key" style="left:40px; top:40px"></div><div class="key" style="left:110px; top:40px"></div>
      <div class="key" style="left:180px; top:40px"></div><div class="key" style="left:250px; top:40px"></div>
      <div class="key" style="left:320px; top:40px"></div><div class="key" style="left:390px; top:40px"></div>
      <div class="key" style="left:460px; top:40px"></div><div class="key" style="left:530px; top:40px"></div>
      <div class="key" style="left:600px; top:40px"></div><div class="key" style="left:670px; top:40px"></div>
      <div class="key" style="left:740px; top:40px"></div><div class="key" style="left:810px; top:40px"></div>
      <div class="key" style="left:75px; top:120px"></div><div class="key" style="left:145px; top:120px"></div>
      <div class="key" style="left:215px; top:120px"></div><div class="key" style="left:285px; top:120px"></div>
      <div class="key" style="left:355px; top:120px"></div><div class="key" style="left:425px; top:120px"></div>
      <div class="key" style="left:495px; top:120px"></div><div class="key" style="left:565px; top:120px"></div>
      <div class="key" style="left:635px; top:120px"></div><div class="key" style="left:705px; top:120px"></div>
      <div class="key" style="left:775px; top:120px"></div><div class="key" style="left:845px; top:120px"></div>
      <div class="key" style="left:110px; top:200px"></div><div class="key" style="left:180px; top:200px"></div>
      <div class="key" style="left:250px; top:200px"></div><div class="key" style="left:320px; top:200px"></div>
      <div class="key" style="left:390px; top:200px"></div><div class="key" style="left:460px; top:200px"></div>
      <div class="key" style="left:530px; top:200px"></div><div class="key" style="left:600px; top:200px"></div>
      <div class="key" style="left:670px; top:200px"></div><div class="key" style="left:740px; top:200px"></div>
    </div>
    <div class="prompt">&gt;</div>
    <div class="cmd">make-video init --style comedy-pop</div>
    <h1 class="subject">键盘</h1>`,
    anim: `      MV.enter('.kbd', { easing: 'power2.out', duration: 800, from: { opacity: 0, y: 60 } });
      MV.enter('.cmd', { easing: 'power3.out', duration: 700, delay: 300, from: { opacity: 0, x: -40 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.subject', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's29',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#2c2210 0%,#0a0805 100%); }
  .spot { position:absolute; left:50%; top:-6%; width:780px; height:88%; transform:translateX(-50%); background:conic-gradient(from 180deg at 50% 0%, transparent 56deg, rgba(255,230,150,.28) 76deg, rgba(255,248,220,.55) 90deg, rgba(255,230,150,.28) 104deg, transparent 124deg); filter:blur(8px); }
  .key1 { position:absolute; left:20%; bottom:13%; width:126px; height:126px; border-radius:16px; background:linear-gradient(180deg,#facc15,#c98b04); box-shadow:0 12px 0 #713f12, 0 26px 36px rgba(0,0,0,.6); }
  .extras { position:absolute; right:9%; bottom:7%; display:flex; gap:20px; align-items:flex-end; }
  .extra { width:78px; height:198px; border-radius:40px 40px 8px 8px; background:#2d2923; box-shadow:0 12px 22px rgba(0,0,0,.6); }
  .subject { left:50%; top:76%; transform:translateX(-50%); font-size:104px; color:#ffe7a8; letter-spacing:.16em; }
  .tag { left:50%; top:20%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#c9a96a; }
`,
    body: `    <div class="bg"></div>
    <div class="spot"></div>
    <div class="key1"></div>
    <div class="extras"><div class="extra"></div><div class="extra"></div><div class="extra"></div><div class="extra"></div></div>
    <h1 class="subject">就位</h1>
    <div class="tag">PRESS ONE KEY</div>`,
    anim: `      MV.enter('.key1', { easing: 'power4.out', duration: 500, from: { opacity: 0, scale: 1.4 } });
      MV.enter('.spot', { easing: 'power2.out', duration: 700, delay: 200, from: { opacity: 0 } });
      MV.enter('.extras', { easing: 'power2.out', duration: 700, stagger: 80, delay: 300, from: { opacity: 0, y: 60 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.key1', { duration: 1400 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MLS', duration: 6 });`,
  },
  {
    id: 's30',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#241a2e 0%,#0a070f 74%); }
  .scissor { position:absolute; right:9%; top:22%; width:340px; height:260px; transform:rotate(-14deg); opacity:.55; }
  .blade { position:absolute; left:96px; top:58px; width:300px; height:20px; border-radius:10px; background:linear-gradient(90deg,#c3ccd6,#6b7280); transform:rotate(9deg); transform-origin:left center; }
  .blade.b2 { top:128px; transform:rotate(-9deg); }
  .hinge { position:absolute; left:70px; top:96px; width:42px; height:42px; border-radius:50%; background:#8b95a1; }
  .ring { position:absolute; left:0; top:66px; width:82px; height:82px; border:15px solid #9aa4b2; border-radius:50%; }
  .ring.r2 { left:18px; top:132px; }
  .qmark { position:absolute; left:40%; top:20%; font-size:300px; font-weight:900; color:#facc15; text-shadow:0 0 60px rgba(250,204,21,.5); }
  .subject { left:28%; top:80%; transform:translateX(-50%); font-size:100px; color:#f4e3b6; letter-spacing:.14em; }
  .tag { left:28%; top:68%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#8e84a3; }
`,
    body: `    <div class="bg"></div>
    <div class="scissor"><div class="blade"></div><div class="blade b2"></div><div class="hinge"></div><div class="ring"></div><div class="ring r2"></div></div>
    <div class="qmark">?</div>
    <h1 class="subject">难在哪</h1>
    <div class="tag">NOT THE CUT</div>`,
    anim: `      MV.enter('.scissor', { easing: 'power2.out', duration: 700, from: { opacity: 0, x: 60 } });
      MV.enter('.qmark', { easing: 'power4.out', duration: 600, from: { opacity: 0, scale: 0.5 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.performance('.qmark', {});
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
];

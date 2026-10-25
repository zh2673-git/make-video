// s01-s12：逐镜原创场景（周星驰式 · 一本正经地荒诞）
import { buildScene } from './scene-base.mjs';

export const scenes = [
  {
    id: 's01',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(ellipse at 68% 26%, #16303f 0%, #0b1418 44%, #05090b 100%); }
  .wall { position:absolute; left:5%; top:13%; width:58%; height:68%; display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(3,1fr); gap:14px; }
  .scr { position:relative; border:1px solid rgba(140,190,210,.26); background:linear-gradient(160deg, rgba(30,58,72,.8), rgba(11,20,26,.92)); box-shadow:inset 0 0 20px rgba(0,0,0,.62); }
  .scr::after { content:''; position:absolute; left:12%; top:16%; width:58%; height:6px; background:rgba(150,200,220,.32); box-shadow:0 18px 0 rgba(150,200,220,.2), 0 36px 0 rgba(150,200,220,.12); }
  .scr.hot { border-color:rgba(255,92,58,.95); background:linear-gradient(160deg, rgba(96,28,18,.92), rgba(28,9,7,.94)); box-shadow:0 0 38px rgba(255,80,50,.42), inset 0 0 20px rgba(0,0,0,.6); }
  .cursor { position:absolute; left:53%; top:49%; width:0; height:0; border-left:20px solid #ffe9a8; border-top:13px solid transparent; border-bottom:13px solid transparent; filter:drop-shadow(0 4px 7px rgba(0,0,0,.75)); }
  .subject { left:73%; top:40%; transform:translate(-50%,-50%); font-size:148px; color:#ffd27a; letter-spacing:.04em; text-shadow:0 0 44px rgba(255,180,80,.42); }
  .tag { left:70%; top:56%; font-size:28px; color:#8fb6c6; }
  .clockring { position:absolute; left:73%; top:40%; width:400px; height:400px; transform:translate(-50%,-50%); border:2px solid rgba(255,210,122,.18); border-radius:50%; }
`,
    body: `    <div class="bg"></div>
    <div class="wall">
      <div class="scr"></div><div class="scr"></div><div class="scr"></div>
      <div class="scr"></div><div class="scr"></div><div class="scr"></div>
      <div class="scr hot"></div>
    </div>
    <div class="cursor"></div>
    <div class="clockring"></div>
    <h1 class="subject">23:47</h1>
    <div class="tag">TIMELINE</div>`,
    anim: `      MV.enter('.wall', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.scr.hot', { easing: 'power3.out', duration: 500, from: { opacity: 0, scale: 1.3 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 1.12 } });
      MV.emphasis('.subject', { duration: 1600 });
      MV.camera('.stage', { move: 'push-in', zoom: 'ECU', duration: 6 });`,
  },
  {
    id: 's02',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#1d1407 0%,#0a0704 100%); }
  .hill { position:absolute; left:-8%; bottom:4%; width:116%; height:60%; background:linear-gradient(160deg,#3d2c13,#171008); clip-path:polygon(0% 100%, 100% 2%, 100% 100%); }
  .boulder { position:absolute; left:49%; bottom:33%; width:200px; height:200px; border-radius:50%; background:radial-gradient(circle at 34% 28%, #737373, #2b2b2b 60%, #111); box-shadow:0 28px 46px rgba(0,0,0,.72); }
  .pusher { position:absolute; left:60%; bottom:19%; width:68px; height:128px; border-radius:34px 34px 8px 8px; background:#3a4a6d; }
  .pusher::before { content:''; position:absolute; left:6px; top:-44px; width:56px; height:54px; border-radius:50%; background:#e6c199; }
  .btn { position:absolute; right:7%; top:11%; padding:16px 32px; font-size:38px; letter-spacing:.24em; color:#22160a; background:linear-gradient(180deg,#ffd764,#dfa416); border-radius:10px; box-shadow:0 9px 0 #8a5f06, 0 20px 30px rgba(0,0,0,.6); }
  .subject { left:50%; top:23%; transform:translate(-50%,-50%); font-size:120px; color:#fde9b4; letter-spacing:.12em; text-shadow:0 6px 0 rgba(0,0,0,.5); }
  .loop { position:absolute; left:16%; top:24%; width:180px; height:180px; border:8px dashed rgba(250,204,21,.5); border-radius:50%; }
`,
    body: `    <div class="bg"></div>
    <div class="hill"></div>
    <div class="boulder"></div>
    <div class="pusher"></div>
    <div class="loop"></div>
    <div class="btn">EXPORT</div>
    <h1 class="subject">再来一次</h1>`,
    anim: `      MV.enter('.hill', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.boulder', { easing: 'power3.out', duration: 600, from: { opacity: 0, y: 60 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.boulder', { duration: 1400 });
      MV.camera('.stage', { move: 'pull-out', zoom: 'LS', duration: 7 });`,
  },
  {
    id: 's03',
    beats: 4,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 16%, #2c2237 0%, #110c15 72%); }
  .row { position:absolute; left:7%; top:24%; width:86%; display:flex; gap:30px; justify-content:center; align-items:flex-end; }
  .face { position:relative; width:180px; height:224px; border-radius:18px; background:linear-gradient(180deg,#efe6d8,#c9bda6); box-shadow:0 18px 34px rgba(0,0,0,.6); }
  .face::before { content:''; position:absolute; left:36px; top:78px; width:32px; height:32px; border-radius:50%; background:#2a2a2a; box-shadow:76px 0 0 #2a2a2a; }
  .face::after { content:''; position:absolute; left:60px; top:148px; width:60px; height:12px; border-radius:7px; background:#7b4b4b; }
  .face.bad { transform:rotate(-8deg) translateY(-14px); background:linear-gradient(180deg,#f9ecc9,#d9c18c); box-shadow:0 18px 34px rgba(0,0,0,.6), 0 0 40px rgba(250,204,21,.35); }
  .face.bad::after { height:26px; top:138px; border-radius:14px; background:#8b3a3a; }
  .subject { left:50%; top:79%; transform:translateX(-50%); font-size:104px; color:#f4e3b6; letter-spacing:.16em; text-shadow:0 4px 0 rgba(0,0,0,.5); }
`,
    body: `    <div class="bg"></div>
    <div class="row">
      <div class="face"></div><div class="face"></div><div class="face"></div>
      <div class="face"></div><div class="face bad"></div>
    </div>
    <h1 class="subject">千篇一律</h1>`,
    anim: `      MV.enter('.row', { easing: 'power2.out', duration: 800, stagger: 90, from: { opacity: 0, y: 50 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.25 } });
      MV.performance('.face.bad', {});
      MV.idle('.face.bad', { delay: 600 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's04',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#140b08 0%,#2a1209 100%); }
  .door { position:absolute; left:31%; top:14%; width:38%; height:72%; }
  .leaf { position:absolute; top:0; width:52%; height:100%; background:linear-gradient(180deg,#4d2c1d,#22130d); border:4px solid #7d4b2b; }
  .leaf.l { left:0; transform:skewY(-9deg); transform-origin:left center; }
  .leaf.r { right:0; transform:skewY(9deg); transform-origin:right center; }
  .beam { position:absolute; left:50%; top:10%; width:360px; height:80%; transform:translateX(-50%); background:conic-gradient(from 180deg at 50% 0%, transparent 60deg, rgba(255,214,120,.26) 76deg, rgba(255,242,198,.48) 90deg, rgba(255,214,120,.26) 104deg, transparent 120deg); filter:blur(9px); }
  .carpet { position:absolute; left:50%; bottom:0; width:46%; height:19%; transform:translateX(-50%); background:linear-gradient(180deg,#bc2418,#6d1009); clip-path:polygon(24% 0,76% 0,100% 100%,0 100%); }
  .subject { left:50%; top:47%; transform:translate(-50%,-50%); font-size:150px; color:#ffe7a8; letter-spacing:.1em; text-shadow:0 0 48px rgba(255,190,90,.55); }
`,
    body: `    <div class="bg"></div>
    <div class="door"><div class="leaf l"></div><div class="leaf r"></div></div>
    <div class="beam"></div>
    <div class="carpet"></div>
    <h1 class="subject">开工</h1>`,
    anim: `      MV.enter('.leaf', { easing: 'power2.out', duration: 800, from: { opacity: 0 } });
      MV.enter('.beam', { easing: 'power2.out', duration: 700, from: { opacity: 0 }, delay: 260 });
      MV.enter('.subject', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 1.3 } });
      MV.emphasis('.subject', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's05',
    beats: 4,
    css: `
  .bg { position:absolute; inset:0; background:#05060a; }
  .spot { position:absolute; left:50%; top:-12%; width:980px; height:124%; transform:translateX(-50%); background:conic-gradient(from 180deg at 50% 0%, transparent 56deg, rgba(255,236,180,.14) 76deg, rgba(255,248,220,.34) 90deg, rgba(255,236,180,.14) 104deg, transparent 124deg); filter:blur(8px); }
  .plate { position:absolute; left:50%; top:45%; transform:translate(-50%,-50%); padding:44px 72px; border:4px solid rgba(250,224,150,.9); background:rgba(8,7,5,.55); box-shadow:0 0 0 10px rgba(250,224,150,.08), 0 0 60px rgba(255,200,120,.18); }
  .subject { left:50%; top:45%; transform:translate(-50%,-50%); font-size:128px; color:#fde9b4; letter-spacing:.14em; text-shadow:0 0 46px rgba(255,190,90,.5); }
  .subline { position:absolute; left:50%; top:63%; transform:translateX(-50%); font-size:32px; letter-spacing:.52em; color:#facc15; opacity:.8; }
  .tag { left:50%; top:20%; transform:translateX(-50%); font-size:26px; letter-spacing:.6em; color:#cbb994; }
`,
    body: `    <div class="bg"></div>
    <div class="spot"></div>
    <div class="plate"></div>
    <h1 class="subject">键盘就是片场</h1>
    <div class="subline">MAKE-VIDEO</div>
    <div class="tag">A FILM BY CODE</div>`,
    anim: `      MV.enter('.spot', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.plate', { easing: 'power3.out', duration: 600, from: { opacity: 0, scale: 1.06 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 800, from: { opacity: 0, scale: 1.16 } });
      MV.emphasis('.subject', { duration: 1600 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 7 });`,
  },
  {
    id: 's06',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(150deg,#1c1307 0%,#0a0705 70%); }
  .machine { position:absolute; right:12%; top:22%; width:430px; height:430px; border-radius:26px; background:linear-gradient(160deg,#58422b,#241a10); box-shadow:0 32px 62px rgba(0,0,0,.72), inset 0 0 0 8px rgba(255,220,150,.07); }
  .gear { position:absolute; border-radius:50%; background:repeating-conic-gradient(#cba25c 0 9deg, #6b4c22 9deg 18deg); }
  .gear.g1 { width:200px; height:200px; left:110px; top:96px; }
  .gear.g2 { width:128px; height:128px; left:330px; top:268px; }
  .slot { position:absolute; left:13%; top:40%; width:190px; height:28px; border-radius:14px; background:#0b0806; box-shadow:inset 0 3px 8px rgba(0,0,0,.9); }
  .paper { position:absolute; left:19%; top:27%; width:250px; height:140px; background:#fdf6e3; transform:rotate(-9deg); box-shadow:0 16px 30px rgba(0,0,0,.55); padding:22px; font-size:26px; color:#3a3126; letter-spacing:.1em; }
  .subject { left:16%; top:76%; transform:translateX(-50%); font-size:116px; color:#ffd98a; letter-spacing:.14em; }
  .tag { left:16%; top:87%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#b99b62; }
`,
    body: `    <div class="bg"></div>
    <div class="machine"><div class="gear g1"></div><div class="gear g2"></div></div>
    <div class="slot"></div>
    <div class="paper">TO: STUDIO</div>
    <h1 class="subject">一句话</h1>
    <div class="tag">ONE LINE IN</div>`,
    anim: `      MV.enter('.machine', { easing: 'power2.out', duration: 700, from: { opacity: 0, scale: 1.05 } });
      MV.enter('.paper', { easing: 'power3.out', duration: 600, from: { opacity: 0, y: -40 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.gear.g1', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's07',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#11161a 0%,#05080a 100%); }
  .plates { position:absolute; left:6%; top:15%; width:58%; display:flex; flex-wrap:wrap; gap:16px; }
  .plate { width:206px; height:92px; border-radius:8px; background:linear-gradient(180deg,#2e343a,#151a1e); border:2px solid rgba(220,190,120,.42); display:flex; align-items:center; justify-content:center; font-size:30px; color:#f0e0b8; letter-spacing:.14em; }
  .stamp { position:absolute; right:11%; top:24%; width:290px; height:290px; border-radius:50%; border:14px solid rgba(200,40,40,.88); transform:rotate(-16deg); display:flex; align-items:center; justify-content:center; font-size:72px; color:rgba(210,50,50,.92); letter-spacing:.14em; box-shadow:0 0 50px rgba(200,40,40,.22); }
  .subject { left:20%; top:70%; transform:translateX(-50%); font-size:104px; color:#f4e3b6; letter-spacing:.1em; }
  .tag { left:20%; top:84%; transform:translateX(-50%); font-size:26px; letter-spacing:.4em; color:#9aa7ad; }
`,
    body: `    <div class="bg"></div>
    <div class="plates">
      <div class="plate">SCRIPT</div><div class="plate">DIRECT</div><div class="plate">ART</div>
      <div class="plate">BUY</div><div class="plate">SOUND</div><div class="plate">EDIT</div>
      <div class="plate">TECH</div>
    </div>
    <div class="stamp">合格</div>
    <h1 class="subject">7 DEPTS</h1>
    <div class="tag">14 PAPERS</div>`,
    anim: `      MV.enter('.plates', { easing: 'power2.out', duration: 800, stagger: 70, from: { opacity: 0, y: 40 } });
      MV.enter('.stamp', { easing: 'power4.out', duration: 500, from: { opacity: 0, scale: 1.6 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.performance('.stamp', {});
      MV.camera('.stage', { move: 'pan-left', zoom: 'MLS', duration: 6 });`,
  },
  {
    id: 's08',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(160deg,#2c1c30 0%,#130c17 72%); }
  .panels { position:absolute; left:6%; top:17%; width:88%; height:60%; display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
  .panel { position:relative; background:#f7efdd; border:7px solid #f3e9d6; box-shadow:0 20px 38px rgba(0,0,0,.55); overflow:hidden; }
  .head { position:absolute; left:50%; top:30%; width:150px; height:150px; margin-left:-75px; border-radius:50%; background:#e3c9a6; }
  .torso { position:absolute; left:50%; bottom:0; width:230px; height:150px; margin-left:-115px; border-radius:60px 60px 0 0; background:#8c8c8c; }
  .bubble { position:absolute; left:50%; top:13%; transform:translateX(-50%); background:#fff; border:4px solid #2b2b2b; border-radius:22px; padding:14px 26px; font-size:34px; color:#2b2b2b; }
  .sweat { position:absolute; width:28px; height:38px; background:radial-gradient(circle at 50% 28%, #d6f0ff, #56a9dd); border-radius:50% 50% 62% 62% / 38% 38% 72% 72%; }
  .subject { left:50%; top:86%; transform:translateX(-50%); font-size:104px; color:#f5d9a8; letter-spacing:.18em; }
`,
    body: `    <div class="bg"></div>
    <div class="panels">
      <div class="panel"><div class="bubble">不懂</div><div class="head"></div><div class="torso"></div><div class="sweat" style="left:70%; top:44%"></div></div>
      <div class="panel"><div class="bubble">不懂</div><div class="head"></div><div class="torso"></div><div class="sweat" style="left:22%; top:48%"></div></div>
      <div class="panel"><div class="bubble">别吵</div><div class="head"></div><div class="torso"></div><div class="sweat" style="left:74%; top:40%"></div></div>
    </div>
    <h1 class="subject">内讧</h1>`,
    anim: `      MV.enter('.panels', { easing: 'power2.out', duration: 800, stagger: 120, from: { opacity: 0, y: 60 } });
      MV.enter('.subject', { easing: 'power4.out', duration: 600, from: { opacity: 0, scale: 1.4 } });
      MV.performance('.panel:nth-child(3)', {});
      MV.idle('.panel:nth-child(1)', { delay: 500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's09',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:linear-gradient(180deg,#2d2011 0%,#0b0805 100%); }
  .crowd { position:absolute; left:0; right:0; bottom:4%; height:40%; display:flex; align-items:flex-end; justify-content:center; gap:22px; }
  .person { width:70px; height:180px; border-radius:36px 36px 6px 6px; background:#2f2b26; box-shadow:0 12px 22px rgba(0,0,0,.6); }
  .slate { position:absolute; left:50%; top:12%; width:520px; height:236px; transform:translateX(-50%) rotate(-2deg); background:#0f1013; border:6px solid #e9dcbe; box-shadow:0 26px 46px rgba(0,0,0,.7); overflow:hidden; }
  .slate::before { content:''; position:absolute; left:-10%; top:34%; width:120%; height:34px; transform:rotate(-8deg); background:repeating-linear-gradient(115deg, #e9dcbe 0 22px, #0f1013 22px 44px); }
  .slate::after { content:''; position:absolute; left:9%; top:12%; width:150px; height:22px; background:#e9dcbe; box-shadow:0 34px 0 #e9dcbe, 0 68px 0 #e9dcbe; }
  .subject { left:50%; top:83%; transform:translateX(-50%); font-size:118px; color:#ffe7a8; letter-spacing:.16em; text-shadow:0 5px 0 rgba(0,0,0,.55); }
`,
    body: `    <div class="bg"></div>
    <div class="crowd">
      <div class="person"></div><div class="person"></div><div class="person"></div>
      <div class="person"></div><div class="person"></div><div class="person"></div>
      <div class="person"></div><div class="person"></div>
    </div>
    <div class="slate"></div>
    <h1 class="subject">开拍</h1>`,
    anim: `      MV.enter('.crowd', { easing: 'power2.out', duration: 800, stagger: 60, from: { opacity: 0, y: 70 } });
      MV.enter('.slate', { easing: 'power4.out', duration: 600, from: { opacity: 0, scale: 1.25 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.18 } });
      MV.emphasis('.subject', { duration: 1600 });
      MV.camera('.stage', { move: 'pull-out', zoom: 'LS', duration: 7 });`,
  },
  {
    id: 's10',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:#080b10; }
  .grid { position:absolute; left:9%; top:16%; width:64%; height:62%; display:grid; grid-template-columns:repeat(14,1fr); grid-template-rows:repeat(8,1fr); gap:6px; }
  .px { background:rgba(120,200,255,.12); border:1px solid rgba(120,200,255,.2); }
  .px.hot { background:rgba(250,204,21,.72); border-color:rgba(250,204,21,.95); box-shadow:0 0 18px rgba(250,204,21,.5); }
  .ban { position:absolute; right:11%; top:24%; width:230px; height:230px; border-radius:50%; border:14px solid rgba(220,38,38,.92); }
  .ban::before { content:''; position:absolute; left:-16%; top:46%; width:132%; height:12px; background:rgba(220,38,38,.92); transform:rotate(-45deg); }
  .ban span { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:52px; color:#fecaca; letter-spacing:.1em; }
  .subject { left:41%; top:87%; transform:translateX(-50%); font-size:110px; color:#fde68a; letter-spacing:.16em; }
  .tag { left:9%; top:82%; font-size:26px; letter-spacing:.4em; color:#6fa8c9; }
`,
    body: `    <div class="bg"></div>
    <div class="grid">
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
      <div class="px hot"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div><div class="px"></div>
    </div>
    <div class="ban"><span>DL</span></div>
    <h1 class="subject">不下载</h1>
    <div class="tag">PIXEL BY PIXEL</div>`,
    anim: `      MV.enter('.grid', { easing: 'power2.out', duration: 700, from: { opacity: 0 } });
      MV.enter('.ban', { easing: 'power4.out', duration: 500, from: { opacity: 0, scale: 1.5 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.performance('.px.hot', {});
      MV.camera('.stage', { move: 'push-in', zoom: 'MS', duration: 6 });`,
  },
  {
    id: 's11',
    beats: 6,
    css: `
  .bg { position:absolute; inset:0; background:#06080b; }
  .code { position:absolute; left:7%; top:14%; width:44%; height:70%; padding:24px 28px; background:rgba(10,20,14,.92); border-left:6px solid #37d67a; font-family:Consolas,'Courier New',monospace; font-size:26px; line-height:1.8; color:#8fe0b2; }
  .ln { opacity:.5; }
  .ln.hot { opacity:1; color:#eaffef; }
  .blob { position:absolute; right:11%; top:26%; width:430px; height:430px; border-radius:46% 54% 60% 40% / 52% 40% 60% 48%; background:radial-gradient(circle at 38% 32%, #fff6cf, #facc15 28%, #dc2626 62%, rgba(220,38,38,0) 74%); box-shadow:0 0 80px rgba(250,204,21,.42); }
  .ring { position:absolute; right:20%; top:36%; width:250px; height:250px; border:5px dashed rgba(255,255,255,.22); border-radius:50%; }
  .subject { left:73%; top:76%; transform:translateX(-50%); font-size:112px; color:#fde68a; letter-spacing:.1em; }
  .tag { left:7%; top:87%; font-size:26px; letter-spacing:.36em; color:#4bbf7d; }
`,
    body: `    <div class="bg"></div>
    <div class="code">
      <div class="ln">const stage = new Stage();</div>
      <div class="ln">stage.light(SPOT);</div>
      <div class="ln">stage.actor(EXTRAS);</div>
      <div class="ln hot">stage.render(CODE);</div>
    </div>
    <div class="ring"></div>
    <div class="blob"></div>
    <h1 class="subject">长出来</h1>
    <div class="tag">NO ASSETS</div>`,
    anim: `      MV.enter('.code', { easing: 'power2.out', duration: 700, from: { opacity: 0, y: 40 } });
      MV.enter('.blob', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 0.7 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.blob', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
  {
    id: 's12',
    beats: 5,
    css: `
  .bg { position:absolute; inset:0; background:radial-gradient(circle at 46% 42%, #2a1d10 0%, #0a0705 72%); }
  .sym { position:absolute; left:44%; top:44%; transform:translate(-50%,-50%); font-size:280px; font-weight:900; color:#fde68a; text-shadow:0 0 60px rgba(253,230,138,.45); }
  .brace { position:absolute; right:12%; top:28%; font-size:210px; color:#4ade80; font-family:Consolas,monospace; text-shadow:0 0 44px rgba(74,222,128,.4); }
  .tag { right:12%; top:70%; font-size:28px; letter-spacing:.34em; color:#6ee7a0; }
  .subject { left:22%; top:76%; transform:translateX(-50%); font-size:106px; color:#fff3c4; letter-spacing:.16em; }
`,
    body: `    <div class="bg"></div>
    <div class="sym">©</div>
    <div class="brace">{ }</div>
    <div class="tag">YOUR SYNTAX</div>
    <h1 class="subject">自己写</h1>`,
    anim: `      MV.enter('.sym', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.3 } });
      MV.exit('.sym', { duration: 400, delay: 900 });
      MV.enter('.brace', { easing: 'power4.out', duration: 500, delay: 1100, from: { opacity: 0, scale: 0.6 } });
      MV.enter('.subject', { easing: 'power3.out', duration: 700, from: { opacity: 0, scale: 1.2 } });
      MV.emphasis('.brace', { duration: 1500 });
      MV.camera('.stage', { move: 'push-in', zoom: 'MCU', duration: 6 });`,
  },
];

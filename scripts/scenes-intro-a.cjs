// 逐镜原创 · 第一幕 s01-s18（痛点钩子 → 方案亮相 → 部门制 → 风格库开场）
// comedy-pop：庄重形式 × trivial 内容；红金暖黑；漫画符号破功；一镜一稿
// 语法：enter/idle/emphasis/performance/camera（camera 由组装器按分镜注入）；位移只用 xPercent/yPercent
const RED = '#dc2626', YEL = '#facc15', CREAM = '#fffbeb', PALE = '#fef08a',
      MID = '#a8a29e', DIM = '#57534e', DEEP = '#1c1917';

module.exports = [
  // s01 定场：双束追光打下，巨幅片名「机会」如大片海报揭幕
  { id: 's01',
    css: `.beam{position:absolute;top:-6%;width:22vmin;height:120%;background:linear-gradient(to bottom,${CREAM}2e,transparent 78%);transform-origin:top center}
.b1{left:18%;transform:rotate(14deg)}.b2{right:18%;transform:rotate(-14deg)}
.floor{position:absolute;left:50%;bottom:8%;width:64vmin;height:10vmin;margin-left:-32vmin;border-radius:50%;background:radial-gradient(ellipse,${RED}30,transparent 70%)}
.subject{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);font-size:26vmin;font-weight:900;color:${CREAM};letter-spacing:3vmin;text-shadow:0 0 6vmin ${RED}88,0 .8vmin 0 ${RED};white-space:nowrap}
.dust{position:absolute;width:.6vmin;height:.6vmin;border-radius:50%;background:${PALE};opacity:.55}`,
    markup: `<div class="beam b1"></div><div class="beam b2"></div><div class="floor"></div>
<div class="dust" style="left:24%;top:30%"></div><div class="dust" style="left:70%;top:24%"></div><div class="dust" style="left:58%;top:66%"></div><div class="dust" style="left:36%;top:72%"></div>
<div class="subject">机会</div>`,
    anim: `MV.enter('.beam',{easing:'power2.out',duration:1600,stagger:200,from:{opacity:0,scaleY:.2}});
MV.enter('.dust',{easing:'sine.out',duration:1600,stagger:160,from:{opacity:0}});
MV.enter('.subject',{easing:'back.out(1.6)',duration:800,from:{opacity:0,scale:1.7}});
MV.emphasis('.subject',{duration:1200});
MV.idle('.beam',{delay:1800});` },

  // s02 通宵之痛：深夜屏幕红光，三根头发飘落，汗滴
  { id: 's02',
    css: `.win{position:absolute;right:10%;top:12%;width:24vmin;height:30vmin;border:1px solid ${DIM};background:linear-gradient(160deg,${DEEP},#0c0a09)}
.moon{position:absolute;left:60%;top:18%;width:7vmin;height:7vmin;border-radius:50%;box-shadow:1.2vmin .6vmin 0 0 ${PALE};opacity:.8}
.subject{position:absolute;left:12%;top:30%;width:44vmin;height:28vmin;border-radius:1.2vmin;border:.5vmin solid ${DIM};background:${DEEP};box-shadow:0 0 9vmin ${RED}40 inset}
.glow{position:absolute;left:12%;top:30%;width:44vmin;height:28vmin;border-radius:1.2vmin;background:radial-gradient(ellipse at 50% 60%,${RED}2b,transparent 70%)}
.hair{position:absolute;width:.5vmin;height:7vmin;border-radius:50%;background:${MID};transform-origin:top center}
.h1{left:30%;top:18%;transform:rotate(-12deg)}.h2{left:33%;top:16%;transform:rotate(4deg)}.h3{left:27%;top:20%;transform:rotate(-24deg)}
.sweat{position:absolute;width:2.2vmin;height:3vmin;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:${YEL};opacity:.85}
.sw1{left:52%;top:26%}.sw2{left:56%;top:22%;width:1.6vmin;height:2.2vmin}`,
    markup: `<div class="win"><div class="moon"></div></div>
<div class="subject"></div><div class="glow"></div>
<div class="hair h1"></div><div class="hair h2"></div><div class="hair h3"></div>
<div class="sweat sw1"></div><div class="sweat sw2"></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:16}});
MV.enter('.win',{easing:'sine.out',duration:800,from:{opacity:0}});
MV.enter('.hair',{easing:'power1.in',duration:1600,stagger:400,from:{yPercent:-260,opacity:0,rotation:-30}});
MV.enter('.sweat',{easing:'power1.in',duration:800,stagger:300,from:{yPercent:-400,opacity:0}});
MV.idle('.glow',{delay:1600});` },

  // s03 上天再给一次：云开裂缝，金光垂落，一卷胶片徐徐而降
  { id: 's03',
    css: `.sky{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0,${DEEP},#0d0b0a 70%)}
.crack{position:absolute;left:50%;top:0;width:2vmin;height:34%;margin-left:-1vmin;background:linear-gradient(to bottom,${PALE},${YEL}00);clip-path:polygon(38% 0,62% 0,88% 100%,12% 100%)}
.shaft{position:absolute;left:50%;top:6%;width:30vmin;height:52%;margin-left:-15vmin;background:linear-gradient(to bottom,${YEL}30,transparent);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);transform-origin:top center}
.subject{position:absolute;left:50%;top:56%;width:18vmin;height:18vmin;margin-left:-9vmin;border-radius:50%;border:1.1vmin solid ${MID};background:${DEEP};box-shadow:0 0 7vmin ${YEL}33}
.hole{position:absolute;top:50%;width:3.4vmin;height:3.4vmin;margin-top:-1.7vmin;border-radius:50%;background:#0d0b0a}
.ha{left:12%}.hb{left:43%}.hc{right:12%}
.cloud{position:absolute;width:26vmin;height:8vmin;border-radius:8vmin;background:${DEEP}}
.c1{left:4%;top:10%}.c2{right:4%;top:14%}`,
    markup: `<div class="sky"></div><div class="cloud c1"></div><div class="cloud c2"></div>
<div class="crack"></div><div class="shaft"></div>
<div class="subject"><i class="hole ha"></i><i class="hole hb"></i><i class="hole hc"></i></div>`,
    anim: `MV.enter('.crack',{easing:'power2.inOut',duration:600,from:{scaleY:0,transformOrigin:'top center'}});
MV.enter('.shaft',{easing:'sine.out',duration:1200,from:{opacity:0,scaleY:.2}});
MV.enter('.subject',{easing:'expo.out',duration:1600,from:{yPercent:-160,opacity:0}});
MV.idle('.subject',{delay:1600});` },

  // s04 红色大按钮：键盘特写，一枚红键发光——「拍」
  { id: 's04',
    css: `.keys{position:absolute;inset:0;background-image:linear-gradient(${DEEP} 0 0);opacity:.9}
.subject{position:absolute;left:50%;top:48%;width:34vmin;height:34vmin;margin:-17vmin 0 0 -17vmin;border-radius:3vmin;background:linear-gradient(170deg,${RED},#7f1d1d);box-shadow:0 2vmin 0 #7f1d1d,0 0 12vmin ${RED}66;display:flex;align-items:center;justify-content:center;font-size:16vmin;font-weight:900;color:${CREAM}}
.cap{position:absolute;left:16%;top:20%;width:10vmin;height:10vmin;border-radius:1.4vmin;border:1px solid ${DIM};background:${DEEP}}
.cp1{left:14%;top:14%}.cp2{left:28%;top:14%}.cp3{left:42%;top:14%}.cp4{left:14%;top:30%}.cp5{left:28%;top:30%}
.spark{position:absolute;width:1.2vmin;height:1.2vmin;background:${YEL};border-radius:50%}
.sp1{left:22%;top:26%}.sp2{left:74%;top:30%}.sp3{left:66%;top:70%}`,
    markup: `<div class="keys"></div>
<div class="cap cp1"></div><div class="cap cp2"></div><div class="cap cp3"></div><div class="cap cp4"></div><div class="cap cp5"></div>
<div class="subject">拍</div>
<div class="spark sp1"></div><div class="spark sp2"></div><div class="spark sp3"></div>`,
    anim: `MV.enter('.cap',{easing:'power2.out',duration:600,stagger:90,from:{opacity:0,scale:.6}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,from:{opacity:0,scale:.3,yPercent:40}});
MV.enter('.spark',{easing:'sine.out',duration:400,stagger:120,from:{opacity:0,scale:0}});
MV.emphasis('.subject',{duration:1600});` },

  // s05 揭幕：黑场光扫，放映机之眼睁开
  { id: 's05',
    css: `.sweep{position:absolute;inset:0;background:linear-gradient(105deg,transparent 34%,${CREAM}1f 50%,transparent 66%)}
.ring{position:absolute;left:38%;top:50%;border-radius:50%;border:2px solid ${MID};transform:translate(-50%,-50%)}
.r1{width:26vmin;height:26vmin}.r2{width:34vmin;height:34vmin;border-color:${DIM}}
.pupil{position:absolute;left:38%;top:50%;width:12vmin;height:12vmin;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 40% 38%,${PALE},${YEL} 46%,${RED} 78%);box-shadow:0 0 10vmin ${YEL}55}
.subject{position:absolute;left:38%;top:50%;width:42vmin;height:42vmin;transform:translate(-50%,-50%);border-radius:50%;box-shadow:0 0 16vmin ${YEL}26}
.lens{position:absolute;left:56%;top:56%;width:1.6vmin;height:64%;background:linear-gradient(to bottom,${YEL}55,transparent);transform-origin:top center;transform:rotate(24deg)}
.tag{position:absolute;right:14%;top:24%;font-size:5vmin;font-weight:900;color:${YEL};letter-spacing:1vmin;opacity:.9}`,
    markup: `<div class="sweep"></div><div class="ring r2"></div><div class="ring r1"></div>
<div class="subject"></div><div class="pupil"></div><div class="lens"></div><div class="tag">MV</div>`,
    anim: `MV.enter('.sweep',{easing:'sine.inOut',duration:2000,from:{opacity:0,xPercent:-40}});
MV.enter('.pupil',{easing:'back.out(1.8)',duration:600,from:{opacity:0,scale:.2}});
MV.enter('.lens',{easing:'power2.out',duration:1200,from:{scaleY:0}});
MV.enter('.tag',{easing:'back.out(2.2)',duration:600,delay:1200,from:{opacity:0,scale:.4,rotation:-10}});
MV.idle('.pupil',{delay:1800});` },

  // s06 投入主题，吐出电影：漏斗机器
  { id: 's06',
    css: `.subject{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);width:0;height:0;border-left:22vmin solid transparent;border-right:22vmin solid transparent;border-top:26vmin solid ${DEEP};border-bottom:0;filter:drop-shadow(0 0 4vmin ${RED}33)}
.rim{position:absolute;left:50%;top:33%;width:46vmin;height:3vmin;margin-left:-23vmin;border-radius:2vmin;background:${DIM}}
.cube{position:absolute;left:50%;top:12%;width:8vmin;height:8vmin;margin-left:-4vmin;background:${YEL};border-radius:1vmin}
.strip{position:absolute;left:50%;top:66%;width:40vmin;height:9vmin;margin-left:-20vmin;background:${DEEP};border:1px solid ${DIM};border-radius:.8vmin;
background-image:repeating-linear-gradient(90deg,transparent 0 6vmin,#0d0b0a 6vmin 8.6vmin)}
.frame2{position:absolute;top:1.2vmin;width:4.4vmin;height:6.4vmin;border-radius:.4vmin;background:${RED}}
.f2a{left:7vmin}.f2b{left:17vmin}.f2c{left:27vmin}`,
    markup: `<div class="rim"></div><div class="subject"></div><div class="cube"></div>
<div class="strip"><div class="frame2 f2a"></div><div class="frame2 f2b"></div><div class="frame2 f2c"></div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:800,from:{opacity:0,yPercent:-30}});
MV.enter('.rim',{easing:'power2.out',duration:600,from:{opacity:0,scaleX:.4}});
MV.enter('.cube',{easing:'expo.in',duration:1200,delay:600,from:{yPercent:-260,rotation:180}});
MV.enter('.strip',{easing:'power3.out',duration:800,delay:1600,from:{opacity:0,scaleX:.2}});
MV.idle('.cube',{delay:2200});` },

  // s07 三根歪理柱倒下，大问号登场
  { id: 's07',
    css: `.pillar{position:absolute;bottom:16%;width:9vmin;height:40vmin;border-radius:1vmin;background:${DEEP};border:1px solid ${DIM};display:flex;align-items:flex-start;justify-content:center;padding-top:2vmin;font-size:4.6vmin;font-weight:800;color:${MID}}
.p1{left:16%}.p2{left:42%}.p3{right:16%}
.subject{position:absolute;left:50%;top:34%;transform:translate(-50%,-50%);font-size:34vmin;font-weight:900;color:${YEL};text-shadow:0 0 8vmin ${RED}66}
.base{position:absolute;bottom:12%;left:50%;width:76vmin;height:2.4vmin;margin-left:-38vmin;border-radius:1vmin;background:${DIM}}`,
    markup: `<div class="base"></div>
<div class="pillar p1">灵感</div><div class="pillar p2">玄学</div><div class="pillar p3">改稿</div>
<div class="subject">?</div>`,
    anim: `MV.enter('.pillar',{easing:'power2.in',duration:800,stagger:220,from:{opacity:0,rotation:18,yPercent:26}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,delay:900,from:{opacity:0,scale:.2}});
MV.emphasis('.subject',{duration:1600});
MV.idle('.pillar',{delay:1600});` },

  // s08 唯一真源：圣光下的卷轴
  { id: 's08',
    css: `.pillar2{position:absolute;left:50%;top:0;width:26vmin;height:70%;margin-left:-13vmin;background:linear-gradient(to bottom,${PALE}24,transparent);clip-path:polygon(24% 0,76% 0,100% 100%,0 100%)}
.subject{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%) rotate(-4deg);width:52vmin;height:20vmin;background:linear-gradient(180deg,${CREAM},${PALE});border-radius:1.2vmin;box-shadow:0 1.6vmin 0 ${DIM},0 0 10vmin ${YEL}44;display:flex;align-items:center;justify-content:center}
.rod{position:absolute;top:-2.4vmin;width:56vmin;height:2.6vmin;margin-left:-2vmin;border-radius:2vmin;background:${RED}}
.rb{bottom:-2.4vmin;top:auto}
.seal8{position:absolute;right:6vmin;bottom:3vmin;width:6.4vmin;height:6.4vmin;border-radius:.8vmin;background:${RED};opacity:.88;transform:rotate(8deg)}
.line8{position:absolute;left:6vmin;top:6vmin;width:22vmin;height:1.1vmin;border-radius:1vmin;background:${DEEP};opacity:.5}
.l2{top:10.4vmin;width:14vmin}`,
    markup: `<div class="pillar2"></div>
<div class="subject"><div class="rod"></div><div class="rod rb"></div><div class="line8"></div><div class="line8 l2"></div><div class="seal8"></div></div>`,
    anim: `MV.enter('.pillar2',{easing:'sine.out',duration:1200,from:{opacity:0,scaleY:.3,transformOrigin:'top center'}});
MV.enter('.subject',{easing:'expo.out',duration:1600,from:{yPercent:-120,opacity:0,rotation:6}});
MV.enter('.seal8',{easing:'power2.in',duration:400,delay:1400,from:{opacity:0,scale:2.4}});
MV.idle('.subject',{delay:1700});` },

  // s09 圣玺盖章：真
  { id: 's09',
    css: `.ped{position:absolute;left:50%;bottom:14%;width:44vmin;height:6vmin;margin-left:-22vmin;border-radius:1.4vmin;background:${DIM}}
.subject{position:absolute;left:50%;top:40%;width:26vmin;height:26vmin;margin:-13vmin 0 0 -13vmin;border-radius:2.4vmin;background:linear-gradient(165deg,${RED},#7f1d1d);box-shadow:0 0 12vmin ${RED}55;display:flex;align-items:center;justify-content:center;font-size:14vmin;font-weight:900;color:${CREAM}}
.ring9{position:absolute;left:50%;top:62%;border:2px solid ${YEL};border-radius:50%;transform:translate(-50%,-50%)}
.r9a{width:12vmin;height:12vmin}.r9b{width:22vmin;height:22vmin;opacity:.6}
.mark9{position:absolute;left:50%;top:62%;transform:translate(-50%,-50%);width:30vmin;height:30vmin;border-radius:2vmin;border:.5vmin solid ${RED};opacity:.35}`,
    markup: `<div class="ped"></div><div class="mark9"></div>
<div class="ring9 r9b"></div><div class="ring9 r9a"></div><div class="subject">真</div>`,
    anim: `MV.enter('.subject',{easing:'expo.in',duration:800,from:{yPercent:-160,rotation:-8}});
MV.enter('.ring9',{easing:'power2.out',duration:600,delay:600,stagger:160,from:{opacity:0,scale:.2}});
MV.enter('.mark9',{easing:'power2.out',duration:800,delay:800,from:{opacity:0,scale:1.6}});
MV.emphasis('.subject',{duration:1600});` },

  // s10 走进片场大门：双门开启，灯泡跑马
  { id: 's10',
    css: `.arch{position:absolute;left:50%;top:16%;width:60vmin;height:56vmin;transform:translateX(-50%);border:.8vmin solid ${DIM};border-bottom:none;border-radius:30vmin 30vmin 0 0}
.door{position:absolute;bottom:0;width:28vmin;height:52vmin;background:linear-gradient(180deg,${DEEP},#0d0b0a);border:1px solid ${DIM}}
.dl{left:1.6vmin;transform-origin:left center}.dr{right:1.6vmin;transform-origin:right center}
.sign10{position:absolute;left:50%;top:8%;transform:translateX(-50%);padding:1vmin 3vmin;border-radius:1vmin;background:${RED};color:${CREAM};font-size:4.4vmin;font-weight:900;letter-spacing:1.4vmin;box-shadow:0 .6vmin 0 #7f1d1d}
.bulb{position:absolute;width:1.4vmin;height:1.4vmin;border-radius:50%;background:${YEL};box-shadow:0 0 2vmin ${YEL}}
.b1{left:16%;top:34%}.b2{left:13%;top:48%}.b3{right:16%;top:34%}.b4{right:13%;top:48%}.b5{left:20%;top:22%}.b6{right:20%;top:22%}
.glow10{position:absolute;left:50%;bottom:0;width:56vmin;height:30vmin;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 100%,${PALE}22,transparent 70%)}`,
    markup: `<div class="glow10"></div><div class="arch subject">
<div class="door dl"></div><div class="door dr"></div></div>
<div class="sign10">片场</div>
<div class="bulb b1"></div><div class="bulb b2"></div><div class="bulb b3"></div><div class="bulb b4"></div><div class="bulb b5"></div><div class="bulb b6"></div>`,
    anim: `MV.enter('.door',{easing:'power2.inOut',duration:1600,stagger:200,from:{scaleX:.12}});
MV.enter('.sign10',{easing:'back.out(2.2)',duration:600,from:{opacity:0,scale:.5,yPercent:-60}});
MV.enter('.bulb',{easing:'sine.out',duration:400,stagger:120,from:{opacity:0}});
MV.idle('.bulb',{delay:1400});` },

  // s11 编剧落档：毛笔与成卷的稿纸
  { id: 's11',
    css: `.paper{position:absolute;left:16%;top:22%;width:42vmin;height:54vmin;background:linear-gradient(180deg,${CREAM},${PALE});border-radius:1vmin;box-shadow:1vmin 1.4vmin 0 ${DIM};transform:rotate(-3deg)}
.line11{position:absolute;left:5vmin;height:1vmin;border-radius:1vmin;background:${DEEP};opacity:.42}
.l1{top:9vmin;width:30vmin}.l2{top:15vmin;width:24vmin}.l3{top:21vmin;width:28vmin}.l4{top:27vmin;width:18vmin}.l5{top:33vmin;width:26vmin}
.subject{position:absolute;right:20%;top:16%;width:4vmin;height:52vmin;border-radius:2vmin;background:linear-gradient(180deg,#8a5a2b,${DEEP});transform:rotate(24deg);transform-origin:bottom center}
.tip11{position:absolute;right:18.4%;top:12.6%;width:7vmin;height:9vmin;border-radius:50% 50% 50% 50%/40% 40% 60% 60%;background:${DEEP};transform:rotate(24deg)}
.drop11{position:absolute;left:46%;top:38%;width:2.6vmin;height:3.4vmin;border-radius:50%/60% 60% 40% 40%;background:${DEEP};opacity:.85}`,
    markup: `<div class="paper"><div class="line11 l1"></div><div class="line11 l2"></div><div class="line11 l3"></div><div class="line11 l4"></div><div class="line11 l5"></div></div>
<div class="subject"></div><div class="tip11"></div><div class="drop11"></div>`,
    anim: `MV.enter('.paper',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:24,rotation:-8}});
MV.enter('.subject',{easing:'power2.inOut',duration:1200,from:{rotation:-24,yPercent:-30}});
MV.enter('.tip11',{easing:'power2.inOut',duration:1200,from:{rotation:-24,yPercent:-30,opacity:0}});
MV.enter('.drop11',{easing:'power1.in',duration:600,delay:1100,from:{opacity:0,scale:0}});
MV.idle('.subject',{delay:1600});` },

  // s12 导演批分镜：场记板打响
  { id: 's12',
    css: `.frames{position:absolute;right:8%;top:14%;width:34vmin;height:44vmin;opacity:.5;
background-image:linear-gradient(${DIM} 1px,transparent 1px),linear-gradient(90deg,${DIM} 1px,transparent 1px);background-size:17vmin 15vmin}
.subject{position:absolute;left:14%;top:30%;width:52vmin;height:36vmin}
.bar12{position:absolute;left:0;top:0;width:100%;height:9vmin;border-radius:1vmin;background:repeating-linear-gradient(90deg,${CREAM} 0 7vmin,${DEEP} 7vmin 14vmin);transform-origin:left bottom}
.body12{position:absolute;left:0;bottom:0;width:100%;height:28vmin;border-radius:1vmin;background:${DEEP};border:1px solid ${DIM}}
.stripe12{position:absolute;left:4vmin;bottom:6vmin;width:30vmin;height:2.4vmin;border-radius:1vmin;background:${MID};opacity:.7}
.s2{bottom:12vmin;width:20vmin}
.snap12{position:absolute;left:6%;top:22%;font-size:8vmin;color:${YEL};font-weight:900;opacity:0}`,
    markup: `<div class="frames"></div>
<div class="subject"><div class="body12"></div><div class="stripe12"></div><div class="stripe12 s2"></div><div class="bar12"></div></div>
<div class="snap12">!</div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.85}});
MV.enter('.bar12',{easing:'power2.in',duration:400,delay:1000,from:{rotation:-38}});
MV.enter('.snap12',{easing:'back.out(2.2)',duration:300,delay:1400,from:{opacity:0,scale:2.4}});
MV.emphasis('.snap12',{duration:1200});` },

  // s13 美术与采购：调色盘与手推车
  { id: 's13',
    css: `.subject{position:absolute;left:18%;top:26%;width:38vmin;height:30vmin;border-radius:50% 50% 50% 4vmin;background:${CREAM};box-shadow:1vmin 1.2vmin 0 ${DIM};transform:rotate(-6deg)}
.dot13{position:absolute;width:5.4vmin;height:5.4vmin;border-radius:50%}
.d1{left:7vmin;top:6vmin;background:${RED}}.d2{left:15vmin;top:4.4vmin;background:${YEL}}.d3{left:23vmin;top:7vmin;background:${DIM}}
.hole13{position:absolute;right:7vmin;bottom:5vmin;width:6vmin;height:6vmin;border-radius:50%;background:#141110}
.cart{position:absolute;right:10%;top:38%;width:36vmin;height:20vmin;border:1px solid ${DIM};border-radius:1vmin;background:${DEEP}}
.wheel13{position:absolute;bottom:-4vmin;width:8vmin;height:8vmin;border-radius:50%;border:1.4vmin solid ${MID};background:transparent}
.w1{left:4vmin}.w2{right:4vmin}
.handle13{position:absolute;right:-8vmin;top:2vmin;width:10vmin;height:1.6vmin;border-radius:1vmin;background:${MID};transform:rotate(-24deg)}
.t13{position:absolute;left:8vmin;top:5vmin;width:14vmin;height:8vmin;border-radius:.8vmin;background:${RED};opacity:.9}
.t2{left:24vmin;top:7vmin;background:${YEL};width:8vmin}`,
    markup: `<div class="subject"><div class="dot13 d1"></div><div class="dot13 d2"></div><div class="dot13 d3"></div><div class="hole13"></div></div>
<div class="cart"><div class="t13"></div><div class="t13 t2"></div><div class="wheel13 w1"></div><div class="wheel13 w2"></div><div class="handle13"></div></div>`,
    anim: `MV.enter('.subject',{easing:'back.out(1.6)',duration:800,from:{opacity:0,scale:.6,rotation:-18}});
MV.enter('.dot13',{easing:'back.out(2.2)',duration:400,stagger:140,from:{opacity:0,scale:0}});
MV.enter('.cart',{easing:'power2.out',duration:800,delay:700,from:{xPercent:24,opacity:0}});
MV.idle('.cart',{delay:1500});` },

  // s14 声音与剪辑：麦克风与剪刀
  { id: 's14',
    css: `.subject{position:absolute;left:34%;top:20%;width:14vmin;height:22vmin;border-radius:7vmin;background:linear-gradient(180deg,${MID},${DIM});box-shadow:0 0 6vmin ${YEL}22}
.grill14{position:absolute;left:34%;top:20%;width:14vmin;height:10vmin;border-radius:7vmin 7vmin 2vmin 2vmin;background:repeating-linear-gradient(0deg,${DEEP} 0 1vmin,transparent 1vmin 2.2vmin);opacity:.5}
.stem14{position:absolute;left:40%;top:42%;width:2vmin;height:16vmin;border-radius:1vmin;background:${DIM}}
.base14{position:absolute;left:35%;top:58%;width:12vmin;height:2.4vmin;border-radius:1.2vmin;background:${DIM}}
.arc14{position:absolute;border:.5vmin solid ${YEL};border-radius:50%;opacity:.6}
.a1{left:27%;top:16%;width:8vmin;height:12vmin;border-right:none;border-top-color:transparent;border-bottom-color:transparent}
.a2{left:23%;top:12%;width:14vmin;height:20vmin;border-right:none;border-top-color:transparent;border-bottom-color:transparent}
.cut14{position:absolute;right:18%;top:34%;width:26vmin;height:6vmin}
.blade14{position:absolute;left:0;top:2vmin;width:22vmin;height:1.6vmin;border-radius:1vmin;background:${MID};transform-origin:right center}
.b2{transform:rotate(24deg)}
.loop14{position:absolute;right:14%;top:30%;width:6vmin;height:6vmin;border-radius:50%;border:1.2vmin solid ${RED}}
.l2b{right:14%;top:34%;border-color:${YEL}}`,
    markup: `<div class="subject"></div><div class="grill14"></div><div class="stem14"></div><div class="base14"></div>
<div class="arc14 a1"></div><div class="arc14 a2"></div>
<div class="cut14"><div class="blade14"></div><div class="blade14 b2"></div></div>
<div class="loop14"></div><div class="loop14 l2b"></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.7}});
MV.enter('.arc14',{easing:'sine.out',duration:800,stagger:200,from:{opacity:0,scaleX:.2,transformOrigin:'left center'}});
MV.enter('.cut14',{easing:'back.out(2.2)',duration:600,delay:800,from:{opacity:0,rotation:-30}});
MV.enter('.loop14',{easing:'back.out(2.2)',duration:400,stagger:120,delay:1100,from:{opacity:0,scale:0}});
MV.idle('.subject',{delay:1600});` },

  // s15 工程部开炉：熔炉烧出 MP4
  { id: 's15',
    css: `.subject{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);width:44vmin;height:34vmin;border-radius:6vmin 6vmin 2vmin 2vmin;background:linear-gradient(180deg,${DIM},${DEEP});box-shadow:0 0 8vmin ${RED}22}
.mouth15{position:absolute;left:50%;top:60%;width:20vmin;height:14vmin;transform:translate(-50%,-50%);border-radius:10vmin 10vmin 0 0;background:radial-gradient(ellipse at 50% 70%,${YEL},${RED} 70%)}
.chim15{position:absolute;left:22%;top:16%;width:7vmin;height:24vmin;border-radius:1vmin;background:${DIM}}
.smoke15{position:absolute;width:6vmin;height:6vmin;border-radius:50%;background:${MID};opacity:.35}
.sm1{left:21%;top:8%}.sm2{left:25%;top:2%}
.badge15{position:absolute;right:16%;top:30%;padding:1.2vmin 2.4vmin;border-radius:1vmin;background:${YEL};color:${DEEP};font-size:5.6vmin;font-weight:900;box-shadow:0 .8vmin 0 #a16207}
.flame15{position:absolute;width:0;height:0;border-left:2vmin solid transparent;border-right:2vmin solid transparent;border-bottom:4.6vmin solid ${YEL};opacity:.9}
.f1{left:30%;top:36%}.f2{left:47%;top:32%}.f3{left:64%;top:37%}`,
    markup: `<div class="chim15"></div><div class="smoke15 sm1"></div><div class="smoke15 sm2"></div>
<div class="subject"><div class="mouth15"></div></div>
<div class="flame15 f1"></div><div class="flame15 f2"></div><div class="flame15 f3"></div>
<div class="badge15">MP4</div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.8}});
MV.enter('.flame15',{easing:'sine.out',duration:400,stagger:140,from:{opacity:0,scaleY:.2,transformOrigin:'bottom center'}});
MV.enter('.badge15',{easing:'back.out(2.2)',duration:600,delay:1000,from:{opacity:0,scale:.2,rotation:-12}});
MV.emphasis('.mouth15',{duration:1600});
MV.idle('.flame15',{delay:1400});` },

  // s16 七部十四件：巨字「七」与工牌墙
  { id: 's16',
    css: `.subject{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font-size:40vmin;font-weight:900;color:${CREAM};text-shadow:0 0 5vmin ${RED}77,0 1vmin 0 ${RED}}
.tag16{position:absolute;width:8vmin;height:11vmin;border-radius:1vmin;border:1px solid ${DIM};background:${DEEP}}
.t16a{top:6vmin}.t16b{bottom:8vmin}
.p1{left:8%}.p2{left:20%}.p3{left:32%}.p4{left:44%}.p5{left:56%}.p6{left:68%}.p7{left:80%}
.stamp16{position:absolute;left:50%;top:50%;width:4vmin;height:4vmin;margin:-2vmin 0 0 -2vmin;border-radius:.6vmin;background:${RED};opacity:.85}`,
    markup: `<div class="subject">七</div>
<div class="tag16 t16a p1"><div class="stamp16"></div></div><div class="tag16 t16a p2"><div class="stamp16"></div></div><div class="tag16 t16a p3"><div class="stamp16"></div></div><div class="tag16 t16a p4"><div class="stamp16"></div></div><div class="tag16 t16a p5"><div class="stamp16"></div></div><div class="tag16 t16a p6"><div class="stamp16"></div></div><div class="tag16 t16a p7"><div class="stamp16"></div></div>
<div class="tag16 t16b p1"><div class="stamp16"></div></div><div class="tag16 t16b p2"><div class="stamp16"></div></div><div class="tag16 t16b p3"><div class="stamp16"></div></div><div class="tag16 t16b p4"><div class="stamp16"></div></div><div class="tag16 t16b p5"><div class="stamp16"></div></div><div class="tag16 t16b p6"><div class="stamp16"></div></div><div class="tag16 t16b p7"><div class="stamp16"></div></div>`,
    anim: `MV.enter('.subject',{easing:'back.out(1.8)',duration:800,from:{opacity:0,scale:1.8}});
MV.enter('.tag16',{easing:'power2.out',duration:800,stagger:90,from:{opacity:0,yPercent:40}});
MV.emphasis('.subject',{duration:1600});
MV.idle('.tag16',{delay:1600});` },

  // s17 交接如菜牌：一排木牌整齐盖红章
  { id: 's17',
    css: `.rail17{position:absolute;left:10%;right:10%;top:22%;height:1.2vmin;border-radius:1vmin;background:${DIM}}
.subject{position:absolute;left:50%;top:24%;width:12vmin;height:16vmin;transform:translateX(-50%);background:${CREAM};border-radius:1vmin;box-shadow:.6vmin .8vmin 0 ${DIM}}
.card17{position:absolute;top:2vmin;width:12vmin;height:16vmin;border-radius:1vmin;background:${CREAM};box-shadow:.6vmin .8vmin 0 ${DIM}}
.string17{position:absolute;top:-3.4vmin;left:50%;width:.5vmin;height:3.6vmin;margin-left:-.25vmin;background:${MID}}
.st17{position:absolute;left:50%;bottom:2.4vmin;width:5vmin;height:5vmin;margin-left:-2.5vmin;border-radius:.6vmin;background:${RED};opacity:.88;transform:rotate(10deg)}
.c1{left:-42vmin}.c2{left:-28vmin}.c3{left:-14vmin}.c4{left:14vmin}.c5{left:28vmin}.c6{left:42vmin}`,
    markup: `<div class="rail17"></div>
<div class="card17 c1"><div class="string17"></div><div class="st17"></div></div>
<div class="card17 c2"><div class="string17"></div><div class="st17"></div></div>
<div class="card17 c3"><div class="string17"></div><div class="st17"></div></div>
<div class="subject"><div class="string17"></div><div class="st17"></div></div>
<div class="card17 c4"><div class="string17"></div><div class="st17"></div></div>
<div class="card17 c5"><div class="string17"></div><div class="st17"></div></div>
<div class="card17 c6"><div class="string17"></div><div class="st17"></div></div>`,
    anim: `MV.enter('.card17',{easing:'back.out(1.8)',duration:600,stagger:140,from:{opacity:0,yPercent:-46}});
MV.enter('.subject',{easing:'power2.out',duration:600,stagger:140,from:{opacity:0,yPercent:-46}});
MV.emphasis('.subject',{duration:1200});
MV.idle('.card17',{delay:1400});` },

  // s18 观众席发问：一只手举起，气泡弹入「星爷？」
  { id: 's18',
    css: `.row18{position:absolute;bottom:10%;left:50%;transform:translateX(-50%);display:flex;gap:3vmin}
.seat18{width:11vmin;height:9vmin;border-radius:2vmin 2vmin .6vmin .6vmin;background:${DEEP};border:1px solid ${DIM}}
.hand18{position:absolute;left:62%;bottom:18%;width:3vmin;height:16vmin;border-radius:1.6vmin;background:${MID};transform-origin:bottom center;transform:rotate(-14deg)}
.palm18{position:absolute;left:61%;bottom:31%;width:5vmin;height:4.6vmin;border-radius:2vmin;background:${MID}}
.subject{position:absolute;left:66%;top:18%;padding:2vmin 3vmin;border-radius:3vmin;background:${CREAM};color:${DEEP};font-size:5.6vmin;font-weight:900;box-shadow:.8vmin 1vmin 0 ${DIM}}
.tail18{position:absolute;left:-3vmin;bottom:-2vmin;width:4vmin;height:4vmin;background:${CREAM};clip-path:polygon(0 100%,100% 0,60% 100%)}`,
    markup: `<div class="row18"><div class="seat18"></div><div class="seat18"></div><div class="seat18"></div><div class="seat18"></div></div>
<div class="hand18"></div><div class="palm18"></div>
<div class="subject">星爷？<div class="tail18"></div></div>`,
    anim: `MV.enter('.seat18',{easing:'power2.out',duration:600,stagger:120,from:{opacity:0,yPercent:40}});
MV.enter('.hand18',{easing:'back.out(2.2)',duration:600,delay:700,from:{rotation:-70,transformOrigin:'bottom center'}});
MV.enter('.palm18',{easing:'back.out(2.2)',duration:600,delay:700,from:{opacity:0,yPercent:30}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:600,delay:1200,from:{opacity:0,scale:.2}});
MV.emphasis('.subject',{duration:1600});` },
];

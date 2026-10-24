// 逐镜原创 · 第三幕 s37-s54（时间真源 → 王法闸门 → 渲染开炉 → 真心收尾）
const RED = '#dc2626', YEL = '#facc15', CREAM = '#fffbeb', PALE = '#fef08a',
      MID = '#a8a29e', DIM = '#57534e', DEEP = '#1c1917';

module.exports = [
  // s37 实测时长：秒表称旁白
  { id: 's37',
    css: `.subject{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:34vmin;height:34vmin;border-radius:50%;border:1.4vmin solid ${CREAM};background:radial-gradient(circle at 40% 36%,${DEEP},#0d0b0a);box-shadow:0 0 10vmin ${PALE}18}
.crown37{position:absolute;left:50%;top:calc(50% - 21vmin);width:5vmin;height:4vmin;transform:translateX(-50%);border-radius:1vmin 1vmin 0 0;background:${MID}}
.hand37{position:absolute;left:50%;top:50%;width:.9vmin;height:14vmin;margin-left:-.45vmin;border-radius:.6vmin;background:${RED};transform-origin:50% 100%}
.pin37{position:absolute;left:50%;top:50%;width:2.6vmin;height:2.6vmin;transform:translate(-50%,-50%);border-radius:50%;background:${YEL}}
.wave37{position:absolute;bottom:12%;left:50%;transform:translateX(-50%);display:flex;gap:1.2vmin;align-items:flex-end;height:8vmin}
.bar37{width:1.6vmin;border-radius:.8vmin;background:${YEL};opacity:.75}`,
    markup: `<div class="subject"><div class="crown37"></div><div class="hand37"></div><div class="pin37"></div></div>
<div class="wave37"><div class="bar37" style="height:30%"></div><div class="bar37" style="height:70%"></div><div class="bar37" style="height:45%"></div><div class="bar37" style="height:95%"></div><div class="bar37" style="height:55%"></div><div class="bar37" style="height:80%"></div><div class="bar37" style="height:35%"></div></div>`,
    anim: `MV.enter('.subject',{easing:'back.out(1.8)',duration:800,from:{opacity:0,scale:.6}});
MV.enter('.hand37',{easing:'power4.out',duration:2000,delay:600,from:{rotation:-900}});
MV.enter('.bar37',{easing:'sine.out',duration:800,stagger:100,delay:1200,from:{scaleY:.1,transformOrigin:'bottom center'}});
MV.emphasis('.pin37',{duration:1200});` },

  // s38 时间轴不虚报：刻度轴锁定
  { id: 's38',
    css: `.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64vmin;height:10vmin;border-radius:5vmin;background:${DEEP};border:1px solid ${DIM}}
.fill38{position:absolute;left:.8vmin;top:.8vmin;bottom:.8vmin;width:40%;border-radius:5vmin;background:linear-gradient(90deg,${RED},${YEL});transform-origin:left center}
.tick38{position:absolute;top:-2.6vmin;width:.6vmin;height:2.6vmin;border-radius:.4vmin;background:${MID};opacity:.8}
.lock38{position:absolute;right:-4vmin;top:50%;transform:translate(0,-50%);width:8vmin;height:8vmin;border-radius:1.2vmin;background:${YEL};display:flex;align-items:center;justify-content:center;font-size:4vmin;font-weight:900;color:${DEEP};box-shadow:0 .8vmin 0 #a16207}`,
    markup: `<div class="subject"><div class="fill38"></div>
<div class="tick38" style="left:10%"></div><div class="tick38" style="left:25%"></div><div class="tick38" style="left:40%"></div><div class="tick38" style="left:55%"></div><div class="tick38" style="left:70%"></div><div class="tick38" style="left:85%"></div>
<div class="lock38">锁</div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scaleX:.6}});
MV.enter('.fill38',{easing:'expo.out',duration:1600,delay:500,from:{scaleX:0}});
MV.enter('.tick38',{easing:'sine.out',duration:400,stagger:100,delay:900,from:{opacity:0,yPercent:60}});
MV.enter('.lock38',{easing:'back.out(2.2)',duration:600,delay:1700,from:{opacity:0,scale:0,rotation:-30}});
MV.emphasis('.lock38',{duration:1200});` },

  // s39 片场有王法：惊堂木拍案
  { id: 's39',
    css: `.block39{position:absolute;left:50%;bottom:20%;transform:translateX(-50%);width:24vmin;height:8vmin;border-radius:1.2vmin;background:linear-gradient(180deg,${MID},${DIM})}
.subject{position:absolute;left:50%;bottom:27%;transform:translateX(-50%);width:0;height:0}
.handle39{position:absolute;left:-2vmin;bottom:6vmin;width:4.4vmin;height:26vmin;border-radius:2.2vmin;background:linear-gradient(180deg,${MID},${DIM});transform-origin:bottom center}
.head39{position:absolute;left:-6vmin;bottom:2vmin;width:14vmin;height:7vmin;border-radius:1.2vmin;background:${MID}}
.shock39{position:absolute;left:50%;bottom:18%;border:2px solid ${YEL};border-radius:50%;transform:translateX(-50%)}
.s1{width:10vmin;height:3vmin;opacity:.8}.s2{width:20vmin;height:6vmin;opacity:.5}
.plaque39{position:absolute;left:50%;top:18%;transform:translateX(-50%);padding:1.6vmin 4vmin;border-radius:.8vmin;background:${RED};color:${CREAM};font-size:5.6vmin;font-weight:900;letter-spacing:1.6vmin;box-shadow:0 .8vmin 0 #7f1d1d}`,
    markup: `<div class="plaque39">王法</div>
<div class="shock39 s2"></div><div class="shock39 s1"></div>
<div class="block39"></div>
<div class="subject"><div class="handle39"></div><div class="head39"></div></div>`,
    anim: `MV.enter('.plaque39',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:-60}});
MV.enter('.subject',{easing:'power2.in',duration:400,delay:800,from:{yPercent:-80,rotation:-16}});
MV.enter('.shock39',{easing:'power2.out',duration:600,delay:1100,stagger:200,from:{opacity:0,scale:.2}});
MV.emphasis('.block39',{duration:1600});` },

  // s40 V 字律条：卷轴展开，V 徽章
  { id: 's40',
    css: `.scroll40{position:absolute;left:50%;top:16%;width:56vmin;height:52vmin;transform:translateX(-50%);border-radius:1.2vmin;background:linear-gradient(180deg,${CREAM},${PALE});transform-origin:top center;box-shadow:1.2vmin 1.4vmin 0 ${DIM}}
.law40{position:absolute;left:6vmin;height:1.4vmin;border-radius:1vmin;background:${RED};opacity:.7}
.w1{top:6vmin;width:40vmin}.w2{top:11vmin;width:34vmin}.w3{top:16vmin;width:38vmin}.w4{top:21vmin;width:28vmin}.w5{top:26vmin;width:36vmin}.w6{top:31vmin;width:24vmin}.w7{top:36vmin;width:32vmin}
.subject{position:absolute;right:12%;bottom:12%;width:20vmin;height:20vmin;border-radius:50%;background:radial-gradient(circle at 36% 32%,${YEL},#a16207);display:flex;align-items:center;justify-content:center;font-size:10vmin;font-weight:900;color:${DEEP};box-shadow:0 1vmin 0 #7f1d1d,0 0 10vmin ${YEL}44}`,
    markup: `<div class="scroll40"><div class="law40 w1"></div><div class="law40 w2"></div><div class="law40 w3"></div><div class="law40 w4"></div><div class="law40 w5"></div><div class="law40 w6"></div><div class="law40 w7"></div></div>
<div class="subject">V</div>`,
    anim: `MV.enter('.scroll40',{easing:'expo.out',duration:1600,from:{scaleY:.06,transformOrigin:'top center'}});
MV.enter('.law40',{easing:'sine.out',duration:400,stagger:120,delay:900,from:{opacity:0,scaleX:0,transformOrigin:'left center'}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,delay:1600,from:{opacity:0,scale:.2,rotation:-30}});
MV.emphasis('.subject',{duration:1600});` },

  // s41 白名单闸门：灯笼序列中越界者被巨掌摁下
  { id: 's41',
    css: `.rail41{position:absolute;left:12%;top:34%;right:12%;height:1vmin;background:${DIM};border-radius:1vmin}
.lant41{position:absolute;top:20%;width:7vmin;height:9vmin;border-radius:1vmin;background:${DEEP};border:1px solid ${DIM}}
.la1{left:14%}.la2{left:26%}.la3{left:38%}.la4{left:50%}
.glow41{position:absolute;left:1vmin;top:1vmin;width:2vmin;height:2vmin;border-radius:50%;background:${PALE}}
.subject{position:absolute;right:10%;top:34%;width:26vmin;height:12vmin;border-radius:2vmin 2vmin 6vmin 6vmin;background:${RED};box-shadow:0 1vmin 0 #7f1d1d;transform-origin:top center}
.finger41{position:absolute;left:3vmin;top:11.4vmin;width:1.6vmin;height:5vmin;border-radius:.8vmin;background:${RED};box-shadow:3.4vmin 0 0 ${RED},6.8vmin 0 0 ${RED}}
.rogue41{position:absolute;left:62%;top:12%;width:8vmin;height:8vmin;border-radius:50%;background:${MID}}
.bolt42{position:absolute;left:58%;top:4%;width:0;height:0;border-left:1.6vmin solid transparent;border-right:1.6vmin solid transparent;border-bottom:4.6vmin solid ${YEL};transform:rotate(20deg)}`,
    markup: `<div class="rail41"></div>
<div class="lant41 la1"><div class="glow41"></div></div><div class="lant41 la2"><div class="glow41"></div></div><div class="lant41 la3"><div class="glow41"></div></div><div class="lant41 la4"><div class="glow41"></div></div>
<div class="rogue41"></div><div class="bolt42"></div>
<div class="subject"><div class="finger41"></div></div>`,
    anim: `MV.enter('.lant41',{easing:'back.out(1.8)',duration:600,stagger:160,from:{opacity:0,yPercent:-60}});
MV.enter('.rogue41',{easing:'power1.in',duration:600,delay:900,from:{yPercent:-160,rotation:200}});
MV.enter('.subject',{easing:'power3.in',duration:500,delay:1500,from:{yPercent:-120}});
MV.enter('.bolt42',{easing:'back.out(2.2)',duration:400,delay:2000,from:{opacity:0,scale:2}});
MV.emphasis('.subject',{duration:1200});` },

  // s42 过不了闸就改：循环双箭头与火花
  { id: 's42',
    css: `.ring42{position:absolute;left:50%;top:46%;width:30vmin;height:30vmin;transform:translate(-50%,-50%);border-radius:50%;border:2.4vmin solid ${DEEP};border-top-color:${RED};border-right-color:${YEL}}
.arrow42{position:absolute;width:0;height:0;border-top:2.6vmin solid transparent;border-bottom:2.6vmin solid transparent}
.a1{left:50%;top:calc(46% - 17vmin);margin-left:-14.6vmin;border-right:4vmin solid ${RED};transform:rotate(-45deg)}
.a2{left:50%;top:calc(46% + 9vmin);margin-left:10vmin;border-left:4vmin solid ${YEL};transform:rotate(-45deg)}
.subject{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);width:16vmin;height:16vmin;border-radius:2vmin;background:${DEEP};border:1px solid ${DIM};display:flex;align-items:center;justify-content:center;font-size:8vmin;font-weight:900;color:${RED}}
.spark42{position:absolute;width:1.4vmin;height:1.4vmin;border-radius:50%;background:${YEL}}
.k1{left:30%;top:24%}.k2{left:66%;top:26%}.k3{left:28%;top:66%}`,
    markup: `<div class="ring42"></div><div class="arrow42 a1"></div><div class="arrow42 a2"></div>
<div class="subject">改</div>
<div class="spark42 k1"></div><div class="spark42 k2"></div><div class="spark42 k3"></div>`,
    anim: `MV.enter('.ring42',{easing:'power2.inOut',duration:1200,from:{rotation:-120,opacity:0}});
MV.enter('.arrow42',{easing:'back.out(2.2)',duration:600,delay:800,from:{opacity:0,scale:0}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:600,delay:1100,from:{opacity:0,scale:.2,rotation:-24}});
MV.enter('.spark42',{easing:'sine.out',duration:400,stagger:140,delay:1600,from:{opacity:0,scale:0}});
MV.emphasis('.subject',{duration:1600});` },

  // s43 有王法才有好片子：幕布升起奖杯
  { id: 's43',
    css: `.curtain43{position:absolute;top:0;bottom:30%;width:26vmin;background:repeating-linear-gradient(90deg,#7f1d1d 0 4vmin,${RED} 4vmin 8vmin)}
.cl{left:0;transform-origin:left center}.cr{right:0;transform-origin:right center}
.subject{position:absolute;left:50%;bottom:26%;transform:translateX(-50%);width:0;height:0}
.cup43{position:absolute;left:-9vmin;bottom:6vmin;width:18vmin;height:14vmin;border-radius:2vmin 2vmin 8vmin 8vmin;background:radial-gradient(circle at 40% 30%,${YEL},#a16207)}
.stem43{position:absolute;left:-1.6vmin;bottom:0;width:3.2vmin;height:6vmin;border-radius:1vmin;background:#a16207}
.base43{position:absolute;left:-7vmin;bottom:-2.4vmin;width:14vmin;height:2.6vmin;border-radius:1vmin;background:${DIM}}
.beam43{position:absolute;left:50%;bottom:26%;width:34vmin;height:52vmin;transform:translateX(-50%);background:linear-gradient(to bottom,${PALE}26,transparent 80%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);transform-origin:bottom center}`,
    markup: `<div class="beam43"></div>
<div class="curtain43 cl"></div><div class="curtain43 cr"></div>
<div class="subject"><div class="cup43"></div><div class="stem43"></div><div class="base43"></div></div>`,
    anim: `MV.enter('.curtain43',{easing:'power2.inOut',duration:1600,stagger:200,from:{scaleX:1.6,opacity:.4}});
MV.enter('.beam43',{easing:'sine.out',duration:1200,delay:600,from:{opacity:0,scaleY:.4}});
MV.enter('.subject',{easing:'expo.out',duration:1600,delay:900,from:{yPercent:120,opacity:0}});
MV.emphasis('.cup43',{duration:1600});` },

  // s44 状态全在账上：铁账本与锁扣
  { id: 's44',
    css: `.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-3deg);width:40vmin;height:30vmin;border-radius:1.4vmin;background:linear-gradient(180deg,#3f3a36,${DEEP});border:1px solid ${DIM};box-shadow:2vmin 2vmin 0 ${DIM}}
.spine44{position:absolute;left:4vmin;top:0;bottom:0;width:2.4vmin;background:${RED};opacity:.85}
.line44{position:absolute;height:1vmin;border-radius:1vmin;background:${MID};opacity:.5}
.k1{left:10vmin;top:7vmin;width:20vmin}.k2{left:10vmin;top:12vmin;width:14vmin}.k3{left:10vmin;top:17vmin;width:18vmin}
.clasp44{position:absolute;right:6vmin;top:50%;transform:translateY(-50%);width:8vmin;height:10vmin;border-radius:1vmin;background:${YEL};display:flex;align-items:center;justify-content:center;font-size:4.6vmin;color:${DEEP};font-weight:900}
.ray44{position:absolute;left:50%;top:50%;width:.7vmin;height:26vmin;background:linear-gradient(to bottom,${YEL}55,transparent);transform-origin:top center}
.r1{transform:translateX(-50%) rotate(-30deg) translateY(-16vmin)}.r2{transform:translateX(-50%) rotate(30deg) translateY(-16vmin)}`,
    markup: `<div class="ray44 r1"></div><div class="ray44 r2"></div>
<div class="subject"><div class="spine44"></div><div class="line44 k1"></div><div class="line44 k2"></div><div class="line44 k3"></div><div class="clasp44">存</div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:30}});
MV.enter('.line44',{easing:'sine.out',duration:600,stagger:140,delay:600,from:{scaleX:0,transformOrigin:'left center'}});
MV.enter('.clasp44',{easing:'back.out(2.2)',duration:600,delay:1100,from:{opacity:0,scale:.2}});
MV.enter('.ray44',{easing:'sine.out',duration:1200,stagger:200,delay:1500,from:{opacity:0,scaleY:.2}});
MV.emphasis('.clasp44',{duration:1600});` },

  // s45 明天接着拍：日出与场记板，循环箭头
  { id: 's45',
    css: `.sun45{position:absolute;left:50%;bottom:26%;width:22vmin;height:22vmin;transform:translateX(-50%)}
.subject{position:absolute;left:0;bottom:0;width:22vmin;height:22vmin;border-radius:50%;background:radial-gradient(circle at 50% 70%,${YEL},${RED});box-shadow:0 0 14vmin ${YEL}44}
.ray45{position:absolute;left:50%;bottom:50%;width:1vmin;height:15vmin;background:linear-gradient(to top,${YEL}88,transparent);transform-origin:bottom center}
.rr1{transform:translateX(-50%) rotate(0deg)}.rr2{transform:translateX(-50%) rotate(40deg)}.rr3{transform:translateX(-50%) rotate(-40deg)}
.hill45{position:absolute;left:0;right:0;bottom:0;height:16vmin;background:${DEEP};border-radius:50% 50% 0 0;opacity:.9}
.board45{position:absolute;right:16%;bottom:14%;width:22vmin;height:15vmin;border-radius:1vmin;background:${DEEP};border:1px solid ${DIM}}
.bar45{position:absolute;left:0;top:0;width:100%;height:4vmin;border-radius:1vmin;background:repeating-linear-gradient(90deg,${CREAM} 0 3vmin,${DEEP} 3vmin 6vmin)}
.loop45{position:absolute;left:16%;top:20%;width:12vmin;height:12vmin;border-radius:50%;border:1.6vmin solid ${YEL};border-left-color:transparent;transform:rotate(30deg)}`,
    markup: `<div class="sun45"><div class="subject"></div><div class="ray45 rr1"></div><div class="ray45 rr2"></div><div class="ray45 rr3"></div></div>
<div class="hill45"></div>
<div class="board45"><div class="bar45"></div></div>
<div class="loop45"></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:1600,from:{yPercent:60,opacity:0}});
MV.enter('.ray45',{easing:'sine.out',duration:1200,stagger:200,delay:700,from:{scaleY:.2,opacity:0}});
MV.enter('.board45',{easing:'power2.out',duration:600,delay:900,from:{opacity:0,yPercent:40}});
MV.enter('.loop45',{easing:'back.out(2.2)',duration:600,delay:1400,from:{opacity:0,rotation:-120,scale:.3}});
MV.idle('.sun45',{delay:1600});` },

  // s46 渲染引擎开炉：炉口喷焰
  { id: 's46',
    css: `.furnace46{position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);width:52vmin;height:38vmin;border-radius:4vmin;background:linear-gradient(180deg,${DIM},${DEEP});box-shadow:0 0 10vmin ${RED}33}
.subject{position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);width:22vmin;height:22vmin;border-radius:50%;background:radial-gradient(circle at 50% 62%,${PALE},${YEL} 40%,${RED} 76%);box-shadow:0 0 14vmin ${RED}66}
.vent46{position:absolute;left:14%;top:12%;width:7vmin;height:16vmin;border-radius:1vmin;background:${DEEP};border:1px solid ${DIM}}
.v2{right:14%;left:auto}
.flame46{position:absolute;width:0;height:0;border-left:2.2vmin solid transparent;border-right:2.2vmin solid transparent;border-bottom:5vmin solid ${YEL};opacity:.95}
.ff1{left:32%;top:24%}.ff2{left:46%;top:20%}.ff3{left:60%;top:25%}
.gear46{position:absolute;bottom:8%;width:9vmin;height:9vmin;border-radius:50%;border:1.6vmin solid ${MID}}
.g1{left:26%}.g2{right:26%}`,
    markup: `<div class="furnace46"><div class="vent46"></div><div class="vent46 v2"></div><div class="subject"></div></div>
<div class="flame46 ff1"></div><div class="flame46 ff2"></div><div class="flame46 ff3"></div>
<div class="gear46 g1"></div><div class="gear46 g2"></div>`,
    anim: `MV.enter('.furnace46',{easing:'power2.out',duration:600,from:{opacity:0,scale:.85}});
MV.enter('.subject',{easing:'back.out(1.8)',duration:800,delay:600,from:{opacity:0,scale:.2}});
MV.enter('.flame46',{easing:'sine.out',duration:400,stagger:140,delay:1200,from:{opacity:0,scaleY:.2,transformOrigin:'bottom center'}});
MV.enter('.gear46',{easing:'power2.inOut',duration:800,delay:1400,stagger:200,from:{opacity:0,rotation:-90}});
MV.emphasis('.subject',{duration:1600});` },

  // s47 一镜不少：放映机与帧帧点亮的长胶片
  { id: 's47',
    css: `.subject{position:absolute;left:12%;top:34%;width:22vmin;height:18vmin;border-radius:1.4vmin;background:linear-gradient(180deg,${DIM},${DEEP});border:1px solid ${DIM}}
.lens47{position:absolute;right:-6vmin;top:6vmin;width:7vmin;height:6vmin;border-radius:1vmin;background:${MID}}
.reel47{position:absolute;left:3vmin;top:-9vmin;width:10vmin;height:10vmin;border-radius:50%;border:1.6vmin solid ${MID}}
.strip47{position:absolute;left:30%;top:42%;right:6%;height:10vmin;border-radius:.6vmin;background:${DEEP};border:1px solid ${DIM}}
.frame47{position:absolute;top:1.4vmin;width:6vmin;height:7vmin;border-radius:.4vmin;background:${PALE};opacity:.25}
.f1{left:2vmin}.f2{left:11vmin}.f3{left:20vmin}.f4{left:29vmin}.f5{left:38vmin}.f6{left:47vmin}`,
    markup: `<div class="subject"><div class="lens47"></div><div class="reel47"></div></div>
<div class="strip47"><div class="frame47 f1"></div><div class="frame47 f2"></div><div class="frame47 f3"></div><div class="frame47 f4"></div><div class="frame47 f5"></div><div class="frame47 f6"></div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,xPercent:-24}});
MV.enter('.strip47',{easing:'expo.out',duration:1600,delay:500,from:{scaleX:0,transformOrigin:'left center'}});
MV.enter('.frame47',{easing:'sine.out',duration:400,stagger:160,delay:1200,from:{opacity:0,scale:.4}});
MV.idle('.reel47',{delay:1600});` },

  // s48 大阵仗之问：追光下的背影与三支话筒
  { id: 's48',
    css: `.spot48{position:absolute;left:50%;bottom:12%;transform:translateX(-50%);width:34vmin;height:52vmin;background:linear-gradient(to bottom,${CREAM}20,transparent 82%);clip-path:polygon(42% 0,58% 0,100% 100%,0 100%)}
.subject{position:absolute;left:50%;bottom:14%;transform:translateX(-50%);width:12vmin;height:22vmin;border-radius:3vmin 3vmin .8vmin .8vmin;background:${DEEP};border:1px solid ${DIM}}
.head48{position:absolute;left:50%;bottom:34%;transform:translateX(-50%);width:8vmin;height:8vmin;border-radius:50%;background:${DEEP};border:1px solid ${DIM}}
.mic48{position:absolute;bottom:20%;width:2vmin;height:18vmin;border-radius:1vmin;background:${MID};transform-origin:bottom center}
.m1{left:24%;transform:rotate(14deg)}.m2{left:48%}.m3{right:24%;transform:rotate(-14deg)}
.michead48{position:absolute;top:-3vmin;left:-1vmin;width:4vmin;height:4vmin;border-radius:50%;background:${YEL}}`,
    markup: `<div class="spot48"></div>
<div class="subject"></div><div class="head48"></div>
<div class="mic48 m1"><div class="michead48"></div></div><div class="mic48 m2"><div class="michead48"></div></div><div class="mic48 m3"><div class="michead48"></div></div>`,
    anim: `MV.enter('.spot48',{easing:'sine.out',duration:1200,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.out',duration:600,delay:500,from:{opacity:0,yPercent:20}});
MV.enter('.mic48',{easing:'back.out(1.8)',duration:800,stagger:220,delay:800,from:{opacity:0,yPercent:50}});
MV.idle('.mic48',{delay:1800});` },

  // s49 那句老话：金边古卷展开
  { id: 's49',
    css: `.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56vmin;height:26vmin;border-radius:1.2vmin;background:linear-gradient(180deg,${CREAM},${PALE});box-shadow:0 1.4vmin 0 ${DIM},0 0 12vmin ${YEL}33}
.roll49{position:absolute;top:-1.8vmin;width:3.4vmin;height:30vmin;border-radius:2vmin;background:${RED}}
.rl{left:-1.4vmin}.rr{right:-1.4vmin}
.line49{position:absolute;height:1.2vmin;border-radius:1vmin;background:${DEEP};opacity:.45}
.g1{left:8vmin;top:7vmin;width:36vmin}.g2{left:8vmin;top:12vmin;width:26vmin}.g3{left:8vmin;top:17vmin;width:32vmin}
.mote49{position:absolute;width:.7vmin;height:.7vmin;border-radius:50%;background:${YEL};opacity:.8}`,
    markup: `<div class="subject"><div class="roll49 rl"></div><div class="roll49 rr"></div>
<div class="line49 g1"></div><div class="line49 g2"></div><div class="line49 g3"></div></div>
<div class="mote49" style="left:20%;top:24%"></div><div class="mote49" style="left:74%;top:20%"></div><div class="mote49" style="left:64%;top:70%"></div><div class="mote49" style="left:30%;top:74%"></div>`,
    anim: `MV.enter('.subject',{easing:'expo.out',duration:1600,from:{scaleX:.1,opacity:0}});
MV.enter('.line49',{easing:'sine.out',duration:600,stagger:160,delay:800,from:{scaleX:0,transformOrigin:'left center'}});
MV.enter('.mote49',{easing:'sine.out',duration:1600,stagger:200,from:{opacity:0}});
MV.idle('.subject',{delay:1600});` },

  // s50 咸鱼与梦想：沙滩咸鱼晒太阳，头顶梦想泡
  { id: 's50',
    css: `.sand50{position:absolute;left:0;right:0;bottom:0;height:22vmin;background:linear-gradient(180deg,${DIM},${DEEP});border-radius:60% 40% 0 0/100% 60% 0 0}
.subject{position:absolute;left:50%;bottom:16%;transform:translateX(-50%) rotate(-4deg);width:34vmin;height:10vmin;border-radius:5vmin;background:linear-gradient(180deg,${MID},${DIM});box-shadow:0 1vmin 0 ${DEEP}}
.tail50{position:absolute;right:-6vmin;top:-1vmin;width:0;height:0;border-top:5vmin solid transparent;border-bottom:5vmin solid transparent;border-right:8vmin solid ${DIM}}
.eye50{position:absolute;left:5vmin;top:3vmin;width:1.6vmin;height:1.6vmin;border-radius:50%;background:${DEEP}}
.glass50{position:absolute;left:3vmin;top:1.6vmin;width:9vmin;height:3.4vmin;border-radius:2vmin;border:.5vmin solid ${DEEP}}
.bubble50{position:absolute;left:60%;top:20%;width:16vmin;height:16vmin;border-radius:50%;background:${DEEP};border:1px solid ${DIM};display:flex;align-items:center;justify-content:center;font-size:8vmin;font-weight:900;color:${YEL}}
.bb50{position:absolute;left:56%;top:38%;width:3.4vmin;height:3.4vmin;border-radius:50%;background:${DEEP};border:1px solid ${DIM}}
.b2b{left:53%;top:46%;width:2vmin;height:2vmin}
.sun50{position:absolute;right:12%;top:12%;width:9vmin;height:9vmin;border-radius:50%;background:radial-gradient(circle,${PALE},${YEL} 70%);opacity:.9}`,
    markup: `<div class="sun50"></div>
<div class="bubble50">梦</div><div class="bb50"></div><div class="bb50 b2b"></div>
<div class="subject"><div class="tail50"></div><div class="eye50"></div><div class="glass50"></div></div>
<div class="sand50"></div>`,
    anim: `MV.enter('.sun50',{easing:'sine.out',duration:800,from:{opacity:0,scale:.4}});
MV.enter('.subject',{easing:'back.out(1.8)',duration:800,from:{opacity:0,yPercent:60,rotation:-16}});
MV.enter('.bubble50',{easing:'back.out(2.2)',duration:800,delay:1000,from:{opacity:0,scale:0,yPercent:40}});
MV.enter('.bb50',{easing:'back.out(2.2)',duration:400,stagger:160,delay:1400,from:{opacity:0,scale:0}});
MV.emphasis('.bubble50',{duration:1600});` },

  // s51 想法自己开口：灵感泡泡群升起
  { id: 's51',
    css: `.book51{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);width:40vmin;height:8vmin;border-radius:.8vmin;background:${CREAM};opacity:.95}
.page51{position:absolute;left:2vmin;top:-3vmin;width:36vmin;height:3vmin;border-radius:.6vmin;background:${PALE}}
.bubble51{position:absolute;border-radius:50%;background:${DEEP};border:1px solid ${DIM}}
.b1{left:30%;bottom:22%;width:7vmin;height:7vmin}
.b2{left:44%;bottom:30%;width:10vmin;height:10vmin}
.b3{left:58%;bottom:24%;width:6vmin;height:6vmin}
.subject{position:absolute;left:46%;bottom:36%;width:14vmin;height:14vmin;border-radius:50%;background:radial-gradient(circle at 40% 36%,${PALE},${YEL} 70%);box-shadow:0 0 10vmin ${YEL}55}
.glow51{position:absolute;left:50%;top:50%;width:5vmin;height:5vmin;transform:translate(-50%,-50%);border-radius:50%;background:${CREAM};opacity:.9}`,
    markup: `<div class="bubble51 b1"></div><div class="bubble51 b2"></div><div class="bubble51 b3"></div>
<div class="subject"><div class="glow51"></div></div>
<div class="book51"><div class="page51"></div></div>`,
    anim: `MV.enter('.bubble51',{easing:'sine.out',duration:1600,stagger:260,from:{opacity:0,yPercent:80}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,delay:900,from:{opacity:0,scale:.2,yPercent:60}});
MV.enter('.book51',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:40}});
MV.emphasis('.subject',{duration:1600});
MV.idle('.bubble51',{delay:1700});` },

  // s52 讲成一部电影：泡泡化作放光的银幕
  { id: 's52',
    css: `.ray52{position:absolute;left:50%;top:46%;width:1vmin;height:34vmin;background:linear-gradient(to bottom,${YEL}66,transparent);transform-origin:top center}
.r1{transform:translateX(-50%) rotate(-48deg)}.r2{transform:translateX(-50%) rotate(-24deg)}.r3{transform:translateX(-50%) rotate(0deg)}.r4{transform:translateX(-50%) rotate(24deg)}.r5{transform:translateX(-50%) rotate(48deg)}
.subject{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);width:40vmin;height:26vmin;border-radius:1.4vmin;background:linear-gradient(160deg,${DEEP},#0d0b0a);border:.6vmin solid ${PALE};box-shadow:0 0 14vmin ${PALE}22}
.play52{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:0;height:0;border-top:4vmin solid transparent;border-bottom:4vmin solid transparent;border-left:7vmin solid ${RED};margin-left:1vmin}`,
    markup: `<div class="ray52 r1"></div><div class="ray52 r2"></div><div class="ray52 r3"></div><div class="ray52 r4"></div><div class="ray52 r5"></div>
<div class="subject"><div class="play52"></div></div>`,
    anim: `MV.enter('.ray52',{easing:'sine.out',duration:1600,stagger:140,from:{opacity:0,scaleY:.2}});
MV.enter('.subject',{easing:'back.out(1.8)',duration:800,delay:600,from:{opacity:0,scale:.3,rotation:-6}});
MV.emphasis('.subject',{duration:1600});
MV.idle('.ray52',{delay:1800});` },

  // s53 代码绘制的电影厂：厂门匾额
  { id: 's53',
    css: `.gate53{position:absolute;left:50%;bottom:10%;transform:translateX(-50%);width:64vmin;height:44vmin;border-radius:32vmin 32vmin 0 0;border:.8vmin solid ${DIM};border-bottom:none;background:${DEEP}}
.door53{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:26vmin;height:30vmin;border-radius:13vmin 13vmin 0 0;background:#0d0b0a;border:1px solid ${DIM}}
.subject{position:absolute;left:50%;top:22%;transform:translateX(-50%);padding:2vmin 4vmin;border-radius:1vmin;background:${RED};color:${CREAM};font-size:6.4vmin;font-weight:900;letter-spacing:1.6vmin;box-shadow:0 1vmin 0 #7f1d1d,0 0 10vmin ${RED}44;white-space:nowrap}
.bulb53{position:absolute;width:1.3vmin;height:1.3vmin;border-radius:50%;background:${YEL};box-shadow:0 0 2vmin ${YEL}}
.u1{left:22%;top:34%}.u2{left:19%;top:46%}.u3{right:22%;top:34%}.u4{right:19%;top:46%}
.star53{position:absolute;left:50%;top:38%;font-size:5vmin;color:${YEL};opacity:.9}`,
    markup: `<div class="gate53"><div class="door53"></div></div>
<div class="subject">电影厂</div>
<div class="bulb53 u1"></div><div class="bulb53 u2"></div><div class="bulb53 u3"></div><div class="bulb53 u4"></div>
<div class="star53">★</div>`,
    anim: `MV.enter('.gate53',{easing:'power2.out',duration:800,from:{opacity:0,yPercent:20}});
MV.enter('.door53',{easing:'power2.out',duration:800,delay:300,from:{opacity:0,scaleY:.6,transformOrigin:'bottom center'}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,delay:700,from:{opacity:0,yPercent:-60,rotation:-6}});
MV.enter('.bulb53',{easing:'sine.out',duration:400,stagger:120,delay:1300,from:{opacity:0}});
MV.emphasis('.subject',{duration:1600});` },

  // s54 机会摆在面前：追光下的空座与金票
  { id: 's54',
    css: `.spot54{position:absolute;left:50%;bottom:10%;transform:translateX(-50%);width:40vmin;height:60vmin;background:linear-gradient(to bottom,${PALE}22,transparent 84%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%)}
.seat54{position:absolute;left:50%;bottom:12%;transform:translateX(-50%);width:26vmin;height:8vmin;border-radius:2vmin 2vmin .8vmin .8vmin;background:${DEEP};border:1px solid ${DIM}}
.back54{position:absolute;left:50%;bottom:20%;transform:translateX(-50%);width:26vmin;height:14vmin;border-radius:3vmin 3vmin 0 0;background:${DEEP};border:1px solid ${DIM}}
.subject{position:absolute;left:50%;bottom:26%;transform:translateX(-50%) rotate(-10deg);width:14vmin;height:9vmin;border-radius:.8vmin;background:linear-gradient(160deg,${YEL},#a16207);box-shadow:0 .8vmin 0 #7f1d1d,0 0 8vmin ${YEL}44}
.stub54{position:absolute;right:1.6vmin;top:1.6vmin;bottom:1.6vmin;width:.6vmin;border-radius:.4vmin;background:${DEEP};opacity:.6}
.star54{position:absolute;left:16%;top:30%;font-size:4.6vmin;color:${YEL};opacity:.9}
.s2{left:78%;top:24%}`,
    markup: `<div class="spot54"></div>
<div class="back54"></div><div class="seat54"></div>
<div class="subject"><div class="stub54"></div></div>
<div class="star54">★</div><div class="star54 s2">★</div>`,
    anim: `MV.enter('.spot54',{easing:'sine.out',duration:1600,from:{opacity:0,scaleY:.4,transformOrigin:'bottom center'}});
MV.enter('.back54',{easing:'power2.out',duration:600,delay:500,from:{opacity:0,yPercent:30}});
MV.enter('.seat54',{easing:'power2.out',duration:600,delay:600,from:{opacity:0,yPercent:30}});
MV.enter('.subject',{easing:'expo.out',duration:1600,delay:1000,from:{yPercent:-140,rotation:10,opacity:0}});
MV.emphasis('.subject',{duration:1600});` },
];

// 逐镜原创 · 第二幕 s19-s36（风格库 → 一次确认 → 逐镜原创 → 时间真源）
const RED = '#dc2626', YEL = '#facc15', CREAM = '#fffbeb', PALE = '#fef08a',
      MID = '#a8a29e', DIM = '#57534e', DEEP = '#1c1917';

module.exports = [
  // s19 登记在册：档案卡抽出一枚，徽章亮起「无厘头」
  { id: 's19',
    css: `.drawer{position:absolute;left:12%;top:20%;width:40vmin;height:56vmin;border:1px solid ${DIM};border-radius:1.2vmin;background:repeating-linear-gradient(180deg,${DEEP} 0 12vmin,#0d0b0a 12vmin 13vmin)}
.knob19{position:absolute;left:50%;bottom:2vmin;width:6vmin;height:1.6vmin;margin-left:-3vmin;border-radius:1vmin;background:${MID}}
.subject{position:absolute;right:14%;top:30%;padding:2.4vmin 3vmin;border-radius:1.6vmin;background:${RED};color:${CREAM};font-size:6vmin;font-weight:900;letter-spacing:.8vmin;box-shadow:1vmin 1.2vmin 0 #7f1d1d,0 0 10vmin ${RED}44;transform:rotate(-4deg)}
.tag19{position:absolute;right:16%;top:22%;font-size:3.4vmin;color:${MID};letter-spacing:.6vmin}
.st19{position:absolute;right:18%;top:56%;width:7vmin;height:7vmin;border-radius:1vmin;border:.6vmin solid ${YEL};color:${YEL};font-size:3.2vmin;font-weight:800;display:flex;align-items:center;justify-content:center;transform:rotate(8deg)}`,
    markup: `<div class="drawer"><div class="knob19"></div></div>
<div class="tag19">CP-01</div>
<div class="subject">无厘头</div>
<div class="st19">A级</div>`,
    anim: `MV.enter('.drawer',{easing:'power2.out',duration:600,from:{opacity:0,xPercent:-20}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,delay:600,from:{opacity:0,xPercent:40,rotation:6}});
MV.enter('.tag19',{easing:'sine.out',duration:400,delay:1100,from:{opacity:0}});
MV.enter('.st19',{easing:'power2.in',duration:400,delay:1400,from:{opacity:0,scale:2.2}});
MV.emphasis('.subject',{duration:1600});` },

  // s20 一本正经：讲台上的西装小人，庄重横幅
  { id: 's20',
    css: `.banner{position:absolute;left:50%;top:14%;transform:translateX(-50%);padding:1.4vmin 4vmin;border-radius:.8vmin;background:${RED};color:${CREAM};font-size:4.6vmin;font-weight:900;letter-spacing:1.2vmin;box-shadow:0 .8vmin 0 #7f1d1d}
.subject{position:absolute;left:50%;bottom:16%;transform:translateX(-50%);width:10vmin;height:14vmin;border-radius:2vmin 2vmin .6vmin .6vmin;background:${DEEP};border:1px solid ${DIM}}
.head20{position:absolute;left:50%;bottom:29%;width:7vmin;height:7vmin;transform:translateX(-50%);border-radius:50%;background:${MID}}
.bow20{position:absolute;left:50%;bottom:27.4%;width:3.4vmin;height:1.8vmin;transform:translateX(-50%);background:${RED};border-radius:.4vmin}
.pod20{position:absolute;left:50%;bottom:8%;width:26vmin;height:8vmin;transform:translateX(-50%);background:${DEEP};border:1px solid ${DIM};border-radius:.8vmin}
.mic20{position:absolute;left:44%;bottom:15%;width:1.2vmin;height:8vmin;border-radius:.6vmin;background:${MID};transform:rotate(12deg)}
.beam20{position:absolute;left:50%;top:0;width:40vmin;height:70%;transform:translateX(-50%);background:linear-gradient(to bottom,${CREAM}1c,transparent 80%);clip-path:polygon(36% 0,64% 0,100% 100%,0 100%)}`,
    markup: `<div class="beam20"></div><div class="banner">一本正经</div>
<div class="subject"></div><div class="head20"></div><div class="bow20"></div>
<div class="pod20"></div><div class="mic20"></div>`,
    anim: `MV.enter('.beam20',{easing:'sine.out',duration:1200,from:{opacity:0}});
MV.enter('.banner',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:-60}});
MV.enter('.subject',{easing:'back.out(1.6)',duration:600,delay:500,from:{opacity:0,yPercent:40}});
MV.enter('.head20',{easing:'back.out(2.2)',duration:400,delay:800,from:{opacity:0,scale:.2}});
MV.idle('.head20',{delay:1400});` },

  // s21 破功瞬间：庄严雕像裂开，弹簧小人蹦出
  { id: 's21',
    css: `.subject{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);width:26vmin;height:34vmin;border-radius:4vmin 4vmin 1.4vmin 1.4vmin;background:linear-gradient(180deg,${MID},${DIM})}
.plinth21{position:absolute;left:50%;top:72%;width:34vmin;height:6vmin;transform:translateX(-50%);background:${DEEP};border:1px solid ${DIM}}
.crack21{position:absolute;background:${DEEP}}
.k1{left:48%;top:34%;width:1.2vmin;height:14vmin;transform:rotate(14deg)}
.k2{left:52%;top:46%;width:1.2vmin;height:10vmin;transform:rotate(-18deg)}
.k3{left:44%;top:52%;width:1.2vmin;height:8vmin;transform:rotate(24deg)}
.pop21{position:absolute;left:60%;top:24%;width:8vmin;height:8vmin;border-radius:50%;background:${YEL};box-shadow:0 0 6vmin ${YEL}66}
.sweat21{position:absolute;left:64%;top:16%;width:2.4vmin;height:3.2vmin;border-radius:50%/60% 60% 40% 40%;background:${PALE};opacity:.85}
.bolt21{position:absolute;left:36%;top:40%;width:0;height:0;border-left:1.6vmin solid transparent;border-right:1.6vmin solid transparent;border-bottom:5vmin solid ${YEL};transform:rotate(-30deg)}`,
    markup: `<div class="subject"></div><div class="plinth21"></div>
<div class="crack21 k1"></div><div class="crack21 k2"></div><div class="crack21 k3"></div>
<div class="pop21"></div><div class="sweat21"></div><div class="bolt21"></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.9}});
MV.enter('.crack21',{easing:'power2.out',duration:400,stagger:200,delay:700,from:{opacity:0,scaleY:0}});
MV.enter('.pop21',{easing:'back.out(2.2)',duration:600,delay:1400,from:{opacity:0,scale:0,yPercent:60}});
MV.enter('.sweat21',{easing:'power1.in',duration:400,delay:1800,from:{yPercent:-300,opacity:0}});
MV.emphasis('.pop21',{duration:1200});` },

  // s22 破完功露真心：裂缝里透出一颗发光的心
  { id: 's22',
    css: `.shell22{position:absolute;left:50%;top:50%;width:36vmin;height:40vmin;transform:translate(-50%,-50%)}
.half22{position:absolute;top:0;width:17vmin;height:40vmin;background:linear-gradient(180deg,${MID},${DIM})}
.hl{left:0;border-radius:18vmin 0 0 3vmin;transform-origin:left center}
.hr{right:0;border-radius:0 18vmin 3vmin 0;transform-origin:right center}
.subject{position:absolute;left:50%;top:52%;width:14vmin;height:13vmin;transform:translate(-50%,-50%)}
.heart22{position:absolute;inset:0;background:${RED};transform:rotate(45deg);border-radius:2vmin;box-shadow:0 0 12vmin ${RED}77}
.hb{position:absolute;left:-4.4vmin;top:-3.4vmin;width:12vmin;height:12vmin;border-radius:50%;background:${RED}}
.hc{position:absolute;right:-4.4vmin;top:-3.4vmin;width:12vmin;height:12vmin;border-radius:50%;background:${RED}}
.ray22{position:absolute;left:50%;top:50%;width:.8vmin;height:30vmin;background:linear-gradient(to bottom,${YEL}66,transparent);transform-origin:top center}
.r1{transform:translateX(-50%) rotate(0deg)}.r2{transform:translateX(-50%) rotate(60deg)}.r3{transform:translateX(-50%) rotate(-60deg)}`,
    markup: `<div class="ray22 r1"></div><div class="ray22 r2"></div><div class="ray22 r3"></div>
<div class="subject"><div class="heart22"></div><div class="hb"></div><div class="hc"></div></div>
<div class="shell22"><div class="half22 hl"></div><div class="half22 hr"></div></div>`,
    anim: `MV.enter('.hl',{easing:'power2.inOut',duration:800,delay:800,from:{rotation:24,opacity:0}});
MV.enter('.hr',{easing:'power2.inOut',duration:800,delay:800,from:{rotation:-24,opacity:0}});
MV.enter('.subject',{easing:'back.out(1.8)',duration:800,delay:1000,from:{opacity:0,scale:0}});
MV.enter('.ray22',{easing:'sine.out',duration:1200,stagger:180,delay:1400,from:{opacity:0,scaleY:.2}});
MV.emphasis('.subject',{duration:1600});` },

  // s23 大制作×小人物：银幕与板凳，一朵大红花
  { id: 's23',
    css: `.screen23{position:absolute;left:50%;top:16%;transform:translateX(-50%);width:56vmin;height:32vmin;border-radius:1.2vmin;background:linear-gradient(160deg,${DEEP},#0d0b0a);border:.6vmin solid ${DIM};box-shadow:0 0 10vmin ${PALE}18}
.glow23{position:absolute;left:50%;top:16%;transform:translateX(-50%);width:56vmin;height:32vmin;border-radius:1.2vmin;background:radial-gradient(ellipse at 50% 40%,${PALE}1f,transparent 70%)}
.stool23{position:absolute;left:50%;bottom:14%;transform:translateX(-50%);width:18vmin;height:3vmin;border-radius:.6vmin;background:${DIM}}
.leg23{position:absolute;bottom:5%;width:2.4vmin;height:9vmin;border-radius:.6vmin;background:${DIM}}
.lg1{left:42%}.lg2{right:42%}
.subject{position:absolute;right:18%;top:20%;width:14vmin;height:14vmin;border-radius:50%;background:radial-gradient(circle at 40% 40%,${RED},#7f1d1d);box-shadow:0 0 8vmin ${RED}66}
.petal23{position:absolute;width:5.6vmin;height:5.6vmin;border-radius:50% 0 50% 50%;background:${RED}}
.p1{left:-5.2vmin;top:4.2vmin;transform:rotate(-90deg)}.p2{right:-5.2vmin;top:4.2vmin;transform:rotate(90deg) scaleY(-1)}.p3{left:4.2vmin;top:-5.2vmin;transform:rotate(0deg)}.p4{left:4.2vmin;bottom:-5.2vmin;transform:rotate(180deg)}
.pin23{position:absolute;left:50%;top:50%;width:4vmin;height:4vmin;margin:-2vmin 0 0 -2vmin;border-radius:50%;background:${YEL}}`,
    markup: `<div class="screen23"></div><div class="glow23"></div>
<div class="stool23"></div><div class="leg23 lg1"></div><div class="leg23 lg2"></div>
<div class="subject"><div class="petal23 p1"></div><div class="petal23 p2"></div><div class="petal23 p3"></div><div class="petal23 p4"></div><div class="pin23"></div></div>`,
    anim: `MV.enter('.screen23',{easing:'power2.out',duration:800,from:{opacity:0,scale:.92}});
MV.enter('.stool23',{easing:'back.out(1.6)',duration:600,delay:500,from:{opacity:0,yPercent:60}});
MV.enter('.leg23',{easing:'back.out(1.6)',duration:600,delay:600,from:{opacity:0,yPercent:60}});
MV.enter('.subject',{easing:'back.out(2.2)',duration:800,delay:1100,from:{opacity:0,scale:0,rotation:-60}});
MV.emphasis('.subject',{duration:1600});
MV.idle('.glow23',{delay:1600});` },

  // s24 十六风格 × 八配方：展示墙与转盘
  { id: 's24',
    css: `.subject{position:absolute;left:14%;top:16%;width:40vmin;height:52vmin;border:1px solid ${DIM};border-radius:1vmin;
background-image:linear-gradient(${DIM} 1px,transparent 1px),linear-gradient(90deg,${DIM} 1px,transparent 1px);background-size:10vmin 13vmin;background-color:${DEEP}}
.n24{position:absolute;right:10%;top:22%;font-size:18vmin;font-weight:900;color:${CREAM};text-shadow:0 0 4vmin ${RED}55}
.n2{right:13%;top:52%;font-size:9vmin;color:${YEL}}
.dial24{position:absolute;right:20%;bottom:12%;width:9vmin;height:9vmin;border-radius:50%;border:1.2vmin solid ${MID}}
.d1{right:34%}.d2{right:24%}.d3{right:14%}
.pin24{position:absolute;left:50%;top:-1.6vmin;width:1.2vmin;height:2.4vmin;margin-left:-.6vmin;background:${RED}}`,
    markup: `<div class="subject"></div>
<div class="n24">16</div><div class="n24 n2">8</div>
<div class="dial24 d1"><div class="pin24"></div></div><div class="dial24 d2"><div class="pin24"></div></div><div class="dial24 d3"><div class="pin24"></div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.94}});
MV.enter('.n24',{easing:'back.out(2.2)',duration:600,stagger:260,from:{opacity:0,scale:1.8}});
MV.enter('.dial24',{easing:'power2.inOut',duration:800,stagger:160,delay:700,from:{rotation:-140,opacity:0}});
MV.idle('.dial24',{delay:1500});` },

  // s25 极简与扁平：细线苹果 vs 扁平小人
  { id: 's25',
    css: `.subject{position:absolute;left:26%;top:34%;width:20vmin;height:22vmin}
.apple25{position:absolute;inset:0;border:.7vmin solid ${CREAM};border-radius:10vmin 10vmin 12vmin 12vmin}
.leaf25{position:absolute;right:-1vmin;top:-5vmin;width:7vmin;height:3.4vmin;border-radius:0 4vmin 0 4vmin;border:.7vmin solid ${CREAM};transform:rotate(-24deg)}
.flat25{position:absolute;right:20%;top:36%;width:12vmin;height:12vmin}
.fh25{width:5.4vmin;height:5.4vmin;border-radius:50%;background:${RED};margin:0 auto}
.fb25{width:11vmin;height:12vmin;border-radius:2.4vmin;background:${YEL};margin-top:.8vmin}
.flat25.f2{right:6%;top:44%;transform:scale(.82)}
.f2 .fh25{background:${DIM}}.f2 .fb25{background:${MID}}`,
    markup: `<div class="subject"><div class="apple25"></div><div class="leaf25"></div></div>
<div class="flat25 f1"><div class="fh25"></div><div class="fb25"></div></div>
<div class="flat25 f2"><div class="fh25"></div><div class="fb25"></div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:800,from:{opacity:0,scale:.85}});
MV.enter('.leaf25',{easing:'back.out(2.2)',duration:400,delay:600,from:{opacity:0,scale:0,rotation:-60}});
MV.enter('.flat25',{easing:'back.out(1.8)',duration:600,stagger:200,delay:800,from:{opacity:0,yPercent:50}});
MV.idle('.flat25',{delay:1600});` },

  // s26 对称与暗调：粉调拱门 × 百叶窗影
  { id: 's26',
    css: `.arch26{position:absolute;left:18%;top:22%;width:26vmin;height:44vmin}
.ap26{position:absolute;left:50%;bottom:0;width:20vmin;height:30vmin;transform:translateX(-50%);background:${PALE};border-radius:10vmin 10vmin 0 0;opacity:.92}
.ab26{position:absolute;left:0;bottom:0;width:26vmin;height:6vmin;background:${MID};border-radius:.6vmin}
.blind{position:absolute;right:10%;top:12%;width:34vmin;height:56vmin;background:repeating-linear-gradient(180deg,${DEEP} 0 5vmin,#0d0b0a 5vmin 7vmin);border:1px solid ${DIM}}
.beam26{position:absolute;right:10%;top:12%;width:34vmin;height:56vmin;background:linear-gradient(115deg,transparent 40%,${CREAM}18 52%,transparent 64%)}`,
    markup: `<div class="arch26 subject"><div class="ap26"></div><div class="ab26"></div></div>
<div class="blind"></div><div class="beam26"></div>`,
    anim: `MV.enter('.arch26',{easing:'power2.out',duration:600,from:{opacity:0,scale:.9,transformOrigin:'center bottom'}});
MV.enter('.blind',{easing:'power2.out',duration:600,delay:500,from:{opacity:0,xPercent:30}});
MV.enter('.beam26',{easing:'sine.inOut',duration:2000,delay:900,from:{opacity:0,xPercent:-30}});
MV.idle('.beam26',{delay:2000});` },

  // s27 招即来：旋转招牌与铜铃
  { id: 's27',
    css: `.pole27{position:absolute;left:50%;bottom:10%;width:2.6vmin;height:44vmin;transform:translateX(-50%);border-radius:1.4vmin;background:${DIM}}
.subject{position:absolute;left:50%;top:22%;transform:translateX(-50%);padding:2vmin 3.4vmin;border-radius:1.2vmin;background:linear-gradient(180deg,${RED},#7f1d1d);color:${CREAM};font-size:6.4vmin;font-weight:900;letter-spacing:1vmin;box-shadow:0 1.2vmin 0 #7f1d1d;transform-origin:top center}
.bell27{position:absolute;right:24%;top:30%;width:9vmin;height:9vmin}
.dome27{width:9vmin;height:7vmin;border-radius:9vmin 9vmin 0 0;background:radial-gradient(circle at 36% 30%,${YEL},#a16207)}
.dbl27{position:absolute;left:-1vmin;bottom:0;width:11vmin;height:1.6vmin;border-radius:1vmin;background:#a16207}
.dot27{position:absolute;left:50%;bottom:-2.6vmin;width:2vmin;height:2vmin;margin-left:-1vmin;border-radius:50%;background:${PALE}}`,
    markup: `<div class="pole27"></div><div class="subject">招即来</div>
<div class="bell27"><div class="dome27"></div><div class="dbl27"></div><div class="dot27"></div></div>`,
    anim: `MV.enter('.subject',{easing:'back.out(2.2)',duration:800,from:{opacity:0,yPercent:-80,rotation:-12}});
MV.enter('.pole27',{easing:'power2.out',duration:600,from:{opacity:0,scaleY:.2,transformOrigin:'bottom center'}});
MV.enter('.bell27',{easing:'back.out(2.2)',duration:600,delay:700,from:{opacity:0,rotation:24,yPercent:-30}});
MV.emphasis('.bell27',{duration:1200});
MV.idle('.subject',{delay:1500});` },

  // s28 只此一次：大红日历盖「1」
  { id: 's28',
    css: `.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-2deg);width:38vmin;height:44vmin;border-radius:1.4vmin;background:${CREAM};box-shadow:1.4vmin 1.6vmin 0 ${DIM}}
.head28{position:absolute;left:0;top:0;width:100%;height:10vmin;border-radius:1.4vmin 1.4vmin 0 0;background:${RED}}
.ring28{position:absolute;top:-2.4vmin;width:3vmin;height:5vmin;border-radius:1.6vmin;background:${DIM}}
.g1{left:8vmin}.g2{right:8vmin}
.big28{position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);font-size:20vmin;font-weight:900;color:${RED}}
.stamp28{position:absolute;right:3.4vmin;bottom:3.4vmin;width:8vmin;height:8vmin;border-radius:1vmin;border:.7vmin solid ${YEL};color:${YEL};font-size:3.6vmin;font-weight:900;display:flex;align-items:center;justify-content:center;transform:rotate(-10deg)}`,
    markup: `<div class="subject"><div class="head28"></div><div class="ring28 g1"></div><div class="ring28 g2"></div>
<div class="big28">1</div><div class="stamp28">仅一次</div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:-40,rotation:-10}});
MV.enter('.big28',{easing:'back.out(2.2)',duration:600,delay:700,from:{opacity:0,scale:2}});
MV.enter('.stamp28',{easing:'power2.in',duration:300,delay:1300,from:{opacity:0,scale:2.6}});
MV.emphasis('.stamp28',{duration:1200});` },

  // s29 三关谈拢：素材/风格/批注三张卡扇形展开
  { id: 's29',
    css: `.table29{position:absolute;left:50%;bottom:12%;width:70vmin;height:3vmin;transform:translateX(-50%);border-radius:1vmin;background:${DIM}}
.subject{position:absolute;left:50%;top:46%;width:20vmin;height:26vmin;transform:translate(-50%,-50%);border-radius:1.4vmin;background:${CREAM};box-shadow:1vmin 1.2vmin 0 ${DIM};display:flex;align-items:flex-end;justify-content:center;padding-bottom:2vmin;font-size:4.4vmin;font-weight:900;color:${DEEP}}
.card29{position:absolute;top:46%;width:20vmin;height:26vmin;border-radius:1.4vmin;background:${CREAM};box-shadow:1vmin 1.2vmin 0 ${DIM};display:flex;align-items:flex-end;justify-content:center;padding-bottom:2vmin;font-size:4.4vmin;font-weight:900;color:${DEEP}}
.c1{left:50%;margin-left:-38vmin;transform:translateY(-50%) rotate(-14deg)}
.c3{left:50%;margin-left:18vmin;transform:translateY(-50%) rotate(14deg)}
.tab29{position:absolute;left:0;top:0;width:100%;height:5vmin;border-radius:1.4vmin 1.4vmin 0 0;background:${RED}}
.c2 .tab29,.subject .tab29{background:${YEL}}`,
    markup: `<div class="card29 c1"><div class="tab29"></div>素材</div>
<div class="subject"><div class="tab29"></div>风格</div>
<div class="card29 c3"><div class="tab29"></div>批注</div>
<div class="table29"></div>`,
    anim: `MV.enter('.card29',{easing:'back.out(1.8)',duration:800,stagger:240,from:{opacity:0,yPercent:50,rotation:0}});
MV.enter('.subject',{easing:'back.out(1.8)',duration:800,delay:480,from:{opacity:0,yPercent:50}});
MV.emphasis('.subject',{duration:1600});
MV.idle('.card29',{delay:1600});` },

  // s30 一张表谈拢：散纸汇聚成一张对齐的表
  { id: 's30',
    css: `.slip30{position:absolute;width:14vmin;height:9vmin;border-radius:.8vmin;background:${PALE};opacity:.9;box-shadow:.6vmin .8vmin 0 ${DIM}}
.s1{left:12%;top:22%;transform:rotate(-14deg)}.s2{right:14%;top:20%;transform:rotate(10deg)}.s3{left:16%;bottom:20%;transform:rotate(8deg)}
.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:46vmin;height:34vmin;border:1px solid ${DIM};border-radius:1vmin;background:${DEEP};
background-image:linear-gradient(${DIM} 1px,transparent 1px),linear-gradient(90deg,${DIM} 1px,transparent 1px);background-size:23vmin 11.4vmin}
.cell30{position:absolute;width:21vmin;height:10vmin;border-radius:.4vmin;background:${CREAM};opacity:.9}
.k1{left:1vmin;top:1vmin}.k2{right:1vmin;top:1vmin}.k3{left:1vmin;bottom:1vmin}.k4{right:1vmin;bottom:1vmin}`,
    markup: `<div class="slip30 s1"></div><div class="slip30 s2"></div><div class="slip30 s3"></div>
<div class="subject"><div class="cell30 k1"></div><div class="cell30 k2"></div><div class="cell30 k3"></div><div class="cell30 k4"></div></div>`,
    anim: `MV.enter('.slip30',{easing:'sine.out',duration:600,stagger:160,from:{opacity:0}});
MV.enter('.subject',{easing:'power3.inOut',duration:1200,delay:700,from:{opacity:0,scale:1.15}});
MV.enter('.cell30',{easing:'back.out(1.8)',duration:400,stagger:120,delay:1500,from:{opacity:0,scale:.4}});
MV.emphasis('.subject',{duration:1600});` },

  // s31 「准」字挂牌，铜钱入袖：点头才进场
  { id: 's31',
    css: `.rope31{position:absolute;left:50%;top:0;width:.6vmin;height:16vmin;margin-left:-.3vmin;background:${MID}}
.subject{position:absolute;left:50%;top:16%;width:26vmin;height:30vmin;transform:translateX(-50%);border-radius:1.6vmin;border:.9vmin solid ${RED};color:${RED};font-size:15vmin;font-weight:900;display:flex;align-items:center;justify-content:center;background:${DEEP}}
.coin31{position:absolute;left:20%;top:44%;width:9vmin;height:9vmin;border-radius:50%;background:radial-gradient(circle at 36% 32%,${YEL},#a16207);box-shadow:0 .8vmin 0 #7f1d1d}
.ch31{position:absolute;left:50%;top:50%;width:3vmin;height:3vmin;margin:-1.5vmin 0 0 -1.5vmin;border-radius:.4vmin;background:#7f1d1d}
.sleeve31{position:absolute;right:16%;bottom:16%;width:20vmin;height:14vmin;border-radius:2vmin 2vmin 0 0;background:${DEEP};border:1px solid ${DIM}}
.hand31{position:absolute;right:20%;bottom:28%;width:6vmin;height:4vmin;border-radius:2vmin;background:${MID}}`,
    markup: `<div class="rope31"></div><div class="subject">准</div>
<div class="coin31"><div class="ch31"></div></div>
<div class="hand31"></div><div class="sleeve31"></div>`,
    anim: `MV.enter('.subject',{easing:'expo.in',duration:600,from:{yPercent:-120,rotation:-6}});
MV.enter('.coin31',{easing:'power2.inOut',duration:1200,delay:800,from:{xPercent:-160,opacity:0,rotation:-180}});
MV.enter('.sleeve31',{easing:'power2.out',duration:600,delay:400,from:{opacity:0,yPercent:40}});
MV.emphasis('.subject',{duration:1600});` },

  // s32 讲究一个真字：巨笔与真字碑
  { id: 's32',
    css: `.stele{position:absolute;left:24%;top:24%;width:22vmin;height:48vmin;border-radius:1.4vmin;background:linear-gradient(180deg,${DEEP},#0d0b0a);border:1px solid ${DIM}}
.truth32{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);font-size:13vmin;font-weight:900;color:${RED};text-shadow:0 0 4vmin ${RED}55}
.subject{position:absolute;right:22%;top:12%;width:5vmin;height:50vmin;border-radius:2.6vmin;background:linear-gradient(180deg,#8a5a2b,${DEEP});transform-origin:bottom center}
.tip32{position:absolute;right:20.6%;top:58%;width:8vmin;height:11vmin;border-radius:50%/40% 40% 60% 60%;background:${DEEP}}
.drop32{position:absolute;right:38%;top:70%;width:2.4vmin;height:3vmin;border-radius:50%/60% 60% 40% 40%;background:${RED};opacity:.9}`,
    markup: `<div class="stele"><div class="truth32">真</div></div>
<div class="subject"></div><div class="tip32"></div><div class="drop32"></div>`,
    anim: `MV.enter('.stele',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:30}});
MV.enter('.truth32',{easing:'back.out(2.2)',duration:600,delay:600,from:{opacity:0,scale:1.8}});
MV.enter('.subject',{easing:'power2.inOut',duration:1200,from:{rotation:18,yPercent:-24}});
MV.enter('.drop32',{easing:'power1.in',duration:600,delay:1200,from:{opacity:0,scale:0}});
MV.emphasis('.truth32',{duration:1200});` },

  // s33 亲手原创：画框里笔触自己生长
  { id: 's33',
    css: `.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:44vmin;height:32vmin;border-radius:1vmin;border:1.6vmin solid ${CREAM};background:${DEEP};box-shadow:1.4vmin 1.6vmin 0 ${DIM},0 0 8vmin ${PALE}14}
.stroke33{position:absolute;left:4vmin;top:12vmin;height:8vmin;width:36vmin;border-radius:4vmin;background:linear-gradient(90deg,${RED},${YEL});transform-origin:left center}
.blob33{position:absolute;width:6vmin;height:6vmin;border-radius:50%;background:${RED};opacity:.9}
.b1{left:6vmin;bottom:3.6vmin}.b2{left:14vmin;bottom:4.4vmin;width:4vmin;height:4vmin;background:${YEL}}
.easel33{position:absolute;left:50%;bottom:6%;width:34vmin;height:1.6vmin;transform:translateX(-50%);border-radius:1vmin;background:${DIM}}`,
    markup: `<div class="subject"><div class="stroke33"></div><div class="blob33 b1"></div><div class="blob33 b2"></div></div>
<div class="easel33"></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.92}});
MV.enter('.stroke33',{easing:'expo.out',duration:1600,delay:400,from:{scaleX:0}});
MV.enter('.blob33',{easing:'back.out(2.2)',duration:400,stagger:200,delay:1600,from:{opacity:0,scale:0}});
MV.idle('.subject',{delay:2000});` },

  // s34 四道工序：读/看/画/成 四格漫画
  { id: 's34',
    css: `.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:52vmin;height:44vmin;border-radius:1.2vmin;background:${DEEP};border:1px solid ${DIM};
background-image:linear-gradient(${DIM} 1px,transparent 1px),linear-gradient(90deg,${DIM} 1px,transparent 1px);background-size:26vmin 22vmin}
.panel34{position:absolute;width:25vmin;height:21vmin;display:flex;align-items:center;justify-content:center;font-size:9vmin;font-weight:900;color:${PALE}}
.p1{left:0;top:0}.p2{right:0;top:0}.p3{left:0;bottom:0}.p4{right:0;bottom:0}
.p2{color:${YEL}}.p4{color:${RED}}
.pip34{position:absolute;left:2vmin;top:2vmin;width:4vmin;height:4vmin;border-radius:50%;background:${RED};opacity:.85}
.p2 .pip34{background:${YEL}}.p3 .pip34{background:${MID}}.p4 .pip34{background:${RED}}`,
    markup: `<div class="subject">
<div class="panel34 p1">读<div class="pip34"></div></div>
<div class="panel34 p2">看<div class="pip34"></div></div>
<div class="panel34 p3">画<div class="pip34"></div></div>
<div class="panel34 p4">成<div class="pip34"></div></div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.94}});
MV.enter('.panel34',{easing:'back.out(1.6)',duration:600,stagger:180,from:{opacity:0,yPercent:30,rotation:2}});
MV.emphasis('.panel34',{duration:1200});
MV.idle('.subject',{delay:1800});` },

  // s35 不过闸打回：闸门落下盖「退」章
  { id: 's35',
    css: `.paper35{position:absolute;left:50%;top:34%;transform:translateX(-50%);width:30vmin;height:22vmin;border-radius:1vmin;background:${CREAM};opacity:.95;transform:translateX(-50%) rotate(-3deg)}
.line35{position:absolute;left:3vmin;height:1vmin;border-radius:1vmin;background:${DEEP};opacity:.4}
.g1{top:5vmin;width:22vmin}.g2{top:9vmin;width:16vmin}.g3{top:13vmin;width:20vmin}
.subject{position:absolute;left:50%;top:30%;width:48vmin;height:44vmin;transform:translateX(-50%);
background:repeating-linear-gradient(90deg,${DIM} 0 3vmin,transparent 3vmin 6vmin);border:1px solid ${DIM};border-top:.8vmin solid ${RED}}
.stamp35{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%) rotate(-12deg);padding:1.4vmin 2.6vmin;border-radius:.8vmin;background:${RED};color:${CREAM};font-size:7vmin;font-weight:900;box-shadow:0 0 6vmin ${RED}55}`,
    markup: `<div class="paper35"><div class="line35 g1"></div><div class="line35 g2"></div><div class="line35 g3"></div></div>
<div class="subject"></div><div class="stamp35">退</div>`,
    anim: `MV.enter('.paper35',{easing:'power2.out',duration:600,from:{opacity:0,yPercent:-30}});
MV.enter('.subject',{easing:'power3.in',duration:600,delay:700,from:{yPercent:-160}});
MV.enter('.stamp35',{easing:'power2.in',duration:300,delay:1500,from:{opacity:0,scale:2.6}});
MV.emphasis('.stamp35',{duration:1200});` },

  // s36 模板只配垫桌脚：瘸腿桌子与垫纸
  { id: 's36',
    css: `.top36{position:absolute;left:18%;top:34%;width:56vmin;height:4vmin;border-radius:.8vmin;background:${DIM};transform:rotate(-6deg);transform-origin:right center}
.leg36{position:absolute;width:3vmin;height:34vmin;border-radius:.8vmin;background:${DEEP};border:1px solid ${DIM}}
.l1{right:22%;top:37%}.l2{left:20%;top:40%;transform:rotate(0deg)}
.subject{position:absolute;left:20%;top:72%;width:22vmin;height:14vmin;transform:rotate(-6deg)}
.paper36{position:absolute;bottom:0;width:20vmin;height:3.4vmin;border-radius:.6vmin;background:${PALE};opacity:.92}
.pp1{bottom:0}.pp2{bottom:3.4vmin;width:17vmin}.pp3{bottom:6.8vmin;width:14vmin}
.wob36{position:absolute;left:30%;top:20%;font-size:6vmin;color:${YEL};font-weight:900;opacity:0}`,
    markup: `<div class="top36"></div><div class="leg36 l1"></div><div class="leg36 l2"></div>
<div class="subject"><div class="paper36 pp1"></div><div class="paper36 pp2"></div><div class="paper36 pp3"></div></div>
<div class="wob36">!</div>`,
    anim: `MV.enter('.top36',{easing:'power2.out',duration:600,from:{opacity:0,rotation:-14}});
MV.enter('.leg36',{easing:'power2.out',duration:600,stagger:200,from:{opacity:0,yPercent:30}});
MV.enter('.subject',{easing:'back.out(1.8)',duration:600,delay:800,from:{opacity:0,yPercent:40}});
MV.enter('.wob36',{easing:'back.out(2.2)',duration:400,delay:1500,from:{opacity:0,scale:2.2,rotation:-14}});
MV.idle('.wob36',{delay:1900});` },
];

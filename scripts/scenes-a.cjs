// 逐镜原创场景 · 第一幕 s01-s19（钩子 / 本质 / 视界）— 原语语法：enter(入场)/idle/emphasis/performance/camera
const PRI = '#7dd3fc', ACC = '#fbbf24', INK = '#f8fafc', MID = '#94a3b8', DEEP = '#1e293b', BG = '#05070f';

module.exports = [
  // s01 定场：星海中一个吞光的圆
  { id: 's01',
    css: `.stars{position:absolute;inset:0}.stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:${INK};opacity:.8}
.subject{position:absolute;left:50%;top:46%;width:22vmin;height:22vmin;margin:-11vmin;border-radius:50%;background:#000;box-shadow:0 0 60px 10px rgba(125,211,252,.15),inset 0 0 30px #000}
.halo{position:absolute;left:50%;top:46%;width:30vmin;height:30vmin;margin:-15vmin;border-radius:50%;border:1px solid ${PRI}33}`,
    markup: `<div class="stars"><i style="left:12%;top:22%"></i><i style="left:30%;top:64%"></i><i style="left:68%;top:18%"></i><i style="left:82%;top:48%"></i><i style="left:55%;top:78%"></i><i style="left:22%;top:40%"></i><i style="left:74%;top:70%"></i></div>
<div class="halo"></div><div class="subject"></div>`,
    anim: `MV.enter('.stars i',{easing:'sine.out',duration:1600,stagger:120,from:{opacity:0}});
MV.enter('.halo',{easing:'power2.out',duration:800,from:{opacity:0,scale:1.6}});
MV.enter('.subject',{easing:'power2.in',duration:1200,from:{opacity:0,scale:.5}});
MV.idle('.halo',{delay:1600});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s02 光也无法逃脱：光线坠入
  { id: 's02',
    css: `.subject{position:absolute;left:50%;top:52%;width:18vmin;height:18vmin;margin:-9vmin;border-radius:50%;background:#000;box-shadow:0 0 50px 8px rgba(251,191,36,.12)}
.ray{position:absolute;left:50%;top:-8%;width:2px;height:46%;background:linear-gradient(to bottom,transparent,${ACC});transform-origin:bottom center}
.ray.r2{transform:rotate(38deg)}.ray.r3{transform:rotate(-38deg)}
.tip{position:absolute;left:49%;top:2%;width:10px;height:10px;border-radius:50%;background:${ACC};box-shadow:0 0 18px ${ACC}}`,
    markup: `<div class="ray"></div><div class="ray r2"></div><div class="ray r3"></div><div class="subject"></div><div class="tip"></div>`,
    anim: `MV.enter('.ray',{easing:'sine.out',duration:1600,stagger:200,from:{opacity:0,scaleY:.2}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.7}});
MV.enter('.tip',{easing:'power2.in',duration:1600,from:{opacity:0,yPercent:-120,scale:1.6}});
MV.idle('.subject',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s03 不发光不反射：亮星黯淡，黑球无反光
  { id: 's03',
    css: `.orb{position:absolute;top:30%;width:14vmin;height:14vmin;border-radius:50%;opacity:.12}
.o1{left:14%;background:radial-gradient(circle at 35% 35%,${INK},${MID})}
.o2{left:43%;top:26%;background:radial-gradient(circle at 35% 35%,${PRI},${MID})}
.subject{left:72%;top:28%;position:absolute;width:16vmin;height:16vmin;border-radius:50%;background:#000;border:1px solid ${DEEP}}
.sweep{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,${INK}14 50%,transparent 70%)}`,
    markup: `<div class="sweep"></div><div class="orb o1"></div><div class="orb o2"></div><div class="subject"></div>`,
    anim: `MV.enter('.orb',{easing:'power2.in',duration:1200,stagger:150,from:{opacity:1}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.sweep',{easing:'sine.inOut',duration:2000,from:{opacity:0,xPercent:-40}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s04 改变方向：四方箭头旋入对准黑点
  { id: 's04',
    css: `.subject{position:absolute;left:50%;top:50%;width:14vmin;height:14vmin;margin:-7vmin;border-radius:50%;background:#000;box-shadow:0 0 44px rgba(125,211,252,.2)}
.arrow{position:absolute;width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent}
.al{left:10%;top:46%;border-right:16px solid ${MID}}
.ar{right:10%;top:46%;border-left:16px solid ${MID}}
.au{left:48.6%;top:14%;border-bottom:16px solid ${MID};border-left:9px solid transparent;border-right:9px solid transparent}
.ab{left:48.6%;bottom:14%;border-top:16px solid ${MID};border-left:9px solid transparent;border-right:9px solid transparent}`,
    markup: `<div class="arrow al"></div><div class="arrow ar"></div><div class="arrow au"></div><div class="arrow ab"></div><div class="subject"></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.6}});
MV.enter('.arrow',{easing:'power2.inOut',duration:1200,stagger:150,from:{opacity:0,rotation:180,scale:.2}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s05 时间放慢：表针飞转渐停
  { id: 's05',
    css: `.face{position:absolute;left:50%;top:50%;width:44vmin;height:44vmin;margin:-22vmin;border-radius:50%;border:2px solid ${MID};background:radial-gradient(circle,${DEEP},${BG})}
.tick{position:absolute;left:50%;top:6%;width:2px;height:8%;background:${MID};transform-origin:50% 610%}
.hand{position:absolute;left:50%;top:26%;width:3px;height:24%;background:${ACC};transform-origin:50% 140%;border-radius:2px}
.subject{position:absolute;left:50%;top:50%;width:4vmin;height:4vmin;margin:-2vmin;border-radius:50%;background:${PRI}}`,
    markup: `<div class="face"><div class="tick" style="transform:rotate(0deg)"></div><div class="tick" style="transform:rotate(90deg)"></div><div class="tick" style="transform:rotate(180deg)"></div><div class="tick" style="transform:rotate(270deg)"></div><div class="hand"></div><div class="subject"></div></div>`,
    anim: `MV.enter('.face',{easing:'power2.out',duration:600,from:{opacity:0,scale:.8}});
MV.enter('.hand',{easing:'power4.out',duration:2000,from:{rotation:-1400}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s06 这就是黑洞：命名揭幕
  { id: 's06',
    css: `.ring{position:absolute;left:50%;top:48%;width:40vmin;height:40vmin;margin:-20vmin;border-radius:50%;border:2px solid ${ACC};opacity:.9}
.subject{position:absolute;left:50%;top:48%;width:100%;margin:-8vmin 0 0 -50%;text-align:center;font-size:15vmin;font-weight:800;color:${INK};letter-spacing:2vmin;text-shadow:0 0 40px rgba(125,211,252,.35)}`,
    markup: `<div class="ring"></div><div class="subject">黑洞</div>`,
    anim: `MV.enter('.ring',{easing:'power2.out',duration:800,from:{opacity:0,scale:1.8}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:1.4}});
MV.emphasis('.subject',{duration:1200});
MV.idle('.ring',{delay:1600});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s07 物理学挑战：公式碎片与问号
  { id: 's07',
    css: `.eq{position:absolute;color:${MID};font-size:4.5vmin;font-style:italic;opacity:.85}
.e1{left:12%;top:20%}.e2{left:64%;top:30%}.e3{left:22%;top:66%}.e4{left:70%;top:70%}
.subject{position:absolute;left:50%;top:48%;width:16vmin;height:16vmin;margin:-8vmin;border-radius:50%;background:${DEEP};color:${ACC};font-size:9vmin;font-weight:800;text-align:center;line-height:16vmin;box-shadow:0 0 50px rgba(251,191,36,.25)}`,
    markup: `<div class="eq e1">G=8πT</div><div class="eq e2">Rμν</div><div class="eq e3">Λg</div><div class="eq e4">ħω</div><div class="subject">?</div>`,
    anim: `MV.enter('.eq',{easing:'sine.out',duration:800,stagger:180,from:{opacity:0,y:-30}});
MV.enter('.subject',{easing:'back.out',duration:800,from:{opacity:0,scale:.3}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s08 引力的胜利：绳被拽向引力侧
  { id: 's08',
    css: `.rope{position:absolute;left:18%;top:50%;width:64%;height:4px;background:${MID};border-radius:2px}
.a{position:absolute;top:34%;width:20vmin;height:20vmin;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:3.6vmin;font-weight:700}
.left{left:8%;background:${DEEP};color:${MID};border:1px solid ${MID}}
.subject{right:8%;background:#000;color:${ACC};border:1px solid ${ACC};box-shadow:0 0 40px rgba(251,191,36,.25)}`,
    markup: `<div class="a left">辐射压</div><div class="rope"></div><div class="a subject">引力</div>`,
    anim: `MV.enter('.a',{easing:'power2.out',duration:600,stagger:200,from:{opacity:0,y:-30}});
MV.enter('.rope',{easing:'power3.in',duration:1200,from:{opacity:0,xPercent:-22,scaleX:.7}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s09 物质压缩：点云向中心凝聚
  { id: 's09',
    css: `.cloud{position:absolute;left:50%;top:48%;width:56vmin;height:56vmin;margin:-28vmin}
.cloud i{position:absolute;width:6px;height:6px;border-radius:50%;background:${PRI};opacity:.9}
.subject{position:absolute;left:50%;top:48%;width:3vmin;height:3vmin;margin:-1.5vmin;border-radius:50%;background:#000;box-shadow:0 0 30px 4px rgba(125,211,252,.5)}`,
    markup: `<div class="cloud"><i style="left:4%;top:50%"></i><i style="left:96%;top:46%"></i><i style="left:50%;top:6%"></i><i style="left:46%;top:94%"></i><i style="left:16%;top:14%"></i><i style="left:82%;top:18%"></i><i style="left:14%;top:82%"></i><i style="left:84%;top:84%"></i><i style="left:30%;top:30%"></i><i style="left:68%;top:66%"></i></div>
<div class="subject"></div>`,
    anim: `MV.enter('.cloud',{easing:'power2.inOut',duration:2000,from:{opacity:0,scale:2.4}});
MV.enter('.cloud i',{easing:'power2.inOut',duration:2000,stagger:80,from:{opacity:0,scale:0}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s10 扭曲时空：同心环向深井偏心
  { id: 's10',
    css: `.well{position:absolute;left:50%;top:56%;width:60vmin;height:60vmin;margin:-30vmin;border-radius:50%;background:radial-gradient(circle,#000 18%,transparent 62%)}
.ring{position:absolute;left:50%;top:56%;border-radius:50%;border:1px solid ${PRI}44;margin-left:-20vmin;width:40vmin;height:40vmin}
.r2{width:28vmin;height:28vmin;margin-left:-14vmin;margin-top:6vmin}
.r3{width:16vmin;height:16vmin;margin-left:-8vmin;margin-top:12vmin}
.subject{position:absolute;left:50%;top:56%;width:8vmin;height:8vmin;margin:-4vmin;border-radius:50%;background:#000;box-shadow:0 0 34px rgba(125,211,252,.3)}`,
    markup: `<div class="ring"></div><div class="ring r2"></div><div class="ring r3"></div><div class="well"></div><div class="subject"></div>`,
    anim: `MV.enter('.ring',{easing:'sine.out',duration:800,stagger:180,from:{opacity:0}});
MV.enter('.well',{easing:'power2.out',duration:1200,from:{opacity:0,scale:.6}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.idle('.well',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s11 事件视界：边界环落定
  { id: 's11',
    css: `.subject{position:absolute;left:50%;top:48%;width:30vmin;height:30vmin;margin:-15vmin;border-radius:50%;background:#000;box-shadow:0 0 60px 12px rgba(0,0,0,.9)}
.boundary{position:absolute;left:50%;top:48%;width:40vmin;height:40vmin;margin:-20vmin;border-radius:50%;border:2px dashed ${ACC}}
.tag{position:absolute;left:50%;top:78%;transform:translateX(-50%);color:${ACC};font-size:3.4vmin;letter-spacing:1vmin;opacity:.7}`,
    markup: `<div class="subject"></div><div class="boundary"></div><div class="tag">视界</div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.boundary',{easing:'power2.out',duration:1200,from:{opacity:0,scale:1.5}});
MV.enter('.tag',{easing:'sine.out',duration:600,delay:1200,from:{opacity:0,y:-20}});
MV.idle('.boundary',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s12 越过这条线：光子飞入环心消隐
  { id: 's12',
    css: `.boundary{position:absolute;left:50%;top:50%;width:36vmin;height:36vmin;margin:-18vmin;border-radius:50%;border:2px solid ${ACC}}
.subject{position:absolute;left:4%;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:${PRI};box-shadow:0 0 20px ${PRI}}
.flash{position:absolute;left:50%;top:50%;width:40vmin;height:40vmin;margin:-20vmin;border-radius:50%;background:radial-gradient(circle,${ACC}22,transparent 60%)}`,
    markup: `<div class="boundary"></div><div class="flash"></div><div class="subject"></div>`,
    anim: `MV.enter('.boundary',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.in',duration:1600,from:{opacity:0,xPercent:-260,scale:1.5}});
MV.emphasis('.flash',{duration:1200});
MV.idle('.flash',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s13 无法回头：单向漏斗
  { id: 's13',
    css: `.funnel{position:absolute;left:50%;top:50%;width:52vmin;height:30vmin;margin:-15vmin 0 0 -26vmin;
background:linear-gradient(180deg,transparent 0 8%,${DEEP} 8% 100%);
clip-path:polygon(0 0,100% 0,58% 100%,42% 100%)}
.door{position:absolute;left:50%;top:80%;width:9vmin;height:1.6vmin;margin-left:-4.5vmin;background:${ACC};opacity:.85}
.subject{position:absolute;left:12%;top:44%;width:2.6vmin;height:2.6vmin;border-radius:50%;background:${PRI};box-shadow:0 0 18px ${PRI}}
.tag{position:absolute;left:50%;top:12%;transform:translateX(-50%);color:${MID};font-size:3.2vmin;opacity:.7}`,
    markup: `<div class="tag">单向</div><div class="funnel"></div><div class="door"></div><div class="subject"></div>`,
    anim: `MV.enter('.funnel',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.door',{easing:'sine.out',duration:400,delay:600,from:{opacity:0,scaleX:0}});
MV.enter('.subject',{easing:'power2.in',duration:1600,from:{opacity:0,yPercent:-30}});
MV.idle('.door',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s14 外部观测者：望远镜对准深空
  { id: 's14',
    css: `.scope{position:absolute;left:14%;bottom:16%;width:34vmin;height:10vmin}
.tube{position:absolute;left:0;top:0;width:30vmin;height:6vmin;background:${DEEP};border-radius:3vmin;transform:rotate(-18deg)}
.leg{position:absolute;left:12vmin;top:5vmin;width:1.6vmin;height:9vmin;background:${DEEP};transform:rotate(16deg)}
.sky{position:absolute;right:12%;top:30%;width:26vmin;height:26vmin;border-radius:50%;background:#000;box-shadow:0 0 44px rgba(125,211,252,.14);border:1px solid ${DEEP}}
.beam{position:absolute;left:36%;bottom:34%;width:30vmin;height:2px;background:linear-gradient(to right,${PRI}55,transparent);transform:rotate(-14deg);transform-origin:left center}`,
    markup: `<div class="beam"></div><div class="sky subject"></div><div class="scope"><div class="tube"></div><div class="leg"></div></div>`,
    anim: `MV.enter('.sky',{easing:'power2.out',duration:800,from:{opacity:0,scale:.7}});
MV.enter('.beam',{easing:'sine.out',duration:1200,delay:800,from:{opacity:0,scaleX:0}});
MV.idle('.sky',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s15 绝对孤独：大空镜小黑点
  { id: 's15',
    css: `.stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:${MID}}
.subject{position:absolute;left:50%;top:64%;width:7vmin;height:7vmin;margin:-3.5vmin;border-radius:50%;background:#000;box-shadow:0 0 30px 4px rgba(0,0,0,.8),0 0 10px rgba(125,211,252,.1)}`,
    markup: `<div class="stars"><i style="left:20%;top:20%"></i><i style="left:70%;top:14%"></i><i style="left:84%;top:60%"></i><i style="left:12%;top:70%"></i><i style="left:50%;top:10%"></i></div>
<div class="subject"></div>`,
    anim: `MV.enter('.stars i',{easing:'sine.out',duration:2000,stagger:300,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.in',duration:1600,from:{opacity:0,scale:2.4}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s16 定律逼到极限：弯折的标尺抵到红线
  { id: 's16',
    css: `.rule{position:absolute;left:14%;top:50%;width:72%;height:1vmin;margin-top:-.5vmin;background:repeating-linear-gradient(90deg,${MID} 0 2vmin,transparent 2vmin 3vmin);border-radius:.5vmin;transform:rotate(22deg);transform-origin:left center}
.lim{position:absolute;left:76%;top:30%;width:.6vmin;height:40%;background:${ACC};opacity:.7}
.subject{position:absolute;left:50%;top:22%;width:13vmin;height:13vmin;margin:-6.5vmin;border-radius:50%;background:#000;border:1px solid ${PRI}44;box-shadow:0 0 34px rgba(125,211,252,.2)}`,
    markup: `<div class="subject"></div><div class="rule"></div><div class="lim"></div>`,
    anim: `MV.enter('.rule',{easing:'power2.in',duration:1600,from:{scaleX:0,rotation:0}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.6}});
MV.emphasis('.lim',{duration:1200});
MV.idle('.lim',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s17 拉成面条：球体黯淡，细丝拉长
  { id: 's17',
    css: `.ball{position:absolute;left:50%;top:44%;width:14vmin;height:14vmin;margin:-7vmin;border-radius:50%;background:radial-gradient(circle at 38% 34%,${PRI},${DEEP});opacity:.15}
.subject{position:absolute;left:50%;top:44%;width:14vmin;height:14vmin;margin:-7vmin;border-radius:50%;background:radial-gradient(circle at 50% 20%,${PRI},${DEEP});transform:scaleY(4.2) scaleX(.22)}
.floor{position:absolute;left:20%;bottom:18%;width:60%;height:1px;background:${MID};opacity:.5}`,
    markup: `<div class="floor"></div><div class="ball"></div><div class="subject"></div>`,
    anim: `MV.enter('.ball',{easing:'power2.in',duration:1200,from:{opacity:1}});
MV.enter('.subject',{easing:'power2.in',duration:1200,from:{opacity:0,scaleY:1,scaleX:1}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s18 双钟对比：远钟匀旋，近钟滞缓
  { id: 's18',
    css: `.clock{position:absolute;top:36%;width:30vmin;height:30vmin;border-radius:50%;border:2px solid ${MID}}
.far{left:8%}.subject{right:8%;border-color:${ACC};box-shadow:0 0 40px rgba(251,191,36,.18)}
.hand{position:absolute;left:50%;top:8%;width:3px;height:42%;transform-origin:50% 100%;border-radius:2px}
.far .hand{background:${MID}}.subject .hand{background:${ACC}}
.tag{position:absolute;top:74%;font-size:3vmin;opacity:.7;color:${MID}}
.t1{left:16%}.t2{right:16%;color:${ACC}}`,
    markup: `<div class="clock far"><div class="hand"></div></div><div class="clock subject"><div class="hand"></div></div>
<div class="tag t1">远方</div><div class="tag t2">视界</div>`,
    anim: `MV.enter('.clock',{easing:'power2.out',duration:600,stagger:200,from:{opacity:0,scale:.7}});
MV.enter('.far .hand',{easing:'none',duration:2000,from:{rotation:-1080}});
MV.enter('.subject .hand',{easing:'power4.out',duration:2000,from:{rotation:-34}});
MV.idle('.subject',{delay:2200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s19 外部观察者：窗框内的目击
  { id: 's19',
    css: `.win{position:absolute;left:50%;top:50%;width:56vmin;height:36vmin;margin:-18vmin 0 0 -28vmin;border:2px solid ${MID};border-radius:8px;background:radial-gradient(circle at 62% 46%,${DEEP},${BG})}
.subject{position:absolute;left:62%;top:46%;width:10vmin;height:10vmin;margin:-5vmin;border-radius:50%;background:#000;box-shadow:0 0 26px rgba(125,211,252,.16)}
.bar{position:absolute;left:50%;top:50%;width:2px;height:36vmin;margin:-18vmin 0 0 -1px;background:${MID};opacity:.35}`,
    markup: `<div class="win"><div class="bar"></div><div class="subject"></div></div>`,
    anim: `MV.enter('.win',{easing:'power2.out',duration:800,from:{opacity:0,scale:.9}});
MV.enter('.subject',{easing:'power2.out',duration:1200,delay:600,from:{opacity:0,scale:.5}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },
];

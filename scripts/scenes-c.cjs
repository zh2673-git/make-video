// 逐镜原创场景 · 第三幕 s39-s56（质量谱系 / 银河中心 / 成像 / 终幕）
const PRI = '#7dd3fc', ACC = '#fbbf24', INK = '#f8fafc', MID = '#94a3b8', DEEP = '#1e293b', BG = '#05070f';

module.exports = [
  // s39 质量谱：横条对比 ×1/×10/×50
  { id: 's39',
    css: `.axis{position:absolute;left:16%;top:26%;bottom:26%;width:1px;background:${MID};opacity:.5}
.row{position:absolute;left:17%;height:5vmin;border-radius:.8vmin;background:linear-gradient(to right,${PRI},${PRI}55)}
.r1{top:30%;width:8%}.r2{top:44%;width:34%}
.subject{top:58%;width:70%;background:linear-gradient(to right,${ACC},${ACC}55)}
.lb{position:absolute;left:88%;font-size:2.8vmin;color:${MID};opacity:.75;margin-top:.6vmin}
.l1{top:30%}.l2{top:44%}.l3{top:58%;color:${ACC}}`,
    markup: `<div class="axis"></div><div class="row r1"></div><div class="row r2"></div><div class="row subject"></div>
<div class="lb l1">×1</div><div class="lb l2">×10</div><div class="lb l3">×50</div>`,
    anim: `MV.enter('.axis',{easing:'sine.out',duration:400,from:{opacity:0,scaleY:0}});
MV.enter('.row',{easing:'power2.out',duration:1200,stagger:250,from:{opacity:0,scaleX:0}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s40 星系中心：旋臂与亮核
  { id: 's40',
    css: `.gal{position:absolute;left:50%;top:50%;width:64vmin;height:64vmin;margin:-32vmin}
.arm{position:absolute;left:50%;top:50%;width:56vmin;height:22vmin;margin:-11vmin 0 0 -28vmin;border:1px solid ${MID}44;border-radius:50%;transform:rotate(28deg)}
.a2{transform:rotate(118deg)}.a3{transform:rotate(208deg)}.a4{transform:rotate(298deg)}
.subject{position:absolute;left:50%;top:50%;width:10vmin;height:10vmin;margin:-5vmin;border-radius:50%;background:radial-gradient(circle,${ACC},${ACC}44);box-shadow:0 0 60px rgba(251,191,36,.5)}`,
    markup: `<div class="gal"><div class="arm"></div><div class="arm a2"></div><div class="arm a3"></div><div class="arm a4"></div><div class="subject"></div></div>`,
    anim: `MV.enter('.arm',{easing:'sine.out',duration:1600,stagger:150,from:{opacity:0,scale:.4}});
MV.enter('.subject',{easing:'power2.out',duration:800,delay:800,from:{opacity:0,scale:.2}});
MV.idle('.subject',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s41 质量阶梯：逐级放大的圆
  { id: 's41',
    css: `.step{position:absolute;bottom:16%;border-radius:50%;border:1px solid ${PRI}66}
.s1{left:10%;width:4vmin;height:4vmin;background:${ACC}}
.s2{left:28%;width:10vmin;height:10vmin}
.subject{left:48%;width:22vmin;height:22vmin;border-color:${ACC};background:radial-gradient(circle,#000 30%,transparent 70%)}
.s4{left:76%;width:16vmin;height:16vmin;opacity:.5}`,
    markup: `<div class="step s1"></div><div class="step s2"></div><div class="step subject"></div><div class="step s4"></div>`,
    anim: `MV.enter('.step',{easing:'back.out',duration:800,stagger:250,from:{opacity:0,scale:.2}});
MV.emphasis('.subject',{duration:1200});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s42 超大质量：占满画面的视界
  { id: 's42',
    css: `.subject{position:absolute;left:50%;top:50%;width:56vmin;height:56vmin;margin:-28vmin;border-radius:50%;background:#000;box-shadow:0 0 90px 20px rgba(0,0,0,.95),0 0 26px rgba(125,211,252,.2)}
.ring{position:absolute;left:50%;top:50%;width:64vmin;height:64vmin;margin:-32vmin;border-radius:50%;border:2px solid ${ACC}88}
.stars i{position:absolute;width:2px;height:2px;border-radius:50%;background:${MID}}`,
    markup: `<div class="stars"><i style="left:8%;top:12%"></i><i style="left:90%;top:20%"></i><i style="left:12%;top:86%"></i><i style="left:86%;top:80%"></i></div>
<div class="ring"></div><div class="subject"></div>`,
    anim: `MV.enter('.stars i',{easing:'sine.out',duration:1600,stagger:200,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.in',duration:2000,from:{opacity:0,scale:.4}});
MV.enter('.ring',{easing:'power2.out',duration:1200,delay:1000,from:{opacity:0}});
MV.idle('.ring',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s43 掌控演化：核周有序轨道
  { id: 's43',
    css: `.orbit{position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid ${PRI}44;margin:-16vmin 0 0 -16vmin;width:32vmin;height:32vmin}
.o2{width:48vmin;height:48vmin;margin:-24vmin 0 0 -24vmin}
.subject{position:absolute;left:50%;top:50%;width:8vmin;height:8vmin;margin:-4vmin;border-radius:50%;background:radial-gradient(circle,${ACC},${ACC}33);box-shadow:0 0 44px rgba(251,191,36,.4)}
.dot{position:absolute;left:50%;top:50%;width:1.6vmin;height:1.6vmin;margin:-0.8vmin;border-radius:50%;background:${INK}}`,
    markup: `<div class="orbit"></div><div class="orbit o2"></div><div class="dot"></div><div class="subject"></div>`,
    anim: `MV.enter('.orbit',{easing:'sine.out',duration:800,stagger:200,from:{opacity:0,scale:.6}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.3}});
MV.idle('.dot',{delay:1400});
MV.idle('.subject',{delay:1600});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s44 决定恒星配额：亮区与暗区
  { id: 's44',
    css: `.zone{position:absolute;top:24%;bottom:24%;width:34%;border-radius:14px}
.z1{left:10%;background:linear-gradient(160deg,${PRI}33,${PRI}0d);border:1px solid ${PRI}55}
.subject{right:10%;background:${DEEP};border:1px solid ${MID}44}
.core{position:absolute;left:50%;top:50%;width:7vmin;height:7vmin;margin:-3.5vmin;border-radius:50%;background:radial-gradient(circle,${ACC},${ACC}33)}
.lit i{position:absolute;width:1.4vmin;height:1.4vmin;border-radius:50%;background:${PRI}}`,
    markup: `<div class="zone z1"><div class="lit"><i style="left:18%;top:20%"></i><i style="left:52%;top:38%"></i><i style="left:30%;top:62%"></i><i style="left:66%;top:74%"></i></div></div>
<div class="zone subject"></div><div class="core"></div>`,
    anim: `MV.enter('.zone',{easing:'power2.out',duration:800,stagger:200,from:{opacity:0}});
MV.enter('.core',{easing:'power2.out',duration:600,from:{opacity:0,scale:.4}});
MV.enter('.lit i',{easing:'sine.out',duration:1200,delay:800,stagger:150,from:{opacity:0}});
MV.idle('.burst',{delay:2200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s45 银河系中心：斜贯的星带
  { id: 's45',
    css: `.band{position:absolute;left:-10%;top:52%;width:120%;height:16vmin;background:linear-gradient(90deg,transparent,${DEEP} 30%,${DEEP} 70%,transparent);transform:rotate(-9deg)}
.dust{position:absolute;width:2px;height:2px;border-radius:50%;background:${INK};opacity:.7}
.subject{position:absolute;left:50%;top:58%;width:9vmin;height:9vmin;margin:-4.5vmin;border-radius:50%;background:radial-gradient(circle,${ACC},${ACC}22);box-shadow:0 0 70px 18px rgba(251,191,36,.35)}`,
    markup: `<div class="band"></div>
<div class="dust" style="left:20%;top:56%"></div><div class="dust" style="left:34%;top:60%"></div><div class="dust" style="left:62%;top:54%"></div><div class="dust" style="left:78%;top:58%"></div>
<div class="subject"></div>`,
    anim: `MV.enter('.band',{easing:'power2.out',duration:1200,from:{opacity:0,y:-30}});
MV.enter('.dust',{easing:'sine.out',duration:1600,stagger:200,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.out',duration:1200,delay:600,from:{opacity:0,scale:.3}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s46 四百三十万倍：数字读出
  { id: 's46',
    css: `.ring{position:absolute;left:50%;top:46%;width:30vmin;height:30vmin;margin:-15vmin;border-radius:50%;border:2px solid ${ACC}77}
.subject{position:absolute;left:50%;top:46%;width:22vmin;height:22vmin;margin:-11vmin;border-radius:50%;background:#000;box-shadow:0 0 40px rgba(0,0,0,.9)}
.num{position:absolute;left:50%;top:74%;transform:translateX(-50%);color:${INK};font-size:6.4vmin;font-weight:800;letter-spacing:.3vmin}
.unit{color:${ACC}}`,
    markup: `<div class="ring"></div><div class="subject"></div><div class="num">430<span class="unit">万倍</span></div>`,
    anim: `MV.enter('.ring',{easing:'power2.out',duration:800,from:{opacity:0,scale:1.6}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.emphasis('.num',{duration:1200});
MV.idle('.ring',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s47 追踪恒星运动：椭圆轨迹上的亮点
  { id: 's47',
    css: `.orbit{position:absolute;left:50%;top:50%;width:52vmin;height:30vmin;margin:-15vmin 0 0 -26vmin;border:1px dashed ${MID}66;border-radius:50%}
.o2{width:34vmin;height:20vmin;margin:-10vmin 0 0 -17vmin}
.subject{position:absolute;left:50%;top:50%;width:6vmin;height:6vmin;margin:-3vmin;border-radius:50%;background:#000;box-shadow:0 0 22px rgba(125,211,252,.3)}
.tracer{position:absolute;left:24%;top:50%;width:2vmin;height:2vmin;margin:-1vmin;border-radius:50%;background:${PRI};box-shadow:0 0 16px ${PRI}}`,
    markup: `<div class="orbit"></div><div class="orbit o2"></div><div class="subject"></div><div class="tracer"></div>`,
    anim: `MV.enter('.orbit',{easing:'sine.out',duration:800,stagger:200,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0,scale:.4}});
MV.enter('.tracer',{easing:'sine.out',duration:400,delay:800,from:{opacity:0}});
MV.idle('.tracer',{delay:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s48 拍到阴影照片：模糊金环显影
  { id: 's48',
    css: `.noise{position:absolute;inset:14%;background:repeating-conic-gradient(${DEEP} 0 4deg,${BG} 4deg 8deg);opacity:.5;border-radius:12px}
.subject{position:absolute;left:50%;top:48%;width:30vmin;height:30vmin;margin:-15vmin;border-radius:50%;background:radial-gradient(circle,#000 34%,${ACC}cc 46%,${ACC}22 62%,transparent 70%);filter:blur(2px);opacity:0}
.frame{position:absolute;left:12%;top:12%;right:12%;bottom:12%;border:1px solid ${MID}55;border-radius:12px}
.flash{position:absolute;inset:0;background:${INK};opacity:0}`,
    markup: `<div class="frame"></div><div class="noise"></div><div class="subject"></div><div class="flash"></div>`,
    anim: `MV.enter('.noise',{easing:'sine.out',duration:600,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.out',duration:2000,delay:400,opacity:1});
MV.enter('.flash',{easing:'power2.out',duration:400,delay:300,from:{opacity:.9}});
MV.idle('.subject',{delay:2200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s49 验证预言：旧纸页与对勾
  { id: 's49',
    css: `.paper{position:absolute;left:50%;top:50%;width:44vmin;height:32vmin;margin:-16vmin 0 0 -22vmin;background:${INK};border-radius:6px;transform:rotate(-2deg);box-shadow:0 18px 50px rgba(0,0,0,.5)}
.line{position:absolute;left:12%;height:2px;background:${MID};opacity:.5}
.l1{top:26%;width:70%}.l2{top:40%;width:52%}
.subject{position:absolute;right:14%;bottom:12%;color:#16a34a;font-size:9vmin;font-weight:800}`,
    markup: `<div class="paper"><div class="line l1"></div><div class="line l2"></div><div class="subject">✓</div></div>`,
    anim: `MV.enter('.paper',{easing:'power2.out',duration:800,from:{opacity:0,y:-30,rotate:-6}});
MV.enter('.line',{easing:'sine.out',duration:600,stagger:200,from:{opacity:0,scaleX:0}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s50 第一次亲眼看见：瞳孔里的环
  { id: 's50',
    css: `.iris{position:absolute;left:50%;top:50%;width:52vmin;height:52vmin;margin:-26vmin;border-radius:50%;background:radial-gradient(circle,${DEEP} 40%,${PRI}22 68%,transparent 72%)}
.subject{position:absolute;left:50%;top:50%;width:20vmin;height:20vmin;margin:-10vmin;border-radius:50%;background:#000;box-shadow:0 0 0 3px ${ACC}66}
.lid{position:absolute;left:0;right:0;height:50%;background:${BG};opacity:0}`,
    markup: `<div class="iris"></div><div class="subject"></div><div class="lid"></div>`,
    anim: `MV.enter('.iris',{easing:'power2.out',duration:800,from:{opacity:0,scale:.7}});
MV.enter('.subject',{easing:'power2.out',duration:1200,delay:400,from:{opacity:0,scale:1.8}});
MV.idle('.iris',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s51 不是毁灭者：爆炸符号被划掉
  { id: 's51',
    css: `.boom{position:absolute;left:38%;top:36%;width:20vmin;height:20vmin;border-radius:50%;background:radial-gradient(circle,${ACC}55,transparent 70%);opacity:.15}
.slash{position:absolute;left:30%;top:46%;width:34vmin;height:1vmin;background:${MID};border-radius:.5vmin;transform:rotate(-24deg)}
.calm{position:absolute;right:16%;top:30%;width:2vmin;height:2vmin;border-radius:50%;background:${PRI};box-shadow:0 0 18px ${PRI}}
.subject{position:absolute;right:22%;top:52%;width:10vmin;height:10vmin;border-radius:50%;background:#000;border:1px solid ${PRI}44;opacity:0}`,
    markup: `<div class="boom"></div><div class="slash"></div><div class="calm"></div><div class="subject"></div>`,
    anim: `MV.enter('.boom',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.slash',{easing:'power2.out',duration:600,from:{opacity:0,scaleX:0}});
MV.enter('.boom',{easing:'power2.in',duration:1200,delay:400,from:{opacity:.6}});
MV.enter('.subject',{easing:'power2.out',duration:1200,delay:1200,from:{opacity:0}});
MV.idle('.calm',{delay:2200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s52 极端答案：等号后的黑圆
  { id: 's52',
    css: `.board{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:5vmin}
.eq{color:${INK};font-size:13vmin;font-weight:300;letter-spacing:1vmin}
.subject{width:18vmin;height:18vmin;border-radius:50%;background:#000;box-shadow:0 0 46px rgba(125,211,252,.22),0 0 0 2px ${PRI}44}`,
    markup: `<div class="board"><div class="eq">=</div><div class="subject"></div></div>`,
    anim: `MV.enter('.eq',{easing:'power2.out',duration:800,from:{opacity:0,y:-30}});
MV.enter('.subject',{easing:'back.out',duration:1200,delay:600,from:{opacity:0,scale:.2}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s53 吞物质点亮类星体：双联画
  { id: 's53',
    css: `.pane{position:absolute;top:16%;bottom:16%;width:40%;border-radius:14px;border:1px solid ${MID}44}
.pl{left:6%}.pr{right:6%}
.subject{position:absolute;left:22%;top:46%;width:9vmin;height:9vmin;margin:-4.5vmin;border-radius:50%;background:#000;box-shadow:0 0 30px rgba(0,0,0,.9)}
.morsel{position:absolute;left:28%;top:26%;width:1.6vmin;height:1.6vmin;border-radius:50%;background:${PRI}}
.jet{position:absolute;right:20%;top:22%;width:2vmin;height:34%;background:linear-gradient(to top,${PRI},transparent);border-radius:1vmin;transform-origin:bottom center}
.glow{position:absolute;right:14%;top:58%;width:12vmin;height:12vmin;border-radius:50%;background:radial-gradient(circle,${ACC}66,transparent 70%)}`,
    markup: `<div class="pane pl"></div><div class="pane pr"></div><div class="subject"></div><div class="morsel"></div><div class="jet"></div><div class="glow"></div>`,
    anim: `MV.enter('.pane',{easing:'power2.out',duration:800,stagger:200,from:{opacity:0}});
MV.enter('.morsel',{easing:'power2.in',duration:1600,from:{opacity:0,yPercent:-140}});
MV.enter('.jet',{easing:'sine.out',duration:1200,delay:600,from:{opacity:0,scaleY:.2}});
MV.idle('.jet',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s54 窥见规律：帷幕升起露出秩序
  { id: 's54',
    css: `.grid{position:absolute;inset:16%;border:1px solid ${PRI}44;border-radius:12px;
background:repeating-linear-gradient(0deg,${PRI}11 0 1px,transparent 1px 6vmin),repeating-linear-gradient(90deg,${PRI}11 0 1px,transparent 1px 6vmin)}
.node{position:absolute;width:1.8vmin;height:1.8vmin;border-radius:50%;background:${PRI}}
.veil{position:absolute;left:0;right:0;top:-102%;height:102%;background:${BG};opacity:.97}
.subject{position:absolute;left:50%;top:50%;width:8vmin;height:8vmin;margin:-4vmin;border-radius:50%;background:#000;box-shadow:0 0 30px rgba(125,211,252,.35)}`,
    markup: `<div class="grid"><div class="node" style="left:22%;top:28%"></div><div class="node" style="left:66%;top:34%"></div><div class="node" style="left:38%;top:66%"></div><div class="node" style="left:74%;top:70%"></div><div class="subject"></div><div class="veil"></div></div>`,
    anim: `MV.enter('.grid',{easing:'sine.out',duration:600,from:{opacity:0}});
MV.enter('.node',{easing:'power2.out',duration:600,stagger:150,from:{opacity:0,scale:0}});
MV.enter('.subject',{easing:'power2.out',duration:600,delay:700,from:{opacity:0,scale:.4}});
MV.enter('.veil',{easing:'power2.inOut',duration:2000,from:{y:'102%'}});
MV.idle('.subject',{delay:2200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s55 引力的浪漫：双星互绕留下心迹
  { id: 's55',
    css: `.path{position:absolute;left:50%;top:48%;width:40vmin;height:34vmin;margin:-17vmin 0 0 -20vmin;border:1px dashed ${ACC}55;border-radius:50% 50% 50% 0;transform:rotate(-45deg)}
.subject{position:absolute;left:50%;top:48%;width:2.6vmin;height:2.6vmin;margin:-1.3vmin;border-radius:50%;background:${PRI};box-shadow:0 0 20px ${PRI}}
.moon{position:absolute;left:50%;top:48%;width:2vmin;height:2vmin;margin:-1vmin;border-radius:50%;background:${ACC};box-shadow:0 0 16px ${ACC}}
.core0{position:absolute;left:50%;top:48%;width:1vmin;height:1vmin;margin:-.5vmin;border-radius:50%;background:${INK};opacity:.7}`,
    markup: `<div class="path"></div><div class="core0"></div><div class="subject"></div><div class="moon"></div>`,
    anim: `MV.enter('.path',{easing:'sine.out',duration:800,from:{opacity:0}});
MV.enter('.subject',{easing:'sine.out',duration:400,delay:600,from:{opacity:0}});
MV.enter('.moon',{easing:'sine.out',duration:400,delay:800,from:{opacity:0}});
MV.idle('.subject',{delay:1000});
MV.idle('.moon',{delay:1400});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s56 刚揭开一角：书页掀角透光
  { id: 's56',
    css: `.book{position:absolute;left:50%;top:52%;width:52vmin;height:34vmin;margin:-17vmin 0 0 -26vmin;background:linear-gradient(160deg,${DEEP},#000);border-radius:8px;box-shadow:0 24px 70px rgba(0,0,0,.6)}
.page{position:absolute;right:-3vmin;top:-3vmin;width:16vmin;height:16vmin;background:${INK};opacity:.95;border-radius:0 0 0 100%;transform-origin:0 0;box-shadow:-8px 8px 24px rgba(0,0,0,.4);transform:rotate(24deg)}
.glow{position:absolute;left:50%;top:52%;width:20vmin;height:20vmin;margin:-10vmin;border-radius:50%;background:radial-gradient(circle,${PRI}33,transparent 70%)}
.subject{position:absolute;left:50%;top:52%;width:7vmin;height:7vmin;margin:-3.5vmin;border-radius:50%;background:#000;border:1px solid ${ACC}66}`,
    markup: `<div class="glow"></div><div class="book"><div class="page"></div></div><div class="subject"></div>`,
    anim: `MV.enter('.book',{easing:'power2.out',duration:800,from:{opacity:0,y:-30}});
MV.enter('.page',{easing:'power2.inOut',duration:2000,from:{rotation:0}});
MV.idle('.glow',{delay:2200});
MV.enter('.glow',{easing:'power2.out',duration:1600,delay:800,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.out',duration:1200,delay:1200,from:{opacity:0,scale:.4}});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },
];

// 逐镜原创场景 · 第二幕 s20-s38（坠落 / 恒星之死 / 坍缩）
const PRI = '#7dd3fc', ACC = '#fbbf24', INK = '#f8fafc', MID = '#94a3b8', DEEP = '#1e293b', BG = '#05070f';

module.exports = [
  // s20 掉进黑洞的物体：小点坠向黑盘并被拉长
  { id: 's20',
    css: `.subject{position:absolute;left:50%;top:14%;width:2.6vmin;height:2.6vmin;margin-left:-1.3vmin;border-radius:50%;background:${INK};box-shadow:0 0 16px ${INK}}
.hole{position:absolute;left:50%;bottom:10%;width:26vmin;height:26vmin;margin-left:-13vmin;border-radius:50%;background:#000;box-shadow:0 0 50px rgba(0,0,0,.9),0 -6px 30px rgba(125,211,252,.12)}`,
    markup: `<div class="hole"></div><div class="subject"></div>`,
    anim: `MV.enter('.hole',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.subject',{easing:'sine.out',duration:400,from:{opacity:0}});
MV.enter('.subject',{easing:'power2.in',duration:1600,from:{opacity:0,yPercent:-260,scaleY:.6}});
MV.idle('.hole',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s21 凝固在视界：坠落者冻在环上变暗红
  { id: 's21',
    css: `.ring{position:absolute;left:50%;top:46%;width:34vmin;height:34vmin;margin:-17vmin;border-radius:50%;border:2px solid ${ACC}}
.subject{position:absolute;left:50%;top:32%;width:2.6vmin;height:2.6vmin;margin-left:-1.3vmin;border-radius:50%;background:${PRI};box-shadow:0 0 16px ${PRI}}
.streak{position:absolute;left:50%;top:14%;width:2px;height:16%;background:linear-gradient(to bottom,transparent,${PRI});opacity:.6}`,
    markup: `<div class="streak"></div><div class="ring"></div><div class="subject"></div>`,
    anim: `MV.enter('.ring',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.streak',{easing:'sine.out',duration:400,from:{opacity:0}});
MV.enter('.subject',{easing:'power3.out',duration:1200,from:{opacity:0,yPercent:-160}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s22 方程的推论：黑板方程
  { id: 's22',
    css: `.board{position:absolute;left:50%;top:50%;width:60vmin;height:36vmin;margin:-18vmin 0 0 -30vmin;background:linear-gradient(160deg,${DEEP},${BG});border:1px solid ${MID}55;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:${INK};font-size:7vmin;font-style:italic;letter-spacing:1vmin}
.mark{position:absolute;right:8%;bottom:8%;color:${ACC};font-size:4vmin;opacity:.85}`,
    markup: `<div class="board"><div class="subject">G = T</div><div class="mark">✓</div></div>`,
    anim: `MV.enter('.board',{easing:'power2.out',duration:600,from:{opacity:0,y:-30}});
MV.enter('.subject',{easing:'sine.out',duration:1200,stagger:0,from:{opacity:0}});
MV.emphasis('.mark',{duration:1200});
MV.idle('.board',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s23 诞生于恒星死亡：三阶段进程条
  { id: 's23',
    css: `.phase{position:absolute;top:38%;width:14vmin;height:14vmin;border-radius:50%}
.p1{left:12%;background:radial-gradient(circle at 40% 38%,${ACC},${ACC}55)}
.p2{left:43%;background:radial-gradient(circle,${PRI},${PRI}33)}
.subject{left:74%;background:#000;border:1px solid ${ACC};box-shadow:0 0 30px rgba(251,191,36,.25)}
.ln{position:absolute;top:45%;left:24%;width:16%;height:1px;background:${MID};opacity:.5}
.l2{left:55%}`,
    markup: `<div class="phase p1"></div><div class="ln"></div><div class="phase p2"></div><div class="ln l2"></div><div class="phase subject"></div>`,
    anim: `MV.enter('.phase',{easing:'power2.out',duration:600,stagger:300,from:{opacity:0,scale:.4}});
MV.enter('.ln',{easing:'sine.out',duration:400,stagger:300,from:{opacity:0,scaleX:0}});
MV.idle('.subject',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s24 二十倍太阳：大小悬殊双球
  { id: 's24',
    css: `.sun{position:absolute;left:12%;bottom:20%;width:6vmin;height:6vmin;border-radius:50%;background:radial-gradient(circle at 40% 38%,${ACC},${ACC}66)}
.subject{position:absolute;left:44%;top:16%;width:34vmin;height:34vmin;border-radius:50%;background:radial-gradient(circle at 42% 38%,${ACC},${ACC}44);box-shadow:0 0 60px rgba(251,191,36,.3)}
.tag{position:absolute;left:13%;bottom:12%;color:${MID};font-size:3vmin;opacity:.7}
.t2{left:52%;bottom:10%;color:${ACC};font-size:3.4vmin;opacity:.85}`,
    markup: `<div class="sun"></div><div class="subject"></div><div class="tag">×1</div><div class="tag t2">×20</div>`,
    anim: `MV.enter('.sun',{easing:'power2.out',duration:400,from:{opacity:0,scale:.3}});
MV.enter('.subject',{easing:'back.out',duration:1200,from:{opacity:0,scale:.2}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s25 辐射压向外：核心向四周喷射箭头
  { id: 's25',
    css: `.core{position:absolute;left:50%;top:48%;width:20vmin;height:20vmin;margin:-10vmin;border-radius:50%;background:radial-gradient(circle at 42% 38%,${ACC},${ACC}55);box-shadow:0 0 60px rgba(251,191,36,.45)}
.a{position:absolute;left:50%;top:48%;width:0;height:0;border-left:1.2vmin solid transparent;border-right:1.2vmin solid transparent;border-bottom:3vmin solid ${PRI}}
.a2{transform:rotate(90deg)}.a3{transform:rotate(180deg)}.a4{transform:rotate(270deg)}`,
    markup: `<div class="a"></div><div class="a a2"></div><div class="a a3"></div><div class="a a4"></div><div class="core subject"></div>`,
    anim: `MV.enter('.core',{easing:'power2.out',duration:600,from:{opacity:0,scale:.5}});
MV.enter('.a',{easing:'power2.out',duration:1200,stagger:150,from:{opacity:0,scale:0}});
MV.idle('.core',{delay:1600});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s26 引力对抗：箭头向内挤压核心
  { id: 's26',
    css: `.core{position:absolute;left:50%;top:48%;width:18vmin;height:18vmin;margin:-9vmin;border-radius:50%;background:radial-gradient(circle at 42% 38%,${PRI},${DEEP});box-shadow:0 0 50px rgba(125,211,252,.3)}
.a{position:absolute;width:0;height:0;border-left:1.2vmin solid transparent;border-right:1.2vmin solid transparent;border-top:3vmin solid ${MID}}
.a1{left:49%;top:8%}.a2{left:49%;bottom:8%;transform:rotate(180deg)}.a3{left:10%;top:45%;transform:rotate(90deg)}.a4{right:10%;top:45%;transform:rotate(-90deg)}`,
    markup: `<div class="a a1"></div><div class="a a2"></div><div class="a a3"></div><div class="a a4"></div><div class="core subject"></div>`,
    anim: `MV.enter('.core',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.a',{easing:'power2.in',duration:1200,stagger:120,from:{opacity:0,scale:2.2}});
MV.enter('.core',{easing:'power2.inOut',duration:1200,from:{scale:1.25}});
MV.idle('.core',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s27 燃料耗尽：火焰熄灭
  { id: 's27',
    css: `.core{position:absolute;left:50%;top:60%;width:22vmin;height:22vmin;margin:-11vmin;border-radius:50%;background:radial-gradient(circle at 42% 36%,${ACC},${ACC}44)}
.flame{position:absolute;left:50%;top:34%;width:10vmin;height:16vmin;margin-left:-5vmin;border-radius:50% 50% 30% 30%;background:linear-gradient(to top,${ACC},transparent);opacity:.9}
.subject{position:absolute;left:50%;top:60%;width:22vmin;height:22vmin;margin:-11vmin;border-radius:50%;background:radial-gradient(circle at 42% 36%,${DEEP},#000);opacity:0}`,
    markup: `<div class="core subject"></div><div class="flame"></div>`,
    anim: `MV.enter('.core',{easing:'power2.out',duration:600,from:{opacity:0,scale:.6}});
MV.idle('.flame',{delay:600});
MV.enter('.flame',{easing:'power2.in',duration:1600,from:{opacity:1,scaleY:1}});
MV.idle('.subject',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s28 对抗终止：天平骤停
  { id: 's28',
    css: `.post{position:absolute;left:50%;top:34%;width:1.6vmin;height:26vmin;margin-left:-.8vmin;background:${MID}}
.subject{position:absolute;left:50%;top:34%;width:44vmin;height:1.4vmin;margin-left:-22vmin;background:${PRI};border-radius:1vmin}
.pan{position:absolute;top:2vmin;width:12vmin;height:6vmin;border-radius:0 0 12px 12px;background:${DEEP};border:1px solid ${MID}}
.pl{left:-18vmin}.pr{right:-18vmin}
.tag{position:absolute;top:9vmin;width:100%;text-align:center;font-size:2.8vmin;opacity:.7;color:${MID}}
.g{color:${ACC}}`,
    markup: `<div class="post"></div><div class="subject"><div class="pan pl"><div class="tag">辐射压</div></div><div class="pan pr"><div class="tag g">引力</div></div></div>`,
    anim: `MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.enter('.pan',{easing:'power2.out',duration:600,stagger:200,from:{opacity:0}});
MV.enter('.subject',{easing:'power3.in',duration:1200,from:{rotation:0}});
MV.emphasis('.pr',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s29 瞬间戛然而止：运动冻结 + 暂停符
  { id: 's29',
    css: `.orb{position:absolute;left:30%;top:36%;width:16vmin;height:16vmin;border-radius:50%;background:radial-gradient(circle at 40% 36%,${PRI},${DEEP});box-shadow:0 0 40px rgba(125,211,252,.3)}
.bar{position:absolute;right:22%;top:30%;width:3vmin;height:16vmin;background:${ACC};border-radius:.6vmin}
.b2{right:26%}
.subject{position:absolute;left:30%;top:36%;width:16vmin;height:16vmin;border-radius:50%;border:2px solid ${ACC};opacity:0}`,
    markup: `<div class="orb"></div><div class="bar"></div><div class="bar b2"></div><div class="subject"></div>`,
    anim: `MV.enter('.orb',{easing:'back.out',duration:800,from:{opacity:0,scale:.4}});
MV.enter('.bar',{easing:'power2.out',duration:400,stagger:120,delay:1200,from:{opacity:0,scaleY:0}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s30 战争分出胜负：秤盘坠向引力
  { id: 's30',
    css: `.ln{position:absolute;left:20%;top:40%;width:60%;height:2px;background:${MID};border-radius:1px}
.dot{position:absolute;top:-1.6vmin;width:3.4vmin;height:3.4vmin;border-radius:50%}
.d1{left:12%;background:${MID};opacity:.6}
.subject{right:12%;background:${ACC};box-shadow:0 0 26px rgba(251,191,36,.5)}
.tag{position:absolute;top:56%;font-size:3.2vmin;opacity:.75}
.t1{left:12%;color:${MID}}.t2{right:8%;color:${ACC}}`,
    markup: `<div class="ln"><div class="dot d1"></div><div class="dot subject"></div></div><div class="tag t1">辐射压</div><div class="tag t2">引力</div>`,
    anim: `MV.enter('.ln',{easing:'sine.out',duration:600,from:{opacity:0,scaleX:.3}});
MV.enter('.dot',{easing:'power2.out',duration:600,stagger:200,from:{opacity:0,scale:.3}});
MV.enter('.ln',{easing:'power3.in',duration:1200,from:{rotation:0,scaleX:.6}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s31 核心坍缩：同心壳急速内缩
  { id: 's31',
    css: `.shell{position:absolute;left:50%;top:48%;border-radius:50%;border:1px solid ${PRI}66;margin:-20vmin 0 0 -20vmin;width:40vmin;height:40vmin}
.s2{width:30vmin;height:30vmin;margin:-15vmin 0 0 -15vmin}
.s3{width:20vmin;height:20vmin;margin:-10vmin 0 0 -10vmin}
.subject{position:absolute;left:50%;top:48%;width:6vmin;height:6vmin;margin:-3vmin;border-radius:50%;background:${ACC};box-shadow:0 0 44px rgba(251,191,36,.6)}`,
    markup: `<div class="shell"></div><div class="shell s2"></div><div class="shell s3"></div><div class="subject"></div>`,
    anim: `MV.enter('.shell',{easing:'sine.out',duration:400,stagger:120,from:{opacity:0,scale:1.6}});
MV.enter('.shell',{easing:'power3.in',duration:1200,stagger:120,from:{opacity:0,scale:2.6}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s32 超新星：激波环扩散 + 碎片
  { id: 's32',
    css: `.burst{position:absolute;left:50%;top:48%;width:8vmin;height:8vmin;margin:-4vmin;border-radius:50%;background:${INK};box-shadow:0 0 70px 20px rgba(248,250,252,.7)}
.wave{position:absolute;left:50%;top:48%;width:20vmin;height:20vmin;margin:-10vmin;border-radius:50%;border:2px solid ${ACC};opacity:0;transform:scale(3.2)}
.subject{position:absolute;left:50%;top:48%;width:30vmin;height:30vmin;margin:-15vmin;border-radius:50%;border:1px solid ${PRI}55}`,
    markup: `<div class="burst"></div><div class="wave"></div><div class="subject"></div>`,
    anim: `MV.enter('.burst',{easing:'power2.out',duration:600,from:{opacity:0,scale:.2}});
MV.enter('.wave',{easing:'power2.out',duration:1600,from:{opacity:1,scale:.2}});
MV.enter('.subject',{easing:'power2.out',duration:2000,delay:400,from:{opacity:0,scale:.2}});
MV.idle('.burst',{delay:2200});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s33 三倍阈值：表盘越过红线
  { id: 's33',
    css: `.dial{position:absolute;left:50%;top:52%;width:44vmin;height:44vmin;margin:-22vmin;border-radius:50%;border:2px solid ${MID};background:radial-gradient(circle,${DEEP},${BG})}
.mark{position:absolute;left:50%;top:8%;width:.7vmin;height:12%;background:#dc2626;transform-origin:50% 520%}
.needle{position:absolute;left:50%;top:14%;width:1vmin;height:36%;background:${INK};transform-origin:50% 100%;border-radius:.5vmin;transform:rotate(52deg)}
.subject{position:absolute;left:50%;top:52%;width:5vmin;height:5vmin;margin:-2.5vmin;border-radius:50%;background:${ACC}}`,
    markup: `<div class="dial"><div class="mark"></div><div class="needle"></div><div class="subject"></div></div>`,
    anim: `MV.enter('.dial',{easing:'power2.out',duration:600,from:{opacity:0,scale:.8}});
MV.enter('.needle',{easing:'power2.inOut',duration:1600,from:{rotation:-40}});
MV.emphasis('.mark',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s34 无力阻止：屏障碎裂
  { id: 's34',
    css: `.wall{position:absolute;left:62%;top:30%;width:2vmin;height:40%;background:${MID};opacity:.85;border-radius:1vmin}
.shard{position:absolute;width:1.6vmin;height:5vmin;background:${MID};border-radius:.5vmin;opacity:0}
.h{left:60%;top:28%}.h2{left:64%;top:44%}.h3{left:61%;top:60%}
.subject{position:absolute;left:16%;top:47%;width:3vmin;height:3vmin;border-radius:50%;background:${PRI};box-shadow:0 0 24px ${PRI}}`,
    markup: `<div class="wall"></div><div class="shard h"></div><div class="shard h2"></div><div class="shard h3"></div><div class="subject"></div>`,
    anim: `MV.enter('.wall',{easing:'sine.out',duration:600,from:{opacity:0,scaleY:.3}});
MV.enter('.subject',{easing:'sine.out',duration:400,from:{opacity:0}});
MV.enter('.shard',{easing:'power2.out',duration:1200,stagger:120,from:{opacity:0,yPercent:-40,rotate:-40}});
MV.idle('.subject',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s35 奇点：虚线圆收敛于一点
  { id: 's35',
    css: `.cir{position:absolute;left:50%;top:48%;border-radius:50%;border:1px dashed ${MID}77;margin:-18vmin 0 0 -18vmin;width:36vmin;height:36vmin}
.c2{width:24vmin;height:24vmin;margin:-12vmin 0 0 -12vmin}
.subject{position:absolute;left:50%;top:48%;width:2.4vmin;height:2.4vmin;margin:-1.2vmin;border-radius:50%;background:#000;box-shadow:0 0 24px 3px rgba(125,211,252,.65)}`,
    markup: `<div class="cir"></div><div class="cir c2"></div><div class="subject"></div>`,
    anim: `MV.enter('.cir',{easing:'sine.out',duration:600,stagger:200,from:{opacity:0}});
MV.enter('.cir',{easing:'power3.in',duration:1600,stagger:200,from:{opacity:0,scale:2.8}});
MV.emphasis('.subject',{duration:1200});
MV.camera('.stage',{move:'push-in',zoom:'CU'});` },

  // s36 不到一秒：秒表读数
  { id: 's36',
    css: `.dial{position:absolute;left:50%;top:46%;width:34vmin;height:34vmin;margin:-17vmin;border-radius:50%;border:2px solid ${PRI};background:radial-gradient(circle,${DEEP},${BG})}
.nub{position:absolute;left:50%;top:0;width:6vmin;height:2vmin;margin-left:-3vmin;background:${PRI};border-radius:1vmin}
.read{position:absolute;left:50%;top:70%;transform:translateX(-50%);color:${ACC};font-size:7vmin;font-weight:800;letter-spacing:.4vmin}`,
    markup: `<div class="dial"><div class="nub"></div></div><div class="read subject">0.8s</div>`,
    anim: `MV.enter('.dial',{easing:'back.out',duration:800,from:{opacity:0,scale:.5}});
MV.emphasis('.read',{duration:1200});
MV.idle('.dial',{delay:1600});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s37 两类：分叉图
  { id: 's37',
    css: `.root{position:absolute;left:50%;top:22%;width:9vmin;height:9vmin;margin-left:-4.5vmin;border-radius:50%;background:#000;border:1px solid ${ACC}}
.branch{position:absolute;top:58%;width:26vmin;height:16vmin;border-radius:12px;border:1px solid ${PRI}66;background:${DEEP}66;display:flex;align-items:center;justify-content:center;color:${INK};font-size:3.2vmin}
.b1{left:14%}.subject{right:14%;border-color:${ACC}88}
.ln{position:absolute;top:44%;height:1px;background:${MID};opacity:.5;width:14%}
.l1{left:24%}.l2{right:24%}`,
    markup: `<div class="root"></div><div class="ln l1"></div><div class="ln l2"></div><div class="branch b1">恒星级</div><div class="branch subject">巨大</div>`,
    anim: `MV.enter('.root',{easing:'power2.out',duration:600,from:{opacity:0,scale:.4}});
MV.enter('.ln',{easing:'sine.out',duration:400,delay:600,stagger:150,from:{opacity:0,scaleX:0}});
MV.enter('.branch',{easing:'power2.out',duration:800,delay:900,stagger:200,from:{opacity:0,y:-30}});
MV.idle('.subject',{delay:2000});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },

  // s38 恒星级黑洞：小黑盘金环
  { id: 's38',
    css: `.subject{position:absolute;left:50%;top:48%;width:20vmin;height:20vmin;margin:-10vmin;border-radius:50%;background:#000;box-shadow:0 0 44px rgba(0,0,0,.9),0 0 12px rgba(125,211,252,.14)}
.ring{position:absolute;left:50%;top:48%;width:26vmin;height:26vmin;margin:-13vmin;border-radius:50%;border:2px solid ${ACC}aa}
.star{position:absolute;left:16%;top:26%;width:1.6vmin;height:1.6vmin;border-radius:50%;background:${INK};opacity:.8}`,
    markup: `<div class="star"></div><div class="ring"></div><div class="subject"></div>`,
    anim: `MV.enter('.star',{easing:'sine.out',duration:400,from:{opacity:0}});
MV.enter('.ring',{easing:'power2.out',duration:1200,from:{opacity:0,scale:1.6}});
MV.enter('.subject',{easing:'power2.out',duration:600,from:{opacity:0}});
MV.idle('.ring',{delay:1800});
MV.camera('.stage',{move:'push-in',zoom:'MS'});` },
];

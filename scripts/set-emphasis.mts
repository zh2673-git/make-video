// IR 精修：为 54 段旁白手工标注梗卡关键词（emphasis），替换编剧滑窗占位
// 用法：npx tsx scripts/set-emphasis.mts <project-id>
import fs from 'node:fs';
import path from 'node:path';
import { ProjectStore } from '../src/infrastructure/project-store.js';

const EMPHASIS: Record<string, string[]> = {
  'seg-01': ['机会'],
  'seg-02': ['三个通宵', '头发'],
  'seg-03': ['上天'],
  'seg-04': ['让代码来'],
  'seg-05': ['大片', '编译器'],
  'seg-06': ['一部电影'],
  'seg-07': ['玄学', '第五次'],
  'seg-08': ['project.json'],
  'seg-09': ['真源'],
  'seg-10': ['电影公司'],
  'seg-11': ['编剧部'],
  'seg-12': ['导演部'],
  'seg-13': ['采购部'],
  'seg-14': ['剪辑部'],
  'seg-15': ['mp4'],
  'seg-16': ['七个部门', '十四份'],
  'seg-17': ['御膳房'],
  'seg-18': ['周星驰'],
  'seg-19': ['comedy-pop'],
  'seg-20': ['庄重'],
  'seg-21': ['破功'],
  'seg-22': ['真心'],
  'seg-23': ['大制作', '小人物'],
  'seg-24': ['风格包', '八类配方'],
  'seg-25': ['极简', '扁平'],
  'seg-26': ['对称', '暗调'],
  'seg-27': ['童叟无欺'],
  'seg-28': ['只打扰你一次'],
  'seg-29': ['素材', '批注'],
  'seg-30': ['一张表'],
  'seg-31': ['追加预算'],
  'seg-32': ['讲究', '真字'],
  'seg-33': ['亲手原创'],
  'seg-34': ['一镜一稿'],
  'seg-35': ['打回去', '重画'],
  'seg-36': ['垫桌脚'],
  'seg-37': ['实测时长'],
  'seg-38': ['一秒'],
  'seg-39': ['王法'],
  'seg-40': ['五十条', '不变量'],
  'seg-41': ['白名单', '闸门'],
  'seg-42': ['再改'],
  'seg-43': ['好片子'],
  'seg-44': ['全在账上'],
  'seg-45': ['断点续跑'],
  'seg-46': ['开炉'],
  'seg-47': ['一镜不少', '音画同步'],
  'seg-48': ['阵仗'],
  'seg-49': ['老话'],
  'seg-50': ['咸鱼', '梦想'],
  'seg-51': ['自己开口'],
  'seg-52': ['一部电影'],
  'seg-53': ['电影厂'],
  'seg-54': ['机会'],
};

const id = process.argv[2];
if (!id) {
  console.error('usage: npx tsx scripts/set-emphasis.mts <project-id>');
  process.exit(1);
}
const store = new ProjectStore(process.cwd());
const project = await store.load(id);
if (!project.script) throw new Error('项目缺少讲稿');
let n = 0;
for (const seg of project.script.segments) {
  const words = EMPHASIS[seg.id];
  if (!words) throw new Error(`缺关键词表: ${seg.id}`);
  // 校验：声明的重音词必须真实出现在旁白句中（否则 cue 词边界判定永远落空）
  for (const w of words) {
    if (!seg.text.includes(w) && !seg.text.replace(/[，。！？、；：\s]/g, '').includes(w)) {
      throw new Error(`${seg.id} 重音词「${w}」不在旁白中`);
    }
  }
  seg.emphasis = words;
  n += 1;
}
await store.save(project);
console.log(`emphasis 已更新 ${n} 段`);

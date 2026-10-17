(async () => {
const fs = require("fs");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const { PDFDocument } = require("pdf-lib");

const root = process.cwd();
const width = 1240;
const height = 1754;
const blue = "#243b82";
const lightBlue = "#c8ccd7";
const ink = "#202020";
const muted = "#414141";

GlobalFonts.registerFromPath("C:/Windows/Fonts/msyh.ttc", "Microsoft YaHei");
GlobalFonts.registerFromPath("C:/Windows/Fonts/msyhbd.ttc", "Microsoft YaHei Bold");

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, width, height);

const font = (size, bold = false) => `${bold ? "700" : "400"} ${size}px "Microsoft YaHei"`;
const text = (value, x, y, size = 18, bold = false, color = ink) => {
  ctx.font = font(size, bold);
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
};
const wrap = (value, maxWidth, size = 16, bold = false) => {
  ctx.font = font(size, bold);
  const lines = [];
  let line = "";
  for (const char of value) {
    const next = line + char;
    if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = char; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};
const paragraph = (value, x, y, maxWidth, size = 15, lineHeight = 24, color = muted) => {
  const lines = wrap(value, maxWidth, size);
  lines.forEach((line, index) => text(line, x, y + index * lineHeight, size, false, color));
  return y + lines.length * lineHeight;
};
const section = (title, english, y) => {
  ctx.fillStyle = blue; ctx.fillRect(95, y, 240, 45);
  ctx.fillStyle = lightBlue; ctx.fillRect(335, y, 810, 45);
  text(title, 130, y + 33, 25, true, "#ffffff");
  text(english, 375, y + 32, 21, true, ink);
  return y + 82;
};
const bullet = (value, x, y, maxWidth, size = 16, lineHeight = 24) => {
  text("•", x, y, size, true, ink);
  const lines = wrap(value, maxWidth - 24, size);
  lines.forEach((line, index) => text(line, x + 22, y + index * lineHeight, size, false, muted));
  return y + Math.max(1, lines.length) * lineHeight + 3;
};

ctx.fillStyle = blue;
ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(665, 0); ctx.lineTo(724, 72); ctx.lineTo(0, 72); ctx.closePath(); ctx.fill();
text("个人简历", 96, 49, 39, true, "#ffffff");
text("求职意向：实习生", 365, 44, 22, false, "#ffffff");
text("PERSONAL RESUME", 748, 45, 31, true, ink);

let y = 112;
y = section("个人信息", "Personal information", y);
text("姓名：薛凝瑞", 95, y, 18); text("籍贯：陕西省西安市", 460, y, 18);
text("出生年月：2005年6月", 95, y + 35, 18); text("毕业院校：西安外国语大学", 460, y + 35, 18);
text("手机号码：18792762803", 95, y + 70, 18); text("邮箱：3076399177@qq.com", 460, y + 70, 18);
try { const photo = await loadImage(`${root}/resume-assets/photo.png`); ctx.drawImage(photo, 1010, y - 5, 86, 116); } catch {}

y += 112;
y = section("教育背景", "Educational background", y);
text("2023.09–2027.06", 95, y, 18, true); text("西安外国语大学", 490, y, 18, true); text("动画专业", 1015, y, 18, true);
text("GPA：3.7（专业前10%）", 95, y + 34, 16, false, muted);
text("辅修专业：英语（已取得辅修专业证书）", 430, y + 34, 16, false, muted);
y = paragraph("主修课程：Maya、原动画设计与运动规律、动态图形设计、影视后期策划与制作、摄影、动画虚拟仿真。", 95, y + 68, 1000, 15, 23);

y += 7;
y = section("个人技能", "Personal skills", y);
y = bullet("三维视觉：Maya、Cinema 4D、Blender、Octane Renderer，具备建模、材质、灯光与动态视觉制作能力。", 95, y, 1035);
y = bullet("影视后期：After Effects、Premiere Pro、DaVinci Resolve，具备剪辑、调色、动效、合成与视频包装能力。", 95, y, 1035);
y = bullet("AI 与交互：Stable Diffusion、Runway、Three.js、WebGL、GLSL Shader、Web Audio、Vibe Coding。", 95, y, 1035);
y = bullet("视觉设计：Photoshop、Illustrator、Figma、Canva，能够完成海报、品牌视觉、宣传物料与视觉延展。", 95, y, 1035);
y = bullet("网页与交互：HTML、CSS、JavaScript、Three.js、WebGL、GLSL Shader、Web Audio，能够完成创意网页和互动原型。", 95, y, 1035);

y += 5;
y = section("实习与项目经历", "Internship & project experience", y);
const experience = (date, company, role, bullets) => {
  text(date, 95, y, 15, true); text(company, 360, y, 17, true); text(role, 925, y, 15, true); y += 26;
  bullets.forEach((item) => { y = bullet(item, 95, y, 1050, 15, 23); }); y += 8;
};
experience("2026.08–10", "耦一智能科技有限公司", "AI生成剪辑导演 / 漫剧", ["参与AI漫剧脚本拆解、镜头规划、素材生成与成片包装，完成从内容策划到视频输出的制作流程。", "负责AI画面筛选、剪辑节奏、字幕包装及角色、场景、道具资产的视觉统一，并参与系列内容的视觉把控。"]);
experience("2026.04–06", "不止文创（西安）", "3D建模师 / 文创设计", ["参与文创产品三维建模、造型调整、材质表现和展示效果制作，协助推进概念设计到视觉落地。", "结合产品造型、材质和场景表达完成视觉方案整理，提升文创产品的展示完成度。"]);
experience("2026.01–03", "南京漫云视界策划传媒有限公司", "项目制视觉策划 / AI内容", ["参与AI影像、视觉内容及宣传物料的策划整理，协助完成角色、场景和画面风格统一。", "使用PS、AI、PR、AE完成平面设计、视频剪辑、视觉包装和交付文件整理。"]);
experience("2025.05", "世好健康上海商业合作项目", "品牌合作执行", ["参与上海骑行活动品牌合作落地，负责产品寄售对接、库存管理、现场陈列及客户沟通。", "协助完成30余件产品上架与销售跟进，实现800+元销售额，并参与艺术集市现场运营。"]);
experience("2025.06–2026.04", "童增工作室", "编辑 / AI动画师", ["负责热点选题、内容编辑和视觉素材制作，参与AI动画短片剪辑、包装与成片输出。", "结合用户评论和内容趋势提炼选题方向，协助维护宣传账号和基础数据记录。"]);

y += 3;
y = section("校园经历", "Campus experience", y);
y = bullet("校级学生会宣传部部员：负责校园活动新闻稿、现场摄影、宣传海报和校内宣传账号内容维护。", 95, y, 1035, 16, 24);
y += 3;
y = section("竞赛", "Competition", y);
y = bullet("2026年陕西省大学生创新训练计划项目拟定立项。", 95, y, 1035, 16, 24);
y = bullet("中国国际大学生创新大赛校赛金奖；全国大学生电子商务创新创业及创业挑战赛校赛二等奖。", 95, y, 1035, 16, 24);
y = bullet("代表作品：Arise Studio个人创意品牌与作品集网站；Liquid Metal Lab音乐驱动液态金属WebGL交互实验。", 95, y, 1035, 16, 24);
y = bullet("作品方向：AI漫剧、品牌视觉、城市文旅海报、广告视频、AE动效与三维视觉系列。", 95, y, 1035, 16, 24);

const pngPath = `${root}/resume-assets/resume-final-preview.png`;
fs.writeFileSync(pngPath, canvas.toBuffer("image/png"));
(async () => { const pdf = await PDFDocument.create(); const page = pdf.addPage([595.28, 841.89]); const image = await pdf.embedPng(fs.readFileSync(pngPath)); page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 }); fs.writeFileSync(`${root}/薛凝瑞-新版简历-2026.pdf`, await pdf.save()); })();
})();

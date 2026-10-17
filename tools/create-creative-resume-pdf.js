(async () => {
const fs = require("fs");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const { PDFDocument } = require("pdf-lib");

const root = process.cwd();
const W = 1240; const H = 1754; const side = 350;
const navy = "#101c38"; const cobalt = "#4169e1"; const ink = "#18202d"; const muted = "#526070"; const pale = "#edf2fb";
GlobalFonts.registerFromPath("C:/Windows/Fonts/msyh.ttc", "Microsoft YaHei");
GlobalFonts.registerFromPath("C:/Windows/Fonts/msyhbd.ttc", "Microsoft YaHei Bold");
const canvas = createCanvas(W, H); const ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
ctx.fillStyle = navy; ctx.fillRect(0, 0, side, H);
const font = (size, bold = false) => `${bold ? "700" : "400"} ${size}px "Microsoft YaHei"`;
const t = (s,x,y,size=16,bold=false,color=ink) => { ctx.font=font(size,bold); ctx.fillStyle=color; ctx.fillText(s,x,y); };
const wrap = (s,max,size=15,bold=false) => { ctx.font=font(size,bold); const a=[]; let line=""; for(const c of s){const n=line+c; if(ctx.measureText(n).width>max&&line){a.push(line);line=c;}else line=n;} if(line)a.push(line); return a; };
const para = (s,x,y,max,size=14,lh=22,color=muted) => { const lines=wrap(s,max,size); lines.forEach((v,i)=>t(v,x,y+i*lh,size,false,color)); return y+lines.length*lh; };
const smallLabel = (s,x,y) => { t(s.toUpperCase(),x,y,11,true,cobalt); };
const rule = (x,y,w) => { ctx.fillStyle="#d9e1ef"; ctx.fillRect(x,y,w,1); };
const section = (title,x,y,w) => { t(title.toUpperCase(),x,y,13,true,ink); ctx.fillStyle=cobalt; ctx.fillRect(x,y+10,32,3); rule(x+44,y+11,w-44); return y+39; };
const bullet = (s,x,y,max,size=13,lh=19) => { ctx.fillStyle=cobalt; ctx.beginPath(); ctx.arc(x+4,y-5,3,0,Math.PI*2); ctx.fill(); const lines=wrap(s,max-20,size); lines.forEach((v,i)=>t(v,x+18,y+i*lh,size,false,muted)); return y+Math.max(1,lines.length)*lh+5; };
const exp = (date,company,role,items,x,y,max) => { t(date,x,y,12,true,cobalt); t(company,x+125,y,16,true,ink); t(role,x+125,y+22,12,true,muted); let yy=y+47; items.forEach(item=>yy=bullet(item,x,yy,max)); return yy+5; };

try { const photo=await loadImage(`${root}/resume-assets/photo.png`); ctx.drawImage(photo,78,84,150,202); } catch {}
t("ELIZA SIT",54,287,20,true,"#ffffff"); t("薛凝瑞",54,318,33,true,"#ffffff");
t("AI VISUALS",54,365,13,true,"#aebfe7"); t("3D / MOTION / CREATIVE CODE",54,389,12,false,"#aebfe7");
rule(54,425,240);
smallLabel("Contact",54,466); t("18792762803",54,495,14,false,"#ffffff"); t("3076399177@qq.com",54,524,14,false,"#ffffff"); t("陕西省西安市",54,553,14,false,"#ffffff");
smallLabel("Core tools",54,610); const tags=["Maya / C4D / Blender","After Effects / Premiere","DaVinci / Photoshop","Illustrator / Figma","Three.js / WebGL","Web Audio / Vibe Coding"]; tags.forEach((v,i)=>{const yy=644+i*35; ctx.fillStyle="#24365c"; ctx.fillRect(54,yy-18,240,25); t(v,65,yy,12,false,"#dbe6ff");});
smallLabel("Positioning",54,895); para("动画专业数字媒体创作者，专注于 AI 影像、三维视觉、影视后期与交互式视觉实验。",54,927,240,14,23,"#dbe6ff");
smallLabel("Strengths",54,1045); ["跨媒介视觉整合","AI内容生产","三维与动效表达","独立项目执行","商业项目沟通"].forEach((v,i)=>t("0"+(i+1)+"  "+v,54,1080+i*32,13,false,"#dbe6ff"));
smallLabel("Education",54,1290); t("西安外国语大学",54,1323,15,true,"#ffffff"); t("动画专业 / 2023.09–2027.06",54,1350,12,false,"#dbe6ff"); t("GPA 3.7 · 专业前10%",54,1376,12,false,"#dbe6ff");
smallLabel("Awards",54,1440); para("陕西省大学生创新训练计划项目拟定立项；中国国际大学生创新大赛校赛金奖；全国大学生电子商务创新创业及创业挑战赛校赛二等奖。",54,1472,240,12,19,"#dbe6ff");

const x=405; const max=760; t("DIGITAL MEDIA / CREATIVE TECHNOLOGY",x,82,12,true,cobalt); t("薛凝瑞",x,138,48,true,ink); t("AI 影像 · 三维视觉 · 动态设计 · 交互实验",x,177,20,false,muted);
para("能够将动画、AI生成、三维视觉、影视后期和网页交互结合起来，完成从创意策划、素材制作到最终呈现的完整数字内容项目。",x,222,max,15,24,muted);

let y=320; y=section("Selected experience",x,y,max);
y=exp("2026.08–10","耦一智能科技有限公司","AI生成剪辑导演 / 漫剧",["参与AI漫剧脚本拆解、镜头规划、素材生成与成片包装，完成从内容策划到视频输出的制作流程。","负责AI画面筛选、剪辑节奏、字幕包装及角色、场景、道具资产的视觉统一。"],x,y,max);
y=exp("2026.04–06","不止文创（西安）","3D建模师 / 文创设计",["参与文创产品三维建模、造型调整、材质表现和展示效果制作，协助推进概念设计到视觉落地。"],x,y,max);
y=exp("2026.01–03","南京漫云视界策划传媒有限公司","项目制视觉策划 / AI内容",["参与AI影像、视觉内容及宣传物料的策划整理，协助完成角色、场景和画面风格统一。","使用PS、AI、PR、AE完成平面设计、视频剪辑和内容包装输出。"],x,y,max);
y=exp("2025.06–2026.04","童增工作室","编辑 / AI动画师",["负责热点选题、内容编辑和视觉素材制作，参与AI动画短片剪辑、包装与成片输出。"],x,y,max);

y+=8; y=section("Commercial practice",x,y,max);
y=exp("2025.05 · 上海","世好健康商业合作项目","品牌合作执行",["参与上海骑行活动品牌合作落地，负责产品寄售对接、库存管理、现场陈列及客户沟通。","协助完成30余件产品上架与销售跟进，实现800+元销售额，并参与艺术集市现场运营。"],x,y,max);

y+=8; y=section("Selected works",x,y,max);
y=bullet("Liquid Metal Lab：使用Three.js、WebGL、GLSL Shader和Web Audio完成音乐驱动液态金属交互实验，支持触控、音频上传和视频录制。",x,y,max);
y=bullet("Arise Studio：独立搭建个人创意品牌与作品集网站，结合AI影像、三维视觉和Vibe Coding进行数字媒体实验。",x,y,max);
y=bullet("AI漫剧与视觉系列：参与猫咪综艺、霸总穿越、青蛇、末世系列，以及产品品牌、城市文旅、广告视频和AE动效等作品。",x,y,max);

y+=8; y=section("Campus",x,y,max);
y=bullet("校级学生会宣传部部员：负责校园活动新闻稿、现场摄影、宣传海报和校内宣传账号内容维护。",x,y,max);

const outPng=`${root}/resume-assets/creative-resume-preview.png`; fs.writeFileSync(outPng,canvas.toBuffer("image/png"));
const pdf=await PDFDocument.create(); const page=pdf.addPage([595.28,841.89]); const image=await pdf.embedPng(fs.readFileSync(outPng)); page.drawImage(image,{x:0,y:0,width:595.28,height:841.89}); fs.writeFileSync(`${root}/薛凝瑞-Creative-Tech-Resume-2026.pdf`,await pdf.save());
})();

const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),read=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8')),write=(n,v)=>fs.writeFileSync(path.join(root,n),JSON.stringify(v,null,2)+'\n');
const resourcePath=href=>href.split(/[?#]/)[0];
const intro=read('src/introduction.json');
let base=intro.pages;
const authorMaterials={...intro.materials};
const navigation=read('src/navigation.json');
const prompting=[],agents=[],addSources={};
const promptingR2=fs.existsSync(path.join(root,'src/prompting-r2.json'))?read('src/prompting-r2.json'):null;
const foundations=read('src/llm-foundations.json');
if(foundations.pages.length!==11||foundations.pages.some((p,i)=>p.page!==i+4))throw Error('LLM foundations pages must be 4–14');
base=base.concat(foundations.pages);Object.assign(authorMaterials,foundations.materials);Object.assign(addSources,foundations.sources||{});

for(const f of fs.readdirSync(path.join(root,'src')).filter(f=>/^(prompting|agents)-.*\.json$/.test(f)&&(!promptingR2||!f.startsWith('prompting-')||f==='prompting-r2.json'))){const d=read('src/'+f);(f.startsWith('prompting-')?prompting:agents).push(...d.pages);for(const[k,v]of Object.entries(d.materials))authorMaterials[k]=v;Object.assign(addSources,d.sources||{});}
prompting.sort((a,b)=>a.page-b.page);agents.sort((a,b)=>a.page-b.page);
if(prompting.length!==30||prompting.some((p,i)=>p.page!==i+20))throw Error('Prompting pages must be 20–49');
if(agents.length!==85||agents.some((p,i)=>p.page!==i+50))throw Error('Agents pages must be 50–134');
const extra={23:45,24:30,25:30,26:25,44:5};if(!promptingR2)prompting.forEach(p=>p.seconds+=extra[p.page]||0);
if(prompting.reduce((s,p)=>s+p.seconds,0)!==2100)throw Error('Prompting duration must be 2100s');
for(const p of base.concat(prompting,agents)){p.authoring_page=p.authoring_page??p.page;p.renderer=p.renderer??p.page;}
const plan=[];
const navItems=navigation.groups.flatMap(g=>g.children);
for(const p of base.concat(prompting,agents)){
 const a=navigation.agendas.find(a=>a.insert_before===p.authoring_page);
 if(a){p.seconds-=a.seconds;const g=navigation.groups.find(g=>a.navigation.startsWith(g.id+'.'));plan.push({page:0,authoring_page:a.authoring_page,renderer:a.renderer,section:g.title,type:'agenda',title:'本讲内容',seconds:a.seconds,navigation:a.navigation,show_sources:false,sources:[],on_slide:['已结束：'+a.previous,'接下来：'+a.next],talk:'结束'+a.previous+'，开始'+a.next+'。先定位本节在全讲中的位置，再进入内容总览。'});authorMaterials[a.authoring_page]='已结束：'+a.previous+'。接下来：'+a.next+'。';}
 const replacement=navigation.agendas.find(a=>a.authoring_page===p.authoring_page&&!a.insert_before);
 if(replacement){p.renderer=replacement.renderer;p.navigation=replacement.navigation;p.show_sources=false;p.on_slide=['已结束：'+replacement.previous,'接下来：'+replacement.next];p.talk='结束'+replacement.previous+'，开始'+replacement.next+'。';authorMaterials[p.authoring_page]=p.on_slide.join('\n');}
 p.navigation=p.navigation||(navItems.find(c=>p.authoring_page>=c.from&&p.authoring_page<=c.to)?.id)||'0';
 if(p.renderer===306)p.title='苏格拉底式提问：先追问，再给建议';
 if(p.renderer>=301&&p.renderer<=330)p.title_emphasis=['苏格拉底式提问','双层解释','反向拆解','横纵分析','事实核查','专家会诊','第一性原理','跨领域借解','双向钢人论证','双向钢人','最小实验'].find(n=>p.title.includes(n));
 plan.push(p);
}
for(const p of plan.filter(p=>p.type==='agenda')){p.on_slide=p.on_slide.concat(navigation.groups.flatMap(g=>[g.id+'. '+g.title+'：'+g.subtitle,...g.children.filter(c=>!c.agenda_hidden).map(c=>c.id+' '+c.title)]));authorMaterials[p.authoring_page]=p.on_slide.join('\n');}
const authorToDisplay=new Map();let t=0;plan.forEach((p,i)=>{p.page=i+1;authorToDisplay.set(p.authoring_page,p.page);p.start_seconds=t;t+=p.seconds;p.end_seconds=t;});
const displayedPage=p=>authorToDisplay.get(p);
const materials=Object.fromEntries(Object.entries(authorMaterials).map(([k,v])=>[displayedPage(Number(k)),v]));
if(t!==10800)throw Error('Lecture duration must be 10800s, got '+t);
if(plan.length!==139||plan.some((p,i)=>p.page!==i+1))throw Error('Displayed page sequence must be 1–139');
const originalFiles=fs.existsSync(path.join(root,'sources/material-files.json'))?read('sources/material-files.json'):{},files={};
for(const[k,v]of Object.entries(originalFiles)){const p=Number(k);if(p<=3||p>=50||(!promptingR2&&p>=20))files[displayedPage(p)]=v;}
for(const[k,v]of Object.entries(foundations.files||{}))files[displayedPage(Number(k))]=v;
if(promptingR2)for(const[k,v]of Object.entries(promptingR2.files||{}))files[displayedPage(Number(k))]=v;
const registry={...JSON.parse(fs.readFileSync(path.resolve(root,'../v01-逐页内容规划/来源登记.json'),'utf8')),...addSources},used=new Set(plan.flatMap(p=>p.sources.map(s=>s.id)));
const portable=fs.existsSync(path.join(root,'sources/portable-links.json'))?read('sources/portable-links.json'):{};
const sources=Object.fromEntries(Object.entries(registry).filter(([k])=>used.has(k)).map(([k,v])=>[k,{title:v.title,path:v.path,...(portable[k]||{}),...(v.href?{href:v.href}:{}),...(v.target?{target:v.target}:{})}]));
for(const p of plan){if(!materials[p.page])throw Error('Missing material '+p.page);for(const s of p.sources){if(!sources[s.id]||!sources[s.id].path||(!/^https?:/.test(sources[s.id].path)&&!fs.existsSync(sources[s.id].path)))throw Error('Missing source '+s.id);}}
const ctx={window:{MBA_PLAN:plan,MBA_SOURCES:sources,MBA_MATERIALS:materials,MBA_NAV:navigation}};vm.createContext(ctx);const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,href] of html.matchAll(/<script src="([^"]+)"/g)){const f=resourcePath(href);if(f.endsWith('/player.js')||f.endsWith('/data.js')||f.endsWith('/llm-foundations.js'))continue;vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);}
if(fs.existsSync(path.join(root,'src/llm-foundations.js')))vm.runInContext(fs.readFileSync(path.join(root,'src/llm-foundations.js'),'utf8'),ctx);
const policy=read('src/playback-policy.json'),policyRecords=[];
for(const p of plan){const d=ctx.window.MBA_RENDERERS[p.renderer??p.page];if(!d)throw Error('Missing renderer '+p.page);const rule=policy.pages[String(p.authoring_page??p.page)]||d.playback;const sourceSteps=rule?.source_steps||[d.steps-1];if(!sourceSteps.length||sourceSteps.some(s=>!Number.isInteger(s)||s<0||s>=d.steps))throw Error('Invalid playback source_steps on page '+p.page);if(new Set(sourceSteps).size!==sourceSteps.length)throw Error('Duplicate playback state on page '+p.page);p.playback={mode:sourceSteps.length>1?'mechanism':'full',source_steps:sourceSteps,reveal:rule?.reveal||(sourceSteps.length>1?'original':'all'),reason:rule?.reason||'进入页面即完整显示。'};policyRecords.push({page:p.page,authoring_page:p.authoring_page,title:p.title,renderer:p.renderer??p.page,renderer_steps:d.steps,...p.playback});}
fs.writeFileSync(path.join(root,'页面清单.md'),'# 当前页面清单\n\n139页，153个播放器状态，10800秒（含600秒休息）。\n\n| 页码 | 版块 | 讲题 | 秒数 | 状态 |\n| --- | --- | --- | --- | --- |\n'+plan.map(p=>`| ${p.page} | ${p.navigation} | ${p.title} | ${p.seconds} | ${p.playback.source_steps.length} |`).join('\n')+'\n');
write('slides.json',plan);write('materials.json',materials);fs.writeFileSync(path.join(root,'src/data.js'),`window.MBA_PLAN = ${JSON.stringify(plan)};\nwindow.MBA_NAV = ${JSON.stringify(navigation)};\nwindow.MBA_SOURCES = ${JSON.stringify(sources)};\nwindow.MBA_MATERIALS = ${JSON.stringify(materials)};\nwindow.MBA_FILES = ${JSON.stringify(files)};\n`);
write('qa/playback-policy-record.json',{date:policy.date,description:policy.description,pages:policyRecords});
const records=plan.map(p=>({page:p.page,authoring_page:p.authoring_page,renderer:p.renderer,source_plan_page:p.source_plan_page,section:p.section,type:p.type,title:p.title,steps:p.playback.source_steps.length,renderer_steps:ctx.window.MBA_RENDERERS[p.renderer??p.page].steps,playback:p.playback}));
if(new Set(records.map(p=>p.renderer)).size!==records.length)throw Error('Duplicate renderer');
const manifest=read('version_manifest.json');Object.assign(manifest,{title:'MBA第一讲：LLM Agents完整HTML课件',scope:'导入、LLM基础、Prompting、工具调用、Memory、Skills、Harness、外化与内化整合及全讲总结',status:'增加章节目录与两级进度；Prompting文字分层、原Prompt滚动阅读与策略名深红强调',page_count:plan.length,state_count:records.reduce((s,p)=>s+p.steps,0),print_page_count:records.reduce((s,p)=>s+p.steps,0),page_records:records,date:'2026-10-19',revision:'2026-10-19-目录进度与文本呈现r3',navigation_review_record:'qa/navigation-and-text-r3/修订与复查记录.md',prompting_review_record:'qa/prompting-r2/修订与实播记录.md',decoding_review_record:'qa/decoding-parameters/修订与复查.md',playback_policy:'src/playback-policy.json',review_record:'qa/llm-foundations-r2/修订与实播记录.md',historical_review_record:'qa/independent-review/审阅总记录.md',duration_seconds:t,teaching_seconds:t-600,break_seconds:600});write('version_manifest.json',manifest);
const assetVersions=[];
const versionedHTML=html.replace(/\b(src|href)="([^"]+)"/g,(attribute,name,href)=>{const file=resourcePath(href);if(/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(file)||! /\.(?:js|css)$/i.test(file))return attribute;const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);assetVersions.push({file,sha256_12:sha});return `${name}="${file}?v=${sha}"`;});
fs.writeFileSync(path.join(root,'index.html'),versionedHTML.replace(/max="\d+" value="1" aria-label="页码"/,`max="${plan.length}" value="1" aria-label="页码"`).replace(/id="page-total">\/ \d+/,`id="page-total">/ ${plan.length}`));
write('qa/asset-versions.json',{date:'2026-10-19',method:'sha256 first 12 characters; index references updated after generated data is written',assets:assetVersions});
console.log(JSON.stringify({pages:plan.length,states:manifest.state_count,seconds:t,versioned_assets:assetVersions.length}));

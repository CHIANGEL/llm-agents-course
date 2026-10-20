const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),read=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8')),write=(n,v)=>fs.writeFileSync(path.join(root,n),JSON.stringify(v,null,2)+'\n');
const resourcePath=href=>href.split(/[?#]/)[0];
const intro=read('src/introduction.json');
let base=intro.pages;
const authorMaterials={...intro.materials};
const navigation=read('src/navigation.json');
const schedule=read('src/schedule.json');
const prompting=[],agents=[],addSources={};
const promptingR2=fs.existsSync(path.join(root,'src/prompting-r2.json'))?read('src/prompting-r2.json'):null;
const foundations=read('src/llm-foundations.json');
const agentOverview=read('src/agent-overview-r4.json');
const memoryR8=read('src/memory-r8.json');
Object.assign(authorMaterials,memoryR8.materials);Object.assign(addSources,memoryR8.sources);
Object.assign(authorMaterials,agentOverview.materials);Object.assign(addSources,agentOverview.sources);
if(foundations.pages.length!==11||foundations.pages.some((p,i)=>p.page!==i+4))throw Error('LLM foundations pages must be 4–14');
base=base.concat(foundations.pages);Object.assign(authorMaterials,foundations.materials);Object.assign(addSources,foundations.sources||{});

for(const f of fs.readdirSync(path.join(root,'src')).filter(f=>/^(prompting|agents)-.*\.json$/.test(f)&&(!promptingR2||!f.startsWith('prompting-')||f==='prompting-r2.json'))){const d=read('src/'+f);(f.startsWith('prompting-')?prompting:agents).push(...d.pages);for(const[k,v]of Object.entries(d.materials))authorMaterials[k]=v;Object.assign(addSources,d.sources||{});}
prompting.sort((a,b)=>a.page-b.page);agents.sort((a,b)=>a.page-b.page);
if(prompting.length!==30||prompting.some((p,i)=>p.page!==i+20))throw Error('Prompting pages must be 20–49');
const expectedAgents=Array.from({length:85},(_,i)=>i+50).filter(n=>![59,60,61,62,63,64,65,67,68,69,70,73].includes(n));
if(agents.length!==73||agents.some((p,i)=>p.page!==expectedAgents[i]))throw Error('Agents authoring IDs must match r7 tools and removed break');
const extra={23:45,24:30,25:30,26:25,44:5};if(!promptingR2)prompting.forEach(p=>p.seconds+=extra[p.page]||0);
if(prompting.reduce((s,p)=>s+p.seconds,0)!==2100)throw Error('Prompting duration must be 2100s');
Object.assign(authorMaterials,agentOverview.materials,memoryR8.materials);
const content=base.concat(prompting,agents).flatMap(p=>p.page===agentOverview.replaces_authoring_page?agentOverview.pages:p.page===74?memoryR8.pages:p.page>=75&&p.page<=88?[]:[p]);
for(const p of content){if(agentOverview.timing_overrides[String(p.page)]!==undefined)p.seconds=agentOverview.timing_overrides[String(p.page)];}
for(const p of content){p.authoring_page=p.authoring_page??p.page;p.renderer=p.renderer??p.page;}
const plan=[];
const navItems=navigation.groups.flatMap(g=>g.children);
for(const p of content){
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
const authorToDisplay=new Map();let t=0;plan.forEach((p,i)=>{p.page=i+1;authorToDisplay.set(p.authoring_page,p.page);p.start_seconds=t;t+=p.seconds;p.end_seconds=t;for(const b of schedule.off_slide_breaks.filter(b=>b.after_authoring_page===p.authoring_page)){b.after_page=p.page;b.start_seconds=t;t+=b.seconds;b.end_seconds=t;}});
const displayedPage=p=>authorToDisplay.get(p);
const materials=Object.fromEntries(Object.entries(authorMaterials).filter(([k])=>displayedPage(Number(k))!==undefined).map(([k,v])=>[displayedPage(Number(k)),v]));
const expectedDuration=10800-1200+memoryR8.pages.reduce((sum,p)=>sum+p.seconds,0)+15; // agenda already deducted from first page
if(t!==expectedDuration)throw Error('Duration disagrees with module estimates: '+t+' / '+expectedDuration);
if(plan.length!==151||plan.some((p,i)=>p.page!==i+1))throw Error('Displayed page sequence must be 1–151');
const originalFiles=fs.existsSync(path.join(root,'sources/material-files.json'))?read('sources/material-files.json'):{},files={};
for(const[k,v]of Object.entries(originalFiles)){const p=Number(k);if(displayedPage(p)!==undefined&&!(p>=74&&p<=88)&&(p<=3||p>=50||(!promptingR2&&p>=20)))files[displayedPage(p)]=v;}
for(const[k,v]of Object.entries(foundations.files||{}))files[displayedPage(Number(k))]=v;
if(promptingR2)for(const[k,v]of Object.entries(promptingR2.files||{}))files[displayedPage(Number(k))]=v;
for(const[k,v]of Object.entries(memoryR8.files||{}))files[displayedPage(Number(k))]=v;
const registry={...JSON.parse(fs.readFileSync(path.resolve(root,'../v01-逐页内容规划/来源登记.json'),'utf8')),...addSources},used=new Set(plan.flatMap(p=>p.sources.map(s=>s.id)));
const portable=fs.existsSync(path.join(root,'sources/portable-links.json'))?read('sources/portable-links.json'):{};
const sources=Object.fromEntries(Object.entries(registry).filter(([k])=>used.has(k)).map(([k,v])=>[k,{title:v.title,path:v.path,...(portable[k]||{}),...(v.href?{href:v.href}:{}),...(v.target?{target:v.target}:{})}]));
const localSourceFallbacks={HTML_FIGURES_R6:'sources/html-figures-r6/source-map.json',AGENT_OVERVIEW_R4:'sources/agents-overview-r4/source-map.json',SOURCE_REPLICA_R5:'sources/source-replica-r5/source-map.json'};
const sourceExists=(id,s)=>{
 if(!s?.path)return false;
 if(/^https?:/.test(s.path)||fs.existsSync(s.path))return true;
 return [s.href,localSourceFallbacks[id]].some(href=>href&&(/^https?:/.test(href)||fs.existsSync(path.resolve(root,resourcePath(href)))));
};
for(const p of plan){if(!materials[p.page])throw Error('Missing material '+p.page);for(const s of p.sources){if(!sourceExists(s.id,sources[s.id]))throw Error('Missing source '+s.id);}}
const ctx={window:{MBA_PLAN:plan,MBA_SOURCES:sources,MBA_MATERIALS:materials,MBA_NAV:navigation}};vm.createContext(ctx);const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,href] of html.matchAll(/<script src="([^"]+)"/g)){const f=resourcePath(href);if(f.endsWith('/player.js')||f.endsWith('/data.js')||f.endsWith('/llm-foundations.js'))continue;vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);}
if(fs.existsSync(path.join(root,'src/llm-foundations.js')))vm.runInContext(fs.readFileSync(path.join(root,'src/llm-foundations.js'),'utf8'),ctx);
const policy=read('src/playback-policy.json'),policyRecords=[];
for(const p of plan){const d=ctx.window.MBA_RENDERERS[p.renderer??p.page];if(!d)throw Error('Missing renderer '+p.page);const rule=policy.pages[String(p.authoring_page??p.page)]||d.playback;const sourceSteps=rule?.source_steps||[d.steps-1];if(!sourceSteps.length||sourceSteps.some(s=>!Number.isInteger(s)||s<0||s>=d.steps))throw Error('Invalid playback source_steps on page '+p.page);if(new Set(sourceSteps).size!==sourceSteps.length)throw Error('Duplicate playback state on page '+p.page);p.playback={mode:sourceSteps.length>1?'mechanism':'full',source_steps:sourceSteps,reveal:rule?.reveal||(sourceSteps.length>1?'original':'all'),reason:rule?.reason||'进入页面即完整显示。'};policyRecords.push({page:p.page,authoring_page:p.authoring_page,title:p.title,renderer:p.renderer??p.page,renderer_steps:d.steps,...p.playback});}
fs.writeFileSync(path.join(root,'页面清单.md'),`# 当前页面清单\n\n${plan.length}页，${plan.reduce((sum,p)=>sum+p.playback.source_steps.length,0)}个播放器状态；讲授${t-600}秒，另含600秒休息，参考总时长${t}秒。教师允许超出180分钟并分两次讲；时间为讲授估计，不作上限。休息安排在第72页之后，不单独设幻灯片。\n\n| 页码 | 版块 | 讲题 | 秒数 | 状态 |\n| --- | --- | --- | --- | --- |\n`+plan.map(p=>`| ${p.page} | ${p.navigation} | ${p.title} | ${p.seconds} | ${p.playback.source_steps.length} |`).join('\n')+'\n');
write('schedule.json',schedule);write('slides.json',plan);write('materials.json',materials);fs.writeFileSync(path.join(root,'src/data.js'),`window.MBA_PLAN = ${JSON.stringify(plan)};\nwindow.MBA_NAV = ${JSON.stringify(navigation)};\nwindow.MBA_SOURCES = ${JSON.stringify(sources)};\nwindow.MBA_MATERIALS = ${JSON.stringify(materials)};\nwindow.MBA_FILES = ${JSON.stringify(files)};\n`);
write('qa/playback-policy-record.json',{date:policy.date,description:policy.description,pages:policyRecords});
const records=plan.map(p=>({page:p.page,authoring_page:p.authoring_page,renderer:p.renderer,source_plan_page:p.source_plan_page,section:p.section,type:p.type,title:p.title,steps:p.playback.source_steps.length,renderer_steps:ctx.window.MBA_RENDERERS[p.renderer??p.page].steps,playback:p.playback}));
if(new Set(records.map(p=>p.renderer)).size!==records.length)throw Error('Duplicate renderer');
const manifest=read('version_manifest.json');Object.assign(manifest,{title:'MBA第一讲：LLM Agents完整HTML课件',scope:'导入、LLM基础、Prompting、智能体外化与内化总览、工具调用、Memory、Skills、Harness、外化与内化整合及全讲总结',status:'Memory按概念、个性化趋势、Codex采购案例与Skills过渡重做；30页正文与1页目录',page_count:plan.length,state_count:records.reduce((s,p)=>s+p.steps,0),print_page_count:records.reduce((s,p)=>s+p.steps,0),page_records:records,date:'2026-10-20',revision:'2026-10-20-Memory-r8',memory_review_record:'qa/memory-r8/问题与修订记录.md',duration_policy:'参考估计；允许超出180分钟并分两次讲',tools_review_record:'qa/tool-calling-r7/问题与修订记录.md',html_figures_review_record:'qa/html-figures-r6/修订与复查记录.md',source_replica_review_record:'qa/source-replica-r5/修订与复查记录.md',agents_overview_review_record:'qa/agents-overview-r4/修订与复查记录.md',navigation_review_record:'qa/navigation-and-text-r3/修订与复查记录.md',prompting_review_record:'qa/prompting-r2/修订与实播记录.md',decoding_review_record:'qa/decoding-parameters/修订与复查.md',playback_policy:'src/playback-policy.json',review_record:'qa/memory-r8/问题与修订记录.md',llm_review_record:'qa/llm-foundations-r2/修订与实播记录.md',verification:{browser_checks:'qa/memory-r8/controls.json',visual_review:'qa/memory-r8/问题与修订记录.md',scope:'Memory第73–103页与相邻衔接；共享播放器另作状态回归，非全讲重新审阅'},historical_review_record:'qa/independent-review/审阅总记录.md',duration_seconds:t,teaching_seconds:plan.reduce((sum,p)=>sum+p.seconds,0),break_seconds:600,off_slide_breaks:schedule.off_slide_breaks});write('version_manifest.json',manifest);
const assetVersions=[];
const versionedHTML=html.replace(/\b(src|href)="([^"]+)"/g,(attribute,name,href)=>{const file=resourcePath(href);if(/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(file)||! /\.(?:js|css)$/i.test(file))return attribute;const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);assetVersions.push({file,sha256_12:sha});return `${name}="${file}?v=${sha}"`;});
fs.writeFileSync(path.join(root,'index.html'),versionedHTML.replace(/max="\d+" value="1" aria-label="页码"/,`max="${plan.length}" value="1" aria-label="页码"`).replace(/id="page-total">\/ \d+/,`id="page-total">/ ${plan.length}`));
write('qa/asset-versions.json',{date:'2026-10-19',method:'sha256 first 12 characters; index references updated after generated data is written',assets:assetVersions});
console.log(JSON.stringify({pages:plan.length,states:manifest.state_count,seconds:t,versioned_assets:assetVersions.length}));

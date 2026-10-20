const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve('第01讲-LLM-Agents/v02-导入与LLM基础HTML'),q=path.join(root,'qa/memory-wording-r15');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8')),old=read('qa/memory-wording-r15/before/slides.json'),now=read('slides.json');
const changed=now.filter((p,i)=>JSON.stringify(p)!==JSON.stringify(old[i])).map(p=>p.page);
if(changed.some(p=>p<76||p>113))throw Error('Unexpected metadata change outside Memory');
if(now.some((p,i)=>p.renderer!==old[i].renderer||p.seconds!==old[i].seconds||JSON.stringify(p.playback)!==JSON.stringify(old[i].playback)))throw Error('Structure or playback changed');
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if(sha(path.join(root,'src/memory-r8-data.js'))!==sha(path.join(q,'before/src/memory-r8-data.js')))throw Error('Raw case data changed');
const beforeData=read('qa/memory-wording-r15/before/src/memory-r8.json'),newData=read('src/memory-r8.json');
for(const [id,s]of Object.entries(beforeData.materials)){if(s.includes('\n\n当前任务\n')){if(s.slice(s.indexOf('\n\n当前任务\n'))!==newData.materials[id].slice(newData.materials[id].indexOf('\n\n当前任务\n')))throw Error('Embedded case text changed '+id);}}
function render(previous){const ctx={window:{}};vm.createContext(ctx);const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const m of html.matchAll(/<script src="([^"]+)"/g)){const n=m[1].split('?')[0];if(n.endsWith('/player.js'))continue;const bp=path.join(q,'before',n);vm.runInContext(fs.readFileSync(previous&&fs.existsSync(bp)?bp:path.join(root,n),'utf8'),ctx);}return now.map(p=>ctx.window.MBA_RENDERERS[p.renderer].render(p.playback.source_steps[0]));}
const beforeHTML=render(true),afterHTML=render(false);const changedRenders=now.filter((p,i)=>beforeHTML[i]!==afterHTML[i]).map(p=>p.page);
if(changedRenders.some(p=>p<76||p>113))throw Error('Unexpected rendered change outside Memory');
const report={pages:now.length,states:now.reduce((s,p)=>s+p.playback.source_steps.length,0),structure_unchanged:true,metadata_changed_pages:changed,render_changed_pages:changedRenders,non_memory_render_unchanged:true,raw_memory_data_sha256:sha(path.join(root,'src/memory-r8-data.js')),raw_case_materials_unchanged:true};fs.writeFileSync(path.join(q,'static-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));

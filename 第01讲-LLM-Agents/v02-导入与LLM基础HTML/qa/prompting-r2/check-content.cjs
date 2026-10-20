const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'../..'); const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const P=read('sources/prompting-r2/prompts.json'),visible=read('sources/prompting-r2/pdf-visible-prompts.json');
const ctx={window:{MBA_RENDERERS:{}}}; vm.createContext(ctx);
for(const f of ['src/prompting-r2-data.js','src/prompting-r2.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const plain=s=>s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,'');
const rawPages={1:[21],2:[23],3:[25],4:[27,28],5:[30],6:[33],7:[34],8:[36],9:[39],10:[41]};
let report=[];
for(const p of P){const html=rawPages[p.id].map(n=>ctx.window.MBA_RENDERERS[n+286].render()).join(''); const lines=[...html.matchAll(/<div class="pr-prompt-line[^\"]*">([\s\S]*?)<\/div>/g)].map(m=>plain(m[1]));assert.deepStrictEqual(lines,p.lines.map(x=>plain(x.text)));report.push({id:p.id,title:p.title,pages:rawPages[p.id],lines:lines.length,exactPromptText:true});}
const plan=read('slides.json'),materials=read('materials.json');const active=plan.filter(x=>x.section==='Prompting');assert.equal(active.length,30);assert.equal(active.reduce((n,p)=>n+p.seconds,0),2100);assert.equal(plan.reduce((n,p)=>n+p.seconds,0),10800);
for(const p of active){assert.equal(p.playback.source_steps.length,1);assert.equal(p.show_sources,false);assert(!/青禾|食品公司|没有实际运行|教学示意|不代表同一次|挖掘隐藏天赋|人生设计术/.test(JSON.stringify(p)+materials[p.page]));}
const rendered=Array.from({length:30},(_,i)=>ctx.window.MBA_RENDERERS[301+i].render()).join('');assert(!/href=|<button|<input|<select|data-reveal/.test(rendered));
const old=read('qa/prompting-r2/previous/slides.json');for(let n=3;n<14;n++)assert.equal(JSON.stringify(plan[n]),JSON.stringify(old[n]));
fs.writeFileSync(path.join(__dirname,'content-check.json'),JSON.stringify({promptingPages:30,minutes:35,lectureMinutes:180,defaultFullDisplay:true,unchangedLLMPages:[4,14],originalPromptCoverage:report,method:'Source-to-rendered-text comparison; supplements actual browser review.'},null,2)+'\n');console.log(JSON.stringify({prompts:10,pages:30,originalPromptLines:report.reduce((n,r)=>n+r.lines,0),lectureSeconds:10800}));

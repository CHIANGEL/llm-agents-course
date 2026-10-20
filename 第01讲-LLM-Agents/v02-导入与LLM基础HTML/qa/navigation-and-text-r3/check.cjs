const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),json=f=>JSON.parse(read(f));
const plan=json('slides.json'),ctx={window:{}};vm.createContext(ctx);
const html=read('index.html'),assets=[];
for(const [,src] of html.matchAll(/<script src="([^"]+)"/g)){const file=src.split('?')[0];assets.push(file);if(!file.endsWith('/player.js'))vm.runInContext(read(file),ctx);}
const rendered=plan.map(p=>ctx.window.MBA_RENDERERS[p.renderer].render(p.playback.source_steps.at(-1)));
const unescape=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const prompts=rendered.flatMap(s=>[...s.matchAll(/<pre\b[^>]*class="[^"]*pr-prompt[^>]*>([\s\S]*?)<\/pre>/g)].map(m=>unescape(m[1])));
const lines=json('sources/prompting-r2/prompts.json').flatMap(p=>p.lines.map(l=>l.text));
for(const line of lines)assert(prompts.some(p=>p.split('\n').includes(line)),'Missing prompt line: '+line);
for(const p of prompts)assert(!/<\/?(?:span|strong|div|br)\b/.test(p),'Prompt contains rich markup');
assert.equal(plan.length,139);assert.equal(plan.reduce((n,p)=>n+p.seconds,0),10800);assert.equal(plan.reduce((n,p)=>n+p.playback.source_steps.length,0),153);
assert.equal(plan.filter(p=>p.type==='agenda').length,13);assert.equal(new Set(plan.map(p=>p.renderer)).size,139);
assert(!rendered.some(s=>/《Prompting技巧》.*第\d+页/.test(s)));
const nav=ctx.window.MBA_NAV,ids=['0',...nav.groups.flatMap(g=>g.children.map(c=>c.id))];
for(const p of plan){assert(ids.includes(p.navigation),'Bad navigation '+p.page);const h=ctx.window.MBA_NAVIGATION.footer(p);assert(h.includes('课程进度'));assert(!h.includes('data-deck-goto="-1"'));}
for(const p of plan.filter(p=>p.renderer>=301&&p.renderer<=330)){assert.strictEqual(p.show_sources,false);assert.deepEqual(ctx.window.MBA_FILES[p.page],[]);}
for(const [,src] of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(?:data:|https?:|#)/.test(src))continue;assert(fs.existsSync(path.join(root,src.split('?')[0])),src);}
const result={pages:139,states:153,seconds:10800,agenda_pages:13,prompt_regions:prompts.length,original_prompt_lines:lines.length,original_prompts:10,all_original_lines_preserved:true,plain_prompt_markup:true,all_navigation_targets_valid:true,prompt_source_links:0,script_assets:assets.length};
fs.writeFileSync(path.join(__dirname,'structural-check.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));

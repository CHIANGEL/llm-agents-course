// Logic-level checks only: this does not stand in for visual or browser interaction review.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const ctx={window:{}};vm.createContext(ctx);
for(const[,href]of read('index.html').matchAll(/<script src="([^"]+)"/g)){const f=href.split(/[?#]/)[0];if(f.endsWith('/player.js')||f.endsWith('/llm-foundations.js'))continue;vm.runInContext(read(f),ctx);}
if(fs.existsSync(path.join(root,'src/llm-foundations.js')))vm.runInContext(read('src/llm-foundations.js'),ctx);
let plan=JSON.parse(JSON.stringify(ctx.window.MBA_PLAN));
const defs=ctx.window.MBA_RENDERERS,policy=JSON.parse(read('src/playback-policy.json'));
// Use the generated current plan, including module replacements and sub-agendas.
for(const p of plan){const d=defs[p.renderer??p.page],rule=policy.pages[p.authoring_page??p.page]||d.playback;assert(d);const sourceSteps=rule?.source_steps||[d.steps-1];assert(sourceSteps.every(s=>Number.isInteger(s)&&s>=0&&s<d.steps));p.playback={mode:sourceSteps.length>1?'mechanism':'full',source_steps:sourceSteps,reveal:rule?.reveal||(sourceSteps.length>1?'original':'all')};}
class Element{
 constructor(name){this.name=name;this.dataset={};this.style={};this.events={};this.value='1';this.open=false;this.children=[];this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x),contains:x=>this.classes.has(x),toggle:(x,b)=>{if(b===undefined)b=!this.classes.has(x);b?this.classes.add(x):this.classes.delete(x);return b;}};}
 set innerHTML(v){this.html=v;this.children=[];if(this.name==='#print-deck'){for(const match of v.matchAll(/<article\b([^>]+)>([\s\S]*?)<\/article>/g)){const n=new Element('article');n.dataset.page=match[1].match(/data-page="(\d+)"/)[1];n.dataset.step=match[1].match(/data-step="(\d+)"/)[1];n.innerHTML=match[2];this.children.push(n);}}else for(const m of v.matchAll(/\bdata-reveal="(\d+)"/g)){const n=new Element('reveal');n.dataset.reveal=m[1];this.children.push(n);}}
 get innerHTML(){return this.html||'';}
 querySelectorAll(q){return q==='.slide'||q==='[data-reveal]'?this.children:[];}
 setAttribute(k,v){this[k]=v;}
 addEventListener(k,f){this.events[k]=f;}
 matches(){return false;}
 contains(){return false;}
 getBoundingClientRect(){return{height:60,left:0,top:0,right:1600,bottom:900};}
 focus(){document.activeElement=this;}
 closest(){return null;}
 showModal(){this.open=true;}
 close(){this.open=false;}
}
const elements=new Map(),get=q=>{if(!elements.has(q))elements.set(q,new Element(q));return elements.get(q);};
const document={querySelector:get,body:new Element('body'),documentElement:{style:{setProperty(){}}},activeElement:null,events:{},addEventListener(k,f){this.events[k]=f;},contains(){return true;}};
const winEvents={},location={hash:'#p=21&s=3'},history={replaceState(a,b,h){location.hash=h;}};
Object.assign(ctx,{document,location,history,innerWidth:1600,innerHeight:900,URLSearchParams,ResizeObserver:class{observe(){}},addEventListener:(k,f)=>winEvents[k]=f,requestAnimationFrame:f=>f(),setTimeout:()=>0});
ctx.window.MBA_PLAN=plan;ctx.window.getSelection=()=>null;
vm.runInContext(read('src/player.js'),ctx);
const api=ctx.window.deckAPI,checks=[],normalize=s=>s.replace(/c5-svg-\d+/g,'c5-svg-N');
function check(name,test){test();checks.push({name,status:'passed'});}
check('Old ordinary-page hash is clamped to the complete page',()=>{assert.equal(api.getState().page,21);assert.equal(api.getState().steps,1);assert.equal(location.hash,'#p=21&s=1');assert.equal(get('#step-label').textContent,'整页显示');});
const expected=plan.flatMap((p,i)=>p.playback.source_steps.map((sourceStep,step)=>({page:p.page,index:i,step,sourceStep,steps:p.playback.source_steps.length})));
check('Every forward state maps to its intended original renderer state',()=>{api.go(0);for(const e of expected){const a=api.getState();for(const k of ['page','step','sourceStep','steps'])assert.equal(a[k],e[k]);const html=get('#mount').innerHTML;assert(normalize(html).includes(normalize(defs[plan[e.index].renderer??e.page].render(e.sourceStep))), `Rendered content page ${e.page} state ${e.step}`);for(const n of get('#mount').children){const target=plan[e.index].playback.reveal==='all'?Infinity:e.sourceStep;assert.equal(n.classList.contains('future'),Number(n.dataset.reveal)>target);}api.next();}assert.equal(api.getState().page,plan.length);});
check('Every reverse state restores the corresponding original state',()=>{for(const e of expected.slice().reverse()){const a=api.getState();for(const k of ['page','step','sourceStep','steps'])assert.equal(a[k],e[k]);api.prev();}assert.equal(api.getState().page,1);});
check('Every ordinary page contains all former reveal blocks on entry',()=>{for(const p of plan.filter(p=>p.playback.mode==='full')){api.go(p.page-1);assert.equal(api.getState().steps,1);assert(get('#mount').children.every(n=>!n.classList.contains('future')));}});
check('Retained mechanisms preserve source reveal thresholds',()=>{for(const p of plan.filter(p=>p.playback.mode==='mechanism'))for(let s=0;s<p.playback.source_steps.length;s++){api.go(p.page-1,s);for(const n of get('#mount').children)assert.equal(n.classList.contains('future'),Number(n.dataset.reveal)>p.playback.source_steps[s]);}});
check('Print retains every selected mechanism state and every complete ordinary page',()=>{const print=get('#print-deck').children;assert.equal(print.length,expected.length);print.forEach((n,i)=>{assert.equal(Number(n.dataset.page),expected[i].page);assert.equal(Number(n.dataset.step),expected[i].step+1);});});
check('Legacy high step hashes, negative values and non-finite values remain bounded',()=>{for(const hash of ['#p=25&s=100','#p=21&s=-99','#p=78&s=NaN','#p=999&s=999']){location.hash=hash;winEvents.hashchange();const s=api.getState();assert(s.page>=1&&s.page<=plan.length);assert(s.step>=0&&s.step<s.steps);assert(!location.hash.includes('NaN'));}});
check('Normal-page next crosses the page boundary in one action',()=>{api.go(20);api.next();assert.equal(api.getState().page,22);api.prev();assert.equal(api.getState().page,21);assert.equal(api.getState().step,0);});
check('Mechanism source-state mappings agree with the current plan',()=>{for(const [i,p] of plan.entries()){if(p.playback.mode!=='mechanism')continue;for(let n=0;n<p.playback.source_steps.length;n++){api.go(i,n);assert.equal(api.getState().sourceStep,p.playback.source_steps[n]);}}});
check('The table of contents includes every renumbered page exactly once',()=>{document.events.keydown({key:'g',target:new Element('keyboard-target')});const indexes=Array.from(get('#dialog-content').innerHTML.matchAll(/data-goto="(\d+)"/g),m=>Number(m[1]));assert.equal(indexes.length,plan.length);assert.equal(new Set(indexes).size,plan.length);assert(indexes.every((n,i)=>n===i));get('#deck-dialog').close();});
check('Double-clicks inside controls do not open figure zoom',()=>{for(const name of ['button','a','input','select','textarea','[contenteditable=true]'])for(let i=0;i<5;i++){get('#mount').events.dblclick({target:{closest:q=>q.split(',').includes(name)?{}:null}});assert.equal(get('#deck-dialog').open,false);}});
check('Every JS and CSS index reference has a hash matching the current file',()=>{const refs=Array.from(read('index.html').matchAll(/\b(?:src|href)="([^\"]+\.(?:js|css))(?:\?([^\"]*))?"/g));assert(refs.length>0);for(const[,file,query]of refs){const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);assert.equal(query,'v='+sha);}});
const result={date:new Date().toISOString().slice(0,10),method:'Node VM execution with a minimal DOM; logic checks only, not visual or browser tests',pages:plan.length,states:expected.length,ordinary_pages:plan.filter(p=>p.playback.mode==='full').length,mechanism_pages:plan.filter(p=>p.playback.mode==='mechanism').map(p=>({page:p.page,authoring_page:p.authoring_page??p.page,source_steps:p.playback.source_steps})),checks};
fs.writeFileSync(path.join(__dirname,'playback-policy-checks.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({pages:result.pages,states:result.states,checks:checks.length,status:'passed',method:result.method}));

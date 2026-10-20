(function(){'use strict';
const D=window.MBA_DECODING_DATA,L=D.sorted_logits,N=L.length;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=p=>(100*p).toFixed(2)+'%',num=n=>n.toLocaleString('en-US');
const defaults=()=>({temperature:1,top_k:0,top_p:1});
function distribution(s){
 const t=Number(s.temperature),k=Number(s.top_k),p=Number(s.top_p);
 const weights=L.map(z=>Math.exp((z-L[0])/t));
 const total=weights.reduce((a,b)=>a+b,0);
 let kept=k?Math.min(k,N):N;
 // Top-k retains ties at the cutoff, matching Transformers.
 if(k)while(kept<N&&L[kept]===L[kept-1])kept++;
 const kMass=weights.slice(0,kept).reduce((a,b)=>a+b,0);
 if(p<1){let cumulative=0,j=0;do{cumulative+=weights[j++];}while(j<kept&&cumulative/kMass<p);kept=j;}
 const retainedWeight=weights.slice(0,kept).reduce((a,b)=>a+b,0);
 const probs=weights.map((w,i)=>i<kept?w/retainedWeight:0);
 const top5=probs.slice(0,5),other=probs.slice(5).reduce((a,b)=>a+b,0);
 return{top5,other,retained:kept,retainedMass:retainedWeight/total,temperatureTop5:weights.slice(0,5).map(w=>w/total),cutoffCumulative:retainedWeight/kMass};
}
const baseline=distribution(defaults());
function plots(s){const r=distribution(s),a=[...baseline.top5,baseline.other],b=[...r.top5,r.other];
 const names=[...D.top_labels,'其他候选合计'];
 return `<div class="dec-chart-head"><span>候选Token</span><span>原始概率</span><span>调整后的抽样概率</span></div>${names.map((name,i)=>`<div class="dec-chart-row${i===5?' dec-other':''}"><span class="dec-label">${esc(name)}</span><div class="dec-bar-cell"><div class="dec-track"><i class="dec-original" style="width:${a[i]*100}%"></i></div><span>${fmt(a[i])}</span></div><div class="dec-bar-cell"><div class="dec-track"><i class="dec-adjusted" style="width:${b[i]*100}%"></i></div><span class="${b[i]===0?'dec-excluded':''}">${b[i]===0?'已排除':fmt(b[i])}</span></div></div>`).join('')}<div class="dec-chart-axis"><span></span><span>0 <b>100%</b></span><span>0 <b>100%</b></span></div><p class="dec-result">保留 <strong>${num(r.retained)}</strong> / ${num(N)} 个候选，抽样概率合计 <strong>100%</strong>。</p><p class="dec-explanation">${s.top_p<1?`top-p = ${(s.top_p*100).toFixed(0)}%：保留到第 ${num(r.retained)} 项，累计 ${fmt(r.cutoffCumulative)}。`:s.top_k>0?`top-k保留排名最靠前的 ${num(r.retained)} 项；被排除的候选不再参与抽样。`:s.temperature<1?'温度低于1：概率更集中，The更容易被抽中。':s.temperature>1?'温度高于1：概率更分散，更多候选有机会被抽中。':'原始分布保持不变；按这些概率抽取下一个Token。'}</p>`;
}
const presets={cool:{temperature:.5,top_k:0,top_p:1},warm:{temperature:1.5,top_k:0,top_p:1},k3:{temperature:1,top_k:3,top_p:1},p50:{temperature:1,top_k:0,top_p:.5},reset:defaults()};
function lab(s=defaults()){return `<div class="dec-top"><span>同一份输入、同一组候选：解码参数决定怎样调整分布并抽样。</span><button data-dec-view="base">← 返回生成案例</button></div>
<div class="dec-flow">原始分布 <i>→</i> 温度：调概率 <i>→</i> top-k / top-p：筛候选 <i>→</i> 重新归一化后抽样</div>
<div class="dec-controls">
<section><label>温度 temperature <output data-dec-value="temperature">${s.temperature.toFixed(1)}</output><input aria-label="温度 temperature" data-dec-param="temperature" type="range" min="0.2" max="2" step="0.1" value="${s.temperature}"></label><p>低于1更集中，高于1更分散。<br>1保持原始概率。</p></section>
<section><label>top-k <select aria-label="top-k" data-dec-param="top_k">${[0,1,2,3,5,10,20,50,100].map(k=>`<option value="${k}" ${s.top_k===k?'selected':''}>${k?'前'+k+'项':'不限'}</option>`).join('')}</select></label><p>按概率排序，保留前k项。<br>k限定候选数量。</p></section>
<section><label>top-p <output data-dec-value="top_p">${s.top_p.toFixed(2)}</output><input aria-label="top-p" data-dec-param="top_p" type="range" min="0.05" max="1" step="0.05" value="${s.top_p}"></label><p>从高到低累计，达到p即停止。<br>跨过阈值的最后一项也保留。</p></section>
</div><div class="dec-chart">${plots(s)}</div>
<div class="dec-presets"><span>对照：</span><button data-dec-preset="cool">温度0.5</button><button data-dec-preset="warm">温度1.5</button><button data-dec-preset="k3">top-k = 3</button><button data-dec-preset="p50">top-p = 0.50</button><button data-dec-preset="reset">恢复原始分布</button></div>
<p class="dec-summary">温度改变概率差距；top-k限定数量，top-p限定累计概率。它们改变选择方式，不改模型参数。</p>
<p class="dec-foot">同时设置时：温度 → top-k → top-p。图中两列都按完整词表计算；“其他”是多项概率之和。</p>`;}
window.MBA_DECODING={distribution,lab,baseline,defaults};
if(typeof document==='undefined')return;
const views=()=>[...document.querySelectorAll('#mount .lf-decoding-host,#deck-dialog[open] .lf-decoding-host')];
function state(view){return JSON.parse(view.dataset.decodingState||JSON.stringify(defaults()));}
function show(view,s){view.dataset.decodingView='lab';view.dataset.decodingState=JSON.stringify(s);view.innerHTML=lab(s);mark(view,s);}
function mark(view,s){view.querySelectorAll('[data-dec-preset]').forEach(b=>b.setAttribute('aria-pressed',JSON.stringify(presets[b.dataset.decPreset])===JSON.stringify(s)?'true':'false'));}
function update(s){for(const v of views()){if(v.dataset.decodingView!=='lab')continue;v.dataset.decodingState=JSON.stringify(s);v.querySelectorAll('[data-dec-param]').forEach(input=>{input.value=String(s[input.dataset.decParam]);if(input.tagName==='SELECT'){for(const option of input.options){option.toggleAttribute('selected',option.selected);}}else input.setAttribute('value',input.value);});v.querySelectorAll('[data-dec-value]').forEach(o=>{o.textContent=Number(s[o.dataset.decValue]).toFixed(o.dataset.decValue==='temperature'?1:2);});v.querySelector('.dec-chart').innerHTML=plots(s);mark(v,s);}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-dec-view],[data-dec-preset]');if(!b)return;const host=b.closest('.lf-decoding-host');if(!host)return;
 if(b.dataset.decView==='lab'){views().forEach(v=>show(v,defaults()));host.querySelector('[data-dec-view="base"]').focus({preventScroll:true});}
 else if(b.dataset.decView==='base'){views().forEach(v=>{const t=document.createElement('template');t.innerHTML=window.MBA_RENDERERS[203].render();v.replaceWith(t.content.firstElementChild);});document.querySelector('#deck-dialog[open] [data-dec-view="lab"],#mount [data-dec-view="lab"]')?.focus({preventScroll:true});}
 else update({...presets[b.dataset.decPreset]});e.stopPropagation();});
for(const type of ['input','change'])document.addEventListener(type,e=>{const input=e.target.closest('[data-dec-param]');if(!input)return;const host=input.closest('.lf-decoding-host');if(!host)return;const s=state(host);s[input.dataset.decParam]=Number(input.value);update(s);});
})();

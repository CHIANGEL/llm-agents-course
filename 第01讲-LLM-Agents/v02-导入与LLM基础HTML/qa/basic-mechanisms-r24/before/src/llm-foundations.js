(function(){'use strict';
const R=window.MBA_RENDERERS,T=window.MBA_LLM_TRACE,C=window.MBA_CHAT_CASES;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const at=(x,y,w,t,c='lf-text')=>`<div class="at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const svg=t=>`<svg class="lf-svg" viewBox="0 0 1504 718" aria-hidden="true">${t}</svg>`;
const arrow=(x,y,w,col='#0070c0')=>`<path d="M${x} ${y} h${w} m-14 -9 l14 9 -14 9" fill="none" stroke="${col}" stroke-width="3"/>`;
const line=(y,x=0,w=1480)=>`<path d="M${x} ${y} h${w}" fill="none" stroke="#cad5e5" stroke-width="2"/>`;
const paper=(x,y,w,h)=>`<path d="M${x} ${y} H${x+w-26} L${x+w} ${y+26} V${y+h} H${x} Z M${x+w-26} ${y} V${y+26} H${x+w}" fill="white" stroke="#003f98" stroke-width="2"/>`;
const wrap=t=>`<div class="lf-page">${t}</div>`;
const pct=n=>(n*100).toFixed(2)+'%';
const token=t=>t==='<|im_end|>'?'&lt;|im_end|&gt;':t==='\n'?'换行':t==='\n\n'?'两个换行':esc(t.replace(/^ /,'␠').replace(/\n/g,'↵'));
const model=()=>at(0,680,1495,'SmolLM2-135M-Instruct · 每一步选择概率最高的候选','lf-caption');
function chart(step,x,y,width=680){const a=T.steps[step],top=a.top10.slice(0,5),other=a.top5_remaining_probability;const bw=width-310;
 const rows=top.map(d=>({label:token(d.token_text),p:d.probability,chosen:d.token_id===a.chosen_token_id})).concat([{label:'其他候选合计',p:other,other:true}]);
 return `<div class="at lf-chart" style="left:${x}px;top:${y}px;width:${width}px"><div class="lf-chart-head">下一个Token<span>概率</span></div>${rows.map(d=>`<div class="lf-chart-row${d.chosen?' is-selected':''}"><span class="lf-candidate">${d.label}</span><div class="lf-bar-track" style="width:${bw}px"><i style="width:${d.p*100}%;background:${d.other?'#9baac1':d.chosen?'#c00000':'#0070c0'}"></i></div><span class="lf-prob">${pct(d.p)}</span></div>`).join('')}<div class="lf-chart-axis" style="margin-left:190px;width:${bw}px"><span>0</span><span>100%</span></div></div>`;
}
function sequenceDiagram(summary=false){return wrap(`
${at(0,0,1490,summary?'每一轮聊天，都回到同一个生成过程。':'先解释回答怎样生成，再解释聊天记录怎样进入这次生成。')}
${at(10,112,400,'① 应用组织输入','lf-heading')}${at(555,112,425,'② 模型逐Token生成','lf-heading')}${at(1133,112,360,'③ 本轮回复结束','lf-heading')}
${svg(paper(10,193,410,265)+arrow(445,323,92)+arrow(1005,323,105))}
${at(42,222,350,'任务要求<br>用户消息<br>以前的助手回复','lf-text lf-lines')}
${at(545,210,470,'预测候选 → 选出一个','lf-text')}
${at(560,282,430,'The → lecture → scheduled','lf-token-text')}
${at(555,364,440,'新Token接到已有前文后','lf-small')}
${svg('<path d="M955 404 V460 H605 V414 m-9 13 l9 -13 9 13" fill="none" stroke="#0070c0" stroke-width="3"/>')}
${at(636,471,400,'继续预测下一个','lf-small')}
${at(1145,224,325,'生成结束标记','lf-text')}${at(1145,294,325,'&lt;|im_end|&gt;','lf-mono red')}${at(1145,370,325,'停止本次生成','lf-small')}
${svg('<path d="M1300 475 V582 H215 V485 m-9 13 l9 -13 9 13" fill="none" stroke="#003f98" stroke-width="3"/>')}
${at(440,589,880,'下一轮：把新消息加入历史，再组织输入','lf-small')}
${at(10,662,1470,summary?'Prompting要解决的，就是怎样把任务和材料写进这份输入。':'两个问题：每一个Token如何产生？多轮消息如何拼成一份输入？','lf-small strong')}
`);}
R[201]={steps:1,render:()=>sequenceDiagram(false)};
R[202]={steps:1,render(){return wrap(`
${at(0,0,1490,'任务：用一句简短、正式的话，通知今天的讲座取消。')}
${at(15,102,500,'输入的要求','lf-heading')}${svg(paper(8,163,1470,171))}
${at(42,193,1390,esc(T.messages[1].content),'lf-english')}
${svg('<path d="M742 352 V412 m-10 -15 l10 15 10 -15" fill="none" stroke="#0070c0" stroke-width="3"/>')}
${at(15,441,550,'完整生成结果','lf-heading')}
${at(15,511,1470,esc(T.output_text),'lf-answer')}
${at(15,585,1450,'原定于今天的讲座已取消。','lf-small')}
${at(15,632,1450,'Token是生成文本的单位，可以是词、词的一部分、标点或特殊标记。','lf-small')}
${model()}
`);}};
R[203]={steps:1,render(){return `<div class="lf-page lf-decoding-host" data-decoding-view="base">
${at(0,0,1490,'模型对词表中的49,152个候选分配概率，本次选概率最高的一项。')}
${at(12,107,630,'本次任务','lf-heading')}${svg(paper(10,175,640,260))}
${at(40,204,575,esc(T.messages[1].content),'lf-english')}
${at(10,473,655,'第一步选中：<span class="red">The</span>','lf-heading')}
${at(10,543,660,'26.92%已是单个候选中的最高值。<br>其余概率分散在许多其他候选上。','lf-small')}
${svg(arrow(668,318,66))}${chart(0,754,105,735)}
${at(10,630,940,'按概率抽样时，较低概率的候选也有机会被选中。','lf-small')}
${at(998,620,500,'<button data-dec-view="lab">温度 · top-k · top-p →</button>')}
${model()}
</div>`;}};
R[204]={steps:1,render(){const a=T.steps[0],b=T.steps[1];return wrap(`
${at(0,0,1480,'第二步使用同一份任务输入，并加上第一步已经生成的 The。')}
${at(10,107,450,'这一轮已有的前文','lf-heading')}${at(945,107,520,'下一Token的主要候选','lf-heading')}
${svg(line(168))}
${at(10,212,150,'第1步','lf-heading')}${at(190,209,620,'完整任务输入','lf-text')}
${svg(arrow(800,240,105))}
${at(945,195,530,`<span class="red">The　${pct(a.top10[0].probability)}</span><br>"　${pct(a.top10[1].probability)}<br>We　${pct(a.top10[2].probability)}`,'lf-small lf-lines')}
${svg(line(365))}
${at(10,412,150,'第2步','lf-heading')}${at(190,408,620,'完整任务输入 + <span class="red">The</span>','lf-text')}
${svg(arrow(800,441,105))}
${at(945,397,540,b.top10.slice(0,3).map((x,i)=>`<span class="${i===0?'red':''}">${token(x.token_text)}　${pct(x.probability)}</span>`).join('<br>'),'lf-small lf-lines')}
${at(10,590,1480,'每次都依据完整前文重新预测；新生成的内容也成为下一步的条件。','lf-text strong')}
${at(10,666,1450,'␠表示Token自带的空格。Token是模型生成文本的单位。','lf-caption')}
`);}};
function demo(n){const d=T.steps[n];return `
${at(0,0,1490,'整条生成轨迹保持可见，选择任意一步查看当时的前文与候选。')}
<div class="at lf-token-rail" style="left:0;top:74px;width:1490px">${T.steps.map((s,i)=>`<button data-token-index="${i}" aria-label="查看第${i+1}步" aria-pressed="${i===n}" class="${i===n?'active':''}"><small>${i+1}</small>${s.eos?'结束':token(s.chosen_token_text)}</button>`).join('')}</div>
<div class="at lf-demo-controls" style="left:0;top:155px;width:1490px"><button data-token-move="-1" ${n===0?'disabled':''}>← 上一个Token</button><button data-token-move="1" ${n===9?'disabled':''}>下一个Token →</button><button data-token-index="0">从头查看</button><span>当前第 ${n+1} / 10 步</span></div>
${at(0,231,690,'当前任务与已生成内容','lf-heading')}
${at(0,296,685,esc(T.messages[1].content),'lf-small')}
${at(0,423,690,`已生成：<span class="lf-prefix">${d.generated_before?esc(d.generated_before):'尚未生成回复文字'}</span>`,'lf-small')}
${at(0,531,695,`本步选中：<span class="red">${d.eos?'结束标记 &lt;|im_end|&gt;':token(d.chosen_token_text)}</span>`,'lf-text')}
${chart(n,766,222,722)}
${at(0,628,1490,`累计输出：<span class="black">${esc(d.generated_after.replace('<|im_end|>',''))}</span>${d.eos?'　<span class="red">本轮结束</span>':''}`,'lf-small strong')}
${at(0,684,1480,'␠表示空格；前5项之外的概率仍计入“其他候选合计”。','lf-caption')}`;}
R[205]={steps:1,render(){return `<div class="lf-page ntp-demo" data-token-current="0">${demo(0)}</div>`;}};
R[206]={steps:1,render(){return wrap(`
${at(0,0,1490,'第9步先生成句号，第10步再生成结束标记，本次回复才停止。')}
${at(8,98,720,'第9步：选择句号','lf-heading')}${at(795,98,700,'第10步：选择结束标记','lf-heading')}
${chart(8,4,160,715)}${chart(9,786,160,715)}
${at(8,600,1478,'The lecture scheduled for today has been cancelled<span class="red">.</span> <span class="blue">&lt;|im_end|&gt;</span>','lf-ending')}
${at(8,668,1480,'句号也是输出内容。结束标记或生成长度上限会触发停止。','lf-small')}
`);}};
R[207]={steps:1,render(){return wrap(`
${at(0,0,1490,'聊天模板（chat template）把消息按顺序拼接，并标明角色与边界。')}
${at(6,100,500,'聊天界面中的消息','lf-heading')}${at(660,100,820,'模型收到的连续文本','lf-heading')}
${svg(paper(0,177,510,300)+arrow(530,299,100))}
${at(28,193,448,'用户：','lf-small')}
${at(28,244,448,esc(T.messages[1].content),'lf-small')}
${at(14,510,510,'应用先组织输入，\n模型从输入末尾继续写。','lf-text lf-preline')}
<div class="at lf-template lf-english-template" style="left:660px;top:175px;width:834px"><div><b>&lt;|im_start|&gt;</b>system</div><div>You are a helpful assistant.<b>&lt;|im_end|&gt;</b></div><div><b>&lt;|im_start|&gt;</b>user</div><div class="lf-template-long">${esc(T.messages[1].content)}<b>&lt;|im_end|&gt;</b></div><div><b>&lt;|im_start|&gt;</b>assistant</div><div class="red lf-cursor">▌从这里继续生成回复</div></div>
${at(0,634,1490,'“输入 → 预测一个Token → 追加 → 继续”的机制保持不变。','lf-text strong')}
${at(0,687,1480,'下面沿用同一种SmolLM2模板，展开三轮消息如何接在一起。','lf-caption')}
`);}};
function templateHTML(c){return c.template_text.trimEnd().split('\n').map((s,i)=>`<div class="${i>=c.template_text.trimEnd().split('\n').length-3?'lf-new-line':''}">${esc(s).replace(/(&lt;\|im_start\|&gt;|&lt;\|im_end\|&gt;)/g,'<b>$1</b>')}</div>`).join('');}
function chatPage(n){const c=C[n],text=[
'先放入应用要求和用户问题，最后加上等待续写的 assistant 头。',
'追问“5人呢？”时，原问题、60元的回复和新问题一起进入输入。',
'再问预算时，前两轮问答仍在同一个序列中，新问题接在最后。'][n];
 const messages=c.browser_messages,dy=n===2?98:110;
 return wrap(`${at(0,0,1490,text)}
${at(8,83,520,'聊天窗口','lf-heading')}${at(650,83,840,'完整输入文本 · SmolLM2模板','lf-heading')}
${messages.map((m,i)=>`<div class="at lf-bubble ${m.role==='assistant'?'assistant':'user'}" style="left:${m.role==='assistant'?10:74}px;top:${153+i*dy}px;width:465px"><small>${m.role==='assistant'?'助手':'用户'}</small><span>${esc(m.content)}</span></div>`).join('')}
${svg(arrow(548,309,75))}
<div class="at lf-template" style="left:650px;top:147px;width:840px">${templateHTML(c)}<div class="lf-cursor red">▌接下来生成：${esc(c.subsequent_illustrative_answer)}</div></div>
${n===0?at(6,422,555,'system：应用提供的要求<br>user：用户的消息<br>assistant：助手的消息','lf-small lf-lines'):''}
${n===1?at(8,530,550,'“每人20元”仍在原问题中，<br>这次计算沿用这个条件。','lf-small'):''}
${at(8,656,1480,n===0?'&lt;|im_start|&gt; 开始一条消息；&lt;|im_end|&gt; 结束一条消息。':n===1?'旧回复成为历史的一部分；新的回复仍然从最后一个 assistant 头后开始。':'三轮对话是逐次增长的输入序列；这次仍然是在末尾继续生成。','lf-small strong')}
`);}
R[208]={steps:1,render:()=>chatPage(0)};
R[209]={steps:1,render:()=>chatPage(1)};
R[210]={steps:1,render:()=>chatPage(2)};
R[211]={steps:1,render:()=>sequenceDiagram(true)};
if(typeof document!=='undefined')document.addEventListener('click',e=>{const b=e.target.closest('[data-token-index],[data-token-move]');if(!b)return;const holder=b.closest('.ntp-demo');if(!holder)return;const previous=Number(holder.dataset.tokenCurrent||0);let n=b.hasAttribute('data-token-index')?Number(b.dataset.tokenIndex):previous+Number(b.dataset.tokenMove);n=Math.max(0,Math.min(9,n));document.querySelectorAll('#mount .ntp-demo,#deck-dialog[open] .ntp-demo').forEach(view=>{view.dataset.tokenCurrent=n;view.innerHTML=demo(n);});const active=holder.querySelector(`[data-token-index="${n}"]`);active?.focus({preventScroll:true});e.stopPropagation();});
})();

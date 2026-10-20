(function(){
'use strict';
const R=window.MBA_RENDERERS,D=window.TOOL_CALLING_R7;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const at=(x,y,w,t,cls='')=>`<div class="tr7-at ${cls}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const image=(x,y,w,h,name)=>`<img class="tr7-at tr7-image" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/${name}" alt="">`;
const svg=s=>`<svg class="tr7-lines" viewBox="0 0 1504 718" aria-hidden="true"><defs><marker id="tr7-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="#0070c0" stroke-width="2"/></marker></defs>${s}</svg>`;
const arrow=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#tr7-arrow)"/>`;
const path=d=>`<path d="${d}" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#tr7-arrow)"/>`;
const line=y=>`<path d="M0 ${y} H1504" stroke="#c5d3e2" stroke-width="2"/>`;
const paper=(x,y,w,h)=>`<path d="M${x} ${y} H${x+w-25} L${x+w} ${y+25} V${y+h} H${x} Z M${x+w-25} ${y} V${y+25} H${x+w}" fill="#fff" stroke="#8ca6c6" stroke-width="2"/>`;
const pre=(x,y,w,h,t)=>`<pre class="tr7-at tr7-code" data-scroll-region tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${esc(t)}</pre>`;
const page=h=>`<div class="tr7">${h}</div>`;
const add=(id,fn)=>R[id]={steps:1,render:fn};
add(2052,()=>page(
at(0,0,1500,'工具调用是大模型与外界发生交互的<span class="tr7-red">主要途径</span>。','tr7-lead')+
image(65,153,180,180,'llm.png')+at(15,350,280,'大模型','tr7-h center')+
image(655,167,150,150,'app.png')+at(540,350,380,'应用程序','tr7-h center')+
image(1215,153,180,180,'tool.png')+at(1125,350,370,'外部数据与系统','tr7-h center')+
svg(arrow(275,225,610,225)+arrow(850,225,1170,225)+path('M1305 415 V485 H155 V415'))+
at(288,158,310,'生成调用请求','tr7-label center')+at(870,158,275,'执行相应工具','tr7-label center')+
at(370,426,770,'返回结果 → 加入输入 → 继续生成','tr7-h center')+
svg(line(560))+
at(0,590,450,'① 为什么需要交互','tr7-h')+at(0,648,450,'取得信息，也能产生影响','tr7-small')+
at(530,590,450,'② 一次调用怎样发生','tr7-h')+at(530,648,450,'用天气查询看完整往返','tr7-small')+
at(1060,590,440,'③ 复杂应用怎样组成','tr7-h')+at(1060,648,440,'Computer Use、文件与记忆','tr7-small')));
add(2053,()=>page(
at(0,0,1500,'调用把请求送出去，返回把外界的结果带回来。','tr7-lead')+
at(0,115,320,'获取外界信息','tr7-h')+at(0,174,345,'天气、新闻、文件','tr7-label')+at(0,237,350,'查询变化中的事实，<br>取得训练截止后的信息。','tr7-small')+
image(440,140,110,110,'llm.png')+image(1260,137,110,125,'doc.png')+
svg(arrow(595,160,1210,160)+arrow(1210,265,595,265)+line(355))+
at(630,104,550,'请求：查询天气 / 检索新闻','tr7-label center')+at(630,282,550,'返回：天气数据 / 新闻内容','tr7-label center')+
at(0,404,320,'对外界产生影响','tr7-h')+at(0,463,345,'订票、编辑、点击','tr7-label')+at(0,525,350,'工具执行动作，<br>外部系统的状态随之改变。','tr7-small')+
image(440,430,110,110,'llm.png')+image(1255,424,130,140,'html-figures-r6/computer.png')+
svg(arrow(595,450,1210,450)+arrow(1210,555,595,555))+
at(630,394,550,'请求：提交预订 / 点击控件','tr7-label center')+at(630,572,550,'返回：预订结果 / 新的界面','tr7-label center')+
at(0,662,1500,'读取信息与执行操作，都通过工具连接模型与外部系统。','tr7-bottom')));
add(2054,()=>page(
at(0,0,1500,'用户：“纽约现在天气怎么样？”','tr7-lead')+
at(0,86,1500,'模型生成请求 → 程序执行工具 → 结果进入输入 → 模型继续回答','tr7-label')+
svg(paper(0,185,300,265)+paper(1175,185,325,265)+arrow(320,310,430,310)+arrow(650,310,765,310)+arrow(1010,310,1150,310))+
at(24,212,250,'模型生成调用','tr7-h')+at(24,300,250,'get_weather<br>New York','tr7-mono')+
image(466,200,150,155,'app.png')+at(420,388,255,'应用执行工具','tr7-h center')+
image(810,200,160,155,'tool.png')+at(770,388,265,'天气结果返回','tr7-h center')+at(770,451,265,'72°F · 局部多云','tr7-small center')+
at(1200,212,275,'模型生成回答','tr7-h')+at(1200,300,275,'纽约气温72°F，<br>局部多云。','tr7-black')+
svg(path('M897 500 V558 H1335 V475'))+at(940,574,500,'应用把调用与结果追加到输入','tr7-small')+
at(0,660,1500,'接下来拆开两个关键点：调用的格式，以及全过程的chat template。','tr7-bottom')));
add(2055,()=>page(
at(0,0,1500,'本例的Qwen2.5模板约定：用<tool_call>包裹工具名称和参数。'.replace('<tool_call>','&lt;tool_call&gt;'),'tr7-lead')+
at(0,105,470,'工具说明','tr7-h')+
at(0,187,480,'• 名称：<b>get_weather</b><br>• 用途：查询地点天气<br>• 参数：<b>location</b>（地点）','tr7-list')+
at(0,405,470,'用户问题','tr7-h')+at(0,469,470,'“纽约现在天气怎么样？”','tr7-black')+
at(600,105,880,'模型生成的调用文本','tr7-h')+
pre(600,172,898,312,D.call)+svg(arrow(490,287,574,287))+
at(600,520,880,'• name：选哪个工具<br>• arguments：把什么信息交给工具','tr7-list')+
at(0,660,1500,'工具名与参数要符合工具说明；应用再按约定格式解析、分发调用。','tr7-bottom')));
add(2056,()=>page(
at(0,0,1500,'模型给出调用文本；实际读取由应用程序执行。','tr7-lead')+
at(0,104,480,'① 应用解析并调用','tr7-h')+at(0,176,510,'get_weather<br>(location="New York")','tr7-mono')+
svg(arrow(495,235,675,235)+paper(720,105,750,250))+
at(745,130,700,'② 工具读取天气记录','tr7-h')+at(745,197,700,'weather_fixture.json','tr7-mono')+at(745,264,700,'New York → 72°F / Partly cloudy','tr7-mono')+
svg(path('M1095 375 V418 H1095 V443'))+
at(0,432,540,'③ 应用追加调用与结果','tr7-h')+at(0,508,535,'原来的问题和工具说明保留，<br>新的天气结果进入下一次输入。','tr7-black')+
pre(720,455,750,170,D.result)+svg(arrow(690,539,565,539))+
at(0,670,1500,'接入天气服务时，工具从服务查询数据；这里的读取过程连接了模型与外部文件。','tr7-small')));
function trace(){return page(
at(0,0,1500,'左侧看消息与分工，右侧看它们怎样接成连续文本。','tr7-lead')+
`<section class="tr7-trace" data-tr7-trace data-selected="0"><div class="tr7-message-list"><h2>一次天气查询</h2>${D.parts.map((p,i)=>`<button data-tr7-part="${i}" aria-pressed="${i===0}" class="${i===0?'selected':''}"><b>${i+1}. ${esc(p.label)}</b><span>${esc(p.summary)}</span></button>${i===2?'<p class="tr7-exec">↓ 应用执行get_weather，结果返回 ↓</p>':''}`).join('')}</div><div class="tr7-template"><div class="tr7-modes" role="group" aria-label="模板查看范围"><button data-tr7-mode="fragment" aria-pressed="true">对应片段</button><button data-tr7-mode="first" aria-pressed="false">第一次完整输入</button><button data-tr7-mode="second" aria-pressed="false">第二次完整输入</button><button data-tr7-mode="complete" aria-pressed="false">完整对话</button></div><h2 data-tr7-heading>${esc(D.parts[0].label)} · Qwen2.5 chat template</h2><pre data-tr7-text data-scroll-region tabindex="0">${esc(D.parts[0].text)}</pre><p data-tr7-note>${esc(D.parts[0].note)}</p></div></section>`+
at(0,670,1500,'两轮输入都以assistant前缀结尾，模型从那里继续预测下一个Token。','tr7-bottom'));}
add(2057,trace);
add(2058,()=>page(
at(0,0,1500,'工具调用没有改变文本生成机制，它在两次生成之间接入外部执行。','tr7-lead')+
at(0,110,450,'第一次：生成调用','tr7-h center')+at(525,110,450,'中间：工具执行','tr7-h center')+at(1054,110,450,'第二次：生成回答','tr7-h center')+
image(132,192,170,175,'llm.png')+image(665,192,170,175,'tool.png')+image(1193,192,170,175,'llm.png')+
svg(arrow(350,270,615,270)+arrow(880,270,1150,270))+
at(0,414,450,'问题＋工具说明<br>↓<br>工具名＋地点','tr7-black center')+
at(525,414,450,'解析调用 → 执行读取<br>↓<br>天气结果','tr7-black center')+
at(1054,414,450,'原输入＋调用＋结果<br>↓<br>中文回答','tr7-black center')+
svg(line(617))+at(0,648,1500,'模型生成文本；工具执行动作；应用把两者连接起来。','tr7-bottom')));
add(2066,()=>page(
at(0,0,1500,'截图、点击、输入、滚动，都是包装好的工具能力。','tr7-lead')+
image(80,193,180,180,'llm.png')+at(25,407,290,'模型判断下一步','tr7-h center')+
image(1180,184,240,244,'html-figures-r6/computer.png')+at(1100,459,390,'软件 / 操作系统','tr7-h center')+
svg(arrow(1125,140,330,140)+arrow(330,315,1125,315)+path('M1290 530 V588 H175 V485'))+
at(400,76,650,'① 读取界面：截图 / 界面信息','tr7-label center')+
at(380,213,710,'② 调用动作：点击 / 输入 / 滚动','tr7-h center')+at(425,345,620,'应用把调用交给系统接口执行','tr7-small center')+
at(455,526,600,'③ 再次读取：新的界面返回模型','tr7-label center')+
at(0,657,1500,'一项电脑任务会重复这个往返；每次操作都建立在当前观察上。','tr7-bottom')));
add(2071,()=>page(
at(0,0,1500,'复杂任务需要连续调用不同工具，每次结果都能成为下一步的依据。','tr7-lead')+
at(0,128,330,'资料研究','tr7-h')+at(0,184,330,'获取信息并形成文件','tr7-small')+
at(420,129,280,'检索新闻','tr7-label center')+at(825,129,280,'读取网页','tr7-label center')+at(1225,129,275,'写入报告','tr7-label center')+
svg(arrow(720,158,800,158)+arrow(1125,158,1200,158)+line(259))+
at(0,320,330,'任务记忆 Memory','tr7-h')+at(0,376,340,'保存以后还要用的信息','tr7-small')+
at(420,321,280,'写入记录','tr7-label center')+at(825,321,280,'读取 / 检索','tr7-label center')+at(1225,321,275,'放回模型输入','tr7-label center')+
svg(arrow(720,350,800,350)+arrow(1125,350,1200,350)+line(451))+
at(0,512,330,'软件操作','tr7-h')+at(0,568,330,'观察与动作不断往返','tr7-small')+
at(420,513,280,'读取界面','tr7-label center')+at(825,513,280,'点击 / 输入','tr7-label center')+at(1225,513,275,'读取新状态','tr7-label center')+
svg(arrow(720,542,800,542)+arrow(1125,542,1200,542))+
at(0,660,1500,'Memory也要依靠文件读取、写入或检索，把信息送出模型、再带回来。','tr7-bottom')));
add(2072,()=>page(
at(0,0,1500,'工具把“生成回答”与“执行操作”连接起来，结果再回到模型。','tr7-lead')+
image(75,136,155,160,'llm.png')+at(0,325,315,'生成内容与调用','tr7-h center')+
image(670,136,155,160,'tool.png')+at(565,325,365,'应用执行工具','tr7-h center')+
image(1260,136,155,160,'html-figures-r6/computer.png')+at(1140,325,360,'外部数据与系统','tr7-h center')+
svg(arrow(272,219,625,219)+arrow(870,219,1225,219)+path('M1335 393 V456 H153 V392'))+
at(430,402,640,'结果成为新的输入，继续判断与行动','tr7-label center')+
svg(line(511))+
at(0,532,1500,'• 获取信息：把外部材料带进来。<br>• 产生影响：让工具实际执行操作。<br>• 继续工作：根据返回结果生成下一步。','tr7-list tr7-compact')+
at(0,681,1500,'下一节 Memory：通过写入、读取与检索，让信息跨任务保留与复用。','tr7-small')));
if(typeof document!=='undefined')document.addEventListener('click',event=>{
 const control=event.target.closest('[data-tr7-part],[data-tr7-mode],[data-tr7-reset]');if(!control)return;
 const root=control.closest('[data-tr7-trace]');if(!root)return;
 let selected=Number(root.dataset.selected),mode='fragment';
 if(control.hasAttribute('data-tr7-part'))selected=Number(control.dataset.tr7Part);
 if(control.hasAttribute('data-tr7-reset'))selected=2;
 if(control.hasAttribute('data-tr7-mode'))mode=control.dataset.tr7Mode;
 root.dataset.selected=selected;
 root.querySelectorAll('[data-tr7-part]').forEach(b=>{const yes=mode==='fragment'&&Number(b.dataset.tr7Part)===selected;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});
 root.querySelectorAll('[data-tr7-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tr7Mode===mode)));
 const names={first:'第一次完整输入 → 接下来生成调用',second:'第二次完整输入 → 接下来生成回答',complete:'完整对话文本：输入、调用、返回与回答'};
 const notes={first:'输入包含回答要求、工具说明、用户问题，末尾是assistant前缀。',second:'原来的输入保留，新增assistant调用与工具返回，最后再加assistant前缀。',complete:'两个assistant段由模型生成；中间的工具结果由应用取得并追加。'};
 root.querySelector('[data-tr7-heading]').textContent=mode==='fragment'?D.parts[selected].label+' · Qwen2.5 chat template':names[mode];
 const p=root.querySelector('[data-tr7-text]');p.textContent=mode==='fragment'?D.parts[selected].text:D[mode];p.scrollTop=0;
 root.querySelector('[data-tr7-note]').textContent=mode==='fragment'?D.parts[selected].note:notes[mode];
});
})();

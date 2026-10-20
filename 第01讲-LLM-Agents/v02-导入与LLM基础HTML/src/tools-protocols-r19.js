(function(){'use strict';
const R=window.MBA_RENDERERS;
const at=(x,y,w,t,c='')=>`<div class="p19-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const img=(x,y,w,h,file,alt)=>`<img class="p19-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/${file}" alt="${alt}">`;
const lead=t=>at(0,0,1504,t,'p19-lead'),end=t=>at(0,656,1504,t,'p19-end');
const page=h=>`<div class="p19">${h}</div>`,add=(id,fn)=>R[id]={steps:1,render:()=>page(fn())};
const icon=n=>`assets/protocols-r10/${n}.png`;
const item=(n,title,text)=>`<div class="p19-outline"><span class="n">${n}</span><div><h2>${title}</h2><p>${text}</p></div></div>`;
const browser=(name,title,content,im)=>`<div class="p19-browser"><header><i></i><i></i><i></i><span>${name}</span></header><main><img src="${icon(im)}" alt=""><div>${title}<small>${content}</small></div></main></div>`;
const arrow='<span class="arrow" aria-hidden="true">⇄</span>';

add(19001,()=>lead('同样的工具调用，也可以连接摄像头和机械臂。')+
window.MBA_OPENING_VIDEO('astra-arm','机械臂工具调用视频',29.354667,0,88,940,529)+
at(1000,87,504,
`<div class="p19-arm-step"><b>1</b><div><h2>读取画面</h2><p>调用相机程序，取得工作台图像，判断红笔的位置。</p></div></div>
<div class="p19-arm-step"><b>2</b><div><h2>运行运动脚本</h2><p>Astra编写、调整脚本；程序通过控制接口驱动机械臂。</p></div></div>
<div class="p19-arm-step"><b>3</b><div><h2>再看执行结果</h2><p>读取新的画面，检查是否抓住，再决定下一步。</p></div></div>`)+
at(0,620,940,'GPT-6 Astra · SO101　｜　原视频50倍速，任务耗时22分钟。','p19-small')+
at(1000,562,500,'<a class="p19-source" href="https://people.csail.mit.edu/frankzydou/blog/so101-pen-pickup/index.html" target="_blank" rel="noopener">Zhiyang Dou · 2026.09.13 ↗</a>')+
end('感知接口提供外界信息，控制接口执行动作；工具把两者接入模型的工作过程。'));

add(8001,()=>lead('接上一个工具之后，还会遇到另一个问题：<span class="p19-red">不同系统怎样配合？</span>')+
img(0,132,875,375,'protocols-r10/two-interactions.png','MCP连接工具与数据服务；A2A连接另一个智能体')+
at(0,550,870,'请求发出去，结果还要按约定返回。','p19-small')+
at(955,100,549,item('1','为什么需要协议','各自开发的系统，要遵守共同的交互规则。')+
item('2','MCP：连接工具与数据','把能力说明、调用和返回统一起来。')+
item('3','A2A：委托另一个智能体','交代任务，补充信息，取得成果。'))+
end('Skills说明任务怎样做；Protocols约定系统之间怎样交互。'));

add(8002,()=>lead('不同浏览器能打开同一个网站，因为双方遵守共同的规则。')+
at(15,111,410,browser('浏览器 A','纽约天气','72°F · 局部多云','weather'))+
at(15,385,410,browser('浏览器 B','纽约天气','72°F · 局部多云','weather'))+
`<svg class="p19-at" style="left:0;top:0;width:1504px;height:640px" viewBox="0 0 1504 640" aria-hidden="true"><defs><marker id="p19-web-arrow" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" viewBox="0 0 8 8" refX="6" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8" fill="#0070c0"/></marker></defs><path d="M437 224 H460 V334 H483" fill="none" stroke="#0070c0" stroke-width="3" marker-start="url(#p19-web-arrow)" marker-end="url(#p19-web-arrow)"/><path d="M437 499 H470 V365 H483" fill="none" stroke="#0070c0" stroke-width="3" marker-start="url(#p19-web-arrow)" marker-end="url(#p19-web-arrow)"/><path d="M976 350 H1010" fill="none" stroke="#0070c0" stroke-width="3" marker-start="url(#p19-web-arrow)" marker-end="url(#p19-web-arrow)"/></svg>`+
at(495,282,470,'共同的Web标准与协议<small>怎样请求页面，怎样返回内容</small>','p19-web-bridge')+
img(1022,145,360,310,'protocols-r10/weather.png','可由不同浏览器访问的天气网站')+
at(1000,490,425,'同一个网站','p19-web-label')+
end('智能体也需要共同约定：更换应用时，尽量复用已经接好的工具与服务。'));

add(8004,()=>lead('MCP（Model Context Protocol）：让AI应用按统一方式接入外部工具和数据。')+
at(0,105,380,browser('AI 应用 A','智能体应用','使用已连接的工具','agent'))+
at(0,385,380,browser('AI 应用 B','另一个兼容应用','复用同一套工具接入','host'))+
at(425,266,85,'⇄','p19-web-label')+
at(525,194,440,'<h2>MCP</h2><p>有什么工具？<br>调用时要提供什么？<br>执行后返回什么？</p>','p19-compat')+
at(983,266,85,'⇄','p19-web-label')+
at(1090,95,414,
`<div class="p19-service"><img src="${icon('weather')}" alt="天气"><div><strong>天气服务</strong><small>按地点查询天气</small></div></div>
<div class="p19-service"><img src="${icon('directory')}" alt="文件"><div><strong>文件服务</strong><small>查找、读取文件</small></div></div>
<div class="p19-service"><img src="${icon('result')}" alt="业务数据"><div><strong>业务系统</strong><small>查询数据、执行操作</small></div></div>`)+
end('工具仍然负责具体操作；MCP把工具的接入方式标准化，减少重复对接。'));

add(8008,()=>lead('还是查询纽约天气：调用的内容不复杂，区别在于按共同约定发送和返回。')+
at(0,90,790,'<h2>MCP请求中的主要内容</h2>')+
at(0,154,790,`<pre class="p19-code" tabindex="0" aria-label="MCP天气调用请求的主要内容">{
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    }
  }
}</pre>`)+
at(0,546,790,'调用天气工具，地点是 New York。','p19-small')+
at(875,113,629,`<div class="p19-weather"><img src="${icon('weather')}" alt="天气工具"><div><h2>天气工具执行</h2><p>查询指定地点</p></div></div>
<p style="margin-top:28px"><b>返回天气信息</b><br>72°F · 局部多云</p>
<p class="p19-rule" style="margin-top:26px"><b>模型收到结果后回答</b><br>纽约气温72°F，局部多云。</p>`)+
end('模型生成调用意图，应用通过MCP联系工具服务，再把返回结果交给模型。'));

add(8009,()=>lead('工具服务完成一次MCP接入后，可以供多个兼容应用使用。')+
at(0,119,1504,`<div class="p19-steps">
<section><img src="${icon('directory')}" alt="工具及说明"><h2>服务提供能力</h2><p>名称、用途、输入要求，<br>按共同格式说明清楚。</p></section><span class="arrow">→</span>
<section><img src="${icon('host')}" alt="兼容MCP的应用"><h2>应用接入服务</h2><p>按同一套约定，<br>取得工具说明、发送调用。</p></section><span class="arrow">→</span>
<section><img src="${icon('result')}" alt="工具执行返回结果"><h2>执行并返回结果</h2><p>查询、读取或执行操作，<br>结果返回模型继续处理。</p></section></div>`)+
at(0,555,1504,'能调用哪些操作、能看到哪些数据，仍由服务能力和账户权限决定。','p19-caption')+
end('MCP解决工具怎样接入；把一项任务委托给另一个智能体，再看A2A。'));

add(8010,()=>lead('A2A（Agent-to-Agent）：让独立的智能体服务按共同约定接受和交付任务。')+
img(90,111,1325,320,'protocols-r10/participants.png','用户向本方助理提出任务；本方助理和汇率智能体双向交互')+
at(0,475,450,'<h2>本方助理</h2><p>交代目标与已有信息，<br>接收对方的进度与成果。</p>')+
at(520,475,440,'<h2>共同约定</h2><p>怎样委托、补充信息，<br>怎样报告进度、交付结果。</p>')+
at(1035,475,469,'<h2>对方智能体</h2><p>组织自己的处理过程；<br>需要时调用自己的工具。</p>')+
end('调用工具时指定操作；委托智能体时交代任务，由对方组织处理。'));

add(8012,()=>lead('A2A官方汇率案例：信息不够时先追问，补齐以后继续同一项任务。')+
at(0,92,790,`<div class="p19-chat user"><small>提出任务</small>1美元能兑换多少？</div>
<div class="p19-chat agent"><small>汇率智能体追问</small>要兑换成哪一种货币？</div>
<div class="p19-chat user"><small>补充信息</small>加元（CAD）。</div>
<div class="p19-chat agent"><small>查询后交付换算结果</small><span class="amount">1 USD → 1.3739 CAD</span></div>`)+
img(1000,102,250,210,'protocols-r10/agent.png','处理汇率任务的智能体')+
at(900,335,604,'<h2>委托以后，还能继续沟通</h2><ul><li>缺少条件，返回问题。</li><li>处理中，报告进度。</li><li>完成后，交付结果。</li></ul>')+
end('A2A把这些往来组织成可继续、可跟踪的任务；汇率查询由对方的工具完成。'));

add(8015,()=>lead('同一个智能体，可以调用工具，也可以把任务委托给另一个智能体。')+
at(0,102,1504,`<div class="p19-combine">
<svg viewBox="0 0 1504 410" aria-hidden="true"><defs><marker id="p19-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8" fill="#0070c0"/></marker></defs>
<path d="M265 165 C530 165 550 82 1135 82" fill="none" stroke="#0070c0" stroke-width="4" marker-start="url(#p19-arrow)" marker-end="url(#p19-arrow)"/>
<path d="M265 245 C530 245 550 335 1135 335" fill="none" stroke="#0070c0" stroke-width="4" marker-start="url(#p19-arrow)" marker-end="url(#p19-arrow)"/>
</svg>
<div class="entity" style="left:0;top:108px;width:260px"><img src="${icon('agent')}" alt="当前智能体">当前智能体</div>
<div class="entity" style="left:1160px;top:0;width:340px"><img src="${icon('weather')}" alt="天气工具">天气工具</div>
<div class="entity" style="left:1160px;top:254px;width:340px"><img src="${icon('agent')}" alt="另一个智能体">汇率智能体</div>
<div class="edge" style="left:730px;top:4px;width:360px"><b>MCP</b>调用：查询纽约天气</div>
<div class="edge" style="left:730px;top:258px;width:360px"><b>A2A</b>委托：完成汇率换算</div>
</div>`)+
at(0,559,1504,'对方智能体也可能通过MCP使用工具。两种协议可以出现在同一项任务中。','p19-caption')+
end('看本次连接在做什么：接入工具，还是向另一个智能体委托任务。'));

add(8016,()=>lead('协议使各自开发的系统，能够按共同规则合作。')+
at(0,113,1504,`<div class="p19-summary"><section><h2><span class="p19-red">MCP</span> · 工具与数据</h2><div class="p19-route"><img src="${icon('agent')}" alt="智能体应用">${arrow}<img src="${icon('weather')}" alt="外部工具"></div><p>统一能力说明、调用与返回。<br>同一工具服务可供多个兼容应用接入。</p></section>
<section><h2><span class="p19-red">A2A</span> · 智能体之间的任务</h2><div class="p19-route"><img src="${icon('agent')}" alt="本方智能体">${arrow}<img src="${icon('agent')}" alt="对方智能体"></div><p>统一任务委托、补充信息与成果交付。<br>对方组织自己的执行过程。</p></section></div>`)+
at(0,507,1504,'<h2>这些连接由谁来组织？</h2><p>哪些工具可用、何时调用、结果怎样进入下一轮输入——由Harness安排。</p>','p19-rule')+
end('工具、Memory、Skills与Protocols，共同组成智能体的运行环境。'));
})();

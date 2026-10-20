(function(){'use strict';
const R=window.MBA_RENDERERS,D=window.PROTOCOLS_R10;
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const a=(x,y,w,t,c='pr10-text')=>`<div class="pr10-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const im=(x,y,w,h,n,alt)=>`<img class="pr10-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/protocols-r10/${n}.png" alt="${e(alt||n)}">`;
const lead=t=>a(0,0,1504,t,'pr10-lead'),bottom=t=>a(0,656,1504,t,'pr10-bottom');
const ul=(x,y,w,items)=>a(x,y,w,'<ul>'+items.map(t=>'<li>'+t+'</li>').join('')+'</ul>');
const page=h=>'<div class="pr10">'+h+'</div>',add=(id,h)=>R[8000+id]={steps:1,render:()=>page(typeof h==='function'?h():h)};
const switchline=(end,next)=>a(0,0,1500,`<span>已结束：${end}</span>　→　<strong>接下来：${next}</strong>`,'pr10-transition');
add(1,lead('Skills保存“怎样做”；Protocols把<span class="pr10-red">怎样与外部系统交互</span>写成共同约定。')+
 im(0,145,850,390,'two-interactions','当前智能体分别连接工具数据服务和另一个智能体')+
 a(920,120,550,'① 交互对象与范围','pr10-h2')+a(920,178,550,'连接谁？双方要约定什么？')+
 a(920,285,550,'② MCP：工具与数据','pr10-h2')+a(920,343,550,'目录 → 调用 → 返回结果')+
 a(920,450,550,'③ A2A：Agent任务协作','pr10-h2')+a(920,508,550,'能力 → 任务 → 状态与成果')+
 bottom('先区分交互，再看两种协议如何把各自的请求与返回接起来。'));
add(2,lead('看懂一种协议，先问<span class="pr10-red">“连接谁”</span>，再问“为哪些场景设计”。')+
 im(0,110,1504,300,'classification-axes','协议的交互对象与适用场景两个维度')+
 ul(30,450,1430,['连接工具与数据：约定能力说明、调用格式与返回内容。','连接另一个Agent：约定如何委托、补充信息、报告状态与交付成果。'])+
 bottom('交互对象与适用范围可以组合；本章重点看MCP和A2A。'));
add(3,lead('同一个智能体，既可以调用外部工具，也可以把任务交给另一个Agent。')+
 im(150,110,1200,465,'two-interactions','MCP连接工具或数据服务；A2A连接执行任务的Agent')+
 bottom('判断协议的作用，要看这次交互需要约定什么；服务内部可以有复杂的处理过程。'));
add(4,switchline('交互对象与范围','MCP：连接工具与数据')+
 a(0,95,1504,'MCP · Model Context Protocol（模型上下文协议）','pr10-h2')+
 im(30,205,1440,330,'mcp-roles','模型、应用及MCP天气服务的通信位置')+
 a(20,570,1460,'先看角色分工　→　取得工具目录　→　发送调用、返回结果','pr10-chain')+
 bottom('MCP约定应用与外部服务的通信；应用把它接到模型的生成过程。'));
add(5,lead('模型提出调用；应用联系服务；服务执行后，把结果交回应用。')+
 im(0,115,1504,335,'mcp-roles','模型连接应用，应用通过MCP客户端连接天气服务')+
 a(20,490,400,'模型','pr10-h2')+a(20,548,400,'依据任务与工具说明，\n生成工具名称和参数。')+
 a(515,490,470,'应用 Host／客户端 Client','pr10-h2')+a(515,548,465,'组织模型输入；\n客户端负责MCP通信。')+
 a(1060,490,420,'服务端 Server','pr10-h2')+a(1060,548,420,'公开能力；处理请求；\n返回操作结果。')+
 bottom('一个应用可以连接多个服务；每段连接仍需遵守双方约定。'));
add(6,lead('连接建立后，应用先获取工具目录，才知道服务提供什么、调用时需要什么。')+
 im(20,170,240,175,'directory','工具目录文件')+
 a(0,385,280,'tools/list','pr10-h2 pr10-center')+a(0,440,280,'请求工具目录','pr10-center')+
 a(330,120,1150,'<table class="pr10-table"><thead><tr><th>目录中的说明</th><th>天气工具</th><th>模型据此判断</th></tr></thead><tbody><tr><td>名称</td><td class="pr10-mono">get_weather</td><td>要调用哪个工具</td></tr><tr><td>用途</td><td>查询指定地点的天气</td><td>是否适合当前任务</td></tr><tr><td>参数要求</td><td class="pr10-mono">location：文字，必填</td><td>调用时必须给出地点</td></tr></tbody></table>')+
 a(350,490,1110,'应用保留名称、用途与参数要求，\n整理成模型能够使用的工具说明。')+
 a(20,590,1460,'MCP还可提供资料（Resources）和提示模板（Prompts）；这里先看工具往返。','pr10-small')+
 bottom('“工具可以做什么”先进入模型输入，模型才能结合任务选择调用。'));
add(7,lead('天气查询仍然是生成与执行的交替；MCP补上应用和服务之间的通信。')+
 im(20,110,1460,525,'mcp-flow','工具目录到模型说明、模型调用到MCP调用、服务返回到工具消息的六个环节')+
 bottom('模型输出调用 → 应用转交 → 服务执行 → 返回内容加入下一次模型输入。'));
const msgLabels=['① 索取工具目录','② 返回工具说明','③ 发起天气查询','④ 返回天气内容'];
const msgDirections=['应用 → 天气服务','天气服务 → 应用','应用 → 天气服务','天气服务 → 应用'];
const msgText=[
 '操作：tools/list\n\n请求：列出这个服务可用的工具。\n\n请求编号：101。',
 '工具：get_weather\n\n用途：查询指定地点的天气。\n参数：location，文字，必须提供。\n\n返回编号：101，与目录请求对应。',
 '操作：tools/call\n\n工具：get_weather\n参数：location = New York\n\n请求编号：102。',
 '天气内容：\nNew York\nTemperature: 72°F\nConditions: Partly cloudy\n\n返回编号：102，与天气查询对应。'];
const msgNote=['这次取得的是目录；还没有要求服务查询某个地点。','应用将工具说明整理给模型，供后续生成调用。','模型给出工具名和参数后，应用把它们写入MCP请求。','应用收到结果后，放回后续模型输入，模型据此回答。'];
function msgWidget(){return `<section class="pr10-mcp-widget" data-pr10-widget data-choice="0" data-view="key"><div class="pr10-selector">${im(0,0,475,130,'mcp-roles','MCP消息往返位于应用和服务之间')}<div class="pr10-buttons">${msgLabels.map((t,i)=>`<button data-pr10-choice="${i}" aria-pressed="${i===0}">${t}</button>`).join('')}</div></div><div class="pr10-reader"><div class="pr10-modes"><button data-pr10-view="key" aria-pressed="true">主要内容</button><button data-pr10-view="raw" aria-pressed="false">完整协议消息</button></div><h2 data-pr10-direction>${msgDirections[0]}</h2><pre data-scroll-region tabindex="0" data-pr10-text>${e(msgText[0])}</pre><p data-pr10-note>${msgNote[0]}</p></div></section>`;}
add(8,()=>lead('同一次纽约天气查询，对照目录、调用和返回；原始消息可按需展开。')+msgWidget()+bottom('请求与返回按编号配对；协议消息由应用和服务处理。'));
add(9,lead('MCP统一<span class="pr10-red">工具发现、调用与返回</span>；应用负责把它们接到模型输入。')+
 im(35,95,1430,320,'mcp-roles','回到模型、应用和服务三方关系')+
 a(20,430,420,'模型依据输入生成','pr10-h2')+a(20,485,420,'任务与工具说明\n调用请求\n取得结果后的回答')+
 a(525,430,440,'应用组织往返','pr10-h2')+a(525,485,440,'整理工具说明\n转交请求、对应返回\n把结果加入下一次输入')+
 a(1060,430,420,'服务处理请求','pr10-h2')+a(1060,485,420,'提供工具目录\n执行工具操作\n返回内容或错误')+
 bottom('接下来：当对方承担的是一项任务，怎样委托、追问和交付？'));
add(10,switchline('MCP：工具与数据','A2A：任务协作')+
 a(0,90,1500,'A2A · Agent2Agent：不同Agent服务之间的任务交互。','pr10-lead')+
 im(0,185,1504,155,'a2a-flow','了解能力、发送任务、追问补充、返回成果四个环节')+
 im(420,375,1060,260,'participants','用户、本方助理A与汇率Agent B')+
 a(0,410,390,'沿汇率任务看：','pr10-h2')+a(0,470,390,'谁接手？\n信息不够怎么办？\n完成后交回什么？')+
 bottom('先了解能力，再委托任务；过程可以包含补充信息和状态变化。'));
add(11,lead('Agent Card是对方公开的<span class="pr10-red">能力与接口说明</span>，帮助应用判断怎样联系和使用。')+
 im(40,130,200,200,'card','Agent Card能力说明')+
 a(300,115,1160,'<table class="pr10-table"><thead><tr><th>要了解什么</th><th>在汇率任务中</th></tr></thead><tbody><tr><td>名称与能力</td><td>汇率Agent：处理货币换算问题</td></tr><tr><td>输入与输出</td><td>提供金额、原币种与目标币种；取得换算结果</td></tr><tr><td>接口与访问要求</td><td>请求发往哪里；采用什么协议；如何认证</td></tr></tbody></table>')+
 a(30,495,1440,'Card中的 <span class="pr10-red">skills</span> 描述这个Agent提供的能力。','pr10-h2')+
 a(30,555,1440,'前一章的Skill包保存工作方法；Agent Card用于介绍一个服务。')+
 bottom('能力说明帮助找到合适的服务；实际请求仍由应用按接口和权限发送。'));
add(12,lead('沿用同一任务：先委托，缺少目标币种时补充，再继续原任务。')+
 a(0,110,725,'<ol class="pr10-conversation"><li><b>用户 → 本方助理 → 汇率Agent</b><p>1美元能换多少？</p></li><li><b>汇率Agent → 本方助理 → 用户</b><p>要换成哪种货币？</p></li><li><b>用户 → 本方助理 → 汇率Agent</b><p>CAD（加拿大元）。</p></li><li><b>汇率Agent → 本方助理</b><p>继续处理，返回换算成果。</p></li></ol>')+
 im(770,140,735,250,'participants','用户、助理和汇率Agent之间的委托关系')+
 a(800,425,675,'补充信息要接回原任务','pr10-h2')+a(800,490,655,'任务标识与上下文标识，\n帮助应用把“CAD”接回\n“1美元能换多少”的请求。')+
 bottom('追问是任务的一部分；补充后继续处理，双方都需要保留可续接的状态。'));
add(13,lead('双方各自组织模型输入；A2A把<span class="pr10-red">任务、补充与结果</span>在应用之间传递。')+
 im(0,100,1504,345,'a2a-messages','双方各自维护messages，经A2A交换信息')+
 a(185,233,420,'本方助理的处理规则','pr10-cell')+a(185,305,420,'1美元能换多少？','pr10-cell')+a(185,378,420,'委托、收到追问、向用户询问','pr10-cell pr10-cell-small')+
 a(1110,233,380,'汇率Agent的处理规则','pr10-cell')+a(1110,305,380,'收到货币换算任务','pr10-cell')+a(1110,378,380,'追问：要换成哪种货币？','pr10-cell pr10-cell-small')+
 a(30,485,690,'本方追加用户的“CAD”，再发给对方。')+a(830,485,650,'接收方取回已有消息，追加“CAD”。')+
 a(30,572,1440,'各自的历史＋这次收到的信息，构成各自后续生成的输入。','pr10-chain')+
 bottom('应用决定发哪些内容；发送任务文字，不会自动传走本方的全部历史与规则。'));
add(14,lead('状态说明“处理到哪里”；成果保存“实际产出了什么”。')+
 a(0,105,690,'任务状态 · Status','pr10-h2')+a(835,105,640,'任务成果 · Artifact','pr10-h2')+
 im(30,195,200,190,'agent','负责处理任务的Agent')+
 a(275,190,410,'处理中\n等待补充信息\n已完成','pr10-state-list')+
 im(860,195,180,180,'result','交付成果文件')+
 a(1085,190,400,'文字结果\n文件\n结构化数据','pr10-state-list')+
 a(20,440,685,'汇率问题缺少目标币种时，\n返回“等待补充”及具体问题。')+
 a(850,440,620,'换算完成后，\n把金额、币种等结果放入成果。')+
 a(20,575,1450,'本方应用取得成果 → 对照原任务检查 → 放入后续输入、组织回复','pr10-chain')+
 bottom('收到“已完成”还要取得成果；状态与成果不能相互替代。'));
add(15,lead('A2A连接Agent服务；接收方还可以通过MCP访问工具或资料。')+
 im(0,150,1504,290,'combination','A2A连接两个Agent应用；接收方经MCP客户端和服务端使用工具资料')+
 a(638,320,235,'Agent B应用<br>（自己的消息）','pr10-patch')+
 ul(30,500,1430,['A2A：说明能力，交换任务、状态与成果。','MCP：发现工具，发送调用，接收结果。'])+
 bottom('协议可以组合；各自应用仍负责组织输入、保存进度与检查结果。'));
add(16,lead('Protocols把外部交互变成有约定的交换，接上前面的工具、记忆与方法。')+
 im(0,135,790,345,'two-interactions','回看MCP工具交互与A2A任务交互')+
 a(870,105,610,'① 对象与范围','pr10-h2')+a(870,160,610,'先看连接谁，再看约定什么。')+
 a(870,270,610,'② MCP','pr10-h2')+a(870,325,610,'工具目录、调用与返回。')+
 a(870,430,610,'③ A2A','pr10-h2')+a(870,485,610,'能力、任务、状态与成果。')+
 a(30,585,1450,'接下来：Harness把模型、工具、Memory、Skills和Protocols组织成运行过程。','pr10-chain')+
 bottom('交互有了共同约定，还要安排谁执行、何时等待，以及怎样检查交付。'));
function update(w){let i=Number(w.dataset.choice),raw=w.dataset.view==='raw';w.querySelectorAll('[data-pr10-choice]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.pr10Choice)===i));w.querySelectorAll('[data-pr10-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pr10View===w.dataset.view));w.querySelector('[data-pr10-direction]').textContent=msgDirections[i];let p=w.querySelector('[data-pr10-text]');p.textContent=raw?JSON.stringify(D.mcp_messages[i],null,2):msgText[i];p.scrollTop=0;w.querySelector('[data-pr10-note]').textContent=msgNote[i];}
if(typeof document!=='undefined')document.addEventListener('click',ev=>{let b=ev.target.closest('[data-pr10-choice],[data-pr10-view],[data-pr10-reset]');if(!b)return;let w=b.closest('[data-pr10-widget]');if(!w)return;ev.stopPropagation();if(b.hasAttribute('data-pr10-reset')){w.dataset.choice='2';w.dataset.view='key';}else if(b.hasAttribute('data-pr10-choice')){w.dataset.choice=b.dataset.pr10Choice;w.dataset.view='key';}else w.dataset.view=b.dataset.pr10View;update(w);});
})();

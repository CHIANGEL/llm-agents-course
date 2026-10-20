(function(){
'use strict';
const R=window.MBA_RENDERERS,D=window.MEMORY_R8;
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const a=(x,y,w,t,c='mr8-text')=>`<div class="mr8-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const im=(x,y,w,h,n,alt='')=>`<img class="mr8-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/${n.includes('/')||n.endsWith('.png')?n:'memory-r8/'+n+'.png'}" alt="${e(alt)}">`;
const pre=(x,y,w,h,t)=>`<pre class="mr8-at mr8-pre" data-scroll-region tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${e(t)}</pre>`;
const lead=t=>a(0,0,1500,t,'mr8-lead'), bottom=t=>a(0,654,1500,t,'mr8-bottom');
const ul=(x,y,w,ls)=>a(x,y,w,'<ul class="mr8-list">'+ls.map(t=>'<li>'+t+'</li>').join('')+'</ul>');
const svg=s=>`<svg class="mr8-lines" viewBox="0 0 1504 718" aria-hidden="true"><defs><marker id="mr8-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="#0070c0" stroke-width="2"/></marker></defs>${s}</svg>`;
const arrow=(x,y,X,Y)=>`<path d="M${x} ${y} L${X} ${Y}" stroke="#0070c0" stroke-width="3" fill="none" marker-end="url(#mr8-arrow)"/>`;
const rule=y=>`<path d="M0 ${y} H1504" stroke="#c6d2de" stroke-width="1.5"/>`;
const page=h=>'<div class="mr8">'+h+'</div>';
const add=(n,fn)=>R[6000+n]={steps:1,render:fn};
const table=(x,y,w,heads,rows)=>a(x,y,w,'<table class="mr8-table"><thead><tr>'+heads.map(t=>'<th>'+t+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(t=>'<td>'+t+'</td>').join('')+'</tr>').join('')+'</tbody></table>');
add(1,()=>page(lead('Memory保存<span class="mr8-red">跨会话信息</span>，智能体通过工具读取，在新任务中使用。')+
im(80,110,1340,385,'cross-session','会话A保存记录，后续按任务读取到会话B')+
svg(rule(520))+
a(0,550,460,'① 保存与使用','mr8-h')+a(0,606,460,'存什么、怎么存、增删改查','mr8-small')+
a(520,550,460,'② 作用与代价','mr8-h')+a(520,606,460,'任务干扰、个性化与主动工作','mr8-small')+
a(1050,550,450,'③ Codex中的记忆','mr8-h')+a(1050,606,450,'文件、模型输入与工具读取','mr8-small')));
add(2,()=>page(lead('会话中的重要信息可以保存在文件或数据库里，供以后的任务读取。')+
im(35,140,1435,425,'cross-session')+
bottom('保存 → 按任务查找 → 取得内容 → 加入当前输入。模型依据这次输入继续生成。')));
add(3,()=>page(lead('记忆既可以记录“发生过什么”，也可以保存“知道什么”和“这个人有什么偏好”。')+
table(0,112,1500,['记忆内容','保存什么','后续怎样使用'],[
['<b>历史状态</b>','过去做过的事、任务进度、结果','继续未完成的任务'],
['<b>事实知识</b>','从资料与经历中获得的事实','为回答提供事实依据'],
['<b>个性化信息</b>','用户背景、习惯、长期偏好','根据用户偏好调整回答或安排']])+
im(95,465,120,125,'doc.png')+a(280,492,1030,'同一条记录还需要保留：对象、时间、来源、适用范围。','mr8-sub')+
bottom('保存任务条件时，要注明对应的项目和时间，避免在其他任务中误用。')));
add(4,()=>page(lead('同一条记忆，可以保存为文字条目，也可以表示为节点及其关系。')+
a(0,100,680,'条目式：一条记录保存一件事','mr8-h')+
a(0,186,640,'Kendra喜欢Adidas鞋。<br><br>对象：Kendra<br>关系：喜欢<br>对象：Adidas鞋','mr8-sheet mr8-text')+
a(780,100,720,'图谱式：节点与关系','mr8-h')+
im(760,190,740,350,'graph')+
a(0,568,1470,'原始对话、摘要和条目可以同时保留；关系图帮助沿着关联查找信息。','mr8-text')+
bottom('条目和图谱都可以结合关键词、语义相似度等方式检索。')));
add(5,()=>page(lead('记忆通过增、删、改、查维护；查到的内容加入模型输入后，才能用于当前任务。')+
im(0,150,1500,440,'crud-flow')+
bottom('写入时核对信息是否准确，读取时判断是否适用于当前任务。')));
function stacks(x,y,kind){let s='';for(let i=0;i<3;i++)s+=`<rect x="${x}" y="${y+i*13}" width="82" height="25" rx="3" fill="#eef3f7" stroke="#597b9d" stroke-width="2"/>`;s+=arrow(x+100,y+28,x+175,y+28);for(let i=0;i<(kind==='add'?4:kind==='delete'?2:3);i++)s+=`<rect x="${x+198}" y="${y+i*13}" width="82" height="25" rx="3" fill="${(kind==='add'&&i===3)||(kind==='update'&&i===1)?'#badfc8':'#eef3f7'}" stroke="#597b9d" stroke-width="2"/>`;return s;}
add(6,()=>page(lead('从新消息提取信息，与已有记录比较，再选择一个动作。')+
table(0,100,1130,['动作','什么时候用','对记录的影响'],[
['<b>新增</b>','有新的、值得保留的信息','增加一条记录'],['<b>修改</b>','对象相同，事实或条件变了','更新内容与适用时间'],['<b>删除</b>','记录错误、冲突，或被要求遗忘','按范围移除记录'],['<b>不变</b>','信息重复或无需长期保留','不增加新记录']])+
svg(stacks(1190,180,'add')+stacks(1190,275,'update')+stacks(1190,372,'delete')+stacks(1190,470,'noop'))+
bottom('模型可以提出维护建议；实际增删改仍由文件或数据库工具执行。')));
add(7,()=>page(lead('过去喜欢Adidas，后来转而喜欢Puma：需要区分历史关系与当前关系。')+
im(0,142,1500,425,'update-relations')+
bottom('给旧关系标记失效时间，同时加入新关系；以后查询“曾经”与“现在”，答案不同。')));
add(8,()=>page(lead('删除一条记忆，不会同时删除历史聊天、原文件和连接应用中的同一信息。')+
im(40,105,100,100,'doc.png')+a(175,128,610,'已保存的记忆：删除此条','mr8-h')+
im(40,270,100,100,'app.png')+a(175,293,610,'历史聊天与文件：可能仍保留','mr8-h')+
im(40,435,100,100,'tool.png')+a(175,458,610,'连接应用中的资料：可能仍保留','mr8-h')+
im(1240,257,135,135,'doc.png')+a(1150,414,345,'后续输入','mr8-h mr8-center')+
svg('<path d="M800 160 H1060 V292 H1205" stroke="#9b1c2d" stroke-width="3" stroke-dasharray="10 8" fill="none"/><path d="M878 143 L912 177 M912 143 L878 177" stroke="#9b1c2d" stroke-width="6"/>'+arrow(800,320,1205,320)+'<path d="M800 480 H1060 V350 H1205" stroke="#0070c0" stroke-width="3" fill="none" marker-end="url(#mr8-arrow)"/>')+
a(0,565,1500,'其他来源仍可能再次提供这条信息；检索索引与缓存也需要同步更新。','mr8-text')+
bottom('删除记忆文件，也不会自动删除已经加载到当前输入中的内容。')));
add(9,()=>page(lead('先限定用户、项目与权限，再找相关内容，最后核对时间和适用范围。')+
im(0,113,1500,455,'read-scope')+
a(0,587,1500,'检索结果还要核对来源、时间和适用范围，内容相似不等于适合当前任务。','mr8-text')+
bottom('查询的结果，要成为当前输入的一部分，才能影响这一次生成。')));
add(10,()=>page(lead('记忆即使没有错，用在不合适的任务上，也可能把答案带偏。')+
im(60,99,1380,480,'music-mismatch')+
bottom('用户这次需要午休放松，过去“保持清醒”的音乐偏好不适用；这条偏好仍可保留。')));
add(11,()=>page(lead('过去项目的预算和个人偏好，未必适合当前工作。')+
a(0,95,1470,'“在工作场景里，我通常会把ChatGPT和Codex的个性化记忆关掉。”','mr8-quote')+
a(0,245,660,'自动使用历史信息','mr8-h')+ul(0,310,660,['过去项目的预算、写作习惯','过时的角色与决策条件','与本次目标无关的个人偏好'])+
a(820,245,680,'指定本次任务的材料','mr8-h')+ul(820,310,680,['明确指定本项目材料','需要历史时，读取相关记录','核对对象、时间和用途'])+
svg(arrow(680,410,785,410))+
bottom('关闭个性化记忆后，仍然可以通过明确提供材料、读取文件来延续工作。')));
add(12,()=>page(lead('先判断是否需要历史，再检查候选记忆是否适合当前任务。')+
im(175,87,1180,485,'memory-decision')+
bottom('有用且适用的记忆才采用，无关记忆忽略，信息不足时询问用户。')));
add(13,()=>page(lead('记忆可以帮助智能体了解用户；定时或事件触发，则让它能够主动开始任务。')+
a(0,100,700,'个性化智能体 · Personal Agent','mr8-h')+a(0,166,700,'围绕同一用户，保留偏好、背景与任务进度。','mr8-text')+
a(800,100,700,'主动式智能体 · Proactive Agent','mr8-h')+a(800,166,700,'在时间或事件触发后，判断是否应继续工作。','mr8-text')+
im(0,310,1500,300,'proactive')+
bottom('长期记忆保存用户背景和任务进度；主动执行还需要触发条件与工具权限。')));
add(14,()=>page(lead('Meta Muse与OpenAI dot都利用用户记忆规划任务，并通过工具操作应用。')+
a(0,100,700,'Meta Muse','mr8-h')+ul(0,170,680,['记住用户关心的事，并制定长期计划。','在专用云端电脑中跨应用工作。','用户决定读取或操作哪些应用。'])+
a(800,100,700,'OpenAI dot','mr8-h')+ul(800,170,700,['从ChatGPT记忆取得背景，跨对话推进任务。','用云端电脑及连接应用完成工作。','后台主动研究使用只读工具；执行任务另受权限约束。'])+
svg(rule(468))+
im(90,500,100,100,'doc.png')+a(235,520,270,'长期背景','mr8-h')+svg(arrow(525,550,660,550))+
im(710,495,110,110,'app.png')+a(860,520,300,'持续任务','mr8-h')+
bottom('两个产品都要根据用户授权，决定可以读取哪些资料、操作哪些应用。')));
add(15,()=>page(lead('用户提供的信息越多、授予的权限越大，智能体能做的事越多，风险也越高。')+
a(0,110,445,'只提供本次需求','mr8-h')+a(0,183,445,'知道目标，给出建议。','mr8-text')+
a(530,110,445,'再提供长期背景','mr8-h')+a(530,183,445,'理解习惯、偏好和历史。','mr8-text')+
a(1060,110,440,'再开放操作权限','mr8-h')+a(1060,183,440,'能够进入应用并执行。','mr8-text')+
im(80,280,145,145,'doc.png')+im(630,280,145,145,'llm.png')+im(1170,280,145,145,'tool.png')+
svg(arrow(280,350,575,350)+arrow(835,350,1115,350))+
a(0,480,720,'收益：减少重复说明，代办更多任务。','mr8-sheet mr8-text')+
a(790,480,710,'风险：信息泄露、错误操作造成损失。','mr8-risk mr8-text')+
bottom('读取、起草、发送、支付，需要分别授权。')));
add(16,()=>page(lead('用户让智能体寻找、比较和购买服务，就不必逐个平台搜索和选择。')+
im(15,80,1470,445,'platform-figure1','三种入口关系：平台为入口、智能体成为入口、智能体直达服务')+
a(170,532,370,'① 用户 → 平台 → 服务','mr8-sub')+a(605,532,400,'② 用户 → Agent → 平台','mr8-sub')+a(1050,532,420,'③ 用户 → Agent → 服务','mr8-sub')+
a(0,602,1500,'用户减少直接访问平台，平台的广告曝光、推荐和交易收入都可能受到影响。','mr8-text')+
bottom('谁决定推荐顺序？谁获得交易与用户数据？这些利益需要重新分配。')));
add(17,()=>page(lead('记忆保存用户背景，工具执行任务；用户授权和平台规则共同限制智能体能做什么。')+
im(0,105,1500,300,'proactive')+
svg(rule(440))+
a(0,478,720,'对用户','mr8-h')+a(0,540,720,'代办更方便；<br>信息泄露和误操作风险也更高。','mr8-text')+
a(800,478,700,'对平台','mr8-h')+a(800,540,700,'智能体替用户选择服务，<br>平台可能失去直接流量。','mr8-text')+
bottom('长期记忆支持个性化服务；主动工作还需要触发、执行和权限管理。')));
add(18,()=>page(lead('采购案例：企业知识库从20人试点，转向300人正式部署。')+
pre(0,97,830,260,D.task)+a(930,103,560,'案例要说明的问题','mr8-h')+ul(930,175,560,['记忆已经保存在哪里？','本次输入加载了什么？','预算记录如何影响回答？'])+
a(0,410,650,'上次：20人试点','mr8-h')+a(0,474,650,'历史预算：10万元<br>适用期限与包含内容，要查记录。','mr8-text')+
a(850,410,650,'这次：300人部署','mr8-h')+a(850,474,650,'新任务：起草采购评审要点<br>先核对旧预算能否沿用。','mr8-text')+
svg(arrow(660,493,795,493))+
bottom('关键在于查清10万元对应的采购范围，再判断能否用于300人正式部署。')));
function reader(){const keys=['summary','budget','security'];return `<section class="mr8-widget" data-mr8-widget="files"><div class="mr8-widget-list"><h2>记忆文件</h2>${keys.map((k,i)=>`<button data-mr8-file="${k}" aria-pressed="${i===0}">${k==='summary'?'memory_summary.md':k==='budget'?'pilot-budget.md':'security-requirements.md'}<span>${k==='summary'?'摘要＋详细记录入口':k==='budget'?'rollout_summaries / 预算范围':'rollout_summaries / 安全要求'}</span></button>`).join('')}<div class="mr8-filetree">摘要给出要点与入口<br>↓<br>按任务读取相关详细记录</div></div><div class="mr8-panel"><h2 data-mr8-heading>${e(D.files.summary.path)}</h2><pre class="mr8-pre" data-scroll-region tabindex="0" data-mr8-content>${e(D.summary)}</pre><p data-mr8-caption>摘要保存用户偏好、项目背景和详细记录的文件路径。</p></div></section>`;}
add(19,()=>page(lead('磁盘中有一份摘要和两份详细记录，可以分别查看内容。')+reader()+bottom('客户端先加载摘要；详细文件由模型在需要时调用工具读取。')));
add(20,()=>page(lead('<span class="mr8-red">渐进式披露（Progressive disclosure）</span>：先给要点和入口，再按任务读取细节。')+
a(0,113,460,'第一层：摘要','mr8-h')+pre(0,178,450,245,'先结论、后依据。\n金额统一用人民币。\n项目已完成20人试点。\n\n预算范围 → pilot-budget.md')+
a(580,113,430,'第二层：相关记录','mr8-h')+pre(580,178,430,245,'20人、3个月试点。\n预算上限10万元。\n包含软件费与初始配置。\n\n不覆盖300人正式部署。')+
a(1140,113,355,'本次输入','mr8-h')+im(1215,195,160,165,'doc.png')+a(1140,380,355,'当前任务＋所需背景','mr8-sub mr8-center')+
svg(arrow(465,287,550,287)+arrow(1025,287,1110,287))+
a(0,495,1470,'• 摘要足够时，直接使用。<br>• 详细信息会改变判断时，再读取对应文件。','mr8-text')+
bottom('只读取任务需要的内容，避免把整个记忆库都加入输入。')));
function trace(view,selected){const ids=D.views[view];const name={first:'首次模型输入',call:'已经生成读取调用',read:'读取后的下一次输入',answer:'模型依据记忆给出回答',followup:'用户继续补充条件'}[view];return `<section class="mr8-widget ${ids.length>5?'mr8-short':''}" data-mr8-widget="trace" data-mr8-view="${view}" data-mr8-selected="${selected}"><div class="mr8-widget-list"><h2>${name}</h2>${ids.map(id=>`<button data-mr8-item="${id}" aria-pressed="${id===selected}">${e(D.items[id].label)}<span>${e(D.items[id].origin)}</span></button>`).join('')}</div><div class="mr8-panel"><div class="mr8-widget-toolbar"><button data-mr8-mode="selected" aria-pressed="true">关键内容</button><button data-mr8-mode="raw" aria-pressed="false">原始条目</button><button data-mr8-mode="all" aria-pressed="false">${view==='call'||view==='answer'?'当前条目列表':'本次完整输入'}</button></div><h2 data-mr8-heading>${e(selected==='memory'?'已加载的记忆摘要':D.items[selected].label)}</h2><pre class="mr8-pre" data-scroll-region tabindex="0" data-mr8-content>${e(selected==='memory'?D.summary:D.items[selected].text)}</pre><p data-mr8-caption>${view==='call'?'调用请求已经生成；工具返回以后，才能组装下一次模型输入。':view==='answer'?'左侧按过程顺序排列；回答由模型生成，下一轮才随历史进入输入。':'左侧按输入顺序排列；右侧可阅读对应文本。'}</p></div></section>`;}
add(21,()=>page(lead('用户提交任务后，客户端把记忆摘要、基础指令、项目说明和用户消息拼成输入。')+trace('first','base')+bottom('摘要由客户端加入；此时模型还没有发起读取详细记忆的工具调用。')));
add(22,()=>page(lead('用户偏好已写在摘要里；预算的具体范围，需要打开摘要所列的文件查询。')+
table(0,100,1500,['摘要里是什么','本次怎样处理','为什么'],[
['先结论、后依据；金额用人民币','直接用于采购评审的表达','内容已在输入中，适用范围清楚'],
['项目已完成20人试点','作为项目背景','解释为什么现在考虑扩大部署'],
['pilot-budget.md：预算范围','<b class="mr8-red">继续读取详细记录</b>','10万元能否沿用，会改变采购判断']])+
im(120,470,125,130,'doc.png')+svg(arrow(295,530,770,530))+im(840,470,125,130,'tool.png')+a(1030,480,450,'找到入口<br>读取预算范围','mr8-h')+
bottom('security-requirements.md仍在磁盘上；只为回答预算问题，不必把所有历史文件都读一遍。')));
add(23,()=>page(lead('模型依据摘要中的路径，生成一次读取预算文件的工具调用。')+trace('call','call')+bottom('模型生成调用文本，执行程序打开文件并返回正文。')));
add(24,()=>page(lead('工具返回预算记录；客户端把调用与结果追加进下一次输入。')+trace('read','result')+bottom('下一次输入包含原有消息、工具调用和文件正文，模型据此继续生成回答。')));
add(25,()=>page(lead('预算记录明确：10万元用于20人、3个月的试点。')+
a(0,95,640,'从记忆取得的依据','mr8-h')+pre(0,157,630,355,'20人、3个月的试点。\n\n10万元包含试点软件费与初始配置。\n\n没有覆盖300人正式部署，也没有核定正式部署的年度费用。')+
a(820,95,680,'本次采购评审的处理','mr8-h')+ul(820,163,680,['先重新确定正式部署的费用范围。','统一人数、期限与服务范围后比较。','把正式预算、上线时间列为待确认项。'])+
svg(arrow(660,330,785,330))+
a(0,555,1500,'试点预算没有覆盖300人正式部署，需要按新的采购范围重新估算。','mr8-sub')+
bottom('回答格式采用摘要里的用户偏好，预算判断依据详细记录。')));
add(31,()=>page(lead('模型根据当前任务、记忆摘要和预算记录，生成采购评审要点。')+trace('answer','answer')+bottom('回答列出正式预算、上线时间和验收要求，等待用户补充。')));
add(26,()=>page(lead('用户补充正式部署的预算和期限，新消息追加到下一次模型输入。')+trace('followup','followup')+bottom('本次按300人、一年、30万元调整；20人、3个月、10万元仍是先前试点的历史条件。')));
function updateWidget(){return `<section class="mr8-update" data-mr8-widget="update"><div class="mr8-widget-toolbar">${['最初加载','磁盘已更新','再次读取'].map((n,i)=>`<button data-mr8-update="${i}" aria-pressed="${i===0}">${i+1}. ${n}</button>`).join('')}</div><div class="mr8-update-grid"><div><h2>磁盘摘要：项目背景</h2><pre class="mr8-pre" data-scroll-region tabindex="0" data-mr8-disk>${e(D.projectSummary)}</pre></div><div><h2 data-mr8-input-heading>已加载摘要：项目背景</h2><pre class="mr8-pre" data-scroll-region tabindex="0" data-mr8-input>${e(D.projectSummary)}</pre></div></div><div class="mr8-update-status" data-mr8-status>客户端首次加载摘要，磁盘与输入中的摘要内容相同。</div></section>`;}
add(27,()=>page(lead('修改磁盘上的记忆文件，不会自动改写已经加载到模型输入中的文本。')+updateWidget()+bottom('用户的新消息可直接用于本次回答；写入记忆文件后，以后的会话才能再次读取。')));
add(28,()=>page(lead('摘要和工具返回构成了采购判断的依据；用户的新消息补充了正式部署条件。')+
table(0,100,1500,['位置或动作','采购案例里发生了什么','对应概念'],[
['磁盘保存','摘要、预算范围、安全要求分开存放','外部记忆'],
['客户端加载','首次输入含偏好和详细记忆入口','摘要'],
['工具按需读取','打开pilot-budget.md，返回正文','渐进式披露'],
['模型依据输入回答','区分10万元试点与300人部署','适用范围'],
['采用新条件、更新记录','按30万元回答，并保存正式部署条件','当前消息与长期更新']])+
bottom('记忆读取仍依靠工具调用：读取结果加入输入，模型继续做next token prediction。')));
add(29,()=>page(lead('这里的Memory保存在模型外部，读取后参与文本生成；模型参数仍需通过训练更新。')+
im(80,110,1340,385,'cross-session')+svg(rule(520))+
a(0,550,460,'① 保存与使用','mr8-h')+a(0,606,460,'外部存储，通过增删改查维护','mr8-small')+
a(520,550,460,'② 作用与代价','mr8-h')+a(520,606,460,'无关记忆的干扰、信息与权限风险','mr8-small')+
a(1050,550,450,'③ Codex中的记忆','mr8-h')+a(1050,606,450,'先加载摘要，再用工具读细节','mr8-small')));
add(30,()=>page(lead('记忆也可以保存做事的方法；反复使用、经过验证的操作流程，可以整理成Skills。')+
im(20,103,1460,455,'memory-to-skills')+
a(0,595,1500,'采购案例：预算适用范围是记忆；反复可用的采购评审步骤，可以整理成技能。','mr8-text')+
bottom('Skills把可复用的方法单独组织起来，供智能体按需读取和执行。')));
// Local controls reuse the source lesson's file-reader and message-trace pattern.
if(typeof document!=='undefined')document.addEventListener('click',event=>{
 const b=event.target.closest('[data-mr8-file],[data-mr8-item],[data-mr8-mode],[data-mr8-update],[data-mr8-reset]');if(!b)return;
 const host=b.closest('[data-mr8-widget]');if(!host)return;event.preventDefault();event.stopPropagation();
 const set=(selector,text)=>{const node=host.querySelector(selector);if(node){node.textContent=text;if(node.tagName==='PRE')node.scrollTop=0;}};
 if(host.dataset.mr8Widget==='files'){
  const k=b.dataset.mr8File||'summary';host.querySelectorAll('[data-mr8-file]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mr8File===k)));
  set('[data-mr8-heading]',D.files[k].path);set('[data-mr8-content]',D.files[k].text);set('[data-mr8-caption]',k==='summary'?'摘要保存用户偏好、项目背景和详细记录的文件路径。':k==='budget'?'这份记录说明10万元只适用于20人、3个月试点。':'这份记录保存安全要求；本次查询预算范围时没有读取。');
 }else if(host.dataset.mr8Widget==='trace'){
  const view=host.dataset.mr8View,defaults={first:'memory',call:'call',read:'result',followup:'followup'};
  let selected=b.dataset.mr8Item||host.dataset.mr8Selected,mode=b.dataset.mr8Mode||'selected';if(b.hasAttribute('data-mr8-reset')){selected=defaults[view];mode='selected';}
  host.dataset.mr8Selected=selected;host.querySelectorAll('[data-mr8-item]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mr8Item===selected&&mode!=='all')));host.querySelectorAll('[data-mr8-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mr8Mode===mode)));
  set('[data-mr8-heading]',mode==='all'?(view==='call'||view==='answer'?'当前已记录的条目':'本次输入的完整文本'):(mode==='selected'&&selected==='memory'?'已加载的记忆摘要':D.items[selected].label));
  set('[data-mr8-content]',mode==='all'?D.views[view].map((id,i)=>`${i+1}. ${D.items[id].label}\n${D.items[id].text}`).join('\n\n────────\n\n'):(mode==='selected'&&selected==='memory'?D.summary:D.items[selected].text));
 }else if(host.dataset.mr8Widget==='update'){
  const i=b.hasAttribute('data-mr8-reset')?0:Number(b.dataset.mr8Update);host.querySelectorAll('[data-mr8-update]').forEach(x=>x.setAttribute('aria-pressed',String(Number(x.dataset.mr8Update)===i)));
  set('[data-mr8-disk]',i===0?D.projectSummary:D.projectUpdated);set('[data-mr8-input]',i<2?D.projectSummary:'原有摘要：\n企业知识库项目已完成20人试点，正在讨论扩大部署。\n\n新增工具返回：\n正式部署：使用期限一年，预算上限30万元。\n20人、3个月、10万元属于此前试点。');set('[data-mr8-input-heading]',i<2?'已加载摘要：项目背景':'后续输入：原摘要＋新返回');
  set('[data-mr8-status]',['客户端首次加载摘要，磁盘与输入中的摘要内容相同。','“请记住”的新条件经后台整理写入摘要后，磁盘内容更新；原先加载的摘要仍是旧文本。','再次读取后，新内容作为工具结果追加到输入；原有摘要仍保留在此前的消息中。'][i]);
 }
});
})();

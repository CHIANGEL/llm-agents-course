(function(){'use strict';
const R=window.MBA_RENDERERS;
const at=(x,y,w,text,cls='r21-text')=>`<div class="r21-at ${cls}" style="left:${x}px;top:${y}px;width:${w}px">${text}</div>`;
const pic=(x,y,w,h,file,alt)=>`<img class="r21-at r21-pic" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/${file}" alt="${alt}">`;
const agent=(x,y,w=130,h=130)=>pic(x,y,w,h,'protocols-r10/agent.png','智能体');
const model=(x,y,w=130,h=130)=>pic(x,y,w,h,'llm.png','大模型');
const svg=paths=>`<svg class="r21-lines" viewBox="0 0 1504 718" aria-hidden="true"><defs><marker id="r21-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#0872b9" stroke-width="1.7"/></marker><marker id="r21-redtip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#91251f" stroke-width="1.7"/></marker></defs>${paths}</svg>`;
const line=d=>`<path d="${d}" fill="none" stroke="#0872b9" stroke-width="3" marker-end="url(#r21-tip)"/>`;
const lead=t=>at(0,0,1504,t,'r21-lead');
const foot=t=>at(0,655,1504,t,'r21-foot');
const add=(id,text)=>R[id]={steps:1,render:()=>`<div class="r21">${text}</div>`};

// Redraw the two sub-agent figures with selectable labels.
add(8512,
 at(0,0,1504,'<span>运行安排 4 / 5</span>　分配子任务 → 交回结果 → 协调与汇总','r21-tag')+
 at(0,80,1504,'子智能体（Sub-agent）在自己的上下文中处理子任务，把结果交回主智能体。','r21-lead')+
 '<div class="r21-harness-boundary"><span>Harness</span></div>'+
 '<div class="r21-child-area r21-child-a"></div><div class="r21-child-area r21-child-b"></div>'+
 svg(line('M310 357 H390 V258 H508')+line('M390 357 V466 H508')+line('M974 258 H1077 V357 H1185')+'<path d="M974 466 H1077 V357" fill="none" stroke="#0872b9" stroke-width="3"/>')+
 agent(132,270,150,150)+at(73,425,265,'主智能体','r21-h2 r21-center')+at(73,478,265,'分配任务','r21-small r21-center')+
 agent(534,191,110,110)+at(673,197,270,'子智能体 A','r21-h2')+at(673,248,270,'在自己的上下文中处理','r21-small')+
 agent(534,398,110,110)+at(673,404,270,'子智能体 B','r21-h2')+at(673,455,270,'在自己的上下文中处理','r21-small')+
 agent(1222,270,150,150)+at(1165,425,265,'主智能体','r21-h2 r21-center')+at(1165,478,265,'汇总并检查','r21-small r21-center')+
 at(285,303,95,'委托','r21-label')+at(1090,303,100,'回传','r21-label')+
 foot('先看怎样隔开过程，再看任务能否并行，最后判断是否值得分工。'));

add(8513,lead('较长的查找和处理留在子任务中，把<span class="r21-red">结论、疑点与原始位置</span>交回来。')+
 '<div class="r21-context-boundary"><span>子智能体的上下文</span></div>'+
 pic(52,244,145,145,'doc.png','查阅文档')+pic(272,244,145,145,'tool.png','调用工具查看日志')+
 agent(488,244,145,145)+
 at(30,425,190,'读资料','r21-h2 r21-center')+at(246,425,200,'查看日志','r21-h2 r21-center')+
 at(467,425,190,'反复处理','r21-h2 r21-center')+
 svg(line('M197 316 H254')+line('M419 316 H472')+line('M688 316 H790')+line('M1116 316 H1216')+
 '<path d="M1295 476 V559 H555 V510" fill="none" stroke="#91251f" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#r21-redtip)"/>')+
 '<div class="r21-report"><h3>子任务报告</h3><ul><li>结论</li><li>疑点</li><li>原始资料的位置</li></ul></div>'+
 agent(1227,240,165,165)+at(1166,425,290,'主智能体','r21-h2 r21-center')+
 at(690,535,470,'需要细节时，追问或读取原文','r21-return')+
 foot('主上下文保留所需结果；细节按需补回，延续渐进式披露。'));

add(21001,lead('Harness补充模型当前的能力；有效做法可通过训练内化，再重新调整Harness。')+
 '<div class="r21-cycle-label">分工随模型能力改变</div>'+
 svg(line('M737 215 H863')+line('M1120 304 V410')+line('M864 505 H738')+line('M385 414 V309'))+
 pic(156,150,130,130,'html-figures-r6/skill.png','外部方法手册')+
 at(320,152,385,'① 外化补充','r21-h2')+at(320,206,385,'方法、资料、工具\n先把当前任务做成','r21-text')+
 pic(899,150,130,130,'doc.png','任务运行记录')+
 at(1064,152,410,'② 积累经验','r21-h2')+at(1064,206,410,'记录行动与结果\n判断哪些做法有效','r21-text')+
 model(899,439,130,130)+
 at(1064,435,410,'③ 选择性内化','r21-h2')+at(1064,489,410,'筛选训练材料\n更新模型参数','r21-text')+
 agent(156,439,130,130)+
 at(320,435,385,'④ 调整Harness','r21-h2')+at(320,489,385,'删减多余指导\n补充新的方法和工具','r21-text')+
 foot('下面先看模型升级带来的变化，再看内化怎样发生，最后回到这条循环。'));

add(21002,lead('GPT-6 Astra发布后，OpenAI建议重新检查Skills、工作指令和任务提示。')+
 pic(23,130,124,124,'html-figures-r6/skill.png','工作方法与指令')+
 at(184,139,1165,'同一份Skill，对不同模型可能是帮助，也可能是束缚。','r21-case-heading')+
 '<div class="r21-comparison"><div class="r21-comparison-head"><span>原先的细致指导</span><span></span><span>模型能力提高后，重新检查</span></div>'+
 [['详细预设每一步','交代目标和必要条件'],['每次先读所有文档','根据当前任务选择资料'],['反复提醒检查与测试','按任务需要安排检查']].map(x=>`<div class="r21-comparison-row"><span>${x[0]}</span><span class="r21-arrow">→</span><strong>${x[1]}</strong></div>`).join('')+'</div>'+
 at(26,570,1450,'“Guidance that helps Sol or Luna may overconstrain GPT-6 Astra.”','r21-quote')+
 at(26,625,1450,'Eric Provencher · OpenAI · 2026-09-11　<a href="https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra" target="_blank" rel="noopener">Rethinking skills and prompts for GPT-6 Astra ↗</a>','r21-source'));

add(21003,lead('把反复有效的判断转成训练材料，通过训练更新参数，再检查模型能否独立完成。')+
 '<div class="r21-training-flow">'+[
 ['doc.png','运行记录','任务、行动与结果'],
 ['protocols-r10/result.png','筛选与反馈','有效做法与判断依据'],
 ['llm.png','训练模型','更新模型参数'],
 ['protocols-r10/agent.png','重新评估','撤去相应指导再做']
 ].map((x,i)=>`<div><img src="assets/${x[0]}" alt=""><h3>${x[1]}</h3><p>${x[2]}</p></div>${i<3?'<span class="r21-arrow">→</span>':''}`).join('')+'</div>'+
 '<div class="r21-retain r21-learn"><h3>可反复学习的判断</h3><ul><li>怎样分解任务</li><li>何时补充证据</li><li>怎样检查结果</li></ul></div>'+
 '<div class="r21-retain r21-external"><h3>持续留在外部的条件</h3><ul><li>最新信息与业务数据</li><li>实际操作的工具接口</li><li>权限与执行约束</li></ul></div>'+
 foot('能否撤去某项指导，要看模型在同类新任务上能否独立完成相应判断。'));

add(21004,lead('假设在同一组任务上按100分评价：')+
 '<div class="r21-score-round r21-round-one"><h3>第一轮</h3><div class="r21-score-pair">'+
 '<div><img src="assets/llm.png" alt="大模型"><span>LLM</span><b>70<small>分</small></b></div>'+
 '<div class="r21-score-add">＋ Harness<span>外化补充 →</span></div>'+
 '<div><img src="assets/protocols-r10/agent.png" alt="智能体"><span>Agent</span><b>80<small>分</small></b></div></div></div>'+
 '<div class="r21-score-round r21-round-two"><h3>第二轮</h3><div class="r21-score-pair">'+
 '<div><img src="assets/llm.png" alt="大模型"><span>LLM</span><b>75<small>分</small></b></div>'+
 '<div class="r21-score-add">＋ 新的Harness<span>再次补充 →</span></div>'+
 '<div><img src="assets/protocols-r10/agent.png" alt="智能体"><span>Agent</span><b>85<small>分</small></b></div></div></div>'+
 svg('<path d="M576 415 V472 H939 V415" fill="none" stroke="#91251f" stroke-width="3" marker-end="url(#r21-redtip)"/>')+
 at(604,447,309,'选择性内化','r21-cycle-bridge')+
 at(520,493,490,'筛选经验 → 训练更新参数','r21-small r21-center')+
 at(70,566,1364,'新任务暴露新的不足　→　继续外化与内化','r21-continue')+
 foot('模型变强，旧指导可以精简；新任务、新工具与新约束，继续推动Harness迭代。'));

R[21005]={steps:1,render:()=>window.MBA_NAVIGATION.agenda({navigation:'3.7',closing:true})};
})();

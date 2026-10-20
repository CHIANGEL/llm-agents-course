(function(){'use strict';
const R=window.MBA_RENDERERS,D=window.MBA_PROMPTING_R2,P=D.prompts;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const at=(x,y,w,t,c='pr-text')=>`<div class="at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const svg=t=>`<svg class="pr-svg" viewBox="0 0 1504 718" aria-hidden="true">${t}</svg>`;
const path=(d,c='#0070c0',w=3)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
const arrow=(x,y,w,c='#0070c0')=>path(`M${x} ${y} h${w} m-14 -9 l14 9 -14 9`,c);
const down=(x,y,h,c='#0070c0')=>path(`M${x} ${y} v${h} m-9 -14 l9 14 9 -14`,c);
const paper=(x,y,w,h)=>`<path d="M${x} ${y} H${x+w-22} L${x+w} ${y+22} V${y+h} H${x} Z M${x+w-22} ${y} V${y+22} H${x+w}" fill="#fff" stroke="#819bbb" stroke-width="2"/>`;
const circle=(x,y,r=9,color='#0070c0')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const line=y=>path(`M0 ${y} H1490`,'#cbd5e3',2);
const footer=(s)=>at(0,674,1490,s,'pr-summary');
function frame(page,body,conclusion=''){return `<div class="pr-page">${at(0,0,1490,D.intro[page-15],'pr-lead')}${body}${conclusion?footer(conclusion):''}</div>`;}
function statement(x,y,w,text,c=''){return at(x,y,w,esc(text),'pr-text '+c);}
function originalLines(id,from=0,to=99){const a=P[id-1].lines.filter(l=>l.line>=from&&l.line<=to);return a.map((l,i)=>(i&&l.line>a[i-1].line+1?'\n':'')+esc(l.text)).join('\n');}
function doc(x,y,w,html,c=''){return `<pre class="at pr-prompt ${c}" data-scroll-region tabindex="0" role="region" aria-label="Prompt正文，可滚动阅读" style="left:${x}px;top:${y}px;width:${w}px;height:${644-y}px">${html}</pre>`;}
function raw(page,id,split=10,from=0,to=99){return frame(page,at(0,76,1490,'原始Prompt · 滚动阅读','pr-label')+doc(0,119,1495,originalLines(id,from,to),'pr-prompt-wide'));}
const fourGroups=[['问清问题','先找准要回答的问题','苏格拉底式提问'],['学习','建立理解与可靠依据','双层解释 · 反向拆解<br>横纵分析 · 事实核查'],['解决问题','找到可行路径','专家会诊 · 第一性原理<br>跨领域借解'],['决策','比较条件，取得反馈','双向钢人 · 最小实验']];
function mainMap(page,end=false){return frame(page,
 at(0,94,470,'先把任务交代清楚','pr-heading')+
 at(0,180,455,'<ul class="pr-bullets"><li><strong>四大要点</strong><span>角色、背景、目标、示例</span></li><li><strong>给Example</strong><span>给出参照，说明参考什么</span></li><li><strong>让模型写Prompt</strong><span>把初稿整理成完整指令</span></li></ul>','pr-list-block')+
 svg(arrow(464,340,75))+at(581,94,900,'再根据需要选择方法','pr-heading')+
 fourGroups.map((g,i)=>at(590,180+i*112,230,g[0],'pr-group-name')+at(870,177+i*112,600,g[2],'pr-methods')+svg(i<3?path(`M586 ${263+i*112} H1490`,'#dce2e9',1):'')).join(''),
 end?'任务交代决定输入是否清楚；处理方法决定接下来怎样分析。':'问题模糊先澄清，缺理解先学习；需要方案再求解，有了方案再决策。');}
R[301]={steps:1,render:()=>mainMap(15)};
R[302]={steps:1,render:()=>frame(16,
 ['Who you are','Who I am','Objective','Example'].map((s,i)=>at(0,108+i*133,360,s,'pr-heading')+at(0,157+i*133,360,['你希望模型承担什么角色','你的背景与使用场景','最终要完成什么','参照什么样的结果'][i],'pr-small')+svg(arrow(363,147+i*133,88))).join('')+
 D.coreprompt.split('\n\n').map((s,i)=>at(486,108+i*133,1000,esc(s),'pr-context')).join(''),
 '目标、背景和必要约束交代清楚，再给模型选择具体做法的空间。')};
R[303]={steps:1,render:()=>frame(17,
 at(0,96,730,'参考样例','pr-heading')+`<img class="at pr-example-img" style="left:0;top:161px;width:750px;height:422px" src="assets/prompting-reference.jpg" alt="本课聊天模板页：聊天消息与连续输入左右对应">`+
 at(825,97,660,'说明要参考的特征','pr-heading')+at(825,170,660,'<ul class="pr-bullets pr-compact-list"><li><strong>版式</strong>：页眉、字号、图文比例</li><li><strong>结构</strong>：先说明问题，再展示对应关系</li><li><strong>表达</strong>：对象明确，动作具体</li></ul>','pr-small')+
 svg(arrow(756,370,48))+at(825,449,660,'“参考这页的版式和图文对应方式，\n把新内容的关系讲清楚。”','pr-quote'),
 '样例提供具体标准；同时说清哪些特征需要沿用。')};
R[304]={steps:1,render:()=>frame(18,
 at(0,91,900,'交给模型的请求','pr-heading')+doc(0,156,895,esc(D.metaprompt),'pr-meta')+
 at(1020,114,440,'任务初稿','pr-heading')+at(1020,172,440,'背景、目标、样例','pr-small')+svg(down(1180,230,75))+
 at(1020,330,440,'检查与补充','pr-heading')+at(1020,391,440,'遗漏、歧义、冲突','pr-small')+svg(down(1180,445,75))+
 at(1020,549,440,'完整Prompt','pr-heading')+at(1020,605,440,'可以直接用于目标任务','pr-small'),
 '先把想法说出来，再让模型帮助你把指令写完整。')};
R[305]={steps:1,render:()=>frame(19,
 ['四大要点','给Example','让模型写Prompt'].map((s,i)=>at(i*510,112,470,s,'pr-heading')+at(i*510,184,450,['角色、背景、目标、示例','给出参考，说明参考什么','初稿 → 检查 → 完整改稿'][i],'pr-small')).join('')+
 svg(line(290))+at(0,328,1490,'任务交代清楚以后，选择适合当前问题的处理方式。','pr-text')+
 fourGroups.map((g,i)=>at(i*380,445,340,g[0],'pr-heading')+at(i*380,514,330,g[1],'pr-small')+svg(i<3?arrow(i*380+324,466,40):'')).join(''),
 '问题模糊先澄清；缺理解先学习；需要方案再求解；有了方案再决策。')};
R[306]={steps:1,render:()=>frame(20,
 at(0,98,600,'苏格拉底式提问','pr-heading')+at(0,173,600,'先区分：<br>事实 · 解释 · 价值判断 · 目标','pr-small')+
 svg(paper(0,310,650,223))+at(28,338,592,'“每次只问一个问题，根据我的回答决定下一问，不要提前给我一整套问卷。”','pr-quote')+
 at(865,117,570,'提出一个关键问题','pr-heading')+svg(down(1130,178,72))+at(900,278,500,'回答提供新信息','pr-text')+
 svg(down(1130,329,72))+at(899,426,500,'更新判断','pr-heading')+
 svg(path('M1390 447 H1470 V142 H1404 m14 -9 l-14 9 14 9'))+at(1200,400,245,'仍缺关键信息','pr-source')+
 svg(down(1130,483,70))+at(858,575,620,'信息足够 → 确认新问题 → 建议','pr-small'),
 '最多6问；只问可能改变结论的问题，信息足够就停止。')};
R[307]={steps:1,render:()=>raw(21,1,8)};
R[308]={steps:1,render:()=>frame(22,
 ['概念听不懂','看到好成品，想学会','需要系统了解一个领域','需要判断说法是否可靠'].map((s,i)=>at(0,118+i*122,700,s,'pr-heading')+svg(arrow(745,145+i*122,115))+at(920,118+i*122,570,['双层解释法','反向拆解','横纵分析法','事实核查'][i],'pr-heading')).join(''),
 '澄清得到具体问题；学习方法帮助你获得相应的理解、做法、全貌和依据。')};
R[309]={steps:1,render:()=>frame(23,
 at(0,83,850,'原始Prompt · 滚动阅读','pr-label')+doc(0,128,850,originalLines(2))+
 svg(paper(987,135,490,158)+paper(987,375,490,158)+down(1230,308,53))+
 at(1015,162,430,'通俗层','pr-heading')+at(1015,222,430,'生活语言 + 具体例子','pr-small')+
 at(1015,399,430,'专业层','pr-heading')+at(1015,459,430,'术语 + 机制 + 适用边界','pr-small')+
 at(992,567,490,'把两层说法一一对应，\n定位容易理解错的地方。','pr-small'),
 '先听懂，再解释准确；类比与专业机制要对应。')};
R[310]={steps:1,render:()=>frame(24,
 at(0,100,680,'拆解刚才这页参考课件','pr-heading')+
 `<img class="at pr-example-img" style="left:0;top:177px;width:665px;height:374px" src="assets/prompting-reference.jpg" alt="聊天消息与连续输入文本一一对应的课件">`+
 at(0,579,660,'先明确：它要帮助听众理解什么？','pr-small')+
 svg(arrow(680,350,60))+at(790,100,700,'反向找到四个选择','pr-heading')+
 ['对象：没有技术基础的学员','结构：消息与输入文本左右对应','重点：角色、边界与续写位置','标准：能解释多轮对话仍是文本生成'].map((s,i)=>at(790,187+i*107,700,s,'pr-small')).join(''),
 '可复用的是图文对应的做法；具体内容随新任务变化。')};
R[311]={steps:1,render:()=>raw(25,3,8)};
R[312]={steps:1,render:()=>frame(26,
 svg(path('M160 560 V165 m-10 16 l10 -16 10 16')+path('M160 560 H1040 m-16 -10 l16 10 -16 10'))+
 at(10,90,720,'纵向：它怎样走到今天','pr-heading')+
 [0,1,2].map((_,i)=>svg(circle(160,495-i*125))+at(195,467-i*125,530,['早期选择','重要转折与成败','今天的能力与约束'][i],'pr-text')).join('')+
 at(410,592,650,'横向：与其他对象同维度比较','pr-heading')+
 ['强项','短板','独特性'].map((s,i)=>at(447+i*180,508,160,s,'pr-small')).join('')+
 svg(arrow(1090,346,73))+at(1190,215,300,'未来路径','pr-heading')+at(1190,294,300,'可能怎么发展<br><br>成立的前提<br><br>预警信号','pr-small'),
 '结合深度研究功能，看清过去怎样形成差异，以及差异怎样影响未来。')};
R[313]={steps:1,render:()=>raw(27,4,10,0,18)};
R[314]={steps:1,render:()=>frame(28,
 at(0,82,860,'原始Prompt · 接续分析要求','pr-label')+doc(0,127,860,originalLines(4,20,26))+
 at(1020,88,470,'报告的输出顺序','pr-heading')+
 ['核心结论','关键时间线','横向对比表','详细分析','未来判断','仍待确认的问题'].map((s,i)=>at(1080,160+i*78,410,s,'pr-small')+svg(circle(1030,180+i*78,7)+ (i<5?path(`M1030 ${188+i*78} v54`,'#93a8c4',2):''))).join(''),
 '重要结论能够追溯来源；分析与报告结构保持对应。')};
R[315]={steps:1,render:()=>frame(29,
 at(0,97,1490,'把同一句说法拆开，分别处理','pr-heading')+
 ['事实','推论','价值判断'].map((s,i)=>at(i*510,207,450,s,'pr-heading')+at(i*510,272,450,['能否被外部验证','事实能否推出结论','选择体现什么取舍'][i],'pr-small')).join('')+
 svg(path('M750 154 V178 H180 V196 M750 178 H690 V196 M750 178 H1200 V196','#8aa1c1',2)+line(367))+
 at(0,416,660,'事实核查','pr-heading')+at(0,483,675,'来源 · 样本 · 时间 · 完整上下文','pr-small')+
 at(790,416,695,'推理检查','pr-heading')+at(790,483,695,'假设 · 因果 · 其他解释 · 成立条件','pr-small')+
 at(0,590,1470,'事实得到支持之后，还要继续检查它支持的是哪一个结论。','pr-text'),
 '对来源的核查与对推理的检查，缺一不可。')};
R[316]={steps:1,render:()=>raw(30,5,15)};
R[317]={steps:1,render:()=>frame(31,
 at(0,96,650,'学习解决了什么','pr-heading')+
 ['双层解释 → 概念与机制','反向拆解 → 可复用的做法','横纵分析 → 发展、差异与未来','事实核查 → 依据与推理'].map((s,i)=>at(0,182+i*91,700,s,'pr-small')).join('')+
 svg(arrow(720,337,95))+at(865,96,620,'接下来：解决问题','pr-heading')+
 ['专家会诊：补足互补视角','第一性原理：重新推导路径','跨领域借解：寻找相通机制'].map((s,i)=>at(865,215+i*122,620,s,'pr-small')).join(''),
 '从理解问题推进到提出方案，接下来分别展开三种方法。')};
R[318]={steps:1,render:()=>frame(32,
 at(20,118,370,'互补视角1','pr-heading')+at(590,118,370,'互补视角2','pr-heading')+
 svg(path('M190 188 L360 297 M730 188 L590 297 M475 406 V508','#8aa1c1',3)+`<ellipse cx="475" cy="338" rx="225" ry="70" fill="white" stroke="#0070c0" stroke-width="3"/>`)+
 at(290,308,370,'相互质疑','pr-heading pr-center')+
 at(290,532,390,'互补视角3','pr-heading pr-center')+
 at(1010,105,480,'每种视角都回答','pr-heading')+
 at(1010,177,480,'如何定义问题<br>推荐什么路径<br>有哪些风险<br>什么证据会改变判断','pr-small pr-lines')+
 at(1010,458,480,'综合时分清','pr-heading')+at(1010,527,480,'共同事实 · 真正分歧<br>分歧背后的不同假设','pr-small'),
 '每种视角独立分析，再通过质疑与比较形成综合方案。')};
R[319]={steps:1,render:()=>raw(33,6,12)};
R[320]={steps:1,render:()=>frame(34,
 at(0,82,870,'原始Prompt · 滚动阅读','pr-label')+doc(0,118,925,originalLines(7),'pr-compact')+
 at(1000,122,490,'保留基本条件','pr-heading')+at(1000,198,470,'已确认的事实<br>真正想实现的目标<br>现实资源与约束','pr-small pr-lines')+
 svg(down(1225,367,65))+at(1000,454,480,'重新推导可行路径','pr-heading')+
 svg(down(1225,510,53))+at(1000,592,480,'写明前提与验证第一步','pr-small'),
 '把惯例当作待检查的假设，重新从事实、目标和约束出发。')};
R[321]={steps:1,render:()=>frame(35,
 at(0,101,460,'当前问题','pr-heading')+at(0,171,480,'背景、做法、约束、卡点','pr-small')+svg(arrow(480,190,84))+
 at(610,102,800,'先抽象底层结构','pr-heading')+at(610,172,800,'核心矛盾是什么？普通解法为何失效？','pr-small')+
 svg(down(1020,233,65)+path('M1020 298 H290 V350 M1020 298 V350 M1020 298 H1410 V350'))+
 ['领域A','领域B','领域C'].map((s,i)=>at(90+i*510,365,440,s,'pr-heading')+at(90+i*510,430,440,'相似问题 → 解决机制','pr-small')).join('')+
 svg(path('M290 490 V538 H1030 M800 490 V538 M1310 490 V538 H1030')+down(1030,538,40))+
 at(650,595,840,'迁移条件 → 当前方案 → 低成本验证','pr-small'),
 '领域要有距离，问题结构要相似；最终要回到当前条件。')};
R[322]={steps:1,render:()=>raw(36,8,10)};
R[323]={steps:1,render:()=>frame(37,
 at(0,96,660,'三种求解方法','pr-heading')+
 ['专家会诊：从不同视角看','第一性原理：回到基本条件','跨领域借解：向其他领域找'].map((s,i)=>at(0,187+i*114,700,s,'pr-small')).join('')+
 svg(arrow(724,330,95))+at(868,96,600,'两个方向都有道理，怎么选？','pr-heading')+
 at(868,224,600,'双向钢人论证','pr-heading')+at(868,291,600,'比较双方理由和成立条件','pr-small')+
 at(868,431,600,'用最小实验替代空想','pr-heading')+at(868,498,600,'让现实反馈补充判断依据','pr-small'),
 '找到更多解法以后，继续处理取舍与不确定性。')};
R[324]={steps:1,render:()=>frame(38,
 at(0,99,680,'支持方向A','pr-heading')+at(822,99,680,'支持方向B','pr-heading')+
 ['最强理由','适用条件','最大收益与风险','最难回答的反对意见'].map((s,i)=>at(0,188+i*83,650,s,'pr-text')+at(822,188+i*83,660,s,'pr-text')+svg(path(`M659 ${211+i*83} H783`,'#b2c1d6',2))).join('')+
 svg(path('M315 525 V561 H750 M1140 525 V561 H750')+down(750,561,49))+
 at(205,626,1100,'真正的分歧 → 决定性变量 → 一个关键问题','pr-small pr-center'),
 '比较最强版本及其成立条件，再作明确判断。')};
R[325]={steps:1,render:()=>raw(39,9,6)};
R[326]={steps:1,render:()=>frame(40,
 at(0,104,470,'先找到关键假设','pr-heading')+at(0,181,470,'列出3个，选最可能改变\n最终结论的1个','pr-small pr-pre')+
 svg(arrow(490,224,82))+at(620,105,850,'设计低成本、可逆的验证','pr-heading')+at(620,181,850,'限定周期、时间和资源投入','pr-small')+
 svg(down(1050,246,69))+at(640,343,810,'行动之前：指标与判定条件','pr-heading')+
 at(640,413,390,'什么结果支持继续','pr-small')+at(1070,413,420,'什么结果提醒停止','pr-small')+
 svg(down(1050,470,59))+at(620,555,870,'行动之后：获得什么新信息','pr-heading'),
 '先写清判断标准，再行动；新信息要能帮助下一步选择。')};
R[327]={steps:1,render:()=>raw(41,10,8)};
R[328]={steps:1,render:()=>frame(42,
 at(0,108,650,'双向钢人论证','pr-heading')+at(0,186,655,'把两边理由说充分\n比较各自成立的条件\n找出会改变结论的变量','pr-text pr-pre')+
 at(830,108,660,'最小实验','pr-heading')+at(830,186,660,'选一个决定性的假设\n设计低成本、可逆行动\n取得现实反馈','pr-text pr-pre')+
 svg(arrow(684,320,95)+path('M1140 433 V541 H320 V437 m-9 13 l9 -13 9 13'))+
 at(430,568,780,'用新信息更新判断与下一步行动','pr-heading'),
 '推理帮助找到关键条件；现实反馈帮助判断这些条件是否成立。')};
R[329]={steps:1,render:()=>mainMap(43,true)};
R[330]={steps:1,render:()=>frame(44,
 svg(paper(0,109,1490,155))+at(28,137,1430,'“查询纽约现在的天气，并根据返回的信息回答。”','pr-quote')+
 at(0,336,450,'Prompting','pr-heading')+at(0,407,450,'交代任务与判断要求','pr-small')+
 svg(arrow(470,425,80))+at(595,335,460,'工具执行','pr-heading')+at(595,407,460,'查询天气，取得返回结果','pr-small')+
 svg(arrow(1070,425,73))+at(1180,335,310,'继续生成','pr-heading')+at(1180,407,310,'依据结果回答','pr-small')+
 svg(path('M600 493 V550 H1450 V493','#8aa1c1',2))+at(540,592,950,'Agent组织工具执行，把返回结果加入模型输入','pr-small'),
 '下一部分：Agents怎样通过工具、记忆、技能和Harness组织执行。')};
})();

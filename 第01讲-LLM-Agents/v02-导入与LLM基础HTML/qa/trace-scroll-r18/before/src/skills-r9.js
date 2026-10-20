(function(){'use strict';
const R=window.MBA_RENDERERS,D=window.SKILLS_R9;
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const a=(x,y,w,t,c='sr9-text')=>`<div class="sr9-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const im=(x,y,w,h,n,alt)=>`<img class="sr9-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/skills-r9/${n}.png" alt="${e(alt||n)}">`;
const pre=(x,y,w,h,t)=>`<pre class="sr9-at sr9-pre" data-scroll-region tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${e(t)}</pre>`;
const lead=t=>a(0,0,1504,t,'sr9-lead'),bottom=t=>a(0,654,1500,t,'sr9-bottom');
const ul=(x,y,w,ls)=>a(x,y,w,'<ul>'+ls.map(s=>'<li>'+s+'</li>').join('')+'</ul>');
const page=h=>'<div class="sr9">'+h+'</div>',add=(n,f)=>R[7000+n]={steps:1,render:f};
const svg=s=>`<svg class="sr9-lines" viewBox="0 0 1504 718" aria-hidden="true"><defs><marker id="sr9-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 2 L9 6 L2 10" fill="none" stroke="#0070c0" stroke-width="2.5"/></marker></defs>${s}</svg>`;
const arrow=(x,y,X,Y)=>`<path d="M${x} ${y} L${X} ${Y}" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#sr9-arrow)"/>`;
const rule=y=>`<path d="M0 ${y} H1504" stroke="#c6d2de" stroke-width="1.5"/>`;
const table=(x,y,w,hs,rs)=>a(x,y,w,'<table class="sr9-table"><thead><tr>'+hs.map(t=>'<th>'+t+'</th>').join('')+'</tr></thead><tbody>'+rs.map(r=>'<tr>'+r.map(t=>'<td>'+t+'</td>').join('')+'</tr>').join('')+'</tbody></table>');
const doc=(x,y,w,title,body)=>a(x,y,w,'<h3>'+title+'</h3><p>'+body+'</p>','sr9-doc');
const part=(n,previous)=>a(0,0,1504,`已结束：${previous}　→　<b>接下来：${['','完整技能包','一次调用全过程','合成、评估与维护'][n]}</b>`,'sr9-part');
function smallFlow(y,labels){return labels.map((t,i)=>a(i*385,y,345,t,'sr9-h sr9-center')).join('')+svg(labels.slice(1).map((_,i)=>arrow(i*385+345,y+23,i*385+378,y+23)).join(''));}
add(1,()=>page(lead('Skills把程序性记忆中的“怎样做”，整理成可以按任务调用的<span class="sr9-red">方法包</span>。')+
a(0,115,430,'程序性记忆','sr9-h')+a(0,180,430,'保留经过积累的做法。<br>知道顺序、条件和判断标准。')+
svg(arrow(485,220,640,220))+doc(710,115,700,'Skill：让做法能够再次使用','何时使用 → 按什么步骤做<br>需要哪些材料 → 怎样检查结果')+
svg(rule(360))+
a(0,405,450,'① 完整技能包','sr9-h')+a(0,470,450,'方法如何变成<br>说明、参考、脚本与模板？')+
a(530,405,450,'② 一次调用','sr9-h')+a(530,470,450,'模型先看什么、再读什么？<br>工具怎样生成并检查文件？')+
a(1060,405,440,'③ 自己的Skills','sr9-h')+a(1060,470,440,'怎样提炼自己的方法？<br>怎样评估和持续维护？')+
bottom('先认识文件包，再走完一次调用，最后讨论怎样形成适合自己的Skills。')));
add(2,()=>page(lead('<span class="sr9-red">程序性记忆（Procedural memory）</span>：保留做事的方法、步骤和经验。')+
a(0,112,580,'记住“是什么”','sr9-h')+doc(0,180,580,'历史与事实','这次项目采用哪个预算。<br>用户偏好什么表达方式。')+
a(810,112,690,'记住“怎样做”','sr9-h')+doc(810,180,690,'程序性记忆','拿到材料后，先核对什么？<br>按什么顺序处理，如何判断完成？')+
svg(arrow(1140,340,1140,405))+doc(810,425,690,'独立组织为Skill','把适用条件、步骤、资源与检查标准<br>放到可发现、可读取的文件包里。')+
a(0,425,650,'Memory保存的信息中，<br>可以包含可复用的做法。<br><br>Skills把这些做法组织成独立入口。')+
bottom('文件中的方法被读入当前输入，影响本次生成；修改Skill文件不等于训练模型参数。')));
add(3,()=>page(part(1,'Skills的定位')+
lead16('沿用采购案例：条件已经确定，下面要把评审方法整理成一个Skill。',75)+
a(0,170,650,'本次任务','sr9-h')+pre(0,235,680,200,D.items.user.text)+
a(0,485,680,'Memory提供项目条件。<br>Skill提供组织评审的步骤与方法。','sr9-text')+
a(850,175,590,'<h3>采购评审要点</h3><p>一、采购条件</p><p>二、费用范围</p><p>三、交付与管理</p><p>四、待确认事项</p>','sr9-doc')+
svg(arrow(710,335,820,335))+bottom('先看完整文件夹，再打开入口、参考、脚本与模板。')));
function lead16(t,y=0){return a(0,y,1504,t,'sr9-lead');}
const purposes=D.files.map(f=>f.purpose);
function fileContent(i){return `<pre class="sr9-pre" data-scroll-region tabindex="0">${e(D.files[i].text)}</pre>`;}
function packageWidget(){return `<section class="sr9-widget sr9-package" data-sr9-widget="files"><div class="sr9-widget-list"><h2>procurement-review / 9个文件</h2><div class="sr9-file-list" data-scroll-region tabindex="0">${D.files.map((f,i)=>`<button data-sr9-file="${i}" aria-pressed="${i===0}">${e(f.path)}</button>`).join('')}</div></div><div class="sr9-panel"><h2 data-sr9-heading>SKILL.md</h2><div class="sr9-panel" data-sr9-filebody style="flex:1">${fileContent(0)}</div><p data-sr9-caption>${purposes[0]}</p></div></section>`;}
add(30,()=>page(lead('一个文件夹，把入口说明、参考方法、脚本和模板放在一起。')+
`<img class="sr9-at" style="left:0;top:85px;width:850px;height:550px" src="assets/skills-r16/package-tree.png" alt="采购评审技能包文件夹：SKILL.md，references下四份参考，scripts下两个脚本，assets下HTML模板，agents下客户端配置">`+
a(935,100,560,'SKILL.md：从这里开始','sr9-h')+a(935,155,560,'说明何时用、先做什么，<br>并给出所需文件的位置。')+
a(935,260,560,'三个资源文件夹','sr9-h')+ul(935,320,560,['references：具体方法与检查清单。','scripts：生成文件、检查一致性。','assets：一页评审的版式。'])+
a(935,545,560,'agents：客户端显示配置。','sr9-small')+
bottom('文件夹层级帮助组织资源；模型仍需通过工具逐个读取需要的文件。')));
add(4,()=>page(lead('选择左侧文件，查看其中的说明、方法、脚本或模板。')+packageWidget()+bottom('采购条件保存在本次任务中；技能包保存可以用于不同采购任务的方法。')));
add(5,()=>page(lead('同一个SKILL.md，开头用于识别用途，后续正文给出工作步骤。')+
a(0,105,715,'文件开头：什么时候用？','sr9-h')+pre(0,175,715,345,D.files[0].text.split('\n---\n')[0]+'\n---')+
a(830,105,670,'后续正文：怎样完成？','sr9-h')+ul(830,175,670,['先核对本次人数、期限与预算。','区分正式部署和小范围试点。','沿参考文件组织初稿，运行脚本。','生成后读取检查清单，核对产物。'])+
svg(arrow(730,325,810,325))+a(0,560,1500,'目录先给用途和入口；读取SKILL.md后，具体步骤才进入模型输入。','sr9-sub')+
bottom('正式部署和试点使用同一个包，但会选择不同的参考文件。')));
add(6,()=>page(lead('模型读取方法并组织内容；工具运行程序，程序读取模板并写出文件。')+
doc(0,105,600,'references / 评审方法','模型读：正式部署怎样评审，<br>费用范围怎样核对。')+
doc(0,385,600,'review-input.json / 本次初稿','模型写：300人、一年、30万元，<br>以及按方法整理的评审要点。')+
doc(850,105,650,'assets / review-template.html','程序读：标题、四部分结构与版式。')+
doc(850,385,650,'scripts / render_review.py','程序执行：将初稿内容填入模板，<br>写出采购评审HTML文件。')+
svg(arrow(300,282,300,365)+arrow(1175,282,1175,365)+arrow(620,490,830,490))+
bottom('参考进入模型输入；模板由脚本直接读取。两种读取的主体和用途不同。')));
add(7,()=>page(lead('完整技能包提供方法和资源；本次采购条件由任务与记忆提供。')+
table(0,100,1500,['组成','作用','采购评审包中的内容'],[
['目录中的名称、用途与路径','判断这次是否需要','起草软件采购评审要点'],
['SKILL.md','取得工作顺序和资源入口','选分支 → 组织初稿 → 生成 → 检查'],
['references','补充具体做法','正式部署、试点、费用口径、检查清单'],
['scripts / assets','完成固定操作和版式','生成与检查脚本、一页HTML模板']])+
a(0,535,1500,'简单方法可以只写一份SKILL.md；需要细节或稳定操作时，再增加文件。','sr9-text')+
bottom('下面进入一次调用：模型怎样从入口出发，逐层找到本次需要的内容？')));
add(8,()=>page(part(2,'完整技能包')+pre(0,70,1500,125,D.items.user.text)+
a(0,235,1500,'逐层读取方法，再生成并检查文件','sr9-h')+
smallFlow(320,['看Skill目录','读SKILL.md','读正式部署方法','读费用口径'])+
a(1060,450,440,'组织初稿、运行脚本','sr9-h sr9-center')+a(530,450,440,'读检查清单与产物','sr9-h sr9-center')+a(0,450,440,'检查并交付','sr9-h sr9-center')+
svg(arrow(1320,375,1320,430)+arrow(1050,475,995,475)+arrow(520,475,455,475))+
a(0,565,1500,'先用方法组织内容；文件生成后，再按清单核对。','sr9-text')+
bottom('每次读取都补充后续输入；没有用到的分支留在磁盘上。')));
function keyText(k){return D.items[k].excerpt||D.items[k].text;}
function keyCaption(k){return D.items[k].caption||'';}
function cumulative(view){const n=D.order.indexOf(D.end[view]);return D.order.slice(0,n+1);}
function trace(view,selected){return `<section class="sr9-widget" data-sr9-widget="trace" data-sr9-view="${view}" data-sr9-selected="${selected}"><div class="sr9-widget-list"><h2>当前环节</h2>${D.groups[view].map(k=>`<button data-sr9-item="${k}" aria-pressed="${k===selected}">${e(D.items[k].label)}<span>${e(D.items[k].origin)}</span></button>`).join('')}<div class="sr9-stage-note">${D.stages[view]}</div></div><div class="sr9-panel"><div class="sr9-toolbar"><button data-sr9-mode="text" aria-pressed="true">关键内容</button><button data-sr9-mode="full" aria-pressed="false">完整内容</button><button data-sr9-mode="raw" aria-pressed="false">消息结构</button><button data-sr9-mode="all" aria-pressed="false">截至此处的内容</button></div><h2 data-sr9-heading>${e(D.items[selected].label)}</h2><pre class="sr9-pre" data-scroll-region tabindex="0" data-sr9-content>${e(keyText(selected))}</pre><p data-sr9-caption>${e(keyCaption(selected))}</p></div></section>`;}
add(9,()=>page(lead('Memory已确定本次条件；用户提出新任务，Skill目录提供方法入口。')+trace('initial','memory')+bottom('当前输入包含项目条件和任务；技能正文仍需通过工具读取。')));
add(10,()=>page(lead('模型选用采购评审Skill，再通过工具读取SKILL.md。')+trace('skill','intro')+bottom('当前任务是正式部署；正文指向references/rollout-review.md。')));
add(11,()=>page(lead('沿SKILL.md的正式部署分支，读取评审顺序与内容要求。')+trace('reference','call_reference')+bottom('费用范围一节还有一个链接：cost-scope.md。下一步继续展开它。')));
add(31,()=>page(lead('评审方法继续指向费用口径：需要报清哪些费用，怎样比较？')+trace('cost','call_cost')+bottom('这次读取来自上一份参考中的链接；不是一次把所有参考都放入输入。')));
add(32,()=>page(lead('补充读取项目的账户与数据要求，再按评审结构组织本次初稿。')+trace('prepare','call_security')+bottom('项目文件提供条件和要求；Skill参考提供整理这些信息的方法。')));
add(12,()=>page(lead('模型生成运行命令；脚本读取本次初稿和模板，写出评审文件。')+trace('render','call_create')+bottom('工具返回文件位置；接下来读取检查标准，再打开文件核对内容。')));
add(13,()=>page(lead('从SKILL.md的检查入口出发，先读清单，再读回刚生成的文件。')+trace('verify','call_checklist')+bottom('对照当前条件、材料依据与待确认事项，检查实际产物。')));
add(33,()=>page(lead('按清单运行检查脚本，比对当前条件、初稿字段与生成文件。')+trace('validate','call_validate')+bottom('自动检查保证这些项目一致；内容是否有依据、待确认事项是否完整，仍需逐项核对。')));
add(14,()=>page(lead('一页评审要点保留四部分，当前采购条件与待确认事项都能直接看到。')+
a(0,70,1504,D.artifact,'sr16-review')+
a(1140,596,360,'<a href="sources/skills-r16/case/output/procurement-review.html" target="_blank" rel="noopener">打开完整评审文件 ↗</a>','sr9-small')+
bottom('报价、上线日期与验收标准仍需确认；评审文件把这些事项单独列明。')));
add(15,()=>page(lead('核对文件后，向用户交代产物位置、主要内容与仍需确认的事项。')+trace('answer','answer')+bottom('交付内容与任务一致：起草一页评审要点，保留报价、上线日期与验收标准等待确认事项。')));
add(16,()=>page(lead('方法逐层展开；脚本完成操作；产物生成后，再读取检查要求。')+
a(0,105,330,'Skill目录','sr9-h')+a(390,105,330,'SKILL.md','sr9-h')+a(780,105,330,'正式部署方法','sr9-h')+a(1170,105,330,'费用口径','sr9-h')+
svg(arrow(295,130,365,130)+arrow(685,130,755,130)+arrow(1075,130,1145,130))+
a(0,180,330,'判断是否适用')+a(390,180,330,'选择工作分支')+a(780,180,330,'组织评审内容')+a(1170,180,330,'补齐具体规则')+
svg(rule(300))+
a(0,345,700,'生成：模型组织初稿 → 工具运行脚本','sr9-sub')+a(800,345,700,'检查：另读清单 → 读回文件 → 核对','sr9-sub')+
a(0,425,700,'脚本直接读取模板，写出文件。<br>模板没有先作为正文交给模型。')+
a(800,425,700,'检查标准在交付前展开。<br>试点分支本次没有读取。')+
a(0,555,1500,'渐进式披露的关键：当前要做什么，决定接着读取什么。','sr9-h')+
bottom('Skills保存方法；工具完成读取与执行；Memory提供本次任务所需的信息。')));
add(17,()=>page(part(3,'一次Skill调用')+
a(0,75,1500,'自己的Skills：提炼已有做法，生成初稿，再用新的任务检验与修订。','sr9-lead')+
im(0,180,1500,415,'creation-cycle','已有工作、自然语言创建、组织文件、新任务试用、具体修改的循环')+
bottom('生成之后，重点检查：适合自己吗、能迁移吗、安全吗、变化后还有效吗？')));
add(18,()=>page(lead('两种应用都能辅助创建Skill；把已有成果和已确认的要求交代清楚。')+
a(0,90,680,'Codex','sr9-h')+a(0,145,680,'用 $skill-creator 发起创建或修改。','sr9-text')+
a(800,90,700,'Claude Code','sr9-h')+a(800,145,700,'安装官方skill-creator插件后，<br>用自然语言请求创建与改进。','sr9-text')+
pre(0,265,1500,335,D.creator)+bottom('创建工具本身也是Skill。初稿形成后，换一个新任务检查它。')));
add(19,()=>page(lead('主文件保留必要指导；只有内容较长或需要稳定执行时，才增加其他文件。')+
ul(0,95,1500,['SKILL.md写清适用条件、需要的输入、步骤和结果标准。','细节按需读取；稳定操作保存为脚本；固定结构保存为模板。'])+
im(170,255,1210,380,'file-structure','SKILL.md连接references、scripts、assets')+
bottom('把可复用的方法留下，把一次性的人名、金额、日期与临时条件留在具体任务里。')));
add(20,()=>page(lead('Star数量反映收藏关注；<span class="sr9-red">是否适合自己的任务</span>，要看实际输出。')+
a(0,105,620,'通用PPT或写作Skill','sr9-h')+ul(0,175,620,['可能按作者偏好的结构和文风组织。','版式漂亮，仍可能不适合你的听众。','统一规则也可能与你已经确认的要求冲突。'])+
a(780,105,720,'从自己的定稿与修改意见提炼','sr9-h')+pre(780,175,720,435,D.style)+
a(0,490,620,'把“我喜欢怎样写”变成有例子、<br>有适用范围的具体规则。','sr9-sheet sr9-text')+
bottom('同一份新材料，对比通用Skill、个人Skill与直接提示的结果，再决定采用哪一种。')));
add(21,()=>page(lead('换一个新输入，观察是否触发、怎样执行、产物是否达到你的标准。')+
table(0,100,1500,['检查','怎样看','发现问题后改哪里'],[
['选对了吗？','适用任务能选中；不适用任务不误用','名称、用途与触发条件'],['读对了吗？','找到正确参考，步骤和工具符合任务','分支、路径与操作说明'],['结果对了吗？','事实、文风、格式与交付要求一致','方法、模板与检查标准']])+
a(0,495,1500,'相同材料与要求　→　带Skill / 不带Skill　→　比较结果、返工与耗时','sr9-h sr9-center')+
a(0,575,1500,'换新会话检验，避免沿用创建Skill时已经交代过的背景。','sr9-text')+
bottom('判断依据是代表性任务的结果；“成功生成了SKILL.md”只是起点。')));
add(22,()=>page(lead('一个地方做出来的Skill，迁到另一个场景或应用后，要重新验证。')+
table(0,105,1500,['依赖什么','换环境时可能发生什么','迁移前核对'],[
['任务场景','受众、材料与交付标准变了','适用任务、输入和产物'],['模型','遵循方式与原有能力不同','指令是否仍有帮助'],['Harness：运行环境','工具、路径、依赖与权限不同','能否读取、执行并检查']])+
a(0,495,1500,'例如：本机能生成采购评审HTML，另一个应用的文件路径、工具和Python环境可能不同。','sr9-text')+
a(0,575,1500,'迁移顺序：检查依赖 → 调整入口与工具 → 用代表任务验证。','sr9-h')+
bottom('方法可以复用；运行条件需要适配。换了环境以后，重新看实际结果。')));
add(23,()=>page(lead('公共Skill包含文字指令，也可能附带脚本；导入时要看它会引导什么操作。')+
doc(0,120,430,'外部Skill包','SKILL.md中的指令<br>附带脚本<br>继续下载的外部内容')+
doc(550,120,430,'模型与工具','可能读取无关文件<br>访问外部地址<br>运行文件操作')+
doc(1100,120,400,'潜在影响','数据外传<br>文件被改写<br>操作超出任务范围')+
svg(arrow(440,245,535,245)+arrow(990,245,1085,245))+
a(0,405,1500,'实际影响取决于：文件权限、联网能力，以及执行前的确认机制。','sr9-risk-line sr9-text')+
ul(0,515,1500,['检查来源和版本；读正文与脚本，核对外部依赖。','先用不含敏感信息的材料，在受限环境验证行为。'])+
bottom('高Star与流行度不能替代内容审查；授权范围要与当前任务相称。')));
add(24,()=>page(lead('把Skill当作需要维护的工作方法：场景、模型或Harness变化后，重新检验。')+
table(0,100,1500,['变化','需要复查什么'],[
['场景变化','新材料、新受众、新交付标准，是否仍在适用范围内？'],['模型变化','旧做法是否仍能改善结果，还是已经多余、产生干扰？'],['Harness变化','工具名、文件路径、依赖和权限，是否仍然可用？']])+
a(0,470,1500,'已验证版本 → 新条件下复查 → 修改对应问题 → 重跑代表任务','sr9-h sr9-center')+
svg(arrow(1190,535,1190,575)+`<path d="M1190 575 H365 V535" stroke="#0070c0" fill="none" stroke-width="3" marker-end="url(#sr9-arrow)"/>`)+
a(520,590,530,'保留版本，必要时回退或停用','sr9-small sr9-center')+
bottom('修订时只加入可复用的规则，不把每一次偶然情况都扩展成通用要求。')));
add(25,()=>page(lead('自己的Skill是否值得保留，最终取决于它在自己任务中的作用。')+
im(0,100,1500,380,'creation-cycle','从已有工作创建初稿，再用新任务持续改进')+
a(0,520,460,'提炼：来自自己的有效做法','sr9-sub')+
a(530,520,450,'评估：比较实际结果','sr9-sub')+
a(1060,520,440,'维护：随条件变化复查','sr9-sub')+
bottom('适配自己的要求，检查外部内容与权限，保留经过验证的方法和版本。')));
add(26,()=>page(lead('Skills把程序性记忆组织成方法包，再借助工具，在新任务中重新使用。')+
a(0,105,450,'① 完整技能包','sr9-h')+a(0,175,450,'入口说明何时用，<br>正文与资源说明怎样做。')+
a(530,105,450,'② 一次调用','sr9-h')+a(530,175,450,'目录 → 正文 → 相关参考；<br>工具执行，再读回检查。')+
a(1060,105,440,'③ 自己的Skills','sr9-h')+a(1060,175,440,'从自己的有效做法提炼，<br>按任务结果评估与维护。')+
svg(rule(355))+
a(0,400,1500,'工具提供动作　　Memory保存信息　　Skills组织方法','sr9-h sr9-center')+
svg(arrow(750,465,750,530))+
a(0,555,1500,'接下来：Protocols约定应用怎样与外部工具和其他Agent交换信息。','sr9-sub sr9-center')+
bottom('方法能否落实为可靠交付，还取决于这些组件怎样配合。')));
function updateTrace(w){const v=w.dataset.sr9View,k=w.dataset.sr9Selected,mode=w.dataset.sr9Display||'text',it=D.items[k];w.querySelectorAll('[data-sr9-item]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sr9Item===k));w.querySelectorAll('[data-sr9-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sr9Mode===mode));w.querySelector('[data-sr9-heading]').textContent=mode==='all'?'按顺序保留的任务、目录与消息':it.label;const p=w.querySelector('[data-sr9-content]');p.textContent=mode==='all'?cumulative(v).map(id=>'【'+D.items[id].label+'】\n'+D.items[id].text).join('\n\n'):mode==='raw'?it.raw?JSON.stringify(it.raw,null,2):it.text:mode==='full'?it.text:keyText(k);p.scrollTop=0;w.querySelector('[data-sr9-caption]').textContent=mode==='all'?'已有内容按顺序保留；新增的工具返回加入后续输入。':keyCaption(k);}
function updateFile(w,i){w.querySelectorAll('[data-sr9-file]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.sr9File)===i));w.querySelector('[data-sr9-heading]').textContent=D.files[i].path;w.querySelector('[data-sr9-filebody]').innerHTML=fileContent(i);w.querySelector('[data-sr9-caption]').textContent=purposes[i];}
if(typeof document!=='undefined')document.addEventListener('click',ev=>{const b=ev.target.closest('[data-sr9-file],[data-sr9-item],[data-sr9-mode]');if(!b)return;const w=b.closest('[data-sr9-widget]');if(!w)return;ev.stopPropagation();if(w.dataset.sr9Widget==='files')updateFile(w,Number(b.dataset.sr9File));else{if(b.hasAttribute('data-sr9-item')){w.dataset.sr9Selected=b.dataset.sr9Item;w.dataset.sr9Display='text';}else w.dataset.sr9Display=b.dataset.sr9Mode;updateTrace(w);}});
})();

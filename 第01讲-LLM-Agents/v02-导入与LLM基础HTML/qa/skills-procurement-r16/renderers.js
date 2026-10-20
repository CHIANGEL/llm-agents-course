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
`<a class="sr9-at" style="left:80px;top:75px;width:1344px;height:565px" href="sources/skills-r16/case/output/procurement-review.html" target="_blank" rel="noopener" aria-label="打开完整采购评审文件"><img style="width:100%;height:100%;object-fit:contain" src="assets/skills-r16/review-output.png" alt="生成的采购评审文件：300人、一年、30万元；费用范围、交付与管理、待确认事项"></a>`+
bottom('点击文件可打开阅读。没有报价的项目列为待确认事项，不填入推测金额。')));
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

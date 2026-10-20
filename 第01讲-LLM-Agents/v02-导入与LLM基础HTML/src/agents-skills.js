(function(){
'use strict';
const R=window.MBA_RENDERERS,{at,svg,arrow,paper,rule,wrap}=window.PROMPT_VIS;
const B='#003f98',RED='#c00000',L='#c5d4e5';
const reg=(p,steps,render)=>R[2000+p]={steps,render:s=>wrap(render(s))};
const folder=(x,y,w,h)=>`<path d="M${x} ${y+25}V${y}H${x+w*.42}L${x+w*.52} ${y+25}H${x+w}V${y+h}H${x}Z" fill="#f3f8fd" stroke="${B}" stroke-width="3"/>`;
const lines=(x,y,w,n,gap=27)=>Array.from({length:n},(_,i)=>`<path d="M${x} ${y+i*gap}H${x+w-(i%3)*23}" stroke="${L}" stroke-width="6"/>`).join('');
function nb(x,y,w,title,emphasis=false){let z=paper(x,y,w,405);const types=w>600?['标题与学习目标','目录','准备代码','第一步说明','模板示例代码','文字单元','代码单元']:['标题与学习目标','目录','准备代码','第一步说明','模板示例代码','文字单元','代码单元'];for(let i=0;i<7;i++){z+=`<rect x="${x+14}" y="${y+14+i*54}" width="${w-28}" height="46" fill="${i===0&&emphasis?'#fff0ee':i%2?'#f3f8fd':'#fff'}" stroke="${L}"/>`;}return svg(z)+types.map((v,i)=>at(x+30,y+20+i*54,w-60,i===0?title:v,'p-small'+(i===0&&emphasis?' red':''))).join('');}
function skMap(summary){return svg(folder(20,155,300,220)+paper(420,155,300,220)+paper(820,155,300,220)+paper(1220,155,260,220)+arrow(337,266,403,266)+arrow(737,266,803,266)+arrow(1137,266,1203,266)+rule(472))+
at(20,0,1460,summary?'Skill 把方法组织为材料，工具执行动作，检查回到实际产物。':'Agents / Skills：方法封装 → 按需读取 → 执行 → 检查产物','txt')+
at(40,205,260,'方法封装','h2 center')+at(40,275,260,'说明 · 参考<br>脚本 · 模板','label center')+
at(442,205,254,'按需读取','h2 center',1)+at(442,275,254,'本次任务<br>需要的做法','label center',1)+
at(842,205,254,'执行','h2 center',1)+at(842,275,254,'读取模板<br>生成文件','label center',1)+
at(1235,205,230,'检查产物','h2 center',2)+at(1235,275,230,'对照要求<br>打开文件','label center',2)+
at(30,529,1430,summary?'方法说明怎样做；文件记录做出了什么；任务要求决定怎样检查。':'Notebook 把说明、代码和结果放在同一文档。先看文件包，再看读取、执行与交付。','txt',2);}
reg(89,3,()=>skMap(false));
function packMap(summary){return svg(folder(30,140,460,350)+paper(650,100,385,175)+paper(1095,100,385,175)+paper(650,340,385,175)+paper(1095,340,385,175)+arrow(1050,185,1080,185)+arrow(1050,425,1080,425)+arrow(510,310,620,310)+`<path d="M620 310H635V185H647M635 310V425H647" fill="none" stroke="${B}" stroke-width="3"/>`)+
at(30,0,1440,summary?'文件包把“何时用、怎样做、用什么、如何查”放在一起。':'方法封装：先看四类文件，再对应到本次创建任务。','txt')+
at(55,202,410,'jupyter-notebook','h2 center')+at(55,295,410,'创建、整理 Notebook<br>说明 · 代码 · 结果','txt center')+
at(673,122,340,'SKILL.md','h2')+at(673,194,340,'用途与工作步骤','label')+
at(1118,122,340,'references/','h2',1)+at(1118,194,340,'结构与检查要求','label',1)+
at(673,362,340,'scripts/','h2',1)+at(673,434,340,'可执行程序','label',1)+
at(1118,362,340,'assets/','h2',2)+at(1118,434,340,'模板与素材','label',2)+
at(35,579,1420,summary?'说明给出使用路线，参考补充要求，脚本和模板帮助形成文件。':'下面用真实文件树和文件原文，逐项查看各自提供什么。','txt',2);}
reg(90,3,()=>packMap(false));
reg(91,3,()=>{const entries=['SKILL.md','references/tutorial-patterns.md','references/experiment-patterns.md','references/notebook-structure.md','references/quality-checklist.md','scripts/new_notebook.py','assets/tutorial-template.ipynb','assets/experiment-template.ipynb','agents/openai.yaml','assets/jupyter-small.svg','assets/jupyter.png','LICENSE.txt'];return svg(paper(735,65,745,510)+`<path d="M40 118V609M40 140H62M40 183H62M40 226H62M40 269H62M40 312H62M40 355H62M40 398H62M40 441H62M40 484H62M40 527H62M40 570H62M40 613H62" fill="none" stroke="${L}" stroke-width="2"/>`)+at(20,0,1460,'文件包共有 12 份文件：从入口找到本次要用的方法。','txt')+at(20,72,680,'jupyter-notebook/','label')+entries.map((v,i)=>at(73,118+i*43,645,v,'p-small '+([0,1,5,6].includes(i)?'blue':'p-muted'))).join('')+
at(765,90,680,'本次任务','h2')+at(765,166,680,'为“Python列表与平均值”<br>创建教学 Notebook 骨架。','txt')+at(765,280,680,'先保留模板内容，<br>并说明后续要补哪些内容。','txt',1)+at(765,432,680,'任务决定需要哪条读取路线。','txt red',2);});
reg(92,3,()=>svg(paper(20,85,705,480)+paper(790,85,690,480)+rule(628))+
at(20,0,1455,'入口说明先分任务类型，再给出材料和程序的位置。','txt')+at(45,112,650,'SKILL.md','h2')+at(45,187,650,'Decision tree','label')+at(45,243,650,'教学讲解 → tutorial<br>探索分析 → experiment','txt')+
at(45,381,650,'Workflow','label',1)+at(45,437,650,'确定目标 → 用模板创建骨架<br>→ 补内容 → 检查结果','label',1)+
at(815,112,640,'tutorial-patterns.md','h2',2)+at(815,201,620,'说明受众、基础与学习目标<br>提供可以快速浏览的目录','txt',2)+at(815,340,620,'每步将短说明、代码<br>与结果解释相连。','txt',2)+at(30,658,1430,'先理解用途，再沿文件中的入口查阅具体做法。','label',2));
reg(93,3,()=>packMap(true));
function loadingMap(summary){return svg(paper(25,150,390,250)+paper(565,150,390,250)+paper(1105,150,370,250)+arrow(433,275,546,275)+arrow(973,275,1086,275)+rule(492))+
at(25,0,1450,summary?'每次读取，都让当前输入多取得一份所需材料。':'按需读取与执行：先发现用途，再取得方法，最后运行程序。','txt')+
at(45,176,350,'名称 · 用途 · 入口','label center')+at(50,260,340,'判断这项 Skill<br>是否适合任务','txt center')+
at(585,176,350,'说明与教学参考','label center',1)+at(590,260,340,'SKILL.md<br>tutorial-patterns.md','label center',1)+
at(1125,176,330,'执行生成脚本','label center',2)+at(1130,260,320,'读模板 → 改标题<br>→ 写出 Notebook','label center',2)+
at(35,545,1430,summary?'模型读取说明与参考；工具运行程序；程序读取模板并写出文件。':'读取改变模型这次取得的材料，执行改变工作目录中的文件。','txt',2);}
reg(94,3,()=>loadingMap(false));
reg(95,3,()=>svg(paper(20,105,635,330)+paper(815,105,665,330)+arrow(674,278,795,278)+rule(505))+
at(20,0,1450,'名称、用途与入口，帮助模型决定是否打开 Skill。','txt')+at(45,129,580,'当前可用 Skill','h2')+at(45,212,580,'jupyter-notebook','p-big')+at(45,289,580,'创建、搭建或编辑 Notebook<br>入口：jupyter-notebook/SKILL.md','label')+
at(840,129,610,'取得详细说明','h2',1)+at(840,212,610,'模型提出读取 SKILL.md<br>工具返回文件正文','txt',1)+at(840,345,610,'输入增加：工作步骤和文件入口','label red',2)+
at(30,558,1430,'从一条用途信息，进入一份可以沿着执行的方法说明。','txt',2));
reg(96,3,s=>svg(folder(20,120,600,385)+paper(800,120,680,385)+arrow(641,311,779,311)+rule(565))+
at(20,0,1450,'渐进式披露：需要什么，再读取什么。','txt')+at(45,169,550,'文件包','h2')+at(45,245,550,'SKILL.md<br><span class="red">tutorial-patterns.md</span><br><span class="p-muted">experiment-patterns.md</span>','label')+
at(825,147,630,'当前已经取得','h2')+at(830,229,620,'名称、用途、入口<br>＋ SKILL.md 正文','txt')+at(830,354,620,s>0?'＋ 教学参考的具体要求':'','txt red',1)+at(30,600,1430,s<2?'任务是教学 Notebook，沿教学参考继续读取。':'模板由生成脚本读取；读取路径要看清执行者和用途。','txt',1));
reg(97,4,s=>svg(paper(25,140,420,390)+`<rect x="610" y="210" width="280" height="215" fill="#f3f8fd" stroke="${B}" stroke-width="3"/>`+arrow(462,325,591,325)+arrow(909,325,1078,325))+`<div data-reveal="2">${nb(1095,140,380,'Python列表与平均值',true)}</div>`+at(25,0,1440,'工具运行 new_notebook.py：读取教学模板、修改标题、写出文件。','txt')+
at(48,163,370,'tutorial-template.ipynb','label')+at(48,241,365,'7 个单元<br>包含说明与代码','txt')+at(48,374,365,'首标题：<br>等待写入任务名称','label')+
at(625,237,250,'生成脚本','h2 center',1)+at(625,316,250,'选用教学模板<br>写入新标题','label center',1)+
at(1085,563,400,'7 个单元的骨架文件','label center',2)+at(30,628,1430,s<3?'生成文件沿用模板结构，首标题替换为本次任务名称。':'工具返回文件路径；下一步打开产物，核对内容与任务要求。','label',2));
reg(98,3,()=>loadingMap(true));
function boxMap(summary){return svg(folder(25,150,390,250)+paper(570,150,360,250)+paper(1095,150,385,250)+arrow(432,276,551,276)+arrow(949,276,1076,276)+rule(490))+
at(25,0,1450,summary?'资料提供内容，制作方法组织交付，后续要求可以复用已找到的资料。':'Box 文档生成：已有资料 → 制作方法 → 可继续编辑的文件','txt')+
at(45,207,350,'已有报告','h2 center')+at(45,286,350,'季度报告<br>近期月度更新','label center')+
at(590,190,320,'文档制作接口','h2 center',1)+at(590,280,320,'Skills API','txt center',1)+
at(1115,190,345,'交付文件','h2 center',2)+at(1120,269,335,'幻灯片草稿<br>电子表格','txt center',2)+
at(35,546,1430,summary?'同一批资料可服务于不同文件要求；交付形式改变，数据依据仍需一致。':'沿公开的财务摘要流程，依次看查资料、做草稿和后续表格要求。','txt',2);}
reg(99,3,()=>boxMap(false));
reg(100,3,()=>svg(paper(25,130,440,315)+lines(55,270,355,4)+paper(560,130,440,315)+lines(590,270,355,4)+paper(1130,170,350,235)+arrow(1020,285,1110,285)+`<path d="M245 445V480H1060V285H1110" fill="none" stroke="${B}" stroke-width="3"/>`+rule(549))+
at(20,0,1460,'用户要求：用一页幻灯片概括公司的财务状况。','txt')+at(45,156,400,'上一份季度报告','h2 center')+at(580,156,400,'近期月度更新','h2 center',1)+at(1150,196,310,'有关数据','h2 center',2)+at(1150,280,310,'汇入本次<br>制作材料','txt center',2)+at(30,593,1430,'Agent 搜索 Box 文件夹，取得两类报告中的有关数据。','txt',2));
reg(101,3,s=>svg(paper(25,110,395,325)+lines(52,225,310,5)+`<rect x="610" y="95" width="340" height="100" fill="#f3f8fd" stroke="${B}" stroke-width="3"/>`+arrow(439,292,1039,292)+arrow(782,210,782,275)+paper(1060,110,420,325)+lines(1090,245,320,4)+rule(519))+
at(40,130,365,'已找到的资料','h2 center')+at(627,122,305,'文档制作方法','txt center')+at(1090,139,360,'财务摘要','h2 center',1)+at(1090,362,360,'幻灯片草稿','label center',1)+
at(40,565,1410,s<2?'Box 通过 Skills API，把有关资料组织成有格式的幻灯片草稿。':'团队接着补充分析与判断，继续完善这份草稿。','txt',1));
reg(102,3,s=>svg(paper(25,115,400,350)+lines(53,245,315,5)+paper(1045,90,435,205)+paper(1045,375,435,205)+arrow(996,193,1027,193)+arrow(996,479,1027,479)+arrow(443,290,685,290)+`<path d="M685 290V193H1024M685 290V479H1024" fill="none" stroke="${B}" stroke-width="3"/>`+`<path d="M1070 446H1450M1070 499H1450M1187 424V550M1325 424V550" fill="none" stroke="${L}" stroke-width="2"/>`)+
at(20,0,1460,'后续要求改为电子表格，复用已经找到的资料。','txt')+at(45,140,360,'同一批来源材料','h2 center')+at(1070,119,385,'幻灯片草稿','h2 center')+at(1070,391,385,'电子表格','h2 center',1)+at(470,533,500,'新要求：改变交付形式','txt red center',1)+at(30,635,1430,'资料与方法配合形成文件；换一种交付形式，仍保持相同的数据依据。','label',2));
reg(103,3,s=>{
 const rows=[['Python列表与平均值',0],['目录：数据 → 计算 → 检查',0],['数据：[10, 20, 30]',0],['平均值 = 合计 ÷ 个数',0],['合计：60　个数：3　平均值：20',1],['总量平均分成3份，每份为20',1],['检查通过：20 = (10 + 20 + 30) / 3',2]];
 let h=svg(paper(25,105,600,465)+paper(760,105,720,430)+rule(620));
 h+=at(25,0,1450,'骨架提供结构；补齐任务内容后，运行代码，再核对结果。','txt');
 h+=at(50,130,550,'补齐内容 → 运行 → 验收','h2');
 h+=at(50,218,550,'补入列表与平均值的说明、<br>对应代码和结果解释。','txt');
 h+=at(50,365,550,s===0?'7 个单元保留说明与代码的顺序。':s===1?'3 段代码顺序运行：<br>60 ÷ 3 = 20。':'输入、计算与解释相互对应，<br>3 段代码检查通过。','txt red');
 rows.forEach(([text,n],i)=>{
  h+=svg(`<rect x="774" y="${119+i*56}" width="692" height="46" fill="${i===0?'#fff0ee':'#f3f8fd'}" stroke="${L}"/>`);
  h+=at(788,125+i*56,665,text,'p-small'+(i===0?' red':''),n);
 });
 h+=at(30,655,1430,'验收同时看文件结构、内容、运行结果，以及它们是否满足任务目标。','label',2);
 return h;
});
reg(104,3,()=>skMap(true));
})();

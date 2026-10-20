(function(){
'use strict';
const R=window.MBA_RENDERERS,{at,svg,arrow,paper,rule,wrap,img}=window.AGENT_VIS;
const blue='#003f98',red='#c00000';
function agenda(last=false){let h=R[3].render().replace('h2 red','h2').replace('class="at h2" style="left:20px;top:268px','class="at h2 red" style="left:20px;top:268px');if(last)h=h.replace('class="at label" style="left:150px;top:610px','class="at label red" style="left:150px;top:610px');return h;}
R[2050]={steps:1,render(){return agenda();}};
function boundary(summary=false){return wrap(
at(0,0,1490,summary?'外部系统组织信息与执行，训练改变模型本身的能力。':'理解Agent，要同时看模型能力，以及模型之外怎样组织工作。')+
at(20,94,1000,'Externalization：外化','h2')+at(1115,94,385,'Internalization','h2')+
svg('<rect x="10" y="160" width="1035" height="405" rx="4" fill="#fff" stroke="#8aa7c8" stroke-width="2.5"/><path d="M1080 93 V599" stroke="#c5d4e5" stroke-width="2"/>')+
at(35,180,960,'Harness组织整个运行过程','label strong')+at(660,220,365,'Protocols：交互约定','label')+
svg(paper(35,257,260,96)+paper(35,406,260,96)+arrow(311,304,390,348)+arrow(311,453,390,410))+
at(54,277,223,'Memory：信息','label')+at(54,426,223,'Skills：方法','label')+
svg(paper(410,288,180,185)+arrow(604,378,650,378)+arrow(802,378,848,378))+
at(429,323,142,'本次<br>输入','txt center')+
img(670,298,120,129,'llm.png','模型根据输入提出内容或动作')+at(646,454,167,'模型','label center')+
img(869,309,143,120,'app.png','外部工具执行操作')+at(844,454,190,'工具执行','label center')+
svg('<path d="M933 500 V550 H500 V495 M490 509 L500 495 L510 509" fill="none" stroke="#0070c0" stroke-width="3"/>')+
at(585,505,320,'结果进入下一次输入','p-small center')+
at(1120,156,365,'内化：训练模型','label',1)+
svg(paper(1150,226,300,116)+arrow(1300,357,1300,415,red),1)+at(1174,252,245,'训练材料与反馈','label center',1)+
img(1227,429,120,129,'llm.png','训练更新模型参数',1)+at(1120,580,370,'模型参数经过更新','label red center',1)+
at(20,652,1470,summary?'工具、信息、方法、交互约定与运行安排，共同影响任务结果。':'依次展开工具调用、Memory、Skills、Protocols、Harness，再回看外化与内化。','label strong',2)
);}
R[2051]={steps:3,render(){return boundary();}};
R[2126]={steps:1,render(){return agenda(true);}};
function systemMap(summary){return wrap(
at(0,0,1490,summary?'各部分围绕同一任务配合，结果再回到任务要求中检查。':'把工具、Memory、Skills、Protocols与Harness放回同一项任务。')+
svg(paper(20,124,340,116)+paper(20,304,340,112)+paper(20,475,340,112))+
at(42,146,292,'任务要求与完成标准','label strong')+at(42,326,292,'Memory：信息记录','label')+at(42,497,292,'Skills：可复用做法','label')+
svg('<rect x="425" y="100" width="1059" height="521" rx="4" fill="#fff" stroke="#8aa7c8" stroke-width="2.5"/>')+
at(453,118,990,'Harness：准备输入、安排执行、保存状态与检查','label strong')+at(1035,187,420,'Protocols：交互约定','label')+
svg('<path d="M380 180 H404 V352 H464 M380 360 H464 M380 530 H404 V380 H464" fill="none" stroke="#0070c0" stroke-width="3"/>')+
svg(paper(480,251,240,205)+arrow(736,351,790,351))+
at(505,280,195,'本次输入','h2 center')+at(505,352,195,'任务与材料<br>相关结果','label center')+
img(808,247,140,150,'llm.png','模型提出下一步')+at(785,435,190,'模型','h2 center')+
svg(arrow(966,351,1060,351))+
img(1080,250,185,155,'app.png','工具执行并带回结果')+at(1060,435,230,'工具与结果','h2 center')+
svg('<path d="M1175 494 V545 H600 V490 M590 505 L600 490 L610 505" fill="none" stroke="#0070c0" stroke-width="3"/>')+
at(696,561,525,summary?'按结果继续、等待或结束':'返回结果，决定下一步','label center')+
at(20,662,1460,summary?'任务交代清楚，执行过程可继续，交付结果有依据。':'信息和方法供给输入，工具完成操作，运行程序把整个过程接起来。','label strong')
);}
R[2127]={steps:1,render(){return systemMap(false);}};
R[2128]={steps:3,render(){return wrap(
at(0,0,1490,'任务：为MBA制作三小时的LLM Agents课程。')+
svg(paper(12,111,625,455))+
at(40,145,560,'目标与交付','h2')+at(40,207,560,'MBA受众 · 180分钟 · HTML课件','label black')+
at(40,297,560,'参考资料','h2',1)+at(40,359,560,'原课程材料与Prompting补充PDF','label black',1)+
at(40,449,560,'可复用要求','h2',1)+at(40,508,560,'教师措辞、安泰课件版式','label black',1)+
svg(arrow(660,341,737,341),2)+
img(759,133,730,411,'agents-integration/prompting-r3-example.jpg','本课Prompting页面：原始Prompt与方法图解',2)+
at(773,566,710,'把材料与方法落实到具体页面','label strong center',2)+
at(20,662,1450,'验收时回到目标：内容关系、材料依据、图文呈现与播放效果。','label strong',2)
);}};
function changes(summary){return wrap(
at(0,0,1490,summary?'外化与内化的区别，在于改动发生的位置。':'两条改进路径，分别改变外部工作条件和模型参数。')+
at(15,107,410,'外化 Externalization','h2')+
svg(paper(15,185,380,158)+arrow(415,264,512,264)+paper(540,185,384,158)+arrow(946,264,1046,264))+
at(40,218,330,summary?'更新记录、方法与工具':'增加资料、方法或工具','label black center')+
at(565,218,333,'改变输入与执行过程','label red center')+
img(1090,184,125,134,'llm.png','模型利用新的工作条件')+at(1240,219,245,'组织输入与执行','label')+
svg(rule(398))+
at(15,437,410,'内化 Internalization','h2',1)+
svg(paper(15,511,380,158)+arrow(415,590,512,590)+paper(540,511,384,158)+arrow(946,590,1046,590),1)+
at(40,545,330,summary?'利用经验组织训练':'训练材料与训练过程','label black center',1)+
at(565,545,333,'更新模型参数','label red center',1)+
img(1090,510,125,134,'llm.png','训练后的模型',1)+at(1240,545,245,'改变生成能力','label',1)
);}
R[2129]={steps:2,render(){return changes(false);}};
R[2130]={steps:3,render(){return wrap(
at(0,0,1490,'完成任务的经验，可以用于改进运行程序，也可以整理为训练材料。')+
svg(paper(10,175,345,304))+
at(35,204,290,'任务过程与反馈','h2')+at(35,277,290,'选择了哪个工具<br>怎样填写参数<br>怎样使用返回结果','label black')+
svg('<path d="M375 326 H460 V196 H546 M460 326 V489 H546" fill="none" stroke="#0070c0" stroke-width="3"/>')+
svg(paper(568,125,490,147)+arrow(1080,198,1160,198))+
at(596,153,436,'修改工具、提示与执行规则','label')+at(596,213,436,'运行程序得到改进','label red')+
img(1194,133,172,144,'app.png','修改后的运行程序')+
svg(paper(568,414,490,147)+arrow(1080,487,1160,487,red),1)+
at(596,440,436,'筛选材料，再进行训练','label',1)+at(596,500,436,'模型参数得到更新','label red',1)+
img(1213,416,130,140,'llm.png','经过训练的模型',1)+
svg(rule(607),2)+at(20,641,1460,'判断改进了什么，要看更新的是外部文件与程序，还是模型参数。','label strong',2)
);}};
R[2131]={steps:3,render(){return wrap(
at(0,0,1490,'固定任务、材料与检查标准，再比较不同模型和运行安排。')+
svg(paper(20,135,360,342))+
at(45,170,310,'相同起点','h2')+at(45,253,310,'经营资料与任务要求<br><br>可用工具<br><br>交付标准','label black')+
svg('<path d="M403 305 H455 V205 H515 M455 305 V434 H515" fill="none" stroke="#0070c0" stroke-width="3"/>')+
svg(paper(535,146,380,139)+paper(535,371,380,139))+
at(561,179,326,'模型A ＋ 运行安排','label center')+at(561,404,326,'模型B ＋ 运行安排','label center')+
svg(arrow(936,213,1037,213)+arrow(936,438,1037,438),1)+
at(1064,131,420,'同一组核对依据','h2',1)+
at(1075,221,400,'内容依据是否正确<br><br>文件是否可用<br><br>耗时与人工检查量','label',1)+
svg(rule(585),2)+at(20,621,1470,'按具体结果调整：保留有效支持，精简多余指导，补足需要的工具与检查。','label strong',2)
);}};
R[2132]={steps:1,render(){return systemMap(true);}};
R[2133]={steps:3,render(){return boundary(true);}};
R[2134]={steps:3,render(){return wrap(
at(0,0,1490,'理解一次Agent工作，把任务要求、生成过程与实际交付连起来看。')+
at(20,104,430,'1. LLM基础','h2')+at(530,104,430,'2. Prompting','h2',1)+at(1040,104,430,'3. Agents','h2',2)+
img(130,199,150,161,'llm.png','逐步生成内容')+
svg(paper(550,191,370,240),1)+at(580,211,310,'目标与受众<br><br>材料与约束<br><br>反馈与检查','label black',1)+
img(1077,205,155,130,'app.png','执行操作并返回结果',2)+img(1305,193,121,132,'doc.png','可检查的交付物',2)+
svg(arrow(1235,273,1288,273),2)+
at(20,474,430,'依据本次输入，<br>逐步生成内容。','txt')+at(530,474,430,'交代任务与材料，<br>把反馈写回输入。','txt',1)+at(1040,474,450,'组织执行与返回，<br>核对文件和操作结果。','txt',2)+
svg(rule(590),2)+
at(20,614,400,'Prompting组织输入','label center',2)+at(534,614,420,'LLM提出动作','label center',2)+at(1060,614,430,'工具执行并返回结果','label center',2)+
svg(arrow(432,635,510,635)+arrow(967,635,1042,635)+'<path d="M1371 662 V710 H220 V662 M210 676 L220 662 L230 676" fill="none" stroke="#0070c0" stroke-width="3"/>',2)+
at(430,662,680,'结果带回下一次输入，继续判断。','label strong center',2)
);}};
})();

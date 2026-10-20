(function(){'use strict';
const R=window.MBA_RENDERERS,{at,svg,arrow,paper,img,rule}=window.AGENT_VIS;
const blue='#003f98',light='#eaf2fb',red='#91251f';
const T=(x,y,w,t,cl='ao-text')=>at(x,y,w,t,cl),I=(x,y,w,h,f,alt)=>img(x,y,w,h,'agents-overview-r4/'+f,alt),W=h=>`<div class="ao">${h}</div>`;
const line=(d,c=blue)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`;
const node=(x,y,r=13)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${light}" stroke="${blue}" stroke-width="3"/>`;
function list(x,y,w=200,h=230){return paper(x,y,w,h)+[0,1,2].map((i)=>`<rect x="${x+23}" y="${y+35+i*((h-65)/3)}" width="25" height="25" fill="#fff" stroke="${blue}" stroke-width="2"/>${i<2?line(`M${x+27} ${y+47+i*((h-65)/3)} l7 7 l12 -17`):''}${line(`M${x+66} ${y+47+i*((h-65)/3)} h${w-91}`,'#8aa7c8')}`).join('');}
function map(x,y,w=260,h=180){return line(`M${x} ${y+h} V${y} L${x+w*.7} ${y+h} L${x+w} ${y} M${x} ${y+h} H${x+w*.7}`)+node(x,y)+node(x,y+h)+node(x+w*.7,y+h)+node(x+w,y);}
function net(x,y){const ns=[[0,40],[65,0],[65,80],[130,40]];return ns.slice(1).map(([a,b])=>line(`M${x} ${y+40} L${x+a} ${y+b}`)).join('')+line(`M${x+65} ${y} V${y+80} M${x+65} ${y} L${x+130} ${y+40} L${x+65} ${y+80}`)+ns.map(([a,b])=>node(x+a,y+b,15)).join('');}
R[5001]={steps:1,render:()=>W(
 T(0,0,1490,'把一部分工作交给外部系统，再看哪些做法能被模型学会。','ao-lead')+
 img(100,175,185,200,'llm.png','模型')+T(80,392,220,'模型','ao-head center')+
 img(1218,175,205,180,'app.png','外部系统')+T(1170,392,320,'外部系统','ao-head center')+
 svg(arrow(333,205,1165,205,blue)+arrow(1165,366,333,366,red))+
 T(385,91,730,'Externalization · 外化','ao-head center')+T(380,229,740,'在模型之外保存信息、提供方法、执行操作','ao-text center')+
 T(385,305,730,'Internalization · 内化','ao-head center')+T(380,390,740,'筛选外部经验，通过训练更新模型参数','ao-text center')+
 svg(rule(492))+
 T(0,535,450,'① 外部表示改变了什么？','ao-key')+T(0,589,450,'从清单与地图开始','ao-text')+
 T(518,535,476,'② 三个层次怎样分工？','ao-key')+T(518,589,476,'再看Agent的分工','ao-text')+
 T(1080,535,420,'③ 经验怎样进入训练？','ao-key')+T(1080,589,420,'最后区分外化与内化','ao-text')
)};
R[5002]={steps:1,render:()=>W(
 T(0,0,1490,'工具、信息、方法与运行安排，都可以从“哪些工作交给外部系统”来理解。','ao-lead')+
 I(100,100,1300,176,'review-heading.png','综述题目：Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering')+
 T(480,321,540,'模型之外的工作条件','ao-head center')+
 svg(line('M750 378 V415 M170 415 H1330 M170 415 V454 M550 415 V454 M945 415 V454 M1330 415 V454'))+
 [ ['Memory','保存信息'],['Skills','提供做法'],['Protocols','规定交互方式'],['Harness','组织整个运行过程'] ].map((a,i)=>T(i*385,477,345,a[0],'ao-head center')+T(i*385,544,345,a[1],'ao-text center')).join('')+
 T(0,657,1490,'先用熟悉的清单和地图，理解外部表示怎样帮助完成任务。','ao-key')
)};
R[5003]={steps:1,render:()=>W(
 T(0,0,1490,'认知工件：用来保存、展示或处理信息，帮助完成认知任务的外部物件。','ao-lead')+
 T(0,106,450,'清单：保存事项与状态','ao-head center')+T(525,106,450,'地图：显示位置与关系','ao-head center')+T(1050,106,450,'日历：按时间组织安排','ao-head center')+
 svg(list(115,197,220,258)+map(600,228,300,195)+`<rect x="1140" y="205" width="280" height="250" fill="#fff" stroke="${blue}" stroke-width="3"/>`+line('M1140 256 H1420 M1140 322 H1420 M1140 388 H1420 M1233 256 V455 M1326 256 V455')+`<rect x="1237" y="326" width="85" height="58" fill="${light}"/>`)+
 T(1160,214,240,'一　　二　　三','ao-text center')+T(1236,338,88,'会议','ao-small center')+
 T(25,492,400,'读取事项 → 检查完成情况','ao-text center')+T(550,492,400,'查看连线 → 判断路线','ao-text center')+T(1075,492,400,'查看时间 → 检查安排','ao-text center')+
 svg(rule(603))+T(0,644,1490,'信息变成可查看、可修改的对象，完成任务的动作也随之改变。','ao-key')
)};
R[5004]={steps:1,render:()=>W(
 T(0,0,1490,'事情相同；有了清单，完成任务时需要做的动作发生了变化。','ao-lead')+
 T(0,96,640,'没有清单：回忆要做的事','ao-head center')+T(865,96,640,'有了清单：读取记录、检查状态','ao-head center')+
 I(60,158,545,382,'list-recall.png','没有清单的人需要在脑中想起要做的事项')+I(915,158,510,382,'list-check.png','有清单的人查看已完成和待完成事项')+
 svg(arrow(668,345,826,345))+
 T(40,560,590,'需要自己想起有哪些事项。','ao-text center')+T(875,560,620,'查看哪些已完成，再处理未完成事项。','ao-text center')+
 T(0,659,1490,'清单保存事项，勾选保存状态；下次可以从已有记录继续。','ao-key')
)};
R[5005]={steps:1,render:()=>W(
 T(0,0,1490,'地图把位置与路线表示成可查看的关系，使用者据此判断怎样到达目的地。','ao-lead')+
 I(40,148,950,522,'map.png','四个位置通过路线连接；位置和路线分别用圆点和连线表示')+
 T(1070,184,400,'看位置','ao-head')+T(1070,246,400,'确认自己在哪里，<br>目的地在哪里。','ao-text')+
 T(1070,385,400,'看路线','ao-head')+T(1070,447,400,'沿连接关系判断<br>可以怎样到达。','ao-text')+
 T(0,670,1490,'清单让事项与状态可见；地图让空间关系可见。','ao-key')
)};
R[5006]={steps:1,render:()=>W(
 T(0,0,1490,'Agent把模型能力、这一次的输入，以及外部运行过程结合起来。','ao-lead')+
 T(0,103,550,'模型参数 Weights','ao-head')+T(0,160,550,'训练形成的能力，影响怎样生成。','ao-text')+
 T(0,277,550,'上下文 Context','ao-head')+T(0,334,550,'本次送入模型的任务、材料和历史。','ao-text')+
 T(0,460,550,'运行程序 Harness','ao-head')+T(0,517,550,'准备输入、调用模型与工具，<br>把结果带回后续输入。','ao-text')+
 svg(`<rect x="610" y="105" width="880" height="490" rx="10" fill="#f5f8fc" stroke="#7899c0" stroke-width="2.5"/>`)+T(639,126,790,'Harness：组织每一次生成与执行','ao-head')+
 svg(paper(645,246,205,170)+arrow(861,329,916,329))+
 T(658,266,176,'本次上下文','ao-key center')+T(661,323,170,'任务与材料<br>历史消息','ao-small center')+
 img(941,251,115,123,'llm.png','使用已训练参数进行生成的模型')+T(913,399,175,'模型参数','ao-text center')+
 svg(arrow(1080,329,1157,329))+img(1178,260,180,150,'app.png','工具执行')+T(1180,426,180,'工具执行','ao-text center')+
 svg(line('M1267 480 V541 H750 V444')+arrow(750,492,750,444))+T(849,549,456,'结果进入下一次上下文','ao-small center')+
 T(0,663,1490,'Prompting组织本次输入；Harness把生成、执行与反馈接成连续过程。','ao-key')
)};
R[5007]={steps:1,render:()=>W(
 T(0,0,1490,'外化把临时要完成的工作，变成可以读取、复用或共同遵循的对象。','ao-lead')+
 T(0,99,260,'外化什么','ao-key')+T(320,99,365,'原本的工作','ao-key')+T(817,99,332,'外部对象','ao-key')+T(1220,99,280,'使用方式','ao-key')+
 [ ['Memory','记住历史、偏好与进度','已保存的信息记录','读取相关记录'],['Skills','每次重新组织做法','流程、规则与检查方法','按任务复用做法'],['Protocols','临时猜测怎样交换信息','共同约定的请求与返回格式','按约定交换信息'] ].map((r,i)=>{const y=192+i*155;return T(0,y,290,r[0],'ao-head')+T(320,y,390,r[1])+svg(arrow(716,y+23,786,y+23)+paper(810,y-14,365,111))+T(834,y,314,r[2])+T(1217,y,283,r[3]);}).join('')+
 svg(rule(620))+T(0,662,1490,'Harness把这些对象组织到任务中：提供什么、何时读取、怎样调用与检查。','ao-key')
)};
R[5008]={steps:1,render:()=>W(
 T(0,0,1490,'工具负责执行；信息、方法和交互规则，支持模型提出请求并使用结果。','ao-lead')+
 svg(`<rect x="15" y="94" width="1470" height="555" rx="8" fill="#fff" stroke="#8aa7c8" stroke-width="2.5"/>`)+T(42,108,1380,'Harness：组织输入、模型调用、工具执行与结果检查','ao-head')+
 svg(paper(52,194,330,112)+paper(52,373,330,112))+T(75,209,285,'Memory：已保存的信息','ao-text')+T(75,388,285,'Skills：可复用做法','ao-text')+
 svg(line('M396 251 H433 V333 H480 M396 430 H433 V368 H480')+arrow(448,333,480,333)+arrow(448,368,480,368)+paper(498,271,220,154)+arrow(735,349,807,349))+
 T(517,294,180,'本次输入','ao-key center')+T(517,351,180,'任务与材料','ao-small center')+
 img(829,281,120,129,'llm.png','模型生成工具请求')+T(802,440,180,'模型','ao-text center')+
 svg(arrow(977,322,1170,322))+
 T(970,270,210,'调用请求','ao-small center')+
 img(1195,285,190,159,'app.png','工具完成查询计算与操作')+T(1182,462,220,'工具执行','ao-text center')+
 T(700,521,550,'Protocols：约定请求与返回怎样表达','ao-small center')+
 svg(line('M1280 513 V596 H609 V453')+arrow(609,500,609,453))+
 T(715,604,530,'执行结果 → 下一次输入','ao-small center')+T(0,668,1490,'工具调用把“提出操作”接到“实际执行”，执行结果再进入下一次输入。','ao-key')
)};
R[5009]={steps:1,render:()=>W(
 T(0,0,1490,'外部系统留下交互过程；经过筛选与训练，其中的做法可能进入模型参数。','ao-lead')+
 img(85,160,145,156,'llm.png','运行任务时的模型')+T(65,331,200,'模型','ao-head center')+
 svg(arrow(270,240,625,240))+T(280,169,340,'借助外部系统完成任务','ao-text center')+
 img(663,158,200,168,'app.png','外部系统执行任务')+T(631,342,266,'外部系统','ao-head center')+
 svg(arrow(890,240,1181,240)+paper(1213,158,250,179))+T(914,170,240,'留下记录','ao-text center')+T(1235,180,200,'请求<br>返回结果<br>后续处理','ao-text')+
 svg(line('M1335 354 V530 H1080',red)+arrow(1160,530,1080,530,red))+
 T(1053,411,250,'外部经验','ao-key center')+
 svg(paper(668,456,377,137)+arrow(644,527,310,527,red))+
 T(697,477,315,'筛选材料 → 训练','ao-key center')+T(697,533,315,'更新模型参数','ao-text center')+
 img(110,455,125,134,'llm.png','训练后的模型')+T(50,603,255,'训练后的模型','ao-text center')+
 T(338,565,280,'再用任务检查<br>学会了什么','ao-small center')+
 T(0,672,1490,'留下记录不会自动更新模型参数；参数更新发生在训练过程中。','ao-key')
)};
R[5010]={steps:1,render:()=>W(
 T(0,0,1490,'回到三个问题：外部表示的作用、Agent的分工，以及经验进入训练的路径。','ao-lead')+
 svg(list(33,111,120,149)+map(188,135,130,100))+
 T(389,116,1100,'① 外部表示改变了什么？','ao-head')+T(389,181,1100,'把事项、关系与状态放到眼前，转成读取与检查。','ao-text')+
 svg(net(48,341)+paper(226,320,110,119))+
 T(389,321,1100,'② 三个层次怎样分工？','ao-head')+T(389,386,1100,'模型生成，上下文提供本次材料，运行程序组织执行。','ao-text')+
 img(62,510,91,98,'llm.png','模型')+img(228,515,105,88,'app.png','外部系统')+svg(arrow(165,540,216,540)+arrow(216,581,165,581,red))+
 T(389,515,1100,'③ 经验怎样进入训练？','ao-head')+T(389,580,1100,'筛选交互过程，组织训练，再检查模型学会了什么。','ao-text')+
 svg(rule(648))+T(0,671,1490,'接下来：工具调用 → Memory → Skills → Harness → 回看外化与内化。','ao-key')
)};
})();

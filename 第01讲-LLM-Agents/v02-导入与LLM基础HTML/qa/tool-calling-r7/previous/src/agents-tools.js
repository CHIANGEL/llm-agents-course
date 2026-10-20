(function(){
'use strict';
const R=window.MBA_RENDERERS;
const {at,svg,arrow,paper,rule,wrap}=window.PROMPT_VIS;
const B='#003f98', A='#0070c0', RED='#c00000', PALE='#edf4fb';
const text=(x,y,w,t,step,cls='label')=>at(x,y,w,t,cls,step);
const line=(x1,y1,x2,y2,color='#a6bad3')=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="2" fill="none"/>`;
const box=(x,y,w,h,fill='#fff')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${B}" stroke-width="2.5"/>`;
const person=(x,y)=>`<circle cx="${x}" cy="${y}" r="26" fill="#fff" stroke="${B}" stroke-width="3"/><path d="M${x-51} ${y+94} Q${x-49} ${y+42} ${x} ${y+42} Q${x+49} ${y+42} ${x+51} ${y+94}" fill="${PALE}" stroke="${B}" stroke-width="3"/>`;
const cloud=(x,y)=>`<circle cx="${x+21}" cy="${y-13}" r="31" fill="#f7d576"/><path d="M${x-58} ${y+44} C${x-92} ${y+42} ${x-83} ${y} ${x-49} ${y+3} C${x-42} ${y-45} ${x+26} ${y-42} ${x+31} ${y+6} C${x+77} ${y-9} ${x+92} ${y+44} ${x+49} ${y+44} Z" fill="#fff" stroke="${B}" stroke-width="3"/>`;
const icon=(x,y,w,name,step)=>`<img class="at" src="assets/${name}.png" alt="" style="left:${x}px;top:${y}px;width:${w}px;height:${w}px;object-fit:contain"${step===undefined?'':` data-reveal="${step}"`}>`;
const underline=(x,y,w,color=RED)=>`<path d="M${x} ${y} h${w}" stroke="${color}" stroke-width="3"/>`;
function browser(x,y,w,h,focus=false){return box(x,y,w,h)+`<path d="M${x} ${y+57} H${x+w}" stroke="${B}" stroke-width="2"/><circle cx="${x+23}" cy="${y+27}" r="5" fill="${B}"/><circle cx="${x+43}" cy="${y+27}" r="5" fill="${B}"/><rect x="${x+78}" y="${y+13}" width="${w-100}" height="38" rx="5" fill="${focus?'#fff1ed':PALE}" stroke="${focus?RED:'#9cb7d6'}" stroke-width="${focus?'3':'1.5'}"/><path d="M${x+32} ${y+94} H${x+w-32} M${x+32} ${y+116} H${x+w-90} M${x+32} ${y+139} H${x+w-60}" stroke="#b9cce2" stroke-width="6"/>`;}
function loop(summary=false){return wrap(
text(0,0,1490,summary?'模型决定下一步，外部程序完成操作，结果成为新的输入。':'工具调用把“生成请求”和“执行操作”接成一个闭环。',undefined,'txt')+
text(0,99,395,'模型',undefined,'h2 center')+text(543,99,395,'应用',1,'h2 center')+text(1080,99,395,'工具',1,'h2 center')+
icon(123,168,145,'llm')+icon(663,168,145,'app',1)+icon(1203,168,145,'tool',1)+
svg(arrow(323,238,605,238),1)+text(345,178,245,'提出调用',1,'label center')+
svg(arrow(863,238,1145,238),1)+text(885,178,245,'分发与执行',1,'label center')+
text(20,346,350,summary?'用新结果继续判断':'任务＋当前材料',undefined,'label center')+
text(558,346,350,summary?'连接请求与执行程序':'找到对应的执行程序',1,'label center')+
text(1096,346,350,summary?'取得资料或改变系统':'读取、计算或操作',1,'label center')+
svg(`<path d="M1274 414 V483 H197 V414" fill="none" stroke="${A}" stroke-width="3"/>`+arrow(197,450,197,414),2)+
text(439,503,620,'返回结果 → 加入下一次输入',2,'h2 center')+
svg(rule(588),2)+text(20,619,1460,summary?'一次天气查询、客户工单与界面操作，都要把结果带回判断。':'本节沿同一闭环看：天气查询 → 客户工单 → 多步反馈 → 界面操作。',2,'txt strong'));}
R[2052]={steps:3,render(){return loop(false);}};
R[2053]={steps:3,render(){return wrap(
text(0,0,1490,'一次调用：先看请求怎样变成外部执行，再看结果怎样回到模型。',undefined,'txt')+
text(20,92,1440,'纽约现在天气怎么样？',undefined,'h2')+
text(20,184,645,'生成查询建议',undefined,'h2')+text(810,184,660,'取得天气材料',1,'h2')+
svg(paper(20,256,640,224))+text(58,292,557,'“可以查询天气服务，<br>查看纽约的温度与天气状况。”',undefined,'txt black')+
svg(paper(810,256,640,224),1)+text(848,290,560,'查询请求 → 工具执行',1,'txt strong')+text(848,378,560,'纽约 · 72°F · 局部多云',1,'txt black')+
svg(arrow(693,367,779,367),1)+text(15,524,660,'产生了文字',undefined,'label center')+text(810,524,640,'新增了外部返回材料',1,'label center')+
svg(rule(600),2)+text(20,628,1460,'接下来拆开：工具说明 → 调用请求 → 外部执行 → 结果回到输入。',2,'txt strong'));}};
R[2054]={steps:3,render(){return wrap(
text(0,0,1490,'工具的名称、用途和所需信息，一起告诉模型怎样提出调用。',undefined,'txt')+
svg(paper(20,108,700,154))+text(54,138,626,'用户问题',undefined,'h2')+text(54,195,626,'纽约现在天气怎么样？',undefined,'label black')+
svg(paper(20,306,700,278),1)+text(54,340,630,'工具说明',1,'h2')+text(54,404,630,'名称：get_weather<br>用途：查询地点天气<br>需要：location（地点）',1,'label black')+
svg(arrow(750,186,927,308)+arrow(750,447,927,350),2)+icon(1044,214,178,'llm',2)+text(938,438,490,'本次模型输入',2,'h2 center')+
text(900,506,570,'问题＋工具说明',2,'txt center')+svg(rule(627),2)+text(20,652,1460,'有了可用工具的说明，模型才有依据生成对应的调用请求。',2,'label strong'));}};
R[2055]={steps:3,render(){return wrap(
text(0,0,1490,'调用请求要把“做什么”和“对什么做”交给应用。',undefined,'txt')+
icon(35,190,165,'llm')+text(10,381,225,'模型',undefined,'h2 center')+
svg(paper(289,137,600,329))+text(323,171,535,'调用请求',undefined,'h2')+text(323,252,530,'工具：get_weather',undefined,'txt black')+text(323,334,530,'地点：New York',1,'txt black')+
svg(arrow(218,278,266,278))+svg(underline(430,302,290)+underline(430,385,260),1)+
svg(arrow(919,278,1075,278),2)+icon(1120,189,165,'app',2)+text(1070,382,290,'应用接收请求',2,'h2 center')+
svg(rule(538),2)+text(30,577,1430,'工具名用来选择执行程序；地点作为这次执行的输入。',2,'txt strong')+
text(30,651,1430,'请求中的字段，必须对应工具说明要求的信息。',2,'label'));}};
R[2056]={steps:3,render(){return wrap(
text(0,0,1490,'应用把请求交给工具，工具从数据来源取得结果。',undefined,'txt')+
text(0,101,430,'1. 执行请求',undefined,'h2 center')+text(525,101,430,'2. 读取资料',1,'h2 center')+text(1051,101,430,'3. 返回天气',2,'h2 center')+
icon(137,192,145,'tool')+text(20,390,390,'get_weather<br>地点：New York',undefined,'label center')+
svg(arrow(340,263,535,263),1)+svg(paper(571,179,341,275),1)+text(594,208,294,'weather_fixture<br>.json',1,'label center')+text(596,334,289,'New York<br>72°F / Partly cloudy',1,'p-small center')+
svg(arrow(944,263,1111,263),2)+svg(cloud(1271,236),2)+text(1101,359,348,'72°F',2,'p-big center')+text(1101,424,348,'局部多云',2,'h2 center')+
svg(rule(559),2)+text(30,602,1440,'这一步执行了读取：数据从文件进入工具返回，再交给应用。',2,'txt strong'));}};
R[2057]={steps:4,render(){return wrap(
text(0,0,1490,'应用追加本次调用与工具返回，再让模型继续生成。',undefined,'txt')+
svg(paper(13,96,711,506))+text(45,127,636,'已有消息',undefined,'h2')+text(45,187,636,'回答要求＋纽约天气问题',undefined,'label black')+
svg(line(43,257,690,257),1)+text(45,283,636,'本次调用',1,'h2')+text(45,342,636,'get_weather · New York',1,'label black')+
svg(line(43,410,690,410),2)+text(45,437,636,'工具返回',2,'h2')+text(45,496,636,'72°F · Partly cloudy',2,'label black')+
svg(arrow(751,331,884,331),2)+icon(937,193,164,'llm',2)+text(888,389,269,'再次生成',2,'h2 center')+
svg(paper(1199,204,283,289),3)+text(1221,249,235,'纽约气温<br><span class="red">72°F</span>，<br><span class="red">局部多云</span>。',3,'label black')+svg(arrow(1122,331,1178,331),3)+
text(20,641,1460,'已有任务继续保留；新取得的材料成为这次回答的依据。',3,'txt strong'));}};
R[2058]={steps:3,render(){return wrap(
text(0,0,1490,'两次模型生成，中间发生一次工具执行。',undefined,'txt')+
svg(line(95,270,1402,270))+
icon(62,170,145,'llm')+text(0,340,270,'生成调用',undefined,'h2 center')+text(0,410,270,'工具＋地点',undefined,'label center')+
icon(369,185,115,'app',1)+text(302,340,250,'应用分发',1,'h2 center')+
icon(649,170,145,'tool',1)+text(595,340,260,'执行读取',1,'h2 center')+text(595,410,260,'天气资料',1,'label center')+
icon(955,185,115,'app',2)+text(888,340,250,'结果加入输入',2,'h2 center')+
icon(1238,170,145,'llm',2)+text(1173,340,290,'生成回答',2,'h2 center')+text(1173,410,290,'依据工具结果',2,'label center')+
svg(`<path d="M125 508 V543 H1312 V508" fill="none" stroke="${RED}" stroke-width="3"/>`,2)+text(416,565,690,'生成 → 执行 → 带着结果继续生成',2,'h2 center')+
text(18,655,1460,'模型给出请求与回答；程序负责取得资料或改变外部系统。',2,'label strong'));}};
R[2059]={steps:3,render(){return wrap(
text(0,0,1490,'客户反馈 → 建立问题记录 → 后续跟进。',undefined,'txt')+
svg(person(150,214))+text(25,356,255,'客户报告问题',undefined,'h2 center')+
svg(arrow(245,269,548,269),1)+text(300,202,220,'客服对话',1,'label center')+
svg(box(590,159,330,227,PALE),1)+text(620,198,270,'Intercom',1,'h2 center')+text(620,261,270,'Fin',1,'p-big center')+
svg(arrow(944,269,1110,269),1)+svg(paper(1142,151,316,261),1)+text(1167,181,260,'Linear',1,'h2 center')+text(1168,264,260,'问题记录',1,'txt center')+
svg(`<path d="M151 447 V490 H1298 V447" fill="none" stroke="#7f9bc1" stroke-width="3"/>`,2)+
text(195,534,1110,'Fin 可以把客户报告的问题登记为 Linear 工单。',2,'txt strong center')+
text(150,626,1200,'先有客户材料，再有业务系统中的可跟进对象。',2,'label center'));}};
R[2060]={steps:3,render(){return wrap(
text(0,0,1490,'把客户材料、操作请求和业务记录放在三个不同位置。',undefined,'txt')+
svg(rule(195,230,1480)+rule(394,230,1480)+rule(595,230,1480))+
text(0,111,205,'客户对话',undefined,'h2')+text(0,291,205,'Agent<br>与应用',1,'h2')+text(0,492,205,'业务系统',2,'h2')+
svg(paper(266,90,477,89))+text(292,114,424,'客户报告的问题',undefined,'label black')+
svg(arrow(505,211,505,272),1)+svg(box(267,286,477,83,PALE),1)+text(293,308,423,'提出创建问题记录的请求',1,'label')+
svg(arrow(768,328,935,328),1)+text(960,303,500,'程序调用已连接的系统',1,'label')+
svg(arrow(1198,376,1198,471),2)+svg(paper(948,490,530,83),2)+text(975,512,465,'保存问题记录，返回结果',2,'label')+
svg(`<path d="M922 531 H835 V366" stroke="${A}" stroke-width="3" fill="none"/>`+arrow(835,410,835,366),2)+
text(262,638,1216,'请求说明要执行的动作；系统返回说明动作完成到了哪里。',2,'txt strong'));}};
R[2061]={steps:3,render(){return wrap(
text(0,0,1490,'创建记录与解决问题，分别对应不同的完成条件。',undefined,'txt')+
svg(line(118,272,1395,272))+
svg('<circle cx="150" cy="272" r="15" fill="#003f98"/><circle cx="580" cy="272" r="15" fill="#003f98"/>')+
text(19,157,263,'客户报告',undefined,'h2 center')+text(414,157,330,'问题记录建立',undefined,'h2 center')+
svg(paper(398,339,365,143))+text(422,369,316,'检查系统返回<br>或查询对应记录',undefined,'label center')+
svg('<circle cx="1011" cy="272" r="15" fill="#fff" stroke="#003f98" stroke-width="3"/><circle cx="1393" cy="272" r="15" fill="#fff" stroke="#003f98" stroke-width="3"/>',1)+
text(851,157,320,'问题修复',1,'h2 center')+text(1210,157,281,'客户确认',1,'h2 center')+
text(840,351,640,'修复结果、客户反馈<br>提供后续完成的依据',1,'label center')+
svg(rule(546),2)+text(30,585,1440,'客户材料 → 创建请求 → 系统记录：工具调用把对话接到业务动作。',2,'txt strong')+
text(30,659,1440,'判断完成到哪一步，回到本次任务要求和相应结果。',2,'label'));}};
R[2062]={steps:3,render(){return wrap(
text(0,0,1490,'多步行动：每取得一份新结果，都要重新判断下一步。',undefined,'txt')+
svg(paper(15,149,349,240))+text(44,183,288,'任务与材料',undefined,'h2 center')+text(44,260,288,'目标<br>当前已知条件',undefined,'label center')+
svg(arrow(388,267,496,267))+icon(529,180,170,'llm')+text(505,392,221,'判断',undefined,'h2 center')+
svg(arrow(728,267,896,267),1)+text(753,211,130,'足够',1,'label center')+svg(paper(925,167,538,177),1)+text(956,202,471,'组织交付并结束',1,'h2 center')+
svg(arrow(614,438,614,493),2)+text(644,444,318,'缺少关键材料',2,'label')+
svg(box(438,526,395,89,PALE),2)+text(469,551,337,'补充读取或查询',2,'label center')+
svg(`<path d="M412 571 H187 V418" fill="none" stroke="${A}" stroke-width="3"/>`+arrow(187,455,187,418),2)+text(23,625,344,'新结果进入下一轮',2,'label center')+
text(907,471,558,'继续还是结束，<br>由结果与任务要求共同决定。',2,'txt strong'));}};
R[2063]={steps:3,render(){return wrap(
text(0,0,1490,'反馈指出缺少的信息，再回到已有材料寻找依据。',undefined,'txt')+
text(20,99,1430,'原问题：<span class="red">纽约</span>现在天气怎么样？',undefined,'h2')+
svg(paper(18,214,570,264))+text(49,246,508,'调用请求',undefined,'h2')+text(49,321,508,'工具：get_weather<br>地点：',undefined,'label black')+svg(underline(151,417,365))+
svg(arrow(616,347,748,347),1)+text(614,274,140,'检查参数',1,'label center')+
svg(box(779,214,680,105,'#fff1ed'),1)+text(816,247,601,'反馈：缺少地点',1,'h2 red')+
svg(paper(779,365,680,146),2)+text(815,397,597,'修正请求：地点 New York',2,'label black')+
svg(`<path d="M133 171 V187 H1480 V438" fill="none" stroke="${A}" stroke-width="2.5"/>`+arrow(1480,438,1459,438),2)+
text(20,570,1440,'缺少地点 → 对照原问题 → 补上地点 → 再交给程序执行。',2,'txt strong')+
text(20,651,1440,'错误反馈也是新材料；修正要有原任务或新信息作依据。',2,'label'));}};
R[2064]={steps:3,render(){return wrap(
text(0,0,1490,'把任务拆成地点、内容与时点，逐项对应返回材料。',undefined,'txt')+
text(20,105,1440,'纽约｜现在｜天气怎么样？',undefined,'h2')+
text(30,193,398,'任务要求',undefined,'h2')+text(558,193,503,'天气返回',undefined,'h2')+text(1110,193,368,'检查依据',undefined,'h2')+
svg(rule(247)+rule(350)+rule(453)+rule(556))+
text(30,278,390,'地点：纽约',undefined,'label')+text(558,278,495,'New York',undefined,'label black')+text(1110,278,366,'地点对应',undefined,'label')+
text(30,380,390,'内容：天气情况',1,'label')+text(558,380,495,'72°F · Partly cloudy',1,'label black')+text(1110,380,366,'内容对应',1,'label')+
text(30,482,390,'时点：现在',2,'label')+text(558,482,495,'未包含观测时间',2,'label red')+text(1110,482,366,'补查后核对时效',2,'label')+
svg(arrow(428,303,523,303)+arrow(428,405,523,405),1)+svg(arrow(428,507,523,507),2)+
text(30,612,1440,'工具有返回，接着还要检查：对象、内容和时效是否满足任务。',2,'txt strong'));}};
R[2065]={steps:3,render(){return wrap(
text(0,0,1490,'多步反馈的小结：有依据地修改，再按完成条件决定去向。',undefined,'txt')+
text(0,116,462,'1. 看新结果',undefined,'h2 center')+text(522,116,462,'2. 对照原任务',1,'h2 center')+text(1041,116,462,'3. 选择下一步',2,'h2 center')+
svg(paper(37,202,388,237))+text(66,242,329,'取得天气<br>或缺少地点的反馈',undefined,'label center')+
svg(arrow(449,315,552,315),1)+svg(paper(579,202,349,237),1)+text(606,242,292,'地点是否一致<br>信息是否够用<br>时点是否合适',1,'label center')+
svg(arrow(952,315,1060,315),2)+svg(`<path d="M1075 310 H1120 V222 H1161 M1120 310 H1161 M1120 310 V400 H1161" fill="none" stroke="${A}" stroke-width="3"/>`,2)+
text(1175,192,300,'交付并结束',2,'label')+text(1175,280,300,'补充查询',2,'label')+text(1175,370,300,'修正请求',2,'label')+
svg(rule(534),2)+text(50,586,1400,'行动 → 反馈 → 判断 → 下一步',2,'p-big center')+
text(40,659,1420,'计划给出方向；每一步返回的材料决定怎样继续。',2,'label center'));}};
function cuLoop(summary){return wrap(
text(0,0,1490,summary?'当前观察提供动作依据，工具执行以后，再用新观察核对目标。':'Computer Use（计算机操作）：通过工具观察并操作软件界面。',undefined,'txt')+
text(0,110,330,'观察',undefined,'h2 center')+text(393,110,330,'选择动作',1,'h2 center')+text(785,110,330,'执行',1,'h2 center')+text(1178,110,325,'重新观察',2,'h2 center')+
svg(browser(10,206,310,205))+svg(arrow(342,307,420,307),1)+icon(470,222,145,'llm',1)+
svg(arrow(690,307,812,307),1)+icon(861,222,145,'tool',1)+
svg(arrow(1083,307,1193,307),2)+svg(browser(1207,206,285,205,true),2)+
text(10,458,310,'当前界面',undefined,'label center')+text(414,458,310,summary?'模型选择动作':'点击或输入',1,'label center')+text(807,458,310,summary?'工具执行操作':'程序操作',1,'label center')+text(1197,458,305,'新界面与状态',2,'label center')+
svg(`<path d="M1349 520 V569 H557 V520" fill="none" stroke="${A}" stroke-width="3"/>`+arrow(557,548,557,520),2)+text(600,595,667,summary?'观察 → 选择 → 执行 → 新观察':'根据新观察决定继续或结束',2,'h2 center'));}
R[2066]={steps:3,render(){return cuLoop(false);}};
R[2067]={steps:3,render(){return wrap(
text(0,0,1490,'同一软件界面，可以通过结构信息或截图进入模型输入。',undefined,'txt')+
text(20,105,650,'界面结构：有哪些可操作对象',undefined,'h2')+svg(paper(20,177,660,280))+
text(56,212,585,'浏览器窗口<br>　地址栏：输入框<br>　返回：按钮<br>　页面内容：文档区域',undefined,'label black')+
text(811,105,660,'界面截图：对象在什么位置',1,'h2')+svg(browser(816,177,651,280),1)+text(918,188,512,'地址栏',1,'p-small')+
svg(arrow(352,479,615,565)+arrow(1135,479,874,565),2)+text(560,578,390,'本次观察',2,'p-big center')+
text(20,656,1460,'界面结构提供对象与属性，截图提供位置与视觉状态。',2,'label strong'));}};
R[2068]={steps:3,render(){return wrap(
text(0,0,1490,'根据当前观察提出动作，由工具程序实际操作界面。',undefined,'txt')+
svg(browser(15,130,628,327))+text(125,141,486,'地址栏',undefined,'p-small')+
svg(`<path d="M358 209 L358 154 L397 190 L375 189 L365 213 Z" fill="${RED}"/>`)+text(28,492,610,'当前目标：地址栏',undefined,'h2 center')+
svg(arrow(668,294,790,294),1)+svg(paper(825,167,629,204),1)+text(857,203,560,'动作请求：点击地址栏',1,'h2')+text(857,279,560,'目标来自刚取得的界面观察',1,'label')+
svg(arrow(1139,396,1139,466),2)+text(853,503,583,'工具执行点击',2,'h2 center')+
svg(rule(603),2)+text(20,637,1460,'模型选择动作与目标；工具把动作交给软件或操作系统。',2,'txt strong'));}};
R[2069]={steps:3,render(){return wrap(
text(0,0,1490,'操作后重新读取状态，确认变化是否符合当前目标。',undefined,'txt')+
text(20,104,640,'点击前',undefined,'h2')+text(814,104,640,'重新观察',1,'h2')+
svg(browser(20,180,630,295))+text(132,191,491,'地址栏',undefined,'p-small')+
svg(arrow(677,324,782,324),1)+svg(browser(818,180,631,295,true),1)+text(928,191,493,'地址栏',1,'p-small')+svg(`<path d="M1410 194 V224" stroke="${RED}" stroke-width="3"/>`,1)+
text(32,505,616,'观察可操作对象与当前位置',undefined,'label center')+text(830,505,609,'检查焦点、内容与页面状态',1,'label center')+
svg(rule(588),2)+text(22,624,1450,'请求发出 → 执行 → 新观察 → 核对目标 → 决定下一步。',2,'txt strong'));}};
R[2070]={steps:3,render(){return cuLoop(true);}};
R[2071]={steps:3,render(){return loop(true);}};
R[2072]={steps:3,render(){return wrap(
text(0,0,1490,'本次工具执行结束后，后续任务还可能需要已确认的信息。',undefined,'txt')+
text(10,108,450,'本次工作',undefined,'h2 center')+svg(paper(20,194,430,281))+
text(57,233,356,'任务要求<br>工具返回<br>已完成的动作',undefined,'txt black')+
svg(arrow(473,335,589,335),1)+svg(paper(618,235,298,196),1)+text(645,270,243,'以后需要的<br>信息',1,'h2 center')+
svg(arrow(942,335,1058,335),2)+svg(paper(1087,194,390,281),2)+text(1118,233,321,'下次任务<br>＋<br>取回的信息',2,'txt black center')+
text(483,265,101,'保存',1,'label center')+text(953,265,101,'取回',2,'label center')+
svg(rule(551),2)+text(40,597,1425,'Memory：保存以后会用到的信息，在合适的任务中重新取回。',2,'txt strong'));}};
})();

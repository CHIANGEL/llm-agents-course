(function(){
'use strict';
const R=window.MBA_RENDERERS,{at,svg,arrow,paper,rule,wrap}=window.PROMPT_VIS;
const B='#003f98',RDC='#c00000',L='#c5d4e5';
const reg=(p,steps,render)=>R[2000+p]={steps,render:s=>wrap(render(s))};
const line=(x1,y1,x2,y2,color=L)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3"/>`;
const store=(x,y,w,h)=>`<path d="M${x} ${y+24}V${y+h-24}C${x} ${y+h+8} ${x+w} ${y+h+8} ${x+w} ${y+h-24}V${y+24}" fill="#f3f8fd" stroke="${B}" stroke-width="3"/><ellipse cx="${x+w/2}" cy="${y+24}" rx="${w/2}" ry="24" fill="#fff" stroke="${B}" stroke-width="3"/>`;
const chat=(x,y,w,h)=>`<path d="M${x} ${y}H${x+w}V${y+h-22}H${x+55}L${x+23} ${y+h}V${y+h-22}H${x}Z" fill="#f8fbff" stroke="${B}" stroke-width="3"/>`;
function memMap(summary){return svg(chat(20,160,350,225)+store(570,150,330,240)+paper(1100,160,380,225)+arrow(386,265,552,265)+arrow(916,265,1083,265)+`<path d="M1290 400V544H738V408" fill="none" stroke="${B}" stroke-width="3"/>`+arrow(738,408,738,391))+
at(20,0,1460,summary?'记忆的作用，是让后续任务取得适用的信息。':'Agents / Memory：保存 → 取回 → 更新','txt')+
at(40,180,310,'过去会话','h2 center')+at(46,252,300,summary?'留下以后需要的<br>偏好、事实与决定':'哪些信息值得<br>留给以后？','txt center',0)+
at(590,203,290,'外部记录','h2 center')+at(596,277,278,'摘要 · 详细文件<br>对象 · 时间 · 范围','label center',1)+
at(1122,183,338,'本次输入','h2 center')+at(1125,261,330,summary?'当前目标<br>＋适用的历史信息':'当前任务到来时<br>按需要取回','txt center',1)+
at(399,209,145,'保存','label center')+at(938,209,145,'取回','label center',1)+at(845,488,435,summary?'变化了：更新记录':'新的信息：更新记录','txt',2)+
at(35,610,1420,summary?'留下信息、读入输入、判断适用性，三个环节共同决定记忆怎样发挥作用。':'先看文件怎样被读回，再看客服连续性，最后看记录更新与当前用途。','txt',2);}
reg(74,3,()=>memMap(false));
function readMap(summary){return svg(paper(30,160,380,255)+paper(565,160,380,255)+paper(1100,160,370,255)+arrow(427,285,548,285)+arrow(962,285,1083,285)+rule(505))+
at(25,0,1450,summary?'“已经保存”和“这次取得了什么”，要分别定位。':'保存与取回：沿着文件、读取、输入，查看同一份信息。','txt')+
at(52,182,335,'磁盘上的记录','h2 center')+at(55,267,325,'记忆摘要<br>＋详细文件入口','label center')+
at(586,182,335,'读取文件','h2 center',1)+at(590,267,325,'提出读取 → 工具执行<br>→ 返回内容','label center',1)+
at(1120,182,330,'本次输入','h2 center',2)+at(1120,267,330,'当前任务<br>＋已取得的内容','label center',2)+
at(30,550,1430,summary?'摘要提供要点和入口；读取取得内容；内容进入后续输入，才参与后续生成。':'接下来打开记忆摘要，沿路径读取详细记录，再观察文件更新后的变化。','txt',2);}
reg(75,3,()=>readMap(false));
reg(76,3,()=>svg(paper(610,90,870,420)+line(70,138,70,435)+line(70,175,113,175)+line(70,280,113,280)+line(132,315,132,435)+line(132,353,174,353)+line(132,420,174,420)+arrow(520,180,591,180))+at(20,0,1450,'摘要同时保存两类内容：可以直接使用的信息，以及详细记录的入口。','txt')+
at(20,95,560,'memories_v2/','label')+at(123,154,460,'memory_summary.md','label')+at(123,259,460,'rollout_summaries/','label')+at(185,332,390,'style.md','label',1)+at(185,399,390,'scope.md','label red',2)+
at(638,113,790,'memory_summary.md','label')+at(638,180,790,'沿用教师措辞与固定样式；<br>每页适量，复杂内容分步讲。','txt',1)+
at(638,306,790,'style.md：需要具体版式、措辞时读。<br>scope.md：核对讲解范围。','label',2)+
at(40,559,1430,'摘要里的路径指向详细文件；路径本身不能代替文件中的内容。','txt',2));
reg(77,4,s=>svg(paper(20,100,440,370)+paper(580,100,420,370)+paper(1100,100,380,370)+arrow(476,276,562,276)+arrow(1014,276,1083,276)+rule(540))+
at(40,120,400,'当前任务与摘要','h2 center')+at(45,203,385,'需要核对<br>历史决定的范围','txt center')+at(45,348,385,'入口：scope.md','label center')+
at(600,120,380,'读取 scope.md','h2 center',1)+at(608,208,365,s<2?'模型提出读取<br>工具打开文件':'“这项决定针对第一讲，<br>不是后续所有专题的<br>内容上限。”','label',1)+
at(1120,120,340,'后续输入','h2 center',3)+at(1125,208,330,'当前任务<br>＋原有摘要<br>＋详细范围','txt center',3)+
at(30,580,1440,s<3?'从摘要中的入口，取得范围说明的正文。':'回答结合当前要求和详细范围，确定这次讲解应怎样展开。','txt',2));
reg(78,3,s=>{const fresh=s===2;return svg(paper(30,105,610,370)+paper(860,105,610,370)+arrow(662,292,838,292,s===1?L:B)+rule(540))+
at(30,0,1440,'文件与输入位于不同位置，更新也发生在不同时间。','txt')+at(60,126,550,'磁盘文件','h2 center')+at(890,126,550,'已组装的输入','h2 center')+
at(80,220,510,s===0?'读取时的内容':'文件已经修改','txt center')+at(80,315,510,s===0?'版本 A':'版本 B','p-number center '+(s>0?'red':''))+
at(910,220,510,fresh?'重新取得的内容':'上次读取的内容','txt center')+at(910,315,510,fresh?'版本 B':'版本 A','p-number center '+(fresh?'red':''))+
at(667,229,165,s===1?'等待读取':'读取','label center')+at(30,580,1440,s===0?'第一次读取：把文件当时的内容加入输入。':s===1?'随后修改磁盘文件，已经组装的输入仍保留版本 A。':'再次读取或加入更新内容后，后续输入才取得版本 B。','txt');});
reg(79,3,()=>readMap(true));
function awsMap(summary){return svg(chat(30,150,400,240)+store(565,145,360,250)+chat(1060,150,410,240)+arrow(447,270,546,270)+arrow(942,270,1042,270)+rule(478))+
at(25,0,1450,summary?'把当前问题与有关历史一起交给客服 Agent。':'AWS 电子产品客服：两次会话之间，用记忆延续背景。','txt')+
at(54,174,350,'前次会话','h2 center')+at(60,250,340,'表达偏好<br>说明设备问题','txt center')+
at(585,202,320,'客户记忆','h2 center',1)+at(595,278,300,'偏好与事实','txt center',1)+
at(1082,174,365,'本次会话','h2 center',2)+at(1092,250,345,'新的问题<br>＋有关背景','txt center',2)+
at(35,535,1420,summary?'先保存后续需要的背景，再按客户和当前问题取回。':'先看保存什么，再看怎样取回，最后把背景加入当前请求。','txt',2);}
reg(80,3,()=>awsMap(false));
reg(81,3,()=>svg(chat(30,100,605,250)+store(850,90,620,355)+arrow(655,245,831,245)+rule(506))+
at(52,122,555,'竞技射击游戏','h2')+at(58,210,550,'客户重视耳机的<br><span class="red">低延迟</span>。','p-big')+
at(875,154,560,'客户偏好','h2',1)+at(880,227,550,'用途：竞技射击游戏<br>偏好：低延迟','txt',1)+at(880,350,550,'有关事实：曾报告的设备问题','label',2)+
at(35,555,1430,'会话中值得延续的信息，整理为后续可以检索的偏好与事实。','txt',2));
reg(82,3,()=>svg(store(30,100,410,280)+paper(635,100,835,395)+arrow(457,270,616,270)+rule(553))+
at(50,155,370,'该客户的记忆','h2 center')+at(60,243,350,'竞技射击游戏<br>重视低延迟','txt center')+
at(660,122,780,'本次请求','h2')+at(665,202,775,'“推荐哪一款耳机？”','p-big')+at(665,303,775,'取回背景：游戏用途、低延迟偏好','txt',1)+at(665,401,775,'当前问题 ＋ 相关历史 → 模型','txt red',2)+
at(35,590,1430,'取回以客户和当前问题为线索，让后续服务取得有关背景。','txt',2));
reg(83,3,()=>awsMap(true));
function useMap(summary){return svg(paper(25,155,400,245)+`<path d="M740 145L885 277L740 410L595 277Z" fill="#fff" stroke="${B}" stroke-width="3"/>`+paper(1065,155,410,245)+arrow(441,277,579,277)+arrow(1048,277,901,277)+arrow(740,410,740,465)+rule(495))+
at(25,0,1440,summary?'取回以后，还要检查信息的时间与用途。':'更新与适用性：旧记录是否仍然成立、是否适合当前目标？','txt')+
at(45,178,360,'旧记录','h2 center')+at(55,265,340,'过去的偏好<br>与事实','txt center')+
at(657,238,165,'本次<br>适用？','txt center',1)+at(815,426,480,'更新记录／调整采用','label',2)+at(1084,178,370,'当前任务','h2 center',2)+at(1095,265,350,'新的信息<br>＋当前用途','txt center',2)+
at(35,539,1430,summary?'变化了，就更新记录；仍正确但用途不同，就调整本次采用方式。':'先看偏好发生变化，再看偏好仍成立、但这次用途已经改变。','txt',2);}
reg(84,3,()=>useMap(false));
reg(85,3,s=>svg(line(80,500,1415,500,B)+arrow(1415,500,1465,500)+`<circle cx="250" cy="500" r="10" fill="${B}"/><circle cx="1110" cy="500" r="10" fill="${RDC}"/>`+paper(30,120,620,270)+paper(850,120,620,270)+arrow(670,255,830,255))+
at(40,0,1420,'Kendra 的偏好发生变化：先前喜欢 Adidas，后来转而喜欢 Puma。','txt')+at(50,145,580,'较早的记录','h2 center')+at(70,235,540,'Kendra → 喜欢 → Adidas','txt center')+
at(870,145,580,'新的消息','h2 center',1)+at(890,231,540,'Adidas 鞋坏了<br>现在喜欢 Puma','txt center',1)+
at(30,421,630,s<2?'':'旧关系失效，保留历史','label center',2)+at(850,421,620,'加入新的偏好关系','label center',2)+at(20,554,1440,'记录变化内容与适用时间，后续按当前有效的信息回答。','txt',2));
reg(86,3,()=>svg(arrow(495,337,995,337,L)+rule(519))+
at(20,0,1460,'当前想在午休时放松；过去曾用强节奏音乐保持清醒。','txt')+
at(20,87,640,'当前请求：午休放松','h2 center')+at(845,87,640,'过去偏好：保持清醒','h2 center',1)+
`<div class="at" style="left:94px;top:168px;width:470px;height:220px;overflow:hidden"><img src="assets/agents-memory/music.png" alt="戴耳机午休的人" style="position:absolute;width:2090px;max-width:none;left:-262px;top:-510px"></div>`+
`<div class="at" data-reveal="1" style="left:902px;top:168px;width:470px;height:220px;overflow:hidden"><img src="assets/agents-memory/music.png" alt="强节奏音乐耳机" style="position:absolute;width:2090px;max-width:none;left:-1370px;top:-510px"></div>`+
at(600,263,300,'同属音乐','txt center',1)+at(45,444,580,'用途：放松','txt red center')+at(875,444,580,'用途：保持清醒','txt center',1)+
at(30,560,1435,'这次根据“放松”选择音频；暂不采用旧偏好，也不必删除那条记录。','txt',2));
reg(87,3,()=>useMap(true));
reg(88,3,()=>memMap(true));
})();

(function(){
'use strict';
const R=window.MBA_RENDERERS, V=window.PROMPT_VIS;
const {at,svg,arrow,paper,rule,wrap}=V;
const BLUE='#003f98', AUX='#0070c0', RED='#c00000';
function financialTable(){return `<table class="p-table"><thead><tr><th>项目／万元</th><th class="num">2024</th><th class="num">2025</th></tr></thead><tbody><tr><td>营业收入</td><td class="num">1,000</td><td class="num">1,200</td></tr><tr><td>营业成本</td><td class="num">800</td><td class="num">900</td></tr><tr><td>销售费用</td><td class="num">90</td><td class="num">180</td></tr><tr><td>管理费用</td><td class="num">30</td><td class="num">60</td></tr></tbody></table>`;}
function taskMap(summary){
const stage=(n)=>summary?n:undefined;
return wrap(
at(0,0,1490,summary?'一份任务说明，把用途、需求和完成条件连接起来。':'任务交代：先明确用途，再写清需求，最后检查必要条件。')+
at(20,96,440,'1. 用途','h2')+at(530,96,440,'2. 四件套','h2',stage(1))+at(1040,96,440,'3. 必要条件','h2',stage(2))+
svg('<rect x="45" y="176" width="328" height="211" fill="#fff" stroke="#003f98" stroke-width="3"/><path d="M209 388 V422 M146 423 H272" stroke="#003f98" stroke-width="3"/>'+arrow(425,280,493,280))+
at(65,199,288,summary?'5分钟汇报':'结果给谁看','label center')+at(65,262,288,summary?'听众没有读过材料':'要帮助对方<br>理解什么','label center')+
svg(paper(540,175,405,250)+arrow(968,280,1020,280),stage(1))+
at(570,207,345,summary?'财务分析视角<br>听众与背景<br>解释两年的变化<br>参考数字解释写法':'Who you are<br>Who I am<br>Objective<br>Example','label',stage(1))+
svg('<path d="M1081 197 L1091 208 L1111 183 M1081 276 L1091 287 L1111 262 M1081 355 L1091 366 L1111 341" fill="none" stroke="#0070c0" stroke-width="4"/>',stage(2))+
at(1137,180,341,summary?'数字指出依据':'材料与事实','label',stage(2))+at(1137,259,341,summary?'明确指标定义':'范围与定义','label',stage(2))+at(1137,338,341,summary?'先提纲，再讲稿':'交付与检查','label',stage(2))+
svg('<path d="M209 449 V495 H1249 V449 M749 495 V542" fill="none" stroke="#7f9bc1" stroke-width="3"/>'+arrow(749,511,749,553),stage(2))+
at(180,575,1150,summary?'把理想结果写具体，让后续回答有明确参照。':'把这些内容组织成完整Prompt，再提供本次材料。','h2 center',stage(2)));
}
R[22]={steps:1,render(){return taskMap(false);}};
R[23]={steps:3,render(){return wrap(
at(0,0,1490,'“分析一下这份经营资料”还没有说明结果拿来做什么。')+
at(10,92,650,'青禾食品｜两年经营资料','h2')+at(0,150,655,financialTable(),'label')+
at(14,544,649,'简化利润＝收入−成本<br>−销售费用−管理费用','label')+
svg(arrow(691,305,766,305),1)+svg(paper(796,157,668,332),1)+
at(826,184,604,'为没有读过材料的同事<br>准备一份<span class="red">5分钟汇报</span>。','txt black',1)+
at(826,289,604,'解释收入、毛利率和简化利润<br>的主要变化；每个判断指出依据。','label black',1)+
at(826,408,604,'先给提纲，再根据反馈写讲稿。','label',1)+
at(804,536,671,'用途决定：<span class="red">选什么、讲多深、交付什么。</span>','txt strong',2)+
svg(rule(637),2)+at(18,657,1450,'同一份资料，汇报、分析备忘录和数据核对会需要不同输出。','label',2));}};
R[24]={steps:4,render(){return wrap(
at(0,0,1490,'把四件套落到同一份任务说明中。')+
svg(paper(413,85,1060,537))+
at(10,115,374,'Who you are','h2')+at(10,168,374,'模型采用的视角','label')+
at(450,117,974,'你是一位财务分析助教，擅长向初学者解释报表。','p-example')+
svg(arrow(351,160,432,160))+
at(10,238,374,'Who I am','h2',1)+at(10,289,374,'使用者、听众与背景','label',1)+
at(450,239,974,'我要向没有读过材料的同事做5分钟汇报；<br>听众刚开始接触这些指标。','p-example',1)+svg(arrow(351,284,432,284),1)+
at(10,362,374,'Objective','h2',2)+at(10,415,374,'目标与理想结果','label',2)+
at(450,364,974,'让听众理解两年收入、毛利率和简化利润的变化。<br>先给汇报提纲，再根据反馈写讲稿。','p-example',2)+svg(arrow(351,410,432,410),2)+
at(10,488,374,'Example','h2',3)+at(10,541,374,'可参照的表达样本','label',3)+
at(450,490,974,'参考“先报告数字，再解释变化含义”的写法；<br>数字与结论依据本次材料。','p-example',3)+svg(arrow(351,535,432,535),3)+
at(10,654,1475,'视角、背景、目标与样本，共同限定这一次生成的条件。','txt strong',3));}};
R[25]={steps:3,render(s){
const bad=s===1;
return wrap(
at(0,0,1490,'参考表达结构；每次重新确定数值、变化方向与结论。')+
at(15,85,470,'收入：1,000 → 1,200','label')+
svg('<path d="M50 319 H466" stroke="#7f9bc1" stroke-width="2"/><rect x="90" y="159" width="112" height="160" fill="#8db9e3"/><rect x="278" y="127" width="112" height="192" fill="#0070c0"/>')+
at(77,321,141,'2024','label center')+at(265,321,141,'2025','label center')+
at(95,220,102,'1,000','p-small center')+at(283,201,102,'<span style="color:white">1,200</span>','p-small center')+
at(520,109,950,'“收入从1,000万元增至1,200万元，<span class="red">增长20%</span>。<br>这说明销售规模扩大，还要结合成本和费用判断盈利变化。”','p-example')+
at(520,266,950,'报告数字 → 说明变化 → 解释含义','txt strong')+
svg(rule(382),1)+at(15,406,485,'简化利润：80 → 60','label',1)+
svg('<path d="M50 635 H466" stroke="#7f9bc1" stroke-width="2"/><rect x="90" y="459" width="112" height="176" fill="#8db9e3"/><rect x="278" y="503" width="112" height="132" fill="#0070c0"/>',1)+
at(77,641,141,'2024','label center',1)+at(265,641,141,'2025','label center',1)+at(95,512,102,'80','p-number center',1)+at(283,536,102,'<span style="color:white">60</span>','p-number center',1)+
at(520,448,950,bad?'“从80万元变为60万元，<span class="red">增长25%</span>。”':'“从80万元降至60万元，<span class="red">下降25%</span>。”','p-example',1)+
svg(arrow(450,552,493,492,bad?RED:AUX),1)+
at(520,528,950,bad?'数字写对了，变化方向仍需要检查。':'（60 − 80）÷ 80 ＝ −25%','txt strong',1)+
at(520,605,950,'相同写法，必须对应当前指标的事实。','label',2));}};
R[26]={steps:3,render(){return wrap(
at(0,0,1490,'写清目标和完成条件，具体解决办法保留选择空间。')+
at(10,92,696,'必须保留的要求','h2')+
svg(paper(5,161,694,375))+
at(35,195,625,'两年数字、单位和材料范围','label black')+at(35,273,625,'简化利润的计算定义','label black')+at(35,351,625,'主要判断对应的表格或段落','label black')+at(35,429,625,'先确认提纲，再写讲稿','label black')+
at(785,92,690,'逐条检查额外步骤是否服务任务','h2',1)+
svg('<path d="M828 226 H1447 M828 326 H1447 M828 426 H1447" stroke="#c00000" stroke-width="2.5"/>',1)+
at(804,183,642,'必须先写五句公司介绍','label',1)+at(804,283,642,'每个数字都提出三个原因','label',1)+at(804,383,642,'不论任务都使用固定五段总结','label',1)+
at(798,481,650,'多一步要求，就应有一个任务理由。','label red',1)+
svg(rule(592),2)+at(18,621,1465,'保留：材料、定义、依据与交付。<br>决定是否增加步骤：它能否帮助听众理解主要变化？','txt strong',2));}};
R[27]={steps:3,render(){return taskMap(true);}};
})();

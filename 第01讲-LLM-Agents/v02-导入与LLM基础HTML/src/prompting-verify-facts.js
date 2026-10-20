(function(){
'use strict';
const R=window.MBA_RENDERERS,{at,svg,arrow,paper,rule,wrap}=window.PROMPT_VIS;
const B='#003f98',Red='#c00000';
const g=(s,b)=>`<g data-reveal="${s}">${b}</g>`;
function relation(summary){let d=paper(10,157,350,315)+rule(235,33,330)+arrow(380,311,463,311)+`<circle cx="548" cy="202" r="30" fill="#fff" stroke="${B}" stroke-width="4"/><path d="M570 225 L592 247" stroke="${B}" stroke-width="7"/>`+rule(279,502,955)+rule(368,502,955)+arrow(979,311,1081,311)+paper(1105,157,388,315)+rule(235,1130,1465);let h=svg(d)+at(10,80,350,'拆开说法','h2 center')+at(505,80,450,'逐项核查','h2 center')+at(1105,80,388,'调整结论','h2 center')+at(40,176,292,summary?'访谈与经营判断':'事实、推论与判断','label strong')+at(40,276,292,summary?'试用意愿<br>费用变化<br>未来经营':'说法中的数字<br>原因与解释<br>适用对象','txt black')+at(610,180,346,'材料：原文支持什么','p-example')+at(510,305,450,'推理：事实能否推出结论','p-example',summary?1:undefined)+at(510,394,450,'范围：对象与条件是什么','p-example',summary?1:undefined)+at(1135,175,320,summary?'保留材料支持的部分':'回到来源与条件','label strong',summary?2:undefined)+at(1135,276,320,summary?'补齐判断所需资料<br>写明适用范围':'成立的部分<br>需要收窄的部分<br>还需补的材料','txt black',summary?2:undefined)+at(10,532,1480,summary?'核查把结论连回事实，也把下一步连到需要补充的材料。':'先核对事实，再检查推理，最后确定结论能说到哪里。','txt',summary?2:undefined)+at(10,605,1480,summary?'来源、计算与适用范围，都要与结论逐项对应。':'把“检查一下”变成可逐条回查的对应关系。','txt red strong',summary?2:undefined);return wrap(h);}
R[32]={steps:1,render(){return relation(false);}};
R[33]={steps:4,render(){return wrap(
 svg(paper(5,130,455,420)+rule(208,29,434)+arrow(478,341,531,341)+g(3,rule(618,0,1504)))+
 at(0,0,1490,'“逐条列出判断、依据和适用范围，检查事实能否推出结论。”','p-quote')+
 at(30,152,395,'访谈原句','h2')+at(30,235,395,'20位受访同学中，<br>12位愿意试用。','txt black')+
 at(30,349,395,'12 ÷ 20 ＝ 60%','p-number',1)+at(30,438,395,'没有询问价格<br>或付费意愿。','txt black',2)+
 at(555,126,940,`<table class="p-table"><colgroup><col style="width:28%"><col style="width:35%"><col style="width:37%"></colgroup><thead><tr><th>核查的判断</th><th>对应依据</th><th>状态与范围</th></tr></thead><tbody><tr data-reveal="1"><td>12位愿意试用</td><td>访谈原句</td><td>有材料支持</td></tr><tr data-reveal="2"><td>比例为60%</td><td>12 ÷ 20</td><td>仅限20位受访者</td></tr><tr data-reveal="3"><td>愿意付费</td><td>需要付费意愿资料</td><td class="red">证据不足</td></tr></tbody></table>`,'')+
 at(0,642,1490,'数字、对象与含义分别核对，结论才与材料对应。','txt red strong',3)
 );}};
R[34]={steps:4,render(){let d=paper(5,75,485,505)+rule(154,28,462)+rule(245,28,462)+rule(324,28,462)+arrow(512,204,633,173)+g(1,arrow(512,450,633,295))+g(2,rule(421,657,1490))+g(3,rule(553,657,1490))+g(3,rule(621,0,1504));return wrap(svg(d)+
 at(28,95,430,'青禾食品｜经营资料','h2')+at(28,179,210,'费用（万元）','p-example')+at(244,179,105,'2024','p-example center')+at(351,179,105,'2025','p-example center')+at(28,259,210,'销售＋管理','p-example')+at(244,259,105,'120','p-example center')+at(351,259,105,'240','p-example center')+
 at(28,348,430,'2025年新增3家门店，<br>推广投入和管理人员增加。','txt black')+at(28,476,430,'材料未含分店收入、成本<br>及后续年度数据。','p-small black')+
 at(657,94,820,'费用合计增加120万元','h2')+at(657,150,820,'销售、管理费用复算：240 − 120 ＝ 120。','p-example')+
 at(657,230,820,'费用增长与扩店相关','h2',1)+at(657,286,820,'扩店、推广和人员增加的段落支持这一解释。','p-example',1)+
 at(657,363,820,'每家新店都亏损','h2 red',2)+at(657,432,820,'需要补充：各门店收入与成本。','p-example',2)+
 at(657,500,820,'下一年利润一定回升','h2 red',3)+at(657,564,820,'需要补充：后续年度资料。','p-example',3)+
 at(0,642,1490,'引用要指向支持结论的数字或原文，并保留其适用范围。','txt red strong',3)
 );}};
R[35]={steps:3,render(){return relation(true);}};
})();

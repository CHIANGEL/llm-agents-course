(function(){
'use strict';
const R=window.MBA_RENDERERS, V=window.PROMPT_VIS;
const {at,svg,arrow,paper,rule,wrap}=V;
const B='#003f98',Rr='#c00000',P='#c5d4e5';
const g=(s,b)=>`<g data-reveal="${s}">${b}</g>`;
function people(x,y){let b='';for(let i=0;i<20;i++){let xx=x+(i%10)*43,yy=y+Math.floor(i/10)*88,col=i<12?B:'#a7b0ba';b+=`<g fill="${col}"><circle cx="${xx+13}" cy="${yy+10}" r="10"/><path d="M${xx+4} ${yy+25} Q${xx+13} ${yy+18} ${xx+22} ${yy+25} L${xx+26} ${yy+49} H${xx+21} V${yy+73} H${xx+14} V${yy+51} H${xx+11} V${yy+73} H${xx+4} V${yy+49} H${xx}Z"/></g>`;}return b;}
function bubble(x,y,w,h,fill='#f7fafe'){return `<path d="M${x+18} ${y} H${x+w-18} Q${x+w} ${y} ${x+w} ${y+18} V${y+h-18} Q${x+w} ${y+h} ${x+w-18} ${y+h} H${x+55} L${x+28} ${y+h+22} V${y+h} H${x+18} Q${x} ${y+h} ${x} ${y+h-18} V${y+18} Q${x} ${y} ${x+18} ${y}Z" fill="${fill}" stroke="${B}" stroke-width="2.5"/>`;}
function relation(summary){
 let d=paper(10,160,330,290)+rule(233,32,313)+arrow(356,301,418,301)+`<path d="M540 205 L650 301 L540 397 L430 301Z" fill="#fff8f8" stroke="${Rr}" stroke-width="2.8"/>`+arrow(666,301,724,301)+bubble(742,200,335,200)+arrow(1094,301,1150,301)+paper(1170,160,320,290)+rule(233,1193,1463);
 let h=svg(d)+at(10,79,330,'已有信息','h2 center')+at(370,79,350,'影响结果的缺口','h2 center')+at(742,79,335,'有针对性的追问','h2 center')+at(1170,79,320,'明确下一步','h2 center');
 if(!summary){h+=at(35,178,275,'任务与材料','label strong')+at(35,260,275,'事实与解释<br>目标与约束','txt black')+at(463,264,154,'还缺<br>什么？','txt red strong center')+at(767,242,285,'只问会改变<br>结论的问题','txt black center')+at(1195,179,265,'重新组织问题','label strong')+at(1195,260,265,'补入新信息<br>继续形成方案','txt black')+at(10,515,1480,'先区分事实、解释与目标，再找需要补充的信息。','txt')+at(10,586,1480,'信息足够时就停止追问，把新增信息用于任务。','txt red strong');}
 else{h+=at(35,178,275,'已有5分钟要求','label strong')+at(35,260,275,'听众与材料<br>直接使用','txt black')+at(463,264,154,'提纲<br>用途？','txt red strong center',1)+at(767,242,285,'供自己准备，<br>还是直接上屏？','txt black center',1)+at(1195,179,265,'供自己准备','label strong',2)+at(1195,260,265,'保留讲解细节<br>台上展示一张表','txt black',2)+at(10,515,1480,'分清已有信息，追问才会集中在真正影响交付的缺口。','txt',1)+at(10,586,1480,'得到足够信息后继续工作，把答案落实到内容和形式。','txt red strong',2);}
 return wrap(h);
}
R[28]={steps:1,render(){return relation(false);}};
R[29]={steps:4,render(){return wrap(
 svg(paper(5,77,520,480)+people(42,157)+rule(367,30,498)+arrow(544,290,601,290)+rule(209,640,1490)+rule(345,640,1490)+g(3,rule(587,0,1504)))+
 at(0,0,1485,'同一句判断中，可能混合着事实、解释与目标。','txt')+
 at(31,98,450,'访谈记录','h2')+at(31,383,450,'20位受访同学中，<br><strong>12位表示愿意试用。</strong>','txt black')+at(31,480,455,'没有询问价格或付费意愿。','p-small black')+
 at(640,100,150,'事实','h2',1)+at(810,101,670,'12位愿意试用，占受访者的60%。','txt black',1)+
 at(640,239,150,'解释','h2',2)+at(810,239,670,'“大家会买”需要付费资料支持。','txt black',2)+
 at(640,376,150,'目标','h2',2)+at(810,376,670,'判断是否值得继续验证产品需求。','txt black',2)+
 at(640,476,840,'关键缺口：实际使用与付费反应。','txt red strong',3)+
 at(0,610,1490,'“先分开事实、解释和目标；只问可能改变判断的问题。”','p-quote',3)
 );}};
R[30]={steps:4,render(){let d=bubble(10,73,675,124)+g(1,bubble(10,235,675,130))+g(2,bubble(10,402,675,150))+g(2,paper(823,101,285,354)+`<rect x="1173" y="101" width="320" height="269" rx="7" fill="#fff" stroke="${B}" stroke-width="3"/><path d="M1333 370 V422 M1257 424 H1408" stroke="${B}" stroke-width="3"/>`+arrow(706,443,796,283)+arrow(1108,283,1152,283)+rule(222,1193,1469)+rule(284,1193,1469)+rule(346,1193,1469))+g(3,rule(582,0,1504));return wrap(svg(d)+
 at(10,0,1480,'已提供：5分钟、听众背景、两年报表。','txt')+
 at(30,91,632,'“列提纲前，请先问清<br>影响汇报的关键要求。”','p-quote')+
 at(30,253,632,'“提纲供你准备，还是直接上屏？<br>能否展示报表或计算式？”','p-quote',1)+
 at(30,419,632,'“提纲供我准备，台上展示一张表；<br>只保留必要计算，不用完整讲稿。”','p-quote',2)+
 at(841,123,245,'准备提纲','h2 center',2)+at(845,194,240,'开场矛盾<br>关键数字<br>原因与依据<br>讲解顺序','p-example',2)+
 at(1190,122,285,'上屏的一张表','label strong center',2)+at(1193,177,118,'项目','p-small black',2)+at(1314,177,72,'2024','p-small black center',2)+at(1396,177,72,'2025','p-small black center',2)+at(1193,239,118,'收入','p-small black',2)+at(1314,239,72,'1000','p-small black center',2)+at(1396,239,72,'1200','p-small black center',2)+at(1193,301,118,'简化利润','p-small black',2)+at(1314,301,72,'80','p-small black center',2)+at(1396,301,72,'60','p-small black center',2)+
 at(1190,438,285,'单位：万元','p-small black',2)+
 at(1185,490,300,'简化利润＝收入−成本<br>−销售费用−管理费用','p-small black',2)+
 at(0,607,1490,'用途决定详略，展示条件决定数字怎样呈现。','txt red strong',3)+at(0,660,1490,'已有信息直接使用；补齐关键缺口后继续。','p-small',3)
 );}};
R[31]={steps:3,render(){return relation(true);}};
})();

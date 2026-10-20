(function () {
  'use strict';
  const R = window.MBA_RENDERERS;
  const {at, svg, arrow, paper, rule, wrap} = window.PROMPT_VIS;
  const blue = '#003f98', red = '#c00000';
  const group = (body, step) => `<g data-reveal="${step}">${body}</g>`;
  function prototype(x, y, w, h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f8fbff" stroke="${blue}" stroke-width="3"/><path d="M${x} ${y+32} H${x+w}" stroke="${blue}" stroke-width="2"/><circle cx="${x+18}" cy="${y+16}" r="4" fill="${blue}"/><circle cx="${x+35}" cy="${y+16}" r="4" fill="#7ea8d0"/><path d="M${x+20} ${y+57} H${x+w-22} M${x+20} ${y+80} H${x+w-62}" stroke="#c5d4e5" stroke-width="8"/><rect x="${x+20}" y="${y+h-42}" width="${w-40}" height="26" rx="4" fill="#dcebf8"/>`;
  }
  function record(x, y, w, h) {
    return paper(x,y,w,h) + `<path d="M${x+14} ${y+47} H${x+w-14} M${x+14} ${y+80} H${x+w-14} M${x+14} ${y+113} H${x+w-14} M${x+w*.48} ${y+47} V${y+h-12}" stroke="#b6cce1" stroke-width="2"/>`;
  }
  function comparisonMap(summary) {
    const first = summary ? 0 : undefined, second = summary ? 1 : undefined, third = summary ? 2 : undefined;
    let shapes = paper(46,130,290,190,'#fff') + paper(1158,130,300,190,'#fff');
    shapes += arrow(752,103,752,132) + `<path d="M190 130 V115 H1310 V130" fill="none" stroke="#0070c0" stroke-width="3"/>`;
    shapes += arrow(190,345,190,390) + arrow(1310,345,1310,390);
    shapes += `<path d="M190 438 V464 H1310 V438 M752 464 V506" fill="none" stroke="#0070c0" stroke-width="3"/>` + arrow(752,484,752,520,red);
    shapes += rule(598,80,1420);
    return svg(shapes) +
      at(195,20,1115,'共同目标：决定应用下一步怎样推进','h2 center') +
      at(65,151,250,'先验证实际试用','label strong center') +
      at(77,212,225,'可用原型<br>使用记录','txt center') +
      at(1180,151,255,'准备收费推广','label strong center') +
      at(1185,212,245,'产品交付<br>价格与投入','txt center') +
      at(385,180,735,summary?'两个方向，分别给出<span class="red">最有力的理由</span>。':'先展开：双方最有力的理由<br>以及各自成立的条件。','txt center',first) +
      at(65,395,280,summary?'理由＋成立条件':'方向一的理由与条件','label center',first) +
      at(1160,395,300,summary?'理由＋成立条件':'方向二的理由与条件','label center',first) +
      at(380,389,745,summary?'用同一组维度比较<span class="red">收益与风险</span>。':'再比较：信息、条件、收益与风险','txt center',second) +
      at(190,531,1120,summary?'找到会改变选择的变量，补齐决定性信息。':'最后找出：哪一个变量最可能改变选择？','txt strong center',third) +
      at(90,630,1325,summary?'比较的结果，应当留下<span class="red">有条件的判断</span>和下一步要补的信息。':'“请分别给出两方最有力的理由、条件与风险，再找出关键变量。”','txt center',summary?2:1);
  }
  R[36] = {steps:2, render(){return wrap(comparisonMap(false));}};
  R[37] = {steps:3, render(){
    let shapes = rule(60,10,1490) + `<path d="M752 90 V632" stroke="#c5d4e5" stroke-width="2"/>`;
    shapes += prototype(54,177,278,151) + record(405,177,263,151) + prototype(824,177,278,151) + paper(1190,177,254,151);
    shapes += arrow(349,250,388,250) + arrow(1118,250,1171,250);
    shapes += group(rule(496,45,694),1) + group(rule(496,815,1455),2);
    return wrap(svg(shapes) +
      at(10,0,1480,'已有访谈：20 位受访者中，12 位愿意试用。','txt') +
      at(44,90,660,'方向一：先验证实际试用','h2') +
      at(815,90,670,'方向二：准备收费推广','h2') +
      at(82,278,220,'可用原型','label center') +
      at(431,186,210,'使用记录','label center') +
      at(853,278,220,'可交付产品','label center') +
      at(1211,200,210,'价格<br>交付范围','label center') +
      at(45,345,650,'最强理由','label red',1) +
      at(45,385,650,'从口头意愿走向<span class="red">实际使用</span>，<br>发现开始和放弃的位置。','txt',1) +
      at(815,345,650,'最强理由','label red',2) +
      at(815,385,650,'更早接触<span class="red">付费反馈</span>，<br>观察价格与交付是否被接受。','txt',2) +
      at(45,512,650,'成立条件','label',1) +
      at(45,556,650,'原型可用，<br>能够记录参与者的使用过程。','txt',1) +
      at(815,512,650,'成立条件','label',2) +
      at(815,556,650,'产品可交付，<br>能够承担准备和推广的投入。','txt',2) +
      at(45,662,1410,'先把每个方向最有力的理由讲清，再检查它所依赖的条件。','txt strong',2)
    );
  }};
  R[38] = {steps:4, render(){
    const table = `<table class="p-table"><colgroup><col style="width:250px"><col style="width:585px"><col style="width:585px"></colgroup><thead><tr><th>共同维度</th><th>先验证实际试用</th><th>准备收费推广</th></tr></thead><tbody><tr><th>获得什么信息</th><td>是否开始使用、在哪里放弃</td><td>对价格与交付的反馈</td></tr><tr data-reveal="1"><th>需要什么条件</th><td>原型可用，能够记录过程</td><td>产品可交付，投入可承担</td></tr><tr data-reveal="2"><th>承担什么风险</th><td>推迟接触付费反馈</td><td>需求尚未明确就增加投入</td></tr></tbody></table>`;
    return wrap(
      at(25,0,1450,'同一目标下，用同一组维度，比较两种行动。','txt') +
      at(25,80,1450,table,'') +
      svg(rule(495,25,1475)) +
      at(25,526,310,'改变选择的变量','label red',3) +
      at(355,520,1100,'原型能否交付？投入能否承担？当前最缺哪类信息？','txt',3) +
      svg(arrow(745,569,745,606,red),3) +
      at(100,625,1330,'关键追问：<span class="red">当前优先了解实际使用，还是付费反应？</span>','txt center',3)
    );
  }};
  R[39] = {steps:3, render(){return wrap(comparisonMap(true));}};
})();

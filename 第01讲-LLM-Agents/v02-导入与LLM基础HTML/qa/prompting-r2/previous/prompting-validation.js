(function () {
  'use strict';
  const R = window.MBA_RENDERERS;
  const {at, svg, arrow, paper, rule, wrap} = window.PROMPT_VIS;
  const blue='#003f98', red='#c00000';
  function screen(x,y,w,h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f8fbff" stroke="${blue}" stroke-width="3"/><path d="M${x} ${y+30} H${x+w}" stroke="${blue}" stroke-width="2"/><circle cx="${x+17}" cy="${y+15}" r="4" fill="${blue}"/><path d="M${x+18} ${y+55} H${x+w-20} M${x+18} ${y+79} H${x+w-55}" stroke="#c5d4e5" stroke-width="8"/><rect x="${x+18}" y="${y+h-40}" width="${w-36}" height="25" rx="3" fill="#c5def5"/>`;
  }
  function validationMap(summary) {
    const a=summary?0:undefined,b=summary?1:undefined,c=summary?2:undefined;
    let shapes=paper(25,140,320,220) + screen(425,152,280,196) + paper(790,140,315,220);
    shapes+=arrow(360,250,408,250)+arrow(720,250,774,250)+arrow(1120,250,1170,250);
    shapes+=`<path d="M1246 185 L1312 250 L1246 315 L1180 250Z" fill="#fff" stroke="${blue}" stroke-width="3"/>`;
    shapes+=`<path d="M1246 315 V373 H1400 M1246 373 H1120" fill="none" stroke="${blue}" stroke-width="3"/>`;
    shapes+=rule(482,25,1475);
    shapes+=`<path d="M1400 373 H1492 V619 H13 V367" fill="none" stroke="#0070c0" stroke-width="3"/>`+arrow(13,367,35,367);
    return svg(shapes) +
      at(25,0,1450,summary?'行动的目的，是取得能改变下一步判断的信息。':'先锁定一个假设，再设计能带回信息的小范围行动。','txt') +
      at(25,82,320,'关键假设','h2 center') + at(425,82,280,'限定行动','h2 center') +
      at(790,82,315,'观察记录','h2 center') + at(1170,82,305,'决策条件','h2 center') +
      at(50,184,270,summary?'愿意试用的人<br>是否开始使用？':'哪一个假设<br>会改变选择？','txt center',a) +
      at(448,270,234,'可用原型','label center',a) +
      at(805,188,285,'受邀 → 开始使用<br>→ 放弃位置','label center',b) +
      at(1189,229,118,'判断','label center',c) +
      at(1095,397,140,'继续','label center',c) +
      at(1275,397,225,'调整／停止','label center',c) +
      at(25,383,755,'投入与周期，要在行动前写清。','label',a) +
      at(60,520,1380,summary?'假设决定看什么；记录提供新信息；条件决定下一步。':'“请设计一次最小验证，写清投入、周期、观察指标和决策条件。”','txt center',summary?2:1) +
      at(390,636,755,summary?'把新信息带回原来的选择。':'带回新信息，更新下一步判断。','label center',summary?2:1);
  }
  R[40]={steps:2,render(){return wrap(validationMap(false));}};
  R[41]={steps:4,render(){
    let shapes=rule(66,20,1480)+screen(20,218,274,185)+paper(350,185,585,260);
    shapes+=`<path d="M370 245 H915 M370 305 H915 M370 365 H915 M554 245 V424 M738 245 V424" fill="none" stroke="#b6cce1" stroke-width="2"/>`;
    shapes+=arrow(303,313,335,313)+arrow(950,313,1000,313);
    shapes+=`<path d="M1025 223 V402 M1025 244 H1060 M1025 313 H1060 M1025 382 H1060" fill="none" stroke="#0070c0" stroke-width="3"/>`;
    shapes+=rule(492,20,1480);
    return wrap(svg(shapes)+
      at(20,0,1460,'关键假设：<span class="red">愿意试用的人，会实际开始使用。</span>','txt strong')+
      at(20,95,1460,'行动前写清：投入多少时间与资源、限定多长周期、达到什么条件。','txt',1)+
      at(20,154,274,'提供可用原型','label center',1)+
      at(44,335,225,'邀请试用','label center',1)+
      at(370,195,535,'行为记录','label',2)+
      at(370,257,174,'受邀','label center',2)+
      at(560,257,172,'开始使用','label center',2)+
      at(748,257,167,'放弃位置','label center',2)+
      at(365,377,185,'逐人记录','p-small center',2)+
      at(559,377,176,'是否开始','p-small center',2)+
      at(746,377,173,'停在哪一步','p-small center',2)+
      at(1075,185,395,'行动前约定判断条件','label red',3)+
      at(1075,231,398,'按预期开始 → 继续观察','label',3)+
      at(1075,300,398,'步骤受阻 → 调整流程','label',3)+
      at(1075,369,398,'触及投入上限 → 停止','label',3)+
      at(20,528,1455,'这次观察：从<span class="red">试用意愿</span>到<span class="red">实际使用</span>，中间发生了什么。','txt',2)+
      at(20,602,1455,'付费反应，需要围绕<span class="red">价格与交付</span>另设观察。','txt',3)
    );
  }};
  R[42]={steps:3,render(){return wrap(validationMap(true));}};
})();

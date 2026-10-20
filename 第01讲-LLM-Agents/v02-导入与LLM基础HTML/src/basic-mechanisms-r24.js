(function(){'use strict';
const R=window.MBA_RENDERERS,T=window.MBA_LLM_TRACE;
const at=(x,y,w,t,c='')=>`<div class="b24-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const svg=t=>`<svg class="b24-svg" viewBox="0 0 1504 718" aria-hidden="true">${t}</svg>`;
const arrow=(x,y,w)=>`<path d="M${x} ${y} h${w} m-12 -8 l12 8 -12 8" fill="none" stroke="#0070c0" stroke-width="3"/>`;
const pieces=['Write','␠one','␠short','␠formal','␠sentence','␠announcing','␠that','␠the','␠lecture','␠scheduled','␠for','␠today','␠has','␠been','␠cancelled','.'];
R[24001]={steps:1,render:()=>`<div class="b24">
${at(0,0,1504,'<b>Token</b> 是模型处理文本的单位，可以是词、词的一部分、标点或特殊标记。','b24-lead')}
${at(0,90,1504,'<b>Tokenization：</b>把文本转换成Token序列','b24-heading')}
${at(0,147,1504,T.messages[1].content,'b24-input-text')}
${svg('<path d="M740 202 V233 m-9 -12 l9 12 9 -12" fill="none" stroke="#0070c0" stroke-width="3"/>')}
<div class="b24-tokens">${pieces.map((p,i)=>`<span class="tone${i%4}">${p}</span>`).join('')}</div>
${at(0,380,1504,'␠表示空格。每个Token在模型词表中都有编号；本例共16个Token。','b24-small')}
${at(0,425,450,'文本输入','b24-flow-label')}${at(1045,425,450,'文本输出','b24-flow-label')}
${at(0,547,450,'输入Token序列','b24-flow-box')}${at(620,535,240,'LLM','b24-llm')}${at(1045,547,450,'输出Token序列','b24-flow-box')}
${svg('<path d="M225 474 V529 m-9 -13 l9 13 9 -13 M1270 530 V477 m-9 13 l9 -13 9 13" fill="none" stroke="#0070c0" stroke-width="3"/>'+arrow(473,577,120)+arrow(885,577,132))}
${at(260,483,310,'转换为Token','b24-small')}${at(1070,483,225,'还原为文本','b24-small')}
${at(570,638,360,'每次生成一个Token','b24-small b24-center')}
</div>`};
R[24002]={steps:1,render:()=>R[17008].render().replace('<b>外化：</b>哪些工作由模型外部承担？<br><b>内化：</b>哪些做法可通过训练进入模型？','LLM生成下一步；<br>Harness让这一步实际运行。').replace('接下来用“外化与内化”，整理模型能力与外部系统之间的分工。','先看模型与外部系统怎样配合，再看通知、网页和机械臂中的具体任务。')};
R[24003]={steps:1,render:()=>`<div class="b24">
${at(0,0,1504,'脑接收和发出信号；要让外界发生变化，还需要外部系统读取信号并执行。','b24-lead')}
<div class="b24-brain-frame"><img class="b24-brain" src="assets/basic-mechanisms-r24/brain-in-vat-feedback.png" alt="缸中的脑经信号连接外部控制系统，控制系统再连接电脑与机械臂。"></div>
${at(0,574,470,'<h2>LLM · 缸中之脑</h2><p>输入文本 → 生成文本<br>如同接收与发出电信号</p>','b24-brain-label')}
${at(530,574,440,'<h2>Harness · 外部系统</h2><p>读取输出，调用工具执行<br>把执行结果送回模型</p>','b24-brain-label')}
${at(1050,574,454,'<h2>外界 · 软件与设备</h2><p>邮件实际发出<br>物体实际移动</p>','b24-brain-label')}
</div>`};
})();

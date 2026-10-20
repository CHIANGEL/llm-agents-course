(function(){
'use strict';
const R=window.MBA_RENDERERS,{at,svg,arrow,paper,rule,wrap}=window.PROMPT_VIS;
R[20]={steps:1,render(){return R[3].render().replace('h2 red','h2').replace('class="at h2" style="left:20px;top:134px','class="at h2 red" style="left:20px;top:134px');}};
const positions=[20,400,780,1160];
function process(){return positions.map((x,i)=>at(x,114,320,['① 交代任务','② 补齐信息','③ 形成方案','④ 反馈检查'][i],'h2')).join('')+svg(arrow(342,293,386,293)+arrow(722,293,766,293)+arrow(1102,293,1146,293));}
function symbols(){return svg(paper(70,202,210,170)+paper(448,202,210,170)+
'<path d="M100 244 H245 M100 280 H230 M100 316 H185" stroke="#0070c0" stroke-width="4"/><path d="M475 247 H540 M475 293 H540 M475 339 H540 M565 238 L578 251 L607 222 M565 284 L578 297 L607 268 M565 330 L578 343 L607 314" fill="none" stroke="#0070c0" stroke-width="4"/>'+
'<path d="M935 201 V230 H844 V282 M935 230 H1026 V282" fill="none" stroke="#003f98" stroke-width="3"/><circle cx="935" cy="204" r="10" fill="#003f98"/><rect x="806" y="285" width="76" height="68" fill="#eaf3fb" stroke="#0070c0" stroke-width="3"/><rect x="988" y="285" width="76" height="68" fill="#fff" stroke="#c00000" stroke-width="3"/>'+paper(1208,202,210,170)+
'<path d="M1237 246 H1384 M1237 282 H1350 M1237 318 H1384" stroke="#0070c0" stroke-width="4"/><path d="M1325 283 L1340 296 L1387 250 M1232 339 H1393" fill="none" stroke="#c00000" stroke-width="4"/>');}
const loop=()=>svg('<path d="M1315 510 V559 H175 V510 M165 525 L175 510 L185 525" stroke="#c00000" stroke-width="3" fill="none"/>');
R[21]={steps:3,render(){return wrap(`
${at(0,0,1490,'用任务和材料组织输入，再用结果与反馈改进下一次输入。')}
${process()}${symbols()}
${at(20,407,320,'用途、对象、目标\n与参考样例'.replace('\n','<br>'),'label')}
${at(400,407,320,'先澄清关键缺口<br>再核查事实依据','label',1)}
${at(780,407,320,'先比较不同方案<br>再验证关键假设','label',1)}
${at(1160,407,320,'具体反馈、改Prompt<br>代表性任务检查','label',2)}
${loop()}${at(485,577,650,'把有效反馈写回下一次输入','label red center')}
${at(20,662,1460,'依次展开六个方法：交代、澄清、核查、比较、验证、反馈。','label strong',2)}
`);}};
R[48]={steps:3,render(){return wrap(`
${at(0,0,1490,'Prompting把目标和材料组织进输入，再用反馈不断改进。')}
${process()}${symbols()}
${at(20,407,320,'让谁用、用来做什么<br>交付怎样的结果','label')}
${at(400,407,320,'澄清会改变结论的点<br>核对材料支持的范围','label',1)}
${at(780,407,320,'在共同维度下比较<br>优先验证关键假设','label',1)}
${at(1160,407,320,'指出具体修改位置<br>用代表性输入检查','label',2)}
${loop()}${at(485,577,650,'把有效反馈写回下一次输入','label red center')}
${at(20,662,1460,'任务清楚、材料充分、结论有据，反馈才能转化为可复用的方法。','label strong',2)}
`);}};
R[49]={steps:3,render(){return wrap(`
${at(0,0,1490,'当任务需要读取文件或执行操作，下一次输入还要接住工具的返回。')}
${svg(paper(20,149,440,350))}
${at(48,181,385,'任务与要求','h2')}
${at(48,252,385,'读取经营资料，<br>整理关键数字，<br>解释利润变化。','txt black')}
${at(48,426,385,'目标、材料、交付要求','label')}
${svg(arrow(477,306,577,306))}
<img class="at" src="assets/llm.png" alt="模型根据本次输入决定下一步" style="left:625px;top:199px;width:150px;height:161px">
${at(560,407,300,'模型','h2 center')}
${svg(arrow(813,306,1046,306),1)}
${at(805,242,260,'提出工具调用','label center',1)}
<img class="at" data-reveal="1" src="assets/app.png" alt="工具读取经营资料" style="left:1093px;top:175px;width:247px;height:207px">
${at(1070,407,340,'工具读取文件','h2 center',1)}
${svg('<path d="M1215 469 V558 H700 V469 M690 484 L700 469 L710 484" stroke="#0070c0" stroke-width="3" fill="none"/>',2)}
${at(750,502,430,'材料与结果进入下一次输入','label',2)}
${at(20,638,1460,'Prompting组织本次输入；Harness（运行系统）组织执行与反馈。','txt strong',2)}
`);}};
})();

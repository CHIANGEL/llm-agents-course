(function(){
'use strict';
const R=window.MBA_RENDERERS, {at,svg,arrow,paper,rule,wrap}=window.PROMPT_VIS;
function feedbackMap(summary){const st=n=>summary?n:undefined;return wrap(
at(0,0,1490,summary?'把有效反馈写回任务说明，再用不同输入检查。':'反馈与检查：先指出具体问题，再改Prompt，最后检查修改。')+
at(10,94,446,'1. 具体反馈','h2')+at(535,94,447,'2. 写回Prompt','h2',st(1))+at(1040,94,450,'3. 代表性输入','h2',st(2))+
svg(paper(20,177,393,257)+arrow(449,303,507,303))+
at(49,211,331,summary?'保留两年数字<br><br>补足变化关系<br><br>指出修改位置':'回答中的哪一处<br><br>应当保留什么<br><br>需要修改什么','label black')+
svg(paper(540,177,414,257)+arrow(975,303,1030,303),st(1))+
at(568,211,354,summary?'数字注明表格<br><br>解释注明段落<br><br>缺项明确列出':'把反馈整理成要求<br><br>保留任务与听众<br><br>形成完整改稿','label black',st(1))+
svg(paper(1075,170,338,75)+paper(1090,267,338,75)+paper(1105,364,338,75),st(2))+
at(1105,190,279,'材料完整','label',st(2))+at(1120,287,279,'缺关键数据','label',st(2))+at(1135,384,279,'换一个对象','label',st(2))+
svg('<path d="M1268 466 V526 H220 V467" fill="none" stroke="#0070c0" stroke-width="3"/>'+arrow(220,499,220,461),st(2))+
at(419,543,712,'发现问题，继续修改','label center',st(2))+
at(18,638,1460,summary?'改稿是否有用，要看它解决了什么问题、换材料后是否仍适用。':'每轮都回到原任务：检查事实、解释范围、缺失处理和交付。','txt strong',st(2)));}
R[43]={steps:1,render(){return feedbackMap(false);}};
R[44]={steps:3,render(){return wrap(
at(0,0,1490,'请 critique、review、improve：保留任务、听众与5分钟时长。')+
at(15,90,700,'先对回答提出具体反馈','h2')+svg(paper(6,162,680,233))+
at(36,192,615,'“费用上升，所以利润下降。”','p-example')+
at(36,280,615,'保留两年数字；<span class="red">把变化关系讲具体。</span>','label')+
svg(arrow(712,276,784,276),1)+
at(830,191,194,'新增毛利','label',1)+at(830,278,194,'新增费用','label',1)+
svg('<rect x="1033" y="187" width="280" height="48" fill="#0070c0"/><rect x="1033" y="274" width="336" height="48" fill="#c00000"/><path d="M1313 179 V335" stroke="#7f9bc1" stroke-width="2" stroke-dasharray="7 6"/>',1)+
at(1062,191,225,'<span style="color:white">100万元</span>','label center',1)+at(1090,278,225,'<span style="color:white">120万元</span>','label center',1)+
at(829,352,650,'简化利润变化：100 − 120 ＝ <span class="red">−20万元</span>','label strong',1)+
at(7,433,1475,'再把有效反馈写回Prompt','h2',2)+
at(25,504,600,'原要求：<br>“根据资料分析主要变化。”','p-example',2)+svg(arrow(623,555,721,555),2)+
at(754,497,717,'改稿：<br>“用关键数字解释变化关系；<br>数字注明表格，解释注明段落。”','p-example',2)+
at(20,655,1465,'修改要有对象与理由；完整改稿保留原来的任务要求。','label strong',2));}};
R[45]={steps:3,render(){return wrap(
at(0,0,1490,'先判断缺的是表达、要求，还是事实材料。')+
at(10,94,1480,'原文：两家企业的问卷显示，远程办公天数与自评满意度相关。','label black')+
at(10,144,1480,'这项调查无法确定因果关系。','label black')+
svg(rule(207))+
at(10,239,347,'表达不够自然','h2')+svg(arrow(360,270,440,270))+
at(466,237,992,'相同Prompt ＋ 相同材料 → 比较另一候选','txt')+
at(466,292,992,'逐项保留：两家企业、相关、无法确定因果。','label')+
svg(rule(365),1)+at(10,399,347,'总是删掉限制','h2',1)+svg(arrow(360,430,440,430),1)+
at(466,397,992,'补要求 → “保留研究范围与限制，只改表达。”','txt',1)+
at(466,452,992,'“证明能提升”把相关改成因果，应改回原意。','label red',1)+
svg(rule(524),2)+at(10,557,347,'缺少事实材料','h2',2)+svg(arrow(360,589,440,589),2)+
at(466,555,992,'补材料 → 取得问题所需的数据与原文。','txt',2)+
at(466,610,992,'在聊天中说“再来一版”，还会加入上一版与新要求。','label',2));}};
R[46]={steps:3,render(){return wrap(
at(0,0,1490,'Eval（结果检查）：从经营汇报中选取“毛利率变化”这一检查点。')+
at(15,91,464,'准备不同材料','h2')+at(559,91,452,'分别使用两个版本','h2',1)+at(1090,91,399,'按同一依据核对','h2',2)+
svg(paper(10,164,454,106)+paper(10,302,454,106)+paper(10,440,454,106))+
at(36,186,395,'完整：收入与成本齐全','p-small')+at(36,324,395,'缺失：缺2024年成本','p-small')+at(36,462,395,'换对象：使用另一组数据','p-small')+
svg('<path d="M484 218 H515 V501 H484 M515 354 H549" fill="none" stroke="#7f9bc1" stroke-width="3"/>'+arrow(549,354,578,354),1)+
svg(paper(601,176,379,131)+paper(601,399,379,131),1)+
at(625,210,329,'修改前Prompt','label center',1)+at(625,438,329,'修改后Prompt','label center',1)+
at(598,326,385,'同样材料，同样请求','p-small center',1)+
svg(arrow(995,242,1075,242)+arrow(995,465,1075,465),2)+
at(1101,180,382,'完整资料：<br>20% → 25%','label',2)+at(1101,301,382,'缺少数据：<br>说明缺哪一项','label',2)+at(1101,422,382,'新对象：<br>30% → 20%','label',2)+
svg(rule(596),2)+at(17,621,1470,'检查：计算是否正确、结论有无扩大、缺失怎样处理、交付是否合用。','label strong',2));}};
R[47]={steps:3,render(){return feedbackMap(true);}};
})();

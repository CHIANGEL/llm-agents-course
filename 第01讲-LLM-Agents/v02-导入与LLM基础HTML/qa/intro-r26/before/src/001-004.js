(function(){
const R=window.MBA_RENDERERS=window.MBA_RENDERERS||{};
const at=(x,y,w,t,c='txt',s)=>`<div class="at ${c}" style="left:${x}px;top:${y}px;width:${w}px" ${s===undefined?'':`data-reveal="${s}"`}>${t}</div>`;
const svg=(t,s)=>`<svg class="c1-svg" viewBox="0 0 1504 718" aria-hidden="true" ${s===undefined?'':`data-reveal="${s}"`}>${t}</svg>`;
const paper=(x,y,w,h)=>`<path d="M${x} ${y} H${x+w-25} L${x+w} ${y+25} V${y+h} H${x} Z M${x+w-25} ${y} V${y+25} H${x+w}" fill="#fff" stroke="#003f98" stroke-width="2.5"/>`;
const arrow=(x,y,w,color='#0070c0')=>`<path d="M${x} ${y} h${w} m-13 -9 l13 9 -13 9" fill="none" stroke="${color}" stroke-width="3"/>`;
const person=(x,y,color)=>`<g transform="translate(${x},${y})"><circle cy="-7" r="6" fill="${color}"/><path d="M-10 11 V3 Q-10 -1 -5 -1 H5 Q10 -1 10 3 V11 Z" fill="${color}"/></g>`;
function table(x,y,n){let t=`<circle cx="${x}" cy="${y}" r="51" fill="#f3e5cc" stroke="#cab38b" stroke-width="2"/>`;for(let i=0;i<6;i++){const a=(-90+i*60)*Math.PI/180;const px=x+35*Math.cos(a),py=y+35*Math.sin(a);t+=i<n?person(px,py,'#0070c0'):`<circle cx="${px}" cy="${py}" r="10" fill="white" stroke="#887a66" stroke-width="1.8"/>`;}return t;}
R[1]={steps:2,render(s){return `<div class="c1-page">
${at(0,8,1450,'从模型生成回答，走到Agent执行任务。','c1-title')}
${at(0,84,1490,'Prompting组织输入，LLM生成内容，Agents执行并反馈。')}
${at(28,185,430,'生成回答','h2')}${at(595,185,390,'执行操作','h2')}${at(1100,185,390,'检查交付','h2')}
${svg(paper(20,260,460,275))}
${at(50,294,400,'今天的讲座取消了。','label black')}
${svg(arrow(62,367,343))}
${at(50,399,398,'原定于今天举行的<br>讲座已取消。','txt black')}
<img class="at" src="assets/app.png" alt="原课程中的应用程序图像" style="left:649px;top:276px;width:247px;height:207px">
${at(568,502,416,'读取文件 → 返回材料','label center',1)}
<img class="at" src="assets/doc.png" alt="原课程中的交付文档图像" style="left:1091px;top:284px;width:177px;height:193px">
${at(1284,304,207,'✓ 内容依据<br>✓ 文件可用<br>✓ 操作回执','label',1)}
${svg(arrow(503,395,91,'#c00000')+'<path d="M532 377 L566 413 M566 377 L532 413" stroke="#fff" stroke-width="9"/><path d="M532 377 L566 413 M566 377 L532 413" stroke="#c00000" stroke-width="5"/>')}
${svg(arrow(934,395,105),1)}
${at(28,596,1430,'模型提出的内容，要与程序执行和最终结果联系起来看。','txt strong',1)}

</div>`;}};
R[2]={steps:4,render(s){let tables='';for(let i=0;i<8;i++)tables+=table(77+(i%4)*160,189+Math.floor(i/4)*150,6);return `<div class="c1-page">
${at(0,0,1490,'活动共有50人，每桌最多6人，至少需要几张桌子？','h2')}
${at(0,78,700,'8桌坐满，共48人','txt strong')}${svg(tables)}
${svg(table(793,264,2),1)}${at(700,365,220,'剩下2人<br>还需要1桌','label center',1)}
${at(10,452,905,'8 × 6 ＋ 2 ＝ 50人<br>至少需要 <span class="red">9张桌子</span>','c1-title',1)}
${at(1048,89,430,'用程序计算','h2',2)}
${svg(paper(1018,160,435,102),2)}${at(1043,185,385,'向上取整（50 ÷ 6）','label black',2)}
${svg('<path d="M1234 277 V319 m-9 -13 l9 13 9 -13" fill="none" stroke="#0070c0" stroke-width="3"/>',2)}
${at(1043,335,385,'程序运行 → 返回 9','txt strong',2)}
${at(1043,414,385,'代码写出来，<br>还需要程序执行。','label',2)}
${at(10,589,1450,'如果任务还包括预订桌位，就需要进入预订系统，取得操作回执。','txt',3)}

</div>`;}};
R[3]={steps:1,render(){return `<div class="c1-page">
${at(20,2,1460,'1. LLM基础','h2 red')}
${at(83,63,1390,'逐Token连续生成、多轮消息与聊天模板','label')}
${at(20,134,1460,'2. Prompting','h2')}
${at(83,195,1390,'三个核心：交代任务；四类策略：澄清、学习、求解、决策','label')}
${at(20,268,1470,'3. Agents：Externalization & Internalization','h2')}
${at(83,327,1390,'外化：由模型外部系统承担工作　　内化：通过训练形成模型能力','label')}
${svg('<path d="M98 389 V644 M98 414 H132 M98 469 H132 M98 524 H132 M98 579 H132 M98 634 H132" fill="none" stroke="#7f9bc1" stroke-width="2.5"/>')}
${at(150,390,1300,'3.1 Agent与工具调用：执行操作、取得反馈','label')}
${at(150,445,1300,'3.2 Memory：保存、取回与更新信息','label')}
${at(150,500,1300,'3.3 Skills：保存和复用做事方法','label')}
${at(150,555,1300,'3.4 Harness：组织输入、工具与运行过程','label')}
${at(150,610,1300,'3.5 外化与内化：回看模型与系统的分工','label')}
</div>`;}};
R[4]={steps:3,render(s){return `<div class="c1-page">
${at(0,0,1490,'先理解生成机制，再看输入条件，最后核对输出依据。')}
${at(20,95,470,'1. 怎样生成回答','h2')}
${at(510,95,470,'2. 本次参考什么','h2',1)}
${at(1010,95,490,'3. 怎样核对结果','h2',2)}
<img class="at" src="assets/llm.png" alt="大语言模型" style="left:120px;top:184px;width:150px;height:161px">
${at(10,378,440,'已有前文 → 预测候选','label center')}
${at(10,435,440,'选中一个 → 追加前文','label center')}
${svg(paper(520,181,427,303),1)}
${at(551,215,360,'任务要求<br><br>相关材料<br><br>对话历史','label black',1)}
${svg(paper(1027,181,427,303),2)}
${at(1057,215,363,'原材料与输出逐项对照<br><br>数字、对象与含义<br><br>结论的适用范围','label black',2)}
${at(18,537,430,'生成：回答逐步形成。','label')}
${at(511,537,450,'上下文：提供生成条件。','label',1)}
${at(1014,537,470,'事实依据：支持输出结论。','label',2)}
${svg('<path d="M32 620 H1440" fill="none" stroke="#c5d4e5" stroke-width="2"/>',2)}
${at(20,651,1460,'上下文进入生成过程，生成的结果再回到材料中核对。','txt strong',2)}
</div>`;}};
})();

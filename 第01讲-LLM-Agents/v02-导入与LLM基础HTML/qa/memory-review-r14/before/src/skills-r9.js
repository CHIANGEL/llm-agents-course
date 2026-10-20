(function(){'use strict';
const R=window.MBA_RENDERERS,D=window.SKILLS_R9;
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const a=(x,y,w,t,c='sr9-text')=>`<div class="sr9-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const im=(x,y,w,h,n,alt)=>`<img class="sr9-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/skills-r9/${n}.png" alt="${e(alt||n)}">`;
const pre=(x,y,w,h,t)=>`<pre class="sr9-at sr9-pre" data-scroll-region tabindex="0" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${e(t)}</pre>`;
const lead=t=>a(0,0,1504,t,'sr9-lead'),bottom=t=>a(0,654,1500,t,'sr9-bottom');
const ul=(x,y,w,ls)=>a(x,y,w,'<ul>'+ls.map(s=>'<li>'+s+'</li>').join('')+'</ul>');
const page=h=>'<div class="sr9">'+h+'</div>',add=(n,f)=>R[7000+n]={steps:1,render:f};
const svg=s=>`<svg class="sr9-lines" viewBox="0 0 1504 718" aria-hidden="true"><defs><marker id="sr9-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M2 2 L9 6 L2 10" fill="none" stroke="#0070c0" stroke-width="2.5"/></marker></defs>${s}</svg>`;
const arrow=(x,y,X,Y)=>`<path d="M${x} ${y} L${X} ${Y}" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#sr9-arrow)"/>`;
const rule=y=>`<path d="M0 ${y} H1504" stroke="#c6d2de" stroke-width="1.5"/>`;
const table=(x,y,w,hs,rs)=>a(x,y,w,'<table class="sr9-table"><thead><tr>'+hs.map(t=>'<th>'+t+'</th>').join('')+'</tr></thead><tbody>'+rs.map(r=>'<tr>'+r.map(t=>'<td>'+t+'</td>').join('')+'</tr>').join('')+'</tbody></table>');
const doc=(x,y,w,title,body)=>a(x,y,w,'<h3>'+title+'</h3><p>'+body+'</p>','sr9-doc');
const part=(n,previous)=>a(0,0,1504,`已结束：${previous}　→　<b>接下来：${['','完整技能包','一次调用全过程','合成、评估与维护'][n]}</b>`,'sr9-part');
function smallFlow(y,labels){return labels.map((t,i)=>a(i*385,y,345,t,'sr9-h sr9-center')).join('')+svg(labels.slice(1).map((_,i)=>arrow(i*385+345,y+23,i*385+378,y+23)).join(''));}
add(1,()=>page(lead('Skills把程序性记忆中的“怎样做”，整理成可以按任务调用的<span class="sr9-red">方法包</span>。')+
a(0,115,430,'程序性记忆','sr9-h')+a(0,180,430,'保留经过积累的做法。<br>知道顺序、条件和判断标准。')+
svg(arrow(485,220,640,220))+doc(710,115,700,'Skill：让做法能够再次使用','何时使用 → 按什么步骤做<br>需要哪些材料 → 怎样检查结果')+
svg(rule(360))+
a(0,405,450,'① 完整技能包','sr9-h')+a(0,470,450,'方法如何变成<br>说明、参考、脚本与模板？')+
a(530,405,450,'② 一次调用','sr9-h')+a(530,470,450,'模型先看什么、再读什么？<br>工具怎样生成并检查文件？')+
a(1060,405,440,'③ 自己的Skills','sr9-h')+a(1060,470,440,'怎样提炼自己的方法？<br>怎样评估和持续维护？')+
bottom('先认识文件包，再走完一次调用，最后讨论怎样形成适合自己的Skills。')));
add(2,()=>page(lead('<span class="sr9-red">程序性记忆（Procedural memory）</span>：保留做事的方法、步骤和经验。')+
a(0,112,580,'记住“是什么”','sr9-h')+doc(0,180,580,'历史与事实','这次项目采用哪个预算。<br>用户偏好什么表达方式。')+
a(810,112,690,'记住“怎样做”','sr9-h')+doc(810,180,690,'程序性记忆','拿到材料后，先核对什么？<br>按什么顺序处理，如何判断完成？')+
svg(arrow(1140,340,1140,405))+doc(810,425,690,'独立组织为Skill','把适用条件、步骤、资源与检查标准<br>放到可发现、可读取的文件包里。')+
a(0,425,650,'Memory保存的信息中，<br>可以包含可复用的做法。<br><br>Skills把这些做法组织成独立入口。')+
bottom('文件中的方法被读入当前输入，影响本次生成；修改Skill文件不等于训练模型参数。')));
add(3,()=>page(part(1,'Skills的定位')+
a(0,75,1500,'用jupyter-notebook包看清：入口、具体做法和生成文件怎样连接。','sr9-lead')+
a(0,165,650,'Jupyter Notebook是什么？','sr9-h')+ul(0,235,660,['一份同时容纳说明文字与代码的文件。','可按单元逐段阅读和运行，保存结果。','这个Skill支持实验分析与教学教程。'])+
a(805,158,650,'<h3>Jupyter Notebook · .ipynb</h3><p>说明单元：这一步要做什么？</p><hr><code>代码单元：完成这一小步的计算</code><hr><p>输出区域：展示运行结果</p>','sr9-doc')+im(1350,170,60,60,'jupyter','Jupyter图标')+
a(0,530,1500,'入口说明　→　参考方法　＋　生成脚本　＋　Notebook模板','sr9-h sr9-center')+
bottom('先打开完整包，看清每个部分的作用；随后再观察模型实际读取了哪些文件。')));
const purposes=['名称与用途帮助匹配任务；正文说明步骤、资源位置与检查方法。','教程内容的组织方法：目标、分步说明、代码和常见问题。','实验与探索任务的组织方法。','Notebook文件结构与安全编辑规则。','交付前检查运行顺序、状态、输出与未完成内容。','按指定类型读取模板，替换标题并写出Notebook。','教程型Notebook的7单元起始结构。','实验型Notebook的起始结构。','客户端显示名称、简介、图标与默认请求。','小尺寸界面图标。','界面图标。','Apache-2.0许可文本。'];
function fileContent(i){const f=D.files[i];return f.image?`<img class="sr9-image-preview" src="${e(f.image)}" alt="${e(f.path)}"><pre class="sr9-pre" data-scroll-region tabindex="0">${e(f.text||f.path)}</pre>`:`<pre class="sr9-pre" data-scroll-region tabindex="0">${e(f.text)}</pre>`;}
function packageWidget(){return `<section class="sr9-widget sr9-package" data-sr9-widget="files"><div class="sr9-widget-list"><h2>jupyter-notebook / 12个文件</h2><div class="sr9-file-list" data-scroll-region tabindex="0">${D.files.map((f,i)=>`<button data-sr9-file="${i}" aria-pressed="${i===0}">${e(f.path)}</button>`).join('')}</div><button class="sr9-reset" data-sr9-reset>重置</button></div><div class="sr9-panel"><h2 data-sr9-heading>SKILL.md</h2><div class="sr9-panel" data-sr9-filebody style="flex:1">${fileContent(0)}</div><p data-sr9-caption>${purposes[0]}</p></div></section>`;}
add(4,()=>page(lead('从左侧选择文件；右侧查看原文、模板或图标。')+packageWidget()+bottom('入口文件组织方法；参考、脚本与模板为具体任务提供可取用的资源。')));
add(5,()=>page(lead('同一个SKILL.md，开头用于识别用途，后续正文给出具体工作方法。')+
a(0,105,715,'文件开头：什么时候用？','sr9-h')+pre(0,175,715,315,D.files[0].text.split('\n---\n')[0]+'\n---')+
a(830,105,670,'后续正文：怎样完成？','sr9-h')+ul(830,175,670,['判断实验（experiment）还是教程（tutorial）。','确定目标、对象与交付要求。','找到脚本、模板和对应参考。','生成后，按检查清单核对产物。'])+
svg(arrow(730,325,810,325))+
a(0,540,1495,'<span class="sr9-red">目录先提供名称、用途和入口；读取正文后，工作步骤才进入本次输入。</span>','sr9-sub')+
bottom('文件包已在磁盘上，不意味着它的所有内容已经进入模型。')));
add(6,()=>page(lead('沿着教程型Notebook的生成路径，分清“模型读方法”与“程序读模板”。')+
doc(0,125,640,'references / tutorial-patterns.md','模型读取：对象与目标、分步安排、<br>代码与说明怎样对应。')+doc(0,385,640,'scripts / new_notebook.py','模型发起工具调用，运行这段程序。<br>参数指定类型、标题与保存路径。')+
doc(900,125,600,'assets / tutorial-template.ipynb','程序读取：已排好单元的Notebook模板。')+doc(900,385,600,'output / … .ipynb','程序写出：替换标题后的Notebook骨架。')+
svg(arrow(320,315,320,365)+`<path d="M900 250 H765 V410 H655" stroke="#0070c0" stroke-width="3" fill="none" marker-end="url(#sr9-arrow)"/>`+arrow(655,510,880,510))+
a(675,465,205,'写文件','sr9-small sr9-center')+
bottom('参考帮助模型决定怎么做；脚本完成稳定操作；模板提供文件的起始结构。')));
add(7,()=>page(lead('技能包把一套做法与所需资源放在一起，并提供清楚的读取入口。')+
table(0,105,1500,['组成','回答的问题','jupyter-notebook中的对应'],[
['入口：名称、用途与路径','这次要不要用？','创建、搭建或编辑.ipynb'],['SKILL.md正文','按什么步骤完成？','分用途、选模板、生成、检查'],['参考、脚本与模板','细节在哪？哪些可重复使用？','教程方法、生成程序、7单元模板']])+
a(0,470,1500,'配置与图标服务于客户端展示；许可说明使用条件。','sr9-text')+
a(0,555,1500,'文件按需要组织。简单方法可以只写一份SKILL.md。','sr9-h')+
bottom('接下来把这些文件放回一次任务：到底先读什么，什么时候执行，怎样核对交付？')));
add(8,()=>page(part(2,'完整技能包')+pre(0,75,1500,135,D.items.user.text)+
a(0,255,1500,'同一个任务，沿着六个动作往下看','sr9-h')+
smallFlow(355,['看目录','读SKILL.md','读教程参考','运行生成脚本'])+
a(1060,455,440,'打开产物并检查','sr9-h sr9-center')+a(530,455,440,'回答用户','sr9-h sr9-center')+
svg(arrow(1320,405,1320,445)+arrow(1060,480,995,480))+
a(0,560,1500,'前两次读取逐层取得方法；脚本负责写文件；检查回到“先创建骨架”的要求。')+
bottom('两级渐进式披露：目录 → SKILL.md → 本次所需参考。')));

function keyText(k){
 if(k==='catalog')return '名称：jupyter-notebook\n用途：创建、搭建或编辑Notebook；支持实验与教程。\n\n入口文件：\n/workspace/course/.agents/skills/jupyter-notebook/SKILL.md';
 if(k==='result_skill')return '## Decision tree\n'+D.items[k].text.split('## Decision tree\n')[1].split('## Skill path')[0]+'## Reference map\n'+D.items[k].text.split('## Reference map\n')[1];
 if(k==='result_reference')return '教程内容的组织要求\n\n• 写明对象、前置知识和学习目标。\n• 先给大纲，再按小步解释与代码展开。\n• 将代码与结果解释配对。\n• 在Notebook内安排练习、答案骨架和常见错误。';
 if(k==='result_checklist')return '产物检查要求\n\n• 按从上到下的顺序检查运行与状态。\n• 输出保持简洁，控制图表与文字长度。\n• 标题、要点和说明应便于阅读。\n• 标清需要继续补充的内容。';
 if(k==='result_notebook')return D.notebook.cells.map((c,i)=>'单元'+(i+1)+' · '+(c.cell_type==='code'?'代码':'说明')+'\n'+c.source.join('')).join('\n\n');
 return D.items[k].text;
}
function keyCaption(k){return ({catalog:'目录先提供用途和路径；完整内容中保留英文用途说明。',result_skill:'本次选择tutorial；正文给出教程参考与检查清单的入口。',result_reference:'教程参考补充内容组织要求；按本次“先保留模板”的目标创建骨架。',result_checklist:'清单给出检查维度；本次先核对骨架文件和待补内容。',result_notebook:'读回7个单元后，才能核对标题与实际保留的模板内容。',call_skill:'模型生成读取命令；命令交给工具执行。',call_reference:'读取第二层详细材料，继续补充模型当前输入。',call_checklist:'先读取交付检查标准。',call_notebook:'再读取刚生成的文件，取得实际内容。',answer:'回答依据任务、工具返回与实际文件内容。'})[k]||'当前条目与前面的任务、工具返回一起保留。';}

function cumulative(view){const n=D.order.indexOf(D.end[view]);return D.order.slice(0,n+1);}
function trace(view,selected){return `<section class="sr9-widget" data-sr9-widget="trace" data-sr9-view="${view}" data-sr9-selected="${selected}" data-sr9-default="${selected}"><div class="sr9-widget-list"><h2>当前环节</h2>${D.groups[view].map(k=>`<button data-sr9-item="${k}" aria-pressed="${k===selected}">${e(D.items[k].label)}<span>${e(D.items[k].origin)}</span></button>`).join('')}<div class="sr9-stage-note">${({initial:'目录给出用途与入口。',skill:'第一次展开：目录 → 正文',reference:'第二次展开：正文 → 参考',verify:'先取得检查要求，再读取产物。',answer:'回答依据前面的任务和工具返回。'})[view]}</div><button class="sr9-reset" data-sr9-reset>重置</button></div><div class="sr9-panel"><div class="sr9-toolbar"><button data-sr9-mode="text" aria-pressed="true">关键内容</button><button data-sr9-mode="full" aria-pressed="false">完整内容</button><button data-sr9-mode="raw" aria-pressed="false">消息结构</button><button data-sr9-mode="all" aria-pressed="false">截至此处的内容</button></div><h2 data-sr9-heading>${e(D.items[selected].label)}</h2><pre class="sr9-pre" data-scroll-region tabindex="0" data-sr9-content>${e(keyText(selected))}</pre><p data-sr9-caption>${e(keyCaption(selected))}</p></div></section>`;}
add(9,()=>page(lead('用户要求创建教学用Notebook骨架；目录中的用途与这个任务匹配。')+trace('initial','catalog')+bottom('目录由客户端提供；模型接着生成读取SKILL.md的工具调用。')));
add(10,()=>page(lead('目录指向入口文件；工具读取后，工作步骤和资源位置进入后续输入。')+trace('skill','result_skill')+bottom('教学用途 → tutorial分支；正文进一步指向tutorial-patterns.md。')));
add(11,()=>page(lead('按照SKILL.md给出的路径，继续读取本次需要的教程参考。')+trace('reference','result_reference')+bottom('教程任务读取tutorial-patterns.md；实验分支的参考文件仍留在磁盘上。')));
add(12,()=>page(lead('模型生成运行请求；exec_command执行脚本，脚本再读取模板并写文件。')+
pre(0,87,1500,145,D.command)+
doc(0,285,420,'模型 → 工具','类型：tutorial<br>标题：Python列表与平均值<br>输出：指定.ipynb文件')+
doc(560,285,420,'程序执行','读取教程模板<br>替换首个标题<br>保存7个单元')+
doc(1120,285,380,'工具返回','Wrote …<br>python-lists-and-mean.ipynb<br>using kind=tutorial')+
svg(arrow(435,390,545,390)+arrow(995,390,1105,390))+
a(0,555,1500,'脚本直接使用模板；模型随后通过工具读取文件，才能看到产物内容。')+
bottom('这一步完成文件生成。返回的是保存路径；接下来还要打开文件检查。')));
add(13,()=>page(lead('知道文件位置之后，再取得检查要求和Notebook的实际内容。')+trace('verify','result_notebook')+bottom('检查清单给出标准；打开产物后，把实际内容与本次“骨架”要求对照。')));
const cellNames=['标题与对象','内容大纲','准备代码','步骤说明','正弦示例代码','模板中的练习栏目','模板中的答案代码'];
function notebookWidget(){return `<section class="sr9-widget sr9-notebook-widget" data-sr9-widget="notebook"><div class="sr9-widget-list"><h2>7个单元</h2>${D.notebook.cells.map((c,i)=>`<button data-sr9-cell="${i}" aria-pressed="${i===0}">${i+1}. ${cellNames[i]}</button>`).join('')}<button class="sr9-reset" data-sr9-reset>重置</button></div><div class="sr9-panel"><h2>python-lists-and-mean.ipynb</h2><div class="sr9-notebook"><div class="sr9-nb-head"><img src="assets/skills-r9/jupyter.png" alt="Jupyter">文件中的单元内容</div><div class="sr9-nb-cell"><label data-sr9-celltype>说明</label><pre class="sr9-pre" data-scroll-region tabindex="0" data-sr9-cellbody>${e(D.notebook.cells[0].source.join(''))}</pre></div></div><p data-sr9-caption>第1单元：标题已经替换；对象、前置知识与目标仍保留模板内容。</p></div></section>`;}
add(14,()=>page(lead('用户要求先保留模板：7个单元中，首个标题已改为“Python列表与平均值”。')+notebookWidget()+bottom('后续补充对象与目标，把正弦示例改成列表求平均值，再逐单元运行并检查结果。')));
add(15,()=>page(lead('对照用户最初要求，交代交付位置、文件内容与接下来的工作。')+trace('answer','answer')+bottom('文件生成、内容检查与代码运行是不同动作；本次交付停在创建骨架与查看内容。')));
add(16,()=>page(lead('渐进式披露把材料分层；工具调用把“读取方法”和“实际执行”连接起来。')+
a(0,100,450,'第一层：目录','sr9-h')+doc(0,165,450,'判断是否适用','名称、用途、入口路径')+
a(530,100,450,'第二层：SKILL.md','sr9-h')+doc(530,165,450,'取得做法','步骤、分支、资源入口')+
a(1060,100,440,'第三层：按需资源','sr9-h')+doc(1060,165,440,'取得具体材料','教程参考、检查清单')+
svg(arrow(460,230,515,230)+arrow(990,230,1045,230))+
a(0,380,1500,'模型：读取说明与参考　→　生成工具调用','sr9-h')+
a(0,460,1500,'程序：读取模板　→　写出文件　→　工具返回','sr9-h')+
a(0,540,1500,'模型：读回产物　→　按本次要求检查　→　回答用户','sr9-h')+
bottom('Skills说明方法，工具完成操作；记忆中的做法由此能够在新任务里重新使用。')));
add(17,()=>page(part(3,'一次Skill调用')+
a(0,75,1500,'自己的Skills：提炼已有做法，生成初稿，再用新的任务检验与修订。','sr9-lead')+
im(0,180,1500,415,'creation-cycle','已有工作、自然语言创建、组织文件、新任务试用、具体修改的循环')+
bottom('生成之后，重点检查：适合自己吗、能迁移吗、安全吗、变化后还有效吗？')));
add(18,()=>page(lead('两种应用都能辅助创建Skill；把已有成果和已确认的要求交代清楚。')+
a(0,90,680,'Codex','sr9-h')+a(0,145,680,'用 $skill-creator 发起创建或修改。','sr9-text')+
a(800,90,700,'Claude Code','sr9-h')+a(800,145,700,'安装官方skill-creator插件后，<br>用自然语言请求创建与改进。','sr9-text')+
pre(0,265,1500,335,D.creator)+bottom('创建工具本身也是Skill。初稿形成后，换一个新任务检查它。')));
add(19,()=>page(lead('主文件保留必要指导；只有内容较长或需要稳定执行时，才增加其他文件。')+
ul(0,95,1500,['SKILL.md写清适用条件、需要的输入、步骤和结果标准。','细节按需读取；稳定操作保存为脚本；固定结构保存为模板。'])+
im(170,255,1210,380,'file-structure','SKILL.md连接references、scripts、assets')+
bottom('把可复用的方法留下，把一次性的人名、金额、日期与临时条件留在具体任务里。')));
add(20,()=>page(lead('Star数量反映收藏关注；<span class="sr9-red">是否适合自己的任务</span>，要看实际输出。')+
a(0,105,620,'通用PPT或写作Skill','sr9-h')+ul(0,175,620,['可能按作者偏好的结构和文风组织。','版式漂亮，仍可能不适合你的听众。','统一规则也可能与你已经确认的要求冲突。'])+
a(780,105,720,'从自己的定稿与修改意见提炼','sr9-h')+pre(780,175,720,435,D.style)+
a(0,490,620,'把“我喜欢怎样写”变成有例子、<br>有适用范围的具体规则。','sr9-sheet sr9-text')+
bottom('同一份新材料，对比通用Skill、个人Skill与直接提示的结果，再决定采用哪一种。')));
add(21,()=>page(lead('换一个新输入，观察是否触发、怎样执行、产物是否达到你的标准。')+
table(0,100,1500,['检查','怎样看','发现问题后改哪里'],[
['选对了吗？','适用任务能选中；不适用任务不误用','名称、用途与触发条件'],['读对了吗？','找到正确参考，步骤和工具符合任务','分支、路径与操作说明'],['结果对了吗？','事实、文风、格式与交付要求一致','方法、模板与检查标准']])+
a(0,495,1500,'相同材料与要求　→　带Skill / 不带Skill　→　比较结果、返工与耗时','sr9-h sr9-center')+
a(0,575,1500,'换新会话检验，避免沿用创建Skill时已经交代过的背景。','sr9-text')+
bottom('判断依据是代表性任务的结果；“成功生成了SKILL.md”只是起点。')));
add(22,()=>page(lead('一个地方做出来的Skill，迁到另一个场景或应用后，要重新验证。')+
table(0,105,1500,['依赖什么','换环境时可能发生什么','迁移前核对'],[
['任务场景','受众、材料与交付标准变了','适用任务、输入和产物'],['模型','遵循方式与原有能力不同','指令是否仍有帮助'],['Harness：运行环境','工具、路径、依赖与权限不同','能否读取、执行并检查']])+
a(0,495,1500,'例如：能在本机写Notebook，不代表另一个应用也有相同文件路径和Python环境。','sr9-text')+
a(0,575,1500,'迁移顺序：检查依赖 → 调整入口与工具 → 用代表任务验证。','sr9-h')+
bottom('方法可以复用；运行条件需要适配。换了环境以后，重新看实际结果。')));
add(23,()=>page(lead('公共Skill包含文字指令，也可能附带脚本；导入时要看它会引导什么操作。')+
doc(0,120,430,'外部Skill包','SKILL.md中的指令<br>附带脚本<br>继续下载的外部内容')+
doc(550,120,430,'模型与工具','可能读取无关文件<br>访问外部地址<br>运行文件操作')+
doc(1100,120,400,'潜在影响','数据外传<br>文件被改写<br>操作超出任务范围')+
svg(arrow(440,245,535,245)+arrow(990,245,1085,245))+
a(0,405,1500,'实际影响取决于：文件权限、联网能力，以及执行前的确认机制。','sr9-risk-line sr9-text')+
ul(0,515,1500,['检查来源和版本；读正文与脚本，核对外部依赖。','先用不含敏感信息的材料，在受限环境验证行为。'])+
bottom('高Star与流行度不能替代内容审查；授权范围要与当前任务相称。')));
add(24,()=>page(lead('把Skill当作需要维护的工作方法：场景、模型或Harness变化后，重新检验。')+
table(0,100,1500,['变化','需要复查什么'],[
['场景变化','新材料、新受众、新交付标准，是否仍在适用范围内？'],['模型变化','旧做法是否仍能改善结果，还是已经多余、产生干扰？'],['Harness变化','工具名、文件路径、依赖和权限，是否仍然可用？']])+
a(0,470,1500,'已验证版本 → 新条件下复查 → 修改对应问题 → 重跑代表任务','sr9-h sr9-center')+
svg(arrow(1190,535,1190,575)+`<path d="M1190 575 H365 V535" stroke="#0070c0" fill="none" stroke-width="3" marker-end="url(#sr9-arrow)"/>`)+
a(520,590,530,'保留版本，必要时回退或停用','sr9-small sr9-center')+
bottom('修订时只加入可复用的规则，不把每一次偶然情况都扩展成通用要求。')));
add(25,()=>page(lead('自己的Skill是否值得保留，最终取决于它在自己任务中的作用。')+
im(0,100,1500,380,'creation-cycle','从已有工作创建初稿，再用新任务持续改进')+
a(0,520,460,'提炼：来自自己的有效做法','sr9-sub')+
a(530,520,450,'评估：比较实际结果','sr9-sub')+
a(1060,520,440,'维护：随条件变化复查','sr9-sub')+
bottom('适配自己的要求，检查外部内容与权限，保留经过验证的方法和版本。')));
add(26,()=>page(lead('Skills把程序性记忆组织成方法包，再借助工具，在新任务中重新使用。')+
a(0,105,450,'① 完整技能包','sr9-h')+a(0,175,450,'入口说明何时用，<br>正文与资源说明怎样做。')+
a(530,105,450,'② 一次调用','sr9-h')+a(530,175,450,'目录 → 正文 → 相关参考；<br>工具执行，再读回检查。')+
a(1060,105,440,'③ 自己的Skills','sr9-h')+a(1060,175,440,'从自己的有效做法提炼，<br>按任务结果评估与维护。')+
svg(rule(355))+
a(0,400,1500,'工具提供动作　　Memory保存信息　　Skills组织方法','sr9-h sr9-center')+
svg(arrow(750,465,750,530))+
a(0,555,1500,'接下来：Protocols约定应用怎样与外部工具和其他Agent交换信息。','sr9-sub sr9-center')+
bottom('方法能否落实为可靠交付，还取决于这些组件怎样配合。')));
function updateTrace(w){const v=w.dataset.sr9View,k=w.dataset.sr9Selected,mode=w.dataset.sr9Display||'text',it=D.items[k];w.querySelectorAll('[data-sr9-item]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sr9Item===k));w.querySelectorAll('[data-sr9-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sr9Mode===mode));w.querySelector('[data-sr9-heading]').textContent=mode==='all'?'按顺序保留的任务、目录与消息':it.label;const p=w.querySelector('[data-sr9-content]');p.textContent=mode==='all'?cumulative(v).map(id=>'【'+D.items[id].label+'】\n'+D.items[id].text).join('\n\n'):mode==='raw'?it.raw?JSON.stringify(it.raw,null,2):it.text:mode==='full'?it.text:keyText(k);p.scrollTop=0;w.querySelector('[data-sr9-caption]').textContent=mode==='all'?'已有内容按顺序保留；新增的工具返回加入后续输入。':keyCaption(k);}
function updateFile(w,i){w.querySelectorAll('[data-sr9-file]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.sr9File)===i));w.querySelector('[data-sr9-heading]').textContent=D.files[i].path;w.querySelector('[data-sr9-filebody]').innerHTML=fileContent(i);w.querySelector('[data-sr9-caption]').textContent=purposes[i];}
function updateCell(w,i){const c=D.notebook.cells[i];w.querySelectorAll('[data-sr9-cell]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.sr9Cell)===i));w.querySelector('[data-sr9-celltype]').textContent=c.cell_type==='code'?'代码':'说明';const p=w.querySelector('[data-sr9-cellbody]');p.textContent=c.source.join('');p.scrollTop=0;w.querySelector('[data-sr9-caption]').textContent=i===0?'第1单元：标题已经替换；对象、前置知识与目标仍保留模板内容。':i===4?'第5单元仍是正弦示例。后续把这段代码换成列表求平均值。':`第${i+1}单元保留模板内容。${c.cell_type==='code'?'代码单元待补齐主题内容后再运行。':'后续按主题补充说明。'}`;}
if(typeof document!=='undefined')document.addEventListener('click',ev=>{const b=ev.target.closest('[data-sr9-file],[data-sr9-cell],[data-sr9-item],[data-sr9-mode],[data-sr9-reset]');if(!b)return;const w=b.closest('[data-sr9-widget]');if(!w)return;ev.stopPropagation();if(w.dataset.sr9Widget==='files'){updateFile(w,b.hasAttribute('data-sr9-reset')?0:Number(b.dataset.sr9File));if(b.hasAttribute('data-sr9-reset'))w.querySelector('.sr9-file-list').scrollTop=0;}else if(w.dataset.sr9Widget==='notebook'){updateCell(w,b.hasAttribute('data-sr9-reset')?0:Number(b.dataset.sr9Cell));}else{if(b.hasAttribute('data-sr9-reset')){w.dataset.sr9Selected=w.dataset.sr9Default;w.dataset.sr9Display='text';}else if(b.hasAttribute('data-sr9-item')){w.dataset.sr9Selected=b.dataset.sr9Item;w.dataset.sr9Display='text';}else w.dataset.sr9Display=b.dataset.sr9Mode;updateTrace(w);}});
})();

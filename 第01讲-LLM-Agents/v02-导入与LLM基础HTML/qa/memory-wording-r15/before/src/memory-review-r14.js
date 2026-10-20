(function(){'use strict';
const R=window.MBA_RENDERERS,C=window.REVIEW_R14;
const a=(x,y,w,t,c='')=>`<div class="r14-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const im=(x,y,w,h,src,alt)=>`<img class="r14-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/${src}" alt="${alt}">`;
const lead=t=>a(0,0,1504,t,'r14-lead'),bottom=t=>a(0,655,1504,t,'r14-bottom');
const page=h=>'<div class="r14">'+h+'</div>',add=(id,fn)=>R[id]={steps:1,render:fn};
const dest=author=>(window.MBA_PLAN.find(p=>p.authoring_page===author)||{}).page;
for(const [id,c] of Object.entries(C))add(Number(id),()=>page(
 lead('已讲完：'+c.done)+
 a(0,103,900,c.rows.map((r,i)=>`<div class="r14-roadrow ${i===c.current?'r14-current':i<c.current?'r14-done':'r14-upcoming'}"><span class="r14-status">${i<c.current?'✓ 已结束':i===c.current?'→ 接下来':'稍后'}</span><div><strong><a class="r14-link" data-goto="${dest(c.targets[i])-1}" data-deck-goto="${dest(c.targets[i])-1}" href="#p=${dest(c.targets[i])}&s=1">${i+1}. ${r[0]}</a></strong><p>${r[1]}</p></div></div>`).join(''),'r14-roadrows '+(c.rows.length>3?'dense':''))+
 (c.name==='工具调用'?im(1000,230,145,145,'llm.png','模型')+im(1320,230,150,145,c.current===1?'protocols-r10/weather.png':'html-figures-r6/computer.png','外部工具')+a(1160,250,140,'调用 →<br>← 结果','r14-small')+a(980,407,515,c.current===1?'查询地点，返回天气':'读取界面，执行操作','r14-small'):im(980,140,515,350,c.image,c.name+'的组成与关系'))+
 a(980,510,510,c.name+'<br>回到本节的整体路线','r14-small')+
 bottom('<span class="r14-red">接下来：</span>'+c.next)));
function edge(x,y,X,Y,label,lx,ly,color='#0070c0'){return `<path d="M${x} ${y} L${X} ${Y}" fill="none" stroke="${color}" stroke-width="3" marker-end="url(#r14-arr${color==='#0070c0'?'a':'b'})"/><text class="edge-label" x="${lx}" y="${ly}">${label}</text>`;}
function node(x,y,w,text,color='#0070c0'){return `<rect x="${x}" y="${y}" width="${w}" height="58" rx="28" fill="white" stroke="${color}" stroke-width="3"/><text x="${x+w/2}" y="${y+38}" text-anchor="middle">${text}</text>`;}
add(6101,()=>page(lead('同一组材料：条目逐条保存事实；图谱沿着共同对象，把不同来源连起来。')+
 a(0,83,715,'文档A · 试点预算：20人、3个月、10万元','r14-doc')+
 a(765,83,735,'文档B · 安全要求：团队权限、企业账户','r14-doc green')+
 a(0,177,690,'条目库','r14-h')+a(800,177,700,'记忆图谱','r14-h')+
 a(0,244,680,'试点人数：20人；期限：3个月。<small>来源：文档A · 试点预算</small>','r14-entry')+
 a(0,349,680,'试点预算上限：10万元。<small>来源：文档A · 试点预算</small>','r14-entry')+
 a(0,454,680,'资料按团队授权；企业账户统一管理。<small>来源：文档B · 安全要求</small>','r14-entry')+
 a(0,559,680,'知识库：试点预算10万元；资料按团队授权。<small>一个条目也可以汇总两个来源：A＋B</small>','r14-entry')+
 `<svg class="r14-svg" viewBox="0 0 1504 718" aria-label="知识库连接试点预算与安全要求两个文档中的信息"><defs><marker id="r14-arra" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L9 5 L0 10" fill="#0070c0"/></marker><marker id="r14-arrb" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0 L9 5 L0 10" fill="#367859"/></marker></defs>`+
 edge(1020,404,1120,291,'开展 · A',1008,340)+edge(1240,273,1325,273,'预算 · A',1240,252)+edge(1200,302,1323,387,'期限 · A',1232,355)+
 edge(967,438,967,531,'授权 · B',858,497,'#367859')+edge(1080,433,1295,530,'账户 · B',1190,475,'#367859')+
 node(838,380,240,'企业知识库')+node(1085,244,155,'20人试点')+node(1325,244,170,'10万元')+node(1323,365,172,'3个月')+node(830,531,275,'按团队设置权限','#367859')+node(1205,531,290,'统一开通与停用','#367859')+'</svg>'+
 a(805,613,690,'同一个对象，把文档A与文档B的关系接起来。','r14-small')));
add(6104,()=>page(lead('用户愿意把任务交给智能体，平台也可能限制它的访问和操作。')+
 a(0,105,715,`<div class="source">Axios · 2026.09.21</div><h3>Amazon限制<br><span class="r14-red">Muse访问与购物</span></h3><div class="r14-gate"><span>Meta Muse</span><span class="r14-stop">→ ×</span><span>Amazon</span></div><p>平台设置智能体访问边界。</p><a href="https://www.axios.com/2026/09/21/amazon-meta-muse-ai-agentic-shopping" target="_blank" rel="noopener">阅读报道 ↗</a>`,'r14-news')+
 a(785,105,715,`<div class="source">界面新闻 · 2026.10.14</div><h3><span class="r14-red">151款应用</span>声明拒绝<br>豆包手机助手GUI操作</h3><p>微信、淘宝、美团等在列。<br>开发者可按协议声明拒绝。</p><p>限制的是自动操作，用户仍可手动使用App。</p><a href="https://www.jiemian.com/article/15189349.html" target="_blank" rel="noopener">阅读报道 ↗</a>`,'r14-news')+
 a(0,564,1500,'个人授权 → 智能体代办 → 平台是否允许 → 实际能否完成','r14-h')+
 bottom('入口的变化已带来实际限制；能操作界面，还要取得相应的访问和操作空间。')));
add(6106,()=>page(lead('保存、查询和采用已经讲清；还要看这些信息怎样进入一次<span class="r14-red">文本生成</span>。')+
 a(0,110,720,'打开Codex CLI的记忆实现','r14-h')+
 a(0,180,700,'<ul class="r14-list"><li>OpenAI开源的智能体应用，可查看客户端怎样组织输入。</li><li>这条读取路径以<span class="r14-red">摘要文件＋详细条目</span>为基础。</li><li>先提供要点与入口，再按任务读取细节：<span class="r14-red">渐进式披露</span>。</li></ul>')+
 a(820,105,670,'模型究竟看到了什么？','r14-h')+
 im(825,180,650,235,'memory-r8/cross-session.png','跨会话记录先保存，再加入下一次任务')+
 a(850,435,625,'① 文件在哪里？<br>② 谁把文本放进输入？<br>③ 读回之后，模型怎样继续？')+
 a(0,586,700,'<a class="r14-link" href="https://github.com/openai/codex" target="_blank" rel="noopener">GitHub · openai/codex ↗</a>','r14-small')+
 bottom('下面用采购评审，依次看文件目录、首次输入、工具读取、回答与新条件。')));
add(6107,()=>page(lead('记忆先以文件保存在磁盘上；摘要是入口，详细记录按主题放在子目录中。')+
 a(0,100,890,`<pre class="r14-tree">memories_v2/
├── memory_summary.md
└── rollout_summaries/
    ├── pilot-budget.md
    └── security-requirements.md</pre>`)+
 a(970,108,530,'<strong>memory_summary.md</strong><p>常用要点＋详细记录的路径<br>客户端先把摘要加入输入。</p>','r14-directory-note')+
 a(970,310,530,'<strong>rollout_summaries/</strong><p>预算范围、安全要求分别保存。<br>模型需要细节时，调用工具读取。</p>','r14-directory-note')+
 im(65,500,95,100,'doc.png','摘要文件')+a(195,524,630,'摘要中的路径 → 对应的详细文件','r14-h')+
 bottom('先认识位置和分工；下一页打开这三个文件，查看它们各自保存了什么。')));
})();

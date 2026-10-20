(function(){'use strict';
const R=window.MBA_RENDERERS,A='assets/agent-opening-r17/';
const at=(x,y,w,t,c='')=>`<div class="o17-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const im=(x,y,w,h,file,alt,c='')=>`<img class="o17-at ${c}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="${file.startsWith('assets/')?file:A+file}" alt="${alt}">`;
const lead=t=>at(0,0,1504,t,'o17-lead'),end=t=>at(0,656,1504,t,'o17-bottom');
const page=h=>`<div class="o17">${h}</div>`,add=(id,fn)=>R[id]={steps:1,render:fn};
const link=(url,text)=>`<a class="o17-source" href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;
const urls={
 finance:'https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/',
 booking:'https://github.com/browser-use/browser-use',
 arm:'https://people.csail.mit.edu/frankzydou/blog/so101-pen-pickup/index.html'
};
function video(name,label,duration,x=0,y=84,w=970,h=545){return `<div class="o17-at o17-media" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" data-video-region data-duration="${duration}">
<video preload="none" muted playsinline tabindex="0" aria-label="${label}" poster="${A+name}.jpg" src="${A+name}.mp4?v=r17-range"></video>
<div class="o17-media-error">视频未载入。请检查课件的assets目录是否完整。</div>
<div class="o17-controls"><button type="button" data-video-action="play" aria-label="播放${label}">播放</button><input type="range" min="0" max="${duration}" value="0" step="0.1" aria-label="${label}播放进度"><output class="o17-clock">0:00 / ${format(duration)}</output><select aria-label="${label}播放速度"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select><button type="button" data-video-action="mute" aria-label="开启${label}声音">静音</button><button type="button" data-video-action="expand" aria-label="放大${label}">放大</button></div></div>`;}
function format(t){t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');}
window.MBA_OPENING_VIDEO=video;
add(17001,()=>page(at(0,65,1504,`<div class="o17-compare">
<section><img src="assets/llm.png" alt="大语言模型"><h2>大模型：生成内容</h2><p>改写通知、解释概念、比较方案。<br>处理给定输入，生成回答。</p><p class="o17-overview-answer">能生成文本，但不能做事情</p></section>
<section><img src="${A}browser-booking.jpg" alt="Browser Use在网页上选择预约时段"><h2>软件智能体：执行任务</h2><p>查询数据、运行程序、操作网页。<br>依据执行结果继续下一步。</p><p class="o17-overview-answer">能做事情，但仅限于电子空间</p></section>
<section><img src="${A}astra-arm.jpg" alt="SO101机械臂抓取红笔"><h2>具身智能体：作用于物体</h2><p>通过传感器观察环境，<br>通过执行器移动、抓取物体。</p><p class="o17-overview-answer">究极愿景，物理世界交互</p></section>
</div>`)));
add(17002,()=>page(lead('没有连接工具时，模型处理收到的输入，生成输出。')+
at(0,99,710,'<h2>仍以前面的通知为例</h2>')+
at(0,166,690,'<small>任务</small>用一句正式英文通知大家：<br>原定于今天的讲座取消。','o17-paper')+
at(0,355,690,'<small>模型生成的内容</small>The lecture scheduled for<br>today has been cancelled.','o17-paper')+
at(0,550,690,'同样可以生成摘要、建议、分析或代码。<br>这些首先都是模型的输出。','o17-small')+
at(800,109,704,'<h2>发出通知，还需要外部操作</h2><ul><li>从通讯录取得收件人。</li><li>调用邮件系统，发送通知。</li><li>检查发送结果，处理失败。</li></ul>','o17-side')+
at(800,420,704,'<div class="o17-route"><img src="assets/llm.png" alt="模型"><span class="o17-cross">→ ×</span><img src="assets/app.png" alt="外部应用"><span>邮件系统</span></div>')+
at(802,560,680,'写出“已发送”，也不会让邮件自动发出。','o17-small')+
end('模型的输出经过工具执行，才能查询信息或改变外部系统。')));
add(17003,()=>page(lead('Magentic-One：查询标普500指数数据，再生成分析。')+
video('finance','财务数据分析视频',24.466667,0,84,825,558)+
at(890,92,610,'<h2>获取外界信息</h2><p class="o17-task">任务：概括指数近期的变化。</p><ul><li><b>生成程序：</b>确定取数和统计方法。</li><li><b>运行程序：</b>从数据服务取得数值。</li><li><b>读取结果：</b>依据返回数据生成分析。</li></ul>','o17-side')+
at(890,483,610,'<b>答案仍需检查：</b>指数的单位是“点”；视频最后的回答误用了美元符号。','o17-small')+
 at(890,595,610,link(urls.finance,'Microsoft Research · 2024.11'))+
end('新增的信息来自执行过程，并被送回模型；它不只使用训练时学到的知识。')));
add(17004,()=>page(lead('Browser Use：在预约网站寻找并选择可用时段。')+
video('browser-booking','网页预约视频',20.4)+
at(1020,91,480,'<h2>改变外部系统的状态</h2><ul><li>查看当前可选日期。</li><li>填写资料、选择时段。</li><li>提交后，页面显示预约成功。</li></ul><p>模型决定下一步；<br>浏览器执行点击和输入。</p>','o17-side')+
at(1020,546,470,link(urls.booking,'Browser Use · 公开演示'))+
end('一次任务往往需要多轮“观察 → 决定 → 执行 → 再观察”。')));
add(17005,()=>page(lead('智能体的操作范围，取决于它连接了什么，以及获准做什么。')+
im(0,99,710,330,'browser-booking.jpg','网页上的预约操作','o17-shot')+
im(805,99,699,330,'astra-arm.jpg','物理工作台上的机械臂','o17-shot')+
at(0,452,710,'<h2>软件中的操作</h2><p>浏览器和应用接口，可以查询、填表、修改文件。<br>是否能提交，还取决于账户、权限和网站规则。</p>')+
at(805,452,699,'<h2>物理环境中的动作</h2><p>抓取物体，需要摄像头、机械臂和控制程序。<br>只有浏览器或文件工具，无法完成抓取。</p>')+
end('软件操作可以间接影响现实；直接移动物体，还需要传感器与执行器。')));
add(17006,()=>page(lead('GPT-6 Astra＋SO101机械臂：找到红笔，抓起并保持。')+
video('astra-arm','机械臂抓笔视频',29.354667)+
at(1020,91,480,'<h2>观察实际动作</h2><ul><li>摄像头提供工作台画面。</li><li>模型编写、调整运动脚本。</li><li>控制程序驱动机械臂。</li><li>新的画面返回模型，继续调整。</li></ul>','o17-side')+
at(1020,502,480,'视频为原作者的 <b>50倍速</b>版本。<br>任务实际耗时 <b>22分钟</b>。','o17-small')+
at(1020,580,480,link(urls.arm,'Zhiyang Dou · 2026.09.13'))+
end('这里的“控制机械臂”，通过模型、视觉反馈和机器人控制程序共同完成。')));
add(17007,()=>page(lead('具身智能：让感知、决策与动作，在物理环境中形成循环。')+
im(0,102,660,373,'astra-arm.jpg','摄像头看到的机械臂、工作台和红笔','o17-shot')+
at(0,509,660,'摄像头提供物体的位置。<br>抓取失败或物体移动后，重新观察、调整。')+
at(740,92,760,`<h2>这个循环多了什么？</h2>
<ul><li><b>传感器：</b>把位置、图像等环境信息送入系统。</li><li><b>动作控制：</b>把任务要求转成硬件可执行的运动。</li><li><b>物理反馈：</b>检查是否碰到、抓住或移动了物体。</li></ul>
<p class="o17-red"><b>未来场景：</b>仓储搬运、生产操作、家庭服务。</p>`)+
end('从软件智能体扩展到具身智能体，需要把同一执行循环接到物理设备上。')));
add(17008,()=>page(
at(0,8,1504,'Agent = LLM + Harness','o17-equation')+
at(0,115,570,'<h2>LLM：理解任务，生成下一步</h2><p>根据任务和已有结果，<br>生成回答、计划或工具调用。</p>')+
im(165,290,155,160,'assets/llm.png','负责理解任务并生成下一步的模型')+
at(575,278,175,'请求 →<br>← 结果','o17-lead')+
at(790,110,714,`<div class="o17-harness"><h2>Harness：组织模型的工作过程</h2><ul><li>准备本次输入与可用工具。</li><li>执行操作，把结果返回模型。</li><li>保存状态，安排继续、停止和检查。</li></ul><div class="o17-strip"><img src="${A}browser-booking.jpg" alt="浏览器工具操作网页"><img src="${A}astra-arm.jpg" alt="机器人接口操作机械臂"></div></div>`)+
at(0,496,740,'<div class="o17-summary-row"><strong>单独调用模型</strong><span>输入 → 生成内容</span></div><div class="o17-summary-row"><strong>组织成智能体</strong><span>生成 → 执行 → 反馈 → 继续</span></div>')+
at(790,552,714,'<b>外化：</b>哪些工作由模型外部承担？<br><b>内化：</b>哪些做法可通过训练进入模型？','o17-bottom')+
end('接下来用“外化与内化”，整理模型能力与外部系统之间的分工。')));

if(typeof document==='undefined')return;
function sync(region){const v=region.querySelector('video'),button=region.querySelector('[data-video-action=play]'),duration=Number.isFinite(v.duration)?v.duration:Number(region.dataset.duration),range=region.querySelector('input');range.max=duration;range.value=v.currentTime;region.querySelector('output').textContent=format(v.currentTime)+' / '+format(duration);button.textContent=v.paused?'播放':'暂停';button.setAttribute('aria-label',(v.paused?'播放':'暂停')+v.getAttribute('aria-label'));}
document.addEventListener('click',async e=>{const region=e.target.closest('[data-video-region]');if(!region)return;const v=region.querySelector('video'),button=e.target.closest('[data-video-action]');if(e.target===v||button?.dataset.videoAction==='play'){if(v.paused){try{await v.play();}catch(_){region.classList.add('failed');}}else v.pause();sync(region);}if(button?.dataset.videoAction==='mute'){v.muted=!v.muted;button.textContent=v.muted?'静音':'有声';button.setAttribute('aria-label',(v.muted?'开启':'关闭')+v.getAttribute('aria-label')+'声音');}if(button?.dataset.videoAction==='expand'){document.dispatchEvent(new CustomEvent('mba-video-expand',{detail:region}));}});
document.addEventListener('input',e=>{const region=e.target.closest('[data-video-region]');if(!region||e.target.type!=='range')return;const v=region.querySelector('video');const t=Number(e.target.value);if(v.readyState===0){v.addEventListener('loadedmetadata',()=>{v.currentTime=t;sync(region);},{once:true});v.load();}else{v.currentTime=t;sync(region);}});
document.addEventListener('change',e=>{const region=e.target.closest('[data-video-region]');if(region&&e.target.tagName==='SELECT')region.querySelector('video').playbackRate=Number(e.target.value);});
document.addEventListener('keydown',e=>{const region=e.target.closest('[data-video-region]');if(!region)return;const v=region.querySelector('video');if(e.key==='Escape'){document.querySelector('#mount').focus();return;}if(e.target!==v)return;if(e.key===' '||e.key==='Enter'){e.preventDefault();region.querySelector('[data-video-action=play]').click();}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();v.currentTime=Math.max(0,Math.min(v.duration||Number(region.dataset.duration),v.currentTime+(e.key==='ArrowRight'?5:-5)));sync(region);}});
for(const name of ['loadedmetadata','timeupdate','play','pause','ended'])document.addEventListener(name,e=>{const r=e.target.closest?.('[data-video-region]');if(r)sync(r);},true);
document.addEventListener('error',e=>{const r=e.target.closest?.('[data-video-region]');if(r&&e.target.tagName==='VIDEO')r.classList.add('failed');},true);
})();

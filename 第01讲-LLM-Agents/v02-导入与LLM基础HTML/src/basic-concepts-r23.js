(function(){
'use strict';
const R=window.MBA_RENDERERS,A='assets/basic-concepts-r23/';
const at=(x,y,w,t,c='')=>`<div class="b23-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
R[23001]={steps:1,render:()=>`<div class="b23 b24-context">
${at(0,0,1504,'<b class="b24-red">Prompt：</b>用输入提示、引导模型，告诉它希望生成什么。','b24-definition')}
${at(0,55,1504,'<b>Context：</b>模型这次生成时使用的全部输入，包括当前要求与此前对话。','b24-definition')}
${at(0,115,900,'DeepSeek · 网页端','b23-label')}${at(1165,115,330,'豆包 · 手机端','b23-label')}
<figure class="b23-chat b24-web"><img src="assets/basic-mechanisms-r24/deepseek-multiturn.png" alt="DeepSeek两轮对话：先要求写讲座取消通知，再补充新的时间另行通知。"><div class="b24-context-outline"><strong>上下文 Context</strong></div><div class="b24-prompt-first"></div><div class="b24-prompt-last"><strong>提示词 Prompt</strong></div></figure>
<figure class="b23-chat b24-mobile"><img src="assets/basic-mechanisms-r24/doubao-multiturn.png" alt="豆包两轮对话，蓝框包含前三条消息，不包含最后一条助手回复。"><div class="b24-context-outline"><strong>上下文 Context</strong></div><div class="b24-prompt-first"></div><div class="b24-prompt-last"><strong>提示词 Prompt</strong></div></figure>
</div>`};
const rows=[
['OpenAI','GPT 系列','Codex'],
['Anthropic','Claude 系列（如 Opus）','Claude Code'],
['腾讯','混元 Hunyuan','WorkBuddy'],
['阿里巴巴','千问 Qwen','Qwen Code'],
['智谱','GLM 系列','ZCode']
];
R[23002]={steps:1,render:()=>`<div class="b23">
${at(0,0,1504,'Agent = LLM + Harness','b23-equation')}
<table class="b23-products"><thead><tr><th>公司</th><th>LLM · 生成内容的模型</th><th>智能体应用 · 包含 Harness</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(t=>`<td>${t}</td>`).join('')}</tr>`).join('')}</tbody></table>
${at(0,431,1504,'<b>ChatGPT</b> 是 OpenAI 的应用，<b>Codex</b> 是其面向执行任务的智能体产品；<br>两者都要调用模型。<b>GPT</b> 才是模型系列的名称。','b23-product-note')}
${at(0,533,1504,'同一个 Harness，也可以接入其他公司的模型','b23-cross-title')}
<div class="b23-cross-example" style="left:0"><strong>WorkBuddy 企业版</strong><span aria-label="连接">↔</span><b>GPT</b></div>
<div class="b23-cross-example" style="left:785px"><strong>Claude Code</strong><span aria-label="连接">↔</span><b>GLM</b></div>
${at(0,666,1504,'<b>LLM像驾驶员，Harness像汽车：</b>二者可以分别更换，但每个驾驶员都有熟悉的车型。','b23-condition')}
</div>`};
})();

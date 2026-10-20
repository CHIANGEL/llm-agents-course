(function(){
'use strict';
const R=window.MBA_RENDERERS,A='assets/basic-concepts-r23/';
const at=(x,y,w,t,c='')=>`<div class="b23-at ${c}" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
R[23001]={steps:1,render:()=>`<div class="b23">
${at(0,0,1504,'Prompt有“提示、引导”的意思：用输入告诉模型，你希望它生成什么。','b23-lead')}
${at(0,65,900,'DeepSeek · 网页端','b23-label')}
${at(1144,65,350,'豆包 · 手机端','b23-label')}
<figure class="b23-chat b23-web"><img src="${A}deepseek-web.png" alt="DeepSeek网页聊天：用户要求写一则讲座取消通知，下面是助手回复。"><div class="b23-prompt-outline"><strong>提示词 Prompt</strong></div></figure>
<figure class="b23-chat b23-mobile"><img src="${A}doubao-mobile.png" alt="豆包手机聊天：用户输入同一条通知要求，下面是助手回复。"><div class="b23-prompt-outline"><strong>提示词 Prompt</strong></div></figure>
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
${at(0,666,1504,'接入时，需要应用支持相应的模型接口，并完成账号或接口授权。','b23-condition')}
</div>`};
})();

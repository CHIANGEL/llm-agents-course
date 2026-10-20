(function(){'use strict';
const R=window.MBA_RENDERERS;
const picture=(name,alt,cls='')=>`<img class="hf-picture ${cls}" src="assets/html-figures-r6/${name}.png" alt="${alt}" draggable="false">`;
R[5008]={steps:1,render:()=>`<div class="hf hf-components">
<ul class="hf-points"><li><strong>工具调用：</strong>哪些查询、计算和操作交给外部程序？</li><li><strong>Memory</strong>保存信息，<strong>Skills</strong>提供做法，<strong>Protocols</strong>约定交互。</li></ul>
<div class="hf-component-table">${[['tool','扳手','工具调用','外部执行'],['memory','数据库','Memory','持续保存的信息'],['skill','灯泡','Skills','可复用做法'],['protocol','文档与齿轮','Protocols','共同交互规则']].map(([file,alt,name,result])=>`<div class="hf-component-row">${picture(file,alt)}<span class="hf-component-name">${name}</span>${picture('row-arrow','指向右侧的箭头','hf-row-arrow')}<span class="hf-component-result">${result}</span></div>`).join('')}</div>
${picture('brace','括号汇总四个组成部分','hf-brace')}<p class="hf-harness"><em>Harness</em><br>组织这些部分运行。</p><p class="hf-conclusion hf-left">本讲的讲授顺序。</p>
</div>`};
R[5009]={steps:1,render:()=>`<div class="hf hf-training">
<ul class="hf-points"><li>外部系统帮助完成任务，并留下可检查的交互过程。</li><li>经过选择的过程可以用于训练，让模型学会其中可重复使用的做法；是否学会还要测试。</li></ul>
<div class="hf-training-figure">
${picture('model','模型图案','hf-model')}${picture('computer','外部系统图案','hf-computer')}
<p class="hf-execute">借助外部系统完成任务</p>${picture('blue-arrow','从模型指向外部系统的蓝色箭头','hf-forward')}
<p class="hf-select">选择与训练</p><div class="hf-backward">${picture('red-arrow-head','从外部经验指回模型的红色箭头','hf-back-head')}${picture('red-arrow-shaft','','hf-back-shaft')}</div><p class="hf-experience">外部经验</p>
<p class="hf-model-label">更新后的模型</p><p class="hf-system-label">外部系统</p>
</div><p class="hf-conclusion">留下记录不会自动更新模型参数。</p>
</div>`};
R[5010]={steps:1,render:()=>`<div class="hf hf-recap">
<ul class="hf-points"><li>从清单和地图理解<em>外部表示</em>的作用，再区分模型、上下文与运行程序。</li><li>随后认识<em>工具、记忆、技能、协议</em>，并提出：哪些做法以后可以被模型学会？</li></ul>
<div class="hf-recap-figure">
${picture('list-map','清单与地图','hf-list-map')}${picture('next-arrow','进入模型、上下文与运行程序','hf-next-one')}
${picture('three-layers','模型网络、输入文档、运行程序','hf-layers')}
<div class="hf-layer-labels"><span>Weights</span><span>Context</span><span>Harness</span></div>
${picture('next-arrow','接入外化与内化','hf-next-two')}${picture('external-internal','模型与外部材料，通过蓝色向右和红色向左箭头连接','hf-external')}
<p class="hf-list-label">清单与地图</p><p class="hf-external-label">外化与内化</p>
<p class="hf-question hf-question-one"><em>外部表示</em>改变了什么？</p><p class="hf-question hf-question-two">模型、输入和程序各做什么？</p><p class="hf-question hf-question-three">哪些工作交出去，<br>哪些<em>可以学会</em>？</p>
</div></div>`};
})();

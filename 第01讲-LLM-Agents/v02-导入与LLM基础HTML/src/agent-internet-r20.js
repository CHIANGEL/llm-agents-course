(function(){'use strict';
const at=(x,y,w,text,cls='')=>`<div class="e20-at ${cls}" style="left:${x}px;top:${y}px;width:${w}px">${text}</div>`;
const img=(x,y,w,h,file,alt)=>`<img class="e20-at" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" src="assets/${file}" alt="${alt}">`;
const smallIcon=(kind)=>{
 if(kind==='map')return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 15 23 8 41 15 58 8v42l-17 7-18-7-17 7Z" fill="#e9f4ee" stroke="#427560" stroke-width="2.5"/><path d="M23 9v40M41 16v40" stroke="#83b39a" stroke-width="2"/><path d="M32 11c-7 0-12 5-12 12 0 9 12 20 12 20s12-11 12-20c0-7-5-12-12-12Z" fill="#006fb9"/><circle cx="32" cy="23" r="4.5" fill="white"/></svg>';
 return '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="27" cy="26" r="18" fill="#eef5fb" stroke="#006fb9" stroke-width="4"/><path d="m40 40 15 15" stroke="#006fb9" stroke-width="7" stroke-linecap="round"/><path d="M18 22h18M18 30h13" stroke="#7897b7" stroke-width="2.5"/></svg>';
};
window.MBA_RENDERERS[8017]={steps:1,render:()=>`<div class="e20">
${at(0,0,1504,'个人助手、平台服务智能体与第三方工具，可以逐步连接成一个生态。','e20-lead')}
${at(0,86,570,'个人助手 <span>Persona Agent</span>','e20-heading')}
${at(990,86,514,'平台服务智能体','e20-heading')}
<svg class="e20-links" viewBox="0 0 1504 590" aria-hidden="true">
 <defs><marker id="e20-arrow" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" viewBox="0 0 8 8" refX="6" refY="4" orient="auto-start-reverse"><path d="M0 0 8 4 0 8" fill="#0070c0"/></marker></defs>
 <path d="M86 210H141" stroke="#7c94ad" stroke-width="2.5" fill="none" marker-end="url(#e20-arrow)"/>
 <path d="M86 350H141" stroke="#7c94ad" stroke-width="2.5" fill="none" marker-end="url(#e20-arrow)"/>
 <path d="M555 210H592V350H555M945 210H912V350H945" stroke="#8ba5c1" stroke-width="2.5" fill="none"/>
 <path d="M604 280H900" stroke="#0070c0" stroke-width="3.5" fill="none" marker-start="url(#e20-arrow)" marker-end="url(#e20-arrow)"/>
 <path d="M320 412V472" stroke="#0070c0" stroke-width="3" fill="none" marker-start="url(#e20-arrow)" marker-end="url(#e20-arrow)"/>
 <path d="M1198 412V472" stroke="#0070c0" stroke-width="3" fill="none" marker-start="url(#e20-arrow)" marker-end="url(#e20-arrow)"/>
</svg>
${img(0,167,75,84,'agent-internet-r20/user-a.png','用户甲')}
${at(0,254,82,'用户甲','e20-user')}
${img(0,307,75,84,'agent-internet-r20/user-b.png','用户乙')}
${at(0,394,82,'用户乙','e20-user')}
${img(157,167,92,88,'protocols-r10/agent.png','用户甲的个人助手')}
${img(157,307,92,88,'protocols-r10/agent.png','用户乙的个人助手')}
${at(274,170,276,'<b>甲的个人助手</b><small>偏好、历史与当前任务</small>','e20-entity')}
${at(274,310,276,'<b>乙的个人助手</b><small>偏好、历史与当前任务</small>','e20-entity')}
${at(620,186,265,'A2A等','e20-protocol')}
${at(602,306,300,'委托任务 ⇄ 返回结果','e20-exchange')}
${img(955,143,124,130,'agent-internet-r20/local-service-agent.png','带配送帽和餐袋的本地生活服务智能体')}
${at(1090,170,414,'<b>本地生活：美团等</b><small>查找商家、订餐、配送</small>','e20-entity')}
${img(955,283,124,130,'agent-internet-r20/commerce-agent.png','带购物袋和包裹的电商服务智能体')}
${at(1090,310,414,'<b>电商：淘宝等</b><small>选购商品、订单服务</small>','e20-entity')}
${at(344,422,135,'MCP','e20-mcp')}
${at(1042,422,135,'MCP','e20-mcp')}
${at(140,489,1224,`<div class="e20-services"><b>第三方MCP服务</b><div class="e20-service">${smallIcon('map')}<span>地图</span></div><div class="e20-service"><img src="assets/protocols-r10/weather.png" alt=""><span>天气</span></div><div class="e20-service">${smallIcon('search')}<span>搜索</span></div><span class="e20-more">……</span></div>`)}
${at(0,605,1504,'用户入口可能从App转向<span class="e20-red">个人助手</span>；平台需要让服务能被助手找到和调用。','e20-conclusion')}
${at(0,663,1504,'生态能否形成，还取决于平台开放哪些服务、用户授予哪些权限。','e20-condition')}
</div>`};
})();

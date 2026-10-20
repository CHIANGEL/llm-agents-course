(function(){
'use strict';
const at=(x,y,w,text,cls='txt',step)=>`<div class="at p-text ${cls}" style="left:${x}px;top:${y}px;width:${w}px"${step===undefined?'':` data-reveal="${step}"`}>${text}</div>`;
const svg=(body,step)=>`<svg class="p-svg" viewBox="0 0 1504 718" aria-hidden="true"${step===undefined?'':` data-reveal="${step}"`}>${body}</svg>`;
const arrow=(x1,y1,x2,y2,color='#0070c0')=>{const a=Math.atan2(y2-y1,x2-x1),l=15;return `<path d="M${x1} ${y1} L${x2} ${y2} M${x2-l*Math.cos(a-.58)} ${y2-l*Math.sin(a-.58)} L${x2} ${y2} L${x2-l*Math.cos(a+.58)} ${y2-l*Math.sin(a+.58)}" fill="none" stroke="${color}" stroke-width="3"/>`;};
const paper=(x,y,w,h,fill='#fff')=>`<path d="M${x} ${y} H${x+w-25} L${x+w} ${y+25} V${y+h} H${x} Z M${x+w-25} ${y} V${y+25} H${x+w}" fill="${fill}" stroke="#003f98" stroke-width="2.5"/>`;
const rule=(y,x1=20,x2=1480)=>`<path d="M${x1} ${y} H${x2}" stroke="#c5d4e5" stroke-width="2"/>`;
window.PROMPT_VIS={at,svg,arrow,paper,rule,wrap:body=>`<div class="p-page">${body}</div>`};
})();

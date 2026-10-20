(function(){
'use strict';
window.AGENT_VIS={...window.PROMPT_VIS,
 img:(x,y,w,h,file,alt='',step)=>`<img class="at" src="assets/${file}" alt="${alt}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;object-fit:contain"${step===undefined?'':` data-reveal="${step}"`}>`
};
})();

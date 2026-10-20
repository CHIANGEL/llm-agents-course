const {chromium}=require('/Users/linjianghao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
(async()=>{
 const out=__dirname,log=[],errors=[]; const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--disable-background-networking']});
 const p=await b.newPage({viewport:{width:1600,height:900}});p.on('pageerror',e=>errors.push(e.message));p.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
 await p.goto('http://127.0.0.1:8765/#p=1&s=1');await p.evaluate(()=>document.fonts.ready);
 // Inventory precedes operation testing; inspect every live state with actual ArrowRight.
 const inventory=[];let previous='';for(let i=0;i<500;i++){
  const state=await p.evaluate(()=>({hash:location.hash,title:document.querySelector('#mount h1').textContent,controls:[...document.querySelectorAll('#mount button,#mount input,#mount select,#mount textarea,#mount details,#mount [role=button],#mount [role=slider],#mount [tabindex],#mount a')].map(n=>({tag:n.tagName,text:n.textContent,role:n.getAttribute('role')}))}));
  if(state.hash===previous)break;previous=state.hash;inventory.push(state);await p.keyboard.press('ArrowRight');
 }
 fs.writeFileSync(path.join(out,'controls-inventory-before.json'),JSON.stringify({states:inventory.length,body:inventory,shared:['prev','next','page-input','toc','notes','materials','zoom','fullscreen','hide','help','dialog-close','134 directory buttons','source anchors','zoom minus','zoom plus','diagram doubleclick']},null,2));
 await p.goto('http://127.0.0.1:8765/#p=25&s=1');
 await p.locator('[data-action=toc]').focus();await p.keyboard.press('Space');log.push({test:'Space on focused directory button',hash:p.url(),dialog:await p.locator('#deck-dialog').evaluate(n=>n.open),expected:'Directory opens; page/state unchanged'});await p.screenshot({path:path.join(out,'before-space.png')});
 await p.goto('http://127.0.0.1:8765/#p=25&s=1');await p.keyboard.press('Control+g');log.push({test:'Control+g modifier',dialog:await p.locator('#deck-dialog').evaluate(n=>n.open),expected:'Do not open course directory with browser modifier'});await p.keyboard.press('Escape');
 await p.keyboard.press('n');const local=await p.locator('#dialog-content a').first().getAttribute('href');await p.locator('#dialog-content a').first().click();await p.screenshot({path:path.join(out,'before-source.png')});log.push({test:'Local source link from HTTP preview',href:local,errors:[...errors]});await p.keyboard.press('Escape');
 await p.goto('http://127.0.0.1:8765/#p=25&s=1');await p.locator('#page-input').fill('2.5');await p.locator('#page-input').press('Tab');log.push({test:'Fractional page 2.5',url:p.url(),input:await p.locator('#page-input').inputValue(),errors:[...errors]});await p.screenshot({path:path.join(out,'before-decimal.png')});
 fs.writeFileSync(path.join(out,'controls-probe-before.json'),JSON.stringify({log,errors},null,2));console.log(JSON.stringify({states:inventory.length,inlineControls:inventory.filter(x=>x.controls.length),log},null,2));await b.close();
})().catch(e=>{console.error(e);process.exitCode=1});

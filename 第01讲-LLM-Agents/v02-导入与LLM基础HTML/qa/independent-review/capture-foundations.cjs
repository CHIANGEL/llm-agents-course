const {chromium}=require('/Users/linjianghao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
const root=path.resolve(__dirname,'../..'),dest=path.join(__dirname,process.argv[2]||'foundations-before');fs.mkdirSync(dest,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-first-run','--disable-background-networking']});
const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});const errors=[],states=[],readings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(pathToFileURL(path.join(root,'index.html')).href);await page.evaluate(()=>document.fonts.ready);await page.keyboard.press('Home');await page.keyboard.press('h');
while(true){const state=await page.evaluate(()=>window.deckAPI.getState());if(state.page>49)break;
const id=String(state.page).padStart(3,'0')+'-'+(state.step+1);
const screenshot=await page.screenshot({path:path.join(dest,id+'.png')});
const text=await page.locator('#mount').innerText();const controls=await page.locator('#mount .body').locator('button,input,select,textarea,a,details,[role=button],[tabindex],canvas').evaluateAll(ns=>ns.map(n=>({tag:n.tagName,text:n.textContent,role:n.getAttribute('role'),href:n.getAttribute('href')})));
states.push({...state,id,text,controls});
if(state.step===0){const before=await page.locator('#mount').innerHTML();await page.keyboard.press('m');const materials=await page.locator('#dialog-content').innerText();await page.locator('#dialog-content').evaluate(n=>n.scrollTop=n.scrollHeight);await page.keyboard.press('Escape');await page.keyboard.press('n');const notes=await page.locator('#dialog-content').innerText();const links=await page.locator('#dialog-content a').evaluateAll(ns=>ns.map(n=>({text:n.textContent,url:n.href})));await page.keyboard.press('Escape');const restored=before===await page.locator('#mount').innerHTML();readings.push({page:state.page,materials,notes,links,restored});}
if(state.step>0){await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowRight');const restored=await page.screenshot();if(!screenshot.equals(restored))errors.push('Visual state restoration '+id);}
await page.keyboard.press('ArrowRight');}
fs.writeFileSync(path.join(dest,'playback.json'),JSON.stringify({date:new Date().toISOString(),method:'Home then ArrowRight sequential playback; ArrowLeft/ArrowRight restore every intermediate and final state; M/N each page',states,readings,errors},null,2));await browser.close();console.log(JSON.stringify({states:states.length,pages:readings.length,errors}));
})().catch(e=>{console.error(e);process.exitCode=1;});

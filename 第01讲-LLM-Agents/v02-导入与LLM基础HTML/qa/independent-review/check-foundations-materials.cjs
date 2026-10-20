const {chromium}=require('/Users/linjianghao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
const root=path.resolve(__dirname,'../..'),dest=path.join(__dirname,process.argv[2]||'foundations-materials');fs.mkdirSync(dest,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-first-run','--disable-background-networking']});
const page=await browser.newPage({viewport:{width:1600,height:900}});await page.goto(pathToFileURL(path.join(root,'index.html')).href);await page.evaluate(()=>document.fonts.ready);await page.keyboard.press('Home');const results=[];
for(let p=1;p<=49;p++){
await page.keyboard.press('g');await page.locator(`[data-goto="${p-1}"]`).click();const state=await page.evaluate(()=>window.deckAPI.getState());
await page.keyboard.press('m');await page.locator('#deck-dialog').hover();const initialTop=await page.locator('#deck-dialog').evaluate(n=>n.scrollTop);await page.mouse.wheel(0,-100000);await page.waitForTimeout(100);const texts=[];let prev=-1,n=0;
while(true){const sc=await page.locator('#deck-dialog').evaluate(n=>({top:n.scrollTop,height:n.clientHeight,all:n.scrollHeight}));if(sc.top===prev)break;prev=sc.top;n++;await page.screenshot({path:path.join(dest,`${String(p).padStart(3,'0')}-material-${n}.png`)});texts.push(sc);if(sc.top+sc.height>=sc.all-2)break;await page.mouse.wheel(0,Math.max(200,sc.height-120));await page.waitForTimeout(100);}
const full=await page.locator('#dialog-content').innerText();await page.keyboard.press('Escape');await page.keyboard.press('n');await page.screenshot({path:path.join(dest,`${String(p).padStart(3,'0')}-notes.png`)});const notes=await page.locator('#dialog-content').innerText();await page.keyboard.press('Escape');
results.push({page:p,state,initialTop,scrolls:texts,material:full,notes,closed:!(await page.locator('#deck-dialog').evaluate(n=>n.open)),restored:JSON.stringify(state)===JSON.stringify(await page.evaluate(()=>window.deckAPI.getState()))});
}
fs.writeFileSync(path.join(dest,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({pages:results.length,materialViews:results.reduce((s,x)=>s+x.scrolls.length,0),allBottom:results.every(x=>{const s=x.scrolls.at(-1);return s.top+s.height>=s.all-2;}),closed:results.every(x=>x.closed&&x.restored)}));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});

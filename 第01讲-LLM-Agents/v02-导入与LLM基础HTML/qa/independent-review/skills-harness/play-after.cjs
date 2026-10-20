const {chromium}=require('/Users/linjianghao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
const root=path.resolve(__dirname,'../../..'),out=path.join(__dirname,'after/screens');fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-first-run','--disable-background-networking']});
const p=await b.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const errors=[],records=[],materials=[],notes=[],controls=[];
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await p.goto(pathToFileURL(path.join(root,'index.html')).href+'#p=89&s=1');await p.waitForFunction(()=>window.deckAPI);await p.evaluate(()=>document.fonts.ready);
while(true){
 let st=await p.evaluate(()=>window.deckAPI.getState()); if(st.page>134)break;
 const file=String(st.page).padStart(3,'0')+'-'+(st.step+1)+'.png';await p.locator('#mount').screenshot({path:path.join(out,file)});
 const text=await p.locator('#mount').innerText();const ct=await p.locator('#mount').locator('button,a,input,select,textarea,[role="button"],[onclick],[tabindex]').evaluateAll(ns=>ns.map(n=>({tag:n.tagName,text:n.textContent,role:n.getAttribute('role'),id:n.id})));
 records.push({...st,file,text});if(ct.length)controls.push({...st,controls:ct});
 if(st.step===0){
 await p.keyboard.press('m');const content=await p.locator('#dialog-content').innerText();materials.push({page:st.page,text:content});await p.locator('#dialog-content').screenshot({path:path.join(out,String(st.page).padStart(3,'0')+'-materials.png')});await p.keyboard.press('Escape');
 await p.keyboard.press('n');notes.push({page:st.page,text:await p.locator('#dialog-content').innerText(),links:await p.locator('#dialog-content a').evaluateAll(ns=>ns.map(n=>({text:n.textContent,href:n.getAttribute('href')})))});await p.keyboard.press('Escape');
 }
 const before=await p.locator('#mount').innerHTML();await p.keyboard.press('ArrowRight');const next=await p.evaluate(()=>window.deckAPI.getState());
 if(next.page===st.page&&next.step===st.step)break;
 await p.keyboard.press('ArrowLeft');const after=await p.locator('#mount').innerHTML();if(before!==after)errors.push('restore mismatch '+st.page+':'+st.step);
 await p.keyboard.press('ArrowRight');
}
fs.writeFileSync(path.join(__dirname,'after/playback.json'),JSON.stringify({method:'file URL start page 89; keyboard ArrowRight; each state ArrowLeft/ArrowRight restoration; per-page M and N open/Escape',records,materials,notes,controls,errors},null,2));
console.log(JSON.stringify({states:records.length,materials:materials.length,notes:notes.length,controls,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
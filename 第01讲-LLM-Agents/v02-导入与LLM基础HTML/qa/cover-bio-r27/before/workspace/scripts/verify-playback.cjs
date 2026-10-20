#!/usr/bin/env node
'use strict';
// Run from any directory. The course server must already be running.
// Optional: COURSE_URL, PLAYWRIGHT_MODULE, CHROME_PATH, VERIFY_OUTPUT.
const fs = require('fs');
const path = require('path');
const os = require('os');
const {pathToFileURL} = require('url');
const workspace = path.resolve(__dirname, '..');
const course = path.join(workspace, '第01讲-LLM-Agents/v02-导入与LLM基础HTML');
const output = path.resolve(process.env.VERIFY_OUTPUT || path.join(workspace, '00-课程规划/迁移记录/验证'));
const courseURL = process.env.COURSE_URL || 'http://127.0.0.1:8876/';
const configuredURL = new URL(courseURL);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(configuredURL.hostname)) throw Error('COURSE_URL must point to a local course server');
const modules = [process.env.PLAYWRIGHT_MODULE, 'playwright', path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
let playwright, loadedModule;
for (const candidate of modules) {
  try { playwright = require(candidate); loadedModule = candidate; break; } catch (_) {}
}
if (!playwright) throw Error('Playwright not installed. Set PLAYWRIGHT_MODULE to an existing installation; this script does not install dependencies.');
const chrome = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p));
fs.mkdirSync(path.join(output, 'screenshots'), {recursive: true});
const report = {
  started: new Date().toISOString(), courseURL, course, playwright: loadedModule, chrome: chrome || 'Playwright bundled Chromium',
  scope: 'New migration verification: actual browser rendering of every current slide over localhost and file://, plus listed interaction checks. External links and teaching/content accuracy are not reviewed.',
  checks: [], pages: {http: [], file: []}, interactions: [], videos: [], consoleErrors: [], pageErrors: [], resourceFailures: [], blockedExternalRequests: [], requests: [],
};
const ck = (name, pass, detail) => { report.checks.push({name, pass: Boolean(pass), ...(detail === undefined ? {} : {detail})}); if (!pass) console.error('FAIL', name, JSON.stringify(detail)); };
const safe = async (name, task) => { try { await task(); } catch (e) { ck(name, false, e.message); } };
let browser;
async function run() {
  browser = await playwright.chromium.launch({headless: true, ...(chrome ? {executablePath: chrome} : {}), args: ['--disable-background-networking']});
  report.browserVersion = browser.version();
  const context = await browser.newContext({viewport: {width: 1600, height: 980}, deviceScaleFactor: 1});
  // A copied slide deck must never need the source course server or a remote origin.
  await context.route('**/*', route => {
    const url = route.request().url();
    if (/^(data|blob|file):/.test(url) || new URL(url).origin === configuredURL.origin) return route.continue();
    report.blockedExternalRequests.push(url);
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  let mode = 'http';
  page.on('pageerror', error => report.pageErrors.push({mode, message: error.message}));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({mode, text: message.text()}); });
  page.on('request', request => report.requests.push({mode, url: request.url(), resourceType: request.resourceType()}));
  page.on('requestfailed', request => { if (!String(request.failure()?.errorText).includes('ERR_ABORTED')) report.resourceFailures.push({mode, url: request.url(), error: request.failure()?.errorText}); });
  page.on('response', response => { if (response.status() >= 400) report.resourceFailures.push({mode, url: response.url(), status: response.status()}); });
  const state = () => page.evaluate(() => window.deckAPI.getState());
  const jump = async n => { await page.locator('#page-input').fill(String(n)); await page.locator('#page-input').press('Enter'); await page.waitForFunction(n => window.deckAPI.getState().page === n, n); };
  const close = async () => { if (await page.locator('#deck-dialog').evaluate(n => n.open)) await page.locator('#dialog-close').click(); };
  const snap = async name => page.screenshot({path: path.join(output, 'screenshots', name + '.jpg'), type: 'jpeg', quality: 65});
  const waitImages = () => page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('#mount img')].map(im => im.decode().catch(() => {})));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  const inspect = () => page.evaluate(() => ({
    page: window.deckAPI.getState().page,
    state: window.deckAPI.getState(),
    title: document.querySelector('#mount h1')?.textContent,
    bodyCharacters: document.querySelector('#mount .body')?.innerText.length,
    imageCount: document.querySelectorAll('#mount img').length,
    brokenImages: [...document.querySelectorAll('#mount img')].filter(im => !im.complete || !im.naturalWidth).map(im => im.getAttribute('src')),
    hiddenTeachingElements: document.querySelectorAll('#mount [data-reveal].future').length,
    buttons: [...document.querySelectorAll('#mount button')].map(el => ({text: el.textContent.trim(), data: {...el.dataset}})),
    links: [...document.querySelectorAll('#mount a[href]')].map(el => ({text: el.textContent.trim(), href: el.getAttribute('href')})),
    videos: [...document.querySelectorAll('#mount video')].map(v => v.currentSrc || v.querySelector('source')?.src || v.getAttribute('src')),
  }));
  await page.goto(courseURL, {waitUntil: 'load'});
  const count = await page.evaluate(() => window.MBA_PLAN.length);
  ck('Current deck has 200 slides and 200 states', count === 200 && await page.evaluate(() => window.deckAPI.stateCount() === 200));
  report.plan = await page.evaluate(() => window.MBA_PLAN.map(p => ({page: p.page, title: p.title, renderer: p.renderer})));
  for (let n = 1; n <= count; n++) {
    if (n === 1) await jump(n);
    else await page.locator('[data-action=next]').click();
    await waitImages();
    const result = await inspect();
    report.pages.http.push(result);
    ck(`HTTP page ${n} renders fully`, result.page === n && Boolean(result.title) && result.brokenImages.length === 0 && result.hiddenTeachingElements === 0, {images: result.imageCount, broken: result.brokenImages});
    await snap('http-' + String(n).padStart(3, '0'));
    for (const action of ['materials', 'notes']) {
      await page.locator(`[data-action=${action}]`).click();
      ck(`HTTP page ${n} ${action} opens`, await page.locator('#deck-dialog').evaluate(d => d.open) && (await page.locator('#dialog-content').innerText()).length > 10);
      await close();
    }
    if (n % 25 === 0) console.log(`HTTP ${n}/${count}`);
  }
  await safe('Navigation interactions', async () => {
    await page.locator('#mount').focus();
    await page.keyboard.press('Home'); ck('Home reaches page 1', (await state()).page === 1);
    ck('Previous disabled on first page', await page.locator('[data-action=prev]').isDisabled());
    await page.keyboard.press('ArrowRight'); ck('ArrowRight advances', (await state()).page === 2);
    await page.keyboard.press('ArrowLeft'); ck('ArrowLeft returns', (await state()).page === 1);
    await page.keyboard.press('PageDown'); ck('PageDown advances', (await state()).page === 2);
    await page.keyboard.press('PageUp'); ck('PageUp returns', (await state()).page === 1);
    await page.keyboard.press('End'); ck('End reaches final slide', (await state()).page === count);
    ck('Next disabled on final page', await page.locator('[data-action=next]').isDisabled());
    for (let n = 1; n <= count; n++) {
      await page.locator('[data-action=toc]').click();
      await page.locator(`#dialog-content [data-goto="${n - 1}"]`).click();
      ck(`TOC destination ${n}`, (await state()).page === n && !(await page.locator('#deck-dialog').evaluate(d => d.open)));
    }
    await jump(3);
    const links = await page.locator('#mount [data-deck-goto]').evaluateAll(els => els.map(el => Number(el.dataset.deckGoto)));
    for (const destination of [...new Set(links)]) {
      await jump(3);
      await page.locator(`#mount [data-deck-goto="${destination}"]`).first().click();
      ck(`Agenda/footer link ${destination + 1}`, (await state()).page === destination + 1);
    }
    await jump(100);
    await page.locator('[data-action=zoom]').click();
    ck('Zoom dialog opens', await page.locator('.zoom-pane').count() === 1);
    for (let n = 0; n < 10; n++) await page.locator('[data-zoom=plus]').click();
    ck('Zoom maximum 300%', await page.locator('#zoom-value').innerText() === '300%');
    await snap('zoom-maximum');
    for (let n = 0; n < 12; n++) await page.locator('[data-zoom=minus]').click();
    ck('Zoom minimum 50%', await page.locator('#zoom-value').innerText() === '50%');
    await close(); ck('Zoom close preserves page', (await state()).page === 100);
  });
  // Exercise every available file, trace-item, and trace-mode button, without enumerating
  // every cross-product of item × mode. Record each actual operation.
  const attributes = ['mr8File', 'mr8Item', 'mr8Mode', 'mr8Update', 'sr9File', 'sr9Item', 'sr9Mode'];
  for (const entry of report.pages.http.filter(p => p.buttons.some(b => attributes.some(k => k in b.data)))) {
    await safe(`File/process controls page ${entry.page}`, async () => {
      await jump(entry.page);
      for (const attribute of attributes) {
        const htmlAttribute = 'data-' + attribute.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
        const values = await page.locator('#mount [' + htmlAttribute + ']').evaluateAll((els, key) => els.map(el => el.getAttribute(key)), htmlAttribute);
        for (const value of values) {
          const selector = '#mount [' + htmlAttribute + '=' + JSON.stringify(value) + ']';
          await page.locator(selector).click();
          const selected = await page.locator(selector).getAttribute('aria-pressed');
          const content = await page.locator('#mount').innerText();
          ck(`Page ${entry.page} ${htmlAttribute}=${value}`, selected === 'true' && content.length > 50);
          report.interactions.push({page: entry.page, attribute: htmlAttribute, value, selected});
        }
      }
      await snap('controls-' + entry.page);
    });
  }
  const decodingPage = report.pages.http.find(p => p.buttons.some(b => b.data.decView === 'lab'))?.page;
  await safe('Decoding controls', async () => {
    if (!decodingPage) throw Error('Decoding entry not found');
    await jump(decodingPage);
    await page.locator('#mount [data-dec-view=lab]').click();
    for (const preset of ['cool', 'warm', 'k3', 'p50', 'reset']) {
      await page.locator(`#mount [data-dec-preset=${preset}]`).click();
      ck('Decoding preset ' + preset, await page.locator(`#mount [data-dec-preset=${preset}]`).getAttribute('aria-pressed') === 'true');
    }
    for (const value of ['0', '1', '2', '3', '5', '10', '20', '50', '100']) {
      await page.locator('#mount [data-dec-param=top_k]').selectOption(value);
      ck('Decoding top-k ' + value, await page.locator('#mount [data-dec-param=top_k]').inputValue() === value);
    }
    for (const [param, value, expected] of [['temperature', '0.2', '0.2'], ['temperature', '2', '2.0'], ['top_p', '0.05', '0.05'], ['top_p', '1', '1.00']]) {
      await page.locator(`#mount [data-dec-param=${param}]`).evaluate((input, next) => { input.value = next; input.dispatchEvent(new Event('input', {bubbles: true})); }, value);
      ck(`Decoding ${param}=${value}`, await page.locator(`#mount [data-dec-value=${param}]`).innerText() === expected);
    }
    await snap('decoding');
    await page.locator('#mount [data-dec-view=base]').click();
    ck('Decoding returns to generation example', await page.locator('#mount [data-dec-view=lab]').count() === 1);
  });
  async function checkVideos(kind) {
    for (const entry of report.pages.http.filter(p => p.videos.length)) {
      await safe(`${kind} video page ${entry.page}`, async () => {
        await jump(entry.page);
        const video = page.locator('#mount video').first();
        await video.evaluate(v => v.load());
        await page.waitForFunction(() => { const v = document.querySelector('#mount video'); return v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0; });
        const metadata = await video.evaluate(v => ({src: v.currentSrc, duration: v.duration, width: v.videoWidth, height: v.videoHeight}));
        ck(`${kind} video page ${entry.page} metadata`, metadata.duration > 0 && metadata.width > 0, metadata);
        const seek = Math.min(5, metadata.duration / 2);
        await page.locator('#mount [data-video-region] input[type=range]').evaluate((input, next) => { input.value = String(next); input.dispatchEvent(new Event('input', {bubbles: true})); }, seek);
        await page.waitForFunction(t => { const v = document.querySelector('#mount video'); return Math.abs(v.currentTime - t) < 0.3 && !v.seeking; }, seek);
        ck(`${kind} video page ${entry.page} seek`, Math.abs(await video.evaluate(v => v.currentTime) - seek) < 0.3);
        await page.locator('#mount [data-video-action=play]').click();
        await page.waitForFunction(() => !document.querySelector('#mount video').paused);
        await page.locator('#mount [data-video-action=play]').click();
        ck(`${kind} video page ${entry.page} play/pause`, await video.evaluate(v => v.paused));
        await page.locator('#mount [data-video-region] select').selectOption('2');
        ck(`${kind} video page ${entry.page} speed`, await video.evaluate(v => v.playbackRate === 2));
        await page.locator('#mount [data-video-action=expand]').click();
        ck(`${kind} video page ${entry.page} expand`, await page.locator('#deck-dialog video').count() === 1);
        await close(); ck(`${kind} video page ${entry.page} restore`, await video.count() === 1);
        report.videos.push({mode: kind, page: entry.page, ...metadata, seek});
      });
    }
  }
  await checkVideos('http');
  mode = 'file';
  await context.setOffline(true);
  await page.goto(pathToFileURL(path.join(course, 'index.html')).href, {waitUntil: 'load'});
  for (let n = 1; n <= count; n++) {
    if (n === 1) await jump(n); else await page.locator('[data-action=next]').click();
    await waitImages();
    const result = await inspect(); report.pages.file.push(result);
    ck(`Offline file page ${n} renders fully`, result.page === n && Boolean(result.title) && result.brokenImages.length === 0 && result.hiddenTeachingElements === 0, {images: result.imageCount, broken: result.brokenImages});
    if ([1, 8, 90, 130, 172, count].includes(n)) await snap('offline-' + String(n).padStart(3, '0'));
    if (n % 50 === 0) console.log(`Offline file ${n}/${count}`);
  }
  await jump(130);
  await page.locator('[data-action=materials]').click();
  ck('Offline file complete materials opens', (await page.locator('#dialog-content').innerText()).length > 10);
  await close();
  await checkVideos('file');
  ck('No page JavaScript errors', report.pageErrors.length === 0, report.pageErrors);
  ck('No resource load failures', report.resourceFailures.length === 0, report.resourceFailures);
  ck('No remote or source-server dependencies requested', report.blockedExternalRequests.length === 0, report.blockedExternalRequests);
  ck('No browser console errors', report.consoleErrors.length === 0, report.consoleErrors);
}
run().catch(e => { report.fatalError = e.stack; ck('Verification completed', false, e.message); }).finally(async () => {
  if (browser) await browser.close().catch(() => {});
  report.finished = new Date().toISOString();
  report.summary = {
    checks: report.checks.length, passed: report.checks.filter(c => c.pass).length,
    failed: report.checks.filter(c => !c.pass).length,
    httpSlides: report.pages.http.length, offlineSlides: report.pages.file.length,
    fileAndProcessActions: report.interactions.length, videoInstances: report.videos.length,
    uniqueRequestedResources: new Set(report.requests.map(r => r.url)).size,
  };
  fs.writeFileSync(path.join(output, 'browser-verification.json'), JSON.stringify(report, null, 2) + '\n');
  const failed = report.checks.filter(c => !c.pass);
  const text = `# 迁移后浏览器验证\n\n日期：${new Date().toLocaleDateString('sv-SE', {timeZone: 'Asia/Shanghai'})}。当前工作目录独立副本；${report.browserVersion || 'Chrome 未成功启动'}。\n\n- HTTP：实际顺序渲染 ${report.summary.httpSlides} 页，每页检查标题、全部图片加载和默认完整显示，并逐页打开完整材料和讲者备注。\n- 离线：浏览器断网后通过 file:// 实际顺序渲染 ${report.summary.offlineSlides} 页。\n- 检查 ${report.summary.checks} 项，通过 ${report.summary.passed} 项，失败 ${report.summary.failed} 项。\n- 实际完成文件/过程控件操作 ${report.summary.fileAndProcessActions} 次；视频实例 ${report.summary.videoInstances} 个（HTTP与file分别记录）。\n- 覆盖翻页、首尾边界、全部目录目标、代表目录/进度跳转、放大、解码、Memory与Skills文件和过程切换、视频metadata/定位/播放暂停/速度/放大。\n- HTTP每页截图及代表交互截图位于 screenshots/；详细结果、错误、资源请求和实际操作见 browser-verification.json。\n\n浏览器请求限制在本课 localhost 同源，file 模式断网；不允许请求其他服务器。没有连接原MBA课件服务。\n\n本次是加载与操作验证，不是对200页内容与排版逐字人工审阅；未检查远程来源网站、其他操作系统和浏览器。未穷举各过程条目与显示模式的全部交叉组合，未逐秒观看视频。\n${failed.length ? '\n## 未通过项目\n\n' + failed.map(f => '- ' + f.name + '：' + JSON.stringify(f.detail)).join('\n') + '\n' : '\n本次检查未记录失败项。\n'}`;
  fs.writeFileSync(path.join(output, '浏览器验证说明.md'), text);
  console.log(JSON.stringify(report.summary, null, 2));
  process.exitCode = report.summary.failed ? 1 : 0;
});

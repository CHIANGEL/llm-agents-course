const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.resolve(__dirname, '../..'), w = {};
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
for (const f of ['src/prompting-r2-data.js', 'src/prompting-demo-data.js']) {
  vm.runInNewContext(read(f), { window: w });
}
const selected = JSON.parse(fs.readFileSync(path.join(__dirname, 'selection.json'))).pairs;
const runs = new Map(JSON.parse(fs.readFileSync(path.join(__dirname, 'browser-run-log.json'))).map(r => [r.key, r]));
const order = ['socratic', 'two-layer', 'reverse-deconstruction', 'horizontal-vertical', 'fact-checking',
  'expert-consultation', 'first-principles', 'cross-domain', 'steelman', 'minimum-experiment'];
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matches = (template, text) => {
  const pattern = '^' + template.split(/【[^】]*】/).map(escape).join('[\\s\\S]*?') + '$';
  return new RegExp(pattern).test(text);
};
const templateChecks = [];
for (const row of selected) {
  const i = order.indexOf(row.strategy);
  if (i >= 0) {
    const prompt = runs.get(row.strategy_key).prompt;
    const ok = matches(w.MBA_PROMPTING_R2.prompts[i].prompt, prompt);
    assert(ok, `Template changed: ${row.strategy}`);
    templateChecks.push({ strategy: row.strategy, exact_template_except_placeholders: ok });
  }
  if (row.prompt_generation_key) {
    assert(matches(w.MBA_PROMPTING_R2.metaprompt, runs.get(row.prompt_generation_key).prompt));
  }
}
const pairs = w.MBA_PROMPT_DEMOS;
assert.equal(pairs.length, 13);
assert.equal(pairs.reduce((n,p) => n + p.renderers.length, 0), 14);
const urls = pairs.flatMap(p => [p.simple_share_url, p.strategy_share_url, p.process_share_url].filter(Boolean));
assert.equal(urls.length, 27);
assert.equal(new Set(urls).size, 27);
assert(urls.every(u => /^https:\/\/chat\.deepseek\.com\/share\/[\w-]+$/.test(u)));
const wrapper = read('src/prompting-demo-links.js');
assert(wrapper.includes('target="_blank"'));
assert(wrapper.includes('rel="noopener noreferrer"'));
assert(!wrapper.includes('chatgpt.com'));
const slides = JSON.parse(read('slides.json'));
const pages = pairs.map(p => ({
  strategy: p.strategy, object: p.object,
  pages: p.renderers.map(id => slides.find(s => Number(s.renderer) === id)?.page),
}));
assert(pages.every(p => p.pages.every(Boolean)));
fs.writeFileSync(path.join(__dirname, 'static-checks.json'), JSON.stringify({
  date: '2026-10-21', pair_count: pairs.length, template_page_count: 14,
  distinct_deepseek_share_urls: 27, templates: templateChecks,
  open_in_new_tab: true, preserved_course_page_count: slides.length, pages,
}, null, 2) + '\n');
console.log(JSON.stringify({ pairs: pairs.length, links: urls.length, pages }));

#!/usr/bin/env node
'use strict';

// Rebuild in memory with all paths outside this workspace unavailable, then
// inspect the current playback resources. Only the requested JSON report is
// written to disk; the course and its generated files are never overwritten.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

function options(argv) {
  const result = {
    root: path.resolve(__dirname, '..'),
    course: '第01讲-LLM-Agents/v02-导入与LLM基础HTML',
    report: '00-课程规划/迁移记录/验证/independence.json',
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--no-report') result.report = null;
    else if (['--root', '--course', '--report'].includes(arg)) {
      if (!argv[i + 1]) throw new Error('Missing value for ' + arg);
      result[arg.slice(2)] = argv[++i];
    } else if (arg === '--help') {
      console.log('node scripts/verify-independence.cjs [--root WORKSPACE] [--course RELATIVE_PATH] [--report RELATIVE_PATH | --no-report]');
      process.exit(0);
    } else throw new Error('Unknown option: ' + arg);
  }
  result.root = fs.realpathSync(path.resolve(result.root));
  result.course = path.resolve(result.root, result.course);
  if (result.report) result.report = path.resolve(result.root, result.report);
  return result;
}

const config = options(process.argv.slice(2));
const inside = (root, file) => file === root || file.startsWith(root + path.sep);
if (!inside(config.root, config.course)) throw new Error('Course must be inside workspace');
if (config.report && !inside(config.root, config.report)) throw new Error('Report must be inside workspace');
const relative = file => path.relative(config.root, file);
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const cleanURL = url => url.split(/[?#]/)[0];
const isRemote = url => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url);

function virtualBuild() {
  const pending = new Map(), originals = new Map(), outsideProbes = new Set(), logs = [];
  const readable = file => {
    const absolute = path.resolve(String(file));
    if (!inside(config.root, absolute)) return false;
    return !fs.existsSync(absolute) || inside(config.root, fs.realpathSync(absolute));
  };
  const checked = file => {
    const absolute = path.resolve(String(file));
    if (!readable(absolute)) {
      outsideProbes.add(absolute);
      const error = new Error('Workspace-external path unavailable: ' + absolute);
      error.code = 'ENOENT';
      throw error;
    }
    return absolute;
  };
  const virtualFs = {
    readFileSync(file, encoding) {
      const absolute = checked(file);
      if (!pending.has(absolute)) return fs.readFileSync(absolute, encoding);
      const data = Buffer.from(pending.get(absolute));
      const name = typeof encoding === 'string' ? encoding : encoding?.encoding;
      return name ? data.toString(name) : data;
    },
    existsSync(file) {
      const absolute = path.resolve(String(file));
      if (!readable(absolute)) { outsideProbes.add(absolute); return false; }
      return pending.has(absolute) || fs.existsSync(absolute);
    },
    readdirSync(file, settings) { return fs.readdirSync(checked(file), settings); },
    statSync(file) { return fs.statSync(checked(file)); },
    writeFileSync(file, data) {
      const absolute = checked(file);
      if (!inside(config.course, absolute)) throw new Error('Build output outside course: ' + absolute);
      if (!originals.has(absolute)) originals.set(absolute, fs.existsSync(absolute) ? digest(fs.readFileSync(absolute)) : null);
      pending.set(absolute, Buffer.from(data));
    },
  };
  const permitted = { fs: virtualFs, path, vm, crypto };
  let error = null;
  try {
    vm.runInNewContext(fs.readFileSync(path.join(config.course, 'qa/build-data.cjs'), 'utf8'), {
      require(name) {
        if (!(name in permitted)) throw new Error('Unapproved build dependency: ' + name);
        return permitted[name];
      },
      __dirname: path.join(config.course, 'qa'),
      console: { log: (...args) => logs.push(args.join(' ')) },
    }, { filename: 'qa/build-data.cjs', timeout: 30000 });
  } catch (failure) { error = failure.message; }
  const diskChanges = [...originals].filter(([file, hash]) => (fs.existsSync(file) ? digest(fs.readFileSync(file)) : null) !== hash).map(([file]) => relative(file));
  const rebuilt = pending.get(path.join(config.course, 'slides.json'));
  const plan = rebuilt ? JSON.parse(rebuilt.toString()) : null;
  return {
    passed: !error && !diskChanges.length,
    error,
    mode: 'In-memory writes; workspace-external files treated as unavailable',
    pages: plan?.length ?? null,
    states: plan?.reduce((sum, p) => sum + p.playback.source_steps.length, 0) ?? null,
    virtual_write_count: pending.size,
    virtual_write_paths: [...pending.keys()].map(relative),
    actual_course_files_changed: diskChanges,
    unavailable_external_paths_probed: [...outsideProbes],
    logs,
  };
}

function playbackResources() {
  const root = config.course, html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const context = { window: {} }, references = [], errors = [], hashMismatches = [];
  vm.createContext(context);
  function collect(markup, base, origin) {
    for (const match of markup.matchAll(/\b(src|href|poster)=["']([^"']+)["']/g)) {
      references.push({ attribute: match[1], url: match[2].replace(/&amp;/g, '&'), base, origin });
    }
  }
  collect(html, root, 'index.html');
  for (const [, href] of html.matchAll(/<script src="([^"]+)"/g)) {
    const file = cleanURL(href);
    if (file.endsWith('/player.js')) continue;
    try { vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file, timeout: 30000 }); }
    catch (failure) { errors.push({ file, error: failure.message }); }
  }
  const plan = context.window.MBA_PLAN || [];
  let rendered = 0;
  for (const page of plan) {
    for (const state of page.playback.source_steps) {
      try {
        collect(context.window.MBA_RENDERERS[page.renderer ?? page.page].render(state), root, `page ${page.page}, source state ${state}`);
        collect(context.window.MBA_NAVIGATION.footer(page), root, `page ${page.page} footer`);
        rendered++;
      } catch (failure) { errors.push({ page: page.page, source_state: state, error: failure.message }); }
    }
  }
  for (const [page, entries] of Object.entries(context.window.MBA_FILES || {})) {
    for (const entry of entries) if (entry.href || entry.path) references.push({ attribute: 'href', url: entry.href || entry.path, base: root, origin: `page ${page} material` });
  }
  for (const page of plan.filter(p => p.show_sources !== false)) {
    for (const source of page.sources) {
      const entry = context.window.MBA_SOURCES[source.id];
      if (entry?.href || entry?.path) references.push({ attribute: 'href', url: entry.href || entry.path, base: root, origin: `page ${page.page} source ${source.id}` });
    }
  }
  const missing = [], outside = [], remote = new Set(), files = new Set(), expanded = new Set();
  for (let i = 0; i < references.length; i++) {
    const reference = references[i];
    if (isRemote(reference.url)) { if (/^https?:/.test(reference.url)) remote.add(reference.url); continue; }
    let filename;
    try {
      const urlPath = decodeURIComponent(cleanURL(reference.url));
      filename = urlPath.startsWith('/') ? path.resolve(root, '.' + urlPath) : path.resolve(reference.base, urlPath);
    } catch (failure) { errors.push({ origin: reference.origin, url: reference.url, error: failure.message }); continue; }
    const entry = { origin: reference.origin, url: reference.url, resolved: relative(filename) };
    files.add(filename);
    if (!inside(root, filename)) outside.push(entry);
    if (!fs.existsSync(filename)) { missing.push(entry); continue; }
    if (!inside(root, fs.realpathSync(filename))) outside.push(entry);
    if (expanded.has(filename)) continue;
    expanded.add(filename);
    if (/\.html?$/i.test(filename) && filename !== path.join(root, 'index.html')) collect(fs.readFileSync(filename, 'utf8'), path.dirname(filename), relative(filename));
    if (/\.css$/i.test(filename)) {
      for (const [, url] of fs.readFileSync(filename, 'utf8').matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) references.push({ attribute: 'css-url', url, base: path.dirname(filename), origin: relative(filename) });
    }
  }
  for (const [, file, expected] of html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))\?v=([^"&]+)"/g)) {
    const actual = digest(fs.readFileSync(path.join(root, file))).slice(0, 12);
    if (actual !== expected) hashMismatches.push({ file, expected, actual });
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'version_manifest.json'), 'utf8'));
  const states = plan.reduce((sum, page) => sum + page.playback.source_steps.length, 0);
  const countsMatch = plan.length === manifest.page_count && states === manifest.state_count && rendered === states;
  return {
    passed: countsMatch && !errors.length && !missing.length && !outside.length && !hashMismatches.length,
    pages: plan.length, states, rendered_states: rendered,
    manifest_counts_match: countsMatch,
    reference_instances: references.length,
    unique_local_resources: files.size,
    missing_resources: missing,
    references_outside_course: outside,
    renderer_errors: errors,
    asset_hash_mismatches: hashMismatches,
    remote_links: [...remote],
    scope: 'Current renderers, local CSS, material links, visible sources, and recursively linked local HTML readers; historical unreferenced webpage captures are excluded.',
  };
}

function symlinks(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) found.push({ path: relative(file), target: fs.readlinkSync(file) });
    else if (entry.isDirectory() && entry.name !== '.git') found.push(...symlinks(file));
  }
  return found;
}

const report = {
  checked_at: new Date().toISOString(),
  workspace: config.root,
  course: relative(config.course),
  build: virtualBuild(),
  playback: playbackResources(),
  symbolic_links: symlinks(config.course),
  limits: 'Static and in-memory verification only; browser layout, interactive controls, audio/video decoding, and external website availability require separate checks.',
};
report.passed = report.build.passed && report.playback.passed && report.symbolic_links.length === 0;
if (config.report) {
  fs.mkdirSync(path.dirname(config.report), { recursive: true });
  fs.writeFileSync(config.report, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: report.passed, build_passed: report.build.passed, build_error: report.build.error, playback_passed: report.playback.passed, pages: report.playback.pages, states: report.playback.states, local_resources: report.playback.unique_local_resources, report: config.report }, null, 2));
if (!report.passed) process.exitCode = 1;

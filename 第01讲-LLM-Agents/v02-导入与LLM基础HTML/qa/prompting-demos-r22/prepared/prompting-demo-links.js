/* Prepared only. Load after prompting-r2.js once reviewed shared chats exist. */
(function () {
  'use strict';
  const renderers = window.MBA_RENDERERS;
  const pairs = window.MBA_PROMPT_DEMOS || [];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const publicChat = value => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' &&
        ((url.hostname === 'chatgpt.com' && /^\/share\/[^/]+\/?$/.test(url.pathname)) ||
         (url.hostname === 'chat.deepseek.com' && /^\/share\/[^/]+\/?$/.test(url.pathname)));
    } catch (_) {
      return false;
    }
  };
  for (const pair of pairs) {
    if (pair.status !== 'reviewed' || !pair.shared_pages_verified ||
        !publicChat(pair.simple_share_url) || !publicChat(pair.strategy_share_url)) continue;
    for (const id of pair.renderers) {
      const renderer = renderers[id];
      if (!renderer) continue;
      const previous = renderer.render;
      renderer.render = function (...args) {
        const html = previous.apply(this, args);
        const top = ({ 302: 64, 303: 54, 304: 64, 314: 48 })[id] ?? 76;
        const title = esc(pair.object);
        const nav = `<nav class="pr-demo-links" style="top:${top}px" aria-label="${esc(pair.strategy)}案例对照">
          <span>案例对照</span>
          <a href="${esc(pair.simple_share_url)}" target="_blank" rel="noopener noreferrer" title="${title}：简单Prompt">简单Prompt ↗</a>
          <a href="${esc(pair.strategy_share_url)}" target="_blank" rel="noopener noreferrer" title="${title}：策略Prompt">策略Prompt ↗</a>
        </nav>`;
        return html.replace('<div class="pr-page">', '<div class="pr-page">' + nav);
      };
    }
  }
})();

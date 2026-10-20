(function () {
  'use strict';

  const renderers = window.MBA_RENDERERS = window.MBA_RENDERERS || {};
  const at = (x, y, w, text, cls = 'txt', step) =>
    `<div class="at c5-text ${cls}" style="left:${x}px;top:${y}px;width:${w}px"${step === undefined ? '' : ` data-reveal="${step}"`}>${text}</div>`;
  let svgCount = 0;
  const svg = (contents, step) => {
    const id = `c5-svg-${++svgCount}`;
    const body = contents.replaceAll('url(#c5-arrow-blue)', `url(#${id}-blue)`).replaceAll('url(#c5-arrow-red)', `url(#${id}-red)`);
    return `<svg class="c5-svg" viewBox="0 0 1504 718" aria-hidden="true"${step === undefined ? '' : ` data-reveal="${step}"`}><defs><marker id="${id}-blue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M1 1 L10 6 L1 11" fill="none" stroke="#0070c0" stroke-width="2"/></marker><marker id="${id}-red" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M1 1 L10 6 L1 11" fill="none" stroke="#c00000" stroke-width="2"/></marker></defs>${body}</svg>`;
  };
  // Paper shapes represent the actual text objects; words remain selectable HTML.
  const paper = (x, y, w, h) => `<path d="M${x} ${y} H${x + w - 30} L${x + w} ${y + 30} V${y + h} H${x} Z M${x + w - 30} ${y} V${y + 30} H${x + w}" fill="white" stroke="#003f98" stroke-width="2.2"/>`;
  const foot = text => at(18, 672, 1460, text, 'caption c5-foot');

  renderers[5] = {
    steps: 3,
    render(step) {
      const warning = step >= 2 ? ' c5-added-warning' : '';
      return `<div class="c5-page c5-p5">
        ${at(0, 0, 1460, '大语言模型（LLM）通过大量文本训练，可以根据输入要求生成文字。')}
        ${at(0, 82, 1460, '例如：把“今天的讲座取消了”改得正式一些。', 'txt c5-strong')}
        ${at(64, 164, 520, '原通知', 'h2')}
        ${svg(paper(44, 220, 520, 246))}
        ${at(82, 294, 448, '今天的讲座取消了。', 'c5-notice-text')}
        ${svg('<path d="M605 333 H752" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#c5-arrow-blue)"/>', 1)}
        ${at(612, 281, 140, '改写', 'label c5-center', 1)}
        ${at(826, 164, 610, '模型可能生成的改写', 'h2', 1)}
        ${svg(paper(804, 220, 642, 246), 1)}
        ${at(840, 251, 574, `原定于今天举行的<br>讲座已取消，<br><span class="c5-added${warning}">后续安排将另行通知。</span>`, 'c5-notice-text', 1)}
        ${svg('<path d="M1288 412 V489 H826" fill="none" stroke="#c00000" stroke-width="2.4"/><circle cx="1288" cy="412" r="5" fill="#c00000"/>', 2)}
        ${at(66, 511, 1390, '<span class="c5-red c5-strong">原文没有提供后续安排。</span>这句补充需要另外的依据。', 'txt', 2)}
        ${at(66, 581, 1390, '语言流畅，不代表内容准确。', 'c5-conclusion', 2)}
      </div>`;
    }
  };

  renderers[6] = {
    steps: 2,
    render(step) {
      const selected = step >= 1;
      return `<div class="c5-page c5-p6">
        ${at(0, 0, 1468, 'Token是模型处理文本的单位，不固定等于一个汉字或一个词。')}
        ${at(0, 58, 1468, '模型根据已有内容，预测下一Token，再按生成规则选出一个。')}
        ${at(18, 154, 400, '已有前文', 'h2')}
        ${svg('<path d="M18 230 H405 M18 370 H405" fill="none" stroke="#003f98" stroke-width="2"/>')}
        ${at(22, 258, 390, '这家餐厅的<br>味道很', 'c5-prefix')}
        ${svg('<path d="M424 304 H486" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#c5-arrow-blue)"/>')}
        ${at(510, 154, 590, '下一Token的候选', 'h2')}
        ${svg(`<path d="M620 227 V495 M620 495 H1060" fill="none" stroke="#003f98" stroke-width="1.8"/>
          <path d="M620 495 V503 M1060 495 V503" stroke="#003f98" stroke-width="1.8"/>
          <rect x="620" y="250" width="308" height="38" fill="#0070c0"/>
          <rect x="620" y="350" width="88" height="38" fill="${selected ? '#c00000' : '#0070c0'}"/>
          <rect x="620" y="450" width="44" height="38" fill="#0070c0"/>`)}
        ${at(514, 247, 96, '好', 'c5-bar-name')}
        ${at(514, 347, 96, '一般', `c5-bar-name${selected ? ' c5-red' : ''}`)}
        ${at(514, 447, 96, '差', 'c5-bar-name')}
        ${at(944, 248, 130, '70%', 'c5-bar-number')}
        ${at(726, 348, 130, '20%', `c5-bar-number${selected ? ' c5-red' : ''}`)}
        ${at(680, 448, 130, '10%', 'c5-bar-number')}
        ${at(611, 508, 80, '0', 'caption')}
        ${at(1016, 508, 100, '100%', 'caption')}
        ${svg('<path d="M834 369 H1154" fill="none" stroke="#c00000" stroke-width="2.5" marker-end="url(#c5-arrow-red)"/>', 1)}
        ${at(1168, 276, 310, '本次选中', 'label c5-red', 1)}
        ${at(1166, 337, 310, '一般', 'c5-picked c5-red', 1)}
        ${at(18, 591, 1450, '按概率选择时，概率较低的候选也可能被选中。', 'txt c5-strong', 1)}
      </div>`;
    }
  };

  renderers[7] = {
    steps: 3,
    render(step) {
      const selected = step >= 1;
      return `<div class="c5-page c5-p7">
        ${at(0, 0, 1468, '把选中的Token接到前文后，模型依据这份新前文，再预测下一个。')}
        ${at(20, 98, 760, '上一步选出“一般”，现在加入前文', 'label')}
        ${svg('<path d="M20 157 H748 M20 273 H748" fill="none" stroke="#003f98" stroke-width="2"/>')}
        ${at(26, 190, 726, '这家餐厅的味道很<span class="c5-appended">一般</span>', 'c5-running-text')}
        ${svg('<path d="M766 217 H853" fill="none" stroke="#0070c0" stroke-width="3" marker-end="url(#c5-arrow-blue)"/>')}
        ${at(874, 98, 600, '新的下一Token候选', 'h2')}
        ${svg(`<path d="M987 178 V410 M987 410 H1347" fill="none" stroke="#003f98" stroke-width="1.8"/>
          <rect x="987" y="192" width="234" height="36" fill="${selected ? '#c00000' : '#0070c0'}"/>
          <rect x="987" y="272" width="108" height="36" fill="#0070c0"/>
          <rect x="987" y="352" width="18" height="36" fill="#0070c0"/>`)}
        ${at(885, 186, 90, '，', `c5-punctuation${selected ? ' c5-red' : ''}`)}
        ${at(885, 266, 90, '。', 'c5-punctuation')}
        ${at(884, 350, 102, '其他', 'c5-bar-name')}
        ${at(1237, 190, 110, '65%', `c5-bar-number${selected ? ' c5-red' : ''}`)}
        ${at(1111, 270, 110, '30%', 'c5-bar-number')}
        ${at(1022, 350, 110, '5%', 'c5-bar-number')}
        ${at(970, 420, 80, '0', 'caption')}
        ${at(1303, 420, 100, '100%', 'caption')}
        ${svg('<path d="M1383 211 H1453 V507 H916" fill="none" stroke="#c00000" stroke-width="2.5" marker-end="url(#c5-arrow-red)"/>', 1)}
        ${at(22, 367, 730, '选中逗号后，继续接到完整前文后面', 'label c5-red', 1)}
        ${svg('<path d="M20 450 H888 M20 563 H888" fill="none" stroke="#003f98" stroke-width="2"/>', 1)}
        ${at(28, 483, 840, '这家餐厅的味道很一般<span class="c5-latest">，</span>', 'c5-running-text', 1)}
        ${svg('<path d="M450 574 V619" fill="none" stroke="#0070c0" stroke-width="2.8" marker-end="url(#c5-arrow-blue)"/>', 2)}
        ${at(522, 588, 900, '用这份新前文，继续预测。', 'txt c5-strong', 2)}
        ${foot('屏幕上一次显示的文字，不一定就是一个Token。')}
      </div>`;
    }
  };

  renderers[8] = {
    steps: 3,
    render(step) {
      return `<div class="c5-page c5-p8">
        ${at(0, 0, 1468, '“好”的生成概率，描述的是当前输入条件下模型怎样接着写。')}
        ${at(20, 103, 640, '下一Token的生成倾向', 'h2')}
        ${at(20, 169, 650, '前文：这家餐厅的味道很', 'txt')}
        ${svg('<path d="M72 253 V326 H572 M572 326 V334 M72 326 V334" fill="none" stroke="#003f98" stroke-width="1.8"/><rect x="72" y="266" width="350" height="44" fill="#0070c0"/>')}
        ${at(22, 261, 50, '好', 'c5-bar-name')}
        ${at(437, 264, 134, '70%', 'c5-bar-number')}
        ${at(60, 341, 80, '0', 'caption')}
        ${at(525, 341, 110, '100%', 'caption')}
        ${at(20, 416, 654, '它不是“这家餐厅有70%的概率味道好”。', 'txt c5-strong', 1)}
        ${svg('<path d="M687 287 H806" fill="none" stroke="#003f98" stroke-width="2.2"/><path d="M738 269 L758 305 M758 269 L738 305" fill="none" stroke="#c00000" stroke-width="3"/>', 1)}
        ${at(665, 333, 194, '不能直接换算', 'caption c5-red c5-center', 1)}
        ${at(884, 103, 610, '现实评价需要证据', 'h2')}
        ${svg(paper(882, 196, 544, 319) + '<path d="M916 285 H1388 M916 359 H1388 M916 433 H1388" stroke="#003f98" stroke-width="1.4" fill="none"/>')}
        ${at(914, 223, 480, '需要核对的记录', 'label c5-strong')}
        ${at(915, 300, 470, '谁评价的，评价哪家餐厅？', 'label')}
        ${at(915, 373, 470, '什么时间，记录了什么？', 'label')}
        ${at(915, 447, 470, '这些材料支持什么结论？', 'label')}
        ${at(20, 597, 1450, '核查现实事实，需要取得评论、记录或其他依据。', 'txt c5-strong', 2)}
      </div>`;
    }
  };
})();

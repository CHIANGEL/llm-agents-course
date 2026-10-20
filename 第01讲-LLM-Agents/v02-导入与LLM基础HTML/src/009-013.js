(function () {
  "use strict";
  window.MBA_RENDERERS = window.MBA_RENDERERS || {};
  var R = window.MBA_RENDERERS;
  var blue = "#003f98";
  var red = "#c00000";
  var gray = "#a7b0ba";

  function reveal(step) { return step == null ? "" : ' data-reveal="' + step + '"'; }
  function at(cls, x, y, w, html, step, extra) {
    return '<div class="at ' + cls + '" style="left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;' + (extra || "") + '"' + reveal(step) + ">" + html + "</div>";
  }
  function svg(page, label, body) {
    return '<svg class="c9-diagram" viewBox="0 0 1504 718" width="1504" height="718" role="img" aria-label="' + label + '">' +
      '<defs><marker id="c9-arrow-' + page + '" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="' + blue + '"/></marker>' +
      '<marker id="c9-red-arrow-' + page + '" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 Z" fill="' + red + '"/></marker></defs>' + body + "</svg>";
  }
  function path(page, d, step, color, dashed) {
    return '<path d="' + d + '" fill="none" stroke="' + (color || blue) + '" stroke-width="3.5"' +
      (dashed ? ' stroke-dasharray="9 7"' : "") + ' marker-end="url(#c9-' + (color === red ? "red-" : "") + "arrow-" + page + ')"' + reveal(step) + "/>";
  }
  function person(x, y, size, fill) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + size + ')" fill="' + fill + '">' +
      '<circle cx="16" cy="12" r="10"/><path d="M6 28 Q16 22 26 28 L30 50 Q30 54 26 54 L24 54 L22 80 L14 80 L14 55 L12 80 L4 80 L6 54 L2 54 Q-2 54 0 49 L4 31 Q4 29 6 28Z"/>' +
      "</g>";
  }
  function countPeople(x, y, dx, dy, scale) {
    var out = "";
    for (var i = 0; i < 20; i++) {
      out += person(x + (i % 10) * dx, y + Math.floor(i / 10) * dy, scale, i < 12 ? blue : gray);
    }
    return out;
  }
  function paper(x, y, w, h, stroke, fill) {
    var fold = 28;
    return '<path d="M' + x + "," + y + " H" + (x + w - fold) + " L" + (x + w) + "," + (y + fold) +
      " V" + (y + h) + " H" + x + ' Z" fill="' + (fill || "#fff") + '" stroke="' + (stroke || blue) + '" stroke-width="3"/>' +
      '<path d="M' + (x + w - fold) + "," + y + " V" + (y + fold) + " H" + (x + w) + '" fill="none" stroke="' + (stroke || blue) + '" stroke-width="3"/>';
  }
  function wrap(page, body) { return '<div class="c9-slide c9-p' + page + '">' + body + "</div>"; }

  R[9] = {
    steps: 3,
    render: function (step) {
      var diagram =
        '<path d="M330 60 H1174 Q1196 60 1196 82 V155 Q1196 177 1174 177 H800 L752 201 L752 177 H330 Q308 177 308 155 V82 Q308 60 330 60Z" fill="#f4f8fd" stroke="' + blue + '" stroke-width="3"/>' +
        '<line x1="752" y1="266" x2="752" y2="562" stroke="#c5d4e5" stroke-width="2"/>' +
        path(9, "M752 202 V230 H340 V278", 1) +
        path(9, "M752 202 V230 H1115 V278", 2) +
        '<g data-reveal="1"><path d="M90 545 H660" stroke="#c5d4e5" stroke-width="2"/></g>' +
        '<g data-reveal="2"><line x1="880" y1="450" x2="1410" y2="450" stroke="#c5d4e5" stroke-width="2"/><path d="M925 498 l14 14 l27 -32" fill="none" stroke="' + blue + '" stroke-width="6"/><path d="M1165 498 h40" stroke="' + red + '" stroke-width="6"/></g>';
      return wrap(9,
        svg(9, "同一条评论分别连向翻译任务和情感判断任务，展示不同输出", diagram) +
        at("c9-body", 0, 0, 1504, "评论不变，改变的是<span class=\"c9-red\">任务要求</span>。") +
        at("c9-quote", 333, 91, 838, "“菜品不错，但上菜很慢。”") +
        at("c9-task", 85, 292, 600, "任务一：<span class=\"c9-red\">翻译成英文</span>", 1) +
        at("c9-task", 830, 292, 600, "任务二：<span class=\"c9-red\">判断情感</span>", 2) +
        at("c9-english", 90, 349, 600, "The food was good,<br>but it took a long time<br>to arrive.", 1) +
        at("c9-answer", 830, 360, 600, "褒贬并存", 2) +
        at("c9-label", 874, 475, 225, "菜品不错", 2, "padding-left:100px;") +
        at("c9-label", 1120, 475, 330, "上菜很慢", 2, "padding-left:100px;") +
        at("c9-takeaway", 75, 590, 1370, "同一段材料，加上不同任务，可以生成不同形式的回答。", 2)
      );
    }
  };

  R[10] = {
    steps: 4,
    render: function (step) {
      var diagram =
        '<path d="M20 130 H484 Q505 130 505 151 V326 Q505 347 484 347 H52 L20 371 V347 H20 Q0 347 0 326 V151 Q0 130 20 130Z" fill="#f7fafe" stroke="' + blue + '" stroke-width="3"/>' +
        '<g data-reveal="1"><path d="M20 398 H484 Q505 398 505 419 V476 Q505 497 484 497 H52 L20 521 V497 H20 Q0 497 0 476 V419 Q0 398 20 398Z" fill="#fff8f8" stroke="' + red + '" stroke-width="3"/></g>' +
        paper(645, 130, 465, 370, blue, "#fff") +
        '<line x1="673" y1="206" x2="1082" y2="206" stroke="#c5d4e5" stroke-width="2"/>' +
        path(10, "M520 242 H620", 2) +
        path(10, "M520 448 H558 V313 H620", 2, red) +
        path(10, "M1127 305 H1181", 2) +
        '<g data-reveal="3"><line x1="0" y1="591" x2="1504" y2="591" stroke="#c5d4e5" stroke-width="2"/><path d="M730 624 H820" stroke="' + red + '" stroke-width="3" stroke-dasharray="8 6"/><circle cx="859" cy="625" r="24" fill="none" stroke="' + red + '" stroke-width="3"/><circle cx="1115" cy="625" r="24" fill="none" stroke="' + red + '" stroke-width="3"/></g>';
      return wrap(10,
        svg(10, "两轮对话中的费用和预算与新人数一起进入当前输入；只给新人数则缺少费用和预算", diagram) +
        at("c9-body", 0, 0, 1504, "相关历史，需要由应用整理进<span class=\"c9-red\">这一次的输入</span>。") +
        at("c9-heading", 0, 75, 520, "对话记录") +
        at("c9-label", 25, 151, 445, "首轮：准备一次读书会") +
        at("c9-condition", 25, 205, 445, "人数 <strong>30</strong> 人") +
        at("c9-condition", 25, 252, 445, "材料 10 元/人　茶点 12 元/人") +
        at("c9-condition", 25, 299, 445, "总预算 800 元") +
        at("c9-new-message", 25, 418, 460, "下一轮：<strong>人数改成36人</strong>", 1) +
        at("c9-heading", 647, 75, 465, "本次输入") +
        at("c9-label", 673, 153, 400, "已有条件＋最新修改", 2) +
        at("c9-input-row", 673, 235, 400, "<span>人数</span><strong class=\"c9-red\">36 人</strong>", 2) +
        at("c9-input-row", 673, 305, 400, "<span>每人费用</span><strong>10＋12 元</strong>", 2) +
        at("c9-input-row", 673, 375, 400, "<span>总预算</span><strong>800 元</strong>", 2) +
        at("c9-result-label", 1200, 145, 300, "合计", 2) +
        at("c9-number", 1190, 190, 310, "792<span>元</span>", 2) +
        at("c9-result-label", 1200, 306, 300, "余额", 2) +
        at("c9-number c9-red", 1190, 350, 310, "8<span>元</span>", 2) +
        at("c9-formula", 645, 520, 855, "36 ×（10＋12）＝792；800－792＝8", 2) +
        at("c9-label", 0, 605, 445, "<span class=\"c9-red\">如果只留下最新一句：</span>", 3) +
        at("c9-label", 455, 605, 300, "“人数改成36人”", 3) +
        at("c9-missing", 842, 603, 40, "?", 3) +
        at("c9-label", 900, 605, 200, "每人费用", 3) +
        at("c9-missing", 1098, 603, 40, "?", 3) +
        at("c9-label", 1155, 605, 250, "总预算", 3)
      );
    }
  };

  R[11] = {
    steps: 3,
    render: function (step) {
      var parameters = "";
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 5; col++) {
          parameters += '<rect x="' + (1187 + col * 42) + '" y="' + (290 + row * 39) + '" width="25" height="25" rx="3" fill="' + ((row + col) % 3 === 0 ? "#7ea8d0" : "#d5e4f3") + '" stroke="#789abb" stroke-width="1"/>';
        }
      }
      var diagram =
        '<path d="M38 233 V185 Q38 172 51 172 H165 L190 203 H345 Q359 203 359 217 V455 H38Z" fill="#e4effa" stroke="' + blue + '" stroke-width="3"/>' +
        paper(80, 225, 240, 177, blue, "#fff") +
        '<path d="M25 280 H365 L340 470 H50Z" fill="#c5def5" stroke="' + blue + '" stroke-width="3"/>' +
        paper(555, 165, 422, 330, blue, "#fff") +
        '<rect x="1143" y="165" width="317" height="330" rx="28" fill="#f8fbff" stroke="' + blue + '" stroke-width="3"/>' +
        '<g data-reveal="1"><path d="M389 317 H522" fill="none" stroke="' + blue + '" stroke-width="4" marker-end="url(#c9-arrow-11)"/></g>' +
        path(11, "M996 317 H1113", 2) +
        '<g data-reveal="2">' + parameters + "</g>" +
        '<g data-reveal="1"><line x1="583" y1="260" x2="949" y2="260" stroke="#c5d4e5" stroke-width="2"/></g>';
      return wrap(11,
        svg(11, "读书会记录在外部文件夹中，读取摘录后进入当前输入；模型参数在另一个位置", diagram) +
        at("c9-body", 0, 0, 1490, "当前上下文，就是<span class=\"c9-red\">这次实际提供给模型</span>的内容。") +
        at("c9-heading", 20, 92, 365, "外部保存") +
        at("c9-heading", 555, 92, 422, "本次输入") +
        at("c9-heading", 1143, 92, 317, "模型") +
        at("c9-file-title", 64, 325, 270, "读书会记录") +
        at("c9-label", 53, 480, 320, "磁盘或应用中的文件") +
        at("c9-label", 583, 193, 365, "当前要求", null) +
        at("c9-label", 583, 283, 365, "读取到的记录摘录", 1) +
        at("c9-excerpt", 583, 337, 365, "人数：36人<br>费用：22元/人<br>预算：800元", 1) +
        at("c9-small", 382, 239, 155, "读取相关<br>内容", 1) +
        at("c9-small", 993, 246, 139, "提供输入", 2) +
        at("c9-parameter-label", 1161, 203, 280, "训练得到的参数", 2) +
        at("c9-small c9-center", 1161, 424, 280, "模型内部的数值", 2) +
        at("c9-takeaway", 16, 563, 1470, "读取一份材料，改变的是<span class=\"c9-red\">本次输入</span>。", 1) +
        at("c9-body", 16, 621, 1470, "这一轮补充材料，通常不会直接修改模型参数。", 2)
      );
    }
  };

  R[12] = {
    steps: 4,
    render: function (step) {
      var errorClass = step >= 2 ? "c9-error-word c9-underlined" : "c9-error-word";
      var diagram =
        countPeople(25, 98, 56, 110, 0.90) +
        '<line x1="618" y1="16" x2="618" y2="517" stroke="#c5d4e5" stroke-width="2"/>' +
        '<g data-reveal="1"><line x1="660" y1="252" x2="1475" y2="252" stroke="#c5d4e5" stroke-width="2"/></g>' +
        '<g data-reveal="2">' +
        path(12, "M1045 320 H1120", null, red) +
        path(12, "M1045 399 H1120", null, red) + "</g>" +
        '<g data-reveal="3"><line x1="0" y1="555" x2="1504" y2="555" stroke="' + blue + '" stroke-width="2"/></g>';
      return wrap(12,
        svg(12, "20位受访同学的人形计数，其中12位蓝色代表愿意试用，其余8位灰色；错误摘要扩大对象并改变为付费", diagram) +
        at("c9-heading", 0, 8, 600, "访谈对象：20位同学") +
        at("c9-count-label", 0, 330, 360, "<span class=\"c9-legend-dot\"></span>12位愿意试用") +
        at("c9-count-label", 360, 330, 235, "<span class=\"c9-legend-dot c9-gray-dot\"></span>其余8位") +
        at("c9-fraction", 12, 392, 580, "12 ÷ 20 ＝ 60%", 1) +
        at("c9-body c9-black", 0, 468, 580, "没有询问价格或付费意愿。") +
        at("c9-error-label", 660, 19, 805, "错误摘要", 1) +
        at("c9-error-sentence", 660, 83, 805, "“60%的<span class=\"" + errorClass + "\">大学生</span>愿意<br>为这款应用<span class=\"" + errorClass + "\">付费</span>。”", 1) +
        at("c9-mismatch-name", 660, 294, 150, "对象扩大", 2) +
        at("c9-mismatch-source", 835, 294, 220, "受访同学", 2) +
        at("c9-mismatch-target", 1150, 294, 300, "大学生", 2) +
        at("c9-mismatch-name", 660, 373, 150, "含义改变", 2) +
        at("c9-mismatch-source", 835, 373, 220, "愿意试用", 2) +
        at("c9-mismatch-target", 1150, 373, 300, "愿意付费", 2) +
        at("c9-small", 660, 466, 815, "计算没有错，错误发生在对象与含义上。", 2) +
        at("c9-correct-label", 0, 579, 255, "可支持的摘要", 3) +
        at("c9-correct-sentence", 280, 571, 1210, "20位受访同学中，12位愿意试用，占60%；<br><span class=\"c9-red\">付费意愿尚未调查。</span>", 3)
      );
    }
  };

  R[13] = {
    steps: 3,
    render: function (step) {
      var diagram =
        '<line x1="0" y1="254" x2="1504" y2="254" stroke="#c5d4e5" stroke-width="2"/>' +
        '<line x1="0" y1="454" x2="1504" y2="454" stroke="#c5d4e5" stroke-width="2"/>' +
        path(13, "M365 149 H414", null) +
        path(13, "M650 149 H683", null, red) +
        '<path d="M202 196 H810" fill="none" stroke="' + blue + '" stroke-width="2"/>' +
        paper(205, 289, 555, 128, blue, "#f8fbff") +
        countPeople(212, 489, 23, 53, 0.40) +
        '<g data-reveal="2">' + path(13, "M570 565 H650", null, red) + "</g>";
      return wrap(13,
        svg(13, "生成、上下文和事实依据：已有前文经过候选选择后追加文字；读书会条件进入本次输入；访谈摘要核对对象与含义", diagram) +
        at("c9-body", 0, 0, 1495, "理解LLM，回到三个问题：怎样生成、依据哪些输入、事实是否成立。") +
        at("c9-summary-label", 0, 117, 185, "生成") +
        at("c9-small c9-center", 202, 87, 156, "已有前文") +
        at("c9-small c9-center", 424, 87, 220, "下一Token候选") +
        at("c9-small c9-center", 690, 87, 120, "追加") +
        at("c9-record-line", 215, 132, 150, "味道很") +
        at("c9-small c9-center", 424, 132, 220, "好 / <span class=\"c9-red\">一般</span> / 差") +
        at("c9-record-line c9-center", 690, 132, 120, "<span class=\"c9-red\">一般</span>") +
        at("c9-small c9-center", 202, 205, 608, "味道很 → 味道很一般 → 继续预测") +
        at("c9-summary-text", 850, 109, 635, "根据已有前文，<br>逐Token预测、选择并追加。") +
        at("c9-summary-label", 0, 319, 195, "上下文") +
        at("c9-small", 229, 301, 490, "本次读书会输入") +
        at("c9-record-line", 229, 349, 510, "36人 · 22元/人 · 预算800元") +
        at("c9-summary-text", 850, 309, 635, "任务、材料和相关历史，<br>需要组织进本次输入。", 1) +
        at("c9-summary-label", 0, 526, 195, "事实依据", null, "font-size:40px;") +
        at("c9-record-line", 471, 487, 293, "12/20＝60%") +
        at("c9-small", 473, 546, 100, "试用") +
        at("c9-small c9-red", 668, 546, 100, "付费", 2) +
        at("c9-small c9-red", 546, 596, 230, "不能直接改写", 2) +
        at("c9-summary-text", 850, 506, 635, "结论要回到材料，<br>核对对象、含义与适用范围。", 2)
      );
    }
  };
})();

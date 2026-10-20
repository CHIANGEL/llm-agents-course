"""Archive the DeepSeek revision without rebuilding unrelated course content."""
from pathlib import Path
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SOURCE = ROOT / "sources/prompting-deepseek-20261021"
SOURCE.mkdir(exist_ok=True)
runs = json.loads((HERE / "browser-run-log.json").read_text())
by_key = {r["key"]: r for r in runs}
selection = json.loads((HERE / "selection.json").read_text())
checks = json.loads((HERE / "static-checks.json").read_text())
ui = json.loads((HERE / "ui-checks.json").read_text())
assert ui["open_new_tab_and_return"]
assert len(ui["checked_pages"]) == 14
pairs = json.loads((ROOT / "src/prompting-demo-data.js").read_text()
                   .removeprefix("window.MBA_PROMPT_DEMOS = ").rstrip(";\n"))
notes = json.loads((HERE / "review-notes.json").read_text())
names = {
    "four-elements": "四要素", "give-example": "给Example",
    "model-write-prompt": "让模型写Prompt", "socratic": "苏格拉底式提问",
    "two-layer": "双层解释", "reverse-deconstruction": "逆向拆解",
    "horizontal-vertical": "横纵分析", "fact-checking": "事实核查",
    "expert-consultation": "专家会诊", "first-principles": "第一性原理",
    "cross-domain": "跨领域类比", "steelman": "双向钢人论证",
    "minimum-experiment": "最小实验",
}
pages = {r["strategy"]: r["pages"] for r in checks["pages"]}
rows, manifest = [], []
for p in pairs:
    row = next(r for r in selection["pairs"] if r["strategy"] == p["strategy"])
    n = notes.get(names[p["strategy"]], {})
    difference = n.get("difference", "保留已审核的DeepSeek案例，观察核查过程、来源与证据口径。")
    links = f'[简单]({p["simple_share_url"]}) · [策略]({p["strategy_share_url"]})'
    if p.get("process_share_url"):
        links += f' · [改写过程]({p["process_share_url"]})'
    rows.append(f'| {"/".join(map(str,pages[p["strategy"]]))} | {names[p["strategy"]]} | {p["object"]} | {difference} | {links} |')
    manifest.append(dict(**p, pages=pages[p["strategy"]], selection=row,
                         observed_difference=difference, review=n))
table = "| 当前页 | 策略 | 对象 | 对照观察重点 | 共享页 |\n|---|---|---|---|---|\n" + "\n".join(rows)
new_runs = [r for r in runs if not r.get("retained_from")]
report = f"""# Prompting DeepSeek案例选择与复查

日期：2026-10-21。本轮按教师追加要求统一使用DeepSeek，移除课件中的ChatGPT演示入口；全部浏览器操作和审核由主代理完成，未调用子智能体。

13组对照覆盖14个原模板页面，共27个独立共享链接（含模型改写Prompt的过程）。本轮提交{len(new_runs)}个新会话，另有澄清回合；保留之前已经是DeepSeek的微软事实核查一组。该计数含淘汰与复跑，不代表同等数量的入选案例。

{table}

## 筛选记录

真实执行文本、原会话地址、可见回答、追问、共享地址和公开页面核验记录存于browser-run-log.json。候选计划见candidate-plan.json，逐项理由与限制见review-notes.json。实际采集的AX文字可能受页面虚拟化影响，不等于完整聊天导出。

不以字数增加作为胜出依据。现金流和部分基金概念候选的简单回答已经较充分，或策略回答有明显错误，因此未选。股票与公司案例用于阅读、推理和决策条件演示；虚构数字在实际提交的Prompt中标明。

多轮模板通过追问取得新条件，最终回答的变化包含这些新信息的作用。四要素、Example与材料约束也会改变具体任务；本轮是课堂选例，不是控制其他变量的模型性能实验。共享回答中的预测、折扣、阈值和比例仍是模型推断或建议，不能因使用模板就当成已证实结果。具体核对见primary-source-review.json。

微软事实核查保留原链接与原审核范围。原官方公告关于39.9%的后续更正见历史fact-check-primary-review.json，模型策略回答没有完整覆盖所有更正，不把该案例解释成自动保证真实性。

## 课件与跳转检查

- 原始prompting-r2-data.js的SHA-256未变；十种策略与元Prompt仅替换括号内实例，完整模板文本保持原样。
- 13组、14个渲染页、27个唯一DeepSeek公开地址均通过静态检查；链接限制为DeepSeek分享页。
- 所有入口使用target="_blank"及rel="noopener noreferrer"。按本轮ui-checks.json实际查看14个受影响页，并实点新标签跳转及返回。
- 页面、全讲时长和同期其他章节修订沿用当前文件；未运行全量重建。此次检查范围是Prompting入口及对照案例，不是全讲复查。

截图见proof.png；结构检查见static-checks.json；实际UI检查见ui-checks.json。
"""
(HERE / "案例选择与复查记录.md").write_text(report)
(SOURCE / "README.md").write_text(
    "# Prompting DeepSeek演示案例\n\n"
    "本轮13组对照、14个模板页、27个公开链接；来源和核验细节见"
    "[案例选择与复查记录](../../qa/prompting-deepseek-20261021/案例选择与复查记录.md)。\n\n" + table + "\n")
(SOURCE / "manifest.json").write_text(json.dumps(dict(
    date="2026-10-21", status="complete", platform="DeepSeek web via native Chrome",
    selected_pairs=13, template_pages=14, distinct_public_links=27,
    new_chat_count=len(new_runs), current_course_pages=checks["preserved_course_page_count"],
    items=manifest,
), ensure_ascii=False, indent=2) + "\n")
selection["status"] = "reviewed_and_published"
(HERE / "selection.json").write_text(json.dumps(selection, ensure_ascii=False, indent=2) + "\n")
version_path = ROOT / "version_manifest.json"
version = json.loads(version_path.read_text())
version["prompting_demos"] = dict(
    date="2026-10-21", platform="DeepSeek", pair_count=13, template_page_count=14,
    public_chat_count=27, source="sources/prompting-deepseek-20261021/manifest.json")
version_path.write_text(json.dumps(version, ensure_ascii=False, indent=2) + "\n")

"""Archive the reviewed browser evidence without rebuilding the course."""
from pathlib import Path
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SOURCE = ROOT / "sources/prompting-demos-r22"
runs = json.loads((HERE / "browser-run-log.json").read_text())
review = json.loads((HERE / "review-draft.json").read_text())
slides = json.loads((ROOT / "slides.json").read_text())
data = (ROOT / "src/prompting-demo-data.js").read_text()
pairs = json.loads(data.removeprefix("window.MBA_PROMPT_DEMOS = ").rstrip(";\n"))
assert len(pairs) == 13
assert sum(len(p["renderers"]) for p in pairs) == 14
source_hash = hashlib.sha256((ROOT / "src/prompting-r2-data.js").read_bytes()).hexdigest()
assert source_hash == "07f6c21e7adfd6591e55bddda685615b763b01fca8ca522ab974f68633a969b9"

by_renderer = {int(s["renderer"]): s["page"] for s in slides}
manifest = json.loads((SOURCE / "manifest.json").read_text())
for item, pair, selected in zip(manifest["items"], pairs, review["pairs"]):
    assert item["renderers"] == pair["renderers"]
    item.update(
        status="reviewed_and_shared", slide_pages=[by_renderer[i] for i in pair["renderers"]],
        selected_object=pair["object"], simple_share_url=pair["simple_share_url"],
        strategy_share_url=pair["strategy_share_url"],
        selected_run_keys=[runs[selected[k]]["key"] for k in ("simple_index", "strategy_index")],
        observed_difference=selected["observed_difference"],
    )
    item.pop("selected_candidate_id", None)
    if pair.get("process_share_url"):
        item["process_share_url"] = pair["process_share_url"]
manifest.update(
    date="2026-10-21", status="complete", submitted_prompts=len(runs),
    initial_candidate_pair_count=26, additional_objects=["微软日本四天工作制", "咖啡店主付费社群"],
    reviewed_pairs=13, shared_links=27, live_html_modified=True,
    live_deck_revision="basic-concepts-r23 + prompting-demo-links",
    live_page_count=len(slides), execution_platform="Native Google Chrome: ChatGPT and DeepSeek",
    current_checkpoint="qa/prompting-demos-r22/browser-run-log.json",
    evidence_scope="Selected outputs and public pages reviewed. Unselected runs may be partial or inaccessible; AX captures are not full transcripts.",
)
(SOURCE / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
review["status"] = "reviewed_and_published"
review["date"] = "2026-10-21"
(HERE / "review-draft.json").write_text(json.dumps(review, ensure_ascii=False, indent=2) + "\n")

rows = []
for item, pair, selected in zip(manifest["items"], pairs, review["pairs"]):
    links = f'[简单]({pair["simple_share_url"]}) · [策略]({pair["strategy_share_url"]})'
    if pair.get("process_share_url"):
        links += f' · [改写过程]({pair["process_share_url"]})'
    rows.append(f'| {"/".join(map(str,item["slide_pages"]))} | {item["strategy"]} | {pair["object"]} | {selected["observed_difference"]} | {links} |')
table = "| 当前页 | 策略 | 入选对象 | 课堂观察重点 | 实际共享页 |\n|---|---|---|---|---|\n" + "\n".join(rows)
report = f"""# Prompting案例选择与复查记录

日期：2026-10-21。沿用当前r23课件，共{len(slides)}页。本次增加13组案例，覆盖14个模板页面；不增减课件页数或时长。

## 实际执行与选择

教师要求不用子智能体后，全部浏览器实测、追问、复跑、分享和最终审核均由主代理通过原生Chrome完成。前期26组候选保留为准备档案，追加微软日本四天工作制和咖啡店主付费社群；累计提交{len(runs)}次初始请求，另有问答跟进。这个数字包括生成Prompt的执行、平台复测及无法重新加载后的复跑，不等于{len(runs)}份完整结果。

以下13组所选结果均已读取，27个公开页面均已通过浏览器重新打开核验。苏格拉底与钢人化链接包含完成后的多轮回答。“让模型写Prompt”的策略入口指向模型改写稿的实际执行结果，第三入口保留审查、澄清与改写过程。

{table}

## 选择与解释边界

- 普通回答已有良好例子或风险提示时，按具体新增行为比较，不用长度作为质量标准。双层解释侧重两层术语对应和因果边界；第一性原理侧重先审计真实决策，再决定替代机制。
- BCG与Google两组事实核查的普通回答已能完成主要纠错，未选入。DeepSeek的BCG复测也未选入。微软案例的普通回答已识别因果问题，所选差异是实际检索、证据口径和上下文核查。
- 微软官方2019年11月8日更新指出39.9%受多种因素影响，不能仅归因于该项目；策略回答未明确指出这次更正。原始公告核验见fact-check-primary-review.json，不将示例解释为自动保证事实正确。
- 苏格拉底与钢人化展示完整互动策略：后续事实通过问题获得。因此不能把最终答案中新增信息全部归因于单轮Prompt。模拟业务数据均用于教学推演，没有使用教师私人经营资料。
- AI会议纪要的普通回答已建议低成本付费测试；新选社群对象用于观察完整推进计划与7天单一假设实验之间的时间、资源和决策范围差别。
- ChatGPT可见模式为聊天，前期记录为Extra High，元Prompt成品复测可见High；界面未显示可核实的具体底层模型名；DeepSeek采用同一网页状态。模型生成可能有随机性，本轮是教学案例选择，不是统计性能评测。

## 模板与课件检查

- 原始模板数据文件SHA-256仍为`{source_hash}`，全文未改。
- 十种PDF策略与元Prompt沿用原模板，仅填写括号内容。四大要点和Example为已有教学结构的实例化，适配范围保留在候选档案。
- 新模块仅添加公开分享链接，拒绝普通私有聊天地址。所有入口均使用`target="_blank"`和`rel="noopener noreferrer"`。
- 实际逐页查看14个受影响页面，入口位于模板右上方，未遮挡原始Prompt；横纵分析的两页使用相同案例。
- 实际点击ChatGPT及DeepSeek入口：新建案例标签，关闭后回到原课件页及原页码。证据见ui-checks.json；截图见proof.png。
- 仅检查本次影响的页面与跳转，不将历史全讲QA写成本次200页复查。保留同期r23基础概念增补，不运行会覆盖版本记录的全量重建。

## 档案说明

browser-run-log.json保存真实提交文本、可见回答摘录、后续问答、原始会话地址及公开页核验记录。网页会虚拟化长回答和写作卡片，因此AX摘录不是完整导出；以公开聊天页面呈现的结果为准。准备阶段的未完成状态只代表历史阶段，不代表当前交付状态。未选候选的可访问性或多轮完整性不作为入选结果的证据。
"""
(HERE / "案例选择与复查记录.md").write_text(report)
(SOURCE / "README.md").write_text(
    "# Prompting真实演示案例\n\n2026-10-21：13组已选案例，14个模板页面，27个已核验的公开聊天链接。\n\n"
    "候选JSON保留原模板、填入内容与初期选择假设；真实执行结果、复跑和最终选优以"
    "[最终复查记录](../../qa/prompting-demos-r22/案例选择与复查记录.md)、"
    "[执行日志](../../qa/prompting-demos-r22/browser-run-log.json)与本目录manifest.json为准。\n\n"
    + table + "\n"
)
version = json.loads((ROOT / "version_manifest.json").read_text())
version["prompting_demos"] = dict(date="2026-10-21", pair_count=13, template_page_count=14,
                                  public_chat_count=27, source="sources/prompting-demos-r22/manifest.json")
(ROOT / "version_manifest.json").write_text(json.dumps(version, ensure_ascii=False, indent=2) + "\n")
readme = ROOT / "README.md"
text = readme.read_text()
section = """## Prompting真实案例链接

2026-10-21：13项策略各选一组真实对照，覆盖14个模板页面。右上角“简单Prompt／策略Prompt”打开公开聊天新标签；让模型写Prompt另有“改写过程”入口。案例在ChatGPT与DeepSeek网页实际执行、审核并重新打开核验。

[案例选择与本轮复查](qa/prompting-demos-r22/案例选择与复查记录.md) · [直接进入Prompting](http://127.0.0.1:8765/?revision=prompting-demos#p=19&s=1)。保留r23的200页结构与时长。

"""
if "## Prompting真实案例链接" not in text:
    text = text.replace("## 基础概念增补 r23", section + "## 基础概念增补 r23")
readme.write_text(text)
print(json.dumps(dict(pairs=13, pages=14, links=27, deck_pages=len(slides))))

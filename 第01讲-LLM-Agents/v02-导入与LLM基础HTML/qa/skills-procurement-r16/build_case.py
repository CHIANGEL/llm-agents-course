"""Build the local procurement Skill and replay its file operations."""
from pathlib import Path
import json, subprocess, hashlib, shutil

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "sources/skills-r16"
WORK = BASE / "case"
PKG = WORK / ".agents/skills/procurement-review"
OUT = WORK / "output"
for p in [PKG, OUT, BASE / "execution", ROOT / "assets/skills-r16"]:
    p.mkdir(parents=True, exist_ok=True)

def put(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.strip() + "\n")

FILES = {
"SKILL.md": """---
name: procurement-review
description: 起草或更新软件采购评审要点；适用于试点采购与正式部署，需要核对采购条件、费用范围、交付和待确认事项时使用。
---
# 采购评审

## 先确定本次任务
从当前请求及已读取的记忆中确认人数、使用期限、预算上限和采购阶段。
当前条件与历史记录不一致时，按用户对本次任务的最新说明处理。
缺失条件列入待确认事项，不自行补出报价、审批结果或验收结论。

## 选择评审方法
- 正式部署：读取 references/rollout-review.md，继续按其中的链接核对费用范围。
- 小范围试点：读取 references/pilot-review.md。
只读取本次任务需要的分支。

## 生成一页评审要点
按照参考文件组织 review-input.json。
运行下列命令，脚本会读取 assets/review-template.html：
python3 .agents/skills/procurement-review/scripts/render_review.py --input review-input.json --output output/procurement-review.html

## 检查后交付
生成文件后，读取 references/quality-checklist.md。
读回 output/procurement-review.html，逐项检查内容，再运行：
python3 .agents/skills/procurement-review/scripts/check_review.py --task task-conditions.json --input review-input.json --output output/procurement-review.html
检查通过后给出文件位置、主要内容和待确认事项。
脚本核对字段与生成结果；还需核对材料依据和待确认事项是否完整。
""",
"references/rollout-review.md": """# 正式部署：采购评审要点

## 先固定本次范围
列明正式部署的人数、使用期限和预算上限。
历史试点的金额、期限和人数单列为背景，不作为本次采购条件。

## 按四部分起草
1. 采购条件：人员范围、期限、预算上限。
2. 费用范围：先读 [费用口径](cost-scope.md)，再列出需要供应商报清的项目。
3. 交付与管理：依据已知要求，核对企业账号、权限、日志和数据处理。
4. 待确认事项：尚未获得的报价、上线日期、验收标准。

## 写入文件
将以上内容写入 review-input.json。
采购阶段写入 phase；人数、期限与预算使用 people、term_months、budget_cap_cny。
其余三部分分别使用 cost_scope、requirements、pending 数组。
每个要点包含 text（内容）和 source（依据或待确认原因）。
使用 SKILL.md 中的生成命令。文件生成后再读质量检查清单。
""",
"references/pilot-review.md": """# 试点采购：采购评审要点

明确试点人数、期限、预算、验证目标与退出条件。
费用只覆盖试点范围；区分可复用的初始配置和后续扩容费用。
交付要求包括账号、数据范围和试点结束后的导出与清理。
待确认事项包括试点验收标准、正式部署是否另行报价。
生成文件前使用 cost-scope.md 核对费用项目，再按 SKILL.md 检查交付。
""",
"references/cost-scope.md": """# 费用口径

预算上限是可接受的支出上限，不是供应商报价，也不是已发生成本。

## 报价中需要拆开的项目
- 软件订阅：使用人数、计费周期、版本、税费是否与本次范围一致。
- 配置与迁移：是否一次性收费，具体包含哪些实施工作。
- 培训与支持：服务内容、次数、期限和额外费用。

## 比较规则
先统一人数和期限，再比较同一范围内的合计费用。
续费、扩容、退出与数据导出费用分别列明。
没有报价时，写明应核对的费用项目，不计算报价差额或节省比例。

## 写入初稿
将费用范围与需要报价确认的内容写入 cost_scope。
在 source 中保留“费用口径”及对应条目的说明。
""",
"references/quality-checklist.md": """# 交付前检查

## 与当前任务对照
- 人数、期限、预算上限逐项等于 task-conditions.json。
- 预算上限没有被写成实际报价或已支出金额。
- 历史试点条件没有替代正式部署条件。

## 与材料对照
- 账号、权限、日志和数据要求有已读取材料的依据。
- 费用项目来自 cost-scope.md；没有报价时，不写供应商价格或节省比例。
- 尚未确认的报价、上线日期、验收标准列入待确认事项。

## 与产物对照
- 打开 output/procurement-review.html，检查四部分是否完整、能否按一页阅读。
- 运行 scripts/check_review.py，比对当前条件、初稿字段和生成文件。
- 修改初稿后，重新生成并复查。
""",
"agents/openai.yaml": """interface:
  display_name: "采购评审"
  short_description: "按当前采购条件整理一页评审要点，核对费用范围、交付要求与待确认事项"
  default_prompt: "请使用 $procurement-review，按当前采购条件起草一页采购评审要点。"
""",
"assets/review-template.html": """<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>采购评审要点</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#e9edf1;color:#202631;font:19px/1.6 Arial,"PingFang SC",sans-serif}
article{width:1120px;min-height:660px;margin:20px auto;background:white;padding:28px 38px;box-shadow:0 3px 20px #bac3cd}
h1{font-size:29px;margin:0 0 4px;color:#073f91}h2{font-size:20px;margin:16px 0 8px;color:#073f91;border-bottom:1px solid #c8d3df;padding-bottom:5px}
.subtitle{color:#66707d;font-size:16px;margin-bottom:10px}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.facts div{background:#edf3f9;padding:12px}.facts b{display:block;font-size:24px;color:#8e2332}.facts span{font-size:15px}
.columns{display:grid;grid-template-columns:1fr 1fr;gap:32px}ul{margin:8px 0;padding-left:23px}li{margin:6px 0}footer{margin-top:18px;border-top:1px solid #c8d3df;padding-top:10px;color:#596472;font-size:14px}
@media(max-width:820px){article{width:calc(100% - 24px);margin:12px;padding:28px}}
@page{size:A4 landscape;margin:12mm}@media print{body{background:white}article{width:auto;min-height:0;margin:0;padding:0;box-shadow:none;font-size:11pt}h1{font-size:20pt}h2{font-size:13pt;margin-top:15px}.facts b{font-size:16pt}li{margin:5px 0}footer{font-size:9pt}}
</style>
<article>
<h1>采购评审要点</h1><div class="subtitle">{{PHASE}} · 软件采购</div>
<section><h2>一、采购条件</h2><div class="facts">
<div><span>使用人数</span><b>{{PEOPLE}}人</b></div><div><span>使用期限</span><b>{{TERM}}</b></div><div><span>预算上限</span><b>{{BUDGET}}</b></div>
</div></section>
<div class="columns"><section><h2>二、费用范围</h2><ul>{{COST_SCOPE}}</ul></section>
<div><section><h2>三、交付与管理</h2><ul>{{REQUIREMENTS}}</ul></section>
<section><h2>四、待确认事项</h2><ul>{{PENDING}}</ul></section></div></div>
<footer>评审范围：按上述采购条件核对费用、交付及管理要求。</footer>
</article></html>
""",
"scripts/render_review.py": '''"""Render a procurement review from task-specific data and the package template."""
import argparse, html, json
from pathlib import Path
def render(data):
    c = data["conditions"]
    values = {
        "PHASE": html.escape(c["phase"]),
        "PEOPLE": str(c["people"]),
        "TERM": f'{c["term_months"] // 12}年' if c["term_months"] % 12 == 0 else f'{c["term_months"]}个月',
        "BUDGET": f'{c["budget_cap_cny"] / 10000:g}万元',
    }
    for key in ["cost_scope", "requirements", "pending"]:
        values[key.upper()] = "".join("<li>" + html.escape(i["text"]) + "</li>" for i in data[key])
    template = (Path(__file__).resolve().parents[1] / "assets/review-template.html").read_text()
    for key, value in values.items():
        template = template.replace("{{" + key + "}}", value)
    return template
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    data = json.loads(Path(args.input).read_text())
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render(data))
    print(f"已生成：{output.as_posix()}")
    print("内容：采购条件、费用范围、交付与管理、待确认事项")
''',
"scripts/check_review.py": '''"""Check task conditions, required sections, and consistency with the rendered file."""
import argparse, json, sys
from pathlib import Path
from render_review import render
def check(task, data, output):
    failures = []
    for key in ["phase", "people", "term_months", "budget_cap_cny"]:
        if data.get("conditions", {}).get(key) != task.get(key):
            failures.append(f"{key} 与当前任务不一致")
    for key in ["cost_scope", "requirements", "pending"]:
        items = data.get(key, [])
        if not items or any(not i.get("text") or not i.get("source") for i in items):
            failures.append(f"{key} 缺少内容或依据")
    if not failures and output != render(data):
        failures.append("产物与当前初稿不一致，请重新生成")
    return failures
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", required=True)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    task = json.loads(Path(args.task).read_text())
    data = json.loads(Path(args.input).read_text())
    failures = check(task, data, Path(args.output).read_text())
    if failures:
        print("检查未通过：" + "；".join(failures))
        sys.exit(1)
    print("检查通过：人数、期限、预算上限与当前任务一致。")
    print("检查通过：三组要点的内容与依据字段已填写。")
    print("检查通过：产物与当前初稿一致。")
'''
}
for name, text in FILES.items():
    put(PKG / name, text)

task = {"phase":"正式部署","people":300,"term_months":12,"budget_cap_cny":300000}
put(WORK / "task-conditions.json", json.dumps(task, ensure_ascii=False, indent=2))
put(WORK / "request.txt", "请按刚才确认的条件，起草一页采购评审要点：300人正式部署，使用期限一年，预算上限30万元。")
memory = ROOT / "sources/memory-r8/procurement-case"
security_matches = list(memory.rglob("security-requirements.md"))
assert len(security_matches) == 1, security_matches
shutil.copyfile(security_matches[0], WORK / "security-requirements.md")

review = {
    "conditions": task,
    "cost_scope": [
        {"text":"软件订阅按300人、一年核价，明确版本、税费及计费口径。","source":"当前采购条件；cost-scope.md：软件订阅"},
        {"text":"配置与迁移、培训与支持分别列明，核对是否包含在预算范围内。","source":"cost-scope.md：配置与迁移、培训与支持"},
        {"text":"续费、扩容、退出及数据导出费用单列，按相同范围比较报价。","source":"cost-scope.md：比较规则"}
    ],
    "requirements": [
        {"text":"按团队分配权限；支持企业账号开通、停用和操作日志。","source":"security-requirements.md：账号与权限"},
        {"text":"确认数据托管位置、导出方式及服务终止后的处理安排。","source":"security-requirements.md：数据处理"}
    ],
    "pending": [
        {"text":"供应商完整报价及费用包含范围。","source":"当前材料未提供供应商报价"},
        {"text":"正式上线日期与验收标准。","source":"当前条件只确定人数、期限和预算"}
    ]
}
put(WORK / "review-input.json", json.dumps(review, ensure_ascii=False, indent=2))

commands = [
    ("read-skill", ["cat", ".agents/skills/procurement-review/SKILL.md"]),
    ("read-rollout", ["cat", ".agents/skills/procurement-review/references/rollout-review.md"]),
    ("read-cost", ["cat", ".agents/skills/procurement-review/references/cost-scope.md"]),
    ("read-security", ["cat", "security-requirements.md"]),
    ("write-input", ["python3", "-c", "from pathlib import Path; Path('review-input.json').write_text(" + repr(json.dumps(review, ensure_ascii=False, indent=2)+"\n") + "); print('已写入：review-input.json')"]),
    ("render", ["python3", ".agents/skills/procurement-review/scripts/render_review.py", "--input", "review-input.json", "--output", "output/procurement-review.html"]),
    ("read-checklist", ["cat", ".agents/skills/procurement-review/references/quality-checklist.md"]),
    ("read-output", ["cat", "output/procurement-review.html"]),
    ("check", ["python3", ".agents/skills/procurement-review/scripts/check_review.py", "--task", "task-conditions.json", "--input", "review-input.json", "--output", "output/procurement-review.html"]),
]
records = []
for name, cmd in commands:
    p = subprocess.run(cmd, cwd=WORK, text=True, capture_output=True)
    assert p.returncode == 0, p.stderr
    records.append({"id":name,"argv":cmd,"cwd":str(WORK),"exit_code":p.returncode,"stdout":p.stdout,"stderr":p.stderr})
put(BASE / "execution/operations.json", json.dumps(records, ensure_ascii=False, indent=2))

# A wrong budget and stale rendered output must fail; keep the delivered input unchanged.
import importlib.util
spec = importlib.util.spec_from_file_location("render_review", PKG / "scripts/render_review.py")
renderer = importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
import sys
sys.modules["render_review"] = renderer
spec = importlib.util.spec_from_file_location("check_review", PKG / "scripts/check_review.py")
checker = importlib.util.module_from_spec(spec);spec.loader.exec_module(checker)
bad = json.loads(json.dumps(review));bad["conditions"]["budget_cap_cny"] = 100000
tests = {
    "current_data": checker.check(task, review, (OUT / "procurement-review.html").read_text()),
    "old_budget": checker.check(task, bad, renderer.render(bad)),
    "stale_output": checker.check(task, review, renderer.render(bad)),
}
assert tests["current_data"] == [] and tests["old_budget"] and tests["stale_output"]
put(BASE / "execution/validation-tests.json", json.dumps(tests, ensure_ascii=False, indent=2))
for p in PKG.rglob("__pycache__"):
    shutil.rmtree(p)
put(BASE / "package-manifest.json", json.dumps([{"path":n,"sha256":hashlib.sha256((PKG/n).read_bytes()).hexdigest()} for n in FILES], ensure_ascii=False, indent=2))
print(json.dumps({"package_files":len(FILES),"operations":len(records),"validation":tests},ensure_ascii=False))

"""Check task conditions, required sections, and consistency with the rendered file."""
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

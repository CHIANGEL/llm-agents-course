"""Render a procurement review from task-specific data and the package template."""
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

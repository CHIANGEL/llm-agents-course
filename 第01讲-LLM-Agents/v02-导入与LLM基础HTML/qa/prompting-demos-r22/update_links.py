"""Publish only reviewed pairs whose real public pages were opened and checked."""
from pathlib import Path
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
runs = json.loads((HERE / "browser-run-log.json").read_text())
review = json.loads((HERE / "review-draft.json").read_text())
renderers = {
    "four-elements": [302], "give-example": [303], "model-write-prompt": [304],
    "socratic": [307], "two-layer": [309], "reverse-deconstruction": [311],
    "horizontal-vertical": [313, 314], "fact-checking": [316],
    "expert-consultation": [319], "first-principles": [320],
    "cross-domain": [322], "steelman": [325], "minimum-experiment": [327],
}


def verified(run):
    url = run.get("share_url", "")
    return bool(
        re.fullmatch(r"https://(?:chatgpt\.com|chat\.deepseek\.com)/share/[\w-]+", url)
        and run.get("share_verified", {}).get("url") == url
    )


pairs = []
for row in review["pairs"]:
    simple = runs[row["simple_index"]]
    strategy = runs[row["strategy_index"]]
    if not (verified(simple) and verified(strategy)):
        continue
    pair = dict(
        strategy=row["strategy"], object=row["object"],
        renderers=renderers[row["strategy"]], status="reviewed",
        shared_pages_verified=True, simple_share_url=simple["share_url"],
        strategy_share_url=strategy["share_url"],
    )
    if "prompt_generation_index" in row and verified(runs[row["prompt_generation_index"]]):
        pair["process_share_url"] = runs[row["prompt_generation_index"]]["share_url"]
    pairs.append(pair)

(ROOT / "src/prompting-demo-data.js").write_text(
    "window.MBA_PROMPT_DEMOS = " + json.dumps(pairs, ensure_ascii=False, indent=2) + ";\n"
)
assets = []


def version(match):
    attr, href = match.groups()
    file = href.split("?")[0]
    if not file.startswith("src/") or not file.endswith((".js", ".css")):
        return match.group(0)
    sha = hashlib.sha256((ROOT / file).read_bytes()).hexdigest()[:12]
    assets.append(dict(file=file, sha256_12=sha))
    return f'{attr}="{file}?v={sha}"'


index = ROOT / "index.html"
index.write_text(re.sub(r'\b(src|href)="([^"]+)"', version, index.read_text()))
(ROOT / "qa/asset-versions.json").write_text(json.dumps(
    dict(date="2026-10-21", method="sha256 first 12 characters; existing course revisions retained",
         assets=assets), ensure_ascii=False, indent=2) + "\n")
print(json.dumps(dict(pairs=len(pairs), template_slides=sum(len(p["renderers"]) for p in pairs))))

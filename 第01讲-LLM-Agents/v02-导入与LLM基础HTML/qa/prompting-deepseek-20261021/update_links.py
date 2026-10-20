"""Publish all reviewed DeepSeek pairs, preserving the live course revision."""
from pathlib import Path
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
renderers = {
    "four-elements": [302], "give-example": [303], "model-write-prompt": [304],
    "socratic": [307], "two-layer": [309], "reverse-deconstruction": [311],
    "horizontal-vertical": [313, 314], "fact-checking": [316],
    "expert-consultation": [319], "first-principles": [320],
    "cross-domain": [322], "steelman": [325], "minimum-experiment": [327],
}
runs = {r["key"]: r for r in json.loads((HERE / "browser-run-log.json").read_text())}
selection = json.loads((HERE / "selection.json").read_text())["pairs"]
assert len(selection) == 13
assert {r["strategy"] for r in selection} == set(renderers)
assert hashlib.sha256((ROOT / "src/prompting-r2-data.js").read_bytes()).hexdigest() == (
    "07f6c21e7adfd6591e55bddda685615b763b01fca8ca522ab974f68633a969b9"
)


def checked(key):
    run = runs[key]
    url = run["share_url"]
    assert re.fullmatch(r"https://chat\.deepseek\.com/share/[\w-]+", url), key
    assert run["share_verified"]["url"] == url, key
    assert run["status"] == "complete", key
    return url


pairs = []
for row in selection:
    pair = dict(
        strategy=row["strategy"], object=row["object"],
        renderers=renderers[row["strategy"]], status="reviewed",
        shared_pages_verified=True,
        simple_share_url=checked(row["simple_key"]),
        strategy_share_url=checked(row["strategy_key"]),
    )
    if "prompt_generation_key" in row:
        pair["process_share_url"] = checked(row["prompt_generation_key"])
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

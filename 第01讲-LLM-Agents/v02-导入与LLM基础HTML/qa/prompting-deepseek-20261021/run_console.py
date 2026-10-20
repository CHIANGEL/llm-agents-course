"""Local preparation and evidence form, operated through the visible browser UI."""
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs
import html
import json
import base64

ROOT = Path(__file__).resolve().parent
QUEUE = json.loads((ROOT / "run-queue.json").read_text())
payload = json.dumps(QUEUE, ensure_ascii=False, separators=(",", ":"))
fields = "".join(
    f'<label>队列片段{i // 650:03d}<textarea aria-label="队列片段{i // 650:03d}" readonly>'
    f'{html.escape(payload[i:i + 650])}</textarea></label>'
    for i in range(0, len(payload), 650)
)
PAGE = ('''<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<title>Prompting案例执行档案</title>
<style>body{font:18px sans-serif;max-width:1100px;margin:32px auto}
textarea{display:block;width:100%;height:100px;font:14px monospace}
label{display:block;margin:12px 0}button{font:20px sans-serif;padding:12px}</style>
<h1>Prompting案例执行档案</h1>
<p>本地准备与执行记录表。只保存本轮新建的演示聊天。</p>
<form method="post" action="/save">
<label>执行记录JSON<textarea aria-label="执行记录JSON" name="records"></textarea></label>
<button type="submit">保存执行记录</button></form>
<h2>待运行输入</h2>''' + fields + "</html>").encode()


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        content = PAGE
        if self.path.startswith("/state"):
            records = json.loads((ROOT / "browser-run-log.json").read_text())
            minimal = [{k: v for k, v in r.items() if k not in ("ax", "response", "captures")} for r in records]
            queue = [dict(q) for q in QUEUE]
            keys = {q["key"] for q in queue}
            for r in minimal:
                if r["key"] not in keys:
                    queue.append({k: v for k, v in r.items() if k in ("key", "strategy", "object", "variant", "prompt", "generated_by")})
                    keys.add(r["key"])
            blob = json.dumps(dict(queue=queue, records=minimal), ensure_ascii=False, separators=(",", ":"))
            page = int(self.path.split("?page=")[-1]) if "?page=" in self.path else 0
            total = (len(blob) + 19999) // 20000
            blob = blob[page * 20000:(page + 1) * 20000]
            content = (f'<meta charset="utf-8"><title>本轮案例恢复</title><h1>本轮案例恢复 {page+1}/{total}</h1>' + "".join(
                f'<textarea aria-label="恢复片段{i // 650:03d}" readonly>{html.escape(blob[i:i+650])}</textarea>'
                for i in range(0, len(blob), 650))).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(content)

    def do_POST(self):
        if self.path != "/save":
            self.send_error(404)
            return
        raw = self.rfile.read(int(self.headers.get("Content-Length", "0")))
        try:
            records = json.loads(parse_qs(raw.decode())["records"][0])
            if not isinstance(records, list):
                raise ValueError("Expected list")
            for record in records:
                if not isinstance(record, dict) or not isinstance(record.get("key"), str):
                    raise ValueError("Invalid record")
            dest = ROOT / "browser-run-log.json"
            existing = json.loads(dest.read_text()) if dest.exists() else []
            by_key = {record["key"]: record for record in existing}
            for record in records:
                if record["key"] == "_proof":
                    (ROOT / "proof.png").write_bytes(base64.b64decode(record["png_base64"]))
                    continue
                by_key.setdefault(record["key"], {}).update(record)
            existing = list(by_key.values())
            dest.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n")
        except (ValueError, KeyError) as exc:
            self.send_error(400, str(exc))
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(f'<meta charset="utf-8"><h1>已保存{len(records)}条执行记录</h1><a href="/">返回执行表</a>'.encode())


HTTPServer(("127.0.0.1", 8777), Handler).serve_forever()

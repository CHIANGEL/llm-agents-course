#!/usr/bin/env python3
"""从本项目路径启动支持视频定位的课件预览。"""
import argparse
import errno
from functools import partial
from http.server import ThreadingHTTPServer
import importlib.util
from pathlib import Path
from urllib.request import urlopen
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
COURSE = ROOT / "第01讲-LLM-Agents" / "v02-导入与LLM基础HTML"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8876)
    parser.add_argument("--open", action="store_true", help="同时打开浏览器")
    options = parser.parse_args()
    url = f"http://127.0.0.1:{options.port}/?revision=2026-10-21-public-release-r28#p=1&s=1"
    spec = importlib.util.spec_from_file_location("course_preview", COURSE / "preview.py")
    preview = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(preview)
    handler = partial(preview.CourseHandler, directory=str(COURSE))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", options.port), handler)
    except OSError as error:
        if error.errno == errno.EADDRINUSE:
            try:
                with urlopen(f"http://127.0.0.1:{options.port}/index.html", timeout=2) as response:
                    same_course = response.read() == (COURSE / "index.html").read_bytes()
            except OSError:
                same_course = False
            if same_course:
                print(f"本课件服务已在运行：{url}", flush=True)
                if options.open:
                    webbrowser.open(url)
                return
        parser.exit(1, f"无法启动端口 {options.port}：{error}\n可使用 --port 8877 指定其他端口。\n")
    print(f"课件：{url}\n课件目录：{COURSE}\n按 Ctrl+C 停止。", flush=True)
    if options.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n预览已停止。")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

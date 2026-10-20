#!/usr/bin/env python3
"""Local-only course preview with byte ranges for seekable videos."""
import argparse
import os
from pathlib import Path
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class CourseHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_range = None
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()
        try:
            stream = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        stat = os.fstat(stream.fileno())
        size = stat.st_size
        requested = self.headers.get("Range")
        if requested:
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", requested.strip())
            if not match or not any(match.groups()):
                stream.close()
                self.send_error(400, "Invalid byte range")
                return None
            start_text, end_text = match.groups()
            start = int(start_text) if start_text else max(0, size - int(end_text))
            end = min(size - 1, int(end_text)) if start_text and end_text else size - 1
            if start >= size or start > end:
                stream.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            self.byte_range = (start, end)
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(end - start + 1))
        else:
            self.send_response(200)
            self.send_header("Content-Length", str(size))
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
        self.end_headers()
        return stream

    def copyfile(self, source, outputfile):
        if self.byte_range is None:
            return super().copyfile(source, outputfile)
        start, end = self.byte_range
        source.seek(start)
        remaining = end - start + 1
        while remaining:
            data = source.read(min(65536, remaining))
            if not data:
                break
            outputfile.write(data)
            remaining -= len(data)


if __name__ == "__main__":
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument("--port", type=int, default=8765)
    options = args.parse_args()
    root = Path(__file__).resolve().parent
    handler = lambda *a, **kw: CourseHandler(*a, directory=str(root), **kw)
    server = ThreadingHTTPServer(("127.0.0.1", options.port), handler)
    print(f"Course preview: http://127.0.0.1:{options.port}/", flush=True)
    server.serve_forever()

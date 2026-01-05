#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser

PORT = 8000
DIRECTORY = "dist/public"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🎮 LEAVE Game Server running at http://localhost:{PORT}")
        print("📱 Open your browser and go to the URL above")
        print("🛑 Press Ctrl+C to stop the server")
        webbrowser.open(f'http://localhost:{PORT}')
        httpd.serve_forever()

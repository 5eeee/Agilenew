"""Start all Agile Business microservices for local development."""
from __future__ import annotations

import os
import signal
import shutil
import subprocess
import sys
import time
from pathlib import Path

from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable
NPM = shutil.which("npm") or shutil.which("npm.cmd") or "npm"

SERVICES = [
    ("web", [NPM, "run", "dev"], 8081, ROOT / "apps" / "frontend"),
    ("content", [PY, "-u", str(ROOT / "apps" / "content" / "main.py")], 8082, ROOT),
    ("leads", [PY, "-u", str(ROOT / "apps" / "leads" / "main.py")], 8083, ROOT),
    ("gateway", [PY, "-u", str(ROOT / "apps" / "gateway" / "server.py")], 8091, ROOT),
]


def main() -> None:
    os.chdir(ROOT)
    procs: list[subprocess.Popen] = []
    child_env = os.environ.copy()
    for key, value in dotenv_values(ROOT / ".env").items():
        if value is not None:
            child_env.setdefault(key, value)

    def shutdown(exit_code: int = 0):
        for proc in procs:
            if proc.poll() is None:
                proc.terminate()
        for proc in procs:
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
        raise SystemExit(exit_code)

    def handle_signal(*_args):
        shutdown()

    signal.signal(signal.SIGINT, handle_signal)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, handle_signal)

    print("Starting Agile Business microservices...", flush=True)
    for name, cmd, port, cwd in SERVICES:
        proc = subprocess.Popen(cmd, cwd=cwd, env=child_env)
        procs.append(proc)
        print(f"  - {name:8} pid={proc.pid}  ->  http://127.0.0.1:{port}/", flush=True)
        time.sleep(0.4)

    print()
    print("Gateway:  http://localhost:8091/", flush=True)
    print("Health:   http://localhost:8091/health", flush=True)
    print("Content:  http://localhost:8091/api/content/company", flush=True)
    print("Press Ctrl+C to stop.", flush=True)

    while True:
        for name, proc in zip([s[0] for s in SERVICES], procs):
            code = proc.poll()
            if code is not None:
                print(f"[error] {name} exited with code {code}", flush=True)
                shutdown(code if code else 1)
        time.sleep(0.5)


if __name__ == "__main__":
    main()

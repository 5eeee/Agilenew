"""Start all Agile Business microservices for local development."""
from __future__ import annotations

import os
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable

SERVICES = [
    ("web", [PY, str(ROOT / "apps" / "web" / "main.py")], 8081),
    ("content", [PY, str(ROOT / "apps" / "content" / "main.py")], 8082),
    ("leads", [PY, str(ROOT / "apps" / "leads" / "main.py")], 8083),
    ("gateway", [PY, str(ROOT / "apps" / "gateway" / "server.py")], 8080),
]


def main() -> None:
    os.chdir(ROOT)
    procs: list[subprocess.Popen] = []

    def shutdown(*_args):
        for proc in procs:
            if proc.poll() is None:
                proc.terminate()
        for proc in procs:
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    print("Starting Agile Business microservices...")
    for name, cmd, port in SERVICES:
        proc = subprocess.Popen(cmd, cwd=ROOT)
        procs.append(proc)
        print(f"  - {name:8} pid={proc.pid}  ->  http://127.0.0.1:{port}/")
        time.sleep(0.4)

    print()
    print("Gateway:  http://localhost:8080/")
    print("Health:   http://localhost:8080/health")
    print("Content:  http://localhost:8080/api/content/company")
    print("Press Ctrl+C to stop.")

    while True:
        for name, proc in zip([s[0] for s in SERVICES], procs):
            code = proc.poll()
            if code is not None:
                print(f"[error] {name} exited with code {code}")
                shutdown()
        time.sleep(0.5)


if __name__ == "__main__":
    main()

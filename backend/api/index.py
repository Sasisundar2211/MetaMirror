from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(BACKEND_DIR))

from server import app

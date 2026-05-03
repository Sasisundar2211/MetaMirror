"""
Pytest configuration and shared fixtures for MetaMirror backend tests.

Environment variables are set before any module-level imports so that
server.py (which reads them at import time) does not require a real
MongoDB instance or Gemini key during unit testing.
"""

import os

import pytest

# ---------------------------------------------------------------------------
# Pre-set env vars before server.py is imported.  Motor creates a lazy
# client – no real network call happens just from importing the module.
# ---------------------------------------------------------------------------
os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "metamirror_test")
os.environ.setdefault("GEMINI_API_KEY", "")
os.environ.setdefault("GEMINI_MODEL_NAME", "gemini-1.5-pro-latest")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

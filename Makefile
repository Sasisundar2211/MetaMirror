.PHONY: help install-backend install-frontend install \
        backend frontend \
        test-backend lint-backend format-backend \
        build-frontend

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
help:
	@echo ""
	@echo "MetaMirror – developer targets"
	@echo "────────────────────────────────────────────────────────────────"
	@echo "  make install          Install all dependencies (backend + frontend)"
	@echo "  make install-backend  Install Python dependencies"
	@echo "  make install-frontend Install Node.js dependencies"
	@echo ""
	@echo "  make backend          Start the FastAPI development server (port 8000)"
	@echo "  make frontend         Start the React development server (port 3000)"
	@echo ""
	@echo "  make test-backend     Run Python unit tests with pytest"
	@echo "  make lint-backend     Run flake8 + mypy on the backend"
	@echo "  make format-backend   Auto-format the backend with black + isort"
	@echo ""
	@echo "  make build-frontend   Build the React production bundle"
	@echo "────────────────────────────────────────────────────────────────"

# ---------------------------------------------------------------------------
# Install
# ---------------------------------------------------------------------------
install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

install: install-backend install-frontend

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
backend:
	cd backend && uvicorn server:app --reload --host 0.0.0.0 --port 8000

frontend:
	cd frontend && npm start

# ---------------------------------------------------------------------------
# Test & Quality
# ---------------------------------------------------------------------------
test-backend:
	cd backend && python -m pytest tests/ -v

lint-backend:
	cd backend && flake8 server.py api/ tests/ && mypy server.py

format-backend:
	cd backend && black server.py api/ tests/ && isort server.py api/ tests/

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
build-frontend:
	cd frontend && npm run build

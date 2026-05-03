# MetaMirror

MetaMirror is a bio-adaptive mental well-being experience that combines an immersive React interface with a FastAPI backend, MongoDB persistence, emotion-aware session tracking, and Gemini-powered supportive chat.

The project is structured as a full-stack prototype for reflective therapy sessions: users create a profile, begin a guided session, track emotional state, receive adaptive environment changes, chat with an AI therapist, and review session analytics.

## Features

- Immersive React frontend built with Create React App, CRACO, Tailwind CSS, shadcn-style UI primitives, Three.js, and Recharts.
- FastAPI backend with typed Pydantic models and REST endpoints for users, sessions, emotion tracking, chat history, and analytics.
- MongoDB storage via Motor for user profiles, therapy sessions, emotion timelines, and messages.
- Gemini integration for concise, empathetic mental well-being support.
- Provider diagnostics endpoints for validating Gemini configuration without exposing secrets.
- Deployment-ready frontend configuration for Vercel preview builds.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, CRACO, Tailwind CSS, Radix UI, Three.js, Recharts, Axios |
| Backend | FastAPI, Uvicorn, Pydantic, Motor, MongoDB |
| AI | Google Gemini via `google-generativeai` |
| Deployment | Vercel for frontend preview deployments |

## Repository Structure

```text
MetaMirror/
├── backend/                # FastAPI application and API diagnostics
├── frontend/               # React app, UI components, and static build setup
├── vercel.json             # Vercel frontend deployment configuration
├── README.md               # Project overview and setup guide
└── .gitignore              # Repo hygiene and secret exclusion rules
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MongoDB running locally or a MongoDB Atlas connection string
- Gemini API key from Google AI Studio or Google Cloud

## Environment Setup

Create environment files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend variables:

```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=metamirror
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL_NAME=gemini-1.5-pro-latest
CORS_ORIGINS=http://localhost:3000
```

Frontend variables:

```bash
REACT_APP_BACKEND_URL=http://localhost:8000
```

Never commit real `.env` files or API keys.

## Local Development

Start the backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`.

## API Overview

The backend serves interactive API docs at:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

Core endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/` | API health and provider summary |
| `GET` | `/api/provider-status` | Gemini configuration diagnostics |
| `GET` | `/api/list-models` | Best-effort Gemini model listing |
| `POST` | `/api/users` | Create or retrieve a user profile by email |
| `POST` | `/api/sessions` | Start a therapy session |
| `POST` | `/api/emotions/track` | Store emotion state and update environment |
| `POST` | `/api/chat` | Send a message to the Gemini-backed therapist |
| `GET` | `/api/analytics/{session_id}` | Retrieve session-level emotion analytics |

## Testing and Verification

Frontend build:

```bash
cd frontend
npm run build
```

Backend smoke test:

```bash
cd backend
python test_api.py
```

The backend test expects MongoDB and the API server to be running.

## Deployment

The included `vercel.json` deploys the React frontend from `frontend/`.

Live deployments:

| Service | URL |
| --- | --- |
| Frontend | https://frontend-klghpfxa1-sasisundar2211s-projects.vercel.app |
| Backend API | https://backend-j9ro7od6g-sasisundar2211s-projects.vercel.app |

Latest deployment configuration commit: `564ab97 Add backend deployment configuration`

Preview deploy:

```bash
vercel deploy -y
```

For the deployed frontend to talk to a live backend, configure `REACT_APP_BACKEND_URL` in the frontend deployment to point at a hosted FastAPI API. The backend can be deployed from `backend/` with its included Vercel configuration or hosted on a Python-capable platform such as Render, Railway, Fly.io, or a VM.

```bash
REACT_APP_BACKEND_URL=https://your-api-host.example.com
```

Backend hosting also requires:

```bash
MONGO_URL=your_mongodb_connection_string
DB_NAME=metamirror
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL_NAME=gemini-1.5-pro-latest
CORS_ORIGINS=https://your-frontend-domain.example.com
```

## Security Notes

- `.env`, `.history/`, `.lh/`, local virtual environments, build artifacts, and dependency folders are ignored.
- The repository previously contained generated local history snapshots; these have been removed from the tracked tree.
- If any real secret was ever committed, rotate it in the provider dashboard and consider rewriting git history before making the repository public.

## Roadmap

- Add authentication and persistent user accounts.
- Add automated backend tests with a test database fixture.
- Add production backend deployment configuration.
- Add CI for frontend build and backend lint/test checks.
- Add privacy and clinical safety disclaimers inside the user flow.

## License

This project is licensed under the [MIT License](LICENSE).

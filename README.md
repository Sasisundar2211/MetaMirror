# MetaMirror

Bio-Adaptive Metaverse for Mental Well-Being

## Overview

MetaMirror is an innovative AI-powered therapeutic platform that combines emotional recognition, adaptive environments, and conversational AI to support mental well-being. The platform uses facial emotion detection to create personalized, immersive experiences that respond to users' emotional states in real-time.

## Features

- 🎭 **Emotion Recognition**: Real-time facial emotion detection using face-api.js
- 🤖 **AI Therapy Assistant**: Conversational AI powered by OpenAI GPT-4 and Google Gemini
- 🌈 **Adaptive Environments**: Dynamic 3D environments that respond to emotional states
- 📊 **Analytics Dashboard**: Track emotional patterns and session insights
- 💬 **Chat History**: Maintain context across therapy sessions
- 🔒 **Privacy-Focused**: Secure data handling with MongoDB

## Tech Stack

### Frontend
- React 19 with React Router
- Three.js & React Three Fiber for 3D environments
- face-api.js for emotion detection
- Tailwind CSS & Radix UI components
- Axios for API communication

### Backend
- FastAPI (Python)
- MongoDB with Motor (async driver)
- OpenAI GPT-4 API
- Google Gemini API
- CORS middleware for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- MongoDB instance
- OpenAI API key and/or Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sasisundar2211/MetaMirror.git
cd MetaMirror
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

3. Set up the frontend:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with REACT_APP_BACKEND_URL
npm start
```

4. Access the application at `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- GitHub Actions CI/CD setup
- Deployment to Railway, Render, Vercel, or GitHub Pages
- Docker Compose configuration
- Environment variable configuration

## GitHub Actions

The repository includes automated CI/CD workflows:
- ✅ Frontend build and deployment
- ✅ Backend linting and testing
- ✅ Automated deployment to GitHub Pages
- ✅ Code quality checks

## API Endpoints

### Users
- `POST /api/users` - Create new user
- `GET /api/users/{user_id}` - Get user details

### Sessions
- `POST /api/sessions` - Start new session
- `GET /api/sessions/{session_id}` - Get session details
- `POST /api/sessions/end` - End session
- `GET /api/sessions/user/{user_id}` - Get user's sessions

### Emotions
- `POST /api/emotions/track` - Track emotion data

### Chat
- `POST /api/chat` - Send message to AI therapist
- `GET /api/chat/history/{session_id}` - Get chat history

### Analytics
- `GET /api/analytics/{session_id}` - Get session analytics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

# MetaMirror Deployment Guide

This guide provides instructions for deploying the MetaMirror application using GitHub Actions and various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- GitHub repository set up
- Required API keys (OpenAI and/or Gemini)
- MongoDB instance (MongoDB Atlas recommended)
- Hosting accounts (optional, based on deployment method)

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory (see `.env.example`):

```env
# MongoDB Configuration
MONGO_URL=mongodb://your-mongo-instance:27017
DB_NAME=metamirror

# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (see `.env.example`):

```env
# Backend API URL
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

## GitHub Actions Workflows

The repository includes three GitHub Actions workflows:

### 1. Main CI Workflow (`ci.yml`)
- Runs on every push and pull request
- Tests both frontend and backend
- Validates code quality with linting

### 2. Frontend CI/CD (`frontend-ci.yml`)
- Builds the React application
- Deploys to GitHub Pages on main branch
- Artifacts stored for 7 days

### 3. Backend CI/CD (`backend-ci.yml`)
- Lints Python code with flake8, black, and mypy
- Creates deployment package
- Ready for deployment to cloud services

## Deployment Options

### Option 1: GitHub Pages (Frontend Only)

The frontend can be automatically deployed to GitHub Pages:

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - deployment happens automatically
4. (Optional) Add custom domain in repository secrets as `CUSTOM_DOMAIN`

### Option 2: Railway (Full Stack)

Deploy both frontend and backend to Railway:

1. Sign up at [Railway.app](https://railway.app)
2. Create a new project
3. Add MongoDB service
4. Deploy backend:
   - Add service from GitHub repo
   - Set root directory to `backend`
   - Add environment variables
   - Set start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

5. Deploy frontend:
   - Add another service from GitHub repo
   - Set root directory to `frontend`
   - Add `REACT_APP_BACKEND_URL` pointing to backend service
   - Railway will auto-detect and build React app

### Option 3: Render (Full Stack)

1. Sign up at [Render.com](https://render.com)
2. Create a new Web Service for backend:
   - Connect GitHub repository
   - Set root directory to `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Add environment variables

3. Create a Static Site for frontend:
   - Connect GitHub repository
   - Set root directory to `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `build`
   - Add environment variable `REACT_APP_BACKEND_URL`

### Option 4: Vercel (Frontend) + Railway/Render (Backend)

1. Deploy backend to Railway or Render (see above)
2. Deploy frontend to Vercel:
   - Import project from GitHub
   - Set root directory to `frontend`
   - Add environment variable: `REACT_APP_BACKEND_URL`
   - Deploy

### Option 5: Docker Compose (Self-Hosted)

Create `docker-compose.yml` in the root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=metamirror
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8000
    depends_on:
      - backend

volumes:
  mongo-data:
```

Then run: `docker-compose up -d`

## Required GitHub Secrets

For automated deployments, add these secrets to your GitHub repository:

### Frontend Deployment
- `REACT_APP_BACKEND_URL`: Your backend API URL
- `CUSTOM_DOMAIN`: (Optional) Custom domain for GitHub Pages

### Backend Deployment
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `OPENAI_API_KEY`: OpenAI API key
- `GEMINI_API_KEY`: Google Gemini API key
- `RAILWAY_TOKEN`: (If using Railway) Railway authentication token
- `RENDER_API_KEY`: (If using Render) Render API key
- `RENDER_SERVICE_ID`: (If using Render) Render service ID

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
# Create .env file with required variables
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
# Create .env file with REACT_APP_BACKEND_URL
npm start
```

## Monitoring and Logs

- GitHub Actions logs: Available in the "Actions" tab of your repository
- Railway/Render: Check respective platform dashboards
- Local: Check terminal output and browser console

## Troubleshooting

### Build Failures
- Check GitHub Actions logs for specific errors
- Verify all dependencies are correctly specified
- Ensure environment variables are set

### Deployment Issues
- Verify API keys are valid
- Check MongoDB connection string
- Ensure CORS settings allow frontend domain
- Verify backend URL is accessible from frontend

### Common Errors
1. **Module not found**: Run `npm ci` or `pip install -r requirements.txt`
2. **CORS errors**: Update `CORS_ORIGINS` in backend `.env`
3. **MongoDB connection failed**: Check `MONGO_URL` format and credentials
4. **Build timeout**: Increase GitHub Actions timeout or optimize build

## Support

For issues and questions:
- Check GitHub Issues
- Review GitHub Actions logs
- Consult platform-specific documentation (Railway, Render, Vercel)

# MetaMirror Backend

Bio-Adaptive Metaverse for Mental Well-Being - Backend API

## Quick Start

```bash
# 1. Check MongoDB is running
check_mongodb.bat

# 2. Start the server
start_server.bat

# 3. Test the API
python test_api.py
```

Server will be at: `http://127.0.0.1:8000` | Docs at: `http://127.0.0.1:8000/docs`

## Setup

### Prerequisites
- Python 3.8+
- MongoDB (running on localhost:27017)

### Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables in `.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=metamirror
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
CORS_ORIGINS=*
```

## Running the Server

### Option 1: Using the batch script (Recommended)
```bash
start_server.bat
```

### Option 2: Manual command
```bash
# Activate virtual environment first
venv\Scripts\activate

# Start the server
uvicorn server:app --reload
```

The server will be available at: `http://127.0.0.1:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Important Notes

⚠️ **Common Issue**: If you get `Could not import module "app"` error, make sure you're using:
```bash
uvicorn server:app --reload
```
NOT:
```bash
uvicorn app:app --reload
```

The file is named `server.py`, so the module name is `server`, not `app`.

## API Providers

The backend supports two AI providers:
- **OpenAI GPT-4** - Requires OPENAI_API_KEY
- **Google Gemini** - Requires GEMINI_API_KEY (Default)

At least one provider must be configured for the chat functionality to work.

## MongoDB

Make sure MongoDB is running before starting the server:
```bash
# Check MongoDB status
check_mongodb.bat

# Or manually check
mongosh --eval "db.version()"
```

If MongoDB is not running, start it:
```bash
# Windows (run as Administrator)
net start MongoDB
```

## Troubleshooting

If you encounter errors like "Failed to create profiles", see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

Common issues:
- **MongoDB not running** → Run `check_mongodb.bat` and start MongoDB
- **Port 8000 in use** → Use `uvicorn server:app --reload --port 8001`
- **Duplicate email** → Clear database: `mongosh` → `use metamirror` → `db.users.deleteMany({})`

## Testing

Run the test suite to verify everything is working:
```bash
python test_api.py
```

## Project Structure

```
backend/
├── server.py              # Main FastAPI application
├── .env                   # Environment variables
├── requirements.txt       # Python dependencies
├── start_server.bat      # Server startup script
├── check_mongodb.bat     # MongoDB diagnostics
├── test_api.py           # API test suite
├── README.md             # This file
└── TROUBLESHOOTING.md    # Detailed troubleshooting guide
```

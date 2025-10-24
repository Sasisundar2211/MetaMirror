# Troubleshooting Guide - MetaMirror Backend

## Issue: "Failed to create profiles"

This error typically occurs when the backend cannot connect to MongoDB or there's an issue with the user creation endpoint.

### Quick Diagnosis

Run these scripts to diagnose the issue:

1. **Check MongoDB Status:**
   ```bash
   check_mongodb.bat
   ```

2. **Test API Endpoints:**
   ```bash
   # Activate venv first
   venv\Scripts\activate
   
   # Run test script
   python test_api.py
   ```

### Common Solutions

#### 1. MongoDB Not Running

**Symptoms:**
- "Failed to create profiles"
- Connection timeout errors in server logs

**Solution:**
```bash
# Start MongoDB service (run as Administrator)
net start MongoDB

# Or check if it's installed
sc query MongoDB
```

If MongoDB is not installed:
- Download from: https://www.mongodb.com/try/download/community
- Or install via chocolatey: `choco install mongodb`

#### 2. Check Environment Variables

Make sure `.env` file exists and contains:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=metamirror
OPENAI_API_KEY=
GEMINI_API_KEY=
CORS_ORIGINS=*
```

#### 3. Port Already in Use

If port 8000 is already in use:
```bash
# Check what's using port 8000
netstat -ano | findstr :8000

# Start server on different port
uvicorn server:app --reload --port 8001
```

#### 4. CORS Issues

If calling from frontend and getting CORS errors:
- Check that `CORS_ORIGINS` in `.env` includes your frontend URL
- For development: `CORS_ORIGINS=*`
- For production: `CORS_ORIGINS=http://localhost:3000,http://localhost:5173`

#### 5. Duplicate Email Error

If you see "User with this email already exists":
```bash
# Connect to MongoDB and clear users
mongosh
use metamirror
db.users.deleteMany({})
exit
```

### Testing the API

#### Using curl (Windows):
```bash
# Test root endpoint
curl http://127.0.0.1:8000/

# Test API root
curl http://127.0.0.1:8000/api/

# Create a user
curl -X POST http://127.0.0.1:8000/api/users -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\"}"
```

#### Using Browser:
1. Open: `http://127.0.0.1:8000/docs`
2. Try the `/api/users` POST endpoint
3. Fill in the request body and execute

#### Using Python Test Script:
```bash
python test_api.py
```

### Server Logs

The improved server now shows detailed logs:
- ✓ MongoDB connection successful
- User created successfully: [user_id]
- Error messages with details

Watch the server console output when making requests to see what's failing.

### Still Having Issues?

1. **Restart the server:**
   ```bash
   # Stop with Ctrl+C
   # Start again
   uvicorn server:app --reload
   ```

2. **Check server logs** - Look for specific error messages

3. **Verify MongoDB is accessible:**
   ```bash
   mongosh --eval "db.version()"
   ```

4. **Try the interactive API docs:**
   `http://127.0.0.1:8000/docs`

### Getting Help

When reporting issues, include:
1. Error message from server logs
2. Output of `check_mongodb.bat`
3. Output of `python test_api.py`
4. Request you're trying to make

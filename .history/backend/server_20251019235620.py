from fastapi import FastAPI, APIRouter, HTTPException, Body
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from openai import OpenAI
import google.generativeai as genai
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'metamirror')

logger.info(f"Connecting to MongoDB at: {mongo_url}")
logger.info(f"Database name: {db_name}")

try:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logger.info("MongoDB client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MongoDB client: {e}")
    raise

# AI Providers Setup
def _normalize_env_key(val: str) -> str:
    """Normalize env values by trimming whitespace and surrounding quotes if present."""
    if not val:
        return ""
    v = val.strip()
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        v = v[1:-1]
    return v


openai_api_key = _normalize_env_key(os.environ.get('OPENAI_API_KEY', '') or '')
gemini_api_key = _normalize_env_key(os.environ.get('GEMINI_API_KEY', '') or '')
openrouter_api_key = _normalize_env_key(os.environ.get('OPENROUTER_API_KEY', '') or '')
# Allow disabling OpenAI explicitly even if a key exists (useful if you don't want to use OpenAI)
def _parse_bool(val: str) -> bool:
    if isinstance(val, bool):
        return val
    if val is None:
        return False
    v = str(val).strip().lower()
    return v in ("1", "true", "yes", "y")

enable_openai_raw = _normalize_env_key(os.environ.get('ENABLE_OPENAI', 'true'))
enable_openai = _parse_bool(enable_openai_raw)

# Initialize OpenAI
openai_client = None
if openai_api_key and enable_openai:
    openai_client = OpenAI(api_key=openai_api_key)
    logger.info("OpenAI initialized (key present and ENABLE_OPENAI enabled)")
elif openai_api_key and not enable_openai:
    logger.info("OpenAI API key found but disabled by ENABLE_OPENAI; OpenAI will not be used")
else:
    logger.info("OpenAI not configured or no key provided")

# Initialize Gemini
gemini_model = None
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    try:
        gemini_model = genai.GenerativeModel('gemini-1.5-pro-latest')
        logger.info("Gemini API key provided: %s", True)
    except Exception as e:
        logger.error("Failed to initialize Gemini model: %s", e)

# Initialize OpenRouter
openrouter_client = None
if openrouter_api_key:
    openrouter_client = OpenAI(
        api_key=openrouter_api_key,
        base_url="https://openrouter.ai/api/v1"
    )
    logger.info("OpenRouter API key provided: %s", bool(openrouter_api_key))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    avatar_style: Optional[str] = "default"
    preferred_provider: Optional[str] = "gemini"  # 'openai', 'gemini', or 'openrouter'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    name: str
    email: str
    avatar_style: Optional[str] = "default"
    preferred_provider: Optional[str] = "gemini"  # 'openai', 'gemini', or 'openrouter'

class EmotionData(BaseModel):
    emotion: str
    confidence: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # 'user' or 'assistant'
    content: str
    emotion_state: Optional[str] = None
    provider: Optional[str] = None  # Track which AI provider was used
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageCreate(BaseModel):
    session_id: str
    content: str
    emotion_state: Optional[str] = None

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    start_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    end_time: Optional[datetime] = None
    emotions_timeline: List[Dict[str, Any]] = Field(default_factory=list)
    current_environment: str = "calm"
    is_active: bool = True

class SessionCreate(BaseModel):
    user_id: str

class SessionEnd(BaseModel):
    session_id: str

class ChatRequest(BaseModel):
    session_id: str
    message: str
    emotion_state: Optional[str] = None
    provider: Optional[str] = "gemini"  # Allow provider selection ('openai', 'gemini', or 'openrouter')

# API Endpoints
@api_router.get("/")
async def root():
    return {
        "message": "MetaMirror API - Bio-Adaptive Metaverse for Mental Well-Being",
        "providers": {
            "openai": openai_client is not None,
            "gemini": gemini_model is not None
        }
    }

# User endpoints
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    try:
        user_obj = User(**user.model_dump())
        logger.info(f"Attempting to create user: {user_obj.model_dump_json()}")
        
        doc = user_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Check if user with email already exists
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            logger.warning(f"User with email {user.email} already exists.")
            # Return existing user's data instead of raising an error
            existing_user_obj = User(**existing_user)
            return existing_user_obj
        
        await db.users.insert_one(doc)
        logger.info(f"User created successfully: {user_obj.id}")
        return user_obj
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    logger.info(f"Fetching user with ID: {user_id}")
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    
    if not user_doc:
        logger.warning(f"User with ID {user_id} not found")
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"Found user document: {user_doc}")
    
    try:
        # Ensure 'created_at' is a datetime object
        if isinstance(user_doc.get('created_at'), str):
            user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
        
        user_obj = User(**user_doc)
        logger.info(f"Returning user object: {user_obj.model_dump_json()}")
        return user_obj
    except Exception as e:
        logger.error(f"Error processing user document: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing user data")

# Session endpoints
@api_router.post("/sessions", response_model=Session)
async def create_session(session: SessionCreate):
    session_obj = Session(**session.model_dump())
    doc = session_obj.model_dump()
    doc['start_time'] = doc['start_time'].isoformat()
    if doc['end_time']:
        doc['end_time'] = doc['end_time'].isoformat()
    await db.sessions.insert_one(doc)
    return session_obj

@api_router.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session_doc = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=404, detail="Session not found")
    if isinstance(session_doc['start_time'], str):
        session_doc['start_time'] = datetime.fromisoformat(session_doc['start_time'])
    if session_doc.get('end_time') and isinstance(session_doc['end_time'], str):
        session_doc['end_time'] = datetime.fromisoformat(session_doc['end_time'])
    return Session(**session_doc)

@api_router.post("/sessions/end")
async def end_session(data: SessionEnd):
    result = await db.sessions.update_one(
        {"id": data.session_id},
        {"$set": {
            "end_time": datetime.now(timezone.utc).isoformat(),
            "is_active": False
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True}

@api_router.get("/sessions/user/{user_id}", response_model=List[Session])
async def get_user_sessions(user_id: str):
    sessions = await db.sessions.find({"user_id": user_id}, {"_id": 0}).sort("start_time", -1).to_list(100)
    for session in sessions:
        if isinstance(session['start_time'], str):
            session['start_time'] = datetime.fromisoformat(session['start_time'])
        if session.get('end_time') and isinstance(session['end_time'], str):
            session['end_time'] = datetime.fromisoformat(session['end_time'])
    return sessions

# Emotion tracking
@api_router.post("/emotions/track")
async def track_emotion(session_id: str = Body(...), emotion: str = Body(...), confidence: float = Body(...)):
    emotion_data = {
        "emotion": emotion,
        "confidence": confidence,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # Update session with emotion data
    await db.sessions.update_one(
        {"id": session_id},
        {"$push": {"emotions_timeline": emotion_data}}
    )
    
    # Determine adaptive environment based on emotion
    environment = determine_environment(emotion)
    await db.sessions.update_one(
        {"id": session_id},
        {"$set": {"current_environment": environment}}
    )
    
    return {"success": True, "environment": environment}

def determine_environment(emotion: str) -> str:
    """Map emotions to therapeutic environments"""
    if emotion in ["happy", "neutral"]:
        return "calm"
    elif emotion in ["sad", "fearful"]:
        return "comfort"
    elif emotion == "surprised":
        return "energy"
    elif emotion == "angry":
        return "focus"
    else:
        return "calm"

# Chat endpoints with multi-provider support
@api_router.post("/chat")
async def chat_with_therapist(request: ChatRequest):
    provider = request.provider or "gemini"
    
    # Validate provider availability
    if provider == "openai" and not openai_client:
        raise HTTPException(status_code=503, detail="OpenAI provider not configured")
    if provider == "gemini" and not gemini_model:
        raise HTTPException(status_code=503, detail="Gemini provider not configured")
    if provider == "openrouter" and not openrouter_client:
        raise HTTPException(status_code=503, detail="OpenRouter provider not configured")
    
    # Save user message
    user_message = Message(
        session_id=request.session_id,
        role="user",
        content=request.message,
        emotion_state=request.emotion_state,
        provider=provider
    )
    user_msg_doc = user_message.model_dump()
    user_msg_doc['timestamp'] = user_msg_doc['timestamp'].isoformat()
    await db.messages.insert_one(user_msg_doc)
    
    # Get conversation history
    history = await db.messages.find(
        {"session_id": request.session_id},
        {"_id": 0}
    ).sort("timestamp", 1).limit(10).to_list(10)
    
    # Build system prompt
    system_prompt = f"""You are a compassionate AI therapist in MetaMirror, a bio-adaptive metaverse for mental well-being. 
Your role is to provide empathetic, supportive guidance to users dealing with stress, anxiety, and emotional challenges.

Current user emotional state: {request.emotion_state or 'neutral'}

Guidelines:
- Be warm, empathetic, and non-judgmental
- Ask open-ended questions to understand their feelings
- Provide coping strategies and mindfulness techniques
- Encourage self-reflection and emotional awareness
- Keep responses concise (2-4 sentences)
- Never diagnose or replace professional therapy
- Adapt your tone to their emotional state"""
    
    try:
        if provider == "openai":
            ai_response = await chat_with_openai(system_prompt, history)
        elif provider == "openrouter":
            ai_response = await chat_with_openrouter(system_prompt, history)
        else:  # gemini
            ai_response = await chat_with_gemini(system_prompt, history, request.message)
        
        # Save AI response
        ai_message = Message(
            session_id=request.session_id,
            role="assistant",
            content=ai_response,
            emotion_state=request.emotion_state,
            provider=provider
        )
        ai_msg_doc = ai_message.model_dump()
        ai_msg_doc['timestamp'] = ai_msg_doc['timestamp'].isoformat()
        await db.messages.insert_one(ai_msg_doc)
        
        return {
            "message": ai_response,
            "emotion_state": request.emotion_state,
            "provider": provider
        }
    
    except Exception as e:
        logging.error(f"AI service error ({provider}): {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

async def chat_with_openai(system_prompt: str, history: List[Dict]) -> str:
    """Chat using OpenAI GPT"""
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history
    for msg in history[-6:]:  # Last 3 exchanges
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=150,
        temperature=0.8
    )
    
    return response.choices[0].message.content

async def chat_with_openrouter(system_prompt: str, history: List[Dict]) -> str:
    """Chat using OpenRouter"""
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history
    for msg in history[-6:]:  # Last 3 exchanges
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    
    response = openrouter_client.chat.completions.create(
        model="gryphe/mythomax-l2-13b",
        messages=messages,
        max_tokens=150,
        temperature=0.8
    )
    
    return response.choices[0].message.content

async def chat_with_gemini(system_prompt: str, history: List[Dict], current_message: str) -> str:
    """Chat using Google Gemini"""
    # Build conversation context
    conversation_context = system_prompt + "\n\nConversation history:\n"
    for msg in history[-6:]:
        role = "User" if msg["role"] == "user" else "Therapist"
        conversation_context += f"{role}: {msg['content']}\n"
    
    conversation_context += f"\nUser: {current_message}\n\nTherapist:"
    
    response = gemini_model.generate_content(conversation_context)
    return response.text

@api_router.get("/chat/history/{session_id}", response_model=List[Message])
async def get_chat_history(session_id: str):
    messages = await db.messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    
    for msg in messages:
        if isinstance(msg['timestamp'], str):
            msg['timestamp'] = datetime.fromisoformat(msg['timestamp'])
    
    return messages

# Analytics endpoint
@api_router.get("/analytics/{session_id}")
async def get_session_analytics(session_id: str):
    session_doc = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=404, detail="Session not found")
    
    emotions_timeline = session_doc.get('emotions_timeline', [])
    
    # Calculate emotion statistics
    emotion_counts = {}
    for emotion_data in emotions_timeline:
        emotion = emotion_data['emotion']
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
    
    # Calculate duration
    start = datetime.fromisoformat(session_doc['start_time']) if isinstance(session_doc['start_time'], str) else session_doc['start_time']
    end = datetime.fromisoformat(session_doc['end_time']) if session_doc.get('end_time') and isinstance(session_doc['end_time'], str) else datetime.now(timezone.utc)
    duration_minutes = (end - start).total_seconds() / 60
    
    return {
        "session_id": session_id,
        "duration_minutes": round(duration_minutes, 2),
        "emotions_detected": len(emotions_timeline),
        "emotion_distribution": emotion_counts,
        "dominant_emotion": max(emotion_counts, key=emotion_counts.get) if emotion_counts else "neutral",
        "emotions_timeline": emotions_timeline
    }

# Include router
app.include_router(api_router)

# Add root endpoint
@app.get("/")
async def root():
    return {
        "message": "MetaMirror API - Bio-Adaptive Metaverse for Mental Well-Being",
        "status": "running",
        "docs": "/docs",
        "api_prefix": "/api",
        "providers": {
            "openai": openai_client is not None,
            "gemini": gemini_model is not None,
            "openrouter": openrouter_client is not None
        }
    }

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    try:
        # Test MongoDB connection
        await client.admin.command('ping')
        logger.info("✓ MongoDB connection successful")
    except Exception as e:
        logger.error(f"✗ MongoDB connection failed: {e}")
        logger.warning("Server will start but database operations will fail until MongoDB is available")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("MongoDB connection closed")
"""
Unit tests for Pydantic models defined in server.py.

These tests exercise model creation, default values, and validation logic
without requiring a running MongoDB instance or Gemini API key.
"""

import sys
import os

# Ensure the backend directory is on the path so 'server' can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from server import (
    ChatRequest,
    EmotionData,
    Message,
    Session,
    SessionCreate,
    SessionEnd,
    User,
    UserCreate,
)


# ---------------------------------------------------------------------------
# User / UserCreate
# ---------------------------------------------------------------------------

class TestUserModel:
    def test_defaults(self):
        user = User(name="Alice", email="alice@example.com")
        assert user.name == "Alice"
        assert user.email == "alice@example.com"
        assert user.avatar_style == "default"
        assert user.preferred_provider == "gemini"
        assert user.id is not None
        assert len(user.id) > 0

    def test_id_is_unique(self):
        u1 = User(name="A", email="a@example.com")
        u2 = User(name="B", email="b@example.com")
        assert u1.id != u2.id

    def test_custom_avatar_and_provider(self):
        user = User(name="Bob", email="bob@example.com", avatar_style="warrior", preferred_provider="openai")
        assert user.avatar_style == "warrior"
        assert user.preferred_provider == "openai"

    def test_created_at_set_automatically(self):
        user = User(name="C", email="c@example.com")
        assert user.created_at is not None


class TestUserCreateModel:
    def test_required_fields(self):
        uc = UserCreate(name="Dave", email="dave@example.com")
        assert uc.name == "Dave"
        assert uc.email == "dave@example.com"

    def test_default_provider_is_gemini(self):
        uc = UserCreate(name="Eve", email="eve@example.com")
        assert uc.preferred_provider == "gemini"


# ---------------------------------------------------------------------------
# Session / SessionCreate / SessionEnd
# ---------------------------------------------------------------------------

class TestSessionModel:
    def test_defaults(self):
        session = Session(user_id="user-abc")
        assert session.user_id == "user-abc"
        assert session.current_environment == "calm"
        assert session.is_active is True
        assert session.emotions_timeline == []
        assert session.end_time is None
        assert session.id is not None

    def test_id_is_unique(self):
        s1 = Session(user_id="u1")
        s2 = Session(user_id="u1")
        assert s1.id != s2.id


class TestSessionCreateModel:
    def test_required_user_id(self):
        sc = SessionCreate(user_id="user-xyz")
        assert sc.user_id == "user-xyz"


class TestSessionEndModel:
    def test_session_id(self):
        se = SessionEnd(session_id="sess-001")
        assert se.session_id == "sess-001"


# ---------------------------------------------------------------------------
# Message / MessageCreate
# ---------------------------------------------------------------------------

class TestMessageModel:
    def test_defaults(self):
        msg = Message(session_id="sess-1", role="user", content="Hello")
        assert msg.session_id == "sess-1"
        assert msg.role == "user"
        assert msg.content == "Hello"
        assert msg.emotion_state is None
        assert msg.provider is None
        assert msg.id is not None

    def test_assistant_role(self):
        msg = Message(session_id="sess-1", role="assistant", content="How are you feeling?")
        assert msg.role == "assistant"

    def test_optional_fields(self):
        msg = Message(
            session_id="sess-1",
            role="user",
            content="I feel anxious",
            emotion_state="anxious",
            provider="gemini",
        )
        assert msg.emotion_state == "anxious"
        assert msg.provider == "gemini"


# ---------------------------------------------------------------------------
# ChatRequest
# ---------------------------------------------------------------------------

class TestChatRequestModel:
    def test_defaults(self):
        req = ChatRequest(session_id="sess-2", message="Hi there")
        assert req.session_id == "sess-2"
        assert req.message == "Hi there"
        assert req.provider == "gemini"
        assert req.emotion_state is None

    def test_custom_emotion_state(self):
        req = ChatRequest(session_id="sess-2", message="I'm sad", emotion_state="sad")
        assert req.emotion_state == "sad"


# ---------------------------------------------------------------------------
# EmotionData
# ---------------------------------------------------------------------------

class TestEmotionDataModel:
    def test_valid_emotion(self):
        ed = EmotionData(emotion="happy", confidence=0.95)
        assert ed.emotion == "happy"
        assert ed.confidence == 0.95

    def test_low_confidence(self):
        ed = EmotionData(emotion="neutral", confidence=0.1)
        assert ed.confidence == 0.1

    def test_timestamp_set_automatically(self):
        ed = EmotionData(emotion="sad", confidence=0.7)
        assert ed.timestamp is not None

import axios from 'axios';

// Provide a safe default for the backend URL so the frontend doesn't fail
// when REACT_APP_BACKEND_URL isn't set. In development this will point to
// localhost:8000 which is where the FastAPI backend usually runs.
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
export const API = `${BACKEND_URL}/api`;

// User APIs
export const createUser = async (userData) => {
  const response = await axios.post(`${API}/users`, userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axios.get(`${API}/users/${userId}`);
  return response.data;
};

// Session APIs
export const createSession = async (userId) => {
  const response = await axios.post(`${API}/sessions`, { user_id: userId });
  return response.data;
};

export const endSession = async (sessionId) => {
  const response = await axios.post(`${API}/sessions/end`, { session_id: sessionId });
  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await axios.get(`${API}/sessions/${sessionId}`);
  return response.data;
};

export const getUserSessions = async (userId) => {
  const response = await axios.get(`${API}/sessions/user/${userId}`);
  return response.data;
};

// Emotion APIs
export const trackEmotion = async (sessionId, emotion, confidence) => {
  const response = await axios.post(`${API}/emotions/track`, {
    session_id: sessionId,
    emotion,
    confidence
  });
  return response.data;
};

// Chat APIs
export const sendChatMessage = async (sessionId, message, emotionState, provider) => {
  const response = await axios.post(`${API}/chat`, {
    session_id: sessionId,
    message,
    emotion_state: emotionState,
    provider
  });
  return response.data;
};

export const getChatHistory = async (sessionId) => {
  const response = await axios.get(`${API}/chat/history/${sessionId}`);
  return response.data;
};

// Analytics APIs
export const getSessionAnalytics = async (sessionId) => {
  const response = await axios.get(`${API}/analytics/${sessionId}`);
  return response.data;
};
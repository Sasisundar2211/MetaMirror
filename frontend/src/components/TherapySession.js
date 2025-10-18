import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Brain, LogOut } from "lucide-react";
import { toast } from "sonner";
import EmotionDetector from "./EmotionDetector";
import AdaptiveEnvironment from "./AdaptiveEnvironment";
import ChatInterface from "./ChatInterface";
import { createSession, endSession as endSessionAPI } from "../utils/api";

const TherapySession = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [environment, setEnvironment] = useState("calm");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const userData = localStorage.getItem("metamirror_user");
      if (!userData) {
        toast.error("Please complete onboarding first");
        navigate("/onboarding");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      try {
        const newSession = await createSession(parsedUser.id);
        setSession(newSession);
        setIsLoading(false);
        toast.success("Session started!");
      } catch (error) {
        toast.error("Failed to start session");
        console.error(error);
      }
    };

    initSession();
  }, [navigate]);

  const handleEndSession = async () => {
    if (session) {
      try {
        await endSessionAPI(session.id);
        toast.success("Session ended. Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        toast.error("Failed to end session");
        console.error(error);
      }
    }
  };

  const handleEmotionDetected = (emotion, confidence) => {
    setCurrentEmotion(emotion);
    // Environment is updated by backend, but we can set it locally too
    const envMap = {
      happy: "calm",
      neutral: "calm",
      sad: "comfort",
      fearful: "comfort",
      angry: "focus",
      surprised: "energy"
    };
    setEnvironment(envMap[emotion] || "calm");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyan-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Initializing your therapy session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-cyan-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">MetaMirror Session</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-full">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-cyan-700 capitalize">{currentEmotion}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleEndSession}
            data-testid="end-session-btn"
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Environment & Webcam */}
        <div className="flex-1 flex flex-col">
          {/* Adaptive Environment */}
          <div className="flex-1 relative">
            <AdaptiveEnvironment environment={environment} emotion={currentEmotion} />
          </div>

          {/* Webcam Emotion Detector */}
          <div className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-200">
            <EmotionDetector
              sessionId={session?.id}
              onEmotionDetected={handleEmotionDetected}
            />
          </div>
        </div>

        {/* Right: Chat Interface */}
        <div className="w-full md:w-[450px] border-l border-gray-200 bg-white flex flex-col">
          {session && (
            <ChatInterface
              sessionId={session.id}
              currentEmotion={currentEmotion}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapySession;
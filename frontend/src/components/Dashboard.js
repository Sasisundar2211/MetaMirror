import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Brain, Plus, Clock, TrendingUp, Smile, Frown, Meh } from "lucide-react";
import { toast } from "sonner";
import { getUserSessions, getSessionAnalytics } from "../utils/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const emotionColors = {
  happy: "#10b981",
  neutral: "#3b82f6",
  sad: "#f59e0b",
  angry: "#ef4444",
  fearful: "#8b5cf6",
  surprised: "#06b6d4"
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem("metamirror_user");
      if (!userData) {
        toast.error("Please complete onboarding first");
        navigate("/onboarding");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      try {
        const userSessions = await getUserSessions(parsedUser.id);
        setSessions(userSessions);
        
        // Load analytics for most recent session
        if (userSessions.length > 0) {
          const recentSession = userSessions[0];
          setSelectedSession(recentSession);
          const sessionAnalytics = await getSessionAnalytics(recentSession.id);
          setAnalytics(sessionAnalytics);
        }
      } catch (error) {
        console.error("Failed to load sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleSessionClick = async (session) => {
    setSelectedSession(session);
    try {
      const sessionAnalytics = await getSessionAnalytics(session.id);
      setAnalytics(sessionAnalytics);
    } catch (error) {
      toast.error("Failed to load session analytics");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const emotionChartData = analytics?.emotion_distribution
    ? Object.entries(analytics.emotion_distribution).map(([emotion, count]) => ({
        name: emotion,
        value: count
      }))
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyan-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              data-testid="nav-home-btn"
              className="border-gray-300 hover:bg-gray-50"
            >
              Home
            </Button>
            <Button
              onClick={() => navigate("/session")}
              data-testid="new-session-btn"
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Session
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {sessions.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-md border-white/40 shadow-lg p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Sessions Yet</h2>
            <p className="text-gray-600 mb-6">Start your first therapy session to begin your journey</p>
            <Button
              onClick={() => navigate("/session")}
              data-testid="start-first-session-btn"
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white"
            >
              Start First Session
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Session List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Sessions</h2>
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  data-testid={`session-card-${session.id}`}
                  className={`bg-white/80 backdrop-blur-md border-white/40 p-4 cursor-pointer hover:shadow-lg transition-all ${
                    selectedSession?.id === session.id ? "ring-2 ring-cyan-500 shadow-lg" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      session.is_active ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        session.is_active ? "text-green-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {session.is_active ? "Active Session" : "Past Session"}
                      </p>
                      <p className="text-xs text-gray-600">{formatDate(session.start_time)}</p>
                    </div>
                  </div>
                  {session.current_environment && (
                    <div className="text-xs text-gray-600 capitalize">
                      Environment: {session.current_environment}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Analytics */}
            {analytics && (
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Session Analytics</h2>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-white/80 backdrop-blur-md border-white/40 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.duration_minutes.toFixed(1)}m</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-md border-white/40 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Emotions Tracked</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.emotions_detected}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-md border-white/40 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Smile className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dominant Emotion</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">{analytics.dominant_emotion}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Emotion Distribution Chart */}
                {emotionChartData.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-md border-white/40 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={emotionChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {emotionChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={emotionColors[entry.name] || "#3b82f6"} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
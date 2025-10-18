import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Brain, Sparkles, Heart, Activity, Camera } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-cyan-600" />
          <span className="text-2xl font-bold text-gray-800">MetaMirror</span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          data-testid="nav-dashboard-btn"
          className="bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          Dashboard
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Your Bio-Adaptive
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Mental Sanctuary
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience therapy reimagined. MetaMirror adapts to your emotions in real-time, 
              creating personalized therapeutic environments for your mental well-being.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/onboarding')}
              data-testid="get-started-btn"
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin Your Journey
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-white/40">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Emotion Detection</h3>
            <p className="text-gray-600">
              Advanced facial recognition analyzes your emotional state through your webcam, 
              providing instant adaptive responses.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-white/40">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Therapist Companion</h3>
            <p className="text-gray-600">
              Chat with an empathetic AI therapist powered by GPT-5, trained to provide 
              compassionate support and coping strategies.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-white/40">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptive Environments</h3>
            <p className="text-gray-600">
              Immersive therapeutic spaces that transform based on your emotions - 
              from calm forests to energizing landscapes.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-white/40">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">Real-Time</div>
              <div className="text-gray-600">Emotion Analysis</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">AI-Powered</div>
              <div className="text-gray-600">Therapy Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-600 mb-2">Private</div>
              <div className="text-gray-600">& Secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
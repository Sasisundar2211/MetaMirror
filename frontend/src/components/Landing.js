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

        {/* How It Works Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How MetaMirror Works</h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Experience the future of digital therapy through our innovative bio-adaptive platform
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-lg h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <div className="mb-6 mt-4">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                    <Camera className="w-24 h-24 text-cyan-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Emotion Detection</h3>
                <p className="text-gray-600 text-sm">
                  Your webcam analyzes facial expressions using advanced AI to detect your emotional state in real-time.
                  The system recognizes happiness, sadness, anxiety, and other emotions with high accuracy.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-lg h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <div className="mb-6 mt-4">
                  <div className="w-full h-48 bg-gradient-to-br from-teal-100 to-green-100 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-24 h-24 text-teal-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptive Environment</h3>
                <p className="text-gray-600 text-sm">
                  Based on your emotions, the therapeutic environment automatically transforms—from calming forests
                  for stress relief to energizing spaces when you need a boost.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-lg h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <div className="mb-6 mt-4">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <Brain className="w-24 h-24 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Therapy Chat</h3>
                <p className="text-gray-600 text-sm">
                  Chat with your AI therapist powered by GPT-4o or Gemini 2.5 Pro. Get personalized guidance,
                  coping strategies, and emotional support tailored to your current state.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Video/Screenshots */}
          <div className="mt-16 bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">See MetaMirror in Action</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl overflow-hidden flex items-center justify-center hover:shadow-xl transition-all">
                  <div className="text-center">
                    <Activity className="w-16 h-16 text-cyan-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">Emotion Detection Demo</p>
                    <p className="text-sm text-gray-500 mt-1">Real-time facial analysis</p>
                  </div>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-teal-100 to-green-100 rounded-2xl overflow-hidden flex items-center justify-center hover:shadow-xl transition-all">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-teal-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">Adaptive Environments</p>
                    <p className="text-sm text-gray-500 mt-1">Dynamic mood-based scenes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
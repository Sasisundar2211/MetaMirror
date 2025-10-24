import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Brain, User, Mail, Smile } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "../utils/api";

const avatarStyles = [
  { id: "calm", name: "Calm Soul", color: "from-blue-400 to-cyan-400", icon: "😌" },
  { id: "energetic", name: "Energetic Spirit", color: "from-teal-400 to-green-400", icon: "✨" },
  { id: "thoughtful", name: "Thoughtful Mind", color: "from-purple-400 to-pink-400", icon: "💭" },
  { id: "balanced", name: "Balanced Being", color: "from-amber-400 to-orange-400", icon: "🌟" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar_style: "calm",
    preferred_provider: "gemini",
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        toast.error("Please fill in all fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      const user = await createUser(formData);
      localStorage.setItem("metamirror_user", JSON.stringify(user));
      toast.success("Welcome to MetaMirror!");
      setTimeout(() => navigate("/session"), 1000);
    } catch (error) {
      // If the backend provided a detailed message, surface it to the user.
      const serverMessage = error?.response?.data?.detail || error?.message;
      // Distinguish network errors from API errors
      if (!error?.response) {
        toast.error(`Network error while contacting backend at ${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}. Please ensure the backend is running.`);
      } else {
        toast.error(serverMessage || "Failed to create profile. Please try again.");
      }
      // Log full error for debugging
      console.error("Create user error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-lg border-white/40 shadow-2xl p-8 rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Brain className="w-10 h-10 text-cyan-600" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome to MetaMirror</h1>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          <div className={`h-2 w-24 rounded-full transition-all duration-300 ${
            step >= 1 ? "bg-gradient-to-r from-cyan-500 to-teal-500" : "bg-gray-200"
          }`} />
          <div className={`h-2 w-24 rounded-full transition-all duration-300 ${
            step >= 2 ? "bg-gradient-to-r from-cyan-500 to-teal-500" : "bg-gray-200"
          }`} />
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6" data-testid="onboarding-step-1">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Let's get to know you</h2>
              <p className="text-gray-600">Share some basic information to personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  data-testid="onboarding-name-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  data-testid="onboarding-email-input"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              data-testid="onboarding-next-btn"
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white py-6 rounded-xl text-lg font-medium"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Avatar Selection */}
        {step === 2 && (
          <div className="space-y-6" data-testid="onboarding-step-2">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Avatar Style</h2>
              <p className="text-gray-600">Select an avatar that resonates with your personality</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {avatarStyles.map((style) => (
                <button
                  key={style.id}
                  data-testid={`avatar-style-${style.id}`}
                  onClick={() => setFormData({ ...formData, avatar_style: style.id })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.avatar_style === style.id
                      ? "border-cyan-500 bg-cyan-50 shadow-lg scale-105"
                      : "border-gray-200 bg-white hover:border-cyan-300 hover:shadow-md"
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center text-3xl`}>
                    {style.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{style.name}</h3>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                data-testid="onboarding-back-btn"
                className="flex-1 py-6 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                data-testid="onboarding-complete-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white py-6 rounded-xl text-lg font-medium ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {isSubmitting ? 'Starting...' : 'Start Session'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Onboarding;
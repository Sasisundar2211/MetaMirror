import { useEffect, useState } from "react";
import { Cloud, Sun, Moon, Zap } from "lucide-react";

const environments = {
  calm: {
    name: "Calm Sanctuary",
    gradient: "from-blue-300/40 via-cyan-200/40 to-teal-300/40",
    icon: Cloud,
    description: "A peaceful space for relaxation and mindfulness"
  },
  comfort: {
    name: "Comfort Haven",
    gradient: "from-rose-300/40 via-pink-200/40 to-orange-300/40",
    icon: Sun,
    description: "A warm, nurturing environment for healing"
  },
  focus: {
    name: "Focus Chamber",
    gradient: "from-purple-300/40 via-indigo-200/40 to-blue-300/40",
    icon: Moon,
    description: "A centered space for clarity and concentration"
  },
  energy: {
    name: "Energy Field",
    gradient: "from-green-300/40 via-teal-200/40 to-cyan-300/40",
    icon: Zap,
    description: "A vibrant space to boost your spirits"
  }
};

const AdaptiveEnvironment = ({ environment, emotion }) => {
  const [particles, setParticles] = useState([]);
  const currentEnv = environments[environment] || environments.calm;
  const Icon = currentEnv.icon;

  useEffect(() => {
    // Generate floating particles for ambiance
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setParticles(newParticles);
  }, [environment]);

  return (
    <div 
      className={`relative w-full h-full bg-gradient-to-br ${currentEnv.gradient} transition-all duration-1000 overflow-hidden`}
      data-testid="adaptive-environment"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/30 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Environment Info Card */}
      <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg max-w-md border border-white/40">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${currentEnv.gradient.replace('/40', '/60')} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentEnv.name}</h2>
            <p className="text-sm text-gray-600 capitalize">Current emotion: {emotion}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{currentEnv.description}</p>
      </div>

      {/* Breathing Guide (optional relaxation aid) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/40">
          <p className="text-sm text-gray-700 font-medium">Take a deep breath...</p>
        </div>
      </div>

      {/* CSS Animation for floating */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -10px) scale(1.1);
          }
          50% {
            transform: translate(-10px, -20px) scale(0.9);
          }
          75% {
            transform: translate(-15px, -10px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default AdaptiveEnvironment;
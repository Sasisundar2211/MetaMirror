import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { trackEmotion } from "../utils/api";
import * as faceapi from "face-api.js";

const EmotionDetector = ({ sessionId, onEmotionDetected }) => {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const detectionIntervalRef = useRef(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load face detection models:", error);
        toast.error("Face detection models not available. Using simulated emotions.");
        setModelsLoaded(false);
      }
    };

    loadModels();
  }, []);

  const startWebcam = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        startDetection();
        toast.success("Webcam activated");
      }
    } catch (error) {
      console.error("Webcam access denied:", error);
      toast.error("Please allow webcam access to enable emotion detection");
    } finally {
      setIsLoading(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setIsActive(false);
  };

  const startDetection = () => {
    // Detect emotions every 3 seconds
    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && modelsLoaded) {
        try {
          const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detections && detections.expressions) {
            const emotions = detections.expressions;
            const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
              emotions[a] > emotions[b] ? a : b
            );
            const confidence = emotions[dominantEmotion];

            // Track emotion in backend
            await trackEmotion(sessionId, dominantEmotion, confidence);
            
            // Notify parent component
            onEmotionDetected(dominantEmotion, confidence);
          }
        } catch (error) {
          console.error("Emotion detection error:", error);
        }
      } else if (!modelsLoaded) {
        // Simulate emotion detection if models aren't loaded
        const simulatedEmotions = ["neutral", "happy", "calm"];
        const emotion = simulatedEmotions[Math.floor(Math.random() * simulatedEmotions.length)];
        const confidence = 0.7 + Math.random() * 0.3;
        
        await trackEmotion(sessionId, emotion, confidence);
        onEmotionDetected(emotion, confidence);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Emotion Detection</h3>
        <Button
          size="sm"
          variant={isActive ? "destructive" : "default"}
          onClick={isActive ? stopWebcam : startWebcam}
          disabled={isLoading}
          data-testid="toggle-webcam-btn"
          className="flex items-center gap-2"
        >
          {isActive ? (
            <>
              <CameraOff className="w-4 h-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              Start Camera
            </>
          )}
        </Button>
      </div>

      <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          data-testid="webcam-video"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-gray-400">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Camera inactive</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetector;
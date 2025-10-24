import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
// Provider selection removed — app uses Gemini only
import { Send, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { sendChatMessage, getChatHistory } from "../utils/api";

const ChatInterface = ({ sessionId, currentEmotion }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const provider = "gemini";
  const scrollRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, [sessionId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(sessionId);
      setMessages(history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      emotion_state: currentEmotion,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        sessionId,
        inputMessage,
        currentEmotion,
        provider
      );
      
      const aiMessage = {
        id: Date.now().toString() + "_ai",
        role: "assistant",
        content: response.message,
        emotion_state: currentEmotion,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail;
      if (status === 403) {
        toast.error(
          (detail || "Gemini API key suspended or permission denied.") +
            " Please check the Generative Language API in Google Cloud, ensure billing is active, and that the API key is valid."
        );
      } else {
        // Try to extract a helpful message from server response
        const serverMessage = detail || error?.message || "Failed to get response from AI therapist.";
        toast.error(serverMessage + " Please check your API key and backend.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="chat-interface">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Therapist</h3>
              <p className="text-xs text-gray-600">Here to support you</p>
            </div>
          </div>
          {/* Gemini-only: provider selection removed to avoid confusion */}
        </div>
        <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md text-center">
              Gemini 2.5 Pro
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">Start a conversation with your AI therapist</p>
            <p className="text-xs mt-2">Share what's on your mind...</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
            data-testid={`message-${message.role}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                  : "bg-gradient-to-br from-teal-500 to-green-500"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {message.emotion_state && (
                <p className="text-xs mt-1 opacity-70 capitalize">
                  Feeling: {message.emotion_state}
                </p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            disabled={isLoading}
            data-testid="chat-input"
            className="flex-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-xl"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            data-testid="send-message-btn"
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FloatingChatbotLeftProps {
  className?: string;
}

export default function FloatingChatbotLeft({ className = "" }: FloatingChatbotLeftProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize client-side only data
  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your SmythOS Agent Assistant. I can help you with document management, IELTS preparation, web search, email services, and more. What can I help you with today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch("https://smart-ielts.onrender.com/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log
      
      if (data.success) {
        // Priority 1: Check for complex result with agent response
        if (data.result && data.result.data && data.result.data.result) {
          let response = data.result.data.result;
          
          // Add context if available
          if (data.chosenAPI && data.chosenAPI.description) {
            response = `🤖 Agent Action: ${data.chosenAPI.description}\n\n${response}`;
          }
          
          return response;
        }
        
        // Priority 2: Check for simple result with status (like health check)
        if (data.result && data.result.status) {
          let response = `✅ System Status: ${data.result.status}`;
          if (data.chosenAPI && data.chosenAPI.description) {
            response += `\n\n🔧 Service: ${data.chosenAPI.description}`;
          }
          if (data.reasoning) {
            response += `\n\n💭 Analysis: ${data.reasoning}`;
          }
          return response;
        }
        
        // Priority 3: Direct result string
        if (data.result && typeof data.result === 'string') {
          let response = data.result;
          if (data.chosenAPI && data.chosenAPI.description) {
            response = `🤖 ${data.chosenAPI.description}\n\n${response}`;
          }
          return response;
        }
        
        // Priority 4: If result exists but is an object, format it nicely
        if (data.result) {
          let response = '';
          if (data.chosenAPI && data.chosenAPI.description) {
            response += `🤖 Agent Action: ${data.chosenAPI.description}\n\n`;
          }
          if (data.reasoning) {
            response += `💭 ${data.reasoning}\n\n`;
          }
          response += `📋 Result:\n${JSON.stringify(data.result, null, 2)}`;
          return response;
        }
        
        // Priority 5: Fallback to reasoning alone
        if (data.reasoning) {
          return `💭 ${data.reasoning}`;
        }
        
        // Priority 6: Show that request was successful but no clear result
        return "✅ Request processed successfully by the SmythOS agent, but no detailed result available.";
      }
      
      // Handle non-success responses
      if (data.error) {
        return `❌ SmythOS Agent Error: ${data.error}`;
      }
      
      return "🤖 I received your message but the response format was unexpected. Please try rephrasing your request.";
      
    } catch (error) {
      console.error("Error calling SmythOS Agent API:", error);
      return "🔌 I'm experiencing some technical difficulties connecting to the SmythOS agent. Please try again later or check your internet connection.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputText.trim());
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 h-[600px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">SmythOS Agent</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/80">Online • AI Powered</span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-5 py-3 rounded-full transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group transform hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        ) : (
          <div className="relative">
            <svg
              className="w-7 h-7 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {/* Notification pulse */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </button>
      
      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          SmythOS Agent - Ask me anything!
          <div className="absolute top-full right-1/2 transform translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}

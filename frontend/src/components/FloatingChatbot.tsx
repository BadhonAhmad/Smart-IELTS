"use client";

import { useState, useRef, useEffect } from "react";
import { agentService, type DocumentSearchResult, type WebSearchResult } from "@/lib/agentService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'document' | 'email' | 'search' | 'drive';
  sources?: Array<{ document: string; relevance?: number }>;
  confidence?: number;
}

interface FloatingChatbotProps {
  className?: string;
}

export default function FloatingChatbot({ className = "" }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your advanced IELTS AI Assistant powered by SmythOS. I can help you with:\\n\\n📚 Find answers from IELTS study materials\\n🔍 Search through practice questions\\n📧 Email study materials to your group\\n🌐 Get latest IELTS updates from the web\\n☁️ Manage your PDF documents in Google Drive\\n\\nWhat would you like to know about IELTS preparation?",
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check agent health on component mount
  useEffect(() => {
    checkAgentHealth();
  }, []);

  const checkAgentHealth = async () => {
    setAgentStatus('checking');
    try {
      const response = await agentService.checkHealth();
      setAgentStatus(response.success ? 'online' : 'offline');
    } catch (error) {
      setAgentStatus('offline');
    }
  };

  const detectIntentAndRespond = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();

    // Document search intent
    if (message.includes('practice') || message.includes('example') || message.includes('sample') || 
        message.includes('writing task') || message.includes('reading passage') || 
        message.includes('speaking topic') || message.includes('listening test')) {
      
      const response = await agentService.askIELTSQuestion(userMessage);
      if (response.success && response.data) {
        const result = response.data as DocumentSearchResult;
        
        // Add message with sources
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.answer,
          isUser: false,
          timestamp: new Date(),
          type: 'document',
          sources: result.sources,
          confidence: result.confidence,
        };
        
        setMessages(prev => [...prev, botMessage]);
        return ""; // Don't return text as we've added the message directly
      }
    }

    // Email intent
    if (message.includes('email') || message.includes('send') || message.includes('share')) {
      return "I can help you email study materials! Please provide:\\n\\n📧 Recipient email address\\n📝 What materials you'd like to share\\n\\nFor example: 'Email IELTS writing samples to john@example.com'";
    }

    // Web search intent
    if (message.includes('latest') || message.includes('current') || message.includes('news') || 
        message.includes('update') || message.includes('2024') || message.includes('2025')) {
      
      const response = await agentService.webSearch(`IELTS ${userMessage}`);
      if (response.success && response.data) {
        const result = response.data as WebSearchResult;
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Here's what I found about current IELTS information:\\n\\n${result.results.slice(0, 3).map((r, i) => 
            `${i + 1}. **${r.title}**\\n   ${r.content.slice(0, 200)}...\\n   🔗 [Read more](${r.url})`
          ).join('\\n\\n')}`,
          isUser: false,
          timestamp: new Date(),
          type: 'search',
          sources: result.results.map(r => ({ document: r.url, relevance: r.relevance })),
        };
        
        setMessages(prev => [...prev, botMessage]);
        return "";
      }
    }

    // Google Drive intent
    if (message.includes('drive') || message.includes('pdf') || message.includes('document') || 
        message.includes('file') || message.includes('backup')) {
      
      const response = await agentService.listDrivePdfs();
      if (response.success && response.data) {
        const files = response.data;
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Here are your IELTS materials in Google Drive:\\n\\n${files.slice(0, 5).map((file, i) => 
            `${i + 1}. **${file.name}**\\n   📁 Size: ${(file.size / 1024 / 1024).toFixed(2)} MB\\n   🔗 [View File](${file.webViewLink})`
          ).join('\\n\\n')}\\n\\n${files.length > 5 ? `\\n... and ${files.length - 5} more files` : ''}`,
          isUser: false,
          timestamp: new Date(),
          type: 'drive',
        };
        
        setMessages(prev => [...prev, botMessage]);
        return "";
      }
    }

    // Default: Use natural language prompt
    const response = await agentService.sendPrompt(userMessage, 'ielts-assistance');
    if (response.success && response.data) {
      return response.data.answer || "I understand your question, but I'm having trouble providing a specific answer right now.";
    }

    return "I'm experiencing some technical difficulties. Please try again later or rephrase your question.";
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
    const originalInput = inputText.trim();
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await detectIntentAndRespond(originalInput);
      
      // Only add response if detectIntentAndRespond returned text
      if (aiResponse) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble responding right now. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date(),
        type: 'text',
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

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'online': return 'bg-green-400';
      case 'offline': return 'bg-red-400';
      case 'checking': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (agentStatus) {
      case 'online': return 'Online • SmythOS Agent Active';
      case 'offline': return 'Offline • Connection Issue';
      case 'checking': return 'Connecting...';
      default: return 'Unknown Status';
    }
  };

  const renderMessage = (message: Message) => {
    const baseClasses = `max-w-sm px-4 py-3 rounded-lg ${
      message.isUser
        ? "bg-blue-600 text-white"
        : "bg-gray-700 text-gray-100"
    }`;

    return (
      <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
        <div className={baseClasses}>
          <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
          
          {/* Show confidence and sources for document responses */}
          {message.type === 'document' && message.confidence && (
            <div className="mt-2 text-xs opacity-75">
              Confidence: {Math.round(message.confidence * 100)}%
            </div>
          )}
          
          {/* Show sources if available */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2 text-xs opacity-75">
              📚 Sources: {message.sources.slice(0, 2).map(s => s.document.split('/').pop()).join(', ')}
              {message.sources.length > 2 && ` +${message.sources.length - 2} more`}
            </div>
          )}
          
          <p className="text-xs opacity-70 mt-2">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 w-96 h-[600px] mb-4 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">IELTS AI Assistant</h3>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 ${getStatusColor()} rounded-full ${agentStatus === 'online' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-sm text-blue-100">{getStatusText()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={checkAgentHealth}
                className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                title="Refresh connection"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="text-blue-100 hover:text-white transition-colors"
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
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map(renderMessage)}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 max-w-sm px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span>SmythOS agent is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-gray-700">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about IELTS preparation, search materials, or request study help..."
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                disabled={isLoading || agentStatus === 'offline'}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || agentStatus === 'offline'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-5 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
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
            {agentStatus === 'offline' && (
              <p className="text-red-400 text-xs mt-2">
                Agent is offline. Please check your connection and try refreshing.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          agentStatus === 'online' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : agentStatus === 'offline' 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-yellow-600 hover:bg-yellow-700'
        } text-white`}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="relative">
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
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {/* Status indicator */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor()} rounded-full ${agentStatus === 'online' ? 'animate-pulse' : ''}`}></div>
          </div>
        )}
      </button>
    </div>
  );
}
/**
 * SmythOS Agent Demo Page
 * Demonstrates all SmythOS agent integrations
 */

"use client";

import { useState } from "react";
import FloatingChatbot from "@/components/FloatingChatbot";
import StudyMaterialsManager from "@/components/StudyMaterialsManager";
import IELTSQuestionAssistant from "@/components/IELTSQuestionAssistant";
import AgentDashboard from "@/components/AgentDashboard";

export default function AgentDemoPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'materials' | 'questions' | 'dashboard'>('chat');
  const [selectedSubject, setSelectedSubject] = useState<'reading' | 'writing' | 'listening' | 'speaking' | 'general'>('general');

  const tabs = [
    { id: 'chat', label: '💬 AI Chat', desc: 'Natural language conversation with SmythOS agent' },
    { id: 'materials', label: '📚 Study Materials', desc: 'Document management and Google Drive integration' },
    { id: 'questions', label: '❓ Q&A Assistant', desc: 'Intelligent question answering with sources' },
    { id: 'dashboard', label: '📊 Agent Dashboard', desc: 'Monitor and test agent capabilities' }
  ];

  const subjects = [
    { id: 'general', label: '🎯 General', color: 'bg-gray-100 text-gray-700' },
    { id: 'reading', label: '📖 Reading', color: 'bg-blue-100 text-blue-700' },
    { id: 'writing', label: '✍️ Writing', color: 'bg-green-100 text-green-700' },
    { id: 'listening', label: '👂 Listening', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'speaking', label: '🗣️ Speaking', color: 'bg-purple-100 text-purple-700' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SI</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Smart IELTS</h1>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-600">Powered by</span>
                <span className="ml-1 text-sm font-semibold text-purple-600">SmythOS Agent</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Agent Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-75">{tab.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Filter (for relevant tabs) */}
      {(activeTab === 'materials' || activeTab === 'questions') && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 py-2">Subject:</span>
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSubject === subject.id
                      ? 'bg-blue-600 text-white'
                      : subject.color + ' hover:opacity-80'
                  }`}
                >
                  {subject.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                AI Chat Assistant
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have natural conversations with our SmythOS-powered AI assistant. 
                Ask questions about IELTS preparation, request study materials, 
                search for information, or get help with your studies.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold text-gray-800">Document Search</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically searches through IELTS study materials
                  </p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">🌐</div>
                  <h3 className="font-semibold text-gray-800">Web Search</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Gets current IELTS information from the web
                  </p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">📧</div>
                  <h3 className="font-semibold text-gray-800">Email Integration</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Can send study materials to your email
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Click the chat button in the bottom-left corner to start chatting!
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span>💡 Try asking:</span>
                  <span className="italic">"Find IELTS writing examples"</span>
                  <span>or</span>
                  <span className="italic">"What are the latest IELTS changes?"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <StudyMaterialsManager 
            subject={selectedSubject === 'general' ? undefined : selectedSubject}
            className="w-full"
          />
        )}

        {activeTab === 'questions' && (
          <IELTSQuestionAssistant 
            subject={selectedSubject}
            className="w-full"
          />
        )}

        {activeTab === 'dashboard' && (
          <AgentDashboard className="w-full" />
        )}
      </div>

      {/* Features Overview */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              SmythOS Agent Capabilities
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our SmythOS-powered agent provides comprehensive IELTS preparation assistance 
              with advanced AI capabilities and seamless integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🧠',
                title: 'Intelligent Q&A',
                description: 'AI-powered answers from vectorized IELTS materials using Pinecone database'
              },
              {
                icon: '📧',
                title: 'Email Integration',
                description: 'Send study materials and progress reports directly to students via Gmail API'
              },
              {
                icon: '☁️',
                title: 'Google Drive Sync',
                description: 'Automatic backup and organization of PDFs in Google Drive with smart categorization'
              },
              {
                icon: '🌐',
                title: 'Real-time Web Search',
                description: 'Current IELTS information and updates using Tavily API for latest exam changes'
              },
              {
                icon: '📚',
                title: 'Document Intelligence',
                description: 'Advanced PDF processing and semantic search through previous year materials'
              },
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'Vector-based semantic search that understands context and intent'
              },
              {
                icon: '📊',
                title: 'Health Monitoring',
                description: 'Real-time agent status monitoring and skill testing capabilities'
              },
              {
                icon: '🤖',
                title: 'Natural Language',
                description: 'Conversational AI interface powered by Google Gemini and Groq LLM'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
              <span className="font-medium">Powered by SmythOS</span>
              <span className="text-sm">• Advanced AI Agent Orchestration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}
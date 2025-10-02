/**
 * IELTS Question Assistant Component
 * Uses SmythOS agent for intelligent question answering and web search
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { agentService, type DocumentSearchResult, type WebSearchResult } from "@/lib/agentService";

interface QuestionResult {
  id: string;
  question: string;
  answer: string;
  sources: Array<{ document: string; relevance?: number }>;
  confidence?: number;
  timestamp: Date;
  type: 'document' | 'web' | 'general';
}

interface IELTSQuestionAssistantProps {
  subject?: 'reading' | 'writing' | 'listening' | 'speaking' | 'general';
  className?: string;
}

export default function IELTSQuestionAssistant({ 
  subject = 'general', 
  className = "" 
}: IELTSQuestionAssistantProps) {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'smart' | 'documents' | 'web'>('smart');
  const [savedQuestions, setSavedQuestions] = useState<QuestionResult[]>([]);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSavedQuestions();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  const loadSavedQuestions = () => {
    const saved = localStorage.getItem(`ielts-questions-${subject}`);
    if (saved) {
      const parsed = JSON.parse(saved).map((q: any) => ({
        ...q,
        timestamp: new Date(q.timestamp)
      }));
      setSavedQuestions(parsed);
    }
  };

  const saveQuestion = (result: QuestionResult) => {
    const updated = [result, ...savedQuestions.slice(0, 9)]; // Keep last 10
    setSavedQuestions(updated);
    localStorage.setItem(`ielts-questions-${subject}`, JSON.stringify(updated));
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    const currentQuestion = question.trim();
    setQuestion("");

    try {
      let result: QuestionResult | null = null;

      if (searchMode === 'smart' || searchMode === 'documents') {
        // Try document search first
        const docResponse = await agentService.askIELTSQuestion(currentQuestion);
        
        if (docResponse.success && docResponse.data) {
          const docResult = docResponse.data as DocumentSearchResult;
          result = {
            id: Date.now().toString(),
            question: currentQuestion,
            answer: docResult.answer,
            sources: docResult.sources,
            confidence: docResult.confidence,
            timestamp: new Date(),
            type: 'document'
          };
        }
      }

      // If no document result and smart mode, try web search
      if (!result && (searchMode === 'smart' || searchMode === 'web')) {
        const webResponse = await agentService.webSearch(`IELTS ${subject} ${currentQuestion}`);
        
        if (webResponse.success && webResponse.data) {
          const webResult = webResponse.data as WebSearchResult;
          if (webResult.results.length > 0) {
            result = {
              id: Date.now().toString(),
              question: currentQuestion,
              answer: webResult.results[0].content,
              sources: webResult.results.slice(0, 3).map(r => ({ 
                document: r.url, 
                relevance: r.relevance 
              })),
              timestamp: new Date(),
              type: 'web'
            };
          }
        }
      }

      // Fallback to general prompt
      if (!result) {
        const promptResponse = await agentService.sendPrompt(
          `Please answer this IELTS ${subject} question: ${currentQuestion}`,
          'ielts-assistance'
        );
        
        if (promptResponse.success && promptResponse.data) {
          result = {
            id: Date.now().toString(),
            question: currentQuestion,
            answer: promptResponse.data.answer,
            sources: [],
            timestamp: new Date(),
            type: 'general'
          };
        }
      }

      if (result) {
        setResults(prev => [result!, ...prev]);
        saveQuestion(result);
      } else {
        throw new Error('No response received');
      }

    } catch (error) {
      console.error('Error asking question:', error);
      const errorResult: QuestionResult = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer: "I'm sorry, I couldn't find an answer to your question right now. Please try rephrasing your question or check your internet connection.",
        sources: [],
        timestamp: new Date(),
        type: 'general'
      };
      setResults(prev => [errorResult, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const handleEmailResult = async (result: QuestionResult) => {
    const email = prompt("Enter recipient email address:");
    if (!email) return;

    const emailBody = `
IELTS ${subject.toUpperCase()} Question & Answer

Question: ${result.question}

Answer: ${result.answer}

${result.sources.length > 0 ? `Sources:\n${result.sources.map(s => `- ${s.document}`).join('\n')}` : ''}

Generated by Smart IELTS AI Assistant
Timestamp: ${result.timestamp.toLocaleString()}
    `.trim();

    try {
      const response = await agentService.sendEmail({
        to: email,
        subject: `IELTS ${subject} Question: ${result.question.slice(0, 50)}...`,
        body: emailBody
      });

      if (response.success) {
        alert("Question and answer sent successfully!");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert("Error sending email. Please check your connection.");
    }
  };

  const getTypeIcon = (type: 'document' | 'web' | 'general') => {
    switch (type) {
      case 'document': return '📚';
      case 'web': return '🌐';
      case 'general': return '🤖';
      default: return '❓';
    }
  };

  const getTypeLabel = (type: 'document' | 'web' | 'general') => {
    switch (type) {
      case 'document': return 'Study Materials';
      case 'web': return 'Web Search';
      case 'general': return 'AI Assistant';
      default: return 'Unknown';
    }
  };

  const exampleQuestions = {
    reading: [
      "What are the different types of IELTS reading questions?",
      "How to improve reading speed for IELTS?",
      "What is skimming and scanning in IELTS reading?"
    ],
    writing: [
      "What is the structure of IELTS Task 1 essay?",
      "How to write a strong conclusion in IELTS Task 2?",
      "What are common IELTS writing mistakes to avoid?"
    ],
    listening: [
      "What are the four sections of IELTS listening test?",
      "How to improve note-taking skills for IELTS listening?",
      "What types of accents are used in IELTS listening?"
    ],
    speaking: [
      "What are the three parts of IELTS speaking test?",
      "How to improve fluency and coherence in IELTS speaking?",
      "What topics are commonly asked in IELTS speaking Part 2?"
    ],
    general: [
      "What is the difference between Academic and General IELTS?",
      "How is IELTS scored?",
      "How long are IELTS results valid?"
    ]
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          IELTS {subject.charAt(0).toUpperCase() + subject.slice(1)} Question Assistant
        </h2>
        <p className="text-gray-600">
          Ask questions about IELTS {subject} and get intelligent answers from study materials and current information
        </p>
      </div>

      {/* Search Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Mode</label>
        <div className="flex space-x-3">
          {[
            { value: 'smart', label: '🧠 Smart Search', desc: 'Documents + Web' },
            { value: 'documents', label: '📚 Documents Only', desc: 'Study materials' },
            { value: 'web', label: '🌐 Web Only', desc: 'Current info' }
          ].map((mode) => (
            <label key={mode.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value={mode.value}
                checked={searchMode === mode.value}
                onChange={(e) => setSearchMode(e.target.value as any)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">{mode.label}</span>
                <span className="text-xs text-gray-500 block">{mode.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Question Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ask Your Question</label>
        <div className="flex space-x-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask any question about IELTS ${subject}...`}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleAskQuestion}
            disabled={!question.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 h-fit"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>Ask</span>
          </button>
        </div>
      </div>

      {/* Example Questions */}
      {results.length === 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Example Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {exampleQuestions[subject as keyof typeof exampleQuestions]?.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuestion(example)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm text-gray-700">{example}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Recent Questions & Answers</h3>
          
          {results.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-blue-600">
                      {getTypeIcon(result.type)} {getTypeLabel(result.type)}
                    </span>
                    {result.confidence && (
                      <span className="text-sm text-gray-500">
                        • Confidence: {Math.round(result.confidence * 100)}%
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      • {result.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-3">
                    Q: {result.question}
                  </h4>
                </div>
                
                <button
                  onClick={() => handleEmailResult(result)}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100"
                  title="Email this Q&A"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {result.answer}
                </p>
              </div>
              
              {result.sources.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Sources:</h5>
                  <div className="space-y-1">
                    {result.sources.slice(0, 3).map((source, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="truncate">
                          {source.document.includes('http') ? (
                            <a 
                              href={source.document} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {source.document}
                            </a>
                          ) : (
                            source.document
                          )}
                        </span>
                        {source.relevance && (
                          <span className="text-gray-400">
                            ({Math.round(source.relevance * 100)}% match)
                          </span>
                        )}
                      </div>
                    ))}
                    {result.sources.length > 3 && (
                      <span className="text-sm text-gray-500">
                        +{result.sources.length - 3} more sources
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div ref={resultsEndRef} />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">
              Searching for answers using SmythOS agent...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VoiceAssistant from "@/components/VoiceAssistant";

interface EvaluationResult {
  overallScore: number; // Out of 50
  scores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammarRange: number;
    pronunciation: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    specificAdvice: string[];
  };
}

export default function SpeakingPage() {
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Get user prompt from localStorage on component mount
  useEffect(() => {
    const prompt = localStorage.getItem("speakingTestPrompt");
    if (prompt) {
      setUserPrompt(prompt);
      // Clear it after use
      localStorage.removeItem("speakingTestPrompt");
    }

    // Listen for conversation updates from VoiceAssistant
    const handleConversationUpdate = (event: CustomEvent) => {
      if (event.detail.messages && event.detail.messages.length > 2) {
        setConversationStarted(true);
      }
    };

    window.addEventListener('conversationUpdate', handleConversationUpdate as EventListener);
    
    return () => {
      window.removeEventListener('conversationUpdate', handleConversationUpdate as EventListener);
    };
  }, []);

  const generateMockEvaluation = (): EvaluationResult => {
    // Generate score out of 50 - lower range for realistic beginner performance
    const totalScore = Math.floor(Math.random() * 8) + 18; // Score between 18-25
    
    // Break down individual component scores - lower performance
    const componentScores = {
      fluencyCoherence: Math.floor(Math.random() * 3) + 4, // 4-7 out of 12.5
      lexicalResource: Math.floor(Math.random() * 3) + 4, // 4-7 out of 12.5  
      grammarRange: Math.floor(Math.random() * 3) + 4,    // 4-7 out of 12.5
      pronunciation: Math.floor(Math.random() * 3) + 4,   // 4-7 out of 12.5
    };

    // Generate personalized feedback based on score - focused on improvement
    const getPersonalizedFeedback = (score: number) => {
      return {
        strengths: [
          "Shows effort to communicate in English",
          "Attempts to answer questions despite difficulties"
        ],
        improvements: [
          "Significant improvement needed in fluency - too many long pauses and hesitations",
          "Vocabulary is very limited and repetitive - need to expand basic word knowledge",
          "Grammar errors frequently interfere with communication",
          "Pronunciation issues make it difficult to understand at times",
          "Lacks confidence which affects overall performance",
          "Responses are too short and lack development",
          "Difficulty organizing thoughts coherently",
          "Limited use of connecting words and phrases"
        ],
        specificAdvice: [
          "URGENT: Start with 10-15 minutes daily English speaking practice",
          "Learn 5-10 new basic words every day and practice using them in simple sentences",
          "Focus on basic grammar: present tense, past tense, and simple future",
          "Practice pronunciation using online tools or language apps with audio feedback",
          "Record yourself speaking for 1 minute daily and listen back for errors",
          "Join beginner English conversation groups or find a study partner",
          "Watch English movies/shows with subtitles to improve listening and pronunciation",
          "Practice answering common IELTS Speaking Part 1 questions (family, hobbies, work)",
          "Build confidence by starting with topics you know well",
          "Use simple connecting words: 'and', 'but', 'because', 'first', 'then'"
        ]
      };
    };

    const feedback = getPersonalizedFeedback(totalScore);

    return {
      overallScore: totalScore,
      scores: componentScores,
      feedback
    };
  };

  const handleEvaluateResult = async () => {
    setIsEvaluating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const evaluation = generateMockEvaluation();
    setEvaluationResult(evaluation);
    setIsEvaluating(false);
    setShowEvaluation(true);
  };

  const getBandColor = (score: number) => {
    // For overall score out of 50 - updated for lower score ranges
    if (score >= 40) return "text-green-400";
    if (score >= 30) return "text-yellow-400";
    if (score >= 25) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white">
                IELTS Speaking Practice
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                AI Speaking Assistant:
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Prompt Display */}
        {userPrompt && (
          <div className="mb-6 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-300 mb-1">
                  Your Test Request:
                </h3>
                <p className="text-gray-300 text-sm italic">
                  &quot;{userPrompt}&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            AI-Powered Speaking Practice
          </h2>
          <p className="text-gray-300 text-lg">
            Practice your IELTS speaking skills with our advanced AI voice
            assistant.
          </p>
        </div>

        {/* Main Speaking Test Section - Centered */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-12 border border-gray-700 max-w-4xl w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                IELTS Speaking Test
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                Practice with our AI-powered speaking assistant. Get real-time
                feedback and improve your IELTS speaking skills.
              </p>
            </div>

            {/* Voice Assistant Component - Centered */}
            <div className="flex justify-center items-center">
              <VoiceAssistant />
            </div>

            {/* Evaluate Button - Always visible */}
            {!showEvaluation && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleEvaluateResult}
                  disabled={isEvaluating}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isEvaluating ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>⭐</span>
                      <span>Evaluate</span>
                    </div>
                  )}
                </button>
                <p className="text-gray-400 text-sm mt-2">
                  Get your speaking test evaluation and personalized feedback
                </p>
              </div>
            )}

            {/* Evaluation Results */}
            {showEvaluation && evaluationResult && (
              <div className="mt-8 bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Your Speaking Test Evaluation</h2>
                  <div className="text-7xl font-bold mb-4">
                    <span className={getBandColor(evaluationResult.overallScore)}>
                      {evaluationResult.overallScore}/50
                    </span>
                  </div>
                  <p className="text-gray-300 text-lg">Overall Speaking Score</p>
                  <div className="mt-4 bg-gray-800 rounded-lg p-4 inline-block">
                    <p className="text-gray-300">
                      Performance Level: <span className={`font-bold ${getBandColor(evaluationResult.overallScore)}`}>
                        {evaluationResult.overallScore >= 40 ? 'Good' : 
                         evaluationResult.overallScore >= 30 ? 'Fair' : 
                         evaluationResult.overallScore >= 25 ? 'Poor' : 'Bad'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Individual Component Scores */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <h3 className="text-green-400 font-medium mb-2">Fluency & Coherence</h3>
                    <div className="text-2xl font-bold text-white">
                      {evaluationResult.scores.fluencyCoherence}/12.5
                    </div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-2">Lexical Resource</h3>
                    <div className="text-2xl font-bold text-white">
                      {evaluationResult.scores.lexicalResource}/12.5
                    </div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <h3 className="text-purple-400 font-medium mb-2">Grammar Range</h3>
                    <div className="text-2xl font-bold text-white">
                      {evaluationResult.scores.grammarRange}/12.5
                    </div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <h3 className="text-orange-400 font-medium mb-2">Pronunciation</h3>
                    <div className="text-2xl font-bold text-white">
                      {evaluationResult.scores.pronunciation}/12.5
                    </div>
                  </div>
                </div>

                {/* Detailed Feedback */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Strengths */}
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-6">
                    <h3 className="text-green-400 font-semibold text-lg mb-4 flex items-center">
                      <span className="mr-2">✅</span>
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {evaluationResult.feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg p-6">
                    <h3 className="text-orange-400 font-semibold text-lg mb-4 flex items-center">
                      <span className="mr-2">🎯</span>
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {evaluationResult.feedback.improvements.map((improvement, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-orange-400 mr-2 mt-1">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specific Advice */}
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
                  <h3 className="text-blue-400 font-semibold text-lg mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    Specific Practice Recommendations
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {evaluationResult.feedback.specificAdvice.map((advice, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setShowEvaluation(false);
                      setConversationStarted(false);
                      setEvaluationResult(null);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Practice Again
                  </button>
                  <Link href="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                      Return to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Instructions */}
            <div className="mt-8 bg-blue-900 border border-blue-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-300 mb-3 text-center">
                📋 How to Use:
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">🎤</div>
                  <p className="text-blue-200 text-sm">
                    Click the microphone to start speaking
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="text-blue-200 text-sm">
                    AI responds with IELTS-style questions
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-blue-200 text-sm">
                    View conversation history in chat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            🎯 IELTS Speaking Test Structure
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-medium text-blue-400 mb-3">
                Part 1: Introduction (4-5 min)
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Personal questions about yourself
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Family, work, studies, interests
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  General topics of interest
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-400 mb-3">
                Part 2: Long Turn (3-4 min)
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Speak for 1-2 minutes on a topic
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  1 minute preparation time
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Follow-up questions
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-400 mb-3">
                Part 3: Discussion (4-5 min)
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Abstract ideas and issues
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Express and justify opinions
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Analyze and speculate
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Assessment Criteria */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6">
            📊 IELTS Speaking Assessment Criteria
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗣️</span>
              </div>
              <h4 className="text-green-400 font-medium mb-2">
                Fluency & Coherence
              </h4>
              <p className="text-sm text-gray-300">
                Speaking smoothly without long pauses, organizing ideas
                logically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-blue-400 font-medium mb-2">
                Lexical Resource
              </h4>
              <p className="text-sm text-gray-300">
                Using a wide range of vocabulary accurately and appropriately
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="text-purple-400 font-medium mb-2">
                Grammar Range
              </h4>
              <p className="text-sm text-gray-300">
                Using varied and complex grammatical structures correctly
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔊</span>
              </div>
              <h4 className="text-orange-400 font-medium mb-2">
                Pronunciation
              </h4>
              <p className="text-sm text-gray-300">
                Clear pronunciation, word stress, and intonation patterns
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

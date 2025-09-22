"use client";

import Link from "next/link";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function SpeakingPage() {
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import ListeningVoiceAssistant from "@/components/ListeningVoiceAssistant";
import FloatingChatbot from "../../components/FloatingChatbot";

export default function ListeningPage() {
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Correct answers for the MCQ questions
  const correctAnswers = {
    question1: "B", // Human activities and greenhouse gas emissions
    question2: "B", // 75%
    question3: "A", // Renewable energy transition
    question4: "B", // 2050
    question5: "A"  // Small island nations in the Pacific
  };

  // Get user prompt from localStorage on component mount
  useEffect(() => {
    const prompt = localStorage.getItem("listeningTestPrompt");
    if (prompt) {
      setUserPrompt(prompt);
      // Clear it after use
      localStorage.removeItem("listeningTestPrompt");
    }
  }, []);

  // Handle answer selection
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Calculate and submit score
  const handleSubmit = () => {
    let correctCount = 0;
    Object.keys(correctAnswers).forEach(questionId => {
      if (answers[questionId] === correctAnswers[questionId as keyof typeof correctAnswers]) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / Object.keys(correctAnswers).length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
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
              <Link href="/landing" className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Smart IELTS
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-white">
                IELTS Listening Practice
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                AI Listening Assistant:
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
            AI-Powered Listening Practice
          </h2>
          <p className="text-gray-300 text-lg">
            Practice your IELTS listening skills with our advanced AI voice
            assistant.
          </p>
        </div>

        {/* Main Listening Test Section - Centered */}
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
                    d="M15.536 12.829c0 2.071-1.679 3.75-3.75 3.75s-3.75-1.679-3.75-3.75 1.679-3.75 3.75-3.75 3.75 1.679 3.75 3.75zM12 7v10m0 0l3-3m-3 3l-3-3"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                IELTS Listening Test
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                Listen to the AI voice assistant and improve your IELTS listening
                skills. Follow the instructions carefully.
              </p>
            </div>

            {/* Voice Assistant Component - Centered */}
            <div className="flex justify-center items-center">
              <ListeningVoiceAssistant />
            </div>
          </div>
        </div>

        {/* Climate Change MCQ Questions Section */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700 mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Listening Practice Questions - Climate Change
            </h3>
            <p className="text-gray-300">
              Answer the following multiple choice questions based on what you heard.
            </p>
          </div>

          <div className="space-y-8">
            {/* Question 1 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-4">
                1. What is the primary cause of climate change mentioned in the recording?
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question1"
                    value="A"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question1', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question1 === 'A' ? 'text-green-400 font-bold' : isSubmitted && answers.question1 === 'A' && correctAnswers.question1 !== 'A' ? 'text-red-400' : 'text-gray-300'}`}>A) Natural weather patterns</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question1"
                    value="B"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question1', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question1 === 'B' ? 'text-green-400 font-bold' : isSubmitted && answers.question1 === 'B' && correctAnswers.question1 !== 'B' ? 'text-red-400' : 'text-gray-300'}`}>B) Human activities and greenhouse gas emissions</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question1"
                    value="C"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question1', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question1 === 'C' ? 'text-green-400 font-bold' : isSubmitted && answers.question1 === 'C' && correctAnswers.question1 !== 'C' ? 'text-red-400' : 'text-gray-300'}`}>C) Solar radiation changes</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question1"
                    value="D"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question1', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question1 === 'D' ? 'text-green-400 font-bold' : isSubmitted && answers.question1 === 'D' && correctAnswers.question1 !== 'D' ? 'text-red-400' : 'text-gray-300'}`}>D) Ocean currents</span>
                </label>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-4">
                2. According to the recording, what percentage of global CO2 emissions come from burning fossil fuels?
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question2"
                    value="A"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question2', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question2 === 'A' ? 'text-green-400 font-bold' : isSubmitted && answers.question2 === 'A' && correctAnswers.question2 !== 'A' ? 'text-red-400' : 'text-gray-300'}`}>A) 65%</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question2"
                    value="B"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question2', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question2 === 'B' ? 'text-green-400 font-bold' : isSubmitted && answers.question2 === 'B' && correctAnswers.question2 !== 'B' ? 'text-red-400' : 'text-gray-300'}`}>B) 75%</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question2"
                    value="C"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question2', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question2 === 'C' ? 'text-green-400 font-bold' : isSubmitted && answers.question2 === 'C' && correctAnswers.question2 !== 'C' ? 'text-red-400' : 'text-gray-300'}`}>C) 85%</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question2"
                    value="D"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question2', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question2 === 'D' ? 'text-green-400 font-bold' : isSubmitted && answers.question2 === 'D' && correctAnswers.question2 !== 'D' ? 'text-red-400' : 'text-gray-300'}`}>D) 95%</span>
                </label>
              </div>
            </div>

            {/* Question 3 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-4">
                3. Which solution to climate change was mentioned as most effective in the short term?
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question3"
                    value="A"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question3', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question3 === 'A' ? 'text-green-400 font-bold' : isSubmitted && answers.question3 === 'A' && correctAnswers.question3 !== 'A' ? 'text-red-400' : 'text-gray-300'}`}>A) Renewable energy transition</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question3"
                    value="B"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question3', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question3 === 'B' ? 'text-green-400 font-bold' : isSubmitted && answers.question3 === 'B' && correctAnswers.question3 !== 'B' ? 'text-red-400' : 'text-gray-300'}`}>B) Reforestation programs</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question3"
                    value="C"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question3', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question3 === 'C' ? 'text-green-400 font-bold' : isSubmitted && answers.question3 === 'C' && correctAnswers.question3 !== 'C' ? 'text-red-400' : 'text-gray-300'}`}>C) Carbon capture technology</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question3"
                    value="D"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question3', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question3 === 'D' ? 'text-green-400 font-bold' : isSubmitted && answers.question3 === 'D' && correctAnswers.question3 !== 'D' ? 'text-red-400' : 'text-gray-300'}`}>D) International policy agreements</span>
                </label>
              </div>
            </div>

            {/* Question 4 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-4">
                4. What year was mentioned as the target for achieving net-zero emissions?
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question4"
                    value="A"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question4', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question4 === 'A' ? 'text-green-400 font-bold' : isSubmitted && answers.question4 === 'A' && correctAnswers.question4 !== 'A' ? 'text-red-400' : 'text-gray-300'}`}>A) 2040</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question4"
                    value="B"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question4', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question4 === 'B' ? 'text-green-400 font-bold' : isSubmitted && answers.question4 === 'B' && correctAnswers.question4 !== 'B' ? 'text-red-400' : 'text-gray-300'}`}>B) 2050</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question4"
                    value="C"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question4', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question4 === 'C' ? 'text-green-400 font-bold' : isSubmitted && answers.question4 === 'C' && correctAnswers.question4 !== 'C' ? 'text-red-400' : 'text-gray-300'}`}>C) 2060</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question4"
                    value="D"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question4', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question4 === 'D' ? 'text-green-400 font-bold' : isSubmitted && answers.question4 === 'D' && correctAnswers.question4 !== 'D' ? 'text-red-400' : 'text-gray-300'}`}>D) 2070</span>
                </label>
              </div>
            </div>

            {/* Question 5 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-4">
                5. Which region was mentioned as being most vulnerable to sea level rise?
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question5"
                    value="A"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question5', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question5 === 'A' ? 'text-green-400 font-bold' : isSubmitted && answers.question5 === 'A' && correctAnswers.question5 !== 'A' ? 'text-red-400' : 'text-gray-300'}`}>A) Small island nations in the Pacific</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question5"
                    value="B"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question5', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question5 === 'B' ? 'text-green-400 font-bold' : isSubmitted && answers.question5 === 'B' && correctAnswers.question5 !== 'B' ? 'text-red-400' : 'text-gray-300'}`}>B) Coastal cities in Europe</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question5"
                    value="C"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question5', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question5 === 'C' ? 'text-green-400 font-bold' : isSubmitted && answers.question5 === 'C' && correctAnswers.question5 !== 'C' ? 'text-red-400' : 'text-gray-300'}`}>C) Arctic communities</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded">
                  <input
                    type="radio"
                    name="question5"
                    value="D"
                    className="text-blue-500 focus:ring-blue-500"
                    onChange={(e) => handleAnswerChange('question5', e.target.value)}
                    disabled={isSubmitted}
                  />
                  <span className={`${isSubmitted && correctAnswers.question5 === 'D' ? 'text-green-400 font-bold' : isSubmitted && answers.question5 === 'D' && correctAnswers.question5 !== 'D' ? 'text-red-400' : 'text-gray-300'}`}>D) Desert regions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button and Score Display */}
          <div className="mt-8 text-center">
            {!isSubmitted ? (
              <button 
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                disabled={Object.keys(answers).length < 5}
              >
                Submit Answers
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Your Results</h3>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="text-4xl font-bold text-blue-400">
                      {score}%
                    </div>
                    <div className="text-gray-300">
                      ({Object.keys(correctAnswers).filter(q => answers[q] === correctAnswers[q as keyof typeof correctAnswers]).length} out of {Object.keys(correctAnswers).length} correct)
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ${
                        score >= 80 ? 'bg-green-500' : 
                        score >= 60 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-300">
                    {score >= 80 ? 'Excellent work! You have a strong understanding of the material.' :
                     score >= 60 ? 'Good job! You have a decent grasp of the content with room for improvement.' :
                     'Keep practicing! Review the material and try again to improve your score.'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setAnswers({});
                    setScore(0);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <FloatingChatbot />
    </div>
  );
}

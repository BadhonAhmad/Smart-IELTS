"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FloatingChatbot from "../../components/FloatingChatbot";

interface Passage {
  title: string;
  content: string;
  wordCount: number;
  readingTime: number;
  summary: string;
  passageNumber: number;
}

interface MCQQuestion {
  questionNumber: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  passageNumber: number;
}

interface UserAnswers {
  [key: string]: string; // Format: "round-questionNumber" => "answer"
}

interface RoundData {
  roundNumber: number;
  passage: Passage;
  questions: MCQQuestion[];
  metadata: {
    theme: string;
    level: string;
    roundNumber: number;
    questionCount: number;
  };
}

export default function ReadingTest() {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [roundsData, setRoundsData] = useState<RoundData[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRound, setLoadingRound] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60 * 60); // 60 minutes in seconds
  const [testStarted, setTestStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Loading tips and advice for each round
  const loadingTips = {
    1: {
      title: "Preparing Round 1...",
      subtitle: "Getting your first passage ready",
      tips: [
        "Read the passage title first to understand the main topic",
        "Look for key words and phrases that might appear in questions",
        "Pay attention to the structure - introduction, body paragraphs, conclusion",
        "Don't worry about understanding every word - focus on the main ideas",
        "Take your time to read carefully before looking at questions"
      ],
      encouragement: "You've got this! Take a deep breath and get ready to showcase your reading skills.",
      funFact: "Did you know? The average person reads 200-250 words per minute, but for IELTS, you need to read for comprehension, not speed!"
    },
    2: {
      title: "Preparing Round 2...",
      subtitle: "Loading your second challenge",
      tips: [
        "Each passage will have a different theme and writing style",
        "Look for transition words like 'however', 'therefore', 'moreover'",
        "Pay attention to the author's opinion vs. facts",
        "Questions often follow the order of the passage",
        "Don't spend too much time on difficult questions - move on and come back"
      ],
      encouragement: "Great start! Round 2 will test different skills - stay focused and confident.",
      funFact: "Pro tip: Academic passages often use complex sentence structures. Look for the main clause to understand the core meaning!"
    },
    3: {
      title: "Preparing Round 3...",
      subtitle: "Final round incoming",
      tips: [
        "This is your last chance to show your reading comprehension skills",
        "Look for specific details, main ideas, and inferences",
        "Some questions might require you to read between the lines",
        "Vocabulary questions often test word meaning in context",
        "Reference questions ask what pronouns or phrases refer to"
      ],
      encouragement: "Almost there! Give it your all in this final round - you're doing amazing!",
      funFact: "Final round! Remember: IELTS reading tests your ability to understand, not memorize. Focus on comprehension!"
    }
  };

  // Timer effect
  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
  }, [timeRemaining, testStarted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateRound = async (roundNumber: number) => {
    setIsLoading(true);
    setLoadingRound(roundNumber);
    setError(null);
    
    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-url.com/api' 
        : 'http://localhost:4000/api';
      
      const response = await fetch(`${apiUrl}/reading/generate-round/${roundNumber}?level=intermediate`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRoundsData(prev => [...prev, data.data]);
        setTestStarted(true);
        setShowInstructions(false);
      } else {
        setError(data.message || 'Failed to generate round');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      if (errorMessage.includes('Unexpected token')) {
        setError('Server returned invalid response. Please try again.');
      } else {
        setError(`Network error: ${errorMessage}`);
      }
      console.error('Error generating round:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = () => {
    generateRound(1);
  };

  const nextRound = () => {
    if (currentRound < 3) {
      const nextRoundNumber = currentRound + 1;
      generateRound(nextRoundNumber);
      setCurrentRound(nextRoundNumber);
    } else {
      handleSubmitTest();
    }
  };

  const handleAnswerChange = (questionNumber: number, answer: string, roundNumber: number) => {
    const answerKey = `${roundNumber}-${questionNumber}`;
    setUserAnswers(prev => ({
      ...prev,
      [answerKey]: answer
    }));
  };

  const calculateScore = () => {
    let totalQuestions = 0;
    let correctAnswers = 0;
    const roundScores: { [roundNumber: number]: { correct: number; total: number } } = {};

    roundsData.forEach(round => {
      let roundCorrect = 0;
      let roundTotal = 0;

      round.questions.forEach(question => {
        totalQuestions++;
        roundTotal++;
        
        const answerKey = `${round.roundNumber}-${question.questionNumber}`;
        const userAnswer = userAnswers[answerKey];
        
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
          roundCorrect++;
        }
      });

      roundScores[round.roundNumber] = {
        correct: roundCorrect,
        total: roundTotal
      };
    });

    return {
      correct: correctAnswers,
      total: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      roundScores
    };
  };

  const handleSubmitTest = () => {
    // Debug: Log the evaluation details
    console.log('=== READING TEST EVALUATION DEBUG ===');
    console.log('User Answers:', userAnswers);
    console.log('Rounds Data:', roundsData);
    
    const score = calculateScore();
    console.log('Calculated Score:', score);
    
    // Log each question evaluation
    roundsData.forEach(round => {
      console.log(`\n--- Round ${round.roundNumber} ---`);
      round.questions.forEach(question => {
        const answerKey = `${round.roundNumber}-${question.questionNumber}`;
        const userAnswer = userAnswers[answerKey];
        const isCorrect = userAnswer === question.correctAnswer;
        console.log(`Q${question.questionNumber}: User=${userAnswer}, Correct=${question.correctAnswer}, ${isCorrect ? '✓' : '✗'}`);
      });
    });
    
      setShowResults(true);
    setTestStarted(false);
  };

  const resetTest = () => {
    setCurrentRound(1);
    setRoundsData([]);
    setUserAnswers({});
    setShowResults(false);
    setTimeRemaining(60 * 60);
    setTestStarted(false);
    setError(null);
    setShowInstructions(true);
  };

  const getCurrentRoundData = () => {
    return roundsData.find(round => round.roundNumber === currentRound);
  };

  const getPassageQuestions = (roundNumber: number) => {
    const roundData = roundsData.find(round => round.roundNumber === roundNumber);
    return roundData ? roundData.questions : [];
  };

  // Loading Screen Component
  const LoadingScreen = () => {
    const currentTips = loadingTips[loadingRound as keyof typeof loadingTips];
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [loadingTime, setLoadingTime] = useState(0);
    const [showTip, setShowTip] = useState(false);

    useEffect(() => {
      if (isLoading && currentTips) {
        // Reset states when loading starts
        setCurrentTipIndex(0);
        setShowTip(false);
        
        const tipInterval = setInterval(() => {
          setShowTip(false); // Hide current tip
          setTimeout(() => {
            setCurrentTipIndex((prev) => (prev + 1) % currentTips.tips.length);
            setShowTip(true); // Show new tip
          }, 500); // Wait for fade out
        }, 3000); // Show each tip for 3 seconds
        
        const timeInterval = setInterval(() => {
          setLoadingTime((prev) => prev + 1);
        }, 1000);
        
        // Show first tip immediately
        setTimeout(() => setShowTip(true), 100);
        
        return () => {
          clearInterval(tipInterval);
          clearInterval(timeInterval);
        };
      }
    }, [isLoading, currentTips]);

    if (!currentTips) return null;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-green-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              {/* Floating particles */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              </div>
              <div className="absolute top-8 right-1/4">
                <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="absolute bottom-8 left-1/4">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
              {currentTips.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-delay">
              {currentTips.subtitle}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Round {loadingRound}</span>
                <span>Preparing... ({loadingTime}s)</span>
              </div>
              <div className="bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full animate-pulse transition-all duration-1000" 
                  style={{ width: `${loadingRound * 30 + 10}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Generating passage...</span>
                <span>Creating questions...</span>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">💡 Reading Tips</h2>
              <p className="text-gray-400">While we prepare your passage, here are some helpful strategies:</p>
            </div>

            {/* Rotating Tips */}
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className={`bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 mb-6 transform transition-all duration-500 hover:scale-105 ${
                  showTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="text-6xl mb-4 animate-bounce">📚</div>
                  <p className="text-xl text-white font-medium leading-relaxed">
                    {currentTips.tips[currentTipIndex]}
                  </p>
                </div>
                
                {/* Tip Indicators */}
                <div className="flex justify-center space-x-2 mb-6">
                  {currentTips.tips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTipIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Encouragement Message */}
        <div className="text-center">
              <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-6 animate-pulse">
                <p className="text-lg text-green-200 font-medium">
                  {currentTips.encouragement}
                </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showResults) {
    const score = calculateScore();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
                ← Back to Dashboard
              </Link>
                <h1 className="text-2xl font-bold text-white">Reading Test Results</h1>
            </div>
          </div>
        </div>
      </header>

        {/* Results Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
            {/* Overall Score */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {score.percentage}%
              </div>
                  <div className="text-blue-200 text-sm">Overall Score</div>
              </div>
            </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {score.percentage >= 80 ? '🎉 Excellent!' : 
                 score.percentage >= 70 ? '👏 Great Job!' : 
                 score.percentage >= 60 ? '👍 Good Work!' : 
                 '💪 Keep Practicing!'}
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                {score.correct} out of {score.total} questions correct
              </p>
          </div>

            {/* Round Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {roundsData.map((round, index) => {
                const roundScoreData = score.roundScores[round.roundNumber] || { correct: 0, total: 0 };
                const roundPercentage = roundScoreData.total > 0 ? Math.round((roundScoreData.correct / roundScoreData.total) * 100) : 0;
                
                return (
                  <div key={round.roundNumber} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Round {round.roundNumber}
                </h3>
                      <div className={`w-3 h-3 rounded-full ${
                        roundPercentage >= 80 ? 'bg-green-500' :
                        roundPercentage >= 70 ? 'bg-blue-500' :
                        roundPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
              </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Theme: {round.metadata.theme}</p>
                      <p className="text-sm text-gray-500 truncate">{round.passage.title}</p>
            </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {roundScoreData.correct}/{roundScoreData.total}
              </div>
                      <div className="text-lg text-gray-300 mb-3">
                        {roundPercentage}%
            </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            roundPercentage >= 80 ? 'bg-green-500' :
                            roundPercentage >= 70 ? 'bg-blue-500' :
                            roundPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${roundPercentage}%` }}
                        ></div>
              </div>
            </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              <button
                onClick={resetTest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
              >
                Take Another Test
              </button>
              <Link
                href="/dashboard"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
              </div>
            </div>
        </main>
        <FloatingChatbot />
          </div>
    );
  }

  // Show loading screen when generating rounds
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!testStarted && roundsData.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="bg-gray-900 shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
                  ← Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-white">IELTS Academic Reading Test</h1>
        </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-900 rounded-full mb-6">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              3-Passage Reading Test
              </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete 3 rounds of reading passages with 12-14 questions each. 
              Test your comprehension skills with academic-level texts.
              </p>
            </div>

          {/* Test Format Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((round) => (
              <div key={round} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-lg">{round}</span>
              </div>
                  <div className="text-sm text-gray-400">Round {round}</div>
            </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Passage {round}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  12-14 questions per passage
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~20 minutes
            </div>
          </div>
            ))}
          </div>

          {/* Test Instructions */}
          {showInstructions && (
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl shadow-lg p-8 mb-8 border border-blue-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Instructions
                  </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">1</span>
                  </div>
                    <p className="text-blue-100">Read each passage carefully before answering questions</p>
                </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">2</span>
            </div>
                    <p className="text-blue-100">Answer all questions for each round before proceeding</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">3</span>
                    </div>
                    <p className="text-blue-100">Use the timer to manage your time effectively</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">4</span>
                    </div>
                    <p className="text-blue-100">Questions appear on the right, passage on the left</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">5</span>
                    </div>
                    <p className="text-blue-100">Both panels scroll independently for easy navigation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">6</span>
                    </div>
                    <p className="text-blue-100">Total time: 60 minutes for all 3 rounds</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <div className="text-gray-300">Passages</div>
                  </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">40</div>
              <div className="text-gray-300">Questions</div>
                </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">60</div>
              <div className="text-gray-300">Minutes</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Academic</div>
              <div className="text-gray-300">Level</div>
            </div>
            </div>

          {/* Start Button */}
          <div className="text-center">
              <button
              onClick={startTest}
                disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-lg text-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Starting Test...</span>
                  </div>
                ) : (
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Start Reading Test</span>
                </div>
                )}
              </button>
            </div>
        </main>
        <FloatingChatbot />
          </div>
    );
  }

  const currentRoundData = getCurrentRoundData();

  if (!currentRoundData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading round {currentRound}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">{currentRound}</span>
                </div>
                <h1 className="text-xl font-semibold text-white">
                  Round {currentRound} of 3
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-300">Time:</span>
                <span className="font-mono text-lg text-white bg-gray-800 px-3 py-1 rounded">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-300">Questions:</span>
                <span className="text-white font-semibold">{currentRoundData.questions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Passage Section */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-4 border-b border-gray-700 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  {currentRoundData.passage.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-blue-200">
                  <span>{currentRoundData.passage.wordCount} words</span>
                  <span>•</span>
                  <span>~{currentRoundData.passage.readingTime} min read</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                {currentRoundData.passage.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            </div>

          {/* Questions Section */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <div className="bg-gradient-to-r from-green-900 to-blue-900 px-6 py-4 border-b border-gray-700 flex-shrink-0">
              <h3 className="text-xl font-semibold text-white">
                Questions for Round {currentRound}
                </h3>
              <p className="text-sm text-green-200 mt-1">
                Theme: {currentRoundData.metadata.theme} • {currentRoundData.questions.length} questions
                </p>
              </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 pb-8">
                {currentRoundData.questions.map((question) => (
                  <div key={question.questionNumber} className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="mb-4">
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {question.questionNumber}
                        </span>
                        <p className="text-gray-200 text-lg leading-relaxed">
                          {question.questionText}
                        </p>
              </div>
            </div>

                    <div className="space-y-3">
                      {Object.entries(question.options).map(([option, text]) => (
                        <label
                          key={option}
                          className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            userAnswers[`${currentRoundData.roundNumber}-${question.questionNumber}`] === option
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentRoundData.roundNumber}-${question.questionNumber}`}
                            value={option}
                            checked={userAnswers[`${currentRoundData.roundNumber}-${question.questionNumber}`] === option}
                            onChange={(e) => handleAnswerChange(question.questionNumber, e.target.value, currentRoundData.roundNumber)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                          />
                      <div className="flex-1">
                            <span className="font-semibold text-blue-400 mr-3">{option}.</span>
                            <span className="text-gray-300">{text}</span>
                      </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Round {currentRound} of 3
            </div>
            <div className="text-sm text-gray-400">
              • {Object.keys(userAnswers).filter(key => key.startsWith(`${currentRound}-`)).length} answered
            </div>
            <div className="text-sm text-gray-400">
              • {currentRoundData.questions.length - Object.keys(userAnswers).filter(key => key.startsWith(`${currentRound}-`)).length} remaining
            </div>
          </div>
          
          <div className="flex space-x-4">
            {currentRound < 3 ? (
              <button
                onClick={nextRound}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <span>Next Round</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit Test</span>
                          </div>
              </button>
            )}
                        </div>
                      </div>
            </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900 border border-red-600 text-red-100 px-6 py-4 rounded-lg shadow-lg max-w-md z-50">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 ml-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
                </button>
            </div>
          </div>
        )}
      
      <FloatingChatbot />
    </div>
  );
}
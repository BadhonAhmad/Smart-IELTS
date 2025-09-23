"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function ListeningPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(90); // Fixed duration for demo
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioStatus, setAudioStatus] = useState("🔊 Ready to play");
  const [userPrompt, setUserPrompt] = useState<string>("");

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Get user prompt from localStorage on component mount
  useEffect(() => {
    const prompt = localStorage.getItem("listeningTestPrompt");
    if (prompt) {
      setUserPrompt(prompt);
      // Clear it after use
      localStorage.removeItem("listeningTestPrompt");
    }
  }, []);

  // Simplified conversation script
  const conversationScript =
    "Hi Sarah! I'm so excited about our upcoming vacation. We've been planning this for months! I know, Lisa! I can't believe we finally booked it. So we're definitely going for 7 days, right? Yes, exactly 7 days. And I'm so glad we decided to fly instead of driving. The airplane tickets were a good deal. Absolutely! Flying will save us so much time. And our budget of 1500 dollars should be perfect for everything we want to do. I think so too. I'm particularly excited about visiting Paris first. It's been my dream destination for years! Paris will be amazing! The Eiffel Tower, the Louvre, all that history and culture. This is going to be the best vacation ever!";

  // Simple audio generation and playback
  const playAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      setAudioStatus("🎤 Generating audio...");

      // Cancel any existing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Check if speech synthesis is available
      if (!window.speechSynthesis) {
        alert(
          "Text-to-speech is not supported in your browser. Please try Chrome, Firefox, or Edge."
        );
        setIsGeneratingAudio(false);
        return;
      }

      // Wait for voices to load
      await new Promise((resolve) => {
        if (speechSynthesis.getVoices().length > 0) {
          resolve(true);
        } else {
          speechSynthesis.onvoiceschanged = () => resolve(true);
        }
      });

      const utterance = new SpeechSynthesisUtterance(conversationScript);
      utterance.rate = 0.9 * playbackSpeed;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Get a good English voice
      const voices = speechSynthesis.getVoices();
      const englishVoice =
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") && !voice.name.includes("Google")
        ) ||
        voices.find((voice) => voice.lang.startsWith("en")) ||
        voices[0];

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsGeneratingAudio(false);
        setAudioLoaded(true);
        setAudioStatus("🔊 Playing conversation...");
        startTimer();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(duration);
        setAudioStatus("✅ Audio completed");
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsGeneratingAudio(false);
        setAudioStatus("❌ Audio error - try again");
      };

      speechUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Audio generation error:", error);
      setIsGeneratingAudio(false);
      setAudioStatus("❌ Failed to generate audio");
    }
  };

  const startTimer = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    setCurrentTime(0);
    timeIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          if (timeIntervalRef.current) {
            clearInterval(timeIntervalRef.current);
          }
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Trigger voices loading
      speechSynthesis.getVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          console.log("Voices loaded:", speechSynthesis.getVoices().length);
        };
      }
    }

    return () => {
      // Cleanup on component unmount
      if (typeof window !== "undefined" && window.speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Demo questions
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the main topic of the conversation?",
      options: [
        "Planning a vacation",
        "Discussing work schedules",
        "Talking about the weather",
        "Arranging a meeting",
      ],
      correctAnswer: "Planning a vacation",
    },
    {
      id: 2,
      question: "How long will the trip last?",
      options: ["3 days", "5 days", "7 days", "10 days"],
      correctAnswer: "7 days",
    },
    {
      id: 3,
      question: "What mode of transportation will they use?",
      options: ["Car", "Train", "Airplane", "Bus"],
      correctAnswer: "Airplane",
    },
    {
      id: 4,
      question: "What is their budget for the trip?",
      options: ["$500", "$1000", "$1500", "$2000"],
      correctAnswer: "$1500",
    },
    {
      id: 5,
      question: "Which city will they visit first?",
      options: ["Paris", "London", "Rome", "Madrid"],
      correctAnswer: "Paris",
    },
  ];

  const startDemo = () => {
    setTestStarted(true);
    setCurrentTime(0);
    setAudioStatus("🎵 Starting audio...");
    playAudio();
  };

  const pauseDemo = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      setAudioStatus("⏸️ Audio paused");
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    }
  };

  const resumeDemo = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      setAudioStatus("🔊 Audio resumed");
      startTimer();
    }
  };

  const stopDemo = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setAudioStatus("⏹️ Audio stopped");
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    setAudioStatus(`🎛️ Speed changed to ${speed}x`);

    // If audio is playing, restart with new speed
    if (speechSynthesis.speaking) {
      const wasPlaying = !speechSynthesis.paused;
      speechSynthesis.cancel();

      if (wasPlaying) {
        setTimeout(() => {
          playAudio();
        }, 200);
      }
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitAnswers = () => {
    setShowResults(true);
    speechSynthesis.cancel();
    setAudioStatus("📝 Test submitted");
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTest = () => {
    setTestStarted(false);
    setShowResults(false);
    setAnswers({});
    setCurrentTime(0);
    setIsPlaying(false);
    setIsPaused(false);
    setAudioLoaded(false);
    setIsGeneratingAudio(false);
    setAudioStatus("🔊 Ready to play");
    speechSynthesis.cancel();
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                Smart IELTS - Listening Practice
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

        {!testStarted && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Listening Practice Test</h2>
            <p className="text-gray-300 mb-6">
              This is a demo listening test. You will hear a conversation about
              vacation planning. Listen carefully and answer the questions
              below.
            </p>
            <button
              onClick={startDemo}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Start Listening Test
            </button>
          </div>
        )}

        {testStarted && !showResults && (
          <div>
            {/* Audio Player */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">🎧 Audio Player</h3>

              {/* Audio Status with Emoji */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg text-center">
                <div className="text-3xl mb-2">
                  {isGeneratingAudio && "🎤"}
                  {isPlaying && "🔊"}
                  {isPaused && "⏸️"}
                  {!isPlaying && !isPaused && !isGeneratingAudio && "🎵"}
                </div>
                <p className="text-lg font-medium text-blue-200">
                  {audioStatus}
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  Timer: {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                {!isPlaying && !isPaused && !isGeneratingAudio && (
                  <button
                    onClick={startDemo}
                    disabled={isGeneratingAudio}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    🎵 Play Conversation
                  </button>
                )}

                {!isPlaying && !isPaused && audioLoaded && (
                  <button
                    onClick={playAudio}
                    disabled={isGeneratingAudio}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    🔄 Replay
                  </button>
                )}

                {isPlaying && (
                  <button
                    onClick={pauseDemo}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    ⏸️ Pause
                  </button>
                )}

                {isPaused && (
                  <button
                    onClick={resumeDemo}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    ▶️ Resume
                  </button>
                )}

                {(isPlaying || isPaused) && (
                  <button
                    onClick={stopDemo}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>

              {/* Speed Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className="text-sm text-gray-400 mr-2">🎛️ Speed:</span>
                {[0.75, 1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changePlaybackSpeed(speed)}
                    disabled={isGeneratingAudio}
                    className={`px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 ${
                      playbackSpeed === speed
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Audio Info */}
              <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                <p className="text-sm text-blue-200">
                  🗣️ <strong>Conversation Topic:</strong> Vacation Planning
                </p>
                <p className="text-xs text-blue-300 mt-1">
                  Listen to two friends discussing their upcoming 7-day trip to
                  Paris
                </p>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-6">Questions</h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-3">
                      {index + 1}. {question.question}
                    </h4>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center text-gray-300"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            onChange={(e) =>
                              handleAnswerChange(question.id, e.target.value)
                            }
                            className="mr-3 text-blue-600"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={submitAnswers}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors mt-6"
              >
                Submit Answers
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Test Results</h2>

            {(() => {
              const score = calculateScore();
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium text-gray-300">
                        Score
                      </h3>
                      <p className="text-3xl font-bold text-green-400">
                        {score.percentage}%
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium text-gray-300">
                        Correct Answers
                      </h3>
                      <p className="text-3xl font-bold text-blue-400">
                        {score.correct}/{score.total}
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h3 className="text-lg font-medium text-gray-300">
                        Time Taken
                      </h3>
                      <p className="text-3xl font-bold text-purple-400">
                        {formatTime(currentTime)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">Answer Review</h3>
                    {questions.map((question, index) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;

                      return (
                        <div
                          key={question.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            isCorrect
                              ? "bg-green-900 border-green-500"
                              : "bg-red-900 border-red-500"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-white mb-2">
                                {index + 1}. {question.question}
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p className="text-gray-300">
                                  <span className="font-medium">
                                    Your answer:
                                  </span>{" "}
                                  {userAnswer || "No answer selected"}
                                </p>
                                <p className="text-gray-300">
                                  <span className="font-medium">
                                    Correct answer:
                                  </span>{" "}
                                  {question.correctAnswer}
                                </p>
                              </div>
                            </div>
                            <div className="ml-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  isCorrect
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                              >
                                {isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}

            <div className="mt-6 flex space-x-4">
              <button
                onClick={resetTest}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

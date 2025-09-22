"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface ListeningQuestion {
  id: number;
  type: "multiple-choice" | "fill-blank" | "matching" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer: string;
}

export default function ListeningPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfContent, setPdfContent] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock PDF content for demonstration
  const mockPdfContent = `
    Climate Change and Global Warming

    Climate change refers to long-term shifts in global or regional climate patterns. 
    Since the mid-20th century, scientists have observed unprecedented changes in Earth's climate system, 
    primarily attributed to increased levels of carbon dioxide and other greenhouse gases produced by human activities.

    The effects of climate change are far-reaching and include rising sea levels, more frequent extreme weather events, 
    changes in precipitation patterns, and shifts in ecosystems. These changes pose significant challenges to 
    agriculture, water resources, human health, and economic development worldwide.

    International cooperation is essential to address climate change effectively. The Paris Agreement, 
    signed in 2015, represents a global effort to limit global warming to well below 2 degrees Celsius 
    above pre-industrial levels. Countries are working together to reduce greenhouse gas emissions 
    and develop sustainable energy solutions.
  `;

  // Mock AI-generated questions
  const mockQuestions: ListeningQuestion[] = [
    {
      id: 1,
      type: "multiple-choice",
      question: "According to the passage, climate change refers to:",
      options: [
        "Short-term weather variations",
        "Long-term shifts in climate patterns",
        "Only temperature changes",
        "Seasonal variations",
      ],
      correctAnswer: "Long-term shifts in climate patterns",
    },
    {
      id: 2,
      type: "fill-blank",
      question:
        "The Paris Agreement was signed in _____ to limit global warming.",
      correctAnswer: "2015",
    },
    {
      id: 3,
      type: "multiple-choice",
      question:
        "Which of the following is NOT mentioned as an effect of climate change?",
      options: [
        "Rising sea levels",
        "Extreme weather events",
        "Changes in ecosystems",
        "Increased oil production",
      ],
      correctAnswer: "Increased oil production",
    },
    {
      id: 4,
      type: "short-answer",
      question:
        "What type of cooperation is essential to address climate change effectively?",
      correctAnswer: "International cooperation",
    },
    {
      id: 5,
      type: "fill-blank",
      question:
        "Climate change poses challenges to agriculture, water resources, human health, and _____ development.",
      correctAnswer: "economic",
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      simulateFileUpload(file);
    }
  };

  const simulateFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Simulate PDF text extraction
          setPdfContent(mockPdfContent);
          setQuestions(mockQuestions);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const startVoicePlayback = () => {
    if (!pdfContent) return;

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(pdfContent);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setTestStarted(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentProgress(100);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (!speechSynthesis.speaking) {
        clearInterval(progressInterval);
        return;
      }
      setCurrentProgress((prev) => Math.min(prev + 1, 99));
    }, 1000);
  };

  const pauseVoicePlayback = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeVoicePlayback = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopVoicePlayback = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentProgress(0);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitTest = () => {
    setShowResults(true);
    stopVoicePlayback();
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      const userAnswer = answers[question.id]?.toLowerCase().trim();
      const correctAnswer = question.correctAnswer.toLowerCase().trim();
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const resetTest = () => {
    setSelectedFile(null);
    setPdfContent("");
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setTestStarted(false);
    setCurrentProgress(0);
    stopVoicePlayback();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-4">
            IELTS Listening Test
          </h1>
          <p className="text-gray-300">
            Upload a PDF passage and practice listening with AI-generated
            questions.
          </p>
        </div>

        {/* File Upload Section */}
        {!pdfContent && (
          <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Upload Listening Passage
            </h2>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-lg font-medium text-gray-200">
                  {selectedFile ? selectedFile.name : "Choose PDF file"}
                </span>
                <span className="text-sm text-gray-400 mt-1">
                  Upload a PDF containing the listening passage
                </span>
              </label>
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Uploading and processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voice Player Section */}
        {pdfContent && (
          <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Audio Player</h2>
              <button
                onClick={resetTest}
                className="text-sm text-gray-300 hover:text-gray-100"
              >
                Upload New PDF
              </button>
            </div>

            {/* Audio Controls */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {!isPlaying ? (
                    <button
                      onClick={startVoicePlayback}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 11-6 0V4h6zM6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      {!isPaused ? (
                        <button
                          onClick={pauseVoicePlayback}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full p-3"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={resumeVoicePlayback}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a3 3 0 11-6 0V4h6zM6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={stopVoicePlayback}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 10h6v4H9z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Speed:</span>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="text-sm border border-gray-600 bg-gray-700 text-white rounded px-2 py-1"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    {isPlaying ? (isPaused ? "Paused" : "Playing") : "Ready"}
                  </span>
                  {isPlaying && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{Math.round(currentProgress)}%</span>
                <span>Audio Progress</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Listening Instructions:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Click play to start the audio narration of the passage
                </li>
                <li>• Answer the questions below while listening</li>
                <li>• You can pause, resume, or adjust playback speed</li>
                <li>• Submit your answers when the audio ends</li>
              </ul>
            </div>
          </div>
        )}

        {/* Questions Section */}
        {questions.length > 0 && testStarted && (
          <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">
              AI-Generated Listening Questions
            </h2>

            {questions.map((question, index) => (
              <div
                key={question.id}
                className="mb-6 p-4 border border-gray-600 rounded-lg bg-gray-800"
              >
                <h3 className="font-medium mb-3 text-white">
                  Question {index + 1}: {question.question}
                </h3>

                {question.type === "multiple-choice" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          className="text-blue-500"
                        />
                        <span className="text-gray-200">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {(question.type === "fill-blank" ||
                  question.type === "short-answer") && (
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className="w-full max-w-md px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button
                onClick={resetTest}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg border border-gray-600"
              >
                Start Over
              </button>
              <button
                onClick={submitTest}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg"
              >
                Submit Test
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="bg-gray-900 rounded-lg shadow-md p-6 mt-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Test Results</h2>
            <div className="bg-green-900 border border-green-700 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {calculateScore().correct}/{calculateScore().total}
                </div>
                <div className="text-green-700">
                  Score:{" "}
                  {Math.round(
                    (calculateScore().correct / calculateScore().total) * 100
                  )}
                  %
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Answer Review:</h3>
              {questions.map((question, index) => {
                const userAnswer = answers[question.id] || "No answer";
                const isCorrect =
                  userAnswer.toLowerCase().trim() ===
                  question.correctAnswer.toLowerCase().trim();
                return (
                  <div
                    key={question.id}
                    className={`mb-4 p-3 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p className="font-medium">
                      Question {index + 1}: {question.question}
                    </p>
                    <p
                      className={`text-sm ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      Your answer: {userAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-700">
                        Correct answer: {question.correctAnswer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={resetTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mt-4"
            >
              Take Another Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

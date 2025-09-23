"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FloatingChatbot from "../../components/FloatingChatbot";

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface FillBlankQuestion {
  id: number;
  text: string;
  blanks: { position: number; correctAnswer: string; explanation: string }[];
}

interface UserAnswers {
  mcq: { [key: number]: number };
  fillBlanks: { [key: number]: { [blankIndex: number]: string } };
}

export default function ReadingTest() {
  const [currentStep, setCurrentStep] = useState<
    "reading" | "questions" | "results"
  >("reading");
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({
    mcq: {},
    fillBlanks: {},
  });
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [hasTestData, setHasTestData] = useState(false);
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [error, setError] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Get user prompt from localStorage on component mount and check for test data
  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    const prompt = localStorage.getItem("readingTestPrompt");
    const testData = localStorage.getItem("generatedReadingTest");

    if (prompt) {
      setUserPrompt(prompt);
      // Clear it after use
      localStorage.removeItem("readingTestPrompt");
    }

    // Check if we have test data from popup or just show mock data
    setHasTestData(true);
    
    // Generate MCQ questions using AI
    generateQuestions();
  }, []);

  // Function to generate MCQ questions
  const generateQuestions = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Use backend URL from environment or default to localhost:4000
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      
      // Make multiple API calls to get 3 questions (since single calls work better)
      const questionPromises = [];
      for (let i = 0; i < 3; i++) {
        questionPromises.push(
          fetch(`${backendUrl}/api/gemini/generate-ielts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              skill: 'reading',
              count: 1
            }),
          })
        );
      }

      const responses = await Promise.all(questionPromises);
      
      // Check if all responses are ok
      for (const response of responses) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const dataPromises = responses.map(response => response.json());
      const dataArray = await Promise.all(dataPromises);
      
      console.log('API Responses:', dataArray); // Debug log
      
      // Combine all questions from multiple API calls
      const allQuestions: any[] = [];
      dataArray.forEach((data, index) => {
        if (data.success && data.data && data.data.questions) {
          data.data.questions.forEach((q: any) => {
            allQuestions.push({...q, id: allQuestions.length + 1});
          });
        }
      });
      
      if (allQuestions.length > 0) {
        // Transform the response to match our MCQQuestion interface
        const transformedQuestions: MCQQuestion[] = allQuestions.map((q: any, index: number) => {
          let correctAnswerIndex = 0;
          
          // Find the correct answer index by matching the string with options
          if (Array.isArray(q.options)) {
            correctAnswerIndex = q.options.findIndex((option: string) => 
              option.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
            );
            if (correctAnswerIndex === -1) correctAnswerIndex = 0; // fallback
          } else {
            // Handle object-style options {A, B, C, D}
            const optionsArray = [q.options.A, q.options.B, q.options.C, q.options.D];
            correctAnswerIndex = optionsArray.findIndex((option: string) => 
              option.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
            );
            if (correctAnswerIndex === -1) {
              // Try matching by letter
              correctAnswerIndex = q.correctAnswer === 'A' ? 0 : q.correctAnswer === 'B' ? 1 : q.correctAnswer === 'C' ? 2 : 3;
            }
          }
          
          return {
            id: index + 1,
            question: q.question,
            options: Array.isArray(q.options) ? q.options : [q.options.A, q.options.B, q.options.C, q.options.D],
            correctAnswer: correctAnswerIndex,
            explanation: q.explanation
          };
        });
        
        console.log('Transformed questions:', transformedQuestions); // Debug log
        setMcqQuestions(transformedQuestions);
      } else {
        throw new Error('Failed to generate questions - no questions received');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}. Using default questions.`);
      
      // Fallback to mock questions
      const mockQuestions: MCQQuestion[] = [
        {
          id: 1,
          question: "What is the main cause of the urban heat island effect mentioned in the passage?",
          options: [
            "High population density in cities",
            "Concrete and asphalt surfaces absorbing heat",
            "Lack of green spaces in urban areas",
            "Industrial activities in cities",
          ],
          correctAnswer: 1,
          explanation: "The passage states that concrete and asphalt surfaces absorb and retain heat more effectively than natural landscapes.",
        },
        {
          id: 2,
          question: "How much higher can urban temperatures be compared to rural areas?",
          options: [
            "1-3 degrees Celsius",
            "2-5 degrees Celsius",
            "3-7 degrees Celsius",
            "5-10 degrees Celsius",
          ],
          correctAnswer: 1,
          explanation: "The passage mentions that urban areas can be 2-5 degrees Celsius higher than surrounding rural areas.",
        },
        {
          id: 3,
          question: "What challenge do developing cities face according to the passage?",
          options: [
            "Lack of renewable energy technology",
            "Insufficient green infrastructure",
            "Balancing economic needs with environmental sustainability",
            "Political instability affecting planning",
          ],
          correctAnswer: 2,
          explanation: "The passage states that developing cities face the challenge of balancing immediate economic needs with long-term environmental sustainability.",
        },
      ];
      setMcqQuestions(mockQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock passage from MCP server
  const passage = `
Climate Change and Urban Planning

The relationship between climate change and urban planning has become increasingly critical in the 21st century. As global temperatures continue to rise, cities worldwide are experiencing unprecedented challenges that require innovative solutions and adaptive strategies.

Urban areas are particularly vulnerable to climate change impacts due to their high population density and infrastructure complexity. The phenomenon known as the "urban heat island effect" exacerbates temperature increases in cities, where concrete and asphalt surfaces absorb and retain heat more effectively than natural landscapes. This creates localized temperature differences that can be 2-5 degrees Celsius higher than surrounding rural areas.

Modern urban planners are now incorporating climate resilience into their designs through various approaches. Green infrastructure, including parks, green roofs, and urban forests, helps mitigate heat absorption while providing natural cooling through evapotranspiration. Additionally, sustainable transportation systems reduce greenhouse gas emissions and improve air quality.

The integration of renewable energy sources into urban planning represents another crucial adaptation strategy. Solar panels on building rooftops, wind turbines in appropriate locations, and district cooling systems powered by renewable energy all contribute to reducing cities' carbon footprints.

However, implementing these solutions requires significant financial investment and political commitment. Many developing cities face the challenge of balancing immediate economic needs with long-term environmental sustainability. The success of climate-adaptive urban planning ultimately depends on collaboration between government agencies, private sector stakeholders, and community organizations.
  `;

  // Mock fill-in-the-blanks questions from MCP server
  const fillBlankQuestions: FillBlankQuestion[] = [
    {
      id: 1,
      text: "Green infrastructure helps mitigate heat absorption while providing natural cooling through _____.",
      blanks: [
        {
          position: 0,
          correctAnswer: "evapotranspiration",
          explanation:
            "Evapotranspiration is the process by which plants release water vapor, providing natural cooling.",
        },
      ],
    },
    {
      id: 2,
      text: "The success of climate-adaptive urban planning depends on collaboration between _____, private sector stakeholders, and _____.",
      blanks: [
        {
          position: 0,
          correctAnswer: "government agencies",
          explanation:
            "Government agencies are mentioned as one of the key stakeholders in collaboration.",
        },
        {
          position: 1,
          correctAnswer: "community organizations",
          explanation:
            "Community organizations are the third group mentioned for successful collaboration.",
        },
      ],
    },
  ];

  const handleMCQAnswer = (questionId: number, selectedOption: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      mcq: { ...prev.mcq, [questionId]: selectedOption },
    }));
  };

  const handleFillBlankAnswer = (
    questionId: number,
    blankIndex: number,
    value: string
  ) => {
    setUserAnswers((prev) => ({
      ...prev,
      fillBlanks: {
        ...prev.fillBlanks,
        [questionId]: {
          ...prev.fillBlanks[questionId],
          [blankIndex]: value,
        },
      },
    }));
  };

  const calculateScore = () => {
    let totalQuestions = mcqQuestions.length;
    let correctMCQ = 0;

    // Calculate MCQ score
    mcqQuestions.forEach((q) => {
      if (userAnswers.mcq[q.id] === q.correctAnswer) {
        correctMCQ++;
      }
    });

    // Calculate fill-in-the-blanks score
    let totalBlanks = 0;
    let correctBlanks = 0;

    fillBlankQuestions.forEach((q) => {
      q.blanks.forEach((blank, index) => {
        totalBlanks++;
        const userAnswer = userAnswers.fillBlanks[q.id]?.[index]
          ?.toLowerCase()
          .trim();
        if (userAnswer === blank.correctAnswer.toLowerCase()) {
          correctBlanks++;
        }
      });
    });

    return {
      mcq: { correct: correctMCQ, total: mcqQuestions.length },
      fillBlanks: { correct: correctBlanks, total: totalBlanks },
      overall: {
        correct: correctMCQ + correctBlanks,
        total: mcqQuestions.length + totalBlanks,
      },
    };
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      setCurrentStep("results");
    }, 2000);
  };

  const renderFillBlankText = (question: FillBlankQuestion) => {
    const parts = question.text.split("_____");
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);

      if (i < parts.length - 1) {
        const blankIndex = i;
        result.push(
          <input
            key={`blank-${i}`}
            type="text"
            className="mx-2 px-3 py-1 border-2 border-blue-600 bg-gray-700 text-white rounded focus:border-blue-400 focus:outline-none min-w-[150px] inline-block"
            placeholder="Type your answer..."
            onChange={(e) =>
              handleFillBlankAnswer(question.id, blankIndex, e.target.value)
            }
            value={userAnswers.fillBlanks[question.id]?.[blankIndex] || ""}
          />
        );
      }
    }

    return <div className="leading-relaxed">{result}</div>;
  };

  const scores = showResults ? calculateScore() : null;

  // Show loading state initially or if not on client yet
  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">
            {!isClient ? "Loading..." : "Generating AI Questions..."}
          </h2>
          <p className="text-gray-400 mt-2">
            {!isClient 
              ? "Initializing the application..."
              : "Please wait while we create personalized IELTS reading questions using AI"
            }
          </p>
          {isClient && (
            <div className="mt-4 text-sm text-gray-500">
              This may take a moment as we generate high-quality questions for you
            </div>
          )}
        </div>
      </div>
    );
  }

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
                IELTS Reading Test
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">MCP Content:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                Loaded
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-600/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-300 mb-1">
                  Warning:
                </h3>
                <p className="text-gray-300 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "reading"
                  ? "text-blue-600"
                  : currentStep === "results"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "reading"
                    ? "bg-blue-600 text-white"
                    : currentStep === "results"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                1
              </div>
              <span className="font-medium">Read Passage</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "questions"
                  ? "text-blue-600"
                  : currentStep === "results"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "questions"
                    ? "bg-blue-600 text-white"
                    : currentStep === "results"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                2
              </div>
              <span className="font-medium">Answer Questions</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "results" ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "results"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                3
              </div>
              <span className="font-medium">View Results</span>
            </div>
          </div>
        </div>

        {/* Reading Step */}
        {currentStep === "reading" && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">
                  Content loaded from MCP Server
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Reading Passage
              </h2>
              <p className="text-gray-300 mb-6">
                Read the following passage carefully before proceeding to the
                questions.
              </p>
            </div>

            <div className="prose max-w-none mb-8">
              <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                {passage.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentStep("questions")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Proceed to Questions
              </button>
            </div>
          </div>
        )}

        {/* Questions Step */}
        {currentStep === "questions" && (
          <div className="space-y-8">
            {/* MCQ Questions */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Multiple Choice Questions
              </h2>
              {mcqQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="mb-8 pb-6 border-b border-gray-600 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`mcq-${question.id}`}
                          value={optionIndex}
                          onChange={() =>
                            handleMCQAnswer(question.id, optionIndex)
                          }
                          className="w-4 h-4 text-blue-500 focus:ring-blue-400"
                        />
                        <span className="text-gray-200">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Fill in the Blanks */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">
                Fill in the Blanks
              </h2>
              {fillBlankQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="mb-8 pb-6 border-b border-gray-600 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {mcqQuestions.length + index + 1}. Complete the sentence:
                  </h3>
                  <div className="text-gray-200 text-lg">
                    {renderFillBlankText(question)}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking Answers...</span>
                  </div>
                ) : (
                  "Submit Answers"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Step */}
        {currentStep === "results" && scores && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Test Results
            </h2>

            {/* Overall Score */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-900 rounded-full mb-4">
                <span className="text-4xl font-bold text-blue-400">
                  {Math.round(
                    (scores.overall.correct / scores.overall.total) * 100
                  )}
                  %
                </span>
              </div>
              <p className="text-xl text-gray-300">
                {scores.overall.correct} out of {scores.overall.total} correct
              </p>
            </div>

            {/* Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-900 rounded-lg p-6 border border-blue-700">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  Multiple Choice
                </h3>
                <p className="text-3xl font-bold text-blue-400">
                  {scores.mcq.correct}/{scores.mcq.total}
                </p>
                <p className="text-blue-300">Questions answered correctly</p>
              </div>

              <div className="bg-green-900 rounded-lg p-6 border border-green-700">
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  Fill in the Blanks
                </h3>
                <p className="text-3xl font-bold text-green-400">
                  {scores.fillBlanks.correct}/{scores.fillBlanks.total}
                </p>
                <p className="text-green-300">Blanks filled correctly</p>
              </div>
            </div>

            {/* Answer Review */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Answer Review</h3>

              {/* MCQ Review */}
              {mcqQuestions.map((question, index) => {
                const userAnswer = userAnswers.mcq[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-4 ${
                      isCorrect
                        ? "border-green-700 bg-green-900"
                        : "border-red-700 bg-red-900"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span
                        className={`text-2xl ${
                          isCorrect ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm text-gray-300 mb-2">
                          <span className="font-medium">Your answer:</span>{" "}
                          {question.options[userAnswer] || "Not answered"}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Correct answer:</span>{" "}
                          {question.options[question.correctAnswer]}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Explanation:</span>{" "}
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Fill Blanks Review */}
              {fillBlankQuestions.map((question, qIndex) => (
                <div key={question.id}>
                  {question.blanks.map((blank, bIndex) => {
                    const userAnswer = userAnswers.fillBlanks[question.id]?.[
                      bIndex
                    ]
                      ?.toLowerCase()
                      .trim();
                    const isCorrect =
                      userAnswer === blank.correctAnswer.toLowerCase();

                    return (
                      <div
                        key={`${question.id}-${bIndex}`}
                        className={`border rounded-lg p-4 ${
                          isCorrect
                            ? "border-green-300 bg-green-50"
                            : "border-red-300 bg-red-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span
                            className={`text-2xl ${
                              isCorrect ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {isCorrect ? "✓" : "✗"}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-2">
                              {mcqQuestions.length + qIndex + 1}. Fill in the
                              blank #{bIndex + 1}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Your answer:</span>{" "}
                              {userAnswer || "Not answered"}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">
                                Correct answer:
                              </span>{" "}
                              {blank.correctAnswer}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Explanation:</span>{" "}
                              {blank.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/dashboard">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
      
      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}

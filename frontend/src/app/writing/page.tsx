"use client";

import { useState } from "react";
import Link from "next/link";

interface WritingQuestion {
  id: number;
  type: "essay" | "diagram" | "letter";
  title: string;
  description: string;
  instructions: string[];
  timeLimit: string;
  wordCount: string;
  diagram?: string; // For diagram-based questions
}

interface UploadedAnswer {
  questionId: number;
  imageUrl: string;
  uploadTime: string;
  status: "uploaded" | "processing" | "reviewed";
}

export default function WritingTest() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [uploadedAnswers, setUploadedAnswers] = useState<UploadedAnswer[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock writing questions from MCP server
  const writingQuestions: WritingQuestion[] = [
    {
      id: 1,
      type: "essay",
      title: "Task 2: Climate Change Solutions",
      description: "Essay Writing Task",
      instructions: [
        "Write an essay discussing both individual and governmental solutions to climate change.",
        "Present a well-structured argument with clear examples.",
        "Express your own opinion in the conclusion.",
        "Use formal academic language throughout.",
      ],
      timeLimit: "40 minutes",
      wordCount: "At least 250 words",
    },
    {
      id: 2,
      type: "diagram",
      title: "Task 1: Process Diagram Analysis",
      description: "Diagram Description Task",
      instructions: [
        "Describe the process shown in the diagram below.",
        "Summarize the main stages in logical order.",
        "Include specific details and technical vocabulary.",
        "Do not give your personal opinion.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
      diagram:
        "Water Cycle Process - showing evaporation, condensation, precipitation, and collection stages",
    },
    {
      id: 3,
      type: "letter",
      title: "Task 1: Formal Letter Writing",
      description: "Complaint Letter Task",
      instructions: [
        "Write a formal letter to complain about a recent online purchase.",
        "Explain what you bought and what the problem is.",
        "Say what action you would like the company to take.",
        "Use appropriate formal letter format and tone.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
    },
    {
      id: 4,
      type: "essay",
      title: "Task 2: Technology and Education",
      description: "Argumentative Essay",
      instructions: [
        "Some people believe that technology has made learning easier, while others think it has made students lazy.",
        "Discuss both views and give your own opinion.",
        "Support your arguments with relevant examples.",
        "Structure your essay with clear introduction, body paragraphs, and conclusion.",
      ],
      timeLimit: "40 minutes",
      wordCount: "At least 250 words",
    },
  ];

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestion(questionId);
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file only");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);

          // Create mock uploaded answer
          const mockImageUrl = URL.createObjectURL(file);
          const newUpload: UploadedAnswer = {
            questionId,
            imageUrl: mockImageUrl,
            uploadTime: new Date().toLocaleString(),
            status: "uploaded",
          };

          setUploadedAnswers((prev) => {
            // Remove any existing upload for this question
            const filtered = prev.filter(
              (answer) => answer.questionId !== questionId
            );
            return [...filtered, newUpload];
          });

          // Simulate processing after upload
          setTimeout(() => {
            setUploadedAnswers((prev) =>
              prev.map((answer) =>
                answer.questionId === questionId
                  ? { ...answer, status: "processing" as const }
                  : answer
              )
            );
          }, 1000);

          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
  };

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "essay":
        return "📝";
      case "diagram":
        return "📊";
      case "letter":
        return "✉️";
      default:
        return "📄";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uploaded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
            Uploaded
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
            Processing
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
            Reviewed
          </span>
        );
      default:
        return null;
    }
  };

  const getUploadedAnswer = (questionId: number) => {
    return uploadedAnswers.find((answer) => answer.questionId === questionId);
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
                IELTS Writing Test
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">MCP Questions:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Loaded
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-3">
            📋 Writing Test Instructions
          </h2>
          <div className="text-blue-800 space-y-2">
            <p>• Choose a writing task from the questions below</p>
            <p>• Write your answer on paper using pen/pencil</p>
            <p>• Take a clear photo of your written answer</p>
            <p>• Upload the photo for AI evaluation and feedback</p>
            <p>• Ensure good lighting and legible handwriting</p>
          </div>
        </div>

        {/* Question Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Select a Writing Task
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {writingQuestions.map((question) => {
              const uploadedAnswer = getUploadedAnswer(question.id);
              const isSelected = selectedQuestion === question.id;

              return (
                <div
                  key={question.id}
                  className={`bg-gray-900 rounded-lg shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-blue-500 shadow-xl"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onClick={() => handleQuestionSelect(question.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getQuestionIcon(question.type)}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {question.title}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {question.description}
                          </p>
                        </div>
                      </div>
                      {uploadedAnswer && getStatusBadge(uploadedAnswer.status)}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>⏱️ {question.timeLimit}</span>
                      <span>📝 {question.wordCount}</span>
                    </div>

                    {question.diagram && (
                      <div className="bg-gray-50 border rounded p-3 mb-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Diagram:</span>{" "}
                          {question.diagram}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {question.instructions
                        .slice(0, 2)
                        .map((instruction, index) => (
                          <p key={index} className="text-sm text-gray-700">
                            • {instruction}
                          </p>
                        ))}
                      {question.instructions.length > 2 && (
                        <p className="text-sm text-blue-600">
                          +{question.instructions.length - 2} more
                          instructions...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Question Details */}
        {selectedQuestion && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
            <div className="border-b border-gray-600 pb-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">
                  {getQuestionIcon(
                    writingQuestions.find((q) => q.id === selectedQuestion)
                      ?.type || ""
                  )}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {
                      writingQuestions.find((q) => q.id === selectedQuestion)
                        ?.title
                    }
                  </h2>
                  <div className="flex items-center space-x-6 mt-2">
                    <span className="text-sm text-gray-300">
                      ⏱️{" "}
                      {
                        writingQuestions.find((q) => q.id === selectedQuestion)
                          ?.timeLimit
                      }
                    </span>
                    <span className="text-sm text-gray-600">
                      📝{" "}
                      {
                        writingQuestions.find((q) => q.id === selectedQuestion)
                          ?.wordCount
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* MCP Server Indicator */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  Question generated by MCP Server
                </span>
              </div>
            </div>

            {/* Detailed Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Task Instructions
              </h3>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <ul className="space-y-3">
                  {writingQuestions
                    .find((q) => q.id === selectedQuestion)
                    ?.instructions.map((instruction, index) => (
                      <li
                        key={index}
                        className="text-gray-700 flex items-start"
                      >
                        <span className="text-blue-600 font-bold mr-3">
                          {index + 1}.
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Diagram Display (if applicable) */}
            {writingQuestions.find((q) => q.id === selectedQuestion)
              ?.diagram && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Diagram to Analyze
                </h3>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-700 font-medium">
                    {
                      writingQuestions.find((q) => q.id === selectedQuestion)
                        ?.diagram
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    (In a real test, this would be a visual diagram)
                  </p>
                </div>
              </div>
            )}

            {/* Writing Area Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📝 Writing Instructions
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2 text-yellow-800">
                  <li>• Write your answer clearly on paper</li>
                  <li>• Use proper paragraphing and structure</li>
                  <li>• Check your word count meets the minimum requirement</li>
                  <li>• Review your work before taking the photo</li>
                </ul>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📷 Upload Your Answer
              </h3>

              {!getUploadedAnswer(selectedQuestion) ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, selectedQuestion)}
                    className="hidden"
                    id={`upload-${selectedQuestion}`}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor={`upload-${selectedQuestion}`}
                    className="cursor-pointer"
                  >
                    <div className="text-4xl text-gray-400 mb-4">📸</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {isUploading
                        ? "Uploading..."
                        : "Upload Photo of Your Answer"}
                    </h4>
                    <p className="text-gray-600">
                      Click to select an image or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported: JPG, PNG, HEIC (Max 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={getUploadedAnswer(selectedQuestion)?.imageUrl}
                      alt="Uploaded answer"
                      className="w-32 h-24 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-green-600 text-xl">✓</span>
                        <h4 className="font-semibold text-green-900">
                          Answer Uploaded Successfully
                        </h4>
                        {getStatusBadge(
                          getUploadedAnswer(selectedQuestion)?.status || ""
                        )}
                      </div>
                      <p className="text-sm text-green-700 mb-2">
                        Uploaded:{" "}
                        {getUploadedAnswer(selectedQuestion)?.uploadTime}
                      </p>
                      <div className="flex space-x-3">
                        <label
                          htmlFor={`replace-${selectedQuestion}`}
                          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Replace Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, selectedQuestion)
                          }
                          className="hidden"
                          id={`replace-${selectedQuestion}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">
                      Processing upload...
                    </span>
                    <span className="text-sm text-gray-700">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Summary */}
        {uploadedAnswers.length > 0 && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              📋 Uploaded Answers Summary
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedAnswers.map((answer) => {
                const question = writingQuestions.find(
                  (q) => q.id === answer.questionId
                );
                return (
                  <div
                    key={answer.questionId}
                    className="border border-gray-600 rounded-lg p-4 bg-gray-800"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xl">
                        {getQuestionIcon(question?.type || "")}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {question?.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {answer.uploadTime}
                        </p>
                      </div>
                      {getStatusBadge(answer.status)}
                    </div>
                    <img
                      src={answer.imageUrl}
                      alt="Answer preview"
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

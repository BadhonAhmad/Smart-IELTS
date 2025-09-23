"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FloatingChatbot from "../../components/FloatingChatbot";

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

interface SpellingError {
  word: string;
  suggestion: string;
  position: number;
}

interface GrammarError {
  text: string;
  correction: string;
  rule: string;
  position: number;
}

interface WritingEvaluation {
  overallScore: number;
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  extractedText: string;
  wordCount: number;
  spellingErrors: SpellingError[];
  grammarErrors: GrammarError[];
  feedback: string;
}

interface UploadedAnswer {
  questionId: number;
  imageUrl: string;
  uploadTime: string;
  status: "uploaded" | "processing" | "reviewed";
  evaluation?: WritingEvaluation;
}

export default function WritingTest() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [uploadedAnswers, setUploadedAnswers] = useState<UploadedAnswer[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedInstructions, setExpandedInstructions] = useState<Set<number>>(new Set());
  const [displayedQuestions, setDisplayedQuestions] = useState<WritingQuestion[]>([]);

  // Full pool of 16 writing questions from MCP server
  const allWritingQuestions: WritingQuestion[] = [
    {
      id: 1,
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
      id: 2,
      type: "letter",
      title: "Task 2: Formal Letter Writing",
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
      id: 3,
      type: "essay",
      title: "Task 3: Climate Change Solutions",
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
      id: 4,
      type: "essay",
      title: "Task 4: Technology and Education",
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
    {
      id: 5,
      type: "diagram",
      title: "Task 5: Manufacturing Process",
      description: "Process Description Task",
      instructions: [
        "Describe the manufacturing process shown in the diagram.",
        "Explain each stage of production in chronological order.",
        "Use appropriate technical vocabulary.",
        "Write in a formal, objective style.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
      diagram:
        "Chocolate Production Process - from cocoa beans to finished chocolate bars",
    },
    {
      id: 6,
      type: "letter",
      title: "Task 6: Job Application Letter",
      description: "Formal Application Letter",
      instructions: [
        "Write a formal letter applying for a part-time job at a local bookstore.",
        "Mention your relevant experience and qualifications.",
        "Explain why you are interested in this position.",
        "Use appropriate formal letter structure and tone.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
    },
    {
      id: 7,
      type: "essay",
      title: "Task 7: Social Media Impact",
      description: "Opinion Essay",
      instructions: [
        "Social media has both positive and negative effects on society.",
        "Discuss the advantages and disadvantages of social media.",
        "Give your own opinion with supporting examples.",
        "Organize your essay with clear paragraphs and logical flow.",
      ],
      timeLimit: "40 minutes",
      wordCount: "At least 250 words",
    },
    {
      id: 8,
      type: "diagram",
      title: "Task 8: Life Cycle Analysis",
      description: "Biological Process Task",
      instructions: [
        "Describe the life cycle shown in the diagram.",
        "Explain each stage of development clearly.",
        "Use scientific terminology appropriately.",
        "Present information in a logical sequence.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
      diagram:
        "Butterfly Life Cycle - egg, larva, pupa, adult butterfly stages",
    },
    {
      id: 9,
      type: "letter",
      title: "Task 9: Invitation Letter",
      description: "Formal Invitation Task",
      instructions: [
        "Write a formal letter inviting a guest speaker to your university.",
        "Explain the purpose of the event and audience details.",
        "Mention the proposed date, time, and venue.",
        "Include information about accommodation and travel arrangements.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
    },
    {
      id: 10,
      type: "essay",
      title: "Task 10: Work-Life Balance",
      description: "Discussion Essay",
      instructions: [
        "Many people struggle to maintain a healthy work-life balance in modern society.",
        "What are the causes of this problem?",
        "What solutions can you suggest?",
        "Support your ideas with relevant examples and explanations.",
      ],
      timeLimit: "40 minutes",
      wordCount: "At least 250 words",
    },
    {
      id: 11,
      type: "diagram",
      title: "Task 11: Urban Planning Map",
      description: "Map Description Task",
      instructions: [
        "Describe the changes in the town layout shown in the maps.",
        "Compare the town in different time periods.",
        "Highlight the most significant developments.",
        "Use appropriate geographical and directional language.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
      diagram:
        "Town Development Maps - showing changes from 1990 to 2020",
    },
    {
      id: 12,
      type: "letter",
      title: "Task 12: Recommendation Letter",
      description: "Formal Recommendation Task",
      instructions: [
        "Write a letter recommending improvements to your local library.",
        "Describe current problems or limitations.",
        "Suggest specific improvements and their benefits.",
        "Use a polite and constructive tone throughout.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
    },
    {
      id: 13,
      type: "essay",
      title: "Task 13: Transportation and Environment",
      description: "Problem-Solution Essay",
      instructions: [
        "Increasing car ownership is causing environmental problems in many cities.",
        "What are the main environmental impacts?",
        "What measures can be taken to reduce these problems?",
        "Provide specific examples and practical solutions.",
      ],
      timeLimit: "40 minutes",
      wordCount: "At least 250 words",
    },
    {
      id: 14,
      type: "diagram",
      title: "Task 14: Energy Production Flow",
      description: "Technical Process Task",
      instructions: [
        "Describe how electricity is generated in the power plant shown.",
        "Explain the energy conversion process step by step.",
        "Include technical details and specific terminology.",
        "Maintain an objective, factual writing style.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
      diagram:
        "Solar Power Plant - photovoltaic panels to electrical grid distribution",
    },
    {
      id: 15,
      type: "letter",
      title: "Task 15: Inquiry Letter",
      description: "Information Request Task",
      instructions: [
        "Write a letter inquiring about English language courses at a college.",
        "Ask about course duration, fees, and entry requirements.",
        "Request information about accommodation options.",
        "Mention your current English level and learning goals.",
      ],
      timeLimit: "20 minutes",
      wordCount: "At least 150 words",
    },
    {
      id: 16,
      type: "essay",
      title: "Task 16: Healthcare and Technology",
      description: "Advantage-Disadvantage Essay",
      instructions: [
        "Technology is increasingly being used in healthcare and medical treatment.",
        "What are the advantages and disadvantages of this development?",
        "Do the benefits outweigh the drawbacks?",
        "Use specific examples to support your arguments.",
      ],
      timeLimit: "40 minutes",
      wordCount: "At least 250 words",
    },
  ];

  // Function to randomly select 3 questions from the pool of 16 and renumber them as 1, 2, 3
  const getRandomQuestions = (questions: WritingQuestion[], count: number = 3): WritingQuestion[] => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    // Renumber the selected questions as Task 1, Task 2, Task 3
    return selected.map((question, index) => ({
      ...question,
      id: index + 1, // Renumber as 1, 2, 3
      title: question.title.replace(/Task \d+:/, `Task ${index + 1}:`), // Update title numbering
    }));
  };

  // Initialize with 3 random questions from 16 on component mount
  useEffect(() => {
    setDisplayedQuestions(getRandomQuestions(allWritingQuestions, 3));
  }, []);

  // Function to generate new random questions from the pool of 16
  const generateNewQuestions = () => {
    setDisplayedQuestions(getRandomQuestions(allWritingQuestions, 3));
    setSelectedQuestion(null); // Reset selection when generating new questions
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestion(questionId);
  };

  const toggleInstructionsExpanded = (questionId: number) => {
    setExpandedInstructions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
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

            // Generate mock evaluation after processing
            setTimeout(() => {
              const mockEvaluation = generateMockEvaluation(questionId);
              setUploadedAnswers((prev) =>
                prev.map((answer) =>
                  answer.questionId === questionId
                    ? {
                        ...answer,
                        status: "reviewed" as const,
                        evaluation: mockEvaluation,
                      }
                    : answer
                )
              );
            }, 3000); // 3 seconds of processing time
          }, 1000);

          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
  };

  // Generate mock evaluation based on question type
  const generateMockEvaluation = (questionId: number): WritingEvaluation => {
    const question = allWritingQuestions.find((q) => q.id === questionId);
    const questionType = question?.type || "essay";

    // Mock extracted text based on question type
    const mockTexts = {
      essay:
        "Climate change is one of the most pressing issues of our time. Both individuals and governments have important roles to play in finding solutions. Individual actions such as reducing energy consumption, using public transportation, and recycling can make a significant impact. However, govenment policies are equally crucial. For example, investing in renewable energy sources and implementing carbon taxes can drive systemic change. In my opinion, a combination of both approaches is necesary to address this global challenge effectively.",
      diagram:
        "The water cycle is a continuous process that involves several stages. First, water evaporates from oceans, lakes, and rivers due to solar energy. The evaporated water rises into the atmosphere as water vapor. Next, condensation occurs when the water vapor cools and forms clouds. Precipitaton then happens when the water droplets in clouds become too heavy and fall as rain, snow, or hail. Finally, the water collects in water bodies, completing the cycle.",
      letter:
        "Dear Customer Service Manager, I am writing to express my dissatisfaction with a recent online purchase I made from your company. On March 15th, I ordered a laptop computer (Order #12345) for $899. However, when the package arrived three days later, I discovered that the screen was cracked and the keyboard was missing several keys. This is completely unacceptable for a brand new product. I would like you to replace the defective laptop with a new one and provide a prepaid shipping label for returning the damaged item. I expect this matter to be resolved within 10 business days. I look forward to your prompt response. Sincerely, John Smith",
    };

    const extractedText = mockTexts[questionType];

    // Mock spelling errors
    const spellingErrors: SpellingError[] = [
      {
        word: "govenment",
        suggestion: "government",
        position: extractedText.indexOf("govenment"),
      },
      {
        word: "necesary",
        suggestion: "necessary",
        position: extractedText.indexOf("necesary"),
      },
      {
        word: "Precipitaton",
        suggestion: "Precipitation",
        position: extractedText.indexOf("Precipitaton"),
      },
    ].filter((error) => error.position !== -1);

    // Mock grammar errors
    const grammarErrors: GrammarError[] = [
      {
        text: "is necesary",
        correction: "is necessary",
        rule: "Subject-verb agreement",
        position: extractedText.indexOf("is necesary"),
      },
      {
        text: "drive systemic",
        correction: "drive systematic",
        rule: "Word choice",
        position: extractedText.indexOf("drive systemic"),
      },
    ].filter((error) => error.position !== -1);

    // Generate scores based on question type
    const baseScores = {
      essay: { task: 7.0, coherence: 6.5, lexical: 6.0, grammar: 6.5 },
      diagram: { task: 7.5, coherence: 7.0, lexical: 6.5, grammar: 7.0 },
      letter: { task: 7.0, coherence: 6.5, lexical: 6.5, grammar: 6.0 },
    };

    const scores = baseScores[questionType];
    const overallScore =
      Math.round(
        ((scores.task + scores.coherence + scores.lexical + scores.grammar) /
          4) *
          10
      ) / 10;

    const feedbacks = {
      essay:
        "Your essay demonstrates a good understanding of the topic with relevant examples. However, there are some spelling errors that need attention. Work on expanding your vocabulary and double-check your spelling before submission.",
      diagram:
        "You have described the process clearly with appropriate sequencing. The vocabulary used is generally accurate. Minor grammar improvements would enhance the overall quality.",
      letter:
        "Your letter follows the appropriate format and addresses all the required points. The tone is appropriately formal. Focus on proofreading to eliminate spelling mistakes.",
    };

    return {
      overallScore,
      taskAchievement: scores.task,
      coherenceCohesion: scores.coherence,
      lexicalResource: scores.lexical,
      grammaticalRange: scores.grammar,
      extractedText,
      wordCount: extractedText.split(" ").length,
      spellingErrors,
      grammarErrors,
      feedback: feedbacks[questionType],
    };
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
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-3xl">✍️</span>
                <h1 className="text-3xl font-bold text-white">
                  IELTS Writing Test
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-gray-300 block">Question Pool: 16 Questions</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-800 text-green-200">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  3 Random Tasks Loaded
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">📋</div>
            <h2 className="text-xl font-bold text-blue-300">
              Writing Test Instructions
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">1.</span>
                <p className="text-gray-300 text-sm">Choose a writing task from the questions below</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">2.</span>
                <p className="text-gray-300 text-sm">Write your answer clearly on paper using pen/pencil</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">3.</span>
                <p className="text-gray-300 text-sm">Use proper paragraphing and structure</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">4.</span>
                <p className="text-gray-300 text-sm">Check your word count meets the minimum requirement</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">5.</span>
                <p className="text-gray-300 text-sm">Review your work before taking the photo</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">6.</span>
                <p className="text-gray-300 text-sm">Take a clear photo of your written answer</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">7.</span>
                <p className="text-gray-300 text-sm">Upload the photo using the upload button on the right</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">8.</span>
                <p className="text-gray-300 text-sm">Get instant AI evaluation and detailed feedback</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-sm mt-0.5">💡</span>
                <p className="text-yellow-300 text-sm font-medium">Ensure good lighting and legible handwriting for best results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Select a Writing Task
            </h2>
            <button
              onClick={generateNewQuestions}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🎲</span>
              Generate New Questions
            </button>
          </div>
          <div className="space-y-6">
            {displayedQuestions.map((question) => {
              const uploadedAnswer = getUploadedAnswer(question.id);
              const isSelected = selectedQuestion === question.id;

              return (
                <div
                  key={question.id}
                  className={`bg-gray-900 rounded-lg shadow-lg border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-blue-500 shadow-xl"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Side - Task Information */}
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleQuestionSelect(question.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">
                              {getQuestionIcon(question.type)}
                            </span>
                            <div>
                              <h3 className="text-xl font-semibold text-white">
                                {question.title}
                              </h3>
                              <p className="text-sm text-gray-300">
                                {question.description}
                              </p>
                            </div>
                          </div>
                          {uploadedAnswer && getStatusBadge(uploadedAnswer.status)}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <span>⏱️ {question.timeLimit}</span>
                          <span>📝 {question.wordCount}</span>
                        </div>

                        {question.diagram && (
                          <div className="bg-gray-700 border border-gray-600 rounded p-3 mb-4">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium">Diagram:</span>{" "}
                              {question.diagram}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          {question.instructions.map((instruction, index) => (
                              <p key={index} className="text-sm text-gray-300">
                                • {instruction}
                              </p>
                            ))}
                        </div>

                        {isSelected && (
                          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                            <p className="text-sm text-blue-300">
                              ✓ Selected - Click the upload area to submit your answer
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Photo Upload Section */}
                      <div className="w-full lg:w-80 xl:w-96">
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <span>📷</span>
                            Upload Your Answer
                          </h4>

                          {!uploadedAnswer ? (
                            <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-gray-700/50">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, question.id)}
                                className="hidden"
                                id={`upload-${question.id}`}
                                disabled={isUploading}
                              />
                              <label
                                htmlFor={`upload-${question.id}`}
                                className="cursor-pointer block"
                              >
                                <div className="text-3xl text-gray-400 mb-3">📸</div>
                                <h5 className="text-sm font-medium text-white mb-2">
                                  {isUploading && selectedQuestion === question.id
                                    ? "Uploading..."
                                    : "Click to Upload Photo"}
                                </h5>
                                <p className="text-xs text-gray-300 mb-2">
                                  Take a clear photo of your written answer
                                </p>
                                <p className="text-xs text-gray-400">
                                  JPG, PNG, HEIC (Max 5MB)
                                </p>
                              </label>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {/* Preview Image */}
                              <div className="relative">
                                <img
                                  src={uploadedAnswer.imageUrl}
                                  alt="Uploaded answer"
                                  className="w-full h-32 object-cover rounded border border-gray-600"
                                />
                                <div className="absolute top-2 right-2">
                                  {getStatusBadge(uploadedAnswer.status)}
                                </div>
                              </div>

                              {/* Upload Info */}
                              <div className="bg-green-900/30 border border-green-600/50 rounded p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-green-400 text-sm">✓</span>
                                  <span className="text-sm font-medium text-green-300">
                                    Answer Uploaded
                                  </span>
                                </div>
                                <p className="text-xs text-green-400">
                                  {uploadedAnswer.uploadTime}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <label
                                  htmlFor={`replace-${question.id}`}
                                  className="flex-1 text-center text-xs px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition-colors"
                                >
                                  Replace Image
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, question.id)}
                                  className="hidden"
                                  id={`replace-${question.id}`}
                                />
                                {uploadedAnswer.evaluation && (
                                  <button
                                    onClick={() => handleQuestionSelect(question.id)}
                                    className="flex-1 text-xs px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                  >
                                    View Results
                                  </button>
                                )}
                              </div>

                              {/* Score Preview */}
                              {uploadedAnswer.evaluation && (
                                <div className="bg-blue-900/30 border border-blue-600/50 rounded p-3">
                                  <div className="text-center">
                                    <p className="text-xs text-blue-300 mb-1">Overall Score</p>
                                    <p className="text-lg font-bold text-blue-200">
                                      {uploadedAnswer.evaluation.overallScore}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Upload Progress (only for currently uploading question) */}
                          {isUploading && selectedQuestion === question.id && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-300">
                                  Processing...
                                </span>
                                <span className="text-xs text-gray-300">
                                  {Math.round(uploadProgress)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Quick Task Info */}
                        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Type: {question.type.toUpperCase()}</span>
                            <span>
                              {question.type === 'essay' ? '🎯' : question.type === 'diagram' ? '📊' : '✉️'}
                            </span>
                          </div>
                        </div>
                      </div>
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
                    allWritingQuestions.find((q) => q.id === selectedQuestion)
                      ?.type || ""
                  )}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {
                      allWritingQuestions.find((q) => q.id === selectedQuestion)
                        ?.title
                    }
                  </h2>
                  <div className="flex items-center space-x-6 mt-2">
                    <span className="text-sm text-gray-300">
                      ⏱️{" "}
                      {
                        allWritingQuestions.find((q) => q.id === selectedQuestion)
                          ?.timeLimit
                      }
                    </span>
                    <span className="text-sm text-gray-400">
                      📝{" "}
                      {
                        allWritingQuestions.find((q) => q.id === selectedQuestion)
                          ?.wordCount
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* MCP Server Indicator */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">
                  Question generated by MCP Server
                </span>
              </div>
            </div>

            {/* Detailed Instructions
            // <div className="mb-8">
            //   <h3 className="text-lg font-semibold text-white mb-4">
            //     📝 Task Instructions
            //   </h3>
            //   <div className="bg-gray-700 border-l-4 border-blue-500 p-4 rounded-r-lg">
            //     <ul className="space-y-3">
            //       {writingQuestions
            //         .find((q) => q.id === selectedQuestion)
            //         ?.instructions.map((instruction, index) => (
            //           <li
            //             key={index}
            //             className="text-gray-300 flex items-start"
            //           >
            //             <span className="text-blue-400 font-bold mr-3 min-w-[20px]">
            //               {index + 1}.
            //             </span>
            //             <span>{instruction}</span>
            //           </li>
            //         ))}
            //     </ul>
            //   </div>
            // </div> */}

            {/* Diagram Display (if applicable) */}
            {allWritingQuestions.find((q) => q.id === selectedQuestion)
              ?.diagram && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">
                  📊 Diagram to Analyze
                </h3>
                <div className="bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-300 font-medium">
                    {
                      allWritingQuestions.find((q) => q.id === selectedQuestion)
                        ?.diagram
                    }
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    (In a real test, this would be a visual diagram)
                  </p>
                </div>
              </div>
            )}



            {/* Photo Upload Section */}
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                📷 Upload Your Answer
              </h3>

              {!getUploadedAnswer(selectedQuestion) ? (
                <div className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-800">
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
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {isUploading
                        ? "Uploading..."
                        : "Upload Photo of Your Answer"}
                    </h4>
                    <p className="text-gray-300">
                      Click to select an image or drag and drop
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supported: JPG, PNG, HEIC (Max 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="bg-green-900 border border-green-600 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={getUploadedAnswer(selectedQuestion)?.imageUrl}
                      alt="Uploaded answer"
                      className="w-32 h-24 object-cover rounded border border-gray-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-green-400 text-xl">✓</span>
                        <h4 className="font-semibold text-green-300">
                          Answer Uploaded Successfully
                        </h4>
                        {getStatusBadge(
                          getUploadedAnswer(selectedQuestion)?.status || ""
                        )}
                      </div>
                      <p className="text-sm text-green-400 mb-2">
                        Uploaded:{" "}
                        {getUploadedAnswer(selectedQuestion)?.uploadTime}
                      </p>
                      <div className="flex space-x-3">
                        <label
                          htmlFor={`replace-${selectedQuestion}`}
                          className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
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

              {/* Evaluation Results */}
              {getUploadedAnswer(selectedQuestion)?.evaluation && (
                <div className="mt-6 bg-gray-800 border border-gray-600 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-white mb-4">
                    📊 Writing Evaluation Results
                  </h4>

                  {/* Overall Score */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-blue-900 rounded-lg p-4 text-center">
                      <h5 className="text-sm font-medium text-blue-300 mb-1">
                        Overall Score
                      </h5>
                      <p className="text-2xl font-bold text-blue-200">
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.overallScore
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h5 className="text-xs font-medium text-gray-300 mb-1">
                        Task Achievement
                      </h5>
                      <p className="text-lg font-bold text-white">
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.taskAchievement
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h5 className="text-xs font-medium text-gray-300 mb-1">
                        Coherence
                      </h5>
                      <p className="text-lg font-bold text-white">
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.coherenceCohesion
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h5 className="text-xs font-medium text-gray-300 mb-1">
                        Lexical Resource
                      </h5>
                      <p className="text-lg font-bold text-white">
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.lexicalResource
                        }
                      </p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <h5 className="text-xs font-medium text-gray-300 mb-1">
                        Grammar
                      </h5>
                      <p className="text-lg font-bold text-white">
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.grammaticalRange
                        }
                      </p>
                    </div>
                  </div>

                  {/* Extracted Text */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-white mb-3">
                      📄 Extracted Text
                    </h5>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                      <p className="text-gray-300 leading-relaxed">
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.extractedText
                        }
                      </p>
                      <div className="mt-3 text-sm text-gray-400">
                        Word Count:{" "}
                        {
                          getUploadedAnswer(selectedQuestion)?.evaluation
                            ?.wordCount
                        }{" "}
                        words
                      </div>
                    </div>
                  </div>

                  {/* Spelling Errors */}
                  {(getUploadedAnswer(selectedQuestion)?.evaluation
                    ?.spellingErrors?.length || 0) > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-3">
                        🔤 Spelling Errors
                      </h5>
                      <div className="space-y-2">
                        {getUploadedAnswer(
                          selectedQuestion
                        )?.evaluation?.spellingErrors.map((error, index) => (
                          <div
                            key={index}
                            className="bg-red-900 border border-red-600 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-red-300 font-medium">
                                  &ldquo;{error.word}&rdquo;
                                </span>
                                <span className="text-gray-400 mx-2">→</span>
                                <span className="text-green-300 font-medium">
                                  &ldquo;{error.suggestion}&rdquo;
                                </span>
                              </div>
                              <span className="text-xs text-red-400">
                                Misspelled
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grammar Errors */}
                  {(getUploadedAnswer(selectedQuestion)?.evaluation
                    ?.grammarErrors?.length || 0) > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-white mb-3">
                        📝 Grammar Issues
                      </h5>
                      <div className="space-y-2">
                        {getUploadedAnswer(
                          selectedQuestion
                        )?.evaluation?.grammarErrors.map((error, index) => (
                          <div
                            key={index}
                            className="bg-yellow-900 border border-yellow-600 rounded-lg p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="mb-1">
                                  <span className="text-yellow-300 font-medium">
                                    &ldquo;{error.text}&rdquo;
                                  </span>
                                  <span className="text-gray-400 mx-2">→</span>
                                  <span className="text-green-300 font-medium">
                                    &ldquo;{error.correction}&rdquo;
                                  </span>
                                </div>
                                <div className="text-xs text-yellow-400">
                                  Rule: {error.rule}
                                </div>
                              </div>
                              <span className="text-xs text-yellow-400 ml-2">
                                Grammar
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-blue-300 mb-2">
                      💬 Examiner Feedback
                    </h5>
                    <p className="text-blue-200 leading-relaxed">
                      {
                        getUploadedAnswer(selectedQuestion)?.evaluation
                          ?.feedback
                      }
                    </p>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">
                      Processing upload...
                    </span>
                    <span className="text-sm text-gray-300">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📋</span>
              <h2 className="text-xl font-bold text-white">
                Uploaded Answers Summary
              </h2>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {uploadedAnswers.length} answer{uploadedAnswers.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedAnswers.map((answer) => {
                const question = allWritingQuestions.find(
                  (q) => q.id === answer.questionId
                );
                return (
                  <div
                    key={answer.questionId}
                    className="border border-gray-600 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => handleQuestionSelect(answer.questionId)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xl">
                        {getQuestionIcon(question?.type || "")}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm line-clamp-1">
                          {question?.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {answer.uploadTime}
                        </p>
                      </div>
                      {getStatusBadge(answer.status)}
                    </div>
                    <div className="relative">
                      <img
                        src={answer.imageUrl}
                        alt="Answer preview"
                        className="w-full h-20 object-cover rounded border border-gray-600"
                      />
                      {answer.evaluation && (
                        <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Score: {answer.evaluation.overallScore}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs text-blue-400 hover:text-blue-300">
                        Click to view details
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <FloatingChatbot />
    </div>
  );
}

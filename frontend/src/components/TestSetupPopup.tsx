"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TestSetupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  testType: "reading" | "listening" | "speaking" | "writing";
}

export default function TestSetupPopup({
  isOpen,
  onClose,
  testType,
}: TestSetupPopupProps) {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const testTypeConfig = {
    reading: {
      title: "Reading Test Setup",
      icon: "📚",
      placeholder:
        "e.g., Give me reading questions following pattern of 2020 questions",
      examples: [
        "Give me reading questions following pattern of 2020 questions",
        "Create a test about environmental science with academic-level vocabulary",
        "Generate questions similar to Cambridge IELTS 15 format",
        "Focus on climate change topics with multiple choice questions",
      ],
      route: "/reading",
    },
    listening: {
      title: "Listening Test Setup",
      icon: "🎧",
      placeholder:
        "e.g., Create listening exercises with conversation and lecture formats",
      examples: [
        "Create listening exercises with conversation and lecture formats",
        "Generate IELTS listening test similar to 2021 exam pattern",
        "Focus on academic listening with note-taking exercises",
        "Include phone conversations and university lecture topics",
      ],
      route: "/listening",
    },
    speaking: {
      title: "Speaking Test Setup",
      icon: "🎤",
      placeholder:
        "e.g., Practice speaking test with personal and academic topics",
      examples: [
        "Practice speaking test with personal and academic topics",
        "Generate Part 2 cue cards about travel and culture",
        "Focus on Part 3 discussion questions about technology",
        "Create speaking prompts following IELTS band descriptors",
      ],
      route: "/speaking",
    },
    writing: {
      title: "Writing Test Setup",
      icon: "✍️",
      placeholder:
        "e.g., Generate Task 1 and Task 2 following 2020 exam patterns",
      examples: [
        "Generate Task 1 and Task 2 following 2020 exam patterns",
        "Create academic writing tasks about social issues",
        "Focus on graph description and argumentative essays",
        "Include letter writing and opinion essay topics",
      ],
      route: "/writing",
    },
  };

  const config = testTypeConfig[testType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      setIsGenerating(true);

      // Simulate loading and then navigate to test page
      setTimeout(() => {
        // Store the user input for the test page to use (mock data)
        localStorage.setItem(`${testType}TestPrompt`, userInput);
        router.push(config.route);
        setIsGenerating(false);
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setUserInput("");
    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.icon}</span>
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="text-gray-400 hover:text-white transition-colors disabled:cursor-not-allowed"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Customize your {testType} test experience by providing specific
            requirements or preferences.
          </p>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <p className="text-blue-400 font-medium mb-2">
              💡 Example prompts:
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              {config.examples.map((example, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>&quot;{example}&quot;</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="testPrompt"
              className="block text-lg font-medium text-white mb-3"
            >
              Describe your {testType} test preferences:
            </label>
            <textarea
              id="testPrompt"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={config.placeholder}
              className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!userInput.trim() || isGenerating}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Test...</span>
                </div>
              ) : (
                "Generate Questions"
              )}
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {config.icon} Your customized {testType} test will be generated
            based on your preferences
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TestSetupPopup from "../../components/TestSetupPopup";
import FloatingChatbot from "../../components/FloatingChatbot";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showBandScores, setShowBandScores] = useState(false);
  const [activeTestType, setActiveTestType] = useState<
    "reading" | "listening" | "speaking" | "writing" | null
  >(null);
  const router = useRouter();

  // Mock band scores data
  const mockBandScores = [
    {
      id: 1,
      date: "2024-09-20",
      testType: "Full Practice Test",
      listening: 7.5,
      reading: 8.0,
      writing: 6.5,
      speaking: 7.0,
      overall: 7.25
    },
    {
      id: 2,
      date: "2024-09-15",
      testType: "Academic Practice",
      listening: 8.0,
      reading: 7.5,
      writing: 7.0,
      speaking: 7.5,
      overall: 7.5
    },
    {
      id: 3,
      date: "2024-09-10",
      testType: "General Training",
      listening: 6.5,
      reading: 7.0,
      writing: 6.0,
      speaking: 6.5,
      overall: 6.5
    },
    {
      id: 4,
      date: "2024-09-05",
      testType: "Mock Test 1",
      listening: 7.0,
      reading: 7.5,
      writing: 6.5,
      speaking: 6.0,
      overall: 6.75
    },
    {
      id: 5,
      date: "2024-08-30",
      testType: "Practice Session",
      listening: 6.0,
      reading: 6.5,
      writing: 5.5,
      speaking: 6.0,
      overall: 6.0
    }
  ];

  // Calculate overall band score (average of all tests)
  const overallBandScore = mockBandScores.reduce((sum, test) => sum + test.overall, 0) / mockBandScores.length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Smart IELTS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome back, {currentUser?.name}!
              </span>
              <button
                onClick={() => setShowBandScores(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Band Scores</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-300">Choose your IELTS practice section</p>
        </div>

        {/* Practice Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => {
              setActiveTestType("listening");
              setShowPopup(true);
            }}
            className="group w-full text-left"
          >
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-700 hover:border-gray-600">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-800 transition-colors">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.121 10.121A3 3 0 1010.88 13.88"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Listening
              </h3>
              <p className="text-gray-300">Practice IELTS listening skills</p>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTestType("reading");
              setShowPopup(true);
            }}
            className="group w-full text-left"
          >
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-700 hover:border-gray-600">
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-800 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Reading</h3>
              <p className="text-gray-300">Improve reading comprehension</p>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTestType("writing");
              setShowPopup(true);
            }}
            className="group w-full text-left"
          >
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-700 hover:border-gray-600">
              <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-800 transition-colors">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Writing</h3>
              <p className="text-gray-300">Master essay writing skills</p>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTestType("speaking");
              setShowPopup(true);
            }}
            className="group w-full text-left"
          >
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-700 hover:border-gray-600">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-800 transition-colors">
                <svg
                  className="w-8 h-8 text-red-400"
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
              <h3 className="text-xl font-semibold text-white mb-2">
                Speaking
              </h3>
              <p className="text-gray-300">Practice speaking exercises</p>
            </div>
          </button>
        </div>

        {/* AI Assistant Chatbot Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            AI Learning Assistant
          </h3>
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg shadow-lg p-8 border border-indigo-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-indigo-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-indigo-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    IELTS SmythOs Agent to Learn
                  </h4>
                  <p className="text-indigo-200 text-lg">
                    Get instant answers to your IELTS questions from our AI
                    assistant trained on comprehensive study materials
                  </p>
                  <div className="mt-3 flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      Online
                    </span>
                    <span className="text-indigo-300 text-sm">
                      📚 Powered by vectorized PDF database
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  window.open(
                    "https://cmfwa1ah7ycfcjxgthiwbjwr9.agent.pa.smyth.ai/chatBot",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Start Chat</span>
              </button>
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-600/50">
                <h5 className="font-semibold text-indigo-200 mb-2">
                  📖 Study Materials
                </h5>
                <p className="text-indigo-300 text-sm">
                  Ask about IELTS strategies, tips, and preparation methods
                </p>
              </div>
              <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-600/50">
                <h5 className="font-semibold text-indigo-200 mb-2">
                  ❓ Question Help
                </h5>
                <p className="text-indigo-300 text-sm">
                  Get explanations for practice questions and sample answers
                </p>
              </div>
              <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-600/50">
                <h5 className="font-semibold text-indigo-200 mb-2">
                  🎯 Exam Tips
                </h5>
                <p className="text-indigo-300 text-sm">
                  Learn test-taking strategies and time management techniques
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analytics Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            Performance Overview
          </h3>

          {/* Skills Performance Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Listening</h4>
                <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">78%</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">+5% from last week</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Reading</h4>
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">85%</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">+8% from last week</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Writing</h4>
                <div className="w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">72%</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-400 h-2 rounded-full"
                  style={{ width: "72%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">+3% from last week</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Speaking</h4>
                <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-400"
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
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2">69%</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-400 h-2 rounded-full"
                  style={{ width: "69%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">+2% from last week</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Skills Comparison Bar Chart */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h4 className="text-xl font-semibold text-white mb-4">
                Skills Comparison
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { skill: "Listening", score: 78, color: "#10b981" },
                    { skill: "Reading", score: 85, color: "#3b82f6" },
                    { skill: "Writing", score: 72, color: "#8b5cf6" },
                    { skill: "Speaking", score: 69, color: "#ef4444" },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="skill" tick={{ fill: "#9ca3af" }} />
                  <YAxis tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Over Time Line Chart */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h4 className="text-xl font-semibold text-white mb-4">
                Progress Over Time
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    {
                      week: "Week 1",
                      Listening: 65,
                      Reading: 70,
                      Writing: 60,
                      Speaking: 58,
                    },
                    {
                      week: "Week 2",
                      Listening: 68,
                      Reading: 74,
                      Writing: 63,
                      Speaking: 61,
                    },
                    {
                      week: "Week 3",
                      Listening: 72,
                      Reading: 78,
                      Writing: 67,
                      Speaking: 64,
                    },
                    {
                      week: "Week 4",
                      Listening: 75,
                      Reading: 81,
                      Writing: 69,
                      Speaking: 67,
                    },
                    {
                      week: "Week 5",
                      Listening: 78,
                      Reading: 85,
                      Writing: 72,
                      Speaking: 69,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" tick={{ fill: "#9ca3af" }} />
                  <YAxis tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Listening"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Reading"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Writing"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Speaking"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overall Performance Radial Chart */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h4 className="text-xl font-semibold text-white mb-4">
              Overall IELTS Performance
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="80%"
                    data={[
                      { name: "Overall Score", value: 76, fill: "#3b82f6" },
                    ]}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill="#3b82f6"
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-2xl font-bold"
                    >
                      76%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 pl-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <h5 className="text-lg font-semibold text-white mb-2">
                      IELTS Band Equivalent
                    </h5>
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      6.5
                    </div>
                    <p className="text-gray-400">Competent User</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Target Band:</span>
                      <span className="text-white">7.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tests Completed:</span>
                      <span className="text-white">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Study Streak:</span>
                      <span className="text-white">15 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">
              Tests Completed
            </h4>
            <p className="text-3xl font-bold text-blue-400">12</p>
            <p className="text-sm text-gray-400">Great progress this month!</p>
          </div>

          <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">
              Average Score
            </h4>
            <p className="text-3xl font-bold text-green-400">76%</p>
            <p className="text-sm text-gray-400">Improved by 8% this week</p>
          </div>

          <div className="bg-gray-900 rounded-lg shadow p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-2">
              Study Streak
            </h4>
            <p className="text-3xl font-bold text-purple-400">15</p>
            <p className="text-sm text-gray-400">Days - Amazing consistency!</p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg shadow-lg p-8 border border-yellow-700 text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                🚀 Up Coming Soon !!!
              </h3>
              <div className="space-y-2 mb-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  GRE!! GMAT!!
                </div>
                <p className="text-yellow-200 text-lg">
                  Expanding our platform to help you excel in more standardized
                  tests
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-yellow-800/50 rounded-lg p-4 border border-yellow-600/50">
                  <h4 className="font-bold text-yellow-200 mb-2">
                    📚 GRE Prep
                  </h4>
                  <p className="text-yellow-300 text-sm">
                    Complete Graduate Record Examination preparation with
                    AI-powered practice tests
                  </p>
                </div>
                <div className="bg-yellow-800/50 rounded-lg p-4 border border-yellow-600/50">
                  <h4 className="font-bold text-yellow-200 mb-2">
                    💼 GMAT Prep
                  </h4>
                  <p className="text-yellow-300 text-sm">
                    Master the Graduate Management Admission Test with
                    comprehensive study materials
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-700 text-yellow-200">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                  Platform Extensibility Showcase
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            Start Practice Test
          </button>
        </div>
      </main>

      {/* Test Setup Popup */}
      {/* Band Scores Modal */}
      {showBandScores && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Band Score History</h2>
              <button
                onClick={() => setShowBandScores(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Overall Band Score */}
            <div className="p-6 border-b border-gray-700">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Overall Band Score</h3>
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full mb-4">
                  <span className="text-3xl font-bold text-white">{overallBandScore.toFixed(1)}</span>
                </div>
                <p className="text-gray-400">
                  Based on {mockBandScores.length} completed tests
                </p>
              </div>
            </div>

            {/* Test History */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Test History</h3>
              <div className="space-y-4">
                {mockBandScores.map((test) => (
                  <div key={test.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-medium">{test.testType}</h4>
                        <p className="text-gray-400 text-sm">{new Date(test.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-400 mb-1">{test.overall}</div>
                        <div className="text-gray-400 text-sm">Overall</div>
                      </div>
                    </div>
                    
                    {/* Individual Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">{test.listening}</div>
                        <div className="text-gray-400 text-sm">Listening</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">{test.reading}</div>
                        <div className="text-gray-400 text-sm">Reading</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">{test.writing}</div>
                        <div className="text-gray-400 text-sm">Writing</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white">{test.speaking}</div>
                        <div className="text-gray-400 text-sm">Speaking</div>
                      </div>
                    </div>

                    {/* Band Level Indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Band Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          test.overall >= 8.5 ? 'bg-green-900 text-green-300' :
                          test.overall >= 7.5 ? 'bg-blue-900 text-blue-300' :
                          test.overall >= 6.5 ? 'bg-yellow-900 text-yellow-300' :
                          test.overall >= 5.5 ? 'bg-orange-900 text-orange-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {test.overall >= 8.5 ? 'Expert User' :
                           test.overall >= 7.5 ? 'Very Good User' :
                           test.overall >= 6.5 ? 'Good User' :
                           test.overall >= 5.5 ? 'Modest User' :
                           'Limited User'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-800 rounded-b-xl">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">
                  Band scores range from 0-9, with 9 being the highest level of English proficiency.
                </p>
                <button
                  onClick={() => setShowBandScores(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && activeTestType && (
        <TestSetupPopup
          isOpen={showPopup}
          onClose={() => {
            setShowPopup(false);
            setActiveTestType(null);
          }}
          testType={activeTestType}
        />
      )}

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}

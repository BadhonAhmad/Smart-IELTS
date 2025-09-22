"use client";

import Link from "next/link";

export default function Dashboard() {
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
              <span className="text-sm text-gray-300">Welcome back!</span>
              <Link
                href="/"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign Out
              </Link>
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
          <Link href="/listening" className="group">
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
          </Link>

          <Link href="/reading" className="group">
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
              <h3 className="text-xl font-semibold text-white mb-2">
                Reading
              </h3>
              <p className="text-gray-300">Improve reading comprehension</p>
            </div>
          </Link>

          <Link href="/writing" className="group">
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
              <h3 className="text-xl font-semibold text-white mb-2">
                Writing
              </h3>
              <p className="text-gray-300">Master essay writing skills</p>
            </div>
          </Link>

          <div className="bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-700 hover:border-gray-600">
            <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-red-800 transition-colors">
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
        </div>

        {/* MCP Question Bank Management */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            🤖 AI Question Bank Management
          </h3>
          <Link href="/question-bank" className="group">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">
                      Question Bank Management
                    </h4>
                    <p className="text-indigo-100">
                      Upload PDFs to train AI with IELTS question patterns
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-indigo-200">MCP Server</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-indigo-200">
                  AI learns question patterns from your uploaded PDFs
                </div>
                <div className="text-sm font-semibold">Click to manage →</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Tests Completed
            </h4>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600">
              Start your first practice test
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Average Score
            </h4>
            <p className="text-3xl font-bold text-green-600">-</p>
            <p className="text-sm text-gray-600">
              Complete tests to see your progress
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Study Streak
            </h4>
            <p className="text-3xl font-bold text-purple-600">1</p>
            <p className="text-sm text-gray-600">Day - Keep it up!</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            Start Practice Test
          </button>
        </div>
      </main>
    </div>
  );
}

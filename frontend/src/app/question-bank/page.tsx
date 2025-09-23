"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingChatbot from "../../components/FloatingChatbot";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "processing" | "completed" | "error";
  questionsExtracted: number;
  section: string;
}

export default function QuestionBank() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "IELTS_Listening_2023_Practice.pdf",
      size: "2.4 MB",
      uploadDate: "2024-03-15",
      status: "completed",
      questionsExtracted: 45,
      section: "Listening",
    },
    {
      id: "2",
      name: "Reading_Comprehension_Samples.pdf",
      size: "5.1 MB",
      uploadDate: "2024-03-14",
      status: "completed",
      questionsExtracted: 78,
      section: "Reading",
    },
    {
      id: "3",
      name: "Writing_Task_Examples.pdf",
      size: "1.8 MB",
      uploadDate: "2024-03-13",
      status: "processing",
      questionsExtracted: 12,
      section: "Writing",
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);

          // Add new file to the list
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split("T")[0],
            status: "processing",
            questionsExtracted: 0,
            section: "Auto-detected",
          };

          setUploadedFiles((prev) => [newFile, ...prev]);

          // Simulate processing completion after 3 seconds
          setTimeout(() => {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === newFile.id
                  ? {
                      ...f,
                      status: "completed" as const,
                      questionsExtracted: Math.floor(Math.random() * 50) + 20,
                    }
                  : f
              )
            );
          }, 3000);

          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-green-500">✓</span>;
      case "processing":
        return <span className="text-yellow-500">⏳</span>;
      case "error":
        return <span className="text-red-500">✗</span>;
      default:
        return null;
    }
  };

  const totalQuestions = uploadedFiles.reduce(
    (sum, file) =>
      file.status === "completed" ? sum + file.questionsExtracted : sum,
    0
  );

  const sectionStats = uploadedFiles.reduce((acc, file) => {
    if (file.status === "completed") {
      acc[file.section] = (acc[file.section] || 0) + file.questionsExtracted;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Question Bank Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">MCP Server Status: </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Total Questions
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
            <p className="text-sm text-gray-600">Learned from PDFs</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              PDF Files
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {uploadedFiles.length}
            </p>
            <p className="text-sm text-gray-600">Successfully processed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Sections Covered
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {Object.keys(sectionStats).length}
            </p>
            <p className="text-sm text-gray-600">IELTS sections</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Learning Status
            </h3>
            <p className="text-3xl font-bold text-orange-600">Active</p>
            <p className="text-sm text-gray-600">AI is continuously learning</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upload IELTS Question PDFs
          </h2>
          <p className="text-gray-600 mb-6">
            Upload PDF files containing IELTS questions. Our MCP server will
            automatically extract question patterns, analyze difficulty levels,
            and categorize by sections to improve the AI&apos;s understanding.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
              disabled={isUploading}
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="text-4xl text-gray-400 mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isUploading ? "Processing..." : "Upload PDF Files"}
              </h3>
              <p className="text-gray-600">
                Click to select or drag and drop PDF files here
              </p>
            </label>
          </div>

          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">
                  Uploading and analyzing...
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

        {/* Pattern Analysis Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Learned Question Patterns
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(sectionStats).map(([section, count]) => (
              <div key={section} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800">{section}</h4>
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600">questions patterns</p>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Files List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Uploaded Files
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Questions Extracted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {file.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.questionsExtracted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <span className="capitalize">{file.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MCP Server Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🤖 MCP Server Intelligence
          </h3>
          <p className="text-blue-800">
            The Model Context Protocol (MCP) server is actively learning from
            your uploaded PDFs to understand IELTS question patterns, difficulty
            variations, and sectional requirements. This knowledge enhances the
            AI&apos;s ability to generate relevant practice questions and
            provide accurate assessments.
          </p>
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
}

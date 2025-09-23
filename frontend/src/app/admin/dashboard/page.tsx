"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "processing" | "completed" | "error";
  questionsExtracted: number;
  section: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "questions">("users");
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setCurrentUser(user);
    fetchUsers();
    fetchUploadedFiles();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.data.users);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/auth/users/${userId}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update the user in the list
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, isActive: !user.isActive } : user
          )
        );
      } else {
        setError(data.message || "Failed to toggle user status");
      }
    } catch (error) {
      console.error("Toggle user status error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload only PDF files");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("section", "general");

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/questions/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Add new file to the list
        const newFile: UploadedFile = {
          id: data.data.file._id,
          name: data.data.file.originalName,
          size: (data.data.file.size / (1024 * 1024)).toFixed(2) + " MB",
          uploadDate: new Date(data.data.file.createdAt)
            .toISOString()
            .split("T")[0],
          status: data.data.file.status as "processing" | "completed" | "error",
          questionsExtracted: data.data.file.questionsExtracted,
          section: data.data.file.section,
        };

        setUploadedFiles((prev) => [newFile, ...prev]);
        setUploadProgress(100);

        // Refresh the files list after upload
        setTimeout(() => {
          fetchUploadedFiles();
        }, 1000);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/questions/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const files = data.data.files.map((file: any) => ({
          id: file._id,
          name: file.originalName,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          uploadDate: new Date(file.createdAt).toISOString().split("T")[0],
          status: file.status,
          questionsExtracted: file.questionsExtracted,
          section: file.section,
        }));
        setUploadedFiles(files);
      }
    } catch (error) {
      console.error("Fetch files error:", error);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/questions/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete file");
      }
    } catch (error) {
      console.error("Delete file error:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                Smart IELTS - Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300"
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "questions"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300"
              }`}
            >
              Question Bank Management
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">User Management</h2>
              <p className="text-gray-400">Manage all users in the system</p>
            </div>

            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-700">
                {users.map((user) => (
                  <li key={user._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-400">
                          <span>
                            Joined:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          {user.lastLogin && (
                            <span className="ml-4">
                              Last login:{" "}
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            user.isActive
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Question Bank Management Tab */}
        {activeTab === "questions" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Question Bank Management
              </h2>
              <p className="text-gray-400">
                Upload and manage IELTS question PDFs
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Upload New PDF
              </h3>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />

                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? "Uploading..." : "Choose PDF File"}
                </label>

                <p className="mt-2 text-sm text-gray-400">
                  Upload IELTS question papers, practice tests, and study
                  materials
                </p>

                {isUploading && (
                  <div className="mt-4">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Files List */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  Uploaded Files
                </h3>
              </div>

              <div className="divide-y divide-gray-700">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-8 w-8 text-red-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-400">
                                {file.size}
                              </span>
                              <span className="text-xs text-gray-400">
                                {file.uploadDate}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  file.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : file.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {file.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                          <span>Section: {file.section}</span>
                          <span>Questions: {file.questionsExtracted}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {uploadedFiles.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-400">No files uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

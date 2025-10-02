/**
 * IELTS Study Materials Manager Component
 * Integrates with SmythOS agent for document management and Google Drive
 */

"use client";

import { useState, useEffect } from "react";
import { agentService, type Document, type DriveFile } from "@/lib/agentService";

interface StudyMaterialsManagerProps {
  subject?: 'reading' | 'writing' | 'listening' | 'speaking';
  className?: string;
}

export default function StudyMaterialsManager({ 
  subject, 
  className = "" 
}: StudyMaterialsManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'drive'>('local');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    loadMaterials();
  }, [subject]);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      // Load local documents
      if (subject) {
        const materialsResponse = await agentService.getIELTSMaterials(subject);
        if (materialsResponse.success && materialsResponse.data) {
          setDocuments(materialsResponse.data);
        }
      } else {
        const documentsResponse = await agentService.listDocuments();
        if (documentsResponse.success && documentsResponse.data) {
          setDocuments(documentsResponse.data);
        }
      }

      // Load Google Drive files
      const driveResponse = await agentService.listDrivePdfs(subject);
      if (driveResponse.success && driveResponse.data) {
        setDriveFiles(driveResponse.data);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const searchResponse = await agentService.searchDocuments(
        subject ? `${subject} ${searchQuery}` : searchQuery
      );
      
      if (searchResponse.success && searchResponse.data) {
        const searchResults: Document[] = searchResponse.data.results.map((result, index) => ({
          id: `search-${index}`,
          name: result.document,
          path: result.document,
          size: 0,
          indexed: true,
          lastModified: new Date().toISOString(),
        }));
        setDocuments(searchResults);
      }
    } catch (error) {
      console.error('Error searching materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileToggle = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleEmailMaterials = async () => {
    if (selectedFiles.length === 0) return;

    const email = prompt("Enter recipient email address:");
    if (!email) return;

    const selectedMaterials = documents
      .filter(doc => selectedFiles.includes(doc.id))
      .map(doc => doc.name);

    try {
      const response = await agentService.shareStudyMaterials(
        selectedMaterials,
        [email],
        `IELTS ${subject || 'Study'} Materials`
      );

      if (response.success) {
        alert("Study materials sent successfully!");
        setSelectedFiles([]);
      } else {
        alert("Failed to send materials. Please try again.");
      }
    } catch (error) {
      console.error('Error sending materials:', error);
      alert("Error sending materials. Please check your connection.");
    }
  };

  const handleBackupToDrive = async (document: Document) => {
    try {
      const response = await agentService.storePdfToDrive(
        `Backup of ${document.name}`,
        document.name,
        {
          subject: subject || 'general',
          originalPath: document.path,
          backupDate: new Date().toISOString(),
        }
      );

      if (response.success) {
        alert("Document backed up to Google Drive successfully!");
        loadMaterials(); // Refresh the drive files list
      } else {
        alert("Failed to backup document. Please try again.");
      }
    } catch (error) {
      console.error('Error backing up document:', error);
      alert("Error backing up document. Please check your connection.");
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDriveFiles = driveFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            IELTS {subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'Study'} Materials
          </h2>
          <p className="text-gray-600 mt-1">
            Powered by SmythOS Agent • {documents.length + driveFiles.length} materials available
          </p>
        </div>
        
        <div className="flex space-x-2">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleEmailMaterials}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email ({selectedFiles.length})</span>
            </button>
          )}
          
          <button
            onClick={loadMaterials}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search materials..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'local'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📚 Local Documents ({filteredDocuments.length})
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'drive'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          ☁️ Google Drive ({filteredDriveFiles.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading materials...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {activeTab === 'local' ? (
            filteredDocuments.length > 0 ? (
              filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
                    selectedFiles.includes(document.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(document.id)}
                        onChange={() => handleFileToggle(document.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{document.name}</h3>
                        <p className="text-sm text-gray-600">
                          {document.indexed ? '✅ Indexed' : '⏳ Not indexed'} • 
                          Last modified: {new Date(document.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBackupToDrive(document)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        title="Backup to Google Drive"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No local documents found</p>
                <p className="text-sm mt-1">Try adjusting your search or check your document index</p>
              </div>
            )
          ) : (
            filteredDriveFiles.length > 0 ? (
              filteredDriveFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{file.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB • 
                        Modified: {new Date(file.modifiedTime).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        title="View in Google Drive"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <a
                        href={file.downloadUrl}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <p>No Google Drive files found</p>
                <p className="text-sm mt-1">Upload some documents to see them here</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
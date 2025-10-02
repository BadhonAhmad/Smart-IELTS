/**
 * SmythOS Agent Dashboard Component
 * Provides real-time monitoring and control of the SmythOS agent
 */

"use client";

import { useState, useEffect } from "react";
import { agentService } from "@/lib/agentService";

interface AgentStatus {
  health: 'online' | 'offline' | 'checking';
  uptime?: number;
  skills: string[];
  lastCheck: Date;
}

interface AgentDashboardProps {
  className?: string;
}

export default function AgentDashboard({ className = "" }: AgentDashboardProps) {
  const [status, setStatus] = useState<AgentStatus>({
    health: 'checking',
    skills: [],
    lastCheck: new Date()
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    skill: string;
    status: 'success' | 'error' | 'testing';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    checkAgentStatus();
    const interval = setInterval(checkAgentStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAgentStatus = async () => {
    try {
      // Check health
      const healthResponse = await agentService.checkHealth();
      
      // Get available skills
      const skillsResponse = await agentService.listSkills();
      
      setStatus({
        health: healthResponse.success ? 'online' : 'offline',
        uptime: healthResponse.success ? healthResponse.data?.uptime : undefined,
        skills: skillsResponse.success ? skillsResponse.data || [] : [],
        lastCheck: new Date()
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        health: 'offline',
        lastCheck: new Date()
      }));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkAgentStatus();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const testSkill = async (skillName: string) => {
    const testId = Date.now().toString();
    
    // Add testing status
    setTestResults(prev => [...prev, {
      skill: skillName,
      status: 'testing',
      message: 'Testing...',
      timestamp: new Date()
    }]);

    try {
      let result: { success: boolean; message: string };

      switch (skillName) {
        case 'lookup_document':
          const docResponse = await agentService.lookupDocument("test IELTS question");
          result = {
            success: docResponse.success,
            message: docResponse.success ? 'Document lookup working' : docResponse.error || 'Failed'
          };
          break;

        case 'search_documents':
          const searchResponse = await agentService.searchDocuments("IELTS");
          result = {
            success: searchResponse.success,
            message: searchResponse.success ? 'Document search working' : searchResponse.error || 'Failed'
          };
          break;

        case 'WebSearch':
          const webResponse = await agentService.webSearch("IELTS test");
          result = {
            success: webResponse.success,
            message: webResponse.success ? 'Web search working' : webResponse.error || 'Failed'
          };
          break;

        case 'list_drive_pdfs':
          const driveResponse = await agentService.listDrivePdfs();
          result = {
            success: driveResponse.success,
            message: driveResponse.success ? 'Google Drive access working' : driveResponse.error || 'Failed'
          };
          break;

        case 'list_documents':
          const listResponse = await agentService.listDocuments();
          result = {
            success: listResponse.success,
            message: listResponse.success ? `Found ${listResponse.data?.length || 0} documents` : listResponse.error || 'Failed'
          };
          break;

        default:
          result = {
            success: false,
            message: 'Unknown skill'
          };
      }

      // Update test result
      setTestResults(prev => prev.map(test => 
        test.skill === skillName && test.status === 'testing'
          ? {
              ...test,
              status: result.success ? 'success' : 'error',
              message: result.message,
              timestamp: new Date()
            }
          : test
      ));

    } catch (error) {
      setTestResults(prev => prev.map(test => 
        test.skill === skillName && test.status === 'testing'
          ? {
              ...test,
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date()
            }
          : test
      ));
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const getHealthColor = () => {
    switch (status.health) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'checking': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = () => {
    switch (status.health) {
      case 'online': return '✅';
      case 'offline': return '❌';
      case 'checking': return '🔄';
      default: return '❓';
    }
  };

  const skillCategories = {
    'Document Intelligence': ['lookup_document', 'search_documents', 'get_document_info', 'list_documents', 'index_document'],
    'Google Drive': ['store_pdf_to_drive', 'list_drive_pdfs'],
    'Communication': ['send_email'],
    'Web Research': ['WebSearch'],
    'System': ['health']
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">SmythOS Agent Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor and test your SmythOS agent capabilities</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <svg 
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-4 rounded-lg ${getHealthColor()}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getHealthIcon()}</span>
            <div>
              <h3 className="font-semibold">Agent Health</h3>
              <p className="text-sm opacity-75">
                {status.health.charAt(0).toUpperCase() + status.health.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🛠️</span>
            <div>
              <h3 className="font-semibold">Available Skills</h3>
              <p className="text-sm opacity-75">{status.skills.length} skills loaded</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <h3 className="font-semibold">Last Check</h3>
              <p className="text-sm opacity-75">
                {status.lastCheck.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Testing */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Skill Testing</h3>
          {testResults.length > 0 && (
            <button
              onClick={clearTestResults}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Results
            </button>
          )}
        </div>

        <div className="space-y-6">
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.filter(skill => status.skills.includes(skill) || skill === 'health').map(skill => {
                  const testResult = testResults.find(t => t.skill === skill && t.status !== 'testing');
                  const isTesting = testResults.find(t => t.skill === skill && t.status === 'testing');
                  
                  return (
                    <button
                      key={skill}
                      onClick={() => testSkill(skill)}
                      disabled={!!isTesting}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        testResult
                          ? testResult.status === 'success'
                            ? 'border-green-300 bg-green-50'
                            : 'border-red-300 bg-red-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      } ${isTesting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-800">
                            {skill.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          {testResult && (
                            <div className={`text-xs mt-1 ${
                              testResult.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {testResult.message}
                            </div>
                          )}
                          {isTesting && (
                            <div className="text-xs mt-1 text-yellow-600">Testing...</div>
                          )}
                        </div>
                        
                        <div className="ml-2">
                          {isTesting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : testResult ? (
                            testResult.status === 'success' ? (
                              <span className="text-green-600">✅</span>
                            ) : (
                              <span className="text-red-600">❌</span>
                            )
                          ) : (
                            <span className="text-gray-400">▶️</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results Log */}
      {testResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results Log</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            {testResults.slice().reverse().map((result, index) => (
              <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-200 last:border-b-0">
                <span className={`text-sm ${
                  result.status === 'success' ? 'text-green-600' :
                  result.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {result.status === 'success' ? '✅' : 
                   result.status === 'error' ? '❌' : '🔄'}
                </span>
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-1">
                  {result.skill}
                </span>
                <span className="text-sm text-gray-600 truncate">
                  {result.message}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Agent Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${getHealthColor()}`}>
              {status.health.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Skills Count:</span>
            <span className="ml-2 text-gray-600">{status.skills.length}</span>
          </div>
          {status.uptime && (
            <div>
              <span className="font-medium text-gray-700">Uptime:</span>
              <span className="ml-2 text-gray-600">{Math.round(status.uptime / 1000)}s</span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">Last Update:</span>
            <span className="ml-2 text-gray-600">{status.lastCheck.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
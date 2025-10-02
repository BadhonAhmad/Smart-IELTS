"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "@/utils/api";

export default function ApiTest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setResult("");
    
    try {
      console.log('🧪 Testing API connection...');
      console.log('📍 API URL:', API_ENDPOINTS.AUTH.SIGNUP);
      console.log('📍 Environment API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test" + Date.now() + "@example.com",
          password: "Test123!",
          role: "student"
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      setResult(`Success! Status: ${response.status}, Data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('❌ API Test Error:', error);
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testBasicEndpoint = async () => {
    setLoading(true);
    setResult("");
    
    try {
      console.log('🧪 Testing basic API endpoint...');
      
      const response = await fetch('http://localhost:5000/api', {
        method: 'GET',
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);
      
      setResult(`Basic API Success! Status: ${response.status}, Data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('❌ Basic API Test Error:', error);
      setResult(`Basic API Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testServerSideAPI = async () => {
    setLoading(true);
    setResult("");
    
    try {
      console.log('🧪 Testing server-side API connection...');
      
      const response = await fetch('/api/test-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Server Test User",
          email: "servertest" + Date.now() + "@example.com",
          password: "Test123!",
          role: "student"
        }),
      });

      console.log('📡 Server-side response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Server-side response data:', data);
      
      setResult(`Server-side Success! Status: ${response.status}, Data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('❌ Server-side API Test Error:', error);
      setResult(`Server-side Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
      
      <div className="space-y-4 mb-8">
        <div>
          <strong>API URL:</strong> {API_ENDPOINTS.AUTH.SIGNUP}
        </div>
        <div>
          <strong>Environment API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'undefined'}
        </div>
      </div>

      <div className="space-x-4 mb-8">
        <button
          onClick={testBasicEndpoint}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Basic API"}
        </button>
        
        <button
          onClick={testApiConnection}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Signup API"}
        </button>
        
        <button
          onClick={testServerSideAPI}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Server-side API"}
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Result:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result || "No test run yet"}</pre>
      </div>
    </div>
  );
}
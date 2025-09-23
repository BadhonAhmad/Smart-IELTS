// Test script for Gemini AI API endpoints
const test_endpoints = async () => {
  const baseUrl = 'http://localhost:4000/api';
  
  console.log('🧪 Testing Gemini AI API Endpoints...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing Gemini Test Endpoint...');
    const testResponse = await fetch(`${baseUrl}/gemini/test`);
    const testData = await testResponse.json();
    console.log('✅ Test Response:', JSON.stringify(testData, null, 2));
  } catch (error) {
    console.log('❌ Test Error:', error.message);
  }

  // Test 2: Generate MCQ questions
  try {
    console.log('\n2. Testing MCQ Generation...');
    const mcqResponse = await fetch(`${baseUrl}/gemini/generate-mcq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'English Grammar',
        count: 3
      })
    });
    const mcqData = await mcqResponse.json();
    console.log('✅ MCQ Response:', JSON.stringify(mcqData, null, 2));
  } catch (error) {
    console.log('❌ MCQ Error:', error.message);
  }

  // Test 3: Generate IELTS questions
  try {
    console.log('\n3. Testing IELTS Question Generation...');
    const ieltsResponse = await fetch(`${baseUrl}/gemini/generate-ielts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skill: 'reading',
        count: 2
      })
    });
    const ieltsData = await ieltsResponse.json();
    console.log('✅ IELTS Response:', JSON.stringify(ieltsData, null, 2));
  } catch (error) {
    console.log('❌ IELTS Error:', error.message);
  }
};

// Run tests
test_endpoints();
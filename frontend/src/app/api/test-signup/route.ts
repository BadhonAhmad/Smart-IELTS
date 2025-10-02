import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Route: Testing backend connection...');
    
    // Get the request body
    const body = await request.json();
    console.log('📦 Received data:', body);
    
    // Make request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const signupUrl = `${backendUrl}/auth/signup`;
    
    console.log('📍 Backend URL:', signupUrl);
    
    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('📡 Backend response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Backend response data:', data);
    
    return NextResponse.json({
      success: true,
      backendUrl: signupUrl,
      status: response.status,
      data: data
    });
    
  } catch (error) {
    console.error('❌ API Route Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      backendUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    }, { status: 500 });
  }
}
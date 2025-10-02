// API configuration for the frontend application
const API_CONFIG = {
  // Base API URL for backend services
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // SmythOS Agent API URL
  AGENT_URL: process.env.NEXT_PUBLIC_AGENT_API_URL || 'https://smart-ielts.onrender.com',
  
  // ElevenLabs API Key
  ELEVENLABS_KEY: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
    SIGNUP: `${API_CONFIG.BASE_URL}/auth/signup`,
    USERS: `${API_CONFIG.BASE_URL}/auth/users`,
    TOGGLE_USER_STATUS: (userId: string) => `${API_CONFIG.BASE_URL}/auth/users/${userId}/toggle-status`,
  },
  
  // Gemini AI endpoints
  GEMINI: {
    CHAT: `${API_CONFIG.BASE_URL}/gemini/chat`,
  },
  
  // Questions endpoints
  QUESTIONS: {
    UPLOAD: `${API_CONFIG.BASE_URL}/questions/upload`,
    FILES: `${API_CONFIG.BASE_URL}/questions/files`,
    DELETE_FILE: (fileId: string) => `${API_CONFIG.BASE_URL}/questions/files/${fileId}`,
  },
  
  // SmythOS Agent endpoints
  AGENT: {
    PROMPT: `${API_CONFIG.AGENT_URL}/api/prompt`,
    SKILLS: `${API_CONFIG.AGENT_URL}/api/agent/skills`,
    HEALTH: `${API_CONFIG.AGENT_URL}/health`,
  },
} as const;

export default API_CONFIG;
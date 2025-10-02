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
    // System Management
    HEALTH: `${API_CONFIG.AGENT_URL}/health`,
    PROMPT: `${API_CONFIG.AGENT_URL}/api/prompt`,
    SKILLS: `${API_CONFIG.AGENT_URL}/api/agent/skills`,
    EXECUTE_ALL: `${API_CONFIG.AGENT_URL}/api/agent/skills/execute-all`,
    
    // Document Intelligence Skills
    LOOKUP_DOCUMENT: `${API_CONFIG.AGENT_URL}/api/agent/skills/lookup_document`,
    SEARCH_DOCUMENTS: `${API_CONFIG.AGENT_URL}/api/agent/skills/search_documents`,
    GET_DOCUMENT_INFO: `${API_CONFIG.AGENT_URL}/api/agent/skills/get_document_info`,
    LIST_DOCUMENTS: `${API_CONFIG.AGENT_URL}/api/documents/pdfs`,
    INDEX_DOCUMENT: `${API_CONFIG.AGENT_URL}/api/agent/skills/index_document`,
    PURGE_DOCUMENTS: `${API_CONFIG.AGENT_URL}/api/agent/skills/purge_documents`,
    
    // Google Drive Integration
    STORE_PDF_TO_DRIVE: `${API_CONFIG.AGENT_URL}/api/agent/skills/store_pdf_to_drive`,
    LIST_DRIVE_PDFS: `${API_CONFIG.AGENT_URL}/api/agent/skills/list_drive_pdfs`,
    
    // Communication Skills
    SEND_EMAIL: `${API_CONFIG.AGENT_URL}/api/agent/skills/send_email`,
    
    // Web Research Skills
    WEB_SEARCH: `${API_CONFIG.AGENT_URL}/api/agent/skills/WebSearch`,
  },
} as const;

export default API_CONFIG;
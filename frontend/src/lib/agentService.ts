/**
 * SmythOS Agent Service
 * Comprehensive service layer for integrating with SmythOS agent skills
 */

import { API_ENDPOINTS } from '@/utils/api';

// Types for agent responses
export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface DocumentSearchResult {
  answer: string;
  sources: Array<{
    document: string;
    page?: number;
    relevance?: number;
  }>;
  confidence: number;
  timestamp: string;
}

export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
}

export interface WebSearchResult {
  results: Array<{
    title: string;
    url: string;
    content: string;
    relevance: number;
  }>;
  query: string;
  timestamp: string;
}

export interface DriveFile {
  id: string;
  name: string;
  size: number;
  modifiedTime: string;
  webViewLink: string;
  downloadUrl: string;
}

export interface Document {
  id: string;
  name: string;
  path: string;
  size: number;
  indexed: boolean;
  lastModified: string;
}

class AgentService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AgentResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Agent service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // System Management
  async checkHealth(): Promise<AgentResponse<{ status: string; uptime: number }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.HEALTH);
  }

  async listSkills(): Promise<AgentResponse<string[]>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.SKILLS);
  }

  // Natural Language Processing
  async sendPrompt(prompt: string, context?: string): Promise<AgentResponse<{
    answer: string;
    sources?: string[];
    confidence?: number;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.PROMPT, {
      method: 'POST',
      body: JSON.stringify({ 
        prompt,
        context: context || 'ielts-assistance'
      }),
    });
  }

  // Document Intelligence Skills
  async lookupDocument(userQuery: string): Promise<AgentResponse<DocumentSearchResult>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.LOOKUP_DOCUMENT, {
      method: 'POST',
      body: JSON.stringify({ user_query: userQuery }),
    });
  }

  async searchDocuments(query: string): Promise<AgentResponse<{
    results: Array<{
      document: string;
      content: string;
      relevance: number;
    }>;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.SEARCH_DOCUMENTS, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async getDocumentInfo(documentName: string): Promise<AgentResponse<{
    name: string;
    size: number;
    pages?: number;
    indexed: boolean;
    lastModified: string;
    metadata: Record<string, any>;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.GET_DOCUMENT_INFO, {
      method: 'POST',
      body: JSON.stringify({ document_name: documentName }),
    });
  }

  async listDocuments(): Promise<AgentResponse<Document[]>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.LIST_DOCUMENTS);
  }

  async indexDocument(documentPath: string): Promise<AgentResponse<{
    success: boolean;
    message: string;
    vectorCount?: number;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.INDEX_DOCUMENT, {
      method: 'POST',
      body: JSON.stringify({ document_path: documentPath }),
    });
  }

  async purgeDocuments(): Promise<AgentResponse<{
    success: boolean;
    message: string;
    deletedCount: number;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.PURGE_DOCUMENTS, {
      method: 'POST',
    });
  }

  // Google Drive Integration
  async storePdfToDrive(content: string, filename: string, metadata?: Record<string, any>): Promise<AgentResponse<{
    fileId: string;
    fileName: string;
    webViewLink: string;
    downloadUrl: string;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.STORE_PDF_TO_DRIVE, {
      method: 'POST',
      body: JSON.stringify({ 
        content,
        filename,
        metadata: {
          category: 'IELTS_Materials',
          uploadDate: new Date().toISOString(),
          ...metadata,
        },
      }),
    });
  }

  async listDrivePdfs(category?: string): Promise<AgentResponse<DriveFile[]>> {
    const body = category ? JSON.stringify({ category }) : undefined;
    return this.makeRequest(API_ENDPOINTS.AGENT.LIST_DRIVE_PDFS, {
      method: body ? 'POST' : 'GET',
      body,
    });
  }

  // Email Communication
  async sendEmail(emailData: EmailRequest): Promise<AgentResponse<{
    messageId: string;
    status: 'sent' | 'failed';
    timestamp: string;
  }>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.SEND_EMAIL, {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  // Web Search
  async webSearch(query: string, filters?: {
    domain?: string;
    dateRange?: string;
    region?: string;
  }): Promise<AgentResponse<WebSearchResult>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.WEB_SEARCH, {
      method: 'POST',
      body: JSON.stringify({ 
        userQuery: query,
        filters,
      }),
    });
  }

  // Specialized IELTS Methods
  async askIELTSQuestion(question: string): Promise<AgentResponse<DocumentSearchResult>> {
    const context = `IELTS preparation question: ${question}`;
    const response = await this.lookupDocument(context);
    
    if (!response.success && response.error) {
      // Fallback to web search for current IELTS information
      const webResponse = await this.webSearch(`IELTS ${question}`);
      if (webResponse.success && webResponse.data) {
        return {
          success: true,
          data: {
            answer: webResponse.data.results[0]?.content || 'No information found',
            sources: webResponse.data.results.map(r => ({ document: r.url })),
            confidence: 0.7,
            timestamp: new Date().toISOString(),
          },
        };
      }
    }
    
    return response;
  }

  async getIELTSMaterials(subject: 'reading' | 'writing' | 'listening' | 'speaking'): Promise<AgentResponse<Document[]>> {
    const response = await this.searchDocuments(`IELTS ${subject} practice materials`);
    
    if (response.success && response.data) {
      const materials = response.data.results.map((result, index) => ({
        id: `${subject}-${index}`,
        name: result.document,
        path: result.document,
        size: 0,
        indexed: true,
        lastModified: new Date().toISOString(),
      }));
      
      return {
        success: true,
        data: materials,
        timestamp: new Date().toISOString(),
      };
    }
    
    return response as unknown as AgentResponse<Document[]>;
  }

  async shareStudyMaterials(
    materials: string[],
    emailAddresses: string[],
    subject: string = 'IELTS Study Materials'
  ): Promise<AgentResponse<{ messageId: string; status: string }>> {
    const body = `
Dear IELTS student,

I'm sharing some helpful study materials with you:

${materials.map((material, index) => `${index + 1}. ${material}`).join('\\n')}

These materials have been curated to help you prepare effectively for your IELTS exam.

Best regards,
Smart IELTS AI Assistant
    `.trim();

    return this.sendEmail({
      to: emailAddresses[0],
      cc: emailAddresses.slice(1).join(','),
      subject,
      body,
    });
  }

  // Batch Operations
  async executeBatchSkills(skills: Array<{
    skill: string;
    params: Record<string, any>;
  }>): Promise<AgentResponse<Array<{ skill: string; result: any; success: boolean }>>> {
    return this.makeRequest(API_ENDPOINTS.AGENT.EXECUTE_ALL, {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
  }
}

// Export singleton instance
export const agentService = new AgentService();
export default agentService;
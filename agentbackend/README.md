# Document Assistant Agent Backend

A powerful AI-powered document processing and email system built with the SmythOS SRE, featuring vector database integration, natural language processing, and RESTful API endpoints with email capabilities.

## 🚀 Features

- **Document Indexing**: Upload and index PDF documents using vector embeddings
- **Semantic Search**: Search through documents using natural language queries
- **Web Search**: Comprehensive web search capabilities using Tavily API
- **Email Integration**: Send emails via external Smyth API with full functionality
- **AI Agent Integration**: Powered by Google's Gemini AI for intelligent responses
- **Vector Database**: Pinecone integration for scalable document storage and retrieval
- **RESTful API**: Complete API for programmatic access
- **Chat Interface**: Interactive terminal chat mode
- **Production Ready**: Deployed on Render with environment configuration

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Email API](#email-api)
- [Usage Examples](#usage-examples)
- [Chat Mode](#chat-mode)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Development](#development)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Pinecone account
- Google AI API key

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agentbackend.git
   cd agentbackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # API mode (default)
   npm run start:api
   
   # Chat mode
   npm run start:chat
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here

# Google AI Configuration  
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
googleai=your_google_ai_api_key_here

# Tavily Web Search Configuration
TAVILY_API_KEY=your_tavily_api_key_here

# Server Configuration (optional)
PORT=5000
NODE_ENV=development
```

### API Keys Setup

1. **Pinecone**: Get your API key from [Pinecone Console](https://app.pinecone.io/)
2. **Google AI**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. **Tavily**: Get your API key from [Tavily API](https://tavily.com/) for web search functionality

## 🔗 API Endpoints

### Base URL
- **Local**: `http://localhost:5000`
- **Production**: `https://your-app.render.com`

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-23T07:00:00.000Z"
}
```

### List PDF Documents
```http
GET /api/documents/pdfs
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPdfs": 7,
    "pdfs": [
      {
        "name": "bitcoin.pdf",
        "path": "data/bitcoin.pdf", 
        "fullPath": "/absolute/path/to/data/bitcoin.pdf"
      },
      {
        "name": "IELTS question.pdf",
        "path": "data/IELTS question.pdf",
        "fullPath": "/absolute/path/to/data/IELTS question.pdf"
      }
    ],
    "dataDirectory": "/absolute/path/to/data",
    "timestamp": "2025-09-25T12:00:00.000Z"
  }
}
```

### List Skills
```http
GET /api/agent/skills
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "document-assistant",
    "agentName": "Document Assistant", 
    "skills": [
      {
        "name": "get_document_info",
        "description": "Get information about a document/book",
        "inputs": {
          "document_name": {
            "description": "This need to be a name of a document/book, extract it from the user query",
            "required": true
          }
        }
      },
      {
        "name": "send_email",
        "description": "Send an email to specified recipients with subject and body content",
        "inputs": {
          "to": {
            "description": "Email recipient address",
            "required": true
          },
          "subject": {
            "description": "Email subject",
            "required": false
          },
          "body": {
            "description": "Email body content",
            "required": false
          },
          "cc": {
            "description": "CC recipients",
            "required": false
          },
          "bcc": {
            "description": "BCC recipients",
            "required": false
          }
        }
      },
      {
        "name": "WebSearch",
        "description": "Use this skill to get comprehensive web search results using Tavily API",
        "inputs": {
          "userQuery": {
            "description": "The search query to get the web search results of",
            "required": true
          }
        }
      }
    ]
  }
}
```

### Execute Individual Skills

#### 1. Index Document
```http
POST /api/agent/skills/index_document
Content-Type: application/json

{
  "document_path": "data/bitcoin.pdf"
}
```

#### 2. Search Documents  
```http
POST /api/agent/skills/lookup_document
Content-Type: application/json

{
  "user_query": "What is Bitcoin?"
}
```

#### 3. Get Document Info
```http
POST /api/agent/skills/get_document_info
Content-Type: application/json

{
  "document_name": "Bitcoin"
}
```

#### 4. Send Email
```http
POST /api/agent/skills/send_email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Hello from Agent",
  "body": "This is a test email sent via the agent's email skill."
}
```

#### 5. Web Search
```http
POST /api/agent/skills/WebSearch
Content-Type: application/json

{
  "userQuery": "where is dhaka?"
}
```

#### 6. Purge All Documents

**Response:**
```json
{
  "success": true,
  "data": {
    "skill": "send_email",
    "parameters": {
      "to": "recipient@example.com",
      "subject": "Hello from Agent", 
      "body": "This is a test email sent via the agent's email skill."
    },
    "result": {
      "success": true,
      "message": "Email sent successfully to recipient@example.com",
      "emailData": {
        "to": "recipient@example.com",
        "subject": "Hello from Agent",
        "body": "This is a test email sent via the agent's email skill."
      },
      "apiResponse": {
        "id": "M14EMAIL003",
        "name": "APIOutput",
        "result": {
          "Output": {
            "messageId": "199a01d739c1c82e",
            "threadId": "199a01d739c1c82e",
            "status": {
              "id": "199a01d739c1c82e",
              "threadId": "199a01d739c1c82e",
              "labelIds": ["SENT"]
            }
          }
        }
      },
      "timestamp": "2025-10-01T14:11:49.788Z"
    },
    "timestamp": "2025-10-01T14:11:49.789Z"
  }
}
```

#### 5. Purge All Documents
```http
POST /api/agent/skills/purge_documents
Content-Type: application/json

{
  "confirmation": "yes"
}
```

```http
POST /api/agent/skills/purge_documents
Content-Type: application/json

{
  "confirmation": "yes"
}
```

## 📧 Email API

### Send Email via Agent Skill

The email functionality is integrated as an agent skill using an external Smyth email service.

**Endpoint:**
```http
POST /api/agent/skills/send_email
```

**Parameters:**
- `to` (required): Recipient email address
- `subject` (optional): Email subject line
- `body` (optional): Email body content  
- `cc` (optional): CC recipients
- `bcc` (optional): BCC recipients

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/agent/skills/send_email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "body": "Hello from the Document Assistant Agent!",
    "cc": "manager@example.com"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "skill": "send_email",
    "result": {
      "success": true,
      "message": "Email sent successfully to user@example.com",
      "emailData": {
        "to": "user@example.com",
        "subject": "Test Email",
        "body": "Hello from the Document Assistant Agent!"
      },
      "apiResponse": {
        "messageId": "199a01d739c1c82e",
        "status": {"labelIds": ["SENT"]}
      }
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "data": {
    "skill": "send_email", 
    "result": {
      "success": false,
      "error": "Invalid email format for recipient: invalid-email",
      "timestamp": "2025-10-01T14:23:09.267Z"
    }
  }
}
```

### Natural Language Email

You can also send emails using natural language through the prompt endpoint:

```bash
curl -X POST http://localhost:5000/api/prompt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "send email to user@example.com with subject \"Meeting Reminder\" and body \"Don'\''t forget about our meeting tomorrow at 2 PM\""}'
```

### Natural Language Prompt
```http
POST /api/agent/prompt
Content-Type: application/json

{
  "message": "Index the Bitcoin whitepaper and then tell me about its main concepts"
}
```

### Execute Multiple Skills
```http
POST /api/agent/skills/execute-all
Content-Type: application/json

{
  "skillsToExecute": [
    {
      "skillName": "index_document",
      "parameters": {
        "document_path": "data/bitcoin.pdf"
      }
    },
    {
      "skillName": "lookup_document", 
      "parameters": {
        "user_query": "What is the main purpose of Bitcoin?"
      }
    }
  ]
}
```

## 📚 Usage Examples

### Curl Examples

1. **Health Check**
   ```bash
   curl http://localhost:5000/health
   ```

2. **List Available PDF Documents**
   ```bash
   curl http://localhost:5000/api/documents/pdfs | jq
   ```

3. **List Available Skills**
   ```bash
   curl http://localhost:5000/api/agent/skills | jq
   ```

4. **Index a Document**
   ```bash
   curl -X POST http://localhost:5000/api/agent/skills/index_document \
     -H "Content-Type: application/json" \
     -d '{"document_path": "data/bitcoin.pdf"}' | jq
   ```

5. **Search Documents**
   ```bash
   curl -X POST http://localhost:5000/api/agent/skills/lookup_document \
     -H "Content-Type: application/json" \
     -d '{"user_query": "What is Bitcoin?"}' | jq
   ```

6. **Send Email**
   ```bash
   curl -X POST http://localhost:5000/api/agent/skills/send_email \
     -H "Content-Type: application/json" \
     -d '{
       "to": "recipient@example.com",
       "subject": "Hello from Agent",
       "body": "This is a test email from the Document Assistant Agent!"
     }' | jq
   ```

7. **Web Search**
   ```bash
   curl -X POST http://localhost:5000/api/agent/skills/WebSearch \
     -H "Content-Type: application/json" \
     -d '{"userQuery": "where is dhaka?"}' | jq
   ```

8. **Natural Language Query**
   ```bash
   curl -X POST http://localhost:5000/api/agent/prompt \
     -H "Content-Type: application/json" \
     -d '{"message": "Search for information about blockchain technology"}' | jq
   ```

8. **Natural Language Email**
   ```bash
   curl -X POST http://localhost:5000/api/agent/prompt \
     -H "Content-Type: application/json" \
     -d '{"message": "send email to user@example.com saying hello and asking about the meeting"}' | jq
   ```

### JavaScript/Node.js Examples

```javascript
const API_BASE = 'http://localhost:5000';

// Get list of available PDFs
async function listPDFs() {
  const response = await fetch(`${API_BASE}/api/documents/pdfs`);
  return response.json();
}

// Index a document
async function indexDocument(filePath) {
  const response = await fetch(`${API_BASE}/api/agent/skills/index_document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_path: filePath })
  });
  return response.json();
}

// Search documents
async function searchDocuments(query) {
  const response = await fetch(`${API_BASE}/api/agent/skills/lookup_document`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_query: query })
  });
  return response.json();
}

// Send email
async function sendEmail(to, subject, body) {
  const response = await fetch(`${API_BASE}/api/agent/skills/send_email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body })
  });
  return response.json();
}

// Web search
async function webSearch(query) {
  const response = await fetch(`${API_BASE}/api/agent/skills/WebSearch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuery: query })
  });
  return response.json();
}

// Usage
(async () => {
  // List available PDFs
  const pdfList = await listPDFs();
  console.log('Available PDFs:', pdfList.data.pdfs);
  
  // Index first available document
  if (pdfList.data.pdfs.length > 0) {
    const indexResult = await indexDocument(pdfList.data.pdfs[0].path);
    console.log('Index Result:', indexResult);
  }
  
  // Search  
  const searchResult = await searchDocuments('What is Bitcoin?');
  console.log('Search Result:', searchResult);
  
  // Send email
  const emailResult = await sendEmail(
    'recipient@example.com',
    'Hello from Agent',
    'This is a test email from the Document Assistant!'
  );
  console.log('Email Result:', emailResult);
  
  // Web search
  const searchResult = await webSearch('where is dhaka?');
  console.log('Web Search Result:', searchResult);
})();
```

### Python Examples

```python
import requests
import json

API_BASE = 'http://localhost:5000'

def list_pdfs():
    response = requests.get(f'{API_BASE}/api/documents/pdfs')
    return response.json()

def index_document(file_path):
    response = requests.post(
        f'{API_BASE}/api/agent/skills/index_document',
        json={'document_path': file_path}
    )
    return response.json()

def search_documents(query):
    response = requests.post(
        f'{API_BASE}/api/agent/skills/lookup_document', 
        json={'user_query': query}
    )
    return response.json()

def send_email(to, subject, body):
    response = requests.post(
        f'{API_BASE}/api/agent/skills/send_email',
        json={'to': to, 'subject': subject, 'body': body}
    )
    return response.json()

def web_search(query):
    response = requests.post(
        f'{API_BASE}/api/agent/skills/WebSearch',
        json={'userQuery': query}
    )
    return response.json()

# Usage
if __name__ == '__main__':
    # List available PDFs
    pdf_list = list_pdfs()
    print('Available PDFs:', json.dumps(pdf_list['data']['pdfs'], indent=2))
    
    # Index first available document
    if pdf_list['data']['pdfs']:
        first_pdf = pdf_list['data']['pdfs'][0]['path']
        index_result = index_document(first_pdf)
        print('Index Result:', json.dumps(index_result, indent=2))
    
    # Search
    search_result = search_documents('What is Bitcoin?') 
    print('Search Result:', json.dumps(search_result, indent=2))
    
    # Send email
    email_result = send_email(
        'recipient@example.com',
        'Hello from Agent', 
        'This is a test email from the Document Assistant!'
    )
    print('Email Result:', json.dumps(email_result, indent=2))
    
    # Web search
    web_result = web_search('where is dhaka?')
    print('Web Search Result:', json.dumps(web_result, indent=2))
```

## 💬 Chat Mode

Start interactive chat mode:

```bash
npm run start:chat
```

Chat commands:
- Type natural language queries
- Use `/help` for available commands
- Use `/quit` to exit

Example chat session:
```
Document Assistant > Index the Bitcoin whitepaper
✅ Document indexed successfully!

Document Assistant > What is the main purpose of Bitcoin?
Based on the Bitcoin whitepaper, the main purpose of Bitcoin is to create a purely peer-to-peer version of electronic cash that allows online payments to be sent directly between parties without going through financial institutions...

Document Assistant > Send email to user@example.com about Bitcoin
✅ Email sent successfully to user@example.com with information about Bitcoin!
```

## 🚀 Deployment

### Render Deployment

This project is configured for deployment on [Render](https://render.com).

1. **Fork/Clone** this repository
2. **Connect** to Render
3. **Set Environment Variables** in Render dashboard:
   - `GOOGLE_AI_API_KEY`
   - `PINECONE_API_KEY`
4. **Deploy** using the included `render.yaml`

The `render.yaml` configuration includes:
- Automatic builds
- Environment setup
- Health checks
- Production optimizations

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export GOOGLE_AI_API_KEY=your_key
   export PINECONE_API_KEY=your_key
   export NODE_ENV=production
   ```

3. **Start production server**
   ```bash
   npm run start:production
   ```

## 🔧 Development

### Project Structure

```
agentbackend/
├── src/
│   ├── agents/              # AI agent definitions
│   │   └── BookAssistant.agent.ts
│   ├── api/                 # Express API server
│   │   └── server.ts
│   ├── utils/               # Utility functions
│   │   ├── SkillGate.ts
│   │   └── TerminalChat.ts
│   └── index.ts             # Main entry point
├── scripts/                 # Build and deployment scripts
├── data/                    # Sample documents
├── dist/                    # Built output
├── render.yaml              # Render deployment config
├── package.json
└── README.md
```

### Available Scripts

```bash
# Development
npm run dev              # Build and start in development
npm run dev:chat         # Start in chat mode

# Production  
npm run build            # Build TypeScript
npm run start            # Start API server
npm run start:api        # Start API server explicitly
npm run start:chat       # Start chat mode
npm run start:production # Production server with setup

# Utilities
npm run setup:production # Setup production environment
```

### Key Technologies

- **SmythOS SRE**: AI agent framework
- **Express.js**: Web server
- **Pinecone**: Vector database
- **Google AI**: Language model
- **TypeScript**: Type safety
- **Rollup**: Module bundler

## 📖 API Skills Reference

### index_document
- **Purpose**: Index PDF documents into vector database
- **Input**: `document_path` (string) - Path to PDF file
- **Output**: Success/error message with indexing status

### lookup_document  
- **Purpose**: Search indexed documents using natural language
- **Input**: `user_query` (string) - Search query
- **Output**: Relevant document content with source

### get_document_info
- **Purpose**: Get metadata about documents via OpenLibrary API
- **Input**: `document_name` (string) - Document/book name
- **Output**: Document metadata (author, year, etc.)

### purge_documents
- **Purpose**: Delete all indexed documents from vector database
- **Input**: `confirmation` (string, optional) - "yes" to confirm
- **Output**: Confirmation of deletion

### send_email
- **Purpose**: Send emails via external Smyth API integration
- **Input**: 
  - `to` (string, required) - Recipient email address
  - `subject` (string, optional) - Email subject line
  - `body` (string, optional) - Email body content
  - `cc` (string, optional) - CC recipients
  - `bcc` (string, optional) - BCC recipients
- **Output**: Success/error response with email delivery status and message ID

### WebSearch
- **Purpose**: Perform comprehensive web searches using Tavily API
- **Input**: `userQuery` (string, required) - Search query to execute
- **Output**: Structured search results with titles, URLs, content snippets, and formatted display text
- **Requirements**: TAVILY_API_KEY environment variable must be set

## 🔒 Security Notes

- API keys are stored in environment variables
- No authentication currently implemented (add as needed)
- CORS enabled for cross-origin requests
- Input validation on all endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review the example code

## 🎯 Roadmap

- [ ] Authentication system
- [ ] Multiple file format support
- [ ] Batch document processing
- [ ] Advanced search filters
- [ ] Document summarization
- [ ] Multi-language support
- [ ] WebSocket for real-time updates
- [x] Email integration via external API
- [ ] Email templates and bulk sending
- [ ] Calendar integration
- [ ] File attachment support for emails
# Smart IELTS Frontend - SmythOS Agent Integration

This frontend is fully integrated with SmythOS agent capabilities, providing a comprehensive IELTS preparation platform with AI-powered features.

## 🚀 Features

### SmythOS Agent Integration
- **Natural Language Chat**: Conversational AI interface using `/api/prompt` endpoint
- **Document Intelligence**: Smart Q&A from vectorized IELTS materials
- **Web Search**: Real-time IELTS information using Tavily API
- **Email Communication**: Send study materials via Gmail integration
- **Google Drive**: PDF backup and management with automatic organization
- **Health Monitoring**: Real-time agent status and skill testing

### Components

#### 1. FloatingChatbot (`/components/FloatingChatbot.tsx`)
Enhanced chatbot with SmythOS agent integration:
- Intelligent intent detection (document search, email, web search, drive)
- Real-time agent health monitoring
- Context-aware responses with source citations
- Confidence scoring for document-based answers
- Multi-modal response handling (text, document, web, drive)

#### 2. StudyMaterialsManager (`/components/StudyMaterialsManager.tsx`)
Complete document management system:
- Local document listing and search
- Google Drive PDF integration
- Email sharing functionality
- Subject-based filtering (Reading, Writing, Listening, Speaking)
- Backup to Google Drive with metadata

#### 3. IELTSQuestionAssistant (`/components/IELTSQuestionAssistant.tsx`)
Intelligent Q&A system:
- Smart search mode (documents + web)
- Document-only search for study materials
- Web-only search for current information
- Question history and saving
- Email Q&A results
- Example questions for each IELTS section

#### 4. AgentDashboard (`/components/AgentDashboard.tsx`)
Agent monitoring and testing:
- Real-time health status
- Skill testing for all agent capabilities
- Test results logging
- Agent information display
- Automatic health checks every 30 seconds

### API Service Layer (`/lib/agentService.ts`)
Comprehensive service layer for SmythOS agent:
- Type-safe API calls
- Error handling and retry logic
- Specialized IELTS methods
- Batch operations support
- Response caching and optimization

## 🛠️ Setup

### Environment Variables
Create `.env.local` with:
```env
NEXT_PUBLIC_AGENT_API_URL=https://smart-ielts.onrender.com
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SMYTHOS_DIRECT_URL=https://cmfwa1ah7ycfcjxgthiwbjwr9.agent.a.smyth.ai
```

### Installation
```bash
npm install
npm run dev
```

## 📊 SmythOS Agent Skills Used

### Document Intelligence
- `lookup_document` - AI-powered Q&A from vectorized documents
- `search_documents` - Semantic search across all documents
- `get_document_info` - Document metadata retrieval
- `list_documents` - Available document listing
- `index_document` - Document vectorization
- `purge_documents` - Database cleanup

### Google Drive Integration
- `store_pdf_to_drive` - PDF backup with metadata
- `list_drive_pdfs` - Browse Google Drive files

### Communication
- `send_email` - Gmail integration for sharing materials

### Web Research
- `WebSearch` - Real-time IELTS information search

### System Management
- `health` - Agent status monitoring
- `skills` - Available capabilities listing
- `prompt` - Natural language processing

## 🎯 Usage Examples

### Chat Interface
```javascript
// Natural language queries automatically route to appropriate skills
"Find IELTS writing examples" → Document search
"Email practice tests to john@example.com" → Email functionality
"Latest IELTS changes 2025" → Web search
"Show my Drive files" → Google Drive integration
```

### Direct API Usage
```javascript
import { agentService } from '@/lib/agentService';

// Ask IELTS questions
const answer = await agentService.askIELTSQuestion("What are IELTS writing task types?");

// Search materials by subject
const materials = await agentService.getIELTSMaterials('writing');

// Email study materials
await agentService.shareStudyMaterials(
  ['IELTS Writing Guide', 'Sample Essays'],
  ['student@example.com'],
  'Study Materials'
);

// Web search for current info
const results = await agentService.webSearch('IELTS 2025 changes');
```

## 🔧 Development

### Adding New Agent Skills
1. Update API endpoints in `/utils/api.ts`
2. Add method to `agentService` in `/lib/agentService.ts`
3. Update components to use new functionality
4. Add skill testing in `AgentDashboard`

### Customizing UI
- All components use Tailwind CSS
- Responsive design with mobile support
- Loading states and error handling
- Accessibility features

### Error Handling
- Network error recovery
- Agent offline detection
- Graceful degradation
- User-friendly error messages

## 📱 Demo Page

Visit `/agent-demo` to see all SmythOS agent capabilities in action:
- Interactive tabs for different features
- Subject-based filtering
- Real-time agent monitoring
- Comprehensive skill testing

## 🎨 UI/UX Features

- **Real-time Status**: Agent health indicators
- **Smart Intent Detection**: Automatic skill routing
- **Source Citations**: Document references for answers
- **Confidence Scoring**: Answer reliability indicators
- **Progressive Loading**: Smooth user experience
- **Mobile Responsive**: Works on all devices
- **Accessibility**: Screen reader support
- **Theme Consistency**: Professional IELTS branding

## 🚀 Production Deployment

### Build Optimization
```bash
npm run build
npm run start
```

### Environment Configuration
- Production agent URL: `https://smart-ielts.onrender.com`
- SmythOS direct URL: `https://cmfwa1ah7ycfcjxgthiwbjwr9.agent.a.smyth.ai`
- Proper error boundaries and fallbacks

### Performance Features
- Component lazy loading
- API response caching
- Debounced search
- Virtual scrolling for large lists
- Image optimization

## 📊 Monitoring

The frontend includes comprehensive monitoring:
- Agent health status
- API response times
- Error rates and types
- User interaction metrics
- Skill usage statistics

## 🔐 Security

- Environment variable protection
- Input sanitization
- CORS handling
- Rate limiting awareness
- Secure API communication

## 📚 Documentation

Each component includes:
- TypeScript interfaces
- JSDoc comments
- Usage examples
- Error handling patterns
- Accessibility guidelines

This frontend provides a complete, production-ready integration with SmythOS agent capabilities, offering users a seamless and intelligent IELTS preparation experience.
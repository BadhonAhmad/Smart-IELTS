# Smart-IELTS Render Deployment Checklist

## Pre-Deployment Preparation
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with read/write permissions
- [ ] All IP addresses whitelisted (0.0.0.0/0)
- [ ] Connection string obtained

## API Keys Collection
- [ ] Google AI API Key (Gemini)
- [ ] Pinecone API Key  
- [ ] Tavily API Key (Web Search)
- [ ] Groq API Key (LLM)
- [ ] ElevenLabs API Key (Voice)
- [ ] JWT Secret generated (64 characters)

## Render Account Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Payment method added (if using paid plans)

## Service Deployment Order

### 1. Backend Service ✓
- [ ] Service created: `smart-ielts-backend`
- [ ] Root directory: `backend`
- [ ] Build command: `npm ci`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] NODE_ENV=production
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] GOOGLEAI_API_KEY
  - [ ] PINECONE_API_KEY
  - [ ] FRONTEND_URL (update after frontend deployment)
  - [ ] CORS_ORIGIN (update after frontend deployment)
- [ ] Health check working: `/health`

### 2. Agent Backend Service ✓
- [ ] Service created: `smart-ielts-agent`
- [ ] Root directory: `agentbackend`
- [ ] Build command: `npm ci && npm run build`
- [ ] Start command: `npm run start:api`
- [ ] Environment variables configured:
  - [ ] NODE_ENV=production
  - [ ] GOOGLE_API_KEY
  - [ ] GOOGLEAI_API_KEY
  - [ ] PINECONE_API_KEY
  - [ ] TAVILY_API_KEY
  - [ ] GROQ_API_KEY
  - [ ] SMYTH_VAULT_PATH=/tmp/.smyth/.sre/vault.json
  - [ ] HOME=/tmp
- [ ] Health check working: `/health`
- [ ] Skills endpoint working: `/api/agent/skills`

### 3. Frontend Service ✓
- [ ] Service created: `smart-ielts-frontend`
- [ ] Root directory: `frontend`
- [ ] Build command: `npm ci && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] NODE_ENV=production
  - [ ] NEXT_PUBLIC_API_URL (backend URL)
  - [ ] NEXT_PUBLIC_ELEVENLABS_API_KEY
  - [ ] NEXT_PUBLIC_AGENT_API_URL (agent backend URL)
- [ ] Application loading correctly

## Post-Deployment Updates
- [ ] Update backend FRONTEND_URL with actual frontend URL
- [ ] Update backend CORS_ORIGIN with actual frontend URL
- [ ] Test all service connections

## Testing Checklist
- [ ] Backend health endpoint responds
- [ ] Agent health endpoint responds  
- [ ] Frontend loads without errors
- [ ] User registration/login works
- [ ] IELTS modules accessible
- [ ] Agent chat functionality works
- [ ] Email functionality works
- [ ] Voice features work (if enabled)
- [ ] File upload works

## Production Readiness
- [ ] All services on appropriate plans (Starter recommended)
- [ ] Custom domains configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Database backups configured
- [ ] API rate limits reviewed
- [ ] Security headers configured
- [ ] HTTPS enforced

## Documentation Updated
- [ ] README.md updated with live URLs
- [ ] Environment variable documentation current
- [ ] API documentation reflects live endpoints

---

**Deployment URLs:**
- Backend: https://smart-ielts-backend.onrender.com
- Agent: https://smart-ielts-agent.onrender.com  
- Frontend: https://smart-ielts-frontend.onrender.com

**Estimated Total Cost:** $21/month (3 Starter services)
**Free Tier Option:** Limited to 750 hours/month shared across services
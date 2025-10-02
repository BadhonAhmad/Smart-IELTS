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

### 1. Backend Service ⚠️ **READY FOR DEPLOYMENT**
- [x] Service configuration prepared: `smart-ielts-backend`
- [x] Root directory: `backend`
- [x] Build command: `npm ci`
- [x] Start command: `npm start`
- [x] Environment variables documented:
  - [x] NODE_ENV=production
  - [x] MONGODB_URI
  - [x] JWT_SECRET
  - [x] GOOGLEAI_API_KEY
  - [x] PINECONE_API_KEY
  - [x] FRONTEND_URL (update after frontend deployment)
  - [x] CORS_ORIGIN (update after frontend deployment)
- [ ] **DEPLOYMENT BLOCKED**: Render free tier does not support blueprint deployment
- [ ] Health check: `/health` (pending deployment)

### 2. Agent Backend Service ✅ **DEPLOYED & LIVE**
- [x] Service created: `smart-ielts-agent`
- [x] Root directory: `agentbackend`
- [x] Build command: `npm ci && npm run build`
- [x] Start command: `npm run start:api`
- [x] Environment variables configured:
  - [x] NODE_ENV=production
  - [x] GOOGLE_API_KEY
  - [x] GOOGLEAI_API_KEY
  - [x] PINECONE_API_KEY
  - [x] TAVILY_API_KEY
  - [x] GROQ_API_KEY
  - [x] SMYTH_VAULT_PATH=/tmp/.smyth/.sre/vault.json
  - [x] HOME=/tmp
- [x] **SUCCESSFULLY DEPLOYED**: https://smart-ielts.onrender.com
- [x] Health check working: `/health`
- [x] Skills endpoint working: `/api/agent/skills`
- [x] Email skill functional: `/api/agent/skills/send_email`
- [x] WebSearch skill functional: `/api/agent/skills/WebSearch`
- [x] Natural language interface: `/api/prompt`

### 3. Frontend Service ⚠️ **READY FOR DEPLOYMENT**
- [x] Service configuration prepared: `smart-ielts-frontend`
- [x] Root directory: `frontend`
- [x] Build command: `npm ci && npm run build`
- [x] Start command: `npm start`
- [x] Environment variables documented:
  - [x] NODE_ENV=production
  - [x] NEXT_PUBLIC_API_URL (backend URL)
  - [x] NEXT_PUBLIC_ELEVENLABS_API_KEY
  - [x] NEXT_PUBLIC_AGENT_API_URL (agent backend URL)
- [ ] **DEPLOYMENT BLOCKED**: Render free tier does not support blueprint deployment
- [ ] Application loading: (pending deployment)

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
- Backend: https://smart-ielts-backend.onrender.com (⚠️ ready but blocked by free tier)
- Agent: ✅ https://smart-ielts.onrender.com (✅ LIVE & FUNCTIONAL)
- Frontend: https://smart-ielts-frontend.onrender.com (⚠️ ready but blocked by free tier)

**Deployment Status:**
- ✅ **Agent Backend**: Successfully deployed and fully functional
- ⚠️ **Backend & Frontend**: Prepared for deployment but blocked by Render free tier blueprint limitations
- 💰 **Solution**: Upgrade to Render paid plan ($7/month per service) to enable blueprint deployment

**Estimated Total Cost:** $21/month (3 Starter services)
**Free Tier Limitation:** Does not support blueprint deployment for multiple services
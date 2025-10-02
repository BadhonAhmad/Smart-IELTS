# Smart-IELTS Deployment Guide for Render.com

## Overview
This guide will help you deploy the Smart-IELTS application (3 services) to Render.com.

### Services to Deploy:
1. **Backend** (Node.js/Express API)
2. **Frontend** (Next.js application)  
3. **AgentBackend** (SmythOS SDK agent service)

## Prerequisites

### 1. Database Setup (MongoDB Atlas - Recommended)
1. Create a free MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster (free tier is sufficient for testing)
3. Create a database user with read/write permissions
4. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database`)
5. Whitelist all IP addresses (0.0.0.0/0) for Render deployment

### 2. Required API Keys
Obtain the following API keys:
- **Google AI API Key** (for Gemini): https://aistudio.google.com/apikey
- **Pinecone API Key**: https://app.pinecone.io/
- **Tavily API Key** (for web search): https://tavily.com/
- **Groq API Key** (for LLM): https://groq.com/
- **ElevenLabs API Key** (for voice features): https://elevenlabs.io/
- **JWT Secret**: Generate a random 64-character string

## Deployment Steps

### Step 1: Deploy Backend Service

1. **Connect Repository to Render**
   - Go to https://render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the Smart-IELTS repository

2. **Backend Service Configuration**
   - **Name**: `smart-ielts-backend`
   - **Region**: Choose your preferred region (e.g., Singapore)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm start`

3. **Environment Variables for Backend**
   Add these in the Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-ielts
   JWT_SECRET=your-64-character-random-string
   GOOGLEAI_API_KEY=your-google-ai-api-key
   PINECONE_API_KEY=your-pinecone-api-key
   FRONTEND_URL=https://your-frontend-service.onrender.com
   CORS_ORIGIN=https://your-frontend-service.onrender.com
   ```

### Step 2: Deploy Agent Backend Service

1. **Create Agent Backend Service**
   - Click "New +" → "Web Service"
   - Connect the same repository
   - **Name**: `smart-ielts-agent`
   - **Region**: Same as backend
   - **Root Directory**: `agentbackend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:api`

2. **Environment Variables for Agent Backend**
   ```
   NODE_ENV=production
   GOOGLE_API_KEY=your-google-ai-api-key
   GOOGLEAI_API_KEY=your-google-ai-api-key
   PINECONE_API_KEY=your-pinecone-api-key
   TAVILY_API_KEY=your-tavily-api-key
   GROQ_API_KEY=your-groq-api-key
   SMYTH_VAULT_PATH=/tmp/.smyth/.sre/vault.json
   HOME=/tmp
   ```

### Step 3: Deploy Frontend Service

1. **Create Frontend Service**
   - Click "New +" → "Web Service"  
   - Connect the same repository
   - **Name**: `smart-ielts-frontend`
   - **Region**: Same as backend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

2. **Environment Variables for Frontend**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://smart-ielts-backend.onrender.com
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-api-key
   NEXT_PUBLIC_AGENT_API_URL=https://smart-ielts-agent.onrender.com
   ```

## Post-Deployment Configuration

### 1. Update CORS Settings
After all services are deployed, update the backend environment variables:
- Set `FRONTEND_URL` to your actual frontend URL
- Set `CORS_ORIGIN` to the same frontend URL

### 2. Test Deployment
1. **Backend Health Check**: Visit `https://your-backend.onrender.com/health`
2. **Agent Health Check**: Visit `https://your-agent.onrender.com/health`
3. **Frontend**: Visit your frontend URL

### 3. Verify Agent Skills
Test the agent endpoints:
- `GET https://your-agent.onrender.com/api/agent/skills` - List available skills
- `POST https://your-agent.onrender.com/api/prompt` - Test natural language interface

## Important Notes

### Service Dependencies
Deploy in this order:
1. Backend (first)
2. Agent Backend (second)
3. Frontend (last, needs backend URLs)

### Free Tier Limitations
- Services on free tier may sleep after 15 minutes of inactivity
- Consider upgrading to Starter plan ($7/month) for production use
- Free tier includes 750 hours/month (enough for 1 service always-on)

### Database Recommendations
- Use MongoDB Atlas (free tier available)
- Keep connection string secure in environment variables
- Consider upgrading to paid Atlas tier for production

### File Storage
- Render provides ephemeral storage (files don't persist between deployments)
- For persistent file storage, consider:
  - AWS S3 (for uploads)
  - Cloudinary (for images)
  - MongoDB GridFS (for documents)

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs in Render dashboard

2. **Environment Variable Issues**
   - Ensure all required API keys are set
   - Check for typos in variable names
   - Verify API keys are valid and have correct permissions

3. **CORS Errors**
   - Verify `FRONTEND_URL` matches your actual frontend domain
   - Check `CORS_ORIGIN` is set correctly in backend

4. **Agent Service Issues**
   - Verify all AI service API keys (Google, Groq, Tavily, Pinecone)
   - Check agent service logs for skill execution errors
   - Test skills individually via direct API calls

### Logs and Monitoring
- Access logs via Render dashboard → Service → Logs
- Monitor service health via dashboard metrics
- Set up log drains for production monitoring

## Estimated Costs (Monthly)

### Free Tier
- 1 service: $0
- Additional services: Limited hours

### Starter Plan
- Per service: $7/month
- Full stack (3 services): $21/month
- Includes custom domains, more resources

## Next Steps

1. **Custom Domains**: Add your own domains in service settings
2. **CI/CD**: Set up auto-deploy on git push
3. **Monitoring**: Add uptime monitoring and alerts
4. **Scaling**: Monitor usage and upgrade plans as needed
5. **Security**: Review and rotate API keys regularly

## Support
- Render Documentation: https://render.com/docs
- Community Forum: https://community.render.com/
- This repository's issues for app-specific questions
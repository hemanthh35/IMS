# 🚀 Deploy AI Incident Management System to Render

## Quick Deployment Steps

### Method 1: Blueprint Deployment (Easiest)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Sign in with your GitHub account

2. **Create Blueprint**
   - Click "New +" button
   - Select "Blueprint"
   - Connect your GitHub repository: `hemanthh35/IMS`

3. **Deploy**
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to deploy both services
   - Wait for deployment to complete (5-10 minutes)

### Method 2: Manual Deployment

#### Step 1: Deploy Backend API

1. **Create Web Service**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `hemanthh35/IMS`

2. **Configure Backend**
   - **Name**: `ai-incident-management-backend`
   - **Environment**: `Python`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

3. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Note the URL: `https://ai-incident-management-backend.onrender.com`

#### Step 2: Deploy Frontend

1. **Create Static Site**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Static Site"
   - Connect GitHub repository: `hemanthh35/IMS`

2. **Configure Frontend**
   - **Name**: `ai-incident-management-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

3. **Add Environment Variable**
   - Go to "Environment" tab
   - Add: `REACT_APP_API_URL` = `https://ai-incident-management-backend.onrender.com`

4. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for deployment (2-3 minutes)

## ✅ After Deployment

### Your URLs will be:
- **Frontend**: `https://ai-incident-management-frontend.onrender.com`
- **Backend API**: `https://ai-incident-management-backend.onrender.com`
- **API Docs**: `https://ai-incident-management-backend.onrender.com/docs`

### Test Your Deployment:
1. Visit the frontend URL
2. Try submitting an incident
3. Check the API documentation
4. Test the health endpoint: `/`

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in `requirements.txt`

2. **CORS Errors**
   - Backend CORS is already configured for Render domains
   - Check if frontend URL is correct in environment variables

3. **ML Model Loading**
   - Models are included in the repository
   - Check if `predictor/` directory is present

4. **Port Issues**
   - Render automatically sets `$PORT` environment variable
   - Backend is configured to use this port

## 📊 Monitoring

- **Logs**: Available in Render dashboard
- **Health Check**: `GET /` endpoint
- **Metrics**: Render provides basic metrics

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render will automatically redeploy
3. Or manually trigger redeploy from dashboard

---

**🎉 Your AI Incident Management System will be live on Render!** 
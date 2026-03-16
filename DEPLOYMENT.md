# Deployment Guide - ShelbyShare

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub: github.com/mjhmojthu/shelbyshare
git remote add origin https://github.com/mjhmojthu/shelbyshare.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub: `mjhmojthu/shelbyshare`
4. Add Environment Variables:

```
NEXT_PUBLIC_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

5. Click "Deploy"

### Step 3: Setup Shelby CLI on Vercel (Server)

**Problem:** Vercel serverless functions don't have Shelby CLI installed.

**Solution:** Deploy a separate Node.js server for Shelby operations.

#### Option A: Use Railway (Recommended)

1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repo
4. Add environment variables (same as Vercel)
5. Install Shelby CLI in Dockerfile:

```dockerfile
FROM node:18

WORKDIR /app

# Install Shelby CLI
RUN npm install -g @shelby-protocol/cli

# Copy app
COPY package*.json ./
RUN npm install
COPY . .

# Build
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

6. Update API routes to use Railway URL for Shelby operations

#### Option B: Use Vercel with Custom Runtime

Not recommended - too complex for starter.

---

## 📊 After Deployment

### 1. Test Upload

```bash
curl -F "file=@test.pdf" https://your-app.vercel.app/api/upload
```

### 2. Test Download

Visit the share link from upload response.

### 3. Monitor Logs

Vercel Dashboard → Your Project → Functions → Logs

---

## ⚡ Quick Deploy (Alternative)

If you want simpler deployment without Shelby CLI complexity:

### Mock Shelby Integration (for demo)

Replace `lib/shelby.ts` with mock:

```typescript
export async function uploadToShelby(filePath: string) {
  // Mock - just generate shareId
  const shareId = crypto.randomBytes(6).toString('hex');
  return {
    shareId,
    shelbyPath: `files/${shareId}`
  };
}

export async function downloadFromShelby(shelbyPath: string, outputPath: string) {
  // Mock - copy from upload
  // In real app, this would download from Shelby
  throw new Error('Download not implemented in mock mode');
}
```

This lets you deploy and demo the UI without needing Shelby CLI.

**Add banner:**
```
⚠️ Demo Mode - File storage not yet connected to Shelby
```

Then apply for early access with:
- Live demo URL
- Note: "Using mock storage, need early access to integrate real Shelby backend"

---

## 🎯 Recommended Approach for Early Access

### Week 1: Deploy with Mock

1. Deploy with mock Shelby integration
2. Get live demo URL
3. Perfect the UI/UX
4. Apply for early access

### Week 2: After Approval

1. Get Shelby early access
2. Replace mock with real integration
3. Deploy to Railway/VPS
4. Launch for real users

This way you have a **working demo immediately** without waiting for server setup!

---

## 📝 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Supabase database created
- [ ] Environment variables configured
- [ ] Deployed to Vercel
- [ ] Test upload works
- [ ] Test download works
- [ ] Custom domain (optional)
- [ ] Analytics added (Vercel Analytics)
- [ ] Error monitoring (Sentry)

---

## 🔗 Useful Links

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Shelby Docs: https://docs.shelby.xyz

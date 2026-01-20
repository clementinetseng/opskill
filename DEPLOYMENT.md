# Render Deployment Guide

## Prerequisites

- Render account (free tier is sufficient)
- GitHub repository with your code
- PostgreSQL database (will be created automatically by Render)

---

## Step 1: Prepare Your Repository

### 1.1 Commit All Changes

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 1.2 Verify `render.yaml` Exists

The `render.yaml` file in the root directory contains all deployment configuration.

---

## Step 2: Create New Web Service on Render

### 2.1 Login to Render Dashboard

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**

### 2.2 Connect Repository

1. Select **"Connect a repository"**
2. Authorize Render to access your GitHub
3. Select your repository

### 2.3 Apply Blueprint

Render will automatically detect `render.yaml` and create:
- ✅ Web Service (hoks)
- ✅ PostgreSQL Database (hoks-db)

Click **"Apply"** to start deployment.

---

## Step 3: Configure Environment Variables

Render will automatically set:
- `NODE_ENV=production`
- `DATABASE_URL` (from PostgreSQL database)

### Optional Environment Variables

If you need additional configuration, add them in Render Dashboard:

```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.onrender.com
```

---

## Step 4: Wait for Build

The build process takes approximately **5-10 minutes**:

1. **Install dependencies** (`npm install`)
2. **Build Next.js** (`npm run build`)
3. **Start server** (`npm start`)

Monitor the build logs in Render Dashboard.

---

## Step 5: Initialize Database (Optional)

If you need to create tables for user progress tracking:

### 5.1 Connect to PostgreSQL

In Render Dashboard:
1. Go to **"hoks-db"** database
2. Click **"Connect"** → Copy **External Database URL**

### 5.2 Run Migration Script

```bash
psql <DATABASE_URL>
```

Then run:

```sql
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  sop_id VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, sop_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

---

## Step 6: Verify Deployment

### 6.1 Access Your App

Your app will be available at:
```
https://hoks-<random-string>.onrender.com
```

### 6.2 Test Core Features

- [ ] Dashboard loads correctly
- [ ] Wiki shows all SOPs
- [ ] Command K search works
- [ ] Editor can create new SOPs
- [ ] SOPs render with interactive components

---

## Step 7: Custom Domain (Optional)

If you want to use a custom domain:

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `ops.yourcompany.com`)
3. Update DNS records as instructed by Render

---

## Troubleshooting

### Issue: Build Fails

**Solution:**
- Check build logs in Render Dashboard
- Ensure `package.json` has correct scripts:
  ```json
  {
    "scripts": {
      "build": "next build",
      "start": "next start"
    }
  }
  ```

### Issue: Database Connection Error

**Solution:**
- Verify `DATABASE_URL` environment variable is set
- Check PostgreSQL database status in Render Dashboard

### Issue: SOPs Not Showing

**Solution:**
- Ensure `content/` directory is committed to Git
- Check file permissions in deployment logs

---

## Automatic Deployments

Render will automatically redeploy when you push to `main` branch:

```bash
git add .
git commit -m "Update SOPs"
git push origin main
```

Deployment takes ~5 minutes.

---

## Free Tier Limitations

Render Free Tier includes:
- ✅ 750 hours/month (sufficient for 24/7 uptime)
- ✅ Automatic SSL
- ✅ PostgreSQL database (90-day retention)
- ⚠️ Spins down after 15 minutes of inactivity (first request takes ~30s)

**Upgrade to Starter ($7/month) for:**
- No spin-down
- Better performance
- Longer database retention

---

## Maintenance

### Update Content

Use the web-based editor at `/editor` to update SOPs without redeployment.

### Monitor Performance

Check Render Dashboard for:
- Request metrics
- Error logs
- Database usage

---

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Enable 2FA on Render account
- [ ] Set up environment variable for sensitive data
- [ ] Review access logs regularly

# 🚀 Quick Setup Instructions for Vercel

## Option 1: Automated Setup (Recommended)

Run this command in your terminal:

```bash
cd "/Users/harshui/Documents/FutureScape/untitled folder"
./QUICK_SETUP.sh
```

This will:
1. Install Vercel CLI (if needed)
2. Link to your Vercel project
3. Pull environment variables
4. Initialize database
5. Create admin user

## Option 2: Manual Setup

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
(Follow the prompts to login)

### Step 3: Link to Your Project
```bash
cd "/Users/harshui/Documents/FutureScape/untitled folder"
vercel link
```
- Select your project: `lunch-break`
- Select scope: Your account
- Override settings? **No**

### Step 4: Pull Environment Variables
```bash
vercel env pull .env.local
```
This will create `.env.local` with your Vercel environment variables.

### Step 5: Generate Prisma Client
```bash
npx prisma generate
```

### Step 6: Push Database Schema
```bash
npx prisma db push --accept-data-loss
```

### Step 7: Create Admin User
```bash
node scripts/setup-db.js
```

## Step 8: Redeploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **lunch-break** project
3. Go to **Deployments** tab
4. Click **⋯** (three dots) on latest deployment
5. Click **Redeploy**
6. Wait for deployment to complete

## Step 9: Verify It Works

1. **Check Health:**
   ```
   https://lunch-break-mocha.vercel.app/api/health
   ```
   Should return: `{"status":"ok","database":"connected"}`

2. **Test Login:**
   ```
   https://lunch-break-mocha.vercel.app/login
   ```
   - Employee ID: `ADMIN001`
   - Passcode: `admin123`

## ⚠️ Important: Set Environment Variables First!

Before running the setup, make sure you've set these in Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these 3 variables:

   **DATABASE_URL**
   - Get from: Storage → Your Postgres DB → `.env.local` tab
   - Copy `POSTGRES_PRISMA_URL` or `POSTGRES_URL_NON_POOLING`

   **NEXTAUTH_URL**
   - Value: `https://lunch-break-mocha.vercel.app`

   **NEXTAUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Copy the output

3. Click **Save** after adding each variable

## 🆘 Troubleshooting

**If vercel link fails:**
- Make sure you're logged in: `vercel login`
- Check you have access to the project

**If database push fails:**
- Verify DATABASE_URL in `.env.local` is correct
- Check database is active in Vercel Storage

**If admin creation fails:**
- Check database connection: `npx prisma studio`
- Verify schema was pushed successfully

## ✅ Success Checklist

- [ ] Environment variables set in Vercel
- [ ] Vercel CLI installed and logged in
- [ ] Project linked (`vercel link`)
- [ ] Environment variables pulled (`.env.local` exists)
- [ ] Prisma Client generated
- [ ] Database schema pushed
- [ ] Admin user created
- [ ] Project redeployed on Vercel
- [ ] Health endpoint returns OK
- [ ] Can login successfully

---

**Need help?** Check the logs:
- Build logs: Vercel Dashboard → Deployments → Build Logs
- Function logs: Vercel Dashboard → Functions → Logs


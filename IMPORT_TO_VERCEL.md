# 📥 How to Import .env File to Vercel

## Step 1: Generate NEXTAUTH_SECRET

First, generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and replace `CHANGE_THIS_TO_RANDOM_SECRET_MIN_32_CHARACTERS` in `vercel.env` file.

## Step 2: Import to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/dashboard
2. **Click:** Your project "lunch-break"
3. **Go to:** Settings → Environment Variables
4. **Click:** "Import" button (or "Add" → "Import from file")
5. **Select:** `vercel.env` file from your project
6. **Review** the variables and click "Import"
7. **Select environments:** Make sure Production, Preview, and Development are selected
8. **Click:** "Save"

### Method 2: Using Vercel CLI

```bash
cd "/Users/harshui/Documents/FutureScape/untitled folder"

# Make sure you're logged in
npx vercel login

# Link to your project (if not already linked)
npx vercel link

# Import environment variables
npx vercel env pull .env.local
# Then manually copy from vercel.env to .env.local and push back
```

### Method 3: Manual Copy-Paste

1. Open `vercel.env` file
2. Copy each variable
3. Go to Vercel Dashboard → Settings → Environment Variables
4. Add each variable manually:
   - **DATABASE_URL** → Paste value
   - **NEXTAUTH_URL** → Paste value  
   - **NEXTAUTH_SECRET** → Paste value (after generating it)

## Step 3: Verify Variables

After importing, verify all 3 variables are set:
- ✅ DATABASE_URL
- ✅ NEXTAUTH_URL
- ✅ NEXTAUTH_SECRET

## Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**
4. Wait for deployment

## Step 5: Test

Visit: https://lunch-break-mocha.vercel.app/api/health

Should return: `{"status":"ok","database":"connected"}`

---

**Note:** The `vercel.env` file is ready to import. Just generate the NEXTAUTH_SECRET first!


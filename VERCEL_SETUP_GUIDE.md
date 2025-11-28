# Vercel Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Log in with your account
3. Click on your project: **random-me** (or **random-me-rho**)

### 2. Navigate to Environment Variables
1. Click **Settings** (in the top menu)
2. Click **Environment Variables** (in the left sidebar)

### 3. Check All 7 Variables

You should see these **7 variables** listed:

| # | Variable Name | Value | Environments |
|---|---------------|-------|--------------|
| 1 | `REACT_APP_FIREBASE_API_KEY` | `AIzaSyBihjhGKnoKtAdrsAViEcMbZTPWgQdcpyM` | Production, Preview, Development |
| 2 | `REACT_APP_FIREBASE_AUTH_DOMAIN` | `spinning-wheel-app-c80c2.firebaseapp.com` | Production, Preview, Development |
| 3 | `REACT_APP_FIREBASE_PROJECT_ID` | `spinning-wheel-app-c80c2` | Production, Preview, Development |
| 4 | `REACT_APP_FIREBASE_STORAGE_BUCKET` | `spinning-wheel-app-c80c2.firebasestorage.app` | Production, Preview, Development |
| 5 | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `511438866896` | Production, Preview, Development |
| 6 | `REACT_APP_FIREBASE_APP_ID` | `1:511438866896:web:2971702025cfc1d79a51d5` | Production, Preview, Development |
| 7 | `REACT_APP_FIREBASE_MEASUREMENT_ID` | `G-XESH8347DY` | Production, Preview, Development |

### 4. How to Add a Missing Variable

If any variable is missing:

1. Click **Add New** button (top right)
2. Fill in the form:
   - **Name:** Copy the variable name exactly (e.g., `REACT_APP_FIREBASE_MEASUREMENT_ID`)
   - **Value:** Copy the value exactly (e.g., `G-XESH8347DY`)
   - **Environments:** Check all three boxes:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
3. Click **Save**

### 5. How to Edit an Existing Variable

If a variable exists but has the wrong value:

1. Find the variable in the list
2. Click the **three dots (...)** on the right side
3. Click **Edit**
4. Update the value
5. Click **Save**

### 6. Critical Variable to Check

**⚠️ MOST IMPORTANT:** Check `REACT_APP_FIREBASE_STORAGE_BUCKET`

- **Correct value:** `spinning-wheel-app-c80c2.firebasestorage.app`
- **Wrong value:** `spinning-wheel-app-c80c2.firebasestorage.ap` (missing the "p")

This is the most common cause of the auth error!

### 7. After Adding/Editing Variables

1. Go to **Deployments** tab
2. Click the three dots (...) next to the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (usually 1-2 minutes)

### 8. Test Your Application

1. Visit https://random-me-rho.vercel.app/
2. Clear browser cache or use **Incognito mode**
3. Click **Sign in** button
4. Google authentication should now work!

## Quick Checklist

- [ ] All 7 variables are present in Vercel
- [ ] Each variable is enabled for: Production, Preview, Development
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET` ends with `.app` (not `.ap`)
- [ ] Redeployed the application
- [ ] Tested in incognito mode

## Troubleshooting

### If login still doesn't work:

1. **Wait 5 minutes** - Changes may take time to propagate
2. **Clear browser cache** - Old cached files may be interfering
3. **Check browser console** - Press F12, look for error messages
4. **Verify Firebase authorized domains** - Make sure `random-me-rho.vercel.app` is in the list

### Common Mistakes

❌ Typo in variable name (e.g., `REACT_APP_FIREBASE_API_KEy` instead of `REACT_APP_FIREBASE_API_KEY`)
❌ Missing environment selection (must select Production, Preview, AND Development)
❌ Incomplete value (e.g., storage bucket missing the "p" in ".app")
❌ Not redeploying after adding variables

## Need Help?

If you're still having issues, take a screenshot of:
1. Your Vercel Environment Variables page
2. The error message in the browser
3. The browser console (F12 → Console tab)

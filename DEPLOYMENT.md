# Deployment Guide

## Vercel Deployment

### Environment Variables (Already Configured)
All Firebase environment variables have been added to Vercel dashboard.

### Firebase Authorized Domains Setup

**IMPORTANT:** Add your Vercel domain to Firebase authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `spinning-wheel-app-c80c2`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add: `random-me-rho.vercel.app`
6. Click **Add**

### Current Deployment
- Production URL: https://random-me-rho.vercel.app/
- GitHub Repo: https://github.com/arita10/random-me.git

## Troubleshooting

### Firebase Auth Error on Production
If you see "Firebase: Error (auth/internal-error)" on Vercel but not localhost:

1. ✅ Verify environment variables are set in Vercel dashboard
2. ⚠️ **Add Vercel domain to Firebase authorized domains** (See above)
3. Redeploy after adding the domain

### After Adding Domain
It may take a few minutes for the changes to propagate. If the issue persists:
- Clear browser cache
- Try in incognito mode
- Wait 5-10 minutes for Firebase to update

## Deployment Checklist
- [x] Environment variables configured on Vercel
- [x] Vercel domain added to Firebase authorized domains (random-me-rho.vercel.app)
- [ ] Verify all environment variables are correct
- [ ] Redeploy application
- [ ] Test login after redeployment

## Vercel Environment Variables Checklist

Please verify these EXACT values in your Vercel dashboard:

1. **REACT_APP_FIREBASE_API_KEY**
   - Value: `AIzaSyBihjhGKnoKtAdrsAViEcMbZTPWgQdcpyM`

2. **REACT_APP_FIREBASE_AUTH_DOMAIN**
   - Value: `spinning-wheel-app-c80c2.firebaseapp.com`

3. **REACT_APP_FIREBASE_PROJECT_ID**
   - Value: `spinning-wheel-app-c80c2`

4. **REACT_APP_FIREBASE_STORAGE_BUCKET**
   - Value: `spinning-wheel-app-c80c2.firebasestorage.app`
   - ⚠️ IMPORTANT: Must end with `.app` NOT `.ap`

5. **REACT_APP_FIREBASE_MESSAGING_SENDER_ID**
   - Value: `511438866896`

6. **REACT_APP_FIREBASE_APP_ID**
   - Value: `1:511438866896:web:2971702025cfc1d79a51d5`

### How to Verify on Vercel:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Check EACH variable matches exactly (especially STORAGE_BUCKET)
5. Make sure variables are enabled for Production, Preview, and Development

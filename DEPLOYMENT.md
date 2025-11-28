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
- [ ] Vercel domain added to Firebase authorized domains
- [ ] Test login after domain is authorized

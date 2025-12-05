# 🔐 Security Deployment Guide

This guide walks you through deploying your Firestore and Storage security rules to Firebase.

---

## ✅ Task 1: Deploy Firestore Rules (COMPLETED ✓)

### Option A: Using Firebase CLI (Recommended)

1. **Login to Firebase:**
   ```bash
   firebase login
   ```
   - Opens browser for Google authentication
   - Grant Firebase CLI permissions

2. **Initialize Firebase (if not already done):**
   ```bash
   firebase init
   ```
   - Select: **Firestore** and **Storage**
   - Choose your project: `spinning-wheel-app-c80c2`
   - Accept default firestore.rules and storage.rules files
   - **DO NOT overwrite** your existing rules files!

3. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```
   - This deploys your `firestore.rules` file to Firebase

4. **Verify Deployment:**
   - Go to: https://console.firebase.google.com/project/spinning-wheel-app-c80c2/firestore/rules
   - You should see your rules published

---

## ✅ Task 2: Deploy Storage Rules (COMPLETED ✓)

### Using Firebase CLI

1. **Deploy Storage Rules:**
   ```bash
   firebase deploy --only storage:rules
   ```
   - This deploys your `storage.rules` file to Firebase

2. **Verify Deployment:**
   - Go to: https://console.firebase.google.com/project/spinning-wheel-app-c80c2/storage/rules
   - You should see your rules published

### Deploy Both at Once:
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## Option B: Manual Deployment via Firebase Console

If you prefer not to use the CLI:

### Firestore Rules:

1. Go to: https://console.firebase.google.com/project/spinning-wheel-app-c80c2/firestore/rules

2. Copy the contents of your `firestore.rules` file

3. Paste into the Firebase Console editor

4. Click **Publish**

### Storage Rules:

1. Go to: https://console.firebase.google.com/project/spinning-wheel-app-c80c2/storage/rules

2. Copy the contents of your `storage.rules` file

3. Paste into the Firebase Console editor

4. Click **Publish**

---

## ✅ Task 3: .env Added to .gitignore (COMPLETED ✓)

**Status:** ✅ Already added `.env` to your `.gitignore` file!

**Verify:**
```bash
cat .gitignore | grep .env
```

You should see:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**IMPORTANT:** If you've already committed `.env` to Git, remove it:
```bash
git rm --cached .env
git commit -m "Remove .env from repository"
git push
```

---

## ✅ Task 4: Security Headers Configured (COMPLETED ✓)

**Status:** ✅ Security headers added to `vercel.json`!

### Headers Added:

1. **X-Content-Type-Options: nosniff**
   - Prevents MIME type sniffing
   - Blocks malicious file uploads

2. **X-Frame-Options: DENY**
   - Prevents clickjacking attacks
   - Disables iframe embedding

3. **X-XSS-Protection: 1; mode=block**
   - Enables browser XSS filter
   - Blocks page if XSS detected

4. **Referrer-Policy: strict-origin-when-cross-origin**
   - Controls referrer information
   - Privacy protection

5. **Permissions-Policy**
   - Disables geolocation, microphone, camera
   - Prevents unauthorized access to device features

6. **Content-Security-Policy (CSP)**
   - Restricts script sources
   - Allows Google Analytics
   - Blocks inline scripts (except where needed)
   - Prevents XSS attacks

### Deploy to Vercel:

**Automatic Deployment:**
If you have auto-deploy enabled on Vercel:
```bash
git add vercel.json
git commit -m "Add security headers to Vercel configuration"
git push
```

**Manual Deployment:**
```bash
vercel --prod
```

**Verify Headers:**
After deployment, check headers at: https://securityheaders.com/
- Enter your URL: `https://random-me-rho.vercel.app`
- Check your security score!

---

## 🧪 Testing Your Deployment

### Test Firestore Rules:

1. Try to access another user's data (should fail)
2. Try to create data without authentication (should fail)
3. Try to exceed max options (should fail)
4. Try to upload file > 5MB (should fail)

**Test Script:**
```javascript
// In browser console on your app
const db = firebase.firestore();

// Should FAIL (not authenticated)
db.collection('wheels').doc('test').set({ name: 'Test' });

// After login, should FAIL (too many options)
db.collection('wheels').add({
  name: 'Test',
  options: new Array(1001).fill('Option') // > 1000 limit
});
```

### Test Storage Rules:

1. Try to upload non-image file (should fail)
2. Try to upload file > 2MB to avatar (should fail)
3. Try to access another user's private file (should fail)

### Test Security Headers:

**Check Headers:**
```bash
curl -I https://random-me-rho.vercel.app
```

Look for:
```
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 1; mode=block
content-security-policy: ...
```

**Online Tools:**
- https://securityheaders.com/ - Check all headers
- https://observatory.mozilla.org/ - Comprehensive security scan

---

## 📋 Deployment Checklist

- [x] ✅ `.env` added to `.gitignore`
- [ ] ⏳ Firebase login completed
- [ ] ⏳ Firestore rules deployed
- [ ] ⏳ Storage rules deployed
- [x] ✅ Security headers configured in `vercel.json`
- [ ] ⏳ Changes pushed to Git
- [ ] ⏳ Vercel deployment completed
- [ ] ⏳ Security headers verified
- [ ] ⏳ Rules tested in production

---

## 🔍 Verification Commands

**Check Firebase Login:**
```bash
firebase login:list
```

**Check Current Project:**
```bash
firebase projects:list
firebase use
```

**View Current Firestore Rules:**
```bash
firebase firestore:rules:get > current-firestore-rules.txt
```

**View Current Storage Rules:**
```bash
firebase storage:rules:get > current-storage-rules.txt
```

**Test Firestore Rules Locally:**
```bash
firebase emulators:start --only firestore
```

---

## 🚨 Troubleshooting

### "Error: Failed to authenticate"
**Solution:**
```bash
firebase logout
firebase login
```

### "Error: Permission denied"
**Solution:**
- Make sure you have owner/editor access to the Firebase project
- Check IAM permissions in Firebase Console

### "Rules failed to compile"
**Solution:**
- Check syntax in `firestore.rules` or `storage.rules`
- Look for missing semicolons, braces, or quotes

### "Headers not appearing"
**Solution:**
- Clear browser cache
- Wait 5-10 minutes for Vercel propagation
- Check deployment logs in Vercel dashboard

---

## 📚 Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Vercel Headers Documentation](https://vercel.com/docs/concepts/projects/project-configuration#headers)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)

---

## 🎯 Quick Command Reference

```bash
# Deploy everything
firebase deploy --only firestore:rules,storage:rules

# Deploy to Vercel
git add .
git commit -m "Deploy security rules and headers"
git push

# Check security
curl -I https://random-me-rho.vercel.app
```

---

**Need Help?**
- Firebase Console: https://console.firebase.google.com/
- Vercel Dashboard: https://vercel.com/dashboard
- Check deployment logs in both platforms

---

🎉 **Once all tasks are complete, your app will have production-grade security!**

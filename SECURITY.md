# 🔒 Security Guide

This document outlines the security measures implemented in this application and best practices for maintaining security.

## 📋 Table of Contents

1. [Security Features](#security-features)
2. [Dependency Security](#dependency-security)
3. [Input Validation & Sanitization](#input-validation--sanitization)
4. [Firebase Security](#firebase-security)
5. [Best Practices](#best-practices)
6. [Security Checklist](#security-checklist)

---

## 🛡️ Security Features

### Implemented Security Measures

✅ **Input Validation & Sanitization**
- All user inputs are validated and sanitized
- XSS protection using DOMPurify
- File upload validation (type, size, content)
- Maximum length limits on all text inputs

✅ **Secure Firebase Configuration**
- Environment variables for sensitive data
- Firebase Security Rules (must be configured)
- Authentication state management
- Secure data storage practices

✅ **Client-Side Rate Limiting**
- Protection against spam/abuse
- Configurable limits per action
- Automatic blocking for excessive requests

✅ **Secure Local Storage**
- Encrypted storage utilities
- Input sanitization before storage
- Safe retrieval with error handling

✅ **File Upload Security**
- File type validation
- File size limits (5MB max)
- Content validation for Excel files
- Protection against path traversal

---

## 📦 Dependency Security

### Current Vulnerabilities

⚠️ **Known Issues (As of last audit)**

1. **xlsx** - High severity (Prototype Pollution, ReDoS)
   - **Status**: No fix available
   - **Mitigation**: Input validation implemented, file size limits enforced
   - **Risk Level**: LOW (mitigated through validation)

2. **react-scripts** - Development dependencies
   - **Status**: Affects development only, not production
   - **Risk Level**: LOW (dev environment only)

3. **Firebase undici** - Moderate severity
   - **Status**: Waiting for Firebase SDK update
   - **Risk Level**: LOW (Firebase team addressing)

### Checking for Vulnerabilities

```bash
# Run security audit
npm audit

# Fix non-breaking issues
npm audit fix

# View detailed report
npm audit --json
```

### Updating Dependencies

```bash
# Update all dependencies to latest safe versions
npm update

# Update specific package
npm update packagename

# Check for outdated packages
npm outdated
```

---

## 🔐 Input Validation & Sanitization

### Available Security Functions

All security utilities are available in `src/utils/security.js`:

```javascript
import {
  sanitizeTextInput,
  validateOptionName,
  validateColorHex,
  validateNumber,
  validateExcelFile,
  SECURITY_LIMITS
} from './utils/security';
```

### Usage Examples

#### Text Input Sanitization
```javascript
const handleInput = (userInput) => {
  const sanitized = sanitizeTextInput(userInput, 200); // Max 200 chars
  // sanitized is now safe to use
};
```

#### Name Validation
```javascript
const validation = validateOptionName(name);
if (validation.valid) {
  // Use validation.sanitized
} else {
  // Show validation.error to user
}
```

#### File Upload Validation
```javascript
const fileValidation = validateExcelFile(file);
if (!fileValidation.valid) {
  alert(fileValidation.error);
  return;
}
```

### Security Limits

```javascript
SECURITY_LIMITS = {
  MAX_OPTION_LENGTH: 200,        // Max characters per option
  MAX_OPTIONS_COUNT: 1000,       // Max number of options/names
  MAX_TEAMS_COUNT: 100,          // Max number of teams
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB file upload limit
  MAX_COLORS_COUNT: 100,         // Max custom colors
  RATE_LIMIT_WINDOW: 60000,      // 1 minute window
  RATE_LIMIT_ATTEMPTS: 10        // Max attempts per window
}
```

---

## 🔥 Firebase Security

### Environment Variables

**Required Variables** (in `.env` file):
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID= (optional)
```

### Firebase Security Rules

**IMPORTANT**: Configure these rules in your Firebase Console:

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Wheels collection
    match /wheels/{wheelId} {
      // Users can only read/write their own wheels
      allow read, write: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      // Prevent too many documents
      allow create: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.wheelCount < 100;
    }

    // Page visits (analytics)
    match /pageVisits/{visitId} {
      allow create: if true; // Anonymous allowed
      allow read: if false; // Nobody can read
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      // Users can only access their own files
      allow read, write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

### Firebase Security Checklist

- [ ] Environment variables configured
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Authentication methods configured
- [ ] Firebase App Check enabled (production)
- [ ] Different projects for dev/prod
- [ ] API key restrictions set in Google Cloud Console
- [ ] Regular security rules audit
- [ ] Monitor Firebase usage dashboard

---

## 🎯 Best Practices

### For Developers

1. **Never Commit Secrets**
   - Keep `.env` in `.gitignore`
   - Use `.env.example` for reference
   - Rotate keys if accidentally exposed

2. **Validate All Inputs**
   - Use provided security utilities
   - Never trust client-side data
   - Validate on both client and server

3. **Keep Dependencies Updated**
   - Run `npm audit` regularly
   - Update packages monthly
   - Review changelogs for security fixes

4. **Code Reviews**
   - Review security implications
   - Check for SQL injection risks
   - Verify authentication checks

5. **Error Handling**
   - Don't expose sensitive info in errors
   - Log errors securely
   - Show user-friendly messages

### For Production Deployment

1. **Environment Setup**
   ```bash
   # Set NODE_ENV to production
   NODE_ENV=production npm run build
   ```

2. **Security Headers**
   Add these headers in your hosting configuration:
   ```
   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
   X-Content-Type-Options: nosniff
   X-Frame-Options: SAMEORIGIN
   X-XSS-Protection: 1; mode=block
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

3. **HTTPS Only**
   - Force HTTPS redirects
   - Use HSTS headers
   - Secure cookies

4. **Monitoring**
   - Set up Firebase monitoring
   - Monitor for unusual activity
   - Set up alerts for errors

---

## ✅ Security Checklist

### Pre-Deployment

- [ ] All environment variables set correctly
- [ ] `.env` file NOT in version control
- [ ] Firebase security rules configured and tested
- [ ] Dependencies updated and audited
- [ ] Input validation on all user inputs
- [ ] File upload restrictions in place
- [ ] Rate limiting configured
- [ ] Error handling doesn't expose sensitive data
- [ ] HTTPS enforced
- [ ] Security headers configured

### Regular Maintenance

- [ ] Weekly: Check Firebase usage dashboard
- [ ] Monthly: Run `npm audit` and update dependencies
- [ ] Quarterly: Review and update security rules
- [ ] Yearly: Rotate Firebase API keys
- [ ] As needed: Review error logs for security issues

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

---

## 🚨 Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email the security team directly
3. Provide detailed information about the vulnerability
4. Wait for confirmation before disclosing publicly

---

## 📝 License

This security documentation is part of the Random Selector application.

**Last Updated**: 2025-11-28
**Version**: 1.0.0

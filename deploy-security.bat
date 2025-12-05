@echo off
echo ========================================
echo   Firebase Security Rules Deployment
echo ========================================
echo.

echo Checking Firebase CLI...
firebase --version
if errorlevel 1 (
    echo ERROR: Firebase CLI not found!
    echo Install it with: npm install -g firebase-tools
    pause
    exit /b 1
)
echo.

echo Checking Firebase login...
firebase login:list
if errorlevel 1 (
    echo You need to login first!
    echo Running: firebase login
    firebase login
)
echo.

echo ========================================
echo   Step 1: Deploying Firestore Rules
echo ========================================
firebase deploy --only firestore:rules
if errorlevel 1 (
    echo ERROR: Firestore rules deployment failed!
    pause
    exit /b 1
)
echo ✅ Firestore rules deployed successfully!
echo.

echo ========================================
echo   Step 2: Deploying Storage Rules
echo ========================================
firebase deploy --only storage:rules
if errorlevel 1 (
    echo ERROR: Storage rules deployment failed!
    pause
    exit /b 1
)
echo ✅ Storage rules deployed successfully!
echo.

echo ========================================
echo   Step 3: Verifying Deployment
echo ========================================
echo.
echo Firestore Rules Console:
echo https://console.firebase.google.com/project/spinning-wheel-app-c80c2/firestore/rules
echo.
echo Storage Rules Console:
echo https://console.firebase.google.com/project/spinning-wheel-app-c80c2/storage/rules
echo.

echo ========================================
echo   ✅ ALL SECURITY RULES DEPLOYED!
echo ========================================
echo.
echo Next Steps:
echo 1. Verify rules in Firebase Console (URLs above)
echo 2. Test your app to ensure everything works
echo 3. Deploy updated vercel.json to Vercel:
echo    git add vercel.json .gitignore
echo    git commit -m "Add security headers and protect .env"
echo    git push
echo.

pause

@echo off
echo ========================================
echo   Security Configuration Verification
echo ========================================
echo.

echo [1/5] Checking .gitignore for .env...
findstr /C:".env" .gitignore >nul
if errorlevel 1 (
    echo ❌ FAIL: .env not found in .gitignore
) else (
    echo ✅ PASS: .env is properly ignored
)
echo.

echo [2/5] Checking if .env exists...
if exist .env (
    echo ✅ FOUND: .env file exists
    echo ⚠️  WARNING: Make sure .env is NOT committed to Git!
    echo    Run: git status
    echo    If .env is listed, run: git rm --cached .env
) else (
    echo ⚠️  .env file not found (might be normal if using Vercel env vars)
)
echo.

echo [3/5] Checking Firestore rules file...
if exist firestore.rules (
    echo ✅ FOUND: firestore.rules exists
    for %%A in (firestore.rules) do echo    Size: %%~zA bytes
) else (
    echo ❌ FAIL: firestore.rules not found!
)
echo.

echo [4/5] Checking Storage rules file...
if exist storage.rules (
    echo ✅ FOUND: storage.rules exists
    for %%A in (storage.rules) do echo    Size: %%~zA bytes
) else (
    echo ❌ FAIL: storage.rules not found!
)
echo.

echo [5/5] Checking vercel.json for security headers...
findstr /C:"X-Content-Type-Options" vercel.json >nul
if errorlevel 1 (
    echo ❌ FAIL: Security headers not found in vercel.json
) else (
    echo ✅ PASS: Security headers configured in vercel.json
)
echo.

echo ========================================
echo   Manual Verification Steps
echo ========================================
echo.
echo 1. Check Firebase Rules (login required):
echo    Firestore: https://console.firebase.google.com/project/spinning-wheel-app-c80c2/firestore/rules
echo    Storage:   https://console.firebase.google.com/project/spinning-wheel-app-c80c2/storage/rules
echo.
echo 2. Check Security Headers (after Vercel deployment):
echo    Test at: https://securityheaders.com/
echo    Enter:   https://random-me-rho.vercel.app
echo.
echo 3. Check Git status:
echo    Run: git status
echo    Ensure .env is NOT listed in untracked/tracked files
echo.

echo ========================================
echo   Firebase CLI Commands
echo ========================================
echo.
echo Check login status:
echo    firebase login:list
echo.
echo View deployed Firestore rules:
echo    firebase firestore:rules:get
echo.
echo View deployed Storage rules:
echo    firebase storage:rules:get
echo.

pause

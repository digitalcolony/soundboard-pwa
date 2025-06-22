@echo off
echo 🔊 Building Neil Rogers Soundboard PWA...

set SCRIPT_DIR=%~dp0
set MAIN_SITE_DIR=%SCRIPT_DIR%..

echo 📁 Script directory: %SCRIPT_DIR%
echo 📁 Main site directory: %MAIN_SITE_DIR%

REM Sync soundboard data
echo 📊 Syncing soundboard data...
copy "%MAIN_SITE_DIR%\src\data\soundboard.json" "%SCRIPT_DIR%public\api\sounds.json" >nul

REM Sync sounds directory
echo 🎵 Syncing sounds directory...
if exist "%SCRIPT_DIR%public\sounds" rmdir /s /q "%SCRIPT_DIR%public\sounds"
robocopy "%MAIN_SITE_DIR%\public\sounds" "%SCRIPT_DIR%public\sounds" /e /nfl /ndl /nc /ns /np >nul

REM Sync icons
echo 🎨 Syncing icons...
if not exist "%SCRIPT_DIR%public\icons" mkdir "%SCRIPT_DIR%public\icons"

REM Copy icons with error handling
copy "%MAIN_SITE_DIR%\public\mstile-70x70.png" "%SCRIPT_DIR%public\icons\icon-72x72.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\favicon-96x96.png" "%SCRIPT_DIR%public\icons\icon-96x96.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\favicon-128.png" "%SCRIPT_DIR%public\icons\icon-128x128.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\mstile-144x144.png" "%SCRIPT_DIR%public\icons\icon-144x144.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\apple-touch-icon-152x152.png" "%SCRIPT_DIR%public\icons\icon-152x152.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\android-chrome-192x192.png" "%SCRIPT_DIR%public\icons\icon-192x192.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\android-chrome-192x192.png" "%SCRIPT_DIR%public\icons\icon-384x384.png" >nul 2>&1
copy "%MAIN_SITE_DIR%\public\android-chrome-512x512.png" "%SCRIPT_DIR%public\icons\icon-512x512.png" >nul 2>&1

REM Copy favicon
copy "%MAIN_SITE_DIR%\public\favicon.svg" "%SCRIPT_DIR%public\favicon.svg" >nul 2>&1

echo ✅ Assets synced successfully

REM Install dependencies if needed
if not exist "%SCRIPT_DIR%node_modules" (
    echo 📦 Installing dependencies...
    cd /d "%SCRIPT_DIR%"
    call npm install
)

REM Build the PWA
echo 🔨 Building PWA...
cd /d "%SCRIPT_DIR%"
call npm run build

echo ✅ PWA build complete!
echo 🚀 Run 'npm run preview' to test the built PWA
echo 📱 The PWA is ready for deployment from the 'dist' directory

pause

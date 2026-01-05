@echo off
echo Starting LEAVE Game Server...
echo.
echo Game will be available at: http://localhost:8000
echo Opening browser automatically...
echo.

cd dist/public
python -m http.server 8000

pause

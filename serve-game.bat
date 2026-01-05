@echo off
echo Starting LEAVE Game Server...
echo.
echo Game will be available at: http://localhost:3000
echo Opening browser automatically...
echo.

cd dist/public
npx serve -s . -l 3000 --cors

pause

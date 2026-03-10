@echo off
echo Starting WNotes...
powershell -ExecutionPolicy Bypass -Command "npm run electron:preview"
pause

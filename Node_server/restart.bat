cd /D "%~dp0"

@echo off
REM Update machen
call svn_update.bat

REM server schließen
taskkill /fi "WINDOWTITLE eq wilken maps server"
echo server wurde gestopt...
echo.

REM server wieder starten
call run.bat
echo.
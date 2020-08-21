FOR /F "tokens=2" %%A IN ('tasklist /v ^| findstr /i "startNodeF startNodeC startHub"') DO TASKKILL /F /PID %%A
timeout /t 1

FOR /F "tokens=1" %%A IN ('C:\Programme\Java\jdk1.8.0_92\bin\jps -v ^| findstr /i "selenium-server-standalone-3.141.59.jar"') DO TASKKILL /F /PID %%A
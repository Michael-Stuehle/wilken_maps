start SeleniumServer\startHub.bat
timeout /t 4

start SeleniumServer\startNodeC.bat
start SeleniumServer\startNodeF.bat

timeout /t 4

rem "start" ist der klassenname der main klasse
java -cp target/make_backup-1.0-SNAPSHOT.jar start

call SeleniumServer\close.bat

pause
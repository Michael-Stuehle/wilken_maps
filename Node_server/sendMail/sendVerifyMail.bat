%~d0
cd %~dp0

java -cp ".;lib/javax.mail-1.6.1.jar" Mail "%2" "%1" "%3"
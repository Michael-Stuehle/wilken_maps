%~dp0
cd %~dp0

java -cp ".;lib/javax.mail-1.6.1.jar" Mail "%1" "neues passwort (nur fuer 1 Stunde gueltig): %2"
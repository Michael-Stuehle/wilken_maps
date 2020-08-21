TITLE startHub
cd /d %~dp0
java -jar .\selenium-server-standalone-3.141.59.jar -role hub -maxSession 5 -host localhost 

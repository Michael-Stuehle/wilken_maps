TITLE startNodeF
cd /d %~dp0
java -Dwebdriver.firefox.driver="geckodriver.exe" -jar .\selenium-server-standalone-3.141.59.jar -role node -hub http://localhost:4444/grid/register -port 35183 -capabilities browserName=firefox,platform=windows,maxInstances=3


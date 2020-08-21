var port = 8080;
var serverUrl = "127.0.0.1";
var mysqlConnection = require('./MySqlConnection');

var fs = require("fs");
var express = require("express");
var app = express()

console.log("Starting web server at " + serverUrl + ":" + port);

app.use(express.static('public'));

app.get('/mitarbeiter.txt', function(request, response){
	mysqlConnection.getUsers(function(result) {
		response.send('<pre style="word-wrap: break-word; white-space: pre-wrap;">' + result + '</pre>');
	})
}); 

app.listen(port, () => console.log(`listening on port ${port}!`))
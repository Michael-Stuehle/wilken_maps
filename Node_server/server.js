var port = 8080;
var serverUrl = "127.0.0.1";
var mysqlConnection = require('./MySqlConnection');

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { Console } = require('console');

var allowedUrls = ['/auth', '/register', '/changePassword', '/register.html', 'changePassword.html', '/salt'];

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.use(function (req, res, next) {
	if (req.session.loggedin || allowedUrls.indexOf(req.originalUrl) > -1) {
		next()
	}else{
		console.log("not logged in");
		res.sendFile(path.join(__dirname + '/public/login.html'));
	}
})

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/login.html'));
});

app.post('/register', function(request, response){
	var username = request.body.username;
	var password = request.body.password;
	if (!username.endsWith('@wilken.de')) {
		response.send('E-Mail muss auf "@wilken.de" enden')		
	}else {
		mysqlConnection.checkUserExists(username, function(result){
			if (result) {
				response.send('der Benutzer: "'+username+'" existiert bereits')
			}
			else{
				console.log(password);
				mysqlConnection.registerUser(username, password);
				response.send('Registrieren erfolgreich')
			}
		});
	}
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var clientSalt = request.body.salt;
	var serverSalt = request.session.salt;
	if (username && password) {
		mysqlConnection.checkPasswordForUser(username, password, clientSalt, serverSalt, function(results){
			if (results) {
				console.log('login erfolgreich');
				request.session.loggedin = true;
				request.session.username = username;
				app.use(express.static("public"));
				response.send('Welcome back, ' + request.session.username + '!');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		})
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/home.html'));
});

app.get('/logout', function(request, response){
	request.session.destroy(function(err) {
		if (err) {
			throw err;
		}
		response.redirect('/');
	});
});

app.get('/permissions', function(request, response){
	mysqlConnection.getPermissionsForUser(request.session.username, function(result){
		response.send(result);
	})
	response.end();
});

function makeSalt(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

app.get('/salt', function(request, response){
	request.session.salt;
	if (request.session.salt === undefined ) {
		var salt = makeSalt(10);
		request.session.salt = salt;
		response.send(salt);
	}else{
		response.send(request.session.salt);
	}
	response.end();
});

app.get('/register.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/register.html"));
});

app.get('/mitarbeiter.txt', function(request, response){
	/*mysqlConnection.getMitarbeiter(function(result) {
		response.send('<pre style="word-wrap: break-word; white-space: pre-wrap;">' + result + '</pre>');
	})*/
	response.send('<pre style="word-wrap: break-word; white-space: pre-wrap;">' + 'name=raum' + '</pre>')
}); 

app.listen(port, () => console.log(`listening on port ${port}!`))
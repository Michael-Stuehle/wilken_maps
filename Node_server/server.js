var port = 8080;
var serverUrl = "127.0.0.1";
var mysqlConnection = require('./MySqlConnection');

var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { Console } = require('console');
const { exec } = require("child_process");
const { checkUserExists } = require('./MySqlConnection');

var allowedUrls = ['/auth', '/register', '/register.html', '/salt', '/passwordVergessen.html', '/passwordVergessen'];

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

app.post('/passwordVergessen', function(request, response){
	var username = request.body.username;
	var password = makeSalt(6);	
	checkUserExists(username, function(result){
		if (result) {
			mysqlConnection.set1malPasswort(username, password, function(result){
				if (result) {
					sendPasswordVergessenMail(username, password, function(result){
						if (result) {
							response.send('mail wurde gesendet');
						}
					})
				}	
			});
		}else{
			response.send('der benuezter: "' + username + '" existiert nicht');
		}
	})
	
});

var sendPasswordVergessenMail = function (username, password, callback){
	var sendMailBat = path.join(__dirname + "/sendMail/sendPasswortVergessenMail.bat"); 
	exec(sendMailBat + " " + username + " " + password, function(error, stdout, stderr){
		if (error) throw error;
		return callback(true)
	});
}

app.post('/changePassword', function(request, response){
	var username = request.session.username;
	var password = request.body.password;
	var newPassword = request.body.newPassword;
	var clientSalt = request.body.salt;
	var serverSalt = request.session.salt;
	
	mysqlConnection.checkPasswordForUser(username, password, clientSalt, serverSalt, function(result){
		if (result) {
			mysqlConnection.changePassword(username, newPassword, function(result){
				if (result) {
					response.send('passwort erfolgreich geändert!');
				}
			});			
		}else{
			mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, clientSalt, serverSalt, function(result){
				if (result) {
					mysqlConnection.changePassword(username, newPassword, function(result){
						if (result) {
							response.send('passwort erfolgreich geändert!');
						}
					});			
				}else{
					response.send('passwort falsch');
				}
			});
		}
	})	
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
				response.end();
			} else {
				// auf 1mal passwort prüfen
				mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, clientSalt, serverSalt, function(result){
					if (result) {
						console.log('login erfolgreich');
						request.session.loggedin = true;
						request.session.username = username;
						app.use(express.static("public"));
						response.send('Welcome back, ' + request.session.username + '!');
					}else{
						response.send('Incorrect Username and/or Password!');
					}
					response.end();
				})
			}			
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

app.get('/angemeldetAls', function(request, response){
	console.log('angemeldet als get');
	response.send(request.session.username);
})

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

app.get('/changePassword.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/changePassword.html"));
});

app.get('/passwordVergessen.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/passwordVergessen.html"));
});


app.get('/mitarbeiter.txt', function(request, response){
	mysqlConnection.getMitarbeiter(function(result) {
		response.send('<pre style="word-wrap: break-word; white-space: pre-wrap;">' + result + '</pre>');
	})
	//response.send('<pre style="word-wrap: break-word; white-space: pre-wrap;">' + 'name=raum' + '</pre>')
}); 

app.listen(port, () => console.log(`listening on port ${port}!`))
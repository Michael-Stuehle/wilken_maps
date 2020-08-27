var port = 80;
var serverUrl = "127.0.0.1";
var mysqlConnection = require('./MySqlConnection');
var logger = require('./logger');
var formatSql = require('./formatSql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { exec } = require("child_process");
var favicon = require('serve-favicon');

// zugriff auf diese urls auch ohne angemeldet zu sein
// ???.html = html seite 
// ??? 		= post an server (gesendet von ???.html)
var allowedUrls = ['/auth', '/register', '/register.html', '/salt', '/passwordVergessen.html', '/passwordVergessen'];

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// fenster icon
app.use(favicon(path.join(__dirname,'public','images','logo.png')));

// aufruf dieser function vor allen get / post / etc.
app.use(function (req, res, next) {
	// prüfung ob angemeldet / anmedlung nicht erforderlich ist
	if (req.session.loggedin || allowedUrls.indexOf(req.originalUrl) > -1) {
		next()
	}else{
		// falls nicht wird auf login seite weitergeleitet
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
				mysqlConnection.registerUser(username, password);
				response.send('Registrieren erfolgreich');
				logger.log('user: ' + username + ' hat sich registriert');
			}
		});
	}
});

app.post('/passwordVergessen', function(request, response){
	var username = request.body.username;
	var password = makeSalt(6);	
	mysqlConnection.checkUserExists(username, function(result){
		if (result) {
			mysqlConnection.set1malPasswort(username, password, function(result){
				if (result) {
					sendPasswordVergessenMail(username, password, function(result){
						if (result) {
							response.send('mail wurde gesendet');
							logger.log('user: ' + username + ' hat sein passwort zurückgesetzt');
						}
					})
				}	
			});
		}else{
			response.send('der benuezter: "' + username + '" existiert nicht');
		}
	})
	
});

// ruft externes java programm auf um die mail zu senden (java programm sendet per mail1.rechenzentrum.wilken)
var sendPasswordVergessenMail = function (username, password, callback){
	var sendMailBat = path.join(__dirname + "/sendMail/sendPasswortVergessenMail.bat"); 
	logger.log(sendMailBat);
	exec("call " + sendMailBat + " " + username + " " + password, function(error, stdout, stderr){
		if (error) throw error;
		if (stderr)	console.log(stderr);
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
					logger.log('user: ' + username + ' hat sein passwort geändert');
				}
			});			
		}else{
			mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, clientSalt, serverSalt, function(result){
				if (result) {
					mysqlConnection.changePassword(username, newPassword, function(result){
						if (result) {
							response.send('passwort erfolgreich geändert!');
							logger.log('user: ' + username + ' hat sein passwort geändert');
						}
					});			
				}else{
					response.send('passwort falsch');
				}
			});
		}
	})	
});

// sql befehl wird vom sql panel an datenbank weitergeleitet
app.post('/sql', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			mysqlConnection.execSql(request.body.sql, function(err, result, fields){
				if (err) {
					response.send(err);
				}else{
					response.send(formatSql.formatAsHtmlTable(result, fields));
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
		// normales passwort prüfen
		mysqlConnection.checkPasswordForUser(username, password, clientSalt, serverSalt, function(results){
			if (results) {
				authErfolgreich(request, response, username);
			} else {
				// auf 1mal passwort prüfen
				mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, clientSalt, serverSalt, function(result){
					if (result) {
						authErfolgreich(request, response, username);
					}else{
						response.send('Incorrect Username and/or Password!');
						response.end();
					}
				})
			}			
		})
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}	
});

// falls erfolgreich angemeldet wurde wird homepage/app/etc. freigegeben
var authErfolgreich = function(request, response, username){
	request.session.loggedin = true;
	request.session.username = username;
	logger.log('user: '+username+' hat sich angemeldet');
	app.use(express.static("public"));
	response.send('Welcome back, ' + request.session.username + '!');
	response.end();
}

app.get('/home', function(request, response) {
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			response.sendFile(path.join(__dirname + '/public/home_sql.html'));
		}else{
			response.sendFile(path.join(__dirname + '/public/home.html'));
		}
	});
});

// beendet die sesssion und leitet zu loggin-seite weiter
app.get('/logout', function(request, response){
	var username = request.session.username;
	request.session.destroy(function(err) {
		if (err) {
			throw err;
		}
		logger.log('user: '+username+' hat sich abgemeldet');
		response.redirect('/');
	});
});

// salt für passwort (length zufällige chars)
function makeSalt(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

 // 1 salt pro session
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

// permissions für unity programm
// WICHTIG: hat nichts mit datenbank berechtigungen zu tun
// 			representiert eine extra datenbank-tabelle (rank)
app.get('/permissions', function(request, response){
	var username = request.session.username;
	mysqlConnection.getPermissionsForUser(username, function(result){
		logger.log('user: '+username+' hat berechtigung für '+result );
		response.send(result);
		response.end();
	})
});

// seite um sql befehle abzusenden (berechtigung nicht in * enthalten)
app.get('/sql.html', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			response.sendFile(path.join(__dirname + '/public/sql.html'));
		}
	})
})

app.get('/angemeldetAls', function(request, response){
	response.send(request.session.username);
})

app.get('/register.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/register.html"));
});

app.get('/changePassword.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/changePassword.html"));
});

app.get('/passwordVergessen.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/passwordVergessen.html"));
});

// erstellt mitarbeiter liste aus datenbank einträgen (verwendung für unity programm)
app.get('/mitarbeiter.txt', function(request, response){
	mysqlConnection.getMitarbeiter(function(result) {
		response.send('<pre style="word-wrap: break-word; white-space: pre-wrap;">' + result + '</pre>');
	})
}); 

app.listen(port, () => console.log(`listening on port ${port}!`))
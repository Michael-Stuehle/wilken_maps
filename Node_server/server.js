var port = 80;
var serverUrl = "http://ul-ws-mistueh";
var mysqlConnection = require('./MySqlConnection');
var einstellungen = require('./einstellung');
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
var allowedUrls = ['/auth', '/register', '/register.html', '/salt', '/passwordVergessen.html', '/passwordVergessen', '/verify', '/verify.html', '/style.css'];

var app = express();
app.use(session({
	secret: generateRandomString(128),
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// fenster icon
app.use(favicon(path.join(__dirname,'public','images','logo.png')));

function isInAllowedUrls(value){
	for (let index = 0; index < allowedUrls.length; index++) {
		if (value.startsWith(allowedUrls[index])) {
			return true;
		}
	}
	return false;
}

// aufruf dieser function vor allen get / post / etc.
app.use(function (req, res, next) {
	// prüfung ob angemeldet / anmedlung nicht erforderlich ist
	if (req.session.loggedin || isInAllowedUrls(req.originalUrl)) {
		next()
	}else{
		// falls nicht wird auf login seite weitergeleitet
		res.sendFile(path.join(__dirname + '/public/login.html'));
	}
})

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/style.css', function(request, response){
	response.sendFile(path.join(__dirname + '/public/style.css'))
})

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
				var token = generateRandomStringSafe(20);
				sendVerifyMail(username, token, function(mailSent){
					if (mailSent) {
						console.log("gesendet");
					}
				})
				mysqlConnection.registerUser(username, password, token, function(result){
					if (result) {
						logger.log('user: ' + username + ' wurde erfolgreich regsitriert!', request.ip);
						request.
						response.send('Registrieren erfolgreich');
					}else{
						response.send('Registrieren nicht erfolgreich');
					}
				});
				
			}
		});
	}
});

var randomPasswort = function(){
    var length = 6;
    var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


app.post('/passwordVergessen', function(request, response){
	var username = request.body.username;
	var password = randomPasswort(6);	
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

	mysqlConnection.checkPasswordForUser(username, password, function(result){
		if (result) {
			mysqlConnection.changePassword(username, newPassword, function(result){
				if (result) {
					response.send('passwort erfolgreich geändert!');
					logger.log('user: ' + username + ' hat sein passwort geändert');
				}
			});			
		}else{
			mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, function(result){
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

function sendVerifyMail(username, token, callback){
	//logger.log("sendVerifyMail is not yet implemented");
	//return callback(false);
	var sendMailBat = path.join(__dirname + "/sendMail/sendVerifyMail.bat")+ " " + serverUrl + ":" + port + " " + username + " " + token;
	exec("call " + sendMailBat , function(error, stdout, stderr){
		if (error) throw error;
		if (stderr)	console.log(stderr);
		return callback(true)
	});
}

app.post('/verify', function(request, response){
	var username = request.body.username;
	mysqlConnection.isUserVerified(username, function(isVerified){
		if (!isVerified) {
			mysqlConnection.verifieUserWithToken(username, request.body.verificationToken, function(verifySuccess){
				if (verifySuccess) {
					logger.log(username + " wurde verifiziert");
					response.send("verifizierung erfolgreich");
					response.end();
				}else{
					response.send("verifizierung nicht erfolgreich");
					response.end();
				}
			})
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

app.post('/einstellungen', function(request, response){
	var einstellungen = [];
	for(const [key, value] of Object.entries(request.body)){
		einstellungen.push({name: key, value: value});
	}
	mysqlConnection.setEinstellungenForUser(request.session.username, einstellungen, function(result){
		if (result) {
			response.send('Speichern erfolgreich!');
		}else{
			response.send('fehler beim speichern');
		}
	})
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		mysqlConnection.isUserVerified(username, function(isverified){
			if (isverified) {
				// normales passwort prüfen
				mysqlConnection.checkPasswordForUser(username, password, function(results){
					if (results) {
						authErfolgreich(request, response, username);
					} else {
						// auf 1mal passwort prüfen
						mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, function(result){
							if (result) {
								authErfolgreich(request, response, username);
							}else{
								response.send('Incorrect Username and/or Password!');
								response.end();
							}
						})
					}			
				})
			}else{
				response.send('bitte e-mail verifizieren!');
			}
		});
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
	// bug wenn man direkt nach abmelden auf zurück drukt wird seite geladen
	var username = request.session.username;
	request.session.loggedin = false;
	request.session.destroy(function(err) {
		if (err) {
			throw err;
		}
		logger.log('user: '+username+' hat sich abgemeldet');
		response.redirect('/');
	});
});

// sends verify html file (hat unsichtbare from und macht einen post zurück an den server per url parametern)
app.get('/verify.html/:username/:token', function(request, response){
	response.sendFile(path.join(__dirname + '/public/verify.html'));
})

// salt für passwort (length zufällige chars)
function generateRandomString(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?_-:;.,<>|^°[]²³';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

 // salt für passwort (length zufällige chars)
 // safe hat keine zeichen (nur A-Z a-z 0-9)
function generateRandomStringSafe(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }
 
 // 1 salt pro user
app.post('/salt', function(request, response){
	if (request.body.username === undefined ) {
		response.send(generateRandomString(128));
		response.end();
	}else{
		mysqlConnection.getSaltForUSer(request.body.username, function(result){
			response.send(result);
			response.end();
		})
	}
});

// permissions für unity programm
// WICHTIG: hat nichts mit datenbank berechtigungen zu tun
// 			representiert eine extra datenbank-tabelle (rank)
app.get('/permissions', function(request, response){
	var username = request.session.username;
	mysqlConnection.getPermissionsForUser(username, function(result){
		response.send(result);
		response.end();
	})
});


app.get('/einstellungen.html', function(request, response){
	var username = request.session.username;
	mysqlConnection.getEinstellungenForUser(username, function(result){
		response.send(einstellungen.buildEinstellungenSeite(result))
	});
});

// seite um sql befehle abzusenden (berechtigung nicht in * enthalten)
app.get('/sql.html', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			response.sendFile(path.join(__dirname + '/public/sql.html'));
		}
	})
})

app.get('/getProceduresAndFunctions', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			mysqlConnection.getallProceduresAndFunctions(function(text){
				response.send(text);
			})			
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
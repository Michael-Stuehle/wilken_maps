const mysqlConnection = require('./SQL/MySqlConnection');
const einstellungen = require('./RequestHandlers/einstellung');
const formatSql = require('./formatSql');
const HanldeRegistration = require('./RequestHandlers/HanldeRegistration');
const HandleLogin = require('./RequestHandlers/HandleLogin');
const Helper = require('./RequestHandlers/Helper');
const { isGast } = require('./RequestHandlers/Helper');
const constants = require('./constants');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
const HandleAdminpage = require('./RequestHandlers/HandleAdminpage');
const { con } = require('./SQL/Globalconnection');
const { exec } = require("child_process");
const { resolve } = require('path');
const logger = require('./logger');
const helperSQL = require('./SQL/helperSQL');

const DO_SVN_UPDATE_AFTER_MINUTES = 60;

// zugriff auf diese urls auch ohne angemeldet zu sein
// ???.html = html seite 
// ??? 		= post an server (gesendet von ???.html)
var allowedUrls = ['/auth', '/login.html', '/register', '/register.html', '/changePassword.html', '/changePassword', '/salt', '/passwordVergessen.html', '/passwordVergessen', '/verify', '/verify.html', '/style.css', '/script.js', '/raumliste.txt', '/mitarbeiter.txt'];
var NotAllowedForGast = ['/einstellungen.html', '/changePassword.html', '/changePassword'];


var app = express();

function callRestartBat(){
	let pr = path.join(process.cwd() + "/restart.bat");
	exec("start " + pr , function(error, stdout, stderr){
		if (error) logger.logError('fehler beim svn-update/neu starten des servers', error)
		if (stdout) console.log(stdout);
		if (stderr)	console.log(stderr);
	});
}

// wird alle "60" minuten ausgeführt.
function doUpdateAndRestart(){
	setInterval(function() {
		callRestartBat();
	  }, DO_SVN_UPDATE_AFTER_MINUTES * 60 * 1000);
}
//doUpdateAndRestart();

app.use(session({
	secret: Helper.generateRandomString(128),
	resave: true,
	saveUninitialized: true
}));

// aufruf dieser function vor allen get / post / etc.
app.use(function (req, res, next) {
	// prüfung ob angemeldet / anmedlung nicht erforderlich ist
	if (req.session.loggedin || isInAllowedUrls(req.originalUrl)) {
		if (req.session.loggedin && isGast(req.session.username) && !isAllowedForGast(req.originalUrl)) {
			res.redirect('/home');
		}else{
			next();
		}
	}else{
		// falls nicht wird auf login seite weitergeleitet
		res.redirect('/login.html');
	}
})

app.use('/components/', express.static(path.join(__dirname +"/public/components/")));
app.use('/2d/', express.static(path.join(__dirname +"/public/2d/")));

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

function isAllowedForGast(value){
	for (let index = 0; index < NotAllowedForGast.length; index++) {
		if (value.startsWith(NotAllowedForGast[index])) {
			return false;
		}
	}
	return true;
}

app.post('/register', function(request, response){
	HanldeRegistration.register(request, response);
});

app.post('/restartServer', function(request, response){
	helperSQL.getPermissionsUser(request.session.username, function(perms){
		if (perms.includes('server_restart')) {
			logger.log('user: ' + request.session.username + ' hat den server neu gestartet', request.ip)
			callRestartBat();
		}
	}) 
})

app.post('/passwordVergessen', function(request, response){
	HandleLogin.passwortVergessen(request, response);	
});

app.post('/changePassword', async function(request, response){
	HandleLogin.changePassword(request, response);
});

app.post('/verify', function(request, response){
	HanldeRegistration.verify(request, response);
});

// sql befehl wird vom sql panel an datenbank weitergeleitet
app.post('/sql', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			mysqlConnection.execSql(request.body.sql, function(err, result, fields){
				if (err) {
					response.send(formatSql.formatAsNormalResult(err));
				}else if (result.fieldCount == 0){
					response.send(formatSql.formatAsNormalResult(JSON.stringify(result)));
				}else{
					response.send(formatSql.formatAsHtmlTable(result, fields));
				}
			});
		}
	})
});

app.post('/einstellungen', function(request, response){
	if (isGast(request.session.username)) {
		response.redirect('/');
	}
	einstellungen.einstellungenSpeichern(request, response);
});

app.post('/auth', function(request, response) {
	HandleLogin.login(request, response);
});

app.post('/raumliste', function(request, response){
	HandleAdminpage.Speichern(request, response);
})

app.get('/', function(request, response) {
	response.redirect('/home');
});

app.get('/style.css', function(request, response){
	response.sendFile(path.join(__dirname + '/public/style.css'))
})

app.get('/dark_mode', function(request, response){
	einstellungen.getDarkMode(request, response);
})

app.get('/script.js', function(request, response){
	response.sendFile(path.join(__dirname + '/public/script.js'));
})

app.get('/home', function(request, response) {
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			response.sendFile(path.join(__dirname + '/public/home_sql.html'));
		}
		mysqlConnection.hasPermissionForAdminPage(request.session.username, function(hasPerm){
			if (hasPerm) {
				response.sendFile(path.join(__dirname + '/public/home_admin.html'));
			}else if (isGast(request.session.username)){
				response.sendFile(path.join(__dirname + '/public/home_gast.html'));
			}else{
				response.sendFile(path.join(__dirname + '/public/home.html'));
			}
		})
		
	});
});

app.get('/login.html', function(request, response){
	response.sendFile(path.join(__dirname + '/public/login.html'));
})

// beendet die sesssion und leitet zu loggin-seite weiter
app.get('/logout', function(request, response){
	HandleLogin.logout(request, response);
});

// sends verify html file (hat unsichtbare from und macht einen post zurück an den server per url parametern)
app.get('/verify.html/:username/:token', function(request, response){
	response.sendFile(path.join(__dirname + '/public/verify.html'));
})

// 1 salt pro user
// eigentlich ein GET, muss aber mit post benutzt werden, um an username ranzukommen
app.post('/salt', function(request, response){
	HandleLogin.getSalt(request, response);
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
	if (isGast(request.session.username)) {
		response.redirect('/');
	}
	mysqlConnection.getEinstellungenForUser(username, function(result){
		response.send(einstellungen.buildEinstellungenSeite(result))
	});
});

app.get('/einstellungen.css', function(request, response){
	response.sendFile(path.join(__dirname + '/public/einstellungen.css'))
})

// seite um sql befehle abzusenden (berechtigung nicht in * enthalten)
app.get('/sql.html', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			response.sendFile(path.join(__dirname + '/public/sql.html'));
		}
	})
});

app.get('/sqlInterface.css', function(request, response){
	mysqlConnection.hasPermissionForSQL(request, function(result){
		if (result) {
			response.sendFile(path.join(__dirname + '/public/sqlInterface.css'));
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

app.get('/adminpage.html', function(request, response){
	HandleAdminpage.getAdminPage(request, response);
})

app.get('/adminpage.css', function(request, response){
	response.sendFile(path.join(__dirname + '/public/adminpage.css'));
})

app.get('/adminpageScript.js', function(request, response){
	response.sendFile(path.join(__dirname + '/public/adminpageScript.js'))
})

app.get('/mitarbeiterEdit.js', function(request, response){
	response.sendFile(path.join(__dirname + '/public/mitarbeiterEdit.js'))
})

app.get('/raumEdit.js', function(request, response){
	response.sendFile(path.join(__dirname + '/public/raumEdit.js'))
})

app.get('/angemeldetAls', function(request, response){
	response.send(request.session.username);
})

app.get('/register.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/register.html"));
});

app.get('/changePassword.html', async function(request, response){
	if (request.session.loggedin || await HandleLogin.checkloginEinmalPasswort(request)) {
		response.sendFile(path.join(__dirname + "/public/changePassword.html"));
	}else{
		response.redirect('/login.html')
	}
});

app.get('/passwordVergessen.html', function(request, response){
	response.sendFile(path.join(__dirname + "/public/passwordVergessen.html"));
});

app.get('/raumliste.txt', function(request, response){
	mysqlConnection.getRaumListe(function(resultJSON){
		response.send(JSON.stringify(resultJSON));
	})
})

// erstellt mitarbeiter liste aus datenbank einträgen (verwendung für unity programm)
app.get('/mitarbeiter.txt', function(request, response){
	mysqlConnection.getMitarbeiter(function(result) {
		response.send(result);
	})
}); 



app.listen(constants.port, () => console.log(`listening on port ${constants.port}!`))
const Helper = require("./Helper");
var express = require('express');
var mysqlConnection = require('../SQL/MySqlConnection');
const logger = require("../logger");

module.exports = {

    login: function(request, response) {
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
    },

    getSalt: function(request, response){
        if (request.body.username === undefined ) {
            response.send(Helper.generateRandomString(128));
            response.end();
        }else{
            mysqlConnection.getSaltForUser(request.body.username, function(result){
                response.send(result);
                response.end();
            })
        }
    },

    // beendet die sesssion und leitet zu loggin-seite weiter
    logout: function(request, response){
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
    },

    passwortVergessen: function(request, response){
        var username = request.body.username;
        var password = Helper.generateRandomStringSafe(6);	
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
        
    },

    changePassword: function(request, response){
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
    }
}


// falls erfolgreich angemeldet wurde wird homepage/app/etc. freigegeben
var authErfolgreich = function(request, response, username){
	request.session.loggedin = true;
	request.session.username = username;
	logger.log('user: '+username+' hat sich angemeldet');
	app.use(express.static("public"));
	response.send('Welcome back, ' + request.session.username + '!');
	response.end();
}

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
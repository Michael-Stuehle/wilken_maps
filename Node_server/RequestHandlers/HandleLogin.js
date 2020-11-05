const Helper = require("./Helper");
var express = require('express');
var mysqlConnection = require('../SQL/MySqlConnection');
const logger = require("../logger");
var path = require('path');
const { exec } = require("child_process");
const verschluesselung = require("../verschluesselung");
const helperSQL = require("../SQL/helperSQL");
const { getSaltForUser } = require("../SQL/MySqlConnection");

module.exports = {

    login: function(request, response) {
        let username = request.body.username;
        let password = request.body.password;
        if (username && password) {
            mysqlConnection.isUserVerified(username, function(isverified){
                if (isverified) {
                    // normales passwort prüfen
                    mysqlConnection.checkPasswordForUser(username, password, function(results){
                        if (results) {
                            authErfolgreich(request, response, username);
                        } else {
                            response.send('Incorrect Username and/or Password!');
                            response.end();
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
            logger.log('user: '+username+' hat sich abgemeldet', request.connection.remoteAddress);
            response.redirect('/');
        });
    },

    passwortVergessen: function(request, response){
        let username = request.body.username;
        let password = Helper.generateRandomStringSafe(6);	
        helperSQL.getSalt(username, function(salt){
            var hash1 = verschluesselung.md5(password);
            var hash2 = verschluesselung.md5(hash1 + salt);
            var final = verschluesselung.PBKDF2(hash2, salt);
            mysqlConnection.checkUserExists(username, function(result){
                if (result) {
                    mysqlConnection.set1malPasswort(username, final, function(result){
                        if (result) {
                            sendPasswordVergessenMail(username, password, function(result){
                                if (result) {
                                    response.send('mail wurde gesendet');
                                    logger.log('user: ' + username + ' hat sein passwort zurückgesetzt',  request.connection.remoteAddress);
                                }
                            })
                        }	
                    });
                }else{
                    response.send('der benuezter: "' + username + '" existiert nicht');
                }
            })
        })       
    },

    changePassword: function(request, response){
        let username = request.body.username;
        let password = request.body.password;
        let newPassword = request.body.newPassword;
        mysqlConnection.checkPasswordForUser(username, password, function(result){
            if (result) {
                mysqlConnection.changePassword(username, newPassword, function(result){
                    if (result) {
                        response.send('passwort erfolgreich geändert!');
                        logger.log('user: ' + username + ' hat sein passwort geändert',  request.connection.remoteAddress);
                    }
                });			
            }else{
                mysqlConnection.checkPasswordForUserPasswordVergessen(username, password, function(result){
                    if (result) {
                        mysqlConnection.changePassword(username, newPassword, function(result){
                            if (result) {
                                response.send('passwort erfolgreich geändert!');
                                logger.log('user: ' + username + ' hat sein passwort geändert', request.connection.remoteAddress);
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

module.exports.checkloginEinmalPasswort = checkloginEinmalPasswort;

async function checkloginEinmalPasswort(request){
    return new Promise(resolve => {
        let username = request.query.username;
        let password = request.query.password; // plain text passwort
        if (username && password) {
            helperSQL.getSalt(username, function(salt){
                var hash1 = verschluesselung.md5(password);
                var hash2 = verschluesselung.md5(hash1 + salt);
                 // 1 mal passwort prüfen
                mysqlConnection.checkPasswordForUserPasswordVergessen(username, hash2, function(results){
                    if (results) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }			
                })           
            })       
        }else{
            resolve(false);
        }  
    })
}


// falls erfolgreich angemeldet wurde wird homepage/app/etc. freigegeben
var authErfolgreich = function(request, response, username){
	request.session.loggedin = true;
	request.session.username = username;
	logger.log('user: '+username+' hat sich angemeldet', request.connection.remoteAddress);
	response.send('Welcome back, ' + request.session.username + '!');
	response.end();
}

// ruft externes java programm auf um die mail zu senden (java programm sendet per mail1.rechenzentrum.wilken)
var sendPasswordVergessenMail = function (username, password, callback){
	let sendMailBat = path.join(process.cwd() + "/sendMail/sendPasswortVergessenMail.bat"); 
	exec("call " + sendMailBat + " " + username + " " + password, function(error, stdout, stderr){
		if (error) throw error;
		if (stderr)	console.log(stderr);
		return callback(true)
	});
}
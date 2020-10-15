const logger = require('../logger');
var mysqlConnection = require('../SQL/MySqlConnection');
var path = require('path');
const { exec } = require("child_process");
const helper = require('./Helper');
const constants = require('../constants');

module.exports = {
    register : function(request, response){
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
                    var token = helper.generateRandomStringSafe(20);
                    sendVerifyMail(username, token, function(mailSent){
                        if (mailSent) {
                            console.log("gesendet");
                        }
                    })
                    mysqlConnection.registerUser(username, password, token, function(result){
                        if (result) {
                            logger.log('user: ' + username + ' wurde erfolgreich regsitriert!', request.ip);
                            response.send('Registrieren erfolgreich');
                        }else{
                            response.send('Registrieren nicht erfolgreich');
                        }
                    });
                    
                }
            });
        }
    },

    verify: function(request, response){
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
    }
}

function sendVerifyMail(username, token, callback){
	//logger.log("sendVerifyMail is not yet implemented");
	//return callback(false);
	var sendMailBat = path.join(__dirname + "/sendMail/sendVerifyMail.bat")+ " " + constants.serverUrl + ":" + constants.port + " " + username + " " + token;
	exec("call " + sendMailBat , function(error, stdout, stderr){
		if (error) throw error;
		if (stderr)	console.log(stderr);
		return callback(true)
	});
}
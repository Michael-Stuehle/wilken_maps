const logger = require('../logger');
var mysqlConnection = require('../SQL/MySqlConnection');
var path = require('path');
const { exec } = require("child_process");
const helper = require('./Helper');
const constants = require('../constants');

module.exports = {
    register : function(request, response){
        let username = request.body.username;
        let password = request.body.password;
        let raum_id = request.body.raum_id;
        console.log(raum_id);
        if (!username.endsWith('@wilken.de')) {
            response.send('E-Mail muss auf "@wilken.de" enden')		
        }else {
            mysqlConnection.checkUserExists(username, function(result){
                if (result) {
                    response.send('der Benutzer: "'+username+'" existiert bereits')
                }
                else{
                    let token = helper.generateRandomStringSafe(20);
                    mysqlConnection.registerUser(username, password, raum_id, token, function(result){
                        if (result) {
                            logger.log('user: ' + username + ' wurde erfolgreich regsitriert!', request.connection.remoteAddress);
                            response.send('Registrieren erfolgreich');
                            sendVerifyMail(username, token, function(mailSent){
                                if (mailSent) {
                                    logger.log("verifizierungs-mail gesendet!");
                                }
                            })
                        }else{
                            response.send('Registrieren nicht erfolgreich');
                        }
                    });
                    
                }
            });
        }
    },

    verify: function(request, response){
        let username = request.body.username;
        mysqlConnection.isUserVerified(username, function(isVerified){
            if (!isVerified) {
                mysqlConnection.verifieUserWithToken(username, request.body.verificationToken, function(verifySuccess){
                    if (verifySuccess) {
                        logger.log(username + " wurde verifiziert", request.connection.remoteAddress);
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
	let sendMailBat = path.join(process.cwd() + "/sendMail/sendVerifyMail.bat")+ " " + constants.serverUrl + ":" + constants.port + " " + username + " " + token;
	exec("call " + sendMailBat , function(error, stdout, stderr){
		if (error) throw error;
		if (stderr)	console.log(stderr);
		return callback(true)
	});
}
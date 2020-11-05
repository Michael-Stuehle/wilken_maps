const logger = require('../logger');
const helperSQL = require('./helperSQL');
const globalconnection = require('./Globalconnection');
const verschluesselung = require ('../verschluesselung');
const Helper = require('../RequestHandlers/Helper');

module.exports = {
    checkPasswordForUser: function(email, enteredPassword, callback){
        globalconnection.checkIsConnected(function(){
            setTimeout(function(){
                var sql = "SELECT user.password, user.salt from user where user.email = ?";
            
                globalconnection.con.query(sql, [email], function (err, result, fields) {
                    if (err) {
                        logger.log( err);
                        return;
                    }
                    var resultValue = false;
                    if (result.length > 0) {
                        // passwort auf datenbank = pbkdf2(sha512(sha512(passwort) + salt), salt)
                        resultValue = result[0]["password"] === verschluesselung.PBKDF2(enteredPassword, result[0]['salt']);
                    }                     
                    return callback(resultValue)
                });
            }, Helper.getRandomInt(2000));       
         });
    },

    checkPasswordForUserPasswordVergessen: function(email, enteredPassword, callback){
        globalconnection.checkIsConnected(function(){
            setTimeout(function(){
                var sql = "SELECT user.1malPasswort password, user.salt from user where user.email = ? and TIMESTAMPDIFF(HOUR, 1malPasswortAblauf, DATE_ADD(NOW(), INTERVAL 1 HOUR)) = 0";
                
                globalconnection.con.query(sql, [email], function (err, result, fields) {
                    if (err) {
                        logger.log(err);
                        return;
                    }

                    var resultValue = false;

                    if (result.length > 0) {                     
                        resultValue = result[0]["password"] === verschluesselung.PBKDF2(enteredPassword, result[0]['salt']);
                    }               
                    return callback(resultValue)
                });
            },Helper.getRandomInt(2000));

        });
    },

    // setzt das "1mal Passwort" (nicht wirklich 1 mal kann 1 Stunde lang verwendet werden) eines users
    // passwort ist ein zufälliges 6 stelliges passwort aus buchstaben (keine zahlen/zeichen)
    set1malPasswort: function(email, password, callback){
        globalconnection.checkIsConnected(function(){
            
                var sql = "Update user set user.1malPasswort = ?, 1malPasswortAblauf = DATE_ADD(NOW(), INTERVAL 1 HOUR) where user.email = ?";
                
                globalconnection.con.query(sql, [password, email], function (err) {
                    if (err) {
                        return callback(false);
                    }else{
                        return callback(true);
                    }                         
                })

        });
    },

    changePassword: function(user, newPassword, callback){
        globalconnection.checkIsConnected(function(){
            helperSQL.getSalt(user, function(salt){
                var sql = "UPDATE user set password = ? WHERE user.email = ?";
                globalconnection.con.query(sql, [verschluesselung.PBKDF2(newPassword, salt), user], function (err, result, fields) {
                    if (err) {
                        return callback(false);
                    }
                    else{
                        return callback(true);
                    }
                });
            })
        })
    }
}
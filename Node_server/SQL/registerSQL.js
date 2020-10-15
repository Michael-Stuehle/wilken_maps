const logger = require('../logger');
const globalconnection = require('./Globalconnection');
const verschluesselung = require ('../verschluesselung');
const helperSQL = require('./helperSQL');

module.exports = {
    registerUser: function(user, password, token, callback){
        globalconnection.checkIsConnected(function(){
           var salt = helperSQL.generateRandomString(128);
           // password
           // hash1 = md5(passwort) (hash auf client seite)
           var hash2 = verschluesselung.md5(password + salt);
           var final = verschluesselung.PBKDF2(hash2, salt);
           globalconnection.con.getConnection(function(err, connection){
               if (err) logger.logError(err);

               connection.beginTransaction(function(err){
                   if (err) logger.logError(err);

                   connection.query("INSERT INTO einstellungen (id) VALUES (NULL);", user, function(err){
                       if (err) {
                           connection.rollback(function(){
                               logger.logError(err);
                           });
                           logger.logError('einstellungs-zeile für user: ' + user + ' konnte nicht auf der datenbank angelegt werden!', err);
                           return callback(false);
                       }   
                       connection.query("INSERT INTO user"+
                           " (id, email, password, salt, verificationToken, einstellungen_id, mitarbeiter_id)"+
                           " values (NULL, ?, ?, ?, ?, (Select LAST_INSERT_ID()), (select id from mitarbeiter where name = ?))", 
                       [user, final, salt, token, helperSQL.getNameFromEmail(user)], function (err) {
                           if (err) {
                               connection.rollback(function (err){
                                   logger.logError(err);
                               });    
                               logger.logError('user: ' + user + ' konnte nicht angelegt werden', err);
                               return callback(false);                    
                           }

                           connection.commit(function(){
                               return callback(true);
                           });
                       });
                   });                  
               })
           })
           
       });
   },

   isUserVerified: function(username, callback){
        globalconnection.checkIsConnected(function(){
            var sql = "SELECT isVerified FROM user WHERE user.email = ?";
                
            globalconnection.con.query(sql, [username], function (err, result, fields) {
                if (err) {
                    logger.log(err);
                    return;
                }
                var resultValue = false;

                if (result.length > 0) {                  
                    resultValue = result[0]['isVerified'] === 1
                }               
                return callback(resultValue)
            });
        });
    },

    verifieUserWithToken: function(username, token, callback){
        globalconnection.checkIsConnected(function(){
            var sql = "Update user set isVerified = 1 where user.email = ? AND user.verificationToken = ? AND user.isVerified = 0" + 
                " AND verificationTokenExpires < DATE_ADD(NOW(), INTERVAL 1 DAY)";
                
                globalconnection.con.query(sql, [username, token], function (err, result, fields) {
                if (err) {
                    logger.log(err);
                    return;
                }
                var resultValue = false;

                if (result.affectedRows > 0) {                       
                    resultValue = true;
                }               
                return callback(resultValue)
            });
        });
    },
}
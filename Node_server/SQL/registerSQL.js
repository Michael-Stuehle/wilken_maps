const logger = require('../logger');
const globalconnection = require('./Globalconnection');
const verschluesselung = require ('../verschluesselung');
const helperSQL = require('./helperSQL');
const Helper = require('../RequestHandlers/Helper');
const { con } = require('./Globalconnection');
const { getNameFromEmail } = require('../RequestHandlers/Helper');

module.exports = {
    registerUser: function(email, password, token, callback){
        globalconnection.checkIsConnected(function(){
            var salt = Helper.generateRandomString(128);
            // password
            // hash1 = md5(passwort) (hash auf client seite)
            var hash2 = verschluesselung.md5(password + salt);
            var final = verschluesselung.PBKDF2(hash2, salt);
            globalconnection.con.getConnection(function(err, connection){
                if (err) logger.logError(err);
                connection.beginTransaction(function(err){
                    if (err) logger.logError(err);
    
                    checkMitarbeiter(connection, email, function(mitarbeiterExists){
                        if (!mitarbeiterExists) {
                            return callback(false);
                        }
                        connection.query("INSERT INTO einstellungen (id) VALUES (NULL);", email, function(err){
                            if (err) {
                                connection.rollback(function(){
                                    logger.logError(err);
                                });
                                logger.logError('einstellungs-zeile für user: ' + email + ' konnte nicht auf der datenbank angelegt werden!', err);
                                return callback(false);
                            }   
                            connection.query("INSERT INTO user"+
                                " (id, email, password, salt, verificationToken, einstellungen_id, mitarbeiter_id)"+
                                " values (NULL, ?, ?, ?, ?, (Select LAST_INSERT_ID()), (select id from mitarbeiter where name = ?))", 
                            [email, final, salt, token, Helper.getNameFromEmail(email)], function (err) {
                                if (err) {
                                    connection.rollback(function (err){
                                        logger.logError(err);
                                    });   
                                    logger.logError('user: ' + email + ' konnte nicht angelegt werden', err);
                                    return callback(false);                    
                                }else{
                                    connection.commit(function(err){
                                        if (err){ 
                                            logger.logError(err);
                                        }else{
                                            return callback(true);
                                        }
                                    })
                                }
                            })                            
                        });                  
                    })
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

var checkMitarbeiter = function(connection, email, next){
    helperSQL.checkMitarbeiterExists(email, function(exists){
        if (!exists && getNameFromEmail(email) != email) { // email besteht aus echtem namen
            connection.query("Insert INTO mitarbeiter (id, raum_id, name) values (NULL, (select id from raum LIMIT 1), ?)", 
                [Helper.getNameFromEmail(email)], function (err) {
                if (err) {
                    connection.rollback(function (err){
                        logger.logError(err);
                    });    
                    logger.logError('user: ' + email + ' konnte nicht angelegt werden', err);
                    next(false);                                                
                }
                next(true);
            })
        }else{
            next(true);
        }
   });    
}

var getRaumId = function(connection, email, callback){
    let sql = "select raum_id from mitarbeiter where name = ?";
    connection.query(sql, [Helper.getNameFromEmail(email)], function (err, result) {
        if (err) {
            logger.logError(err);
        }    
        let id = result[0]['raum_id'];
        return callback(id);                                                
    });    
}
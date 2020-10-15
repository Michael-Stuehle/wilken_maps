const logger = require('../logger');
const globalconnection = require('./Globalconnection');

module.exports = {
    getSalt: function(email, callback){
        globalconnection.checkIsConnected(function(){
            var sql = "Select salt from user WHERE user.email = ?";
            globalconnection.con.query(sql, [email], function (err, result, fields) {
                if (err) {
                    logger.log(err);
                    return;
                }
                var resultValue = '';
    
                if (result.length > 0) {
                    resultValue = result[0]["salt"];
                }      
                return callback(resultValue);
            });
        });
    },

    checkUserExists: function(email, callback){
        globalconnection.checkIsConnected(function(){
            var sql = "SELECT * from user where user.email = ?";
            
            globalconnection.con.query(sql, [email], function (err, result, fields) {
                if (err) {
                    logger.log( err);
                    return;
                }
                var resultValue = false;

                if (result.length > 0) {
                    resultValue = true;
                }               
                return callback(resultValue)
            });
        });
    },

    checkMitarbeiterExists : function(email, callback){
        globalconnection.checkIsConnected(function(){
            var sql = "select * from mitarbeiter where name = ?";
                
            globalconnection.con.query(sql, [_getNameFromEmail(email)], function (err, result) {
                if (err) {
                    logger.log(err);
                    return;
                }
                var resultValue = false
                if (result.length > 0) {
                  resultValue = true;
                }
                return callback(resultValue)
            });
        });
    },

    getUserRaum: function(user, callback){
        globalconnection.checkIsConnected(function(){
           
            let sql = 'select raum.name from raum, mitarbeiter where raum.id = mitarbeiter.raum_id AND mitarbeiter.name LIKE ?';
            globalconnection.con.query(sql, [_getNameFromEmail(user)], function (err, result, fields) {
                if (err) {
                    logger.log(err);
                    return;
                }
                let raumName = result[0]['name'];
                callback(raumName);                
            });
        })
    },

    getPermissionsUser : function(user, callback){
        globalconnection.checkIsConnected(function(){
            var sql = "SELECT permissions FROM rank, user where user.email = ? and rank.name = user.rank";
            globalconnection.con.query(sql, [user], function (err, result, fields) {
                if (err){
                    logger.log( err);
                    return;
                } 
                var resultValue = "";
    
                if (result.length > 0) {
                    resultValue = result[0]["permissions"];
                }               
                return callback(resultValue)
            });
        })
    },

    getMitarbeiter: function(callback){      
        globalconnection.checkIsConnected(function(){
            var sql = "SELECT DISTINCT mitarbeiter.name mitarbeiterName, raum.name raumName from mitarbeiter, raum where mitarbeiter.raum_id = raum.id";
            
            globalconnection.con.query(sql, function (err, result, fields) {
                if (err) {
                    logger.log( err);
                    return;
                }

                var resultText = "";

                for (let index = 0; index < result.length-1; index++) {
                    resultText += result[index]["mitarbeiterName"] + "=" + result[index]["raumName"] + ";";
                }
                resultText +=  result[result.length-1]["mitarbeiterName"] + "=" + result[result.length-1]["raumName"]
                
                return callback(resultText)
            });
        });
    },
}


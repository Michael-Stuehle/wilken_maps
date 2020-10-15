const logger = require('../logger');
const globalconnection = require('./Globalconnection');
const helperSQL = require('./helperSQL');

module.exports = {
     // führt sql ohne jegliche prüfungen oder abfragen aus.
    // nur für spezielle user erlaubt
    execSql: function(sql, callback){
        globalconnection.checkIsConnected(function(){
            globalconnection.con.query(sql, function (err, result, fields) {
                callback(err, result, fields);                
            });
        })
    },

    hasPermissionForSQL: function(request, callback){
        var username = request.session.username;
        helperSQL.getPermissionsUser(username, function(result){
            if (result != null && result.split(';').indexOf('sql') > -1) { // hat berechtigung für sql
                return callback(true);
            }else{
                return callback(false);
            }
    
        })
    },
    
    getAllProcedures : function(callback){
        globalconnection.checkIsConnected(function(){
            var sql = "SHOW PROCEDURE STATUS where db = ?;";
                
            globalconnection.con.query(sql, [globalconnection.dbName], function (err, result, fields) {
                if (err) {
                    logger.log(err);
                    return;
                }
                var resultText = "";
                for (let index = 0; index < result.length; index++) {
                    resultText += result[index]["Name"] + ";";
                }
                return callback(resultText)
            });
        });
    },

    getAllFunctions : function(callback){
        globalconnection.checkIsConnected(function(){
            var sql = "SHOW FUNCTION STATUS where db = ?;";
                
            globalconnection.con.query(sql, [globalconnection.dbName], function (err, result, fields) {
                if (err) {
                    logger.log(err);
                    return;
                }
                var resultText = "";
                for (let index = 0; index < result.length-1; index++) {
                    resultText += result[index]["Name"] + ";";
                }
                return callback(resultText)
            });
        });
    }
}

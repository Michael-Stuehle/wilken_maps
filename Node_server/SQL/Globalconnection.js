var crypto = require('crypto');
var mysql = require('mysql');
const constants = require('../constants');

// WICHTIG: 
// vollständige datenbank berechtigungen nur für localhost
// alle zugriffe von ausen sind stark eingeschränkt 
var _con = mysql.createPool({
    connectionLimit : 50,
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: constants.dbName
})

module.exports = {

    checkIsConnected : function(onConnection){
        if (_con.state === 'disconnected') {
            _con.connect(function(err) {
                if (err) {
                    logger.log( err);
                    return;
                }
                onConnection();
            });
        }else{
            onConnection();
        }
    },
    con : _con
}


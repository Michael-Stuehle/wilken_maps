var mysql = require('mysql');
const constants = require('../constants');

module.exports = {

    checkIsConnected : function(onConnection){
        if (con.state === 'disconnected') {
            con.connect(function(err) {
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
    // WICHTIG: 
    // vollständige datenbank berechtigungen nur für localhost
    // alle zugriffe von ausen sind stark eingeschränkt 
    con : mysql.createPool({
        connectionLimit : 50,
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: constants.dbName
    })
}


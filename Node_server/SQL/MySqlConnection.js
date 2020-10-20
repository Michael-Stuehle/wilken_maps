const loginSQL = require('./loginSQL');
const registerSQL = require('./registerSQL');
const helperSQL = require('./helperSQL');
const einstellungenSQL = require('./einstellungenSQL');
const sqlInterfaceSQL = require('./sqlInterfaceSQL');
const serverlog = require('./serverlog');
const adminpageSQL = require('./adminpageSQL');

module.exports = {
    getMitarbeiter: function(callback){      
        helperSQL.getMitarbeiter(callback);
    },

    getRaumListe: function(callback){
        helperSQL.getRaumListe(callback);
    },

    checkPasswordForUser: function(email, enteredPassword, callback){
        loginSQL.checkPasswordForUser(email, enteredPassword, callback);
    },
    
    checkPasswordForUserPasswordVergessen: function(email, enteredPassword, callback){
        loginSQL.checkPasswordForUserPasswordVergessen(email, enteredPassword, callback);
    },

    // setzt das "1mal Passwort" (nicht wirklich 1 mal kann 1 Stunde lang verwendet werden) eines users
    // passwort ist ein zufälliges 6 stelliges passwort aus buchstaben (keine zahlen/zeichen)
    set1malPasswort: function(user, password, callback){
        loginSQL.set1malPasswort(user, password, callback);
    },

    checkUserExists: function(user, callback){
        helperSQL.checkUserExists(user, callback);
    },

    registerUser: function(user, password, token, callback){
        registerSQL.registerUser(user, password, token, callback);
    },

    getEinstellungenForUser: function(user, callback){
        einstellungenSQL.getEinstellungenForUser(user, callback);
    },

    getEinstellungValueForUser: function(user, einstellungName, callback){
        einstellungenSQL.getEinstellungValueForUser(user, einstellungName, callback);
    },

    setEinstellungenForUser: function(user, einstellungen, callback){
        einstellungenSQL.setEinstellungenForUser(user, einstellungen, callback);
    },

    getPermissionsForUser: function(user, callback){
        return helperSQL.getPermissionsUser(user, callback);
    },

    changePassword: function(user, newPassword, callback){
       loginSQL.changePassword(user, newPassword, callback);
    },

    getSaltForUser: function(user, callback){
        return helperSQL.getSalt(user, callback);
    },

    // prüft ob user berechtigt ist, "execSql" zu verwenden
    hasPermissionForSQL: function(request, callback){
        sqlInterfaceSQL.hasPermissionForSQL(request, callback);
    },

    hasPermissionForAdminPage: function(email, callback){
        adminpageSQL.userHasAdminpagePermission(email, callback);
    },
    
    raumListeSpeichern: function(raumliste, callback){
        adminpageSQL.raumlisteSpeichern(raumliste, callback);
    },

    getallProceduresAndFunctions: function(callback){
        sqlInterfaceSQL.getAllProcedures(function(procedures){
            sqlInterfaceSQL.getAllFunctions(function(functions){
                callback(procedures + functions);
            })
        })
    },

    getUserRaum: function(user, callback){
        helperSQL.getUserRaum(user,callback);
    },

    // führt sql ohne jegliche prüfungen oder abfragen aus.
    // nur für spezielle user erlaubt
    execSql: function(sql, callback){
        sqlInterfaceSQL.execSql(sql, callback);
    },

    isUserVerified: function(username, callback){
        registerSQL.isUserVerified(username, callback);
    },

    verifieUserWithToken: function(username, token, callback){
        registerSQL.verifieUserWithToken(username, token, callback);   
    }
};












  



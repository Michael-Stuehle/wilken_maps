const globalconnection = require('./Globalconnection');
module.exports = {
    addToServerLog: function(aktionsTyp, info){
        globalconnection.checkIsConnected(function(){
            let sql = 'insert into serverlog (id, aktionstyp, info) values (NULL, ?, ?)';
            
            globalconnection.con.query(sql, [aktionsTyp, info], function(err){
                if (err) {
                    throw err;
                }
            })
        })
    },

    addToServerLog: function(aktionsTyp, info, ip){
        globalconnection.checkIsConnected(function(){
            let sql = 'insert into serverlog (id, aktionstyp, info, ip) values (NULL, ?, ?, ?)';
            
            globalconnection.con.query(sql, [aktionsTyp, info, ip], function(err){
                if (err) {
                    throw err;
                }
            })
        })
    },

    AktionsTyp : {
        login : 'anmeldung',
        logout : 'abmeldung',
        register : 'registrierung',
        verify : 'verifizierung',
        error : 'fehler',
        changePwd: 'passwort änderung',
        unbekannt: '???'
    }
}

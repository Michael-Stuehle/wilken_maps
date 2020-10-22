const logger = require('../logger');
const globalconnection = require('./Globalconnection');
const helperSQL = require('./helperSQL');

module.exports = {
    userHasAdminpagePermission: function(email, callback){
        helperSQL.getPermissionsUser(email, function(perms){
            let arr = perms.split(';');
            if (arr.includes('admin')) {
                return callback(true);
            }
            else{
                return callback(false);
            }
        })
    },

    raumlisteSpeichern: function(raumliste, callback){
        globalconnection.checkIsConnected(function(){
            globalconnection.con.getConnection(function(err, connection){
                if (err) logger.logError(err);
                connection.beginTransaction(function(err){
                    if (err) {
                        logger.logError(err)
                    }else{
                        doRaumlisteSpeichern(connection, raumliste, callback);
                    }
                })
            })
        })
    }
}

async function doRaumlisteSpeichern(connection, raumliste, callback){
    let ok = true;
    for (let index = 0; index < raumliste.length && ok; index++) {
        const raum = raumliste[index];
        for (let index_raum = 0; index_raum < raum.mitarbeiter.length && ok; index_raum++) {
            const mitarbeiter = raum.mitarbeiter[index_raum];
            if (mitarbeiter.edited) {
                ok = await mitarbeiterChanged(connection, mitarbeiter);
            }else if(mitarbeiter.deleted){
                ok = await mitarbeiterDeleted(connection, mitarbeiter);
            }else if (mitarbeiter.added){
                ok = await mitarbeiterAdded(connection, mitarbeiter);
            }
        }
    } 
    if (ok) {
        connection.commit(function(err){
            if (err) {
                logger.logError(err);
                return callback(false);
            }else{
                return callback(true);   
            }
        })
    }else{
        return callback(false);
    }                  
}

function mitarbeiterChanged(connection, mitarbeiter){
    return new Promise(resolve => {
        // TODO:
        // set mitarbeiter.raum_id
        // set user.mitarbeiter_id

        resolve(true);
    })
}

async function mitarbeiterDeleted(connection, mitarbeiter){
    return new Promise(resolve => {
        // TODO: 
        // set user.mitarbeiter_id = NULL
        // remove mitarbeiter
        
        resolve(true);
    })
}

async function  mitarbeiterAdded(connection, mitarbeiter){
    return new Promise(resolve => {
        // TODO:
        // add mitarbeiter (id, name, raum_id)
        // set user.mitarbeiter_id
        
        resolve(true);
    })
}
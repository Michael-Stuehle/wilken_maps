const logger = require('../logger');
const { con } = require('./Globalconnection');
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
            if (mitarbeiter.deleted) {
                ok = await mitarbeiterDeleted(connection, mitarbeiter);
            }else if (mitarbeiter.added){
                ok = await mitarbeiterAdded(connection, mitarbeiter);
            }else if(mitarbeiter.edited){
                ok = await mitarbeiterChanged(connection, mitarbeiter);
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
        // set mitarbeiter.name

        execSQL(connection, 'update mitarbeiter set raum_id = ?, name = ? where id = ?', [mitarbeiter.raum_id, mitarbeiter.name, mitarbeiter.id]).then(function(err){
            if (err) {
                logger.logError(err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(false);
            }
        }).then(function(){
            console.log(JSON.stringify(mitarbeiter) + 'geändert');
            resolve(true);
        })
    })
}

async function mitarbeiterDeleted(connection, mitarbeiter){
    return new Promise(resolve => {
        // set ?user.mitarbeiter_id = NULL
        // remove mitarbeiter
        execSQL(connection, 'delete from user where email = ?', [mitarbeiter.user]).then(function(err){
            if (err) {
                logger.logError(err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(false);
            }
        }).then(function(){
            execSQL(connection, 'delete from mitarbeiter where id =?', [mitarbeiter.id]).then(function(err){
                if (err) {
                    logger.logError(err);
                    connection.rollback(function(err){
                        if (err) throw err;
                    });
                    resolve(false);
                } 
            })
        }).then(function(){
            console.log(JSON.stringify(mitarbeiter) + 'gelöscht');
            resolve(true);
        })
    })
}

async function  mitarbeiterAdded(connection, mitarbeiter){
    return new Promise(resolve => {
        // add mitarbeiter (id, name, raum_id)
        execSQL(connection, 'insert into mitarbeiter (id, name, raum_id) values (NULL, ?, ?)', [mitarbeiter.name, mitarbeiter.raum_id]).then(function(err){
            if (err) {
                logger.logError(err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(false);
            }
        }).then(function(){
            console.log(JSON.stringify(mitarbeiter) + 'hinzugefügt');
            resolve(true);
        })
    })
}

async function execSQL(connection, sql, params){
    return new Promise(resolve => {
        connection.query(sql, params, function(err, result, fields){
            resolve(err, result, fields)
        })
    })
}
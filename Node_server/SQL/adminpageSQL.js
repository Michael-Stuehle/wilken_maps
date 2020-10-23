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
        let raum = raumliste[index];
        if (raum.deleted) { 
            if (raum.added) {// falls added und deleted einfach nichts machen
                continue;
            }
            ok = await raumDeleted(connection, raum);
        }else if (raum.added){
            raum = await raumAdded(connection, raum);
            ok = raum != null;
        }else if(raum.edited){
            ok = await raumChanged(connection, raum);
        }      
        for (let index_raum = 0; index_raum < raum.mitarbeiter.length && ok; index_raum++) {
            const mitarbeiter = raum.mitarbeiter[index_raum];
            if (mitarbeiter.deleted ) {
                if (mitarbeiter.added) {// falls added und deleted einfach nichts machen
                    continue;
                }
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

async function doMitarbeiterDelete(connection, raumliste){
    return new Promise(resolve => {
        let ok = true;
        for (let index = 0; index < raumliste.length && ok; index++) {
            let raum = raumliste[index];
            for (let index_raum = 0; index_raum < raum.mitarbeiter.length && ok; index_raum++) {
                const mitarbeiter = raum.mitarbeiter[index_raum];
                if (mitarbeiter.deleted ) {
                    if (mitarbeiter.added) {// falls added und deleted einfach nichts machen
                        continue;
                    }
                    ok = await mitarbeiterDeleted(connection, mitarbeiter);
                }                     
            }
        } 
        resolve(ok);
    })
}

async function doRaumAdded_And_Edited(connection, raumliste){
    return new Promise(resolve => {
        let ok = true;
        for (let index = 0; index < raumliste.length && ok; index++) {
            let raum = raumliste[index];
           if (raum.added){
                raum = await raumAdded(connection, raum);
                ok = raum != null;
            }else if(raum.edited){
                ok = await raumChanged(connection, raum);
            }      
        } 
        resolve(ok);
    })
}


async function doMitarbeiterAdded_And_Edited(connection, raumliste){
    return new Promise(resolve => {
        let ok = true;
        for (let index = 0; index < raumliste.length && ok; index++) {
            let raum = raumliste[index];
            for (let index_raum = 0; index_raum < raum.mitarbeiter.length && ok; index_raum++) {
                const mitarbeiter = raum.mitarbeiter[index_raum];
                if (mitarbeiter.added ){
                    if (mitarbeiter.deleted) {
                        continue;
                    }
                    ok = await mitarbeiterAdded(connection, mitarbeiter);
                }else if(mitarbeiter.edited){
                    ok = await mitarbeiterChanged(connection, mitarbeiter);
                }                       
            }
        }   
        resolve(ok);
    })               
}

async function doRaumDelete(connection, raumliste){
    return new Promise(resolve => {
        let ok = true;
        for (let index = 0; index < raumliste.length && ok; index++) {
            let raum = raumliste[index];
            if (raum.deleted) { 
                if (raum.added) {// falls added und deleted einfach nichts machen
                    continue;
                }
                ok = await raumDeleted(connection, raum);
            }
        }
        resolve(ok)
    })
}


function mitarbeiterChanged(connection, mitarbeiter){
    return new Promise(resolve => {
        // TODO:
        // set mitarbeiter.raum_id
        // set mitarbeiter.name

        execSQL(connection, 'update mitarbeiter set raum_id = ?, name = ? where id = ?', [mitarbeiter.raum_id, mitarbeiter.name, mitarbeiter.id]).then(function(resolved){
            if (resolved.err) {
                logger.logError(resolved.err);
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
        execSQL(connection, 'delete from user where email = ?', [mitarbeiter.user]).then(function(resolved){
            if (resolved.err) {
                logger.logError(resolved.err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(false);
            }
        }).then(function(){
            execSQL(connection, 'delete from mitarbeiter where id =?', [mitarbeiter.id]).then(function(resolved){
                if (resolved.err) {
                    logger.logError(resolved.err);
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
        execSQL(connection, 'insert into mitarbeiter (id, name, raum_id) values (NULL, ?, ?)', [mitarbeiter.name, mitarbeiter.raum_id]).then(function(resolved){
            if (resolved.err) {
                logger.logError(resolved.err);
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

function raumChanged(connection, raum){
    return new Promise(resolve => {
        // TODO:
        // set raum.name

        execSQL(connection, 'update raum set name = ? where id = ?', [raum.id, raum.name]).then(function(resolved){
            if (resolved.err) {
                logger.logError(resolved.err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(false);
            }
        }).then(function(){
            console.log(JSON.stringify(raum) + 'geändert');
            resolve(true);
        })
    })
}

async function raumAdded(connection, raum){
    return new Promise(resolve => {
        // add raum (id, name)
        execSQL(connection, 'insert into raum (id, name) values (NULL, ?)', [raum.name]).then(function(resolved){
            if (resolved.err) {
                logger.logError(resolved.err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(null);
            }
        }).then(function(){
            execSQL(connection, 'select LAST_INSERT_ID() id', []).then(function(resolved){
                if (resolved.err) {
                    logger.logError(resolved.err);
                    connection.rollback(function(err){
                        if (err) throw err;
                    });
                    resolve(null);
                }else{
                    raum.id = resolved.result[0]['id'];
                    for (let index = 0; index < raum.mitarbeiter.length; index++) {
                        const element = raum.mitarbeiter[index];
                        element.raum_id = raum.id;
                    }
                }
            }).then(function(){
                console.log('2' + JSON.stringify(raum) + 'hinzugefügt');
                resolve(raum);
            })
        })
    })
}

async function raumDeleted(connection, raum){
    return new Promise(resolve => {
        execSQL(connection, 'delete from raum where id = ?', [raum.id]).then(function(resolved){
            if (resolved.err) {
                logger.logError(resolved.err);
                connection.rollback(function(err){
                    if (err) throw err;
                });
                resolve(false);
            }
        }).then(function(){
            console.log(JSON.stringify(raum) + 'gelöscht');
            resolve(true);
        })
    })
}

async function execSQL(connection, sql, params){
    return new Promise(resolve => {
        connection.query(sql, params, function(err, result, fields){
            resolve({err: err, result: result, fields: fields})
        })
    })
}
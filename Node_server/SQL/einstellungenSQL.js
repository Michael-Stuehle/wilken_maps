const logger = require('../logger');
const globalconnection = require('./Globalconnection');

module.exports = {
    getEinstellungenForUser: function(user, callback){
        getEinstellungenForUserFunc(user, callback);
    },

    getEinstellungValueForUser: function(user, einstellungName, callback){
        getEinstellungenForUserFunc(user, function(einstellungen){
            for (let index = 0; index < einstellungen.length; index++) {
                const element = einstellungen[index];

                if (element.name == undefined) {
                    continue;
                }            
                if (element.name == einstellungName) {
                    return callback(element);
                }
            }
            return callback(null);
        });
    },

    setEinstellungenForUser: function(user, einstellungen, callback){
        getEinstellungenForUserFunc(user, function(alteEinstellungen){
            globalconnection.con.getConnection(function(err, connection){
                if (err) logger.logError(err);

                connection.beginTransaction(function(err){
                    if (err) {
                        logger.logError(err);
                        
                        connection.rollback(function (err){
                            logger.logError(err);
                        });   
                    }
                    for (let index = 0; index < alteEinstellungen.length; index++) {
                        let oldElement = alteEinstellungen[index];
                        let newElement = {};

                        if (oldElement.name == undefined || oldElement.name == null || oldElement.name == "") {
                            continue;
                        }

                        let newIndex = findEinstellungIndex(einstellungen, oldElement.name);
                        if (newIndex == -1) { // spezialfall checkbox false
                            newElement = {name: oldElement.name, value: 0, typ: 'bool'}
                        }else if (oldElement.typ == 'bool'){ // spezialfall checkbox true
                            newElement = {name: oldElement.name, value: 1, typ: 'bool'}
                        }else{
                            newElement = einstellungen[newIndex]
                        }

                        let sql = 'update einstellungen set '+newElement.name+' = ? where id = ?';

                        if (oldElement.typ == 'raum') {
                            sql = 'update mitarbeiter set raum_id = ? where id = (select mitarbeiter_id from user where email = ?)';
                            connection.query(sql, [newElement.value, user], function(err){
                                if (err) {
                                    logger.logError(err);
                                    connection.rollback(function (err){
                                        logger.logError(err);
                                    });  
                                }
                            })
                        }else if (oldElement.typ == 'name'){
                            sql = 'update mitarbeiter set name = ? where id = (select mitarbeiter_id from user where email = ?)';
                            connection.query(sql, [newElement.value, user], function(err){
                                if (err) {
                                    logger.logError(err);
                                    connection.rollback(function (err){
                                        logger.logError(err);
                                    });  
                                }
                            })
                        }else{
                            getEinstellungIdFromUser(user, function(id){
                                connection.query(sql, [newElement.value, id], function(err){
                                    if (err) {
                                        logger.logError(err);
                                        connection.rollback(function (err){
                                            logger.logError(err);
                                        });  
                                    }
                                })
                            })      
                        }             
                    }
                });
                connection.commit(function(){
                    return callback(true);
                })
            })
        })
    }
}


var getEinstellungIdFromUser = function(user, callback){
    globalconnection.checkIsConnected(function(){
        globalconnection.con.query('select einstellungen_id from user where user.email=?', [user], function(err, result){
            if (err) {
                logger.logError(err);
            }
            
            let retVal = 0;
            if (result.length > 0) {
                retVal = result[0]['einstellungen_id'];
            }
            return callback(retVal);
        })
    })
};

var getraueme = function(callback){
    var sql = "select distinct id, name from raum";
                
    globalconnection.con.query(sql, function (err, result, fields) {
        if (err) {
            logger.log(err);
            return;
        }
        var resultValue = [];
        for (let index = 0; index < result.length; index++) {
           resultValue.push({
                id: result[index]['id'],
                value: result[index]['name']
           });
        }
        return callback(resultValue)
    });
}

var getRaumEinstellung = function(user, callback){
    var sql = "select raum.id raum_id, raum.name, mitarbeiter.id mit_id from raum, mitarbeiter, user where user.mitarbeiter_id = mitarbeiter.id and mitarbeiter.raum_id = raum.id and user.email = ?";
                
    globalconnection.con.query(sql, [user], function (err, result, fields) {
        if (err) {
            logger.log(err);
            return;
        }
        var resultValue = {};
        getraueme(function(raueme){
            if (result.length > 0) {
                resultValue = {
                    typ: 'raum',
                    name: 'raum',
                    value: result[0]['raum_id'],
                    id: result[0]['mit_id'],
                    options: raueme
                }
             }
             return callback(resultValue)
        })
        
    });
}

var getNameEinstellung = function(user){
    return new Promise(resolve => {
        var sql = 'select mitarbeiter.name as name, mitarbeiter.id as id from mitarbeiter, user where user.mitarbeiter_id = mitarbeiter.id and user.email = ?';
        globalconnection.con.query(sql, [user], function (err, result, fields) {
            if (err) {
                logger.log(err);
                return;
            }
            var resultValue = {};
            if (result.length > 0) {
                resultValue = {
                    typ: 'name',
                    name: 'Name',
                    value: result[0]['name'],
                    id: result[0]['id']
                }
            }
            return resolve(resultValue);

        });
    });
}

var getEinstellungenForUserFunc = function(user, callback){
    var sql = "select einstellungen.* from einstellungen, user where einstellungen.id = user.einstellungen_id and user.email = ? ";
                
    globalconnection.con.query(sql, user, function (err, result, fields) {
        if (err) {
            logger.log(err);
            return;
        }
        var resultValue = []
        getRaumEinstellung(user, async function(raumeinst){
            resultValue.push(raumeinst);
            resultValue.push(await getNameEinstellung(user));
            if (result.length > 0) {
                for (let index = 0; index < fields.length; index++) {
                    if (fields[index].name == 'id' || fields[index].name == 'user_id') {
                        continue;
                    }
                    let obj = {};
                    obj.name = fields[index].name;
                    obj.value = result[0][fields[index].name];
    
                    if (fields[index].length == 1) {
                        obj.typ = 'bool';
                    }else if (fields[index].type == 3){
                        obj.typ = 'int';
                    }else{
                        obj.typ = 'string';
                    }
                    resultValue.push(obj);
                }         
            }    
            return callback(resultValue)
        })
        
    });
}

var findEinstellungIndex = function(alteEinstellungen, neueEinstellungName){
    for (let index = 0; index < alteEinstellungen.length; index++) {
        const element = alteEinstellungen[index];
        if (element.name == neueEinstellungName) {
            return index;
        }
    }
    return -1;
}
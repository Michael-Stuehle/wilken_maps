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


}
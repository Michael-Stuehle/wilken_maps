const logger = require('../logger');
const globalconnection = require('./Globalconnection');

module.exports = {
    userHasAdminpagePermission: function(email, callback){
        return callback(true);
    },


}
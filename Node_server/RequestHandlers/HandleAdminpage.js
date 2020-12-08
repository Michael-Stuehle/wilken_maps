const MySqlConnection = require("../SQL/MySqlConnection");
var path = require('path');
const { con } = require("../SQL/Globalconnection");
module.exports = {
    getAdminPage: function(request, response){
        MySqlConnection.hasPermissionForAdminPage(request.session.username, function(result){
            if (result) {
                response.sendFile(path.join(process.cwd() + '/public/Adminpage.html'))
            }
        })  
    },

    Speichern: function(request, response){
        MySqlConnection.hasPermissionForAdminPage(request.session.username, function(result){
            if (result) {
                let raumliste = request.body;
                MySqlConnection.raumListeSpeichern(raumliste, function(result){
                    if (result) {
                        response.send('Speichern erfolgreich');
                    }else{
                        response.send('fehler beim speichern');
                    }
                }, request.connection.remoteAddress)
            }
        })  
    }
}
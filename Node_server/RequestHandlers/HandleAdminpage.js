const MySqlConnection = require("../SQL/MySqlConnection");
var path = require('path');
module.exports = {
    getAdminPage: function(request, response){
        MySqlConnection.hasPermissionForAdminPage(request.session.username, function(result){
            if (result) {
                response.sendFile(path.join(process.cwd() + '/public/Adminpage.html'))
            }
        })  
    }
}
var mysql = require('mysql');
module.exports = {
    getUsers: function(callback){      
        
        checkIsConnected(function(){
            var sql = "SELECT DISTINCT mitarbeiter.name mitarbeiterName, raum.name raumName from mitarbeiter, raum where mitarbeiter.raum_id = raum.id";
            
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                var resultText = "";

                for (let index = 0; index < result.length-1; index++) {
                    resultText +=  result[index]["mitarbeiterName"] + "=" + result[index]["raumName"] + ";";
                }
                resultText +=  result[result.length-1]["mitarbeiterName"] + "=" + result[result.length-1]["raumName"]
                
                return callback(resultText)
            });
        });
    }
  };
  
var checkIsConnected = function(onConnection){
    if (con.state === 'disconnected') {
        con.connect(function(err) {
            if (err) throw err;
            onConnection();
        });
    }else{
        onConnection();
    }
}

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wilken_maps"
});


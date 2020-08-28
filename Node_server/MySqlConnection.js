var mysql = require('mysql');
const logger = require('./logger');
var crypto = require('crypto');

module.exports = {
    getMitarbeiter: function(callback){      
        checkIsConnected(function(){
            var sql = "SELECT DISTINCT mitarbeiter.name mitarbeiterName, raum.name raumName from mitarbeiter, raum where mitarbeiter.raum_id = raum.id";
            
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                var resultText = "";

                for (let index = 0; index < result.length-1; index++) {
                    resultText += result[index]["mitarbeiterName"] + "=" + result[index]["raumName"] + ";";
                }
                resultText +=  result[result.length-1]["mitarbeiterName"] + "=" + result[result.length-1]["raumName"]
                
                return callback(resultText)
            });
        });
    },

    checkPasswordForUser: function(user, enteredPassword, callback){
        checkIsConnected(function(){
            setTimeout(function(){
                var sql = "SELECT user.password, user.salt from user where user.name = '" + user + "'";
            
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    var resultValue = false;
    
                    if (result.length > 0) {
                        // passwort auf datenbank = pbkdf2(sha512(sha512(passwort) + salt), salt)
                        resultValue = result[0]["password"] === PBKDF2(enteredPassword, result[0]['salt']);
                    }                     
                    return callback(resultValue)
                });
            }, getRandomInt(2000));       
         });
    },

    checkPasswordForUserPasswordVergessen: function(user, enteredPassword, callback){
        checkIsConnected(function(){
            setTimeout(function(){
                var sql = "SELECT user.1malPasswort password, user.salt from user where user.name = '" + user + "' and TIMESTAMPDIFF(HOUR, 1malPasswortAblauf, DATE_ADD(NOW(), INTERVAL 1 HOUR)) = 0";
                
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    var resultValue = false;

                    if (result.length > 0) {                       
                        resultValue = result[0]["password"] === PBKDF2(enteredPassword, result[0]['salt']);
                    }               
                    return callback(resultValue)
                });
            },getRandomInt(2000));

        });
    },

    // setzt das "1mal Passwort" (nicht wirklich 1 mal kann 1 Stunde lang verwendet werden) eines users
    // passwort ist ein zufälliges 6 stelliges passwort aus buchstaben (keine zahlen/zeichen)
    set1malPasswort: function(user, password, callback){
        checkIsConnected(function(){
            getSalt(user, function(salt){
                var hash1 = SHA512(password);
                var hash2 = SHA512(hash1 + salt);
                var final = PBKDF2(hash2, salt);
                var sql = "Update user set user.1malPasswort = '"+final+"', 1malPasswortAblauf = DATE_ADD(NOW(), INTERVAL 1 HOUR) where user.name = '" + user + "'";
                
                con.query(sql, function (err) {
                    if (err) {
                        return callback(false);
                    }else{
                        return callback(true);
                    }                         
                })
            })
        });
    },

    checkUserExists: function(user, callback){
        checkIsConnected(function(){
            var sql = "SELECT * from user where user.name = '" + user + "'";
            
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                var resultValue = false;

                if (result.length > 0) {
                    resultValue = true;
                }               
                return callback(resultValue)
            });
        });
    },

    registerUser: function(user, password){
         checkIsConnected(function(){
            var salt = generateRandomString(128);
            // password = hash1 = simplehash(passwort) (hash auf client seite)
            var hash2 = SHA512(password + salt);
            var final = PBKDF2(hash2, salt);
            con.query("INSERT INTO user (id, name, password, salt) values(NULL, '"+ user + "', '"+final+"', '"+salt+"')", function (err) {
                if (err) throw err;
            });
        });
    },

    getPermissionsForUser: function(user, callback){
        return getPermissionsUser(user, callback);
    },

    changePassword: function(user, newPassword, callback){
        checkIsConnected(function(){
            getSalt(user, function(salt){
                var sql = "UPDATE user set password = '" + PBKDF2(newPassword, salt) + "' WHERE user.name = '" + user + "'";
                con.query(sql, function (err, result, fields) {
                    if (err) {
                        return callback(false);
                    }
                    else{
                        return callback(true);
                    }
                });
            })
        })
    },

    getSaltForUSer: function(user, callback){
        return getSalt(user, callback);
    },

    // prüft ob user berechtigt ist, "execSql" zu verwenden
    hasPermissionForSQL: function(request, callback){
        var username = request.session.username;
        getPermissionsUser(username, function(result){
            if (result != null && result.split(';').indexOf('sql') > -1) { // hat berechtigung für sql
                return callback(true);
            }else{
                return callback(false);
            }
    
        })
    },

    // führt sql ohne jegliche prüfungen oder abfragen aus.
    // nur für spezielle user erlaubt
    execSql: function(sql, callback){
        checkIsConnected(function(){
            con.query(sql, function (err, result, fields) {
                callback(err, result, fields);                
            });
        })
    }
};

var getSalt = function(user, callback){
    checkIsConnected(function(){
        var sql = "Select salt from user WHERE user.name = '" + user + "'";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            var resultValue = '';

            if (result.length > 0) {
                resultValue = result[0]["salt"];
            }      
            return callback(resultValue);
        });
    });
}

var getPermissionsUser = function(user, callback){
    checkIsConnected(function(){
        var sql = "SELECT permissions FROM rank, user where user.name = '" + user + "' and rank.name = user.rank";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            var resultValue = "";

            if (result.length > 0) {
                resultValue = result[0]["permissions"];
            }               
            return callback(resultValue)
        });
    })
}

function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}


function generateRandomString(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?_-:;.,<>|^°[]²³';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }
  

// WICHTIG: 
// vollständige datenbank berechtigungen nur für localhost
// alle zugriffe von ausen sind stark eingeschränkt 
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "wilken_maps"
});
  
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

function SHA512(password){
    return crypto.createHash('sha512').update(password).digest('hex')
}

function PBKDF2(password, salt){
    return _pbkdf2(password, salt, 10000, 500, 'sha512').toString('hex');
}

function _pbkdf2(password, salt, iterations, len, hashType) {
    hashType = hashType || 'sha1';
    if (!Buffer.isBuffer(password)) {
      password = new Buffer(password);
    }
    if (!Buffer.isBuffer(salt)) {
      salt = new Buffer(salt);
    }
    var out = new Buffer('');
    var md, prev, i, j;
    var num = 0;
    var block = Buffer.concat([salt, new Buffer(4)]);
    while (out.length < len) {
      num++;
      block.writeUInt32BE(num, salt.length);
      prev = crypto.createHmac(hashType, password)
        .update(block)
        .digest();
      md = prev;
      i = 0;
      while (++i < iterations) {
        prev = crypto.createHmac(hashType, password)
          .update(prev)
          .digest();
        j = -1;
        while (++j < prev.length) {
          md[j] ^= prev[j]
        }
      }
      out = Buffer.concat([out, md]);
    }
    return out.slice(0, len);
  }
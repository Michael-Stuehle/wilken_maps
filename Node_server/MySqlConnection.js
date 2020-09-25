var mysql = require('mysql')
const logger = require('./logger')
var crypto = require('crypto')
const { exit } = require('process')
const dbName = 'wilken_maps';

module.exports = {
  getMitarbeiter: function (callback) {
    checkIsConnected(function () {
      var sql =
        'SELECT DISTINCT mitarbeiter.name mitarbeiterName, raum.name raumName from mitarbeiter, raum where mitarbeiter.raum_id = raum.id';

      con.query(sql, function (err, result, fields) {
        if (err) {
          logger.log('Mitarbeiter wurde nicht gefunden!', err)
          return;
        }

        var resultText = '';

        for (let index = 0; index < result.length - 1; index++) {
          resultText +=
            result[index].mitarbeiterName + '=' + result[index].raumName + ';';
        }
        resultText +=
          result[result.length - 1].mitarbeiterName +
          '=' +
          result[result.length - 1].raumName

        return callback(resultText)
      })
    })
  },

  checkPasswordForUser: function (user, enteredPassword, callback) {
    checkIsConnected(function () {
      setTimeout(function () {
        var sql =
          "SELECT user.password, user.salt from user where user.name = '" +
          user +
          "'"

        con.query(sql, function (err, result, fields) {
          if (err) {
            logger.log('Ungültiges Passwort!', err)
            return;
          }
          var resultValue = false

          if (result.length > 0) {
            // passwort auf datenbank = pbkdf2(sha512(sha512(passwort) + salt), salt)
            resultValue =
              result[0].password === PBKDF2(enteredPassword, result[0].salt)
          }
          return callback(resultValue)
        })
      }, getRandomInt(2000))
    })
  },

  checkPasswordForUserPasswordVergessen: function (
    user,
    enteredPassword,
    callback
  ) {
    checkIsConnected(function () {
      setTimeout(function () {
        var sql =
          "SELECT user.1malPasswort password, user.salt from user where user.name = '" +
          user +
          "' and TIMESTAMPDIFF(HOUR, 1malPasswortAblauf, DATE_ADD(NOW(), INTERVAL 1 HOUR)) = 0"

        con.query(sql, function (err, result, fields) {
          if (err) {
            logger.log('1malPassword konnte nicht angelegt werden!', err)
            return;
          }

          var resultValue = false

          if (result.length > 0) {
            resultValue =
              result[0].password === PBKDF2(enteredPassword, result[0].salt)
          }
          return callback(resultValue)
        })
      }, getRandomInt(2000))
    })
  },

  // setzt das "1mal Passwort" (nicht wirklich 1 mal kann 1 Stunde lang verwendet werden) eines users
  // passwort ist ein zufälliges 6 stelliges passwort aus buchstaben (keine zahlen/zeichen)
  set1malPasswort: function (user, password, callback) {
    checkIsConnected(function () {
      getSalt(user, function (salt) {
        var hash1 = md5(password)
        var hash2 = md5(hash1 + salt)
        var final = PBKDF2(hash2, salt)
        var sql =
          "Update user set user.1malPasswort = '" +
          final +
          "', 1malPasswortAblauf = DATE_ADD(NOW(), INTERVAL 1 HOUR) where user.name = '" +
          user +
          "'"

        con.query(sql, function (err) {
          if (err) {
            return callback(false)
          } else {
            return callback(true)
          }
        })
      })
    })
  },

  checkUserExists: function (user, callback) {
    checkIsConnected(function () {
      var sql = "SELECT * from user where user.name = '" + user + "'"

      con.query(sql, function (err, result, fields) {
        if (err) {
          logger.log('user: ' + user + ' exestiert nicht!', err)
          return;
        }
        var resultValue = false

        if (result.length > 0) {
          resultValue = true
        }
        return callback(resultValue)
      })
    })
  },

  registerUser: function (user, password, token) {
    checkIsConnected(function () {
      var salt = generateRandomString(128)
      // password
      // hash1 = md5(passwort) (hash auf client seite)
      var hash2 = md5(password + salt)
      var final = PBKDF2(hash2, salt)
      con.query(
        "INSERT INTO user (id, name, password, salt, verificationToken) values(NULL, '" +
          user +
          "', '" +
          final +
          "', '" +
          salt +
          "', '" +
          token +
          "')",
        function (err) {
          if (err) {
            logger.logError(
              'user: ' + user + ' konnte nicht angelegt werden',
              err
            )
          } else {
            con.query(
              'INSERT INTO einstellungen (id, user_id) VALUES (NULL, (select id from user where name = ?));',
              user,
              function (err) {
                if (err) {
                  logger.logError(
                    'einstellungs-zeile für user: ' +
                      user +
                      ' konnte nicht auf der datenbank angelegt werden!',
                    err
                  )
                } else {
                  con.query(
                    'UPDATE mitarbeiter set user_id = (select id from user where name = ?) where name = ?',
                    [user, getNameFromEmail(user)],
                    function (err) {
                      if (err) {
                        logger.logError(
                          'konnte user: ' +
                            user +
                            ' mit keinem mitarbeiter verknüpfen!',
                          err
                        )
                      }
                    }
                  )
                }
              }
            )
          }
        }
      )
    })
  },

  getEinstellungenForUser (user, callback) {
    var sql =
      'select einstellungen.* from einstellungen, user where einstellungen.user_id = user.id and user.name = ? ';

    con.query(sql, user, function (err, result, fields) {
      if (err) {
        logger.log(
          'Einsttelungen von user: ' + user + ' wurde nicht gefunden werden!',
          err
        )
        return;
      }
      var resultValue = []
      if (result.length > 0) {
        for (let index = 0; index < fields.length; index++) {
          const obj = {}
          obj[fields[index].name] = result[0][fields[index].name]
          resultValue.push(obj)
        }
      }
      return callback(resultValue)
    })
  },

  getPermissionsForUser: function (user, callback) {
    return getPermissionsUser(user, callback)
  },

  changePassword: function (user, newPassword, callback) {
    checkIsConnected(function () {
      getSalt(user, function (salt) {
        var sql =
          "UPDATE user set password = '" +
          PBKDF2(newPassword, salt) +
          "' WHERE user.name = '" +
          user +
          "'"
        con.query(sql, function (err, result, fields) {
          if (err) {
            logger.logError(
              'Fehler Passwort konnte nicht geändert werden!',
              err
            )
            return callback(false)
          } else {
            return callback(true)
          }
        })
      })
    })
  },

  getSaltForUSer: function (user, callback) {
    return getSalt(user, callback)
  },

  // prüft ob user berechtigt ist, "execSql" zu verwenden
  hasPermissionForSQL: function (request, callback) {
    var username = request.session.username
    getPermissionsUser(username, function (result) {
      if (result != null && result.split(';').indexOf('sql') > -1) {
        // hat berechtigung für sql
        return callback(true)
      } else {
        return callback(false)
      }
    })
  },

  isUserVerified: function (username, callback) {
    checkIsConnected(function () {
      var sql =
        "SELECT isVerified FROM user WHERE user.name = '" + username + "'"

      con.query(sql, function (err, result, fields) {
        if (err) {
          logger.log('User wurde nicht verifiziert! ', err)
          return;
        }
        var resultValue = false

        if (result.length > 0) {
          resultValue = result[0].isVerified === 1
        }
        return callback(resultValue)
      })
    })
  },

  verifieUserWithToken: function (username, token, callback) {
    checkIsConnected(function () {
      var sql =
        "Update user set isVerified = 1 where user.name = '" +
        username +
        "' AND user.verificationToken = '" +
        token +
        "' AND user.isVerified = 0" +
        ' AND verificationTokenExpires < DATE_ADD(NOW(), INTERVAL 1 DAY)';

      con.query(sql, function (err, result, fields) {
        if (err) {
          logger.log('User wurde nicht verifiziert! ', err)
          return;
        }
        var resultValue = false

        if (result.affectedRows > 0) {
          resultValue = true
        }
        return callback(resultValue)
      })
    })
  },

  getallProceduresAndFunctions: function (callback) {
    getAllProcedures(function (procedures) {
      getAllFunctions(function (functions) {
        callback(procedures + functions)
      })
    })
  },

  getUserRaum: function (user, callback) {
    checkIsConnected(function () {
      const sql =
        'select raum.name from raum, mitarbeiter where raum.id = mitarbeiter.raum_id AND mitarbeiter.name LIKE "' +
        getNameFromEmail(user) +
        '"'
      con.query(sql, function (err, result, fields) {
        if (err) {
          logger.log('Raum wurde nicht gefunden! ', err)
          return;
        }
        const raumName = result[0].name
        callback(raumName)
      })
    })
  },

  // führt sql ohne jegliche prüfungen oder abfragen aus.
  // nur für spezielle user erlaubt
  execSql: function (sql, callback) {
    checkIsConnected(function () {
      con.query(sql, function (err, result, fields) {
        callback(err, result, fields)
      })
    })
  }
}

var getNameFromEmail = function (Email) {
  const splitByPunkt = Email.split('.')
  const vorname = splitByPunkt[0]
  const nachname = splitByPunkt[1].split('@')[0]
  return nachname.toLowerCase() + ' ' + vorname.toLowerCase()
};

var getAllProcedures = function (callback) {
  checkIsConnected(function () {
    var sql = "SHOW PROCEDURE STATUS where db = '" + dbName + "';"

    con.query(sql, function (err, result, fields) {
      if (err) {
        logger.log('Fehler Daten wurde nciht gefunden!', err)
        return;
      }
      var resultText = '';
      for (let index = 0; index < result.length; index++) {
        resultText += result[index].Name + ';';
      }
      return callback(resultText)
    })
  })
};

var getAllFunctions = function (callback) {
  checkIsConnected(function () {
    var sql = "SHOW FUNCTION STATUS where db = '" + dbName + "';"

    con.query(sql, function (err, result, fields) {
      if (err) {
        logger.log('Funktion wurde nicht gefunden!', err)
        return;
      }
      var resultText = '';
      for (let index = 0; index < result.length - 1; index++) {
        resultText += result[index].Name + ';';
      }
      return callback(resultText)
    })
  })
};

var getSalt = function (user, callback) {
  checkIsConnected(function () {
    var sql = 'Select salt from user WHERE user.name = ?';
    con.query(sql, user, function (err, result, fields) {
      if (err) {
        logger.log('salt wurde nicht gefunden', err)
        return;
      }
      var resultValue = '';

      if (result.length > 0) {
        resultValue = result[0].salt
      }
      return callback(resultValue)
    })
  })
};

var getPermissionsUser = function (user, callback) {
  checkIsConnected(function () {
    var sql =
      "SELECT permissions FROM rank, user where user.name = '" +
      user +
      "' and rank.name = user.rank"
    con.query(sql, function (err, result, fields) {
      if (err) {
        logger.log('user: ' + user + ' hat keine Berechtigungen!', err)
        return;
      }
      var resultValue = '';

      if (result.length > 0) {
        resultValue = result[0].permissions
      }
      return callback(resultValue)
    })
  })
};

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function umlauteErsetzen (str) {
  str = str.toLowerCase()
  str = str.replace('ä', 'ae')
  str = str.replace('ö', 'oe')
  str = str.replace('ü', 'ue')
  str = str.replace('ß', 'ss')
  return str
}

function generateRandomString (length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?_-:;.,<>|^°[]²³';
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// WICHTIG:
// vollständige datenbank berechtigungen nur für localhost
// alle zugriffe von ausen sind stark eingeschränkt
var con = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: dbName
})

var checkIsConnected = function (onConnection) {
  if (con.state === 'disconnected') {
    con.connect(function (err) {
      if (err) {
        logger.log('keine Verbindung zum Server!', err)
        return;
      }
      onConnection()
    })
  } else {
    onConnection()
  }
}

function PBKDF2 (password, salt) {
  return _pbkdf2(password, salt, 10000, 500, 'sha512').toString('hex')
}

function _pbkdf2 (password, salt, iterations, len, hashType) {
  hashType = hashType || 'sha1';
  if (!Buffer.isBuffer(password)) {
    password = Buffer.from(password)
  }
  if (!Buffer.isBuffer(salt)) {
    salt = Buffer.from(salt)
  }
  var out = Buffer.from('')
  var md, prev, i, j
  var num = 0
  var block = Buffer.concat([salt, Buffer.alloc(4)])
  while (out.length < len) {
    num++
    block.writeUInt32BE(num, salt.length)
    prev = crypto.createHmac(hashType, password).update(block).digest()
    md = prev
    i = 0
    while (++i < iterations) {
      prev = crypto.createHmac(hashType, password).update(prev).digest()
      j = -1
      while (++j < prev.length) {
        md[j] ^= prev[j]
      }
    }
    out = Buffer.concat([out, md])
  }
  return out.slice(0, len)
}

function md5 (inputString) {
  var hc = '0123456789abcdef';
  function rh (n) {
    var j
    var s = '';
    for (j = 0; j <= 3; j++) {
      s +=
        hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f)
    }
    return s
  }
  function ad (x, y) {
    var l = (x & 0xffff) + (y & 0xffff)
    var m = (x >> 16) + (y >> 16) + (l >> 16)
    return (m << 16) | (l & 0xffff)
  }
  function rl (n, c) {
    return (n << c) | (n >>> (32 - c))
  }
  function cm (q, a, b, x, s, t) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b)
  }
  function ff (a, b, c, d, x, s, t) {
    return cm((b & c) | (~b & d), a, b, x, s, t)
  }
  function gg (a, b, c, d, x, s, t) {
    return cm((b & d) | (c & ~d), a, b, x, s, t)
  }
  function hh (a, b, c, d, x, s, t) {
    return cm(b ^ c ^ d, a, b, x, s, t)
  }
  function ii (a, b, c, d, x, s, t) {
    return cm(c ^ (b | ~d), a, b, x, s, t)
  }
  function sb (x) {
    var i
    var nblk = ((x.length + 8) >> 6) + 1
    var blks = new Array(nblk * 16)
    for (i = 0; i < nblk * 16; i++) blks[i] = 0
    for (i = 0; i < x.length; i++) {
      blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8)
    }
    blks[i >> 2] |= 0x80 << ((i % 4) * 8)
    blks[nblk * 16 - 2] = x.length * 8
    return blks
  }
  var i
  var x = sb(inputString)
  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878
  var olda
  var oldb
  var oldc
  var oldd
  for (i = 0; i < x.length; i += 16) {
    olda = a
    oldb = b
    oldc = c
    oldd = d
    a = ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)
    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)
    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hh(b, c, d, a, x[i + 2], 23, -995338651)
    a = ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = ii(b, c, d, a, x[i + 9], 21, -343485551)
    a = ad(a, olda)
    b = ad(b, oldb)
    c = ad(c, oldc)
    d = ad(d, oldd)
  }
  return rh(a) + rh(b) + rh(c) + rh(d)
}

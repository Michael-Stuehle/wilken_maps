const { AktionsTyp } = require('./SQL/serverlog');
const serverlog = require('./SQL/serverlog');

module.exports = {
    log: function(str){
        console.log(TimeStamp() + str);
        serverlog.addToServerLog(getAktionstypFromMessage(str), str);
    },
    log: function(str, ip){
        console.log(TimeStamp() + str);
        serverlog.addToServerLog(getAktionstypFromMessage(str), str, ip);
    },
    
    logError: function(exception){
        console.error('ERROR ' + TimeStamp() + exception);
        serverlog.addToServerLog(getAktionstypFromMessage('error'), exception);
    },
    logError: function(errStr, exception){
        console.error('ERROR ' + TimeStamp() + errStr + '\r\n' + exception);
        serverlog.addToServerLog(getAktionstypFromMessage('error'), errStr + '\r\n' + exception);
    }
    
}

var getAktionstypFromMessage = function(message){
    if (message.includes("angemeldet")) {
        return AktionsTyp.login;
    }else if (message.includes("abgemeldet")) {
        return AktionsTyp.logout;
    }else if (message.includes("regsitriert")) {
        return AktionsTyp.register;
    }else if (message.includes("verifiziert")) {
        return AktionsTyp.verify;
    }else if (message.includes("error")){
        return AktionsTyp.error;
    }else if (message.includes("geändert") && message.includes("passwort")) {
        return AktionsTyp.changePwd;
    }else if(message.includes("geändert") || message.includes('gelöscht') || message.includes('hinzugefügt')){
        return AktionsTyp.StammdatenÄnderung;
    }else{
        return AktionsTyp.unbekannt;
    }
}


var TimeStamp = function(){
    var now = new Date();
    return ('[' + formatNumberZeros(now.getDate()) + '.' + formatNumberZeros(now.getMonth()) + '.' + now.getFullYear() + ' ' + 
    formatNumberZeros(now.getHours()) + ':' + formatNumberZeros(now.getMinutes()) + ':' + formatNumberZeros(now.getSeconds()) + ']: ');
}

var formatNumberZeros = function(str){
    if (str.toString().length < 2) {
        str = '0' + str.toString();
    }    
    return str;
}
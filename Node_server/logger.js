module.exports = {
    log: function(str){
        console.log(TimeStamp() + str);
    },
    logError: function(errStr, exception){
        console.error('ERROR ' + TimeStamp() + errStr + '\r\n' + exception);
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
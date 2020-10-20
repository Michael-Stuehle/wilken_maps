const mySqlConnection = require('../SQL/MySqlConnection');

module.exports = {
    buildEinstellungenSeite: function(einstellungen){
        let inputs = ''
        for (let index = 0; index < einstellungen.length; index++) {
			const element = einstellungen[index];
            // add bool input element
            if (element.typ == 'bool') {
                inputs += buildBoolInput(element);
            }else if (element.typ == 'int'){
                inputs += buildIntInput(element);
            }else if (element.typ == 'string'){
                inputs += buildStrInput(element);
            }else if(element.typ == 'raum'){
                inputs += buildRaumEinstellung(element);
            }
        }
        return bulidHeader() + inputs + buildSubmitBtn() + buildFooter();
    },

    einstellungenSpeichern: function(request, response){
        let einstellungen = [];
        for(const [key, value] of Object.entries(request.body)){
            einstellungen.push({name: key, value: value});
        }
        mySqlConnection.setEinstellungenForUser(request.session.username, einstellungen, function(result){
            if (result) {
                response.send('Speichern erfolgreich!');
            }else{
                response.send('fehler beim speichern');
            }
        })
    },

    getDarkMode: function(request, response){
        if (request.session.username != undefined && request.session.loggedin) {
            mySqlConnection.getEinstellungValueForUser(request.session.username, 'dark_mode', function(result){
                if (result != null) {
                    if (result.value == '1') {
                        response.send('dark');
                    }else{
                        response.send('light');
                    }
                }			
                response.end();
            })
        }else{
            response.send('nicht angemeldet');
        }
    }    
};

var buildClientJS = function(){
    let retVal =
     '<script src="/script.js"></script>'+
     '<script>'+
        'function DoSubmit(){'+
            'document.getElementById("form").submit();'+
        '}'+
        
        'function saveResult(){'+
            'setTimeout(function () {'+
                'var iframe = document.getElementById("resultFrame");'+
                'var resultText = iframe.contentWindow.document.body.innerHTML;'+
                ' if (resultText === "") {'+
                  // do nothing
                '} else {'+
                    'location.reload();' +
                    'setTimeout(function(){ window.alert(resultText); }, 100);'+
                '}'+
            '}, 10);'+
        '}'+
    '</script>';
    return retVal;
}

var buildSubmitBtn = function(){
    let retVal = '<input type="submit" id="btn-submit" value="Speichern" onclick="DoSubmit()"/>';
    return retVal;
}

var buildRaumEinstellung = function(element){
    var retVal = '<div class="item select">'+
    '<select id="raum-select" name="raum">'
    for (let index = 0; index < element.options.length; index++) {
        const opt = element.options[index];
        if (element.value == opt.id) {
            retVal += '<option value=' + opt.id + ' selected>Raum: '+opt.value+'</option>'
        }else{
            retVal += '<option value=' + opt.id + '>Raum: '+opt.value+'</option>'
        }
    }
    retVal += '</select>' + '</div>';;
    return retVal;
}

var buildBoolInput = function(element){
    var valStr = '';
    if (element.value == 1) {
        valStr = 'checked';
    }else{
        valStr = '';
    }
    var result = '<div class="item">'+
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input type="checkbox" name="'+element.name+'" id="edt'+element.name+'" '+valStr+'>'+
    '</div>';

    return result;
}

var buildIntInput = function(element){
    let result = '<div class="item">'+
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input type="number" name="'+element.name+'" id="edt'+element.name+'" value="'+element.value+'">' +
    '</div>';
    return result;
}

var buildStrInput = function(element){
    let result = '<div class="item">'+
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input name="'+element.name+'" id="edt'+element.name+'" value="'+element.value+'">'+
    '</div>';

    return result;
}

var bulidHeader = function(){
    let result = '<html>'+
                    '<head>'+
                        '<meta name="viewport" charset="utf-8" content="width=device-width, initial-scale=1.0" />'+
                        '<link rel="stylesheet" href="einstellungen.css">'+
                        buildClientJS() +
                    '</head>'+
                    '<body>'+
                        '<iframe id="resultFrame" name="formDestination"  style="visibility: hidden; width: 0px; height: 0px" onload="saveResult()"></iframe>'+
                        '<form id="form" class="form" action="einstellungen" method="POST" target="formDestination">';
    return result;
}


var buildFooter = function(){
    let result = 
                '</form>'+
            '</body>'+
        '</html>';
    return result;
}
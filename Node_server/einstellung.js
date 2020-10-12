const logger = require('./logger');

module.exports = {
    buildEinstellungenSeite: function(einstellungen){
        var inputs = ''
        for (let index = 0; index < einstellungen.length; index++) {
			const element = einstellungen[index];
            // add bool input element
            if (element.typ == 'bool') {
                inputs += buildBoolInput(element);
            }else if (element.typ == 'int'){
                inputs += buildIntInput(element);
            }else if (element.typ == 'string'){
                inputs += buildStrInput(element);
            }
        }
        return bulidHeader() + inputs + buildSubmitBtn() + buildFooter();
    }
};

var buildClientJS = function(){
    let retVal =
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
                    'window.alert(resultText);'+
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
    var result = '<div class="item">'+
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input type="number" name="'+element.name+'" id="edt'+element.name+'" value="'+element.value+'">' +
    '</div>';
    return result;
}

var buildStrInput = function(element){
    var result = '<div class="item">'+
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input name="'+element.name+'" id="edt'+element.name+'" value="'+element.value+'">'+
    '</div>';

    return result;
}

var bulidHeader = function(){
    var result = '<html>'+
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
    var result = 
                '</form>'+
            '</body>'+
        '</html>';
    return result;
}
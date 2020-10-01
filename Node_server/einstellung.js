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
            inputs += '</br>';
        }
        return styles() + bulidHeader() + inputs + buildFooter();
    }
};

var buildBoolInput = function(element){
    var valStr = '';
    if (element.value == 1) {
        valStr = 'true';
    }else{
        valStr = 'false';
    }
    var result = 
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input type="checkbox" name="'+element.name+'" id="edt'+element.name+'" checked="'+valStr+'">'

    return result;
}

var buildIntInput = function(element){
    var result = 
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input type="number" name="'+element.name+'" id="edt'+element.name+'" value="'+element.value+'">'

    return result;
}

var buildStrInput = function(element){
    var result = 
    '<label for="edt'+element.name+'">'+element.name+'</label>' +
    '<input name="'+element.name+'" id="edt'+element.name+'" value="'+element.value+'">'

    return result;
}

var bulidHeader = function(){
    var result = '<div style="display:block; width: 50%">';
    return result;
}


var buildFooter = function(){
    var result = '</div>'
    return result;
}

var styles = function(){
    return ''+ 
    '<style>' +
        'div{ margin:0 auto;}' +
        'label{ float: left; }' +
        'input{ float: right; }'+
    '</style>'; 
}
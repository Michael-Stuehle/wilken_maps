const mySqlConnection = require('../SQL/MySqlConnection');

const linebreak = '\n';

function QuotedStr(str, quoteType){
    return quoteType + str + quoteType;
}

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
            }else if(element.typ == 'name'){
                inputs += buildStrInput(element);
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
                if (result.value == null) {
                    response.send('none')
                }else if (result.value == '1') {
                        response.send('dark');
                }else{
                    response.send('light');
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
    `<script src="/script.js"></script>
    <script>
       function DoSubmit(){
           document.getElementById("form").submit();
       }

       document.addEventListener("keydown", function(event){
           if (event.ctrlKey && event.key.toLocaleLowerCase() == "s") {
               event.preventDefault();
               DoSubmit();
           }
       }); 
       
       function saveResult(){
           setTimeout(function () {
               var iframe = document.getElementById("resultFrame");
               var resultText = iframe.contentWindow.document.body.innerHTML;
                if (resultText === "") {
                   // do nothing
                } else {
                   location.reload(); 
                   setTimeout(function(){ window.alert(resultText); }, 100);
                }
           }, 10);
        }
    </script>`;
    return retVal;
}

var buildSubmitBtn = function(){
    let retVal = `<input type="submit" id="btn-submit" value="Speichern" onclick="DoSubmit()"/>`+linebreak;
    return retVal;
}

var buildRaumEinstellung = function(element){
    var retVal = 
    `<div class="item select" autofocus>
    <label class="selectLabel">Raum: </label>
    <select id="raum-select" name="raum">`+linebreak;
    for (let index = 0; index < element.options.length; index++) {
        const opt = element.options[index];
        if (element.value == opt.id) {
            retVal += `<option value="${opt.id}" selected>${opt.value}</option>`+linebreak;
        }else{
            retVal += `<option value="${opt.id}">${opt.value}</option>`+linebreak;
        }
    }
    retVal += `</select>
            </div>`+linebreak;
    return retVal;
}

var buildBoolInput = function(element){
    var valStr = '';
    if (element.value == 1) {
        valStr = 'checked';
    }else{
        valStr = '';
    }
    var result = `<div class="item">
    <label for="edt${element.name}">${element.name}</label>
    <label class="switch">
        <input type="checkbox" name="${element.name}" id="edt${element.name}" ${valStr} onclick="DoSubmit()">
        <span class="slider round"></span>
    </label>
    </div>`;

    return result;
}

var buildIntInput = function(element){
    let result = 
    `<div class="item">
        <label for="edt${element.name}">${element.name}</label>
        <input type="number" name="${element.name}" id="edt${element.name}" value="${element.value}">
    </div>`;
    return result;
}

var buildStrInput = function(element){
    let result =     
    `<div class="item">
        <label for="edt${element.name}">${element.name}</label>
        <input name="${element.name}" id="edt${element.name}" value="${element.value}">
    </div>`;
    return result;
}

var bulidHeader = function(){
    let result = `<html>
                    <head>
                        <meta name="viewport" charset="utf-8" content="width=device-width, initial-scale=1.0"/>
                        <link rel="stylesheet" href="einstellungen.css">
                        ${buildClientJS()}
                    </head>
                    <body>
                        <h1>Einstellungen</h1> 
                        <br><br>
                        <iframe id="resultFrame" name="formDestination" style="visibility: hidden; width: 0px; height: 0px" onload="saveResult()"></iframe>
                        <div style="display: block;overflow: auto;">
                            <form id="form" class="form" action="einstellungen" method="POST" target="formDestination">`;
    return result;
}


var buildFooter = function(){
    let result = 
                `</form></div>
                <br>
                <a style="float: left;margin: 0 auto" href="/home">zurück</a>
            </body>
        </html>`;
    return result;
}
/*
[
    {
        changed: false;
        deleted: false;
        name: "", 
        id: "",
        mitarbeiter : [
            {
                id: "",
                name: ""
            }
        ]
    },
    {
        name: "", 
        id: "",
        mitarbeiter : [
            {
                id: "",
                name: ""
            }
        ]
    }

]
*/
import { listbox } from "./components/listbox.js";

var raumliste = []; // alle räume mit mitarbeitern zugeteilt
var mitarbeiterInRaum = []; // mitarbeiter, die in einem bestimmten raum sind
var restlicheMitarbeiter = []; // alle mitarbeiter, die nicht in obiger liste sind

var listboxRest = new listbox(document.getElementById('rest'));

window.onload = function(){
    DatenNeuLaden();
}

function DatenNeuLaden(){
    fetch("/raumliste.txt", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
            raumliste = JSON.parse(text);
            Aktualisieren();
        })
}

function Aktualisieren(){
    let raumSelect = document.getElementById("raumSelect");
    for (let index = 0; index < raumliste.length; index++) {
        const element = raumliste[index];
        const option = document.createElement('option');
        option.value = element.id;
        option.innerHTML = 'Raum: ' + element.name;
        raumSelect.appendChild(option);
    }
    setAktuellerRaum(raumSelect.value)
    
    let chlidNodes = [];
    listboxRest.clear();
    for (let index = 0; index < restlicheMitarbeiter.length; index++) {
        const element = restlicheMitarbeiter[index];
        let item = createSelectableItem(element.name, element.id, element.raum_id);
        chlidNodes.push(item);
    }
    listboxRest.Aktualisieren(chlidNodes);
}

function setAktuellerRaum(raum_id){
    mitarbeiterInRaum = raumliste.filter(raum => raum.id = raum_id).mitarbeiter;
    raumliste.forEach(raum => {
        restlicheMitarbeiter = restlicheMitarbeiter.concat(raum.mitarbeiter.filter(mit => {
            return mit.raum_id != raum_id;            
        }))
    })
}

function Speichern(){
    fetch("/raumliste", {
        method: "POST",
        body: JSON.stringify(raumliste),
        headers: { "Content-type": "application/json" },
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
            window.alert(text);
        })
}


function editRaum(raum_id, raum_name_neu){
    for (let index = 0; index < raumliste.length; index++) {
        const element = raumliste[index];
        if (element.id == raum_id) {
            element.name = raum_name_neu;
            break;
        }       
    }
}

function editMitarbeiter(id, name_neu){
    for (let index = 0; index < raumliste.length; index++) {
        const element = raumliste[index];
        if (element.id == id) {
            element.name = name_neu;
            break;
        }       
    }
}

function editMitarbeiterRaum(mitarbeiter_id, raum_id_alt, raum_id_neu){
    for (let index = 0; index < raumliste.length; index++) {
        const element = raumliste[index];
        var ar = [];
        
        if (element.id == raum_id_alt) {
            // mitarbeiter mit id zwischenspeichern
            let tempMitarbeiter = element.mitarbeiter.find(mit => mit.id == mitarbeiter_id); 
            tempMitarbeiter.raum_id = raum_id_neu; 

            // mitarbeiter mit id wird rausgefiltert
            element.mitarbeiter = element.mitarbeiter.filter(mit => mit.id != mitarbeiter_id);

            // zwischengespeicherter mitarbeiter zu neuer anderer liste hinzufügen
            raumliste.find(raum => raum.id == raum_id_neu).mitarbeiter.push(tempMitarbeiter);
            break;
        }       
    }
}

function createSelectableItem(text, mitarbeiter_id, raum_id1){
    let item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = text;
    item.setAttribute('mitarbeiter_id', mitarbeiter_id);
    item.setAttribute('raum_id', raum_id1);
    return item;
}
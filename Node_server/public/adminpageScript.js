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
import { contextmenu } from "./components/contextmenu.js";

window.raumliste = []; // alle räume mit mitarbeitern zugeteilt
window.mitarbeiterInRaum = []; // mitarbeiter, die in einem bestimmten raum sind
window.restlicheMitarbeiter = []; // alle mitarbeiter, die nicht in obiger liste sind

window.listboxA = new listbox(document.getElementById('A'), document.getElementById('raumSelectA'));
window.listboxB = new listbox(document.getElementById('B'), document.getElementById('raumSelectB'));

window.contextMenuListboxA = new contextmenu(document.getElementById('menu'), window.listboxA);

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

window.Aktualisieren = function(){
    let selectA = document.getElementById("raumSelectA");
    let selectB = document.getElementById("raumSelectB");

    for (let index = 0; index < raumliste.length; index++) {
        const element = raumliste[index];
        const option = document.createElement('option');
        option.value = element.id;
        option.innerHTML = 'Raum: ' + element.name;
        selectA.appendChild(option);
        selectB.appendChild(option.cloneNode(true));
    }

    listboxA.Aktualisieren();
    listboxB.Aktualisieren();
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

window.moveMitarbeiterToRaum = function(mitarbeiter_id, raum_id){
    for (let index = 0; index < raumliste.length; index++) {
        const raum = raumliste[index];
        for (let index_raum = 0; index_raum < raum.mitarbeiter.length; index_raum++) {
            const mitarbeiter = raum.mitarbeiter[index_raum];
            if (mitarbeiter.id == mitarbeiter_id) {
                mitarbeiter.raum_id = raum_id;
                mitarbeiter.changed = true;
                raum.mitarbeiter = raum.mitarbeiter.filter(el => el !== mitarbeiter);
                window.getRaumById(raum_id).mitarbeiter.push(mitarbeiter);
                             
                return true;
            }
        }
    }
    return false
}

window.getRaumById = function(id){
    for (let index = 0; index < raumliste.length; index++) {
        const raum = raumliste[index];
        if (raum.id == id) {
            return raum;
        }
    }
}

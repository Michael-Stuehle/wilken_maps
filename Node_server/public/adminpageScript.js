/*
[
    {
        edited: false;
        deleted: false;
        added: false;
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
                raum_id:
                user (email)
            }
        ]
    }

]
*/

import { listbox } from "./components/listbox.js";
import { contextmenu } from "./components/contextmenu.js";

window.saved = true;

window.raumliste = []; // alle räume mit mitarbeitern zugeteilt

window.listboxA = new listbox(document.getElementById('A'), document.getElementById('raumSelectA'), true, function(items){
    if (items.length > 0) {
        document.getElementById("btn-rechts").disabled = false;
    }else{
        document.getElementById("btn-rechts").disabled = true;
    }
});
window.listboxB = new listbox(document.getElementById('B'), document.getElementById('raumSelectB'), false, function(items){
    if (items.length > 0) {
        document.getElementById("btn-links").disabled = false;
    }else{
        document.getElementById("btn-links").disabled = true;
    }
});

window.contextMenuListboxA = new contextmenu(document.getElementById('menu'), window.listboxA);
window.contextMenuListboxB = new contextmenu(document.getElementById('menu'), window.listboxB);

window.addEventListener("load", function(){
    DatenNeuLaden();
});


window.checkAnythingChanged = function(){
    return !saved;
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
            saved = true;  
            Aktualisieren();
        })
}

window.Aktualisieren = function(){
    let selectA = document.getElementById("raumSelectA");
    let selectB = document.getElementById("raumSelectB");

    selectA.textContent = "";
    selectB.textContent = "";

    for (let index = 0; index < raumliste.length; index++) {
        const element = raumliste[index];
        const option = document.createElement('option');
        option.value = element.id;
        option.innerHTML = element.name;
        const option2 = option.cloneNode(true);

        if (selectA.getAttribute('_selected') == option.value) {
            option.setAttribute('selected', true);
        }

        if (selectB.getAttribute('_selected') == option2.value) {
            option2.setAttribute('selected', true);
        }

        selectA.appendChild(option);
        selectB.appendChild(option2);
    }

    listboxA.Aktualisieren();
    listboxB.Aktualisieren();
}


window.Speichern = function(){
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
            element.edited = true;
            saved = false;
            break;
        }       
    }
}

window.editMitarbeiter = function(id, name_neu){
    for (let index = 0; index < raumliste.length; index++) {
        const raum = raumliste[index];
        for (let index_raum = 0; index_raum < raum.mitarbeiter.length; index_raum++) {
            const element = raum.mitarbeiter[index_raum];
            if (element.id == id) {
                element.name = name_neu;
                element.edited = true;
                saved = false;
                return true;
            }   
        }       
    }
    return false
}

window.moveItemsRechts = function(){
    let items = listboxA.getSelectedItems();
    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (window.moveMitarbeiterToRaum(element.getAttribute('mitarbeiter_id'), listboxB.container.getAttribute('raum_id'))){
            window.Aktualisieren();
        }
    }
}

window.moveItemsLeft = function(){
    let items = listboxB.getSelectedItems();
    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (window.moveMitarbeiterToRaum(element.getAttribute('mitarbeiter_id'), listboxA.container.getAttribute('raum_id'))){
            window.Aktualisieren();
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
                mitarbeiter.edited = true;
                saved = false;
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

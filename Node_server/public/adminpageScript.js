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

window.raumliste = []; // alle räume mit mitarbeitern zugeteilt
window.mitarbeiterInRaum = []; // mitarbeiter, die in einem bestimmten raum sind
window.restlicheMitarbeiter = []; // alle mitarbeiter, die nicht in obiger liste sind

window.listboxRest = new listbox(document.getElementById('rest'));
window.listboxRaum = new listbox(document.getElementById('raum'));

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

    chlidNodes = [];
    listboxRaum.clear();
    for (let index = 0; index < mitarbeiterInRaum.length; index++) {
        const element = mitarbeiterInRaum[index];
        let item = createSelectableItem(element.name, element.id, element.raum_id);
        chlidNodes.push(item);
    }
    listboxRaum.Aktualisieren(chlidNodes);
}


window.setAktuellerRaum = function(raum_id){
    mitarbeiterInRaum = [];
    raumliste.forEach(raum => {
        if (raum.id == raum_id){
            mitarbeiterInRaum = mitarbeiterInRaum.concat(raum.mitarbeiter);
        }
    })

    document.getElementById('raum').setAttribute('raum_id', raum_id)
    
    restlicheMitarbeiter = [];
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



function createSelectableItem(text, mitarbeiter_id, raum_id){
    let item = document.createElement('div');
    item.classList.add('item');
    item.innerHTML = text;
    item.setAttribute('mitarbeiter_id', mitarbeiter_id);
    item.setAttribute('raum_id', raum_id);
    item.setAttribute('draggable', true)
    return item;
}
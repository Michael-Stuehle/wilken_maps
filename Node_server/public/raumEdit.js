import { popupForm } from "./components/popupForm.js";

window.popupEditRaum = new popupForm(
    document.getElementById('editRaumPopup'), 
    document.getElementById('btnRaumEditClose'), 
    document.getElementById('btnRaumEditOk'), 
    document.getElementById('editRaumPopupTitle'),
    (popup, actionWasAdd) => raumEditBeforeClose(popup, actionWasAdd), // actionWasAdd: true=add  | false=edit 
    (popup, item) => raumEditBeforeShow(popup, item));



window.showRaumEditPopup = function(raumselectId){
    let currentlySelected = document.getElementById(raumselectId);

    let itemValues = {
        id: currentlySelected.value,
        name: currentlySelected.options[currentlySelected.selectedIndex].text
    }
    window.popupEditRaum.showModal(itemValues, false, 'Raum Bearbeiten');
}

window._showRaumEditPopup = function(selectedElement){
    let currentlySelected = selectedElement;
    
    let itemValues = {
        id: currentlySelected.value,
        name: currentlySelected.options[currentlySelected.selectedIndex].text,
    }
    window.popupEditRaum.showModal(itemValues, false, 'Raum Bearbeiten');
}

var getMitarbeiterCountForRaum = function(raum){
    let count = 0;
    for (let index = 0; index < raum.mitarbeiter.length; index++) {
        const element = raum.mitarbeiter[index];
        if (!element.deleted) {
            count++;
        }
    }
    return count;
}

window.deleteRaum = function(selectId){
    let select = document.getElementById(selectId);
    for (let index = 0; index < window.raumliste.length; index++) {
        const raum = window.raumliste[index];
        if (raum.id == select.value) {
            if (getMitarbeiterCountForRaum(raum) > 0) {
                alert('ein raum kann nur gelöscht werden, wenn er keine mitarbeiter mehr beinhaltet')
                return false;
            }else{
                raum.deleted = true;
                window.Aktualisieren();
            }
        }
    }

}

window.showRaumAddPopup = function(selectId){   
    let itemValues = {
        id: "",
        name: "",
        selectID: selectId
    }
    window.popupEditRaum.showModal(itemValues, true, 'Raum Hinzufügen');
}

var getRaumByName = function(raumName){
    for (let index = 0; index < window.raumliste.length; index++) {
        const raum = window.raumliste[index];
        if (raum.name == raumName) {
            return raum;
        }
    }
    return null;
}

var raumEditBeforeClose = function(popup, wasAdd){

    let newRaum = {
        name: document.getElementById("edtNameRaum").value,
        id: document.getElementById("edtNameRaum").getAttribute('_id'), 
    };

    if (wasAdd) {
        let raumExists = getRaumByName(newRaum.name);
        if (raumExists != null) {
            if (raumExists.deleted) {
                raumExists.deleted = false;
                newRaum = raumExists;
            }else{
                alert('dieser raum existiert bereits!');
                return false;
            }
        }else{
            window.raumliste.push({
                name: newRaum.name,
                id: newRaum.id,
                added: true,
                mitarbeiter: []
            })
        }
        window.saved = false;
        window.Aktualisieren();
        let select = document.getElementById(popup.itemValues.selectID);
        for (let index = 0; index < select.options.length; index++) {
            const option = select.options[index];
            if (option.text == newRaum.name) {
                select.selectedIndex = index;
                select.onchange.apply(select);
            }
        }
        
    }else{
        window.editRaum(newRaum.id, newRaum.name);
        window.Aktualisieren();
    }   
}

var raumEditBeforeShow = function(popup, values){
    document.getElementById('edtNameRaum').value = values.name;
    document.getElementById('edtNameRaum').setAttribute('_id', values.id);
}
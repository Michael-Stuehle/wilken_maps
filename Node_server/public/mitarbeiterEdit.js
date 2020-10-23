import { popupForm } from "./components/popupForm.js";

window.popupEditMitarbeiter = new popupForm(
    document.getElementById('editMitarbeiterPopup'), 
    document.getElementById('btnMitarbeiterPopupClose'), 
    document.getElementById('btnMitarbeiterPopupOK'), 
    document.getElementById('editMitarbeiterPopupTitle'),
    (popup, actionWasAdd) => mitarbeiterEditBeforeClose(popup, actionWasAdd), // actionWasAdd: true=add  | false=edit 
    (popup, item) => mitarbeiterEditBeforeShow(popup, item));



window.showMitarbeiterEditPopup = function(){
    let currentlySelected = {};
    if (window.contextMenuListboxA.isVisible()) {
        currentlySelected = window.contextMenuListboxA.listbox.getSelectedItems()[0];
    }else {
        currentlySelected = window.contextMenuListboxB.listbox.getSelectedItems()[0];
    }
    
    let itemValues = {
        mitarbeiter: currentlySelected.getAttribute('mitarbeiter'),
        mitarbeiter_id: currentlySelected.getAttribute('mitarbeiter_id'),
        raum_id: currentlySelected.getAttribute('raum_id'),        
        user: currentlySelected.getAttribute('user'),
        raumliste: window.raumliste
    }
    window.popupEditMitarbeiter.showModal(itemValues, false, 'Mitarbeiter Bearbeiten');
}

window._showMitarbeiterEditPopup = function(selectedElement){
    let currentlySelected = selectedElement;
    
    let itemValues = {
        mitarbeiter: currentlySelected.getAttribute('mitarbeiter'),
        mitarbeiter_id: currentlySelected.getAttribute('mitarbeiter_id'),
        raum_id: currentlySelected.getAttribute('raum_id'),        
        user: currentlySelected.getAttribute('user'),
        raumliste: window.raumliste
    }
    window.popupEditMitarbeiter.showModal(itemValues, false, 'Mitarbeiter Bearbeiten');
}

window.deleteMitarbeiter = function(){
    let listbox = {};
    if (window.contextMenuListboxA.isVisible()) {
        listbox = window.contextMenuListboxA.listbox;
    }else {
        listbox = window.contextMenuListboxB.listbox;
    }

    listbox.deleteSelectedMitarbeiter();
}

window.showMitarbeiterAddPopup = function(){   
    let itemValues = {
        mitarbeiter: "",
        mitarbeiter_id: -1,
        raum_id: -1,        
        user: "",
        raumliste: raumliste
    }
    window.popupEditMitarbeiter.showModal(itemValues, true, 'Mitarbeiter Hinzufügen');
}

var mitarbeiterEditBeforeClose = function(popup, wasAdd){
    let listbox = window.listboxA; // nircht relevant welche listbox

    let newMitarbeiter = {
        name: document.getElementById("edtName").value,
        id: "", 
        raum_id: document.getElementById("selRaum").value, 
        user: ""
    };

    if (wasAdd) {
        listbox.addMitarbeiter(newMitarbeiter);
    }else{
        listbox.editMitarbeiter(popup.itemValues.mitarbeiter_id, newMitarbeiter.raum_id, newMitarbeiter.name);
    }
}

var mitarbeiterEditBeforeShow = function(popup, values){
    document.getElementById('edtName').value = values.mitarbeiter;
    let raumselect = document.getElementById('selRaum');
    raumselect.textContent = "";
    for (let index = 0; index < values.raumliste.length; index++) {
        const raum = values.raumliste[index];
        const option = document.createElement('option');
        if (raum.id == values.raum_id) {
            option.selected = true;
        }
        option.value = raum.id;
        option.innerHTML = raum.name;
        raumselect.appendChild(option);
    }
}
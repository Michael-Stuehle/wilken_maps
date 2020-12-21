export class mitarbeitersuche{
    constructor(htmlForm, firstElem, closeBtn, okBtn, searchInput, searchResultBox, titleElement, onBeforeClose){
        var self = this;
        this.modal = htmlForm;
        this.firstElem = firstElem;
        this.btnClose = closeBtn;
        this.okBtn = okBtn;
        this.onBeforeClose = onBeforeClose;
        this.titleElement = titleElement;
        this.searchInput = searchInput;
        self.searchInput.onchange = () => self.filter(self.searchInput.value);
        this.searchResultBox = searchResultBox;
        this.alleItems = [];
        this.displayedItems = [];
        this.lastSelectedItem = {};
   
        this.showModal = function(resultListbox, titleText){
            self.resultListbox = resultListbox;
            self.modal.style.display = "block";
            self.titleElement.innerHTML = titleText;
            self.firstElem.focus();
            self.Aktualisieren();
            self.selectFirstItem();
        }

        // onchange="mitarbeitersuche.filter();" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"
        this.filter = function(newValue){
            self.displayedItems = [];
            for (let index = 0; index < self.alleItems.length; index++) {
                const mitarbeiter = self.alleItems[index];
                if (mitarbeiter.name.toLowerCase().startsWith(newValue.toLowerCase())) {
                    self.displayedItems.push(mitarbeiter)
                }                
            }
            this.Aktualisieren();
        }
        
        this.hideModal = function(res){
            if(res){
                let selected = self.getMitarbeiterById(self.getSelectedItems()[0].getAttribute('mitarbeiter_id'))
                self.onBeforeClose(selected, self.resultListbox);
            }
            self.modal.style.display = "none"; 
        }   
        
        // When the user clicks on <span> (x), close the modal
        this.btnClose.onclick = function() {
            self.hideModal(false);
        }
    
        this.okBtn.onclick = function(){
            self.hideModal(true);
        }
        
        window.addEventListener('keydown', function(event){
            if (event.keyCode == 27 && self.modal.style.display != 'none') {
                self.hideModal(false);
            }
        })
    
        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener('click', function(event) {
            if (event.target == self.modal) { // modal heist ausgegrauter bereich
                self.hideModal(false);
            }
        })

        this.deSelectAll = function(){
            self.searchResultBox.querySelectorAll('div').forEach(item =>
                item.classList.remove('selected')
            );
        }

        this.selectFirstItem = function(event){
            let item = self.searchResultBox.firstChild;
            if (item != null && item.classList.contains('item')) {
                self.setItemSelected(item, {}); 
            }            
        }

        this.setItemSelected = function(item, event){
            self.scrollInView(item);
            let wasSelected = item.classList.contains('selected');

            if (wasSelected) {
                // items abwählen nicht möglich
                //item.classList.remove('selected');
            }else{
                self.deSelectAll(item.parentNode);
                item.classList.add('selected');
                self.lastSelectedItem = item;
            }
        }

        this.scrollInView = function (element) {
            if (self.lastSelectedItem == null) {
                return;
            }
            let elementTop = element.offsetTop;
            let elementheight = element.offsetHeight;
            let top = self.searchResultBox.scrollTop + self.searchResultBox.offsetTop;
            let bottom =  top + self.searchResultBox.clientHeight;

            if (elementTop < top){
                element.scrollIntoView(true);
            }else if((elementTop + elementheight) > bottom){
                element.scrollIntoView(false);
            }
        }

        this.getMitarbeiterById = function(mitarbeiterId){
            for (let index = 0; index < window.raumliste.length; index++) {
                const raum = window.raumliste[index];
                for (let raum_index = 0; raum_index < raum.mitarbeiter.length; raum_index++) {
                    const mitarbeiter = raum.mitarbeiter[raum_index];
                    if (mitarbeiter.id == mitarbeiterId) {
                        return mitarbeiter;
                    }
                }
            }
            return null;
        }

        this.Aktualisieren = function(){
            self.clear();
            let childNodes = [];
            for (let index = 0; index < self.displayedItems.length; index++) {
                const mitarbeiter = self.displayedItems[index];
                if (mitarbeiter.deleted) {
                    continue; // wenn als deleted geflagt wurde einfach ignorieren
                }
                let item = self.createSelectableItem(mitarbeiter.name, mitarbeiter.id, mitarbeiter.raum_id, mitarbeiter.user);
                childNodes.push(item);
            }
            for (let index = 0; index < childNodes.length; index++) {
                const element = childNodes[index];
                element.onclick = function(event){
                    self.setItemSelected(element, event);
                } 
                element.ondblclick = function(event){
                    self.setItemSelected(element, {});
                    self.hideModal(true)
                }
                self.searchResultBox.appendChild(element);
            }
            if (self.getSelectedItems().length == 0) { // keine items ausgewählt
                self.selectFirstItem();
            }
        }

        this.createSelectableItem = function(text, mitarbeiter_id, raum_id, user_email){
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = 
                '<p class="item-text">' +text + '</p>'+
                '<p class="item-text">' +user_email + '</p>';
            item.setAttribute('mitarbeiter_id', mitarbeiter_id);
            item.onkeydown = (event) => self.containerKeyDown(event);
            item.setAttribute('mitarbeiter', text);
            item.setAttribute('raum_id', raum_id);
            item.setAttribute('user', user_email);
            return item;
        }

        this.containerKeyDown = function(event){
            
            switch(event.keyCode){
                case 37: case 39: // Arrow keys
                    event.preventDefault(); 
                    break;
                case 38: 
                    event.preventDefault();     
                    if (self.lastSelectedItem != null) {
                        self.selectPrev(event);
                    }
                    break;
                case 40:
                    if (self.lastSelectedItem != null) {
                        self.selectNext(event);
                    }
                    event.preventDefault(); 
                    break;
                case 13:
                    if (self.getSelectedItems().length > 0) {
                        self.hideModal(true);
                    }                    
                    break;
                default: break; // do not block other keys
            }    
        }

        this.selectNext = function(event){
            let items = self.searchResultBox.children;
            for (let index = 0; index < items.length-1; index++) {
                const element = items[index];
                if (element == self.lastSelectedItem) {
                    self.setItemSelected(items[index+1], event)
                    break;
                } 
            }
        }

        this.selectPrev = function(event){
            let items = self.searchResultBox.children;
            for (let index = items.length-1; index > 0; index--) {
                const element = items[index];
                if (element == self.lastSelectedItem) {
                    self.setItemSelected(items[index-1], event)
                    break;
                } 
            }
        }

        this.HookupEvents = function(){
            self.searchResultBox.addEventListener("keydown", self.containerKeyDown, true);
            self.searchInput.addEventListener('keydown', self.containerKeyDown, true)
        }
        
        this.clear = function(){
            self.searchResultBox.textContent = '';
        }

        this.getSelectedItems = function(){
            let items = self.searchResultBox.childNodes;
            let result = [];
            items.forEach(element => {
                if (element.classList.contains('selected')) {
                    result.push(element);   
                }
            });
            return result;
        }        
        self.HookupEvents();      
        
        for (let index = 0; index < window.raumliste.length; index++) {
            const raum = window.raumliste[index];
            for (let index_raum = 0; index_raum < raum.mitarbeiter.length; index_raum++) {
                const mitarbeiter = raum.mitarbeiter[index_raum];
                self.alleItems.push(mitarbeiter);
            }
        }

        self.filter("");
    }
}
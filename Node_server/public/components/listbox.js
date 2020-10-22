var dragSrcListbox = {};

export class listbox{
    
    constructor(container, select, left, onselectItem){
        this.container = container;
        this.select = select;
        this.raum = {};
        this.isLeft = left;
        this.onselectItem = onselectItem;
        var self = this;

        this.select.onchange = function(){
            this.setAttribute('_selected', this.value)
            self.Aktualisieren();
        }       
        
        this.isLeftListbox = function(){
            return self.isLeft;
        }

        this.deSelectAll = function(){
            self.container.querySelectorAll('div').forEach(item =>
                item.classList.remove('selected')
            );
        }
        this.container.ondragover = function(e){
            self.handleDragOver(e);
        }
        this.container.ondrop = function(e){
            self.handleDrop(e);
        } 

        this.setItemSelected = function(item, event){
            self.scrollInView(item);
            let wasSelected = item.classList.contains('selected');
            if (!event.ctrlKey && !event.shiftKey) {
                self.deSelectAll(item.parentNode);
            }
            if (wasSelected) {
                item.classList.remove('selected');
            }else{
                item.classList.add('selected');
                self.lastSelectedItem = item;
            }
            self.onselectItem(self.getSelectedItems())
        }

        this.scrollInView = function (element) {
            if (self.lastSelectedItem == null) {
                return;
            }
            let elementTop = element.offsetTop;
            let elementheight = element.offsetHeight;
            let top = self.container.scrollTop + self.container.offsetTop;
            let bottom =  top + self.container.clientHeight;

            if (elementTop < top){
                element.scrollIntoView(true);
            }else if((elementTop + elementheight) > bottom){
                element.scrollIntoView(false);
            }
        }

        this.deleteSelectedMitarbeiter = function(){
            let allSelectedItems = self.getSelectedItems();
            
            let confirmed = // keine user betroffen ODER löschen ist confirmed
                !self.checkSelectedItemsHaveUsers() ||  
                confirm('mindestens einer der ausgewählten Mitarbeiter hat einen zugehörigen user, diese müssen ebenfalls gelöscht werden. Fortfahren?');

            for (let index = 0; index < allSelectedItems.length; index++) {
                const currentlySelected = allSelectedItems[index];
            
                let itemValues = {
                    mitarbeiter: currentlySelected.getAttribute('mitarbeiter'),
                    mitarbeiter_id: currentlySelected.getAttribute('mitarbeiter_id'),
                    raum_id: currentlySelected.getAttribute('raum_id'),        
                    user: currentlySelected.getAttribute('user')
                }

                if (confirmed) {
                    for (let index = 0; index < raumliste.length; index++) {
                        const raum = raumliste[index];
                        for (let index_raum = 0; index_raum < raum.mitarbeiter.length; index_raum++) {
                            const element = raum.mitarbeiter[index_raum];
                            if (element.id == itemValues.mitarbeiter_id) {
                                element.deleted = true;
                            }
                        }
                    }
                }
            } 
            window.Aktualisieren();
        }

        this.checkSelectedItemsHaveUsers = function(){
            let selectedItems = self.getSelectedItems();
            for (let index = 0; index < selectedItems.length; index++) {
                const element = selectedItems[index];
                let itemValues = {
                    mitarbeiter: element.getAttribute('mitarbeiter'),
                    mitarbeiter_id: element.getAttribute('mitarbeiter_id'),
                    raum_id: element.getAttribute('raum_id'),        
                    user: element.getAttribute('user')
                }
                if (itemValues.user != "") {
                    return true;
                }
            }
            return false;

        }

        this.editMitarbeiter = function(mitarbeiter_id, raum_neu, name_neu){
            if (window.moveMitarbeiterToRaum(mitarbeiter_id, raum_neu) && window.editMitarbeiter(mitarbeiter_id, name_neu)){
                window.Aktualisieren();
            }
        }

        this.addMitarbeiter = function(mitarbeiterObj){
            for (let index = 0; index < raumliste.length; index++) {
                const raum = raumliste[index];
                if (raum.id == mitarbeiterObj.raum_id) {
                    mitarbeiterObj.added = true;
                    raum.mitarbeiter.push(mitarbeiterObj);
                    window.Aktualisieren();
                }
            }
        }

        this.Aktualisieren = function(){
            self.clear();
            self.setAktuellerRaum();
            let childNodes = [];
            for (let index = 0; index < self.raum.mitarbeiter.length; index++) {
                const mitarbeiter = self.raum.mitarbeiter[index];
                if (mitarbeiter.deleted) {
                    continue; // wenn als deleted geflagt wurde einfach ignorieren
                }
                let item = self.createSelectableItem(mitarbeiter.name, mitarbeiter.id, mitarbeiter.raum_id, mitarbeiter.user);
                childNodes.push(item);
            }
            for (let index = 0; index < childNodes.length; index++) {
                const element = childNodes[index];
                element.addEventListener('dragstart', self.handleDragStart, false);
                element.addEventListener('dragover', self.handleDragOver, false);
                element.addEventListener('dragenter', self.handleDragEnter, false);
                element.addEventListener('dragleave', self.handleDragLeave, false);
                element.addEventListener('dragend', self.handleDragEnd, false);
                element.addEventListener('drop', self.handleDrop, false)
                element.onclick = function(event){
                    self.setItemSelected(element, event);
                } 
                self.container.appendChild(element);
            }
            self.onselectItem(self.getSelectedItems());
        }

        this.setAktuellerRaum = function(){
            let raum_id = self.select.value;
            window.raumliste.forEach(raum => {
                if (raum.id == raum_id){
                    self.raum = raum;
                }
            })
        
            self.container.setAttribute('raum_id', raum_id)
        }

        this.createSelectableItem = function(text, mitarbeiter_id, raum_id, user_email){
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = 
                '<p class="item-text">' +text + '</p>'+
                '<p class="item-text">' +user_email + '</p>';
            item.setAttribute('mitarbeiter_id', mitarbeiter_id);
            item.setAttribute('mitarbeiter', text);
            item.setAttribute('raum_id', raum_id);
            item.setAttribute('draggable', true);
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
                default: break; // do not block other keys
            }    
        }

        this.selectNext = function(event){
            let items = self.container.childNodes;
            for (let index = 0; index < items.length-1; index++) {
                const element = items[index];
                if (element == self.lastSelectedItem) {
                    self.setItemSelected(items[index+1], event)
                    break;
                } 
            }
        }

        this.selectPrev = function(event){
            let items = self.container.childNodes;
            for (let index = items.length-1; index > 0; index--) {
                const element = items[index];
                if (element == self.lastSelectedItem) {
                    self.setItemSelected(items[index-1], event)
                    break;
                } 
            }
        }

        this.HookupEvents = function(){
            console.log('events');
            document.addEventListener("keydown", self.containerKeyDown, true);
        }
        
        this.clear = function(){
            self.container.textContent = '';
        }

        this.getSelectedItems = function(){
            let items = self.container.childNodes;
            let result = [];
            items.forEach(element => {
                if (element.classList.contains('selected')) {
                    result.push(element);   
                }
            });
            return result;
        }

        this.handleDragStart = function(e){
            this.style.opacity = '0.6';
            this.style.backgroundColor = "transparent";

            dragSrcListbox = self; 
            if (!this.classList.contains('selected')) {
                this.classList.add('selected');
            }

            e.dataTransfer.effectAllowed = 'move';
        }

        this.handleDragEnd = function(e) {
            this.style.opacity = '1';
            this.style.backgroundColor = "";
          }
        
          this.handleDragOver = function(e) {
            if (e.preventDefault) {
              e.preventDefault();
            }
        
            return false;
          }
        
          this.handleDragEnter = function(e) {
            this.classList.add('over');
          }
        
          this.handleDragLeave = function(e) {
            this.classList.remove('over');
          }

          this.handleDrop = function(e) {
            e.stopPropagation();

            if (dragSrcListbox !== self) { // in anderer listbox
                const itemsToMove = dragSrcListbox.getSelectedItems();
                let raum_id_neu = self.container.getAttribute('raum_id'); // standart --> aus raum entfernt
      
                for (let index = 0; index < itemsToMove.length; index++) {
                    const element = itemsToMove[index];
                    if (window.moveMitarbeiterToRaum(element.getAttribute('mitarbeiter_id'), raum_id_neu)){
                        window.Aktualisieren();
                    }
                }
            }
            
            return false;
        }
        
        self.HookupEvents();        
    }    
}

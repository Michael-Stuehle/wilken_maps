var dragSrcListbox = {};

export class listbox{
    
    constructor(container, select){
        this.container = container;
        this.select = select;
        this.raum = {};

        this.select.onchange = function(){
            self.Aktualisieren();
        }
        
        var self = this;

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
            if (!event.ctrlKey && !event.shiftKey) {
                self.deSelectAll(item.parentNode);
            }
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
            }else{
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
            let top = self.container.scrollTop + self.container.offsetTop;
            let bottom =  top + self.container.clientHeight;

            if (elementTop < top){
                element.scrollIntoView(true);
            }else if((elementTop + elementheight) > bottom){
                element.scrollIntoView(false);
            }
        }

        this.Aktualisieren = function(){
            self.clear();
            self.setAktuellerRaum();
            let childNodes = [];
            for (let index = 0; index < self.raum.mitarbeiter.length; index++) {
                const element = self.raum.mitarbeiter[index];
                let item = self.createSelectableItem(element.name, element.id, element.raum_id);
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

        this.createSelectableItem = function(text, mitarbeiter_id, raum_id){
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = text;
            item.setAttribute('mitarbeiter_id', mitarbeiter_id);
            item.setAttribute('raum_id', raum_id);
            item.setAttribute('draggable', true)
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

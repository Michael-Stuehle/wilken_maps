

export class listbox{
    
    constructor(container){
        this.container = container;
        var self = this;

        this.deSelectAll = function(){
            self.container.querySelectorAll('div').forEach(item =>
                item.classList.remove('selected')
            );
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

        this.Aktualisieren = function(childNodes){
            for (let index = 0; index < childNodes.length; index++) {
                const element = childNodes[index];
                element.onclick = function(event){
                    self.setItemSelected(element, event);
                } 
                self.container.appendChild(element);
            }
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
        
        self.HookupEvents();        
    }    
}

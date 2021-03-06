import { listbox } from "./listbox.js";

var lastShownMenu = {};

export class contextmenu{
    constructor(menu, listbox){
        var self = this;
        this.menu = menu;
        this.listbox = listbox;

        this.isVisible = function(){
            return self === lastShownMenu;
        }

        this.toggleMenu = function(command) {
            self.menu.style.display = (command === "show" ? "block" : "none");

            if (command == "show") {
                lastShownMenu = self;
            }else if (lastShownMenu == self){ // falls self gerade noch sichtbar ist und geschlossen wird
                lastShownMenu = null;
            }

            if (listbox.getSelectedItems().length > 0) {
                if (listbox.isLeftListbox()) {
                    document.getElementById('li-links').classList.add('disabled');
                    document.getElementById('li-rechts').classList.remove('disabled');
                }else{
                    document.getElementById('li-rechts').classList.add('disabled');
                    document.getElementById('li-links').classList.remove('disabled');
                }
                document.getElementById('li-edit').classList.remove('disabled');
                document.getElementById('li-delete').classList.remove('disabled');
                
            }else{
                document.getElementById('li-links').classList.add('disabled');
                document.getElementById('li-rechts').classList.add('disabled');
                document.getElementById('li-edit').classList.add('disabled');
                document.getElementById('li-delete').classList.add('disabled');
            }
        };
    
        this.setPosition = function(point) {
            self.menu.style.left = point.left + "px";
            self.menu.style.top = point.top + "px";
            self.toggleMenu('show');
        };
    
        listbox.container.addEventListener("contextmenu", e => {
            e.preventDefault();
            const origin = {
                left: e.pageX,
                top: e.pageY
            };
            let el = document.elementFromPoint(origin.left, origin.top).parentElement;
            if (el.classList.contains('item')) {
                if (!el.classList.contains('selected')) {
                    listbox.setItemSelected(el, {});
                }
            }
            self.setPosition(origin);
            return false;
        });
        window.addEventListener("click", function(e) {
            if(self.menu.style.display == "block"){
                self.toggleMenu("hide");
            }        
        });

    }
    
    

}
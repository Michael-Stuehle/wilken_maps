export class popupForm{
  constructor(htmlForm, firstElem, closeBtn, okBtn, titleElement, onBeforeClose, onBeforeShow){
    var self = this;
    this.modal = htmlForm;
    this.firstElem = firstElem;
    this.btnClose = closeBtn;
    this.okBtn = okBtn;
    this.onBeforeClose = onBeforeClose;
    this.onBeforeShow = onBeforeShow;
    this.titleElement = titleElement;

    this.showModal = function(itemValues, addItem, titleText){
      self.itemValues = itemValues;
      self.addItem = addItem;
      self.onBeforeShow(self, itemValues);
      self.modal.style.display = "block";
      self.titleElement.innerHTML = titleText;
      self.firstElem.focus();
    }
  
    this.hideModal = function(res){
      if(res){
        self.onBeforeClose(self, self.addItem);
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
  }
}
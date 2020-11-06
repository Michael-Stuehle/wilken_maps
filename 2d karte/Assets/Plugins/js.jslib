mergeInto(LibraryManager.library, {
	
	HelloString: function (str) {
		window.alert(Pointer_stringify(str));
		return str;
	},

	LoadMitarbeiter: function(){
		fetch("http://ul-ws-mistueh/mitarbeiter.txt", {
			method: "GET",
			headers: { "Content-type": "application/json" },
		})
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
			unityInstance.SendMessage("ClientObject", "OnMitarbeiterListeLoad", text);
		})
		
	},
	
	LoadRaumliste: function(url){
		fetch(url, {
			method: "GET",
			headers: { "Content-type": "application/json" },
		})
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
            unityInstance.SendMessage("ClientObject", "OnRaumlisteLoad", text);
        })
	
	}
 
});
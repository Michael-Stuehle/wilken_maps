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
	
	getRaumById: function(obj, raum_id){
		var str_obj = Pointer_stringify(obj);
		window.getRaumById(raum_id).then(function(raum){
			console.log(raum);
			console.log("raum: " + JSON.stringify(raum) + " obj " + str_obj);
			unityInstance.SendMessage(str_obj, "OnRaumLoad", JSON.stringify(raum));
		});		
	}
 
});
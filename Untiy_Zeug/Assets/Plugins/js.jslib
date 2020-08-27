mergeInto(LibraryManager.library, {
	
	HelloString: function (str) {
		window.alert(Pointer_stringify(str));
		return str;
	},

	LoadMitarbeiter: function(){
		var oFrame = document.getElementById("frmFile");
		var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
		unityInstance.SendMessage("ClientObject", "OnFileLoad", strRawContents);
		
	},
	
	LoadUserInfo: function(){
		fetch("/permissions").then(function(response) {
			return response.text().then(function(text) {
				console.log(text);
				unityInstance.SendMessage("ClientObject", "setPerms", text);
			});
		});
		
	}
	
 
});
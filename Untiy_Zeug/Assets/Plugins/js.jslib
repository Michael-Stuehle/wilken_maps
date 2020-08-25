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
		var oFrame = document.getElementById("frmFileUserInfo");
		var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
		while (strRawContents.indexOf("\r") >= 0)
			strRawContents = strRawContents.replace("\r", "");
		var arrLines = strRawContents.split("\n");
		//alert("File " + oFrame.src + " has " + arrLines.length + " lines");
		var curLine = "";
		for (var i = 0; i < arrLines.length; i++) {
			curLine += arrLines[i];
		}
		//window.alert("Line is: '" + curLine + "'");
		unityInstance.SendMessage("ClientObject", "OnUsersLoad", curLine);
		
	}
	
 
});
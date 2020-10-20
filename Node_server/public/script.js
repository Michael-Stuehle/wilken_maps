function setDarkMode(darkmode){
    let root = document.documentElement;
    if (darkmode) {
        root.style.setProperty('--btnBackgroundColor', '#144d74');
        root.style.setProperty('--btnColor', '#d1cfcc');
        root.style.setProperty('--btnHoverColor',  '#175680');
        root.style.setProperty('--textColor', '#a59f97')
        root.style.setProperty('--backgroundColor', '#202020');
        root.style.setProperty('--settingIconColor', '#c5c2bf');    
        root.style.setProperty('--linkColor', '#2e83e6');
        root.style.setProperty('--borderColor', '#34383b');
    }else {
        root.style.setProperty('--btnBackgroundColor', '#0069b4');
        root.style.setProperty('--btnColor', '#ffffff');
        root.style.setProperty('--btnHoverColor',  '#70b6e7');
        root.style.setProperty('--textColor', '#4d4d4d');
        root.style.setProperty('--backgroundColor', '#ffffff');
        root.style.setProperty('--settingIconColor', '#141414');
        root.style.setProperty('--linkColor', '#0000ee');
        root.style.setProperty('--borderColor', '#dddddd');
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

fetch("/dark_mode", {
    method: "GET",
    headers: { "Content-type": "application/json" },
}).then(function (response) {
    return response.text();
}).then(function (result) {
    if (result == 'dark') {
        setCookie('darkmode', "true", 999)
    }else if (result == 'light'){
        setCookie('darkmode', "false", 999)
    }else{
        // kein ergebnis, cookie wird nicht geändert
    }
    
    let cdark = getCookie('darkmode');
    if (cdark == 'true') {
        setDarkMode(true);
    }else{
        setDarkMode(false);
    }
});


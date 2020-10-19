module.exports = {
   getRandomInt: function(max){
      return Math.floor(Math.random() * Math.floor(max));
   },

   generateRandomString: function(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?_-:;.,<>|^°[]²³';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   },

   getNameFromEmail: function(email){
      let splitByPunkt = email.split('.');
      let vorname = splitByPunkt[0];
      if (splitByPunkt.length > 1) {
         let nachname = splitByPunkt[1].split('@')[0];
         return nachname.toLowerCase() + ' ' + vorname.toLowerCase();
      }else{
         return vorname;
      }      
   },
   
   // salt für passwort (length zufällige chars)
   // safe hat keine zeichen (nur A-Z a-z 0-9)
   generateRandomStringSafe: function(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
}
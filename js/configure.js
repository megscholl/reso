"use strict";


          ///////////////////////////////////////////////////
          //////////// THIS JS FILE IS COMPLETE /////////////
          ///////////////// REFERENCE ONLY //////////////////
          ///////////////////////////////////////////////////

          

let firebase = require("firebase/app"),
    fb = require("./firebaseKey"),
    fbData = fb(), //running the fb file, containing what's inside fb-key
    auth = require("firebase/auth"),
    db = require("firebase/database");

var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL
};


firebase.getFBsettings = function(){
	 return config;
};

firebase.initializeApp(config);
module.exports = firebase;

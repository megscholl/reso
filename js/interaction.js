"use strict";

// requires - key, configuration, user, 
let $ = require('../lib/node_modules/jquery'),
    firebase = require('./configure'),
    interaction= require('./interaction'),
    user = require('./user'),
    dbRef = firebase.database().ref().child('reservations');



//////////////////////////////
// BUILD A USER INTO FIREBASE
//////////////////////////////

// USER OBJECT FOR FIREBASE 
let buildUserObject = (userName, userId, userImage) => {
    let userObject = {
        Name: userName, 
        uid: userId,
        photo: userImage
    };
    return userObject;
};


// ADDS USER TO FIREBASE
function addUser(userObject) {
    return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/users.json`,
      type: 'POST',
      data: JSON.stringify(userObject),
      dataType: 'json'
    }).done((userID) => {
      return userID;
    });
  }
  // POST - Submits data to be processed to a specified resource. Takes one parameter.

  

///////////////////////////////
// ADD RESERVATION TO FIREBASE
///////////////////////////////

//BUILDS RESERVATION OBJECT
  function buildResoObj() {
    let resoObj = {
    restaurant: $("#select-restaurant").val(),
    date: $("#select-date").val(),
    time: $("#select-time").val(),
    people: $("#select-people").val(),
    request: $("#select-request").val(),
    occasion: $("#select-occasion").val(),
    status: false,
    uid: user.getUser()
  };
  return resoObj;
 }

 // ADDS RESERVATION TO FIREBASE
 function addReso(resoFormObj) {
  return $.ajax({
    url: `${firebase.getFBsettings().databaseURL}/reservations.json`,
    type: 'POST',
    data: JSON.stringify(resoFormObj),
    dataType: 'json'
  }).done((resoID) => {
    return resoID;
  });
}


//CLICK RESERVE BUTTON TO SEND RESERVATION TO FIREBASE
$("#Reserve-btn").click(function() {
  let resObj = buildResoObj();
    addReso(resObj).then((resoID) => {
      console.log("the reserve table has been clicked", resObj);

    });
});



//////////////////////////////////
// SET CHECKIN STATUS IN FIREBASE
//////////////////////////////////

function setStatus(resoID) {
        return $.ajax({
          url: `${firebase.getFBsettings().databaseURL}/reservations/${resoID}.json`,
          type: 'PATCH',
          data: JSON.stringify({status: true}),
          dataType: 'json'
        }).done((userID) => {
          return userID;
        }).fail((error) => {
          console.log("error", error);
          return error;
        });
      }


$(document).on("click", ".check-in", function() {
  let checkintoReso = $(this).attr("id");
  console.log("check in", checkintoReso);
  setStatus(checkintoReso);
  // .then(() => {
  //   checkStatus();
  //   console.log("CHECK IN BUTTON CLICKED");
  
});



////////////////////////////////
//GET RESERVATION FROM FIREBASE
////////////////////////////////

var resoData = [];
let seeMore = document.getElementById("showcase");

// var rStatus;

 
function getReso(reso) {
  // console.log("AJAX", user.getUser());
  return $.ajax({
          url: `${firebase.getFBsettings().databaseURL}/reservations.json?orderBy="uid"&equalTo="${user.getUser()}"`,
        }).done((resoData) => {
          // console.log("resoData", resoData);
          return resoData;
        }).fail((error) => {
          return error;
        });
      }

function showReso() {
  getReso(event).then(function(rData) {
    // console.log("rData", rData);
    listResos(rData);
  });
}

// SHOWS USERS' UPCOMING RESERVATIONS
function listResos(rData) {
  // console.log("rData: ", rData);

  let seeResos = "";

  for(let reservation in rData){

      let rPlace = rData[reservation].restaurant;
      let rDate = rData[reservation].date;
      let rTime = rData[reservation].time;
      let rNum = rData[reservation].people;
      let rOcc = rData[reservation].occasion;
      let uglyID = reservation;

// console.log("User's reservation: ", "place: ", rPlace, "date: ", rDate, "time: ", rTime, "party of ", rNum, "occasion: ", rOcc);


seeResos += `


  <div id="editForm" class="col s4">
    <div class="card small">
      <div class="card-stacked">
          <div class="card-content">
            <h5>${rPlace}</h5>
              <ul>
                <li><h6>Reservation</h6></li>
                <li>Date: ${rDate}</li>
                <li>Time: ${rTime}</li>
                <li>Party of ${rNum}</li>
                <li>Occasion: ${rOcc}</li>
              </ul>
          </div>
          <div class="card-action">
            <a id="${uglyID}" class="check-in">Check in</a><a id="${uglyID}" class="edit">Edit</a> <a class="delete-reso" id="${uglyID}">Cancel</a>
            <div id="snackbar">Your reservation has been deleted.
            </div>
          </div>
      </div>
    </div>
  </div>



  `;
  }
  seeMore.innerHTML = seeResos;
}

// SHOW USERS RESO'S WHEN CLICKING 'UPCOMING RESERVATIONS' BUTTON
$("#userResos").click(function() {
  // console.log("merp");
  showReso();
});



///////////////////////////////
// EDIT RESERVATION IN FIREBASE
///////////////////////////////

  function editReso(resoFormObj) {
    return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/reservations/${resoFormObj}.json`,
      type: 'POST',
      data: JSON.stringify(resoFormObj)
    }).done((data) => {
      console.log("edit: ", data);
      return data;
    });
  }

// SHOW THE RESO EDIT FORM (SAVEEDIT) FUNCTION WHEN EDIT BUTTON IS CLICKED
  $(document).on("click", ".edit", function() {
    console.log("EDIT BUTTON CLICKED");
    let savedId = this.id;
   console.log("saved Id: ", savedId);
      getReso(event).then(function(rData) {
        console.log("edit rData", rData);
        saveEdit(rData);
      });
  });

// SAVE BUTTON
$(document).on("click", "#save-btn", function() {
  let resoObj = buildResoObj();
  // let savedId = this.id;
 console.log("reso Object", resoObj);
//  console.log("saved Id: ", savedId);
   addReso(resoObj)
   .then((savedId) => {
     console.log("edit ID: ", savedId);
    //  console.log("SAVE BUTTON CLICKED");
    showReso();
   });
 });



let formFields;

// EDIT RESO FORM
function saveEdit(rData) {
  console.log("save edit!");
  // console.log("rdata: ", rData);

  formFields = 
  `
  <div>
    <h5>Edit your reservation</h5>
    <form class="container form-inline" id="cta-buttons">
        <div class="row form-text">
        <div class="col">
        Date:  <div class="input-field inline"> <input id="select-date" type="date" class="validate"></div>
         </div>
         <div class="col">  
         Time: <div class="inline"><select class="browser-default" id="select-time">
         <option id="time0" value="select">Select</option>
         <option id="time1" value="11:45 AM">11:45 AM</option>
         <option id="time2" value="12:30 PM">12:30 PM</option>
         <option id="time3" value="2:00 PM">2:00 PM</option>
         <option id="time4" value="5:30 PM">5:30 PM</option>
         <option id="time5" value="6:00 PM">6:00 PM</option>
         <option id="time6" value="6:30 PM">6:30 PM</option>
          <option id="time7" value="6:30 PM">6:30 PM</option>
          <option id="time8" value="7:00 PM">7:00 PM</option>
          <option id="time9" value="7:00 PM">7:00 PM</option>
          <option id="time10" value="7:15 PM">7:15 PM</option>
          <option id="time11" value="8:15 PM">8:15 PM</option>
          <option id="time12" value="8:15 PM">8:15 PM</option>
          <option id="time13" value="9:00 PM">9:00 PM</option></select>
        </div>
        </div>
          How many people in your party? 
            <div class="input-field inline">
            <input id="select-people" type="number" class="validate">
            </div>
          Occasion: <select class="browser-default" id="select-occasion">
              <option selected></option>
              <option id="occ1" value="birthday">Birthday</option>
              <option id="occ2" value="anniversary">Anniversary</option>
              <option id="occ3" value="business">Business Meeting</option>
              <option id="occ4" value="other">Other Special Occassion</option>
              <option id="occ5" value="ladies">Ladies Night</option>
              </select>
          </div>
          <br>

          <div class="col s2">
            <a class="waves-effect waves-light btn edit-btn" id="save-btn">Save</a>
            <div id="snackbar">Your reservation has been saved!</div>
          </div>
      </form>
  </div>
  `;
  $("#editForm").html(formFields);
}

// SNACKBAR (TOAST) NOTIFICATION WHEN RESO IS EDITED & SAVED
$(document).on("click", ".edit-btn", function() {
  console.log("save toast coming through");

  // Get the snackbar DIV
  var snackSave = document.getElementById("snackbar");

  // Add the "show" class to DIV
  snackSave.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ snackSave.className = snackSave.className.replace("show", "");},3000);
});





////////////////////////////////////
// DELETE RESERVATION FROM FIREBASE
////////////////////////////////////
function deleteReso(resoID) {
  return $.ajax({
    url: `${firebase.getFBsettings().databaseURL}/reservations/${resoID}.json`,
    type: 'DELETE',
    data: JSON.stringify(resoID),
    dataType: 'json'
  }).done((data) => {
    return data;
  });
}

// RELOAD DOM WHEN RESO IS DELETED
$(document).on("click", ".delete-reso", function() {
  let cancelReso = $(this).attr("id");
  console.log("cancel", cancelReso);
  deleteReso(cancelReso)
  .then(() => {
    showReso();
    console.log("CANCEL BUTTON CLICKED");

  });
});

// SNACKBAR (TOAST) NOTIFICATION WHEN RESO DELETED
$(document).on("click", ".delete-reso", function() {
  console.log("save toast coming through");

  // Get the snackbar DIV
  var snackSave = document.getElementById("snackbar");

  // Add the "show" class to DIV
  snackSave.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ snackSave.className = snackSave.className.replace("show", "");},3000);
});

///////////////////////////////////////////////////////





  module.exports = {buildUserObject, addUser, addReso, deleteReso, showReso, editReso, saveEdit};
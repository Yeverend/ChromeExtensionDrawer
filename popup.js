console.log("Popup.js works");
document.addEventListener("DOMContentLoaded", function(event) {
  var buttonSave = document.getElementById("buttonSave");
  buttonSave.addEventListener("click", saveData);

  var buttonLoad = document.getElementById("buttonLoad");
  buttonLoad.addEventListener("click", loadData);

  var buttonUsePen = document.getElementById("buttonUsePen");
  buttonUsePen.addEventListener("click", usePen);

  var buttonLeavePen = document.getElementById("buttonLeavePen");
  buttonLeavePen.addEventListener("click", leavePen);
});

function usePen(){
  sendMessage({key: "USE_PEN"});
}

function leavePen(){
  sendMessage({key: "LEAVE_PEN"});
}

function loadData(){
  sendMessage({key:"LOAD_DATA"});
  console.log("I send to load data.");
}

function saveData(){
  sendMessage({key:"SAVE_DATA"});
  console.log("I send to save data.");
}

function sendMessage(message){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, message);
  });

}

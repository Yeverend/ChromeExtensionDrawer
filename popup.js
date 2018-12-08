console.log("Popup.js works");
document.addEventListener("DOMContentLoaded", function(event) {
  var buttonSave = document.getElementById("buttonSave");
  buttonSave.addEventListener("click", saveData);

  var buttonLoad = document.getElementById("buttonLoad");
  buttonLoad.addEventListener("click", loadData);

  var buttonPen = document.getElementById("buttonPen");
  buttonPen.addEventListener("click", usePen);

  //pen state
  chrome.storage.local.get('penState', function(result1){
      var res1 = result1.penState;
      if(res1 == null){
        console.log("ss");
        setPenState(false);
      }

      chrome.storage.local.get('penState', function(result2){
          var res2 = result2.penState;
          if(JSON.parse(res2)==true){
            setPenState(false);
            usePen();
          }
      });
  });

});

function setPenState(d){
  chrome.storage.local.set({'penState': d});
  console.log("Set.");
}

function usePen(){
  chrome.storage.local.get('penState', function(result1){
      var res1 = result1.penState;
      setPenState(!JSON.parse(res1));

      var buttonPen = document.getElementById("buttonPen");

      chrome.storage.local.get('penState', function(result2){
          var res2 = result2.penState;
          if(JSON.parse(res2)){
            sendMessage({key: "USE_PEN"});
            console.log("I send to use pen.");
            buttonPen.innerHTML = "<i class=\"fas fa-times\"></i>";
          }else{
            sendMessage({key: "LEAVE_PEN"});
            console.log("I send to leave pen.");
            buttonPen.innerHTML = "<i class=\"fas fa-pen\"></i>";
          }
      });
  });
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

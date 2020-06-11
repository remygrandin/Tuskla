import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_HeatedSeats() {

}

let LastHSData = null;

View_HeatedSeats.prototype.UpdateState = function(data) {  
  console.log("Data Heated Seats : " + JSON.stringify(data.responseData.HeatedSeats));
  
  LastHSData = data.responseData.HeatedSeats;
    
  UpdateLocalSeatDisplay();
};

function UpdateLocalSeatDisplay(){
  Shr.SetText("HS_btnS1", getDisplay(LastHSData.S1));
  Shr.SetText("HS_btnS2", getDisplay(LastHSData.S2));
  
  Shr.SetText("HS_btnS3", getDisplay(LastHSData.S3));
  Shr.SetText("HS_btnS4", getDisplay(LastHSData.S4));
  Shr.SetText("HS_btnS5", getDisplay(LastHSData.S5));
  
  if(LastHSData.S1 + LastHSData.S2 + LastHSData.S3 + LastHSData.S4 + LastHSData.S5 == 0)
  {
    Shr.SetText("HS_btnOnOff", "OFF");
    Shr.SetToggleValue("HS_btnOnOff", 0);
  }
  else
  {
    Shr.SetText("HS_btnOnOff", "ON");
    Shr.SetToggleValue("HS_btnOnOff", 1);
  }   
  
}

function getDisplay(lvl)
{
  switch(lvl){
    case 0:
      return "-"
    case 1:
      return "|"
    case 2:
      return "||"
    case 3:
      return "|||"
  }
}

function getNextValue(current)
{
  if(current == 0)
    return 3;
  return current - 1;
}


document.getElementById("HS_btnS1").addEventListener('click', function(evt) {
  LastHSData.S1 = getNextValue(LastHSData.S1);
  UpdateLocalSeatDisplay();
  cmd_out_HSSetSeatsLevel();
});

document.getElementById("HS_btnS2").addEventListener('click', function(evt) {
  LastHSData.S2 = getNextValue(LastHSData.S2);
  UpdateLocalSeatDisplay();
  cmd_out_HSSetSeatsLevel();
});

document.getElementById("HS_btnS3").addEventListener('click', function(evt) {
  LastHSData.S3 = getNextValue(LastHSData.S3);
  UpdateLocalSeatDisplay();
  cmd_out_HSSetSeatsLevel();
});

document.getElementById("HS_btnS4").addEventListener('click', function(evt) {
  LastHSData.S4 = getNextValue(LastHSData.S4);
  UpdateLocalSeatDisplay();
  cmd_out_HSSetSeatsLevel();
});

document.getElementById("HS_btnS5").addEventListener('click', function(evt) {
  LastHSData.S5 = getNextValue(LastHSData.S5);
  UpdateLocalSeatDisplay();
  cmd_out_HSSetSeatsLevel();
});

document.getElementById("HS_btnOnOff").addEventListener('click', function(evt) {
  if(Shr.GetToggleValue("HS_btnOnOff") == 0)
  {
    LastHSData.S1 = 3;
    LastHSData.S2 = 3;
    LastHSData.S3 = 3;
    LastHSData.S4 = 3;
    LastHSData.S5 = 3;
  }
  else
  {
    LastHSData.S1 = 0;
    LastHSData.S2 = 0;
    LastHSData.S3 = 0;
    LastHSData.S4 = 0;
    LastHSData.S5 = 0;
  }
  
  UpdateLocalSeatDisplay();
  cmd_out_HSSetSeatsLevel();
});

var setHSDebounceDelay = 1000; // in ms.
let setHSTimeout = null;

function cmd_out_HSSetSeatsLevel()
{
  if(setHSTimeout != null)
  {
    clearTimeout(setHSTimeout);
  }
  
  setHSTimeout = setTimeout(function(){ 
    console.log("Sending Heated seat Set command : ");
    Shr.SendData({ type: 'request', request: 'HSSetSeatsLevel', requestData: {
      S1: LastHSData.S1,
      S2: LastHSData.S2,

      S3: LastHSData.S3,
      S4: LastHSData.S4,
      S5: LastHSData.S5,
    } });
  }, setHSDebounceDelay);
}

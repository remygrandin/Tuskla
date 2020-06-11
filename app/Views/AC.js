import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_AC() {

}

let LastACData = null;
let FirstLoad = true;

View_AC.prototype.UpdateState = function(data) {
  console.log("Data AC : " + JSON.stringify(data.responseData.AC));
  
  LastACData = data.responseData.AC;
  

  
  UpdateLocalTempDisplay();
  
  if(FirstLoad)
  {
    FirstLoad = false;
    
    if(LastACData.DriverTemp == LastACData.PassengerTemp)
    {
      Shr.Show("AC_SyncedTemps");
      Shr.Hide("AC_SplittedTemps");
      Shr.SetToggleValue("AC_btnSync", 1);
    }
    else
    {
      Shr.Hide("AC_SyncedTemps");
      Shr.Show("AC_SplittedTemps");      
      Shr.SetToggleValue("AC_btnSync", 0);
    }
    
  }
  

  
  
  Shr.SetText("AC_txtIn", "Temp In : " + LastACData.InsideTemp + "°C");
  Shr.SetText("AC_txtOut", "Temp Out : " + LastACData.OutsideTemp + "°C");
  
};

function UpdateLocalTempDisplay(){
  if(LastACData.IsOn)
  {
    Shr.SetText("AC_btnOnOff", "ON");
    Shr.SetToggleValue("AC_btnOnOff", 1);
  }
  else
  {
    Shr.SetText("AC_btnOnOff", "OFF");
    Shr.SetToggleValue("AC_btnOnOff", 0);
  }
  
  Shr.SetText("AC_txtAllTemp", LastACData.DriverTemp + "°C");
  Shr.SetText("AC_txtDriverTemp", LastACData.DriverTemp + "°C");
  Shr.SetText("AC_txtPassengerTemp", LastACData.PassengerTemp + "°C");
  
  Shr.SetToggleValue("AC_btnWindows", LastACData.WindowsStatus == 0 ? 0 : 1);
  
  Shr.SetToggleValue("AC_btnDefrost", LastACData.IsDefrostOn ? 1 : 0);  
}


document.getElementById("AC_btnOnOff").addEventListener('click', function(evt) {
  if(LastACData.IsOn)
  {
    cmd_out_ACStop();  
  }
  else
  {
    cmd_out_ACStart();
  }
});

// Sync +/-

document.getElementById("AC_btnAllMinus").addEventListener('click', function(evt) {
  if(LastACData.DriverTemp > LastACData.MinTemp)
  {
    LastACData.DriverTemp = LastACData.PassengerTemp = LastACData.DriverTemp - 0.5;
    LastACData.IsOn = true;

    UpdateLocalTempDisplay();

    cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
  }
});

document.getElementById("AC_btnAllPlus").addEventListener('click', function(evt) {
  if(LastACData.DriverTemp < LastACData.MaxTemp)
  {
    LastACData.DriverTemp = LastACData.PassengerTemp = LastACData.DriverTemp + 0.5;
    LastACData.IsOn = true;

    UpdateLocalTempDisplay();

    cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
  }
});

// Driver +/-

document.getElementById("AC_btnDriverMinus").addEventListener('click', function(evt) {
  if(LastACData.DriverTemp > LastACData.MinTemp)
  {
    LastACData.DriverTemp = LastACData.DriverTemp - 0.5;
    LastACData.IsOn = true;

    UpdateLocalTempDisplay();

    cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
  }
});


document.getElementById("AC_btnDriverPlus").addEventListener('click', function(evt) {
  if(LastACData.DriverTemp < LastACData.MaxTemp)
  {
    LastACData.DriverTemp = LastACData.DriverTemp + 0.5;
    LastACData.IsOn = true;

    UpdateLocalTempDisplay();

    cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
  }
});



// Passenger +/-

document.getElementById("AC_btnPassengerMinus").addEventListener('click', function(evt) {
  if(LastACData.PassengerTemp > LastACData.MinTemp)
  {
    LastACData.PassengerTemp = LastACData.PassengerTemp - 0.5;
    LastACData.IsOn = true;

    UpdateLocalTempDisplay();

    cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
  }
});


document.getElementById("AC_btnPassengerPlus").addEventListener('click', function(evt) {
  if(LastACData.PassengerTemp < LastACData.MaxTemp)
  {
    LastACData.PassengerTemp = LastACData.PassengerTemp + 0.5;
    LastACData.IsOn = true;

    UpdateLocalTempDisplay();

    cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
  }
});


// Sync ON/OFF
document.getElementById("AC_btnSync").addEventListener('click', function(evt) {
  if(Shr.GetToggleValue("AC_btnSync") == 0)
  {
    Shr.Show("AC_SyncedTemps");
    Shr.Hide("AC_SplittedTemps");      
    Shr.SetToggleValue("AC_btnSync", 1);
    
    if(LastACData.DriverTemp != LastACData.PassengerTemp)
    {
      LastACData.DriverTemp = LastACData.PassengerTemp;

      

      cmd_out_ACSetTemps(LastACData.DriverTemp, LastACData.PassengerTemp);
    }
    
    UpdateLocalTempDisplay();
  }
  else
  {
    Shr.Hide("AC_SyncedTemps");
    Shr.Show("AC_SplittedTemps");      
    Shr.SetToggleValue("AC_btnSync", 0);
  }
  
});


// Windows up/down
document.getElementById("AC_btnWindows").addEventListener('click', function(evt) {
  if(Shr.GetToggleValue("AC_btnWindows") == 0)
  {
    cmd_out_ACWindowsVent();
  }
  else
  {
    cmd_out_ACWindowsClose();
  }
  
});

// Defrost ON/OFF

document.getElementById("AC_btnDefrost").addEventListener('click', function(evt) {
  if(Shr.GetToggleValue("AC_btnDefrost") == 0)
  {
    cmd_out_ACStartDefrost();
  }
  else
  {
    cmd_out_ACStopDefrost();
  }
});


function cmd_out_ACStart()
{
    console.log("Sending AC Start Request");
    Shr.SendData({ type: 'request', request: 'ACStart' });
}

function cmd_out_ACStop()
{
    console.log("Sending AC Stop Request");
    Shr.SendData({ type: 'request', request: 'ACStop' });
}

var setTempDebounceDelay = 1000; // in ms.
let setTempTimeout = null;

function cmd_out_ACSetTemps(DriverTemp, PassengerTemp)
{
  if(setTempTimeout != null)
  {
    clearTimeout(setTempTimeout);
  }
  
  setTempTimeout = setTimeout(function(){ 
    console.log("Setting Temps to " + DriverTemp + "/" + PassengerTemp);
    
    Shr.SendData({ type: 'request', request: 'ACStart' });
    
    Shr.SendData({ type: 'request', request: 'ACSetTemps', requestData:{
      DriverTemp: DriverTemp,
      PassengerTemp: PassengerTemp
    } });
  }, setTempDebounceDelay);  
}


function cmd_out_ACWindowsVent()
{
    console.log("Sending AC Windows Vent Request");
    Shr.SendData({ type: 'request', request: 'ACWindowsVent' });
}

function cmd_out_ACWindowsClose()
{
    console.log("Sending AC Windows Close Request");
    Shr.SendData({ type: 'request', request: 'ACWindowsClose' });
}


function cmd_out_ACStartDefrost()
{
    console.log("Sending AC Start Defrost");
    Shr.SendData({ type: 'request', request: 'ACStartDefrost' });
}

function cmd_out_ACStopDefrost()
{
    console.log("Sending AC Stop Defrost");
    Shr.SendData({ type: 'request', request: 'ACStopDefrost' });
}

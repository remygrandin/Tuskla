import document from "document";
import * as messaging from "messaging";
import {me} from "appbit";
import { Shared } from "./Shared.js";
import { PanSwitcher } from "./PanSwitcher.js";
import { memory } from "system";

let Shr = new Shared();

let PanSwitch = new PanSwitcher();

import { View_Info } from "./Views/Infos.js";
let V_Info = new View_Info();

import { View_AC } from "./Views/AC.js";
let V_AC = new View_AC();

import { View_HeatedSeats } from "./Views/HeatedSeats.js";
let V_HeatedSeats = new View_HeatedSeats();

import { View_FrunkTrunkDoors } from "./Views/FrunkTrunkDoors.js";
let V_FrunkTrunkDoors = new View_FrunkTrunkDoors();

import { View_Media } from "./Views/Media.js";
let V_Media = new View_Media();

import { View_Battery } from "./Views/Battery.js";
let V_Battery = new View_Battery();

import { View_Start } from "./Views/Start.js";
let V_Start = new View_Start();

import { View_Alerts } from "./Views/Alerts.js";
let V_Alerts = new View_Alerts();

import { View_QuickAccess } from "./Views/QuickAccess.js";
let V_QuickAccess = new View_QuickAccess();

import { Menu } from "./Menu.js";
let menu = new Menu();
menu.Init();


function init(){ 
  PanSwitch.Goto(PanSwitch.PAGE_QUICK);
};

init();




function cmd_out_Ping()
{
  Shr.SendData({ type: 'request', request: 'Ping' });
}

function cmd_out_GetInfos(){
  Shr.SendData({ type: 'request', request: 'GetInfos' });
}

function cmd_out_CheckToken(){
  Shr.SendData({ type: 'request', request: 'CheckToken' });
}

function cmd_out_WakeUp(){
  Shr.SendData({ type: 'request', request: 'WakeUp' });
}

messaging.peerSocket.onmessage = function(evt) {
  console.log("Got data : " + JSON.stringify(evt));
  
  if (evt.data)
  {
    switch(evt.data.type)
    {
      case "fatal":
        console.error("Got fatal message : " + evt.data.fatal);
        Shr.PopupError("Fatal Error", evt.data.fatal);
        break;
      case "updateStatus":
        console.log("Got status message [" + evt.data.statusType + "]: " + evt.data.statusMessage);
        Shr.SetStatusText(evt.data.statusMessage, evt.data.statusType);
        break;
      case "response": 
        console.log("Got response message : " + evt.data.response);
        switch(evt.data.response)
        {
          case "InitOk":
            cmd_in_InitOk(evt);
            break;
          case "WakeUpOk":
            cmd_in_WakeUpOk(evt);
            break;
          case "UpdateInfos":
            cmd_in_UpdateInfos(evt);
            break;
          default:
            console.error("Unknow response received : " + evt.data.response);
            break;
        }
        break;
      default:
        console.error("Unknow type received : " + evt.data.type);
        break;
    }
  }
  
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
  Shr.setStatusText("/!\ Connection error with phone !");
  
  Shr.PopupError("Connection Error", "Failed connecting with phone !");
}

messaging.peerSocket.onopen = function() {
  Shr.SetStatusText("Connection with phone established... Attempting connection to tesla API...");
  
  Shr.PopupInit("Checking Authentication", "Validating your tesla credentials...")
  cmd_out_CheckToken();
  //cmd_out_GetInfos();
}
  
function cmd_in_InitOk(evt)
{
  Shr.PopupInit("Waking Up Car", "Waking Up your tesla...")
  cmd_out_WakeUp();
}

function cmd_in_WakeUpOk(evt)
{
  Shr.PopupInit("Loading Infos", "Loading vehicle data")
  cmd_out_GetInfos();
  startUpdateLoop();
}

function cmd_in_UpdateInfos(evt)
{
  Shr.Hide("Popup_Init");

  
  Shr.SetText("glb_txtName", evt.data.responseData.VehicleName);
  Shr.SetText("glb_txtBatteryCharge", evt.data.responseData.Battery.BatteryPct +"%");  
  
  //Shr.SetStatusText("Infos Loaded");
  
  V_Info.UpdateState(evt.data);
  V_AC.UpdateState(evt.data);
  V_HeatedSeats.UpdateState(evt.data);
  V_FrunkTrunkDoors.UpdateState(evt.data);
  V_Media.UpdateState(evt.data);
  V_Battery.UpdateState(evt.data);
  V_Alerts.UpdateState(evt.data);
  V_QuickAccess.UpdateState(evt.data);
  V_Start.UpdateState(evt.data);
}

// Double back click

var doubleClickDelay = 500; // in ms.
var exitTimeout = null;

document.addEventListener('keypress', function(evt) {
  if(evt.key == "back") 
  {
    evt.preventDefault();
    
    if(exitTimeout == null)
    {
      exitTimeout = setTimeout(function(){ me.exit() }, doubleClickDelay);
    }
    else
    {
      clearTimeout(exitTimeout);
      exitTimeout = null;
      
      Shr.ToggleVisibility("MainMenu");
      
      //let mainMenuEl = document.getElementById();
      //mainMenuEl.style.display = (mainMenuEl.style.display === "inline") ? "none" : "inline";
      Shr.SetValue("MainMenuView", 0);
      //let mainMenuViewEl = document.getElementById();
      //mainMenuViewEl.value = 0;    
      
    }
  }
  
});

// Bottom Right button for status bar
document.addEventListener('keypress', function(evt) {
  if(evt.key == "down")
  {
    //console.error("Memory Peak : " + memory.js.peak + " | Total : " + memory.js.total + " | Used : " + memory.js.used)
    //Shr.SetStatusText("test test");
    Shr.ShowStatusBar();
  }
});

// Top Right button for force refresh
document.addEventListener('keypress', function(evt) {
  if(evt.key == "up") 
  {
      cmd_out_GetInfos();
  }
});


// Enable the spinner
document.getElementById("Init_Spin").state = "enabled";

function startUpdateLoop()
{
  setInterval(function(){
    cmd_out_GetInfos();
  }, 5000);
}
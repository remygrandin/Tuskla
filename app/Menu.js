import document from "document";

import {Shared} from "./Shared.js";
import { PanSwitcher } from "./PanSwitcher.js";

let Shr = new Shared();
let PanSwitch = new PanSwitcher();

export function Menu() {

}


Menu.prototype.Init = function(data) {  
  document.getElementById("MENU_btnQuick").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_QUICK);
  }

  document.getElementById("MENU_btnAC").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_AC);
  }
  
  document.getElementById("MENU_btnInfo").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_INFO);
  }
  
  document.getElementById("MENU_btnHS").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_HEATSEAT);
  }
  
  document.getElementById("MENU_btnFTD").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_FRUNKTRUNKDOORS);
  }
  
  document.getElementById("MENU_btnBattery").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_BATTERY);
  }
  
  document.getElementById("MENU_btnMedia").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_MEDIA);
  }
  
  document.getElementById("MENU_btnStart").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_START);
  }
  
  document.getElementById("MENU_btnAlerts").onactivate = function(evt) {
    Shr.Hide("MainMenu");
    Shr.SetValue("MainMenuView", 0);
    PanSwitch.Goto(PanSwitch.PAGE_ALERTS);
  }
};






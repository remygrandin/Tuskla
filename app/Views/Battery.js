import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_Battery() {

}

let LastBatteryData = null;


View_Battery.prototype.UpdateState = function(data) {
  console.log("Data Battery : " + JSON.stringify(data.responseData.Battery));
  
  LastBatteryData = data.responseData.Battery;
  
  Shr.SetText("B_Charge", LastBatteryData.BatteryPct + "%");
  Shr.SetText("B_MaxRange", Math.round(LastBatteryData.EstimatedRange) + " Km");
  
  
  document.getElementById("B_MainBattery").getElementById("pct").groupTransform.scale.y = 1;
  document.getElementById("B_MainBattery").getElementById("pct").groupTransform.scale.x = LastBatteryData.BatteryPct / 100;
  /*
  document.getElementById("B_LimitBattery").getElementById("pct").groupTransform.scale.y = 1;
  document.getElementById("B_LimitBattery").getElementById("pct").groupTransform.scale.x = LastBatteryData.BatteryPct / 100;
  */
  
  if(LastBatteryData.IsChaging)
  {
    Shr.SetText("B_StartStopCharge", "Stop Charge");
  }
  else
  {
    Shr.SetText("B_StartStopCharge", "Start Charge");
  }
};

document.getElementById("B_OpenChargePort").addEventListener('click', function(evt) {
  cmd_out_BOpenChargePort();
});

document.getElementById("B_CloseChargePort").addEventListener('click', function(evt) {
  cmd_out_BCloseChargePort();
});

document.getElementById("B_StartStopCharge").addEventListener('click', function(evt) {
  if(LastBatteryData.IsChaging)
  {
    cmd_out_BStopCharge();
  }
  else
  {
    cmd_out_BStartCharge();
  }
});



function cmd_out_BOpenChargePort()
{
  console.log("Sending Open charge request");
  Shr.SendData({ type: 'request', request: 'BOpenChargePort' });
} 

function cmd_out_BCloseChargePort()
{
  console.log("Sending Close charge request");
  Shr.SendData({ type: 'request', request: 'BCloseChargePort' });
} 

function cmd_out_BStartCharge()
{
  console.log("Sending Start charge");
  Shr.SendData({ type: 'request', request: 'BStartCharge' });
} 

function cmd_out_BStopCharge()
{
  console.log("Sending Stop charge");
  Shr.SendData({ type: 'request', request: 'BStopCharge' });
} 
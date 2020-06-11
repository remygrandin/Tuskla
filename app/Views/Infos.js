import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_Info() {

}

View_Info.prototype.UpdateState = function(data) {  

  Shr.SetText("INFO_txtName", "Car Name : " + data.responseData.VehicleName);
  Shr.SetText("INFO_txtVIN", "VIN : " + data.responseData.VIN);
  Shr.SetText("INFO_txtOSVersion", "OS Version : " + data.responseData.OSVersion);
  Shr.SetText("INFO_txtOdometer", "Odometer : " + Math.round(data.responseData.Odometer) + " Km");
  Shr.SetText("INFO_txtBatteryCharge", "BatteryPct : " + data.responseData.Battery.BatteryPct + "%");
  Shr.SetText("INFO_txtEstimatedRange", "Estimated Range : " + Math.round(data.responseData.Battery.EstimatedRange) + " Km");
};


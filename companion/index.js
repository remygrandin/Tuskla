import * as messaging from "messaging";
import { localStorage } from "local-storage";
import { me as companion } from "companion";
import { settingsStorage } from "settings";

import { TeslaAPI } from "./TeslaAPI.js"

let API = new TeslaAPI();

function MiToKm(mi)
{
  return mi * 1.609344;
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Listen for messages from the device
messaging.peerSocket.onmessage = async function(evt) {
  try
  {
     
    if (evt.data)
    {
      if(evt.data.type=="request")
      {
        console.log("Got request : " + evt.data.request);
        switch(evt.data.request)
        {
          case "Ping":
            await cmd_in_Ping(evt);
            break;

          case "GetInfos":
            await cmd_in_GetInfos(evt);
            break;

          case "CheckToken":
            await cmd_in_CheckToken(evt);
            break;
          case "WakeUp":
            await cmd_in_WakeUp(evt);
            break;

          case "ACStart":
            await cmd_in_ACStart(evt);
            break;
          case "ACStop":
            await cmd_in_ACStop(evt);
            break;
          case "ACSetTemps":
            await cmd_in_ACSetTemps(evt);
            break;
          case "ACWindowsVent":
            await cmd_in_ACWindowsVent(evt);
            break;
          case "ACWindowsClose":
            await cmd_in_ACWindowsClose(evt);
            break;
          case "ACStartDefrost":
            await cmd_in_ACStartDefrost(evt);
            break;
          case "ACStopDefrost":
            await cmd_in_ACStopDefrost(evt);
            break;

          case "HSSetSeatsLevel":
            await cmd_in_HSSetSeatsLevel(evt);
            break;

          case "FTDActuateFrunk":
            await cmd_in_FTDActuateFrunk(evt);
            break;
          case "FTDActuateTrunk":
            await cmd_in_FTDActuateTrunk(evt);
            break;
          case "FTDLockDoors":
            await cmd_in_FTDLockDoors(evt);
            break;
          case "FTDUnlockDoors":
            await cmd_in_FTDUnlockDoors(evt);
            break;

          case "MPrev":
            await cmd_in_MPrev(evt);
            break;
          case "MNext":
            await cmd_in_MNext(evt);
            break;
          case "MPlayPause":
            await cmd_in_MPlayPause(evt);
            break;
          case "MVolMinus":
            await cmd_in_MVolMinus(evt);
            break;
          case "MVolPlus":
            await cmd_in_MVolPlus(evt);
            break;
            
          case "BOpenChargePort":
            await cmd_in_BOpenChargePort(evt);
            break;
          case "BCloseChargePort":
            await cmd_in_BCloseChargePort(evt);
            break;
          case "BStartCharge":
            await cmd_in_BStartCharge(evt);
            break;
          case "BStopCharge":
            await cmd_in_BStopCharge(evt);
            break;
            
          case "RemoteStart":
            await cmd_in_RemoteStart(evt);
            break;
            
          case "AFlashLights":
            await cmd_in_AFlashLights(evt);
            break;
          case "AHonk":
            await cmd_in_AHonk(evt);
            break;

          default:
            console.error("Unknow command received : " + evt.data.request);
            break;
        }
      }
    }
  }
  catch(error)
  {
    if(error.includes("vehicle unavailable"))
    {
      sendData({ type:'warning', error: 'Vehicle unavailable' });
    }
    else
    {
      //console.error("Got Fatal error : " + JSON.stringify(error));
      sendData({ type:'fatal', fatal: error });
      throw error;
    }
  }
}

function sendData(data){
  if (messaging.peerSocket.readyState !== messaging.peerSocket.OPEN) {
    console.log("Error: Connection is not open");
    return;
  } 
  
  messaging.peerSocket.send(data);
}

async function GetVehIdAndWakeUp(){
  let vehId = await API.GetVehicleAPIId();
  
  if(vehId == null)
  {
    sendData({ type:'error', error: 'Vehicle not found' });
    throw "Vehicle not found";
  }
  
  await wakup(vehId);
  
  return vehId;
}

let lastSuccessullWakeupCall = null;
let lastSuccessullWakeupCallMaxDelay = 5 * 1000; // in ms

async function wakup(vehId){
  if(lastSuccessullWakeupCall != null && lastSuccessullWakeupCall + lastSuccessullWakeupCallMaxDelay >= (new Date()).getTime()){
    return;
  }

  let wakupTries = 0;
  
  do
  {
    var status = await API.WakeUpVehicle(vehId);
    
    //console.log("Got status : " + JSON.stringify(status));
    
    if(status.state != "asleep")
    {
      lastSuccessullWakeupCall = (new Date()).getTime();
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    sendData({ type:'updateStatus', statusType:"info", statusMessage: 'Car is asleep, waking it up...' });
  } while(wakupTries++ <= (60 * 2)) // 2 min max
  sendData({ type:'fatal', fatal: 'Cannot wake up car (timeout)' });
  throw "Cannot wake up car (timeout)"
}

async function cmd_in_Ping(evt){
  sendData({ type:'response', response: 'Ping' });
}

async function cmd_in_CheckToken(evt){
  try{
    await API.CheckToken();
    sendData({ type:'response', response: "InitOk" });
  }
  catch (error)
  {
    sendData({ type:'error', error: error });
  }
}

async function cmd_in_WakeUp(evt){
  try{
    await GetVehIdAndWakeUp();
    sendData({ type:'response', response: "WakeUpOk" });
  }
  catch (error)
  {
    sendData({ type:'error', error: error });
  }
}

async function cmd_in_GetInfos(evt){
  let vehId = await GetVehIdAndWakeUp();

  let vehData = await API.GetVehicleData(vehId);

  console.log("raw json :" + JSON.stringify(vehData))
  
  let status = {
    VehicleName: vehData.display_name,
    Odometer: MiToKm(vehData.vehicle_state.odometer),
    VIN: vehData.vin,
    OSVersion: vehData.vehicle_state.car_version.split(" ")[0],

    Battery:{
      BatteryPct: vehData.charge_state.battery_level,
      EstimatedRange: MiToKm(vehData.charge_state.est_battery_range),
      ChargeLimit: vehData.charge_state.charge_limit_soc,
      ChargeLimitMin: vehData.charge_state.charge_limit_soc_min,
      ChargeLimitMax: vehData.charge_state.charge_limit_soc_max,
      IsChargeDoorOpen: vehData.charge_state.charge_port_door_open,
      IsChaging: vehData.charge_state.charging_state == "Charging",
    },
    AC: {
      IsOn: vehData.climate_state.is_auto_conditioning_on,
      
      DriverTemp: vehData.climate_state.driver_temp_setting,
      PassengerTemp: vehData.climate_state.passenger_temp_setting,
      
      MinTemp: vehData.climate_state.min_avail_temp,
      MaxTemp: vehData.climate_state.max_avail_temp,
      
      InsideTemp: vehData.climate_state.inside_temp,
      OutsideTemp: vehData.climate_state.outside_temp,
      
      WindowsStatus: vehData.vehicle_state.fd_window + vehData.vehicle_state.fp_window + vehData.vehicle_state.rd_window + vehData.vehicle_state.rp_window,
      IsDefrostOn: vehData.climate_state.is_preconditioning
    },
    HeatedSeats:{
      S1: vehData.climate_state.seat_heater_left,
      S2: vehData.climate_state.seat_heater_right,
      
      S3: vehData.climate_state.seat_heater_rear_left,
      S4: vehData.climate_state.seat_heater_rear_center,
      S5: vehData.climate_state.seat_heater_rear_right
    }
  }
  
  sendData({ type:'response', response: 'UpdateInfos', responseData:status });
  
  console.log(JSON.stringify(vehData.response));
}


async function cmd_in_ACStart(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACStart(vehId);
  
  console.log("Start result : " + JSON.stringify(result));
            
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'AC Started' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await cmd_in_GetInfos(evt);
}

async function cmd_in_ACStop(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACStop(vehId);
  
  console.log("Stop result : " + JSON.stringify(result));
          
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'AC Stopped' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await cmd_in_GetInfos(evt);
}

async function cmd_in_ACSetTemps(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACSetTemps(vehId, evt.data.requestData.DriverTemp, evt.data.requestData.PassengerTemp);
  
  console.log("Set Temps result : " + JSON.stringify(result));
        
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Temperature Updated' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  await cmd_in_GetInfos(evt);
}
  
  
async function cmd_in_ACWindowsVent(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACWindowsVent(vehId);
  
  console.log("Vent request result : " + JSON.stringify(result));
      
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Windows Vented' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await cmd_in_GetInfos(evt);
}
  

async function cmd_in_ACWindowsClose(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACWindowsClose(vehId);
  
  console.log("Close request result : " + JSON.stringify(result));
    
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Windows Closed' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await cmd_in_GetInfos(evt);
}
  

async function cmd_in_ACStartDefrost(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACStartDefrost(vehId);
  
  console.log("Defrost on request result : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Defrost Started' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await cmd_in_GetInfos(evt);
}
  


async function cmd_in_ACStopDefrost(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ACStopDefrost(vehId);
  
  console.log("Defrost off request result : " + JSON.stringify(startResult));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Defrost Stopped' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
  
  await API.ACStop(vehId);
  await API.ACStart(vehId);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await cmd_in_GetInfos(evt);
}
  


async function cmd_in_HSSetSeatsLevel(evt){
  let vehId = await GetVehIdAndWakeUp();
   
  let vehData = await API.GetVehicleData(vehId);
  
  if(vehData.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: vehData.reason });
    
    return;
  }
  
  if(!vehData.response.climate_state.is_auto_conditioning_on)
  { 
    await API.ACStart(vehId);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    vehData = await API.GetVehicleData(vehId);
  }
  
  let seatData = {
      S1: vehData.response.climate_state.seat_heater_left,
      S2: vehData.response.climate_state.seat_heater_right,
      
      S3: vehData.response.climate_state.seat_heater_rear_left,
      S4: vehData.response.climate_state.seat_heater_rear_center,
      S5: vehData.response.climate_state.seat_heater_rear_right
    }
  
  if(seatData.S1 != evt.data.requestData.S1)
  {
    let result = await API.HSSetSeatsLevel(vehId, 0, evt.data.requestData.S1);
    console.log("Heated Seats result : " + JSON.stringify(result));
    
    if(result.result === false)
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
  
  if(seatData.S2 != evt.data.requestData.S2)
  {
    let result = await API.HSSetSeatsLevel(vehId, 1, evt.data.requestData.S2);
    console.log("Heated Seats result : " + JSON.stringify(result));
    
    if(result.result === false)
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
  
  
  if(seatData.S3 != evt.data.requestData.S3)
  {
    let result = await API.HSSetSeatsLevel(vehId, 2, evt.data.requestData.S2);
    console.log("Heated Seats result : " + JSON.stringify(result));
    
    if(result.result === false)
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
  
  if(seatData.S4 != evt.data.requestData.S4)
  {
    let result = await API.HSSetSeatsLevel(vehId, 4, evt.data.requestData.S2); // << 4, not 3
    console.log("Heated Seats result : " + JSON.stringify(result));
    
    if(result.result === false)
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
  
  if(seatData.S5 != evt.data.requestData.S5)
  {
    let result = await API.HSSetSeatsLevel(vehId, 5, evt.data.requestData.S2);// << 5, not 4
    console.log("Heated Seats result : " + JSON.stringify(result));
    
    if(result.result === false)
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
 
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await cmd_in_GetInfos(evt);
}
  

async function cmd_in_FTDActuateFrunk(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ActuateFrunk(vehId);
  
  console.log("Frunk Actuation request : " + JSON.stringify(result));


  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Frunk Actuated' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}


async function cmd_in_FTDActuateTrunk(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.ActuateTrunk(vehId);
  
  console.log("Trunk Actuation request : " + JSON.stringify(result));


  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Trunk Actuated' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}

async function cmd_in_FTDLockDoors(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.DoorsLock(vehId);
  
  console.log("Doors Lock request : " + JSON.stringify(result));
  

  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Doors Locked' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}

async function cmd_in_FTDUnlockDoors(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.DoorsUnlock(vehId);
  
  console.log("Doors Unlock request : " + JSON.stringify(result));

  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Doors Unlocked' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}








async function cmd_in_MPrev(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.MediaPrevious(vehId);
  
  console.log("Media Previous request : " + JSON.stringify(result));
    
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Closed' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "user_not_present")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: "Can't do : No one is in the car" });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
}

async function cmd_in_MNext(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.MediaNext(vehId);
  
  console.log("Media Next request : " + JSON.stringify(result));
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Closed' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "user_not_present")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: "Can't do : No one is in the car" });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
}

async function cmd_in_MPlayPause(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.MediaPlayPause(vehId);
  
  console.log("Media Play Pause request : " + JSON.stringify(result));
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Closed' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "user_not_present")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: "Can't do : No one is in the car" });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
}

async function cmd_in_MVolPlus(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.MediaVolUp(vehId);
  
  console.log("Media vol + request : " + JSON.stringify(result));
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Closed' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "user_not_present")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: "Can't do : No one is in the car" });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
}

async function cmd_in_MVolMinus(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.MediaVolDown(vehId);
  
  console.log("Media vol - request : " + JSON.stringify(result));
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Closed' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "user_not_present")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: "Can't do : No one is in the car" });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
}



async function cmd_in_BOpenChargePort(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.OpenChargePort(vehId);
  
  console.log("Open charge port : " + JSON.stringify(result));
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Opened / Unlocked' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "already open")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: 'Charging Port Already Opened' });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
  
  
}

async function cmd_in_BCloseChargePort(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.CloseChargePort(vehId);
  
  console.log("Close charge port : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charging Port Closed' });
  } 
  else if(result.result === false)
  {
    if(result.reason == "already closed")
    {
      sendData({ type:'updateStatus', statusType:"warning", statusMessage: 'Charging Port Already Closed' });
    }
    else
    {
      sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
    }
  }
}



async function cmd_in_BStartCharge(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.StartCharge(vehId);
  
  console.log("Start Charge : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charge Started' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}



async function cmd_in_BStopCharge(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.StopCharge(vehId);
  
  console.log("Stop Charge : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Charge Stopped' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}



async function cmd_in_RemoteStart(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.RemoteStart(vehId);
  
  console.log("Remote Start : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Remote Start OK : 2 min' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}


async function cmd_in_AFlashLights(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.FlashLights(vehId);
  
  console.log("Flashing Lights : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Light Flashed' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}

async function cmd_in_AHonk(evt){
  let vehId = await GetVehIdAndWakeUp();
    
  let result = await API.HonkHorn(vehId);
  
  console.log("Honk : " + JSON.stringify(result));
  
  
  if(result.result === true)
  {
    sendData({ type:'updateStatus', statusType:"success", statusMessage: 'Horn Honked' });
  } 
  else if(result.result === false)
  {
    sendData({ type:'updateStatus', statusType:"error", statusMessage: result.reason });
  }
}

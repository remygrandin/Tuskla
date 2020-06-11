import { localStorage } from "local-storage";
import { settingsStorage } from "settings";

export function TeslaAPI() {
  this.ConnectionStatus = "Unknown"
  this.ConnectionStatusLastCheck = null;
}

async function callPOSTAPI(url, data, verbose){
  if(verbose)
  {
    console.log("Calling API POST " + "https://owner-api.teslamotors.com" + url);
    console.log("With args : " + JSON.stringify(data));
  }
  let response = await fetch("https://owner-api.teslamotors.com" + url, {
    method: 'POST',
    headers: {
      'User-Agent': 'Dev-Fitbitapp',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("oauth-token")
    },
    body: JSON.stringify(data)
  });

  if(verbose)
  {
    console.log("    - Response status : " + response.status + "(" + response.statusText + ")");

    let resptext = await response.clone().text();

    console.log("    - Response text : " + resptext);
  }
  
  if(!response.ok)
  {
    throw ("Error calling API (" + response.status + ") : \"" + resptext + "\"")
  }
 
  let respjson = await response.clone().json();
  
  return respjson;
}


async function callGETAPI(url, verbose){
  if(verbose)
  {
    console.log("Calling API GET " + "https://owner-api.teslamotors.com" + url);
  }
  let response = await fetch("https://owner-api.teslamotors.com" + url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Dev-Fitbitapp',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("oauth-token")
    }
  });
  if(verbose)
  {
    console.log("    - Response status : " + response.status + "(" + response.statusText + ")");

    let resptext = await response.clone().text();

    console.log("    - Response text : " + resptext);
  }
  
  if(!response.ok)
  {
    let resptext = await response.clone().text();
    throw ("Error calling API (" + response.status + ") : \"" + resptext + "\"")
  }
  
  let respjson = await response.clone().json();
  
  return respjson;
}

let TeslaClientId = '81527cff06843c8634fdc09e8ac0abefb46ac849f38fe1e431c2ef2106796384'
let TeslaClientSecret = 'c7257eb71a564034f9419ee651c7d0e5f7aa6bfbd18bafb5c5c033b093bb2fa3'



TeslaAPI.prototype.CheckToken = async function() {
  if(this.ConnectionStatus != "Error")
  {
    this.ConnectionStatus = "Checking";
    this.ConnectionStatusLastCheck = new Date();
  }
  
  console.log("Checking Token in local storage ...");
  
  while(localStorage.getItem("oauth-token") === null || typeof localStorage.getItem("oauth-token") === "undefined")
  {
    console.log("    Token not found, regenerating it ...");
    if(!await this.GetNewToken())
    {
      throw "Error authenticating, please check your login/password in the API";
      return;
    }    
  }
  console.log("    Token available : " + localStorage.getItem("oauth-token"));
  
  console.log("    Checking Token expiracy ...");
  console.log("    Token expire at : " + new Date(localStorage.getItem("oauth-expireat") * 1000))
  
  while(localStorage.getItem("oauth-expireat") <= ((new Date()).getTime()/1000))
  {
    console.log("    Token expired, regenerating it ...");
    if(!await this.GetNewToken())
    {
      throw "Error authenticating, please check your login/password in the API";
      return;
    }   
  }
  console.log("    Token expiration validity OK");
  
  console.log("    Testing Token validity ...");
  try {
    await this.GetVehicleList();
  } catch (error) {
    console.log("    Token validity error : " + error);
    console.log("    Regenerating it ...");
    if(!await this.GetNewToken())
    {
      throw "Error authenticating, please check your login/password in the API";
      return;
    }
  }

  console.log("    Token All good");
};


TeslaAPI.prototype.GetNewToken = async function() {
  let response = await fetch("https://owner-api.teslamotors.com/oauth/token", {
    method: 'POST',
    headers: {
      'User-Agent': 'Dev-Fitbitapp',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: JSON.parse(settingsStorage.getItem("userEmail")).name,
      password: JSON.parse(settingsStorage.getItem("userPassword")).name,
      grant_type: 'password',
      client_id: TeslaClientId,
      client_secret: TeslaClientSecret      
    })
  });
  
  if(response.ok)
  {
    let respjson = await response.clone().json();
    
    localStorage.setItem("oauth-token", respjson.access_token)
    localStorage.setItem("oauth-expireat", respjson.created_at + respjson.expires_in - (24*60*60)) // we substract 1 day of the standard 45 days expiracy date to ensure no UTC suckery      
    
    return true;
  }
  else
  {
    let resptext = await response.clone().text();
    
    console.log("Error at authentication (" + response.status + ") : " + resptext);
    return false;
  }  
};

TeslaAPI.prototype.GetVehicleList = async function() {
  return await callGETAPI("/api/1/vehicles");
};

let vehIDCache = null;
let vehNameCache = null;

TeslaAPI.prototype.GetVehicleAPIId = async function(carName) {
  if(vehIDCache != null && vehNameCache == carName)
  {
    return vehIDCache;
  }  
  
  let vehList = await this.GetVehicleList();
  
  if(vehList.count == 0)
  {
    return null;
  }
  
  if(typeof carName == "undefined" || carName == "")
  {
    vehNameCache = carName;
    vehIDCache = vehList.response[0].id;
    return vehList.response[0].id;
  }
  else
  {
    for (var i = 0; i < vehList.count; i++) {
      if(carName.toLowerCase() == vehList.response[i].display_name.toLowerCase())
      {
        vehNameCache = carName;
        vehIDCache = vehList.response[i].id;
        return vehList.response[i].id;
      }
    }
    // vehicle name not found
    return null;
  }
};


TeslaAPI.prototype.GetVehicleStatus = async function(vehId) {
  return (await callGETAPI("/api/1/vehicles/" + vehId)).response;;
};

TeslaAPI.prototype.GetVehicleData = async function (vehId){
  return (await callGETAPI("/api/1/vehicles/" + vehId + "/vehicle_data")).response;;
}


TeslaAPI.prototype.WakeUpVehicle = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/wake_up")).response;
}


TeslaAPI.prototype.ACStart = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/auto_conditioning_start")).response;
}

TeslaAPI.prototype.ACStop = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/auto_conditioning_stop")).response;
}

TeslaAPI.prototype.ACSetTemps = async function (vehId, DriverTemp, PassengerTemp){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/set_temps", {
    driver_temp: DriverTemp, 
    passenger_temp: PassengerTemp
  })).response;
}

TeslaAPI.prototype.ACWindowsVent = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/window_control", {
    command: "vent", 
    lat: 0,
    lon: 0
  })).response;
}

TeslaAPI.prototype.ACWindowsClose = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/window_control", {
    command: "close", 
    lat: 0,
    lon: 0
  })).response;
}

TeslaAPI.prototype.ACStartDefrost = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/set_preconditioning_max", {
    on: true
  }, true)).response;
}

TeslaAPI.prototype.ACStopDefrost = async function (vehId){
  return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/set_preconditioning_max", {
    on: false
  })).response;;
}

TeslaAPI.prototype.HSSetSeatsLevel = async function (vehId, seat, lvl){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/remote_seat_heater_request", {
    heater: seat, 
    level: lvl
  })).response;
}

TeslaAPI.prototype.ActuateFrunk = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/actuate_trunk", {
    which_trunk: "front"
  }, true)).response;
}

TeslaAPI.prototype.ActuateTrunk = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/actuate_trunk", {
    which_trunk: "rear"
  })).response;
}


TeslaAPI.prototype.DoorsUnlock = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/door_unlock")).response;
}

TeslaAPI.prototype.DoorsLock = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/door_lock")).response;
}





TeslaAPI.prototype.MediaPlayPause = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/media_toggle_playback")).response;
}

TeslaAPI.prototype.MediaNext = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/media_next_track")).response;
}

TeslaAPI.prototype.MediaPrevious = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/media_prev_track")).response;
}

TeslaAPI.prototype.MediaVolUp = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/media_volume_up")).response;
}

TeslaAPI.prototype.MediaVolDown = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/media_volume_down")).response;
}


TeslaAPI.prototype.OpenChargePort = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/charge_port_door_open")).response;
}

TeslaAPI.prototype.CloseChargePort = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/charge_port_door_close")).response;
}

TeslaAPI.prototype.StartCharge = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/charge_start")).response;
}

TeslaAPI.prototype.StopCharge = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/charge_stop")).response;
}


TeslaAPI.prototype.RemoteStart = async function (vehId){
    let password = JSON.parse(settingsStorage.getItem("userPassword")).name;
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/remote_start_drive", {
      password: password
    })).response;
}

TeslaAPI.prototype.FlashLights = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/flash_lights")).response;
}

TeslaAPI.prototype.HonkHorn = async function (vehId){
    return (await callPOSTAPI("/api/1/vehicles/" + vehId + "/command/honk_horn")).response;
}

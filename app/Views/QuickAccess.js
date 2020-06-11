import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_QuickAccess() {

}

View_QuickAccess.prototype.UpdateState = function(data) {  

};

document.getElementById("Q_OpenFrunk").addEventListener('click', function(evt) {
  cmd_out_FTDActuateFrunk();
});

document.getElementById("Q_OpenTrunk").addEventListener('click', function(evt) {
  cmd_out_FTDActuateTrunk();
});

document.getElementById("Q_Unlock").addEventListener('click', function(evt) {
  cmd_out_FTDUnlockDoors();
});

document.getElementById("Q_OpenChargePort").addEventListener('click', function(evt) {
  cmd_out_BOpenChargePort();
});


document.getElementById("Q_Start").addEventListener('click', function(evt) {
  cmd_out_RemoteStart();
});

document.getElementById("Q_FlashLights").addEventListener('click', function(evt) {
  cmd_out_AFlashLights();
});




function cmd_out_FTDActuateFrunk()
{
    console.log("Sending Frunk actuation request");
    Shr.SendData({ type: 'request', request: 'FTDActuateFrunk' });
}

function cmd_out_FTDActuateTrunk()
{
    console.log("Sending Frunk actuation request");
    Shr.SendData({ type: 'request', request: 'FTDActuateTrunk' });
}

function cmd_out_FTDUnlockDoors()
{
    console.log("Sending Doors Unlock request");
    Shr.SendData({ type: 'request', request: 'FTDUnlockDoors' });
}

function cmd_out_BOpenChargePort()
{
  console.log("Sending Open charge request");
  Shr.SendData({ type: 'request', request: 'BOpenChargePort' });
} 

function cmd_out_RemoteStart()
{
  console.log("Sending RemoteStart");
  Shr.SendData({ type: 'request', request: 'RemoteStart' });
}

function cmd_out_AFlashLights()
{
  console.log("Sending Flash Light");
  Shr.SendData({ type: 'request', request: 'AFlashLights' });
} 

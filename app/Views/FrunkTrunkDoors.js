import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_FrunkTrunkDoors() {

}

View_FrunkTrunkDoors.prototype.UpdateState = function(data) {  
};


document.getElementById("FTD_btnFrunk").addEventListener('click', function(evt) {
    cmd_out_FTDActuateFrunk();
});

document.getElementById("FTD_btnTrunk").addEventListener('click', function(evt) {
    cmd_out_FTDActuateTrunk();
});

document.getElementById("FTD_btnLock").addEventListener('click', function(evt) {
    cmd_out_FTDLockDoors();
});

document.getElementById("FTD_btnUnlock").addEventListener('click', function(evt) {
    cmd_out_FTDUnlockDoors();
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


function cmd_out_FTDLockDoors()
{
    console.log("Sending Doors Lock request");
    Shr.SendData({ type: 'request', request: 'FTDLockDoors' });
}

function cmd_out_FTDUnlockDoors()
{
    console.log("Sending Doors Unlock request");
    Shr.SendData({ type: 'request', request: 'FTDUnlockDoors' });
}
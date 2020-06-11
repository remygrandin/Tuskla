import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_Alerts() {

}

View_Alerts.prototype.UpdateState = function(data) {  
};

document.getElementById("A_FlashLights").addEventListener('click', function(evt) {
  cmd_out_AFlashLights();
});

document.getElementById("A_Honk").addEventListener('click', function(evt) {
  cmd_out_AHonk();
});

function cmd_out_AFlashLights()
{
  console.log("Sending Flash Light");
  Shr.SendData({ type: 'request', request: 'AFlashLights' });
} 


function cmd_out_AHonk()
{
  console.log("Sending Honk");
  Shr.SendData({ type: 'request', request: 'AHonk' });
} 


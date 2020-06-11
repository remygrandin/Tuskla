import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_Start() {

}


View_Start.prototype.UpdateState = function(data) {  

};

document.getElementById("S_RemoteStart").addEventListener('click', function(evt) {
  cmd_out_RemoteStart();
});

function cmd_out_RemoteStart()
{
  console.log("Sending RemoteStart");
  Shr.SendData({ type: 'request', request: 'RemoteStart' });
}
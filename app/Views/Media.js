import document from "document";

import {Shared} from "../Shared.js";

let Shr = new Shared();

export function View_Media() {

}

View_Media.prototype.UpdateState = function(data) {  

};


document.getElementById("M_Prev").addEventListener('click', function(evt) {
  cmd_out_MPrev();
});

document.getElementById("M_Next").addEventListener('click', function(evt) {
  cmd_out_MNext();
});

document.getElementById("M_PlayPause").addEventListener('click', function(evt) {
  cmd_out_MPlayPause();
});


document.getElementById("M_VolMinus").addEventListener('click', function(evt) {
  cmd_out_MVolMinus();
});

document.getElementById("M_VolPlus").addEventListener('click', function(evt) {
  cmd_out_MVolPlus();
});


function cmd_out_MPrev()
{
  console.log("Sending Media Prev");
  Shr.SendData({ type: 'request', request: 'MPrev' });
}

function cmd_out_MNext()
{
  console.log("Sending Media Next");
  Shr.SendData({ type: 'request', request: 'MNext' });
} 

function cmd_out_MPlayPause()
{
  console.log("Sending Media Play Pause");
  Shr.SendData({ type: 'request', request: 'MPlayPause' });
} 


function cmd_out_MVolMinus()
{
  console.log("Sending Media Vol -");
  Shr.SendData({ type: 'request', request: 'MVolMinus' });
} 

function cmd_out_MVolPlus()
{
  console.log("Sending Media Vol -");
  Shr.SendData({ type: 'request', request: 'MVolPlus' });
} 
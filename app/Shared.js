import document from "document";
import * as messaging from "messaging";

export function Shared() {
    
}


Shared.prototype.TruncateString = function (str, num) 
{
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

let statusShowTimeout = null;

Shared.prototype.SetStatusText = function (status, type="info")
{
  let txtEl = document.getElementById("txtStatus");
  txtEl.state = "enabled";
  txtEl.text = status;
  
  let bckgrndEl = document.getElementById("StatusBackground");
  
  switch(type)
  {
    case "info":
      bckgrndEl.style.fill="fb-blue";
      break;
    case "success":
      bckgrndEl.style.fill="fb-green";
      break;
    case "warning":
      bckgrndEl.style.fill="fb-yellow";
      break;
    case "error":
      bckgrndEl.style.fill="fb-red";
      break;
  }
  
  this.ShowStatusBar();
}

Shared.prototype.ShowStatusBar = function ()
{
  let statusEl = document.getElementById("StatusBar");
  if(statusEl.state != "enabled")
  {
    statusEl.state = "enabled"
    statusEl.animate("enable");      
  }
  
  clearTimeout(statusShowTimeout);
    
  statusShowTimeout = setTimeout(function(){ 
    statusEl.state = "disabled"
    statusEl.animate("disable");
  }, 3000);

}
  
Shared.prototype.SetText = function (id, txt)
{
    let el = document.getElementById(id);
    el.text = txt;
}

Shared.prototype.GetText = function (id)
{
    let el = document.getElementById(id);
    return el.text;
}

Shared.prototype.SetMixedText = function (id, txt)
{
    let el = document.getElementById(id).getElementById("copy");
    el.text = txt;
}

Shared.prototype.SetMixedTitle = function (id, txt)
{
    let el = document.getElementById(id).getElementById("header");
    el.text = txt;
}

Shared.prototype.SendData = function (data)
{
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);
  }
  else
  {
    console.error("Socket is not opened : " + messaging.peerSocket.readyState)
  }
}

Shared.prototype.SetValue = function (id, value)
{
  let el = document.getElementById(id);
  el.value = value;
}

Shared.prototype.SetToggleValue = function (id, value)
{
  setTimeout(function(){
    let el = document.getElementById(id);
    el.value = value;
  },1);
}
Shared.prototype.GetToggleValue = function (id, val)
{
    let el = document.getElementById(id);
    return el.value;
}

Shared.prototype.Show = function(id)
{
    let el = document.getElementById(id);
    el.style.display = "inline";
}

Shared.prototype.Hide = function(id)
{
    let el = document.getElementById(id);
    el.style.display = "none";
}

Shared.prototype.ToggleVisibility = function(id)
{
  let el = document.getElementById(id);
  if(el.style.display == "none")
  {
    this.Show(id);
  }
  else
  {
    this.Hide(id);
  }
}





Shared.prototype.PopupError = function(title, text)
{
  this.SetMixedTitle("Err_Text", title);
  this.SetMixedText("Err_Text", text);
  
  this.Show("Popup_Error");
}




Shared.prototype.PopupInit = function(title, text)
{  
  this.SetMixedTitle("Init_Text", title);
  this.SetMixedText("Init_Text", text);
  
  this.Show("Popup_Init");
}

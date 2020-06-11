import document from "document";


export function PanSwitcher() {
  this.PAGE_INFO = getPanPos("panInfo");
  this.PAGE_QUICK = getPanPos("panQuick");
  this.PAGE_AC = getPanPos("panAC");
  this.PAGE_HEATSEAT = getPanPos("panHeatedSeats");
  this.PAGE_FRUNKTRUNKDOORS = getPanPos("panFrunkTrunk");

  this.PAGE_MEDIA = getPanPos("panMedia");
  this.PAGE_BATTERY = getPanPos("panBattery");
  this.PAGE_START = getPanPos("panStart");
  this.PAGE_ALERTS = getPanPos("panAlerts");
}

PanSwitcher.PAGE_INFO = -1;
PanSwitcher.PAGE_QUICK = -1;
PanSwitcher.PAGE_AC = -1;
PanSwitcher.PAGE_HEATSEAT = -1;
PanSwitcher.PAGE_FRUNKTRUNKDOORS = -1;

PanSwitcher.PAGE_MEDIA = -1;
PanSwitcher.PAGE_BATTERY = -1;
PanSwitcher.PAGE_START = -1;
PanSwitcher.PAGE_ALERTS = -1;

PanSwitcher.prototype.Goto = function (pos) 
{
  let hViewEl = document.getElementById("panViews");
  hViewEl.value = pos;
}


function getPanPos(id)
{
  let siblings = document.getElementById(id).parent.children;
  let counter = -1;
  
  for(let i = 0; i < siblings.length; i++)
  {   
    if(siblings[i].class == "panoramaview-item")
    {
      counter++;
    }
    
    if(siblings[i].id == id)
    {
      return counter;
    }
  }
  return null;
}

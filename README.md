![Tuskla Logo](https://github.com/remygrandin/Tuskla/raw/master/resources/icon.png "Logo")
# Tuskla 
Tesla control app for fitbit smartwatch
You can install it via the [Fitbit App Gallery](https://gallery.fitbit.com/details/25ac7080-f433-4c98-9bc3-79efad29605d)

## Warning
This app is very much in Alpha, please do no depend your life on it. 
Refer to the [MIT Licence](https://raw.githubusercontent.com/remygrandin/Tuskla/master/LICENSE) for all other warnings and details.
Please report any problem in the issues section of this repo.

## Setup Guide
To be able to use the app, you must first set up your credentials in the app setting.

To do that, go into the fitbit app on your phone then on you smartwatch app list and go into the Tuskla app settings.

<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/Companion_Main.jpg" width="250">

Here, input at least your tesla username (email) and password. 

<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/Companion_UserAccount.jpg" width="250">
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/Companion_Password.jpg" width="250">

If you have multiple tesla lnked to your account (lucky you :-) ), you must input the name of the car you want to control. If not, The app will user the first car returned in the list by the API.

They will be stored locally in the fitbit app setting storage of your phone and used to communicate diretly with the tesla API.

## Usage Guide
### App structure
The app is arranged in a sequence of section each dedicated to a dedicted subsystem of your tesla.
You can swipe left or right to change panel, You can see your position in the app in the dots in the header bar.


### Main menu
Fom any section you can access the main menu by double clicking your left button.
You can then touch the button of a section to be redirected to it.
You can close the menu by double clicking the left button again.

The main menu have 2 sections, swipe left to access the 2nd section. 


#### 1st section
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_MainMenu_1.png" width="300">

- Star : Quick Access
- Padlock : Trunks & Doors Lock/Unlock
- Battery : Charge & Chargeport
- Fan : AC control
- Heat : Heated Seats Control

#### 2nd section
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_MainMenu_2.png" width="300">

- Play : Media Control
- Keys : Remote Start (Allow keyless start for 2 minutes)
- Battery : Charge & Chargeport
- Warning : Honk & Light Flashing
- Info : Car's Infos

### Quick Access
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_QuickAccess.png" width="300">

- Frunk : Open the front trunk (frunk)
- Trunk : Open the rear trunk
- Padlock : Unlock all doors
- Rectangle with arrow : open/unlock charging port
- Keys : Remote start (Allow keyless start for 2 minutes)
- Lightbulb : Flash car lights

### Frunk, Trunk & Doors
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_FTD.png" width="300">

- Frunk : Open the front trunk (frunk)
- Closed Padlock : Lock all doors
- Opened Padlock : Unlock all doors
- Trunk : Open the rear trunk

### AC
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_AC.png" width="300">

- ON/OFF : Turn the whole AC system On or Off)
- +/- : Change the target temperature
- Windows : open / close all the windows a few cms (vent mode) **Always be near the car before closing the windows**
- Sync : Alternate between sync and bi zone temperatuire mode (Note : this currently is not changing the mode in the car but only the display on the watch)
- Defrost : Enable/disable defrost mode

At the bottom of the screen, you can read the inside and outside temperature. The values should be refreshed at least every 5 seconds.

### Heated Seats
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_HeatedSeats.png" width="300">

- ON/OFF : Turn All the seats heating On or Off
Each of the 5 buttons represent one of the 5 seats of the car, with the front at the top. Press it to set the heat level. The values goes : 0(-) => 3(|||) => 2(||) => 1(|) => 0(-) => ....

### Media
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_Media.png" width="300">

- Previous : Go to previous song/media
- Play/Pause : Play/Pause the current song/media
- Next : Go to previous song/media
- Volume - : Reduce the volume
- Volume + : Increase the volume

Note : All thos function will only work if someone is actively using the car.

### Battery
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_Battery.png" width="300">

- Rectangle with outwoard arrow : Open/unlock the charging port
- Rectangle with inward arrow : Close the charging port
- Start/Stop Charge : Start or stop the current charge

You can also see on the panel a battery gauge with the estimated range.

### Remote Start
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_RemoteStart.png" width="300">
Pressing this button allow anyone within the car to start driving it without the key ("keyless drive") for the next 2 minutes


### Alerts
<img src="https://github.com/remygrandin/Tuskla/raw/master/docs/App_Panel_Alerts.png" width="300">

- Lightbulb : Flash car lights
- Speaker : Honk horn

## Testing

Currently the app has been tested only by myself on my fitbit ionic and my model 3, If you use the app with somthing else (another fitbit or another tesla car, please let me know in the issues section of this repo so I can add it here.

## Planned Features
As said before, the app is currently in alpha and there is still a few key function I would like to implements
- Valey Mode settings
- Battery charging status visualisation
- Battery limit settings
- Homelink
- Favorites (GPS / Web / Youtube / Netflix)
- Sentry Mode On/Off
- Summon ?

## Bugs & Issues
If you encounter any bug/issues, please report them in the [repo issue tracker](https://github.com/remygrandin/Tuskla/issues) and specify your fitbit model, car model & varient and what went wrong.

## Thanks
Thanks to Streamline for their free icons from the [Streamline Icons Pack](https://www.streamlineicons.com)
Thanks to Tesla for making such connected cars.
Thanks to you if you are using the app :-)

## Buy me a coffee
If you like the app, and would like to help me continue to work on it, you can [buy me a coffee via paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4N5F9U6KE373N&source=url)

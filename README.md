![Tuskla Logo](https://github.com/remygrandin/Tuskla/raw/master/resources/icon.png "Logo")
# Tuskla 
Tesla control app for fitbit smartwatch

## Warning
This app is very much in Alpha, please do no depend your life on it. 
Refer to the [MIT Liscence](https://raw.githubusercontent.com/remygrandin/Tuskla/master/LICENSE) for all other warnings and details.
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
- Keys : Remote Start
- Battery : Charge & Chargeport
- Warning : Honk & Light Flashing
- Info : Car's Infos



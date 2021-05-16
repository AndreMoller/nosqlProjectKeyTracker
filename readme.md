# Keyboard Activity Tracker

## How to use

The web interface is used to display data and create a new account. The c# application is used to logg keypresses. To use the C# application you must first create an account in the web interface

## run using public server

1. Open artefacts and run ___ and ___. ____ is the application that loggs keys. ___ is used to create account and view data from __

## run localy

1. Install NPM

2. Install MongoDB

3. Create mongo database called keyTracker

4. Create collection called users.

5. Make sure that the address to the database is correct in webSever/server.js

6. Navigate to webServer/ with terminal

7. Run npm install

8. Run npm start. Server is now running 

9. Change ip in KeyListenerClient/Form1.cs to the ip of the webserver

10. Change ip in webUi\webui\src\app.js to the ip of the webserver

11. Navigate to webUi\webui\ 

12. Run npm install

13. Run npm start. Web client is now running

14. Open the solution file in the project root with visual studio and run the application. The keylogger is now running


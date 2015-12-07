SSUI Project 4: Your own personal project.

Project Name: Coffee And Chill

Libraries and other external frameworks used:
- Google Maps API
- Google Maps Geocoding API
- Angular JS
- Node.JS
- Express.js
- MongoDB (Mongoose)
- Grunt

Project Overview:
My goal with this webapp was to build a crowdsourced application that would allow users to know if a study space is occupied or not. Here at Carnegie Mellon, we significantly lack in study areas for students, especially in the upcoming finals weeks. Many times I've walked into Hunt, arriving only to see that there is no more space for me to study. By using this application, users can check if a certain floor of a building is occupied or not, and see how occupied it is. Users who are at that location can update the statuses of each location simply by a press of a button.


Run my project:
I'm not sure if this project would work on a separate machine then mine, but I use grunt to keep my proejct up while I edit. In addition I run an instance of mongo before I serve it.


Difficulties:
Largest difficulty I had was figuring out how to deal with AngularJS & Google Maps API - specifically how angular's $compile works when I try to asynchronously load various directives within the Google Maps canvas. I tried to work around it as much as I can, but unfortunately because of this issue I wasn't able to provide the best UX to my users.

The specific example I had difficulty was when I want to allow an user to update a building's floor's status through the text on the Google Maps Canvas. Although I figured out a way to insert directives, I could not find a way to call my controller methods from within the Google Maps canvas. I stackoverflowed a lot but many of the solutions there did not interact with a controller and as a result I wasted a good amount of time trying to figure this out. Therefore, it is unfortunate that my users have to update building statuses only through the UI present below the actual map.


Code Locations:
My client side of the code (so all the Angular, interacting with the Google Maps API, html) is located under the ~/client directory. client/index.html is my main html file where I inject code into, and the rest of the javascript / templates are located under the client/app directory.

My serverside code resides under the ~/server directory.
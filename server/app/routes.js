'use strict';


var Place   = require('./models/place/place.js');
var Floor   = require('./models/floor/floor.js');

module.exports = function (app, passport) {
  app.get('/places/test', function (req, res) {
    console.log("places");
    var places = [
    {
      place : 'Cohon University Center',
      description : 'This is the best place in the world!',
      lat : 40.443504,
      lng : -79.9415,
      crowdedness: 0,
      basement_floors: 1,
      floors: 3,
      isBuilding: true,
    },
    {
      place : 'Hunt Library',
      description : 'This place is aiiiiite!',
      lat : 40.441085,
      lng : -79.943722,
      crowdedness: 1,
      basement_floors: 1,
      floors: 5,
      isBuilding: true,
    },
    {
      place : 'Doherty Hall',
      description : 'This is the second best place in the world!',
      lat : 40.442540,
      lng : -79.944168,
      crowdedness: 2,
      basement_floors: 4,
      floors: 4,
      isBuilding: true,
    },
    ];

    res.send(places);
  });

  app.get('/places/all', function (req, res) {
    Place.find({}, function (err, places){
      if (err) {
        res.send(err);
      }
      res.send(places);
    });
  })

  app.post('/places/create', function (req, res) {
    var place = new Place();
    place.place = req.body.place;
    place.description = req.body.description;
    place.lat = req.body.lat;
    place.lng = req.body.lng;
    place.crowdedness = req.body.crowdedness;
    place.basement_floors = req.body.basement_floors;
    place.floors = req.body.floors;
    place.isBuilding = true;
    place.save(function (err) {
      if (err) {
        throw err;
      } else {
        console.log("place created");
      }
    });
  })



  app.get('/floor/all', function (req, res) {
    Floor.find({}, function (err, floors){
      if (err) {
        res.send(err);
      }
      res.send(floors);
    });
  })



  app.get('/floor/:id', function (req, res) {
    console.log(req.params.id);
    Floor.find({'place' : req.params.id}, function (err, floors){
      if (err) {
        res.send(err);
      }
      res.send(floors);
    });
  })




  app.post('/floor/create', function (req, res) {
    var floor = new Floor();
    floor.place = req.body.place;
    floor.description = req.body.description;
    floor.lat = req.body.lat;
    floor.lng = req.body.lng;
    floor.crowdedness = req.body.crowdedness;
    floor.basement_floors = -1;
    floor.floors = -1;
    floor.isBuilding = false;
    floor.whichFloor = req.body.whichFloor
    floor.save(function (err) {
      if (err) {
        throw err;
      } else {
        console.log("floor created");
      }
    });
  })



// =====================================
// Client Side Requests ================
// =====================================

//The other shit that I dont have to look or touch
app.get('/bower_components/*', function (req, res) {
  res.sendfile('./client/bower_components/' + req.params[0]);
});

app.get('/static/*', function (req, res) {
  res.sendfile('./client/' + req.params[0]);
});

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    res.sendfile('client/index.html');
  });

};

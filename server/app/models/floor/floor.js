// app/models/rooms.js
// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;    

// define the schema for our room model
var floorSchema = mongoose.Schema({
    place : String,
    description : String,
    lat : Number,
    lng : Number,
    crowdedness: Number,
    basement_floors: Number,
    floors: Number,
    isBuilding: Boolean,
    whichFloor: String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Floor', floorSchema);










          // place: place.place,
          // description: place.description,
          // lat: place.lat,
          // lng: place.lng - horzShift * (i + 1),
          // popularity: -1,
          // floors: -1,
          // basement_floors: -1,
          // isBuilding: false,
          // whichFloor: basementLetters[i],
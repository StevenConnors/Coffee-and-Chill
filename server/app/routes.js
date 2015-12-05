'use strict';

module.exports = function (app, passport) {

















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

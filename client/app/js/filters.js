'use strict';

angular.module('coffeeAndChill')

// humanizes a datetime string relative to today
.filter('timify', ['$filter', function ($filter) {

  var COUPLE_SECONDS = 3000;
  var ONE_MINUTE = 60000;
  var ONE_HOUR = 3600000;
  var ONE_DAY = 86400000;

  return function (dateStr) {

    var now = new Date();
    var date = new Date(dateStr);
    var diff = now - date;
    var isFuture = diff < 0;
    diff = Math.abs(diff);
    var preText = isFuture ? 'in ' : '';
    var postText =  isFuture ? '.' : ' ago.';

    if (diff < COUPLE_SECONDS) {
      return  'Just now.';

    } else if (diff < ONE_MINUTE) {
      return  preText + 'less than a minute' + postText;

    } else if (diff < ONE_HOUR) {
      var diffInMinutes = Math.floor(diff / ONE_MINUTE);
      var minutes = diffInMinutes === 1 ? 'minute' : 'minutes';
      return preText + diffInMinutes + ' ' + minutes + postText;

    } else if (diff < ONE_DAY) {
      var diffInHours = Math.floor(diff / ONE_HOUR);
      var hours = diffInHours === 1 ? 'hour' : 'hours';
      return preText + diffInHours + ' ' + hours + postText;

    } else {
      var dateFilter = $filter('date');
      return 'on ' + dateFilter(dateStr, ' d MMM, yyyy') + '.';

    }
  };
}])

// humanizes a datetime string relative to today
.filter('timifyShort', ['$filter', function ($filter) {

  var ONE_MINUTE = 60000;
  var ONE_HOUR = 3600000;
  var ONE_DAY = 86400000;

  return function (dateStr) {

    var now = new Date();
    var date = new Date(dateStr);
    var diff = Math.abs(now - date);

    if (diff < ONE_MINUTE) {
      return  'Just now';
    } else if (diff < ONE_HOUR) {
      var diffInMinutes = Math.floor(diff / ONE_MINUTE);
      return diffInMinutes + ' min';
    } else if (diff < ONE_DAY) {
      var diffInHours = Math.floor(diff / ONE_HOUR);
      var hours = diffInHours === 1 ? 'hour' : 'hours';
      return diffInHours + ' ' + hours;
    } else {
      var dateFilter = $filter('date');
      return dateFilter(dateStr, ' d MMM, yy');

    }
  };
}])

.filter('reverse', function() {
  return function(items) {
    if (!angular.isUndefined(items)) {
      return items.slice().reverse();
    }
  };
})

.filter('isMe', ['$filter', function () {

  return function (str, me) {
    if (str === me) {
      return 'me';
    } else {
      return str;
    }

  };

}]);
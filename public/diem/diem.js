var diem = angular.module('diem', []);

diem.service('Occurrencies', function($http) {
  _this = this;
  this.promise = $http.get('/api/occurrences').then(function(response) {
    return _this.data = response.data;
  });
});

diem.controller("DayController", function($scope) {
  $scope.time = moment().subtract('days', $scope.x)
});

diem.filter('range', function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
});

diem.controller("DaysController", function($scope, Occurrencies) {
  var today = new Date();
  $scope.occurrences = [];
  Occurrencies.promise.then(function(data) {
    $scope.occurrences = data;
  })
});

diem.filter('daysAgo', function () {
  return function (date) {
    return moment().subtract('days', date)
  };
});

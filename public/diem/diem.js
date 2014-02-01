var diem = angular.module('diem', ['ngRoute']);

diem.config(function($routeProvider, $locationProvider) {

  //$locationProvider.html5Mode(true);
  $routeProvider.
    when('/', {
      controller: 'HomeController',
      templateUrl: 'all.html'
    }).
    when('/day/:day', {
      controller: 'DayController',
      templateUrl: 'day.html'
    });
});

diem.controller('MainController', function($scope, $location) {
  $scope.isRoute = function(location) {
    return $location.path() == location;
  }
});

diem.service('Occurrencies', function($http) {
  _this = this;
  this.promise = $http.get('/api/occurrences').then(function(response) {
    return _this.data = response.data;
  });
});

diem.controller("HomeController", function($scope) {
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
  $scope.data = [[0,1,2,3,4],[3,1,2,1,9],[1,1,2,3,1],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4]]
  $scope.maximum = Math.max.apply(Math,$scope.data.map(function(o){return Math.max.apply(Math,o)}));
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

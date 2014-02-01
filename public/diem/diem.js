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
  var _this = this;
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
  $scope.graphs = []
  $scope.directories = {};
  Occurrencies.promise.then(function(data) {
    $scope.occurrences = data;
    
    var interval = 5 * 60 * 1000;
    
    $scope.directories = {};
    
    // for each data
    for (var i=0; i < data.length; i++) {
      
      // for each path
      var paths = data[i].path.substr(1).split('/');
      var temp_path = $scope.directories;
      for (var j=1; j < paths.length; j++) {
        var last_time = (new Date(data[i].time)).getTime();
        
        if (!temp_path[paths[j]]) {
            temp_path[paths[j]] = {directories:{}, count: []};
        }
        var current_path = temp_path[paths[j]];
        
        if (current_path.count.length == 0) {
          current_path.count.push({secs: interval, last_time: last_time});
        } else if (last_time - current_path.count[current_path.count.length-1].last_time < interval) {
          current_path.count[current_path.count.length-1].secs += last_time - current_path.count[current_path.count.length-1].last_time;
          current_path.count[current_path.count.length-1].last_time = last_time;
        } else {
          current_path.count.push({secs: interval, last_time: last_time});
        }
        temp_path = current_path.directories;
      }

    }
    console.log("dict", $scope.directories);
    $scope.graphs = data;
  })
});

diem.filter('daysAgo', function () {
  return function (date) {
    return moment().subtract('days', date)
  };
});

var diem = angular.module('diem', ['ngRoute']);

diem.config(function($routeProvider, $locationProvider) {

  //$locationProvider.html5Mode(true);
  $routeProvider.
    when('/', {
      controller: 'HomeController',
      templateUrl: 'all.html'
    }).
    when('/day/:today', {
      controller: 'OneDayController',
      templateUrl: 'day.html'
    });
});

diem.controller('TickerController', function($scope) {
  $scope.setHeight = function(hour) {
    return (hour%6 == 0) ? 2 : 1;
  }
  $scope.showHour = function(hour) {
    return (hour%6 == 0) ? true : false;
  }

})

diem.controller('MainController', function($scope, $location, Occurrencies) {
  $scope.isRoute = function(location) {
    return $location.path() == location;
  };
  
  $scope.maximum = 0;
  $scope.occurrences = [];
  $scope.directories = {};
  $scope.directories_pairs = [];
  Occurrencies.promise.then(function(data) {
    $scope.occurrences = data;
    $scope.directories = treeCount(data, 5 * 60 * 1000);

    var organized_dirs = organize_directories($scope.directories);
    console.log("organized_dirs", organized_dirs);
    $scope.directories_pairs = _.pairs(organized_dirs);
    $scope.maximum = Math.max.apply(Math,_(organized_dirs).map(function(o){return Math.max.apply(Math,_.values(o))}));
    console.log("dict", $scope.directories);
  });
  
});

diem.service('Occurrencies', function($http) {
  var _this = this;
  this.promise = $http.get('/api/occurrences').then(function(response) {
    return _this.data = response.data;
  });
});

diem.controller("HomeController", function($scope) {
});

diem.controller("OneDayController", function($scope, $routeParams) {
  $scope.today = moment($routeParams.today).format('ddd D MMM YYYY');
  $scope.today_start = new Date(moment($scope.today).startOf('day')).getTime();
  $scope.today_end = new Date(moment($scope.today).endOf('day')).getTime();
  console.log($scope.today_start, moment($scope.today_start).startOf('day').format(), $scope.today_end, moment($scope.today).endOf('day').format());
  $scope.scaleBy24h = function(seconds) {
    return 100*(seconds)/(24*60*60*1000)
  }
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

var treeCount = function (data, interval) {
  var data = _.sortBy(data, function(obj) {return (new Date(obj.time)).getTime()});

  var directories = {};
  for (var i=0; i < data.length; i++) {
    var paths = data[i].path.substr(1).split('/');
    var temp_path = directories;
    for (var j=1; j < paths.length; j++) {
      var last_time = (new Date(data[i].time)).getTime();
      if (!temp_path[paths[j]]) temp_path[paths[j]] = {directories:{}, count: []};
      var current_path = temp_path[paths[j]];
      
      if (current_path.count.length == 0) {
        current_path.count.push({secs: interval, last_time: last_time});
      } else if (last_time - current_path.count[current_path.count.length-1].last_time < interval) {
        // TODO if (moment(last_time).format('YYYY-MM-DD') == moment(current_path.count[current_path.count.length-1].last_time).format('YYYY-MM-DD')) {
          current_path.count[current_path.count.length-1].secs += last_time - current_path.count[current_path.count.length-1].last_time;
          current_path.count[current_path.count.length-1].last_time = last_time; 
          //}
      } else {
        current_path.count.push({secs: interval, last_time: last_time});
      }
      temp_path = current_path.directories;
    }
  }
  return directories;
}

var organize_directories = function(directories) {
  var organized_dirs = {}

  var timed_directories = _(_.pairs(directories)).map(function(directory) {

    var timed_directory = _(directory[1].count).groupBy(function(interval) {
      return moment(interval.last_time).format('YYYY-MM-DD');
    });
  
    console.log("\ttimed_directory", timed_directory)

    var organised_days = {};
    var timed_days = _(_.pairs(timed_directory)).map(function(day) {
      console.log("\t\tday", day);
      var reduced_day = _.reduce(_(day[1]).map(function(activity) {
        console.log("\t\t\tsecs", activity.secs);
        return activity.secs;
      }), function(s, u) {return s+u;});
    
      console.log("\t\treduced_day", reduced_day);
    
      organised_days[day[0]] =  reduced_day;
    })
    console.log("\ttimed_days", timed_days)
  
    organized_dirs[directory[0]] = organised_days;
  });
  
  return organized_dirs;
}

diem.controller("DaysController", function($scope, Occurrencies) {

});

diem.filter('format', function () {
  return function (date) {
    return moment(date).format()
  };
});

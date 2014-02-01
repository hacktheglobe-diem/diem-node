var diem = angular.module('diem', []);

diem.service('Occurrencies', function($http) {
  _this = this;
  this.promise = $http.get('/api/occurrences').then(function(response) {
    return _this.data = response.data;
  });
});

diem.controller("DayController", function() {
  
});

diem.controller("DaysController", function($scope, Occurrencies) {
  $scope.occurrences = [];
  Occurrencies.promise.then(function(data) {
    $scope.occurrences = data;
  })
});
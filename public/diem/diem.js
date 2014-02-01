var diem = angular.module('diem', []);

diem.service('Days', function() {
  _this = this;
  this.promise = $http.get('/api/activities').then(function(response) {
    _this.data = response.data;
  });
});

diem.controller("DayController", function() {
  
});

diem.controller("DaysController", function() {
  
});
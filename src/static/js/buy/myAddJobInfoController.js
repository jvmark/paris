angular.module('myAddJobInfoController', [])
  .controller('addJobInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      BuyService.job.addJobInfo('').then(function(data){
        
      });
  }]);
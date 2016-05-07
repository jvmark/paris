angular.module('myAddJobInfoController', [])
  .controller('addJobInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      $scope.addJobInfo = function(){
        BuyService.job.saveJobInfo({
          'companyName': window.localStorage.getItem('username'),
          'companyId': window.localStorage.getItem('userid'),
          'city': $scope.job.city,
          'description': $scope.job.description,
          'positionName': $scope.job.positionName,
          'diplomaLimit': $scope.job.diplomaLimit,
          'minSalary': $scope.job.minSalary,
          'maxSalary': $scope.job.maxSalary,
          'extra': $scope.job.extra
        }).then(function(jsn) {
          alert('成功');
        })
      }
  }]);
angular.module('myAddComInfoController', [])
  .controller('addComInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      $scope.addComInfo = function(){
        BuyService.company.saveComInfo({
          'name': $scope.company.name,
          'city': $scope.company.city,
          'description': $scope.company.description,
          'mail': $scope.company.mail,
          'homePage': $scope.company.homePage,
          "password": 123456
        }).then(function(jsn) {
          alert('成功');
        })
      }
  }]);
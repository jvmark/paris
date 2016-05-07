angular.module('myAddComInfoController', [])
  .controller('addComInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      $scope.addComInfo = function(){
        BuyService.company.addComInfo({
          "username": eitem.login_name,
          "password": eitem.pswd
        }).then(function(jsn) {
          document.cookie="isLogin="+1;
          document.cookie="isLogin="+login_name;
          var nextUrl = GetRequest().next || 'order';
          location.href = '/#' + nextUrl;
        })
      }
  }]);
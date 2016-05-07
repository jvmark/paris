angular.module('myChangeComInfoController', [])
  .controller('changeComInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      getMyComInfo();
      function getMyComInfo(){
        BuyService.company.getMyComInfo({'id':window.localStorage.getItem('userid')}).then(function(jsn) {
          console.log(jsn);
          $scope.company = jsn.data;
        })
      }
      $scope.updateComInfo = function(){
        BuyService.company.saveComInfo({
          "id": window.localStorage.getItem('userid'),
          'name': $scope.company.name,
          'city': $scope.company.city,
          'description': $scope.company.description,
          'mail': $scope.company.mail,
          'homePage': $scope.company.homePage,
          "password": $scope.company.password
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
  }]);
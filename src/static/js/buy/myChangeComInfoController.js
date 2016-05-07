angular.module('myChangeComInfoController', [])
  .controller('changeComInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      $scope.company = {
          id: 3,
          name: "微云",
          password: "123456",
          city: "上海",
          description: "云计算，智能网络",
          mail: "hr@weiyun.com",
          homePage: "www.weiyun.com"
        }
  }]);
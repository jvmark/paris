angular.module('myChangeStuInfoController', [])
  .controller('changeStuInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      $scope.stu = {
          id: 3,
          sno: 20110001,
          className: "电气1101",
          major: "电气",
          name: "邓超",
          password: "123123",
          age: 23,
          sex: "男",
          phoneNumber: "18212341234",
          nation: "汉族"
        }
  }]);
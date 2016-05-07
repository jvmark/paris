angular.module('myAddStuInfoController', [])
  .controller('addStuInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      $scope.addStuInfo = function(){
        BuyService.student.saveStuInfo({
          "sno": $scope.stu.sno,
          "name": $scope.stu.name,
          "sex": $scope.stu.sex,
          "age": $scope.stu.age,
          "nation": $scope.stu.nation,
          "major": $scope.stu.major,
          "className": $scope.stu.className,
          "phoneNumber": $scope.stu.phoneNumber,
          "password": 123456
        }).then(function(jsn) {
          alert('成功');
        })
      }
  }]);
angular.module('myChangeStuInfoController', [])
  .controller('changeStuInfoPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      getMyStuInfo();
      function getMyStuInfo(){
        BuyService.student.getMyStuInfo({'id':window.localStorage.getItem('userid')}).then(function(jsn) {
          console.log(jsn);
          $scope.stu = jsn.data;
        })
      }
      $scope.updateStuInfo = function(){
        BuyService.student.saveStuInfo({
          "id": window.localStorage.getItem('userid'),
          "sno": $scope.stu.sno,
          "name": $scope.stu.name,
          "sex": $scope.stu.sex,
          "age": $scope.stu.age,
          "nation": $scope.stu.nation,
          "major": $scope.stu.major,
          "className": $scope.stu.className,
          "phoneNumber": $scope.stu.phoneNumber,
          "password": $scope.stu.password
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
  }]);
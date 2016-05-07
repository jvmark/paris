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
          "sno": $scope.editStu.sno,
          "name": $scope.editStu.name,
          "sex": $scope.editStu.sex,
          "age": $scope.editStu.age,
          "nation": $scope.editStu.nation,
          "major": $scope.editStu.major,
          "className": $scope.editStu.className,
          "phoneNumber": $scope.editStu.phoneNumber,
          "password": $scope.editStu.password,
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
  }]);
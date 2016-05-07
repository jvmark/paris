angular.module('myStuInfoQueryController', [])
  .controller('stuInfoQueryPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService, ngDialog, $routeParams) {
      $scope.edit = function(eitem) {
        $scope.editStu = angular.copy(eitem);
        $scope.updatetmp = eitem;
        //打开对话框
        ngDialog.open({
          template: 'editTemp',
          scope: $scope,
          disableAnimation: true,
        });
      }
      $scope.updateStuInfo = function(){
        BuyService.student.saveStuInfo({
          "id": $scope.editStu.id,
          "name": $scope.editStu.name,
          "sex": $scope.editStu.sex,
          "age": $scope.editStu.age,
          "nation": $scope.editStu.nation,
          "sno": $scope.editStu.sno,
          "major": $scope.editStu.major,
          "className": $scope.editStu.className,
          "phoneNumber": $scope.editStu.phoneNumber
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
      $scope.delStuInfo = function(eitem){
        BuyService.student.delStuInfo({
          "id": eitem.id
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
      getStuInfoAll();
      function getStuInfoAll(){
        BuyService.student.getStuInfoAll({}).then(function(jsn) {
          console.log(jsn);
          $scope.studentList = jsn.data;
        })
      }
  }]);
angular.module('myStuInfoQueryController', [])
  .controller('stuInfoQueryPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService, ngDialog, $routeParams) {
      $scope.edit = function(eitem) {
        eitem = {
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
        $scope.editStu = angular.copy(eitem);
        $scope.updatetmp = eitem;
        //打开对话框
        ngDialog.open({
          template: 'editTemp',
          scope: $scope,
          disableAnimation: true,
        });
      }
  }]);
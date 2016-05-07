angular.module('myComInfoQueryController', [])
  .controller('comInfoQueryPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService, ngDialog, $routeParams) {
      $scope.edit = function(eitem) {
        eitem = {
          id: 3,
          name: "微云",
          password: "123456",
          city: "上海",
          description: "云计算，智能网络",
          mail: "hr@weiyun.com",
          homePage: "www.weiyun.com"
        }
        $scope.editCom = angular.copy(eitem);
        $scope.updatetmp = eitem;
        //打开对话框
        ngDialog.open({
          template: 'editTemp',
          scope: $scope,
          disableAnimation: true,
        });
      }
  }]);
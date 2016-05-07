angular.module('myComInfoQueryController', [])
  .controller('comInfoQueryPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService, ngDialog, $routeParams) {
      $scope.edit = function(eitem) {
        $scope.editCom = angular.copy(eitem);
        $scope.updatetmp = eitem;
        //打开对话框
        ngDialog.open({
          template: 'editTemp',
          scope: $scope,
          disableAnimation: true,
        });
      }
      $scope.updateComInfo = function(){
        BuyService.company.saveComInfo({
          'id': $scope.editCom.id,
          'name': $scope.editCom.name,
          'city': $scope.editCom.city,
          'description': $scope.editCom.description,
          'mail': $scope.editCom.mail,
          'homePage': $scope.editCom.homePage,
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
      $scope.delComInfo = function(eitem){
        BuyService.company.delComInfo({
          "id": eitem.id
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
      getComInfoAll();
      function getComInfoAll(){
        BuyService.company.getComInfoAll({}).then(function(jsn) {
          console.log(jsn);
          $scope.companyList = jsn.data;
        })
      }
  }]);
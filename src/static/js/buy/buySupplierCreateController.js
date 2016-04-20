angular.module('buySupplierCreateController', [])
  .controller('buySupplierCreateCtrl', ['$scope', 'BuyService',
    function ($scope, BuyService) {
      $scope.settleTypeMaps = [
         {value: '0', text: '支付宝'},
         {value: '1', text: '银行'},
      ];
      $scope.user_logistics_threshold = '0.00';
      $scope.user_logistics_price = '0.00';
      $scope.supplier_logistics_price = '0.00';
      $scope.supplier_logistics_threshold = '0.00';

      $scope.createSupplier = function () {
         getSecurityToken(function(token) {
             BuyService.supplier.create({
                'supplier_name': $scope.supplier_name,
                'user_logistics_price': $scope.user_logistics_price,
                'user_logistics_threshold': $scope.user_logistics_threshold,
                'supplier_logistics_price': $scope.supplier_logistics_price,
                'supplier_logistics_threshold': $scope.supplier_logistics_threshold,
                'contacts' : $scope.contacts,
                'telephone': $scope.telephone,
                'duitang_bd':  $scope.duitang_bd,
                'remark':  $scope.remark,
                'settle_type': $scope.settle_type,
                'account':  $scope.account,
                'receiver': $scope.receiver,
                'bank':  $scope.bank,
                '_csrf_token_': token
              }).then(function(data){
                alert(data.message);
              });
          });
      }
}]);

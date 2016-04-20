angular.module('buyOrderPayOrdersController', [])
  .controller('buyOrderPayOrdersCtrl', ['$scope', 'BuyService', '$routeParams',
    function ($scope, BuyService, $routeParams) {
      $scope.downloadPayOrders = function(id_,supplier_id_){
        window.location.href = '/napi/buyadmin/order/todeliver/download/?date_id='+id_+'&supplier_id='+supplier_id_;
      }
      function init(){
        // days(缓存天数，默认7，最多31),supplier_id(供应商id，all表示所有，240为堆糖商店)
        $scope.days = 7;
        // 商城发货supplier_id
        $scope.supplier_id1 = 'all';
        // 堆糖仓库发货supplier_id
        $scope.supplier_id2 = '240';

        BuyService.payOrders.list(setParams($scope.days,$scope.supplier_id1)).then(function(data) {
          $scope.payOrdersListall = data.data.object_list;
        });
        BuyService.payOrders.list(setParams($scope.days,$scope.supplier_id2)).then(function(data) {
          $scope.payOrdersList240 = data.data.object_list;
        });

        //获取供应商id,组成请求参数
        function setParams(days_,supplier_id_){
          var params = {
            'days': days_,
            'supplier_id': supplier_id_
          };
          return params;
        }
      }
      init();
    }]);
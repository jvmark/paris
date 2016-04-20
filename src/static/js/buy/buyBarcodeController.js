/**
 * 条码扫描
 * @description
 * @author lloydsheng
 */
angular.module('buyBarcodeController', [])
  .controller('BarcodeCtrl', ['$scope', 'BaseService', function($scope, BaseService) {
    function search() {
      if ($scope.productID) {
        $scope.loading = true;
        BaseService.get('/napi/buyadmin/datasource/listByBarcodes/?barcodes=' + $scope.productID).then(function(result) {
          $scope.loading = false;
          if (result.status == 1) {
            if (result.data.object_list.length > 0) {
              $scope.spu = result.data.object_list[0];
              $scope.spu.productID = $scope.productID;
            } else {
              $scope.spu = null;
            }
            $scope.productID = "";

          }
        });
      }
    }
    $scope.searchKeyPress = function(keyEvent) {
      if (keyEvent.which === 13) {
        search();
      }
    }

    $scope.searchClick = function() {
      search();
    }

  }]);;
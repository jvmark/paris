angular.module('buySupplierUpdateController', [])
  .controller('buySupplierUpdateCtrl', ['$scope', 'BuyService', '$routeParams',
    function ($scope, BuyService,$routeParams) {
    	$scope.settleTypeMaps = [
         {value: 0, text: '支付宝'},
         {value: 1, text: '银行'},
      ];
      $scope.reSelectSettleType = false;
    	function init () {
    		var id = $routeParams.id;
    		getSupplierDetail(id);
    	}
    	init();
    	 //查询
      function getSupplierDetail (id_) {
	      var _params = {
	        supplier_id: id_,
	        start:0,
	        limit:1,
	      };
	      BuyService.supplier.query(_params).then(function(data){
  	        $scope.supplier = data.data.object_list[0];
                if(typeof(data.data.object_list[0].settle_type) === 'undefined'){
                    $scope.reSelectSettleType = true;
                    data.data.object_list[0].settle_type= 1;
                }
	      });
   	};
   	$scope.removeSettle = function () {
   		$scope.reSelectSettleType = true;
   		$scope.supplier.account = '' ;
   		$scope.supplier.receiver = '' ;
   		$scope.supplier.bank = '' ;
   	}

      $scope.updateSupplier = function () {
		if(confirm("确定修改这些信息吗？")==true){
		   var _params= $scope.supplier;
	         getSecurityToken(function(token) {
	         	_params['_csrf_token_'] = token;
	             BuyService.supplier.update(_params).then(function(data){
	                alert(data.message);
	              });
	          });
		 }else{
		  return false;
		}
      }
}]);

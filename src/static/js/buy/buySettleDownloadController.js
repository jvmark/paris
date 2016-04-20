angular.module('buySettleDownloadController', [])
  .controller('buySettleDownloadCtrl', ['$scope', 'BuyService',
    function($scope, BuyService) {
      function init(){
      	BuyService.settle.pkglist().then(function(jsn_){
      		$scope.pkglist = jsn_.data.object_list;
      	})
      }
      init();
    }
  ]);

angular.module('buyCouponSendController', [])
  .controller('buyCouponSendCtrl', ['$scope', 'BuyService','$routeParams',
    function($scope, BuyService,$routeParams) {
    	$scope.limit = 50;
      $scope.start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
      function init(){
      	getHistory(0);
      }

      init();
      $scope.checkUIds = function(ids_){
      	BuyService.coupon.checkUser({
      		'ids':ids_
      	}).then(function(jsn){
          $scope.user_message = jsn.message;
        });
      }
      $scope.checkCIds = function(ids_){
      	BuyService.coupon.checkCoupon({
      		'ids':ids_
      	}).then(function(jsn){
          $scope.coupon = jsn.data;
        });
      }
      $scope.sendCoupon = function(uIds_,cIds_){
      	if(confirm('请确认填写信息')){
      		BuyService.coupon.sendCoupon({
	      		'template_ids':cIds_,
	      		'user_ids':uIds_,
	      	}).then(function(jsn){
	          alert('发送成功');
            getHistory(0);
	        });
      	}
      }
      $scope.$on("$routeUpdate", function(event, route) {
        var _limit = $scope.limit;
        var start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
        getHistory(start);
      });
      function getHistory(start_){
      	BuyService.coupon.sendCouponHistory({
          'start': start_,
          'limit': $scope.limit
        }).then(function(jsn_){
          $scope.pageLength = jsn_.data.history.length;
          $scope.history = jsn_.data.history;
          angular.forEach($scope.history, function(k, v) {
            angular.forEach($scope.history[v].user_ids, function(k, i) {
              if($scope.history[v].userIdsStr){
                $scope.history[v].userIdsStr = $scope.history[v].userIdsStr + ','+$scope.history[v].user_ids[i];
              }else{
                $scope.history[v].userIdsStr = $scope.history[v].user_ids[i];
              }
            })

          })
          var next_start = jsn_.data.next_start;
          var total = jsn_.data.total;
          var baseurl = '#/coupon/send';
          var searcharg = {
            'limit': $scope.limit
          };
          // 翻页
          Paginator._init($scope, next_start, $scope.limit, total, baseurl, searcharg);
        })
      }
    }
  ]);

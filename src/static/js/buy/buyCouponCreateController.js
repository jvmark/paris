angular.module('buyCouponCreateController', [])
  .controller('buyCouponCreateCtrl', ['$scope', 'BuyService',
    function($scope, BuyService) {
      function init(){
        getCouponList();
        $scope.newCoupon = {};
        $('#timestamp1,#timestamp2,#timestamp3,#timestamp4').datetimepicker({
          showMinute: true,
          showSecond: true,
          showHour: true,
          showTime: true,
          dateFormat: 'yy-mm-dd',
          timeFormat: 'hh:mm:ss',
        });
      }
      function getCouponList(){
        BuyService.coupon.list().then(function(jsn){
          $scope.couponList = jsn.data;
        });
      }
      init();
      $scope.createCoupon = function(){
        if(confirm('确定要创建该优惠券吗？')){
          BuyService.coupon.create($scope.newCoupon).then(function(jsn){
            alert(jsn.message);
            getCouponList();
          });
        }
      }
    }
  ]);

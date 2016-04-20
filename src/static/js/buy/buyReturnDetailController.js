angular.module('buyReturnDetailController', [])
  .controller('returnOrderDetailCtrl', ['$scope', 'BuyService', '$routeParams', '$location',
    function($scope, BuyService, $routeParams, $location) {

      var id = $routeParams.id;
      Init(id);
      //获取基本信息
      function Init(id) {
        var pa = {
          params: {
            id: id
          }
        }
        BuyService.orderReturn.queryDetail(pa).then(function(jsn) {
          if (jsn.status === 1) {
            $scope.orderDetail = jsn.data;
          }
        });
      }
      //修改状态
      $scope.changeStaut = function(s) {
        SUGAR.PopOut.alert('<div class="prompt"><h3 style="text-align:center;padding:0;">确定执行该操作吗？</h3><div class="opt" style="text-align:center"><input type="button" class="btn btn-ok" data-key="' + s + '" value="确定" /><input  class="btn" type="button" value="取消"  style="margin-left:20px" onclick="SUGAR.PopOut.closeMask();"/> </div></div>');
        $('body').on('click', '.btn-ok', function() {
          var key = $(this).data('key');
          // console.log('!!!');
          if (key) {
            var _this = this;
            var pas = {
              order_list: $scope.orderDetail.id,
              order_status: s
            };
            BuyService.orderReturn.update(pas).then(function(jsn) {
              if (jsn.status === 1) {
                SUGAR.PopOut.alert('<div class="prompt"><h3>操作成功！</h3></div>');
                window.location.reload();
              }
            });
          }
        })
      };

    }
  ])
  .filter('parseStatus', function() {
    return function(order_status) {
      switch (parseInt(order_status)) {
        case 1:
          return '待退款';
          break;
        case 2:
          return '已提交退款';
          break;
        case 3:
          return '已结算';
          break;
      }
    }
  })
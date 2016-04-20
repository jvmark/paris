angular.module('buyReturnOrderController', [])
  .controller('returnOrderPageCtrl', ['$scope', 'BuyService', '$routeParams', '$location',
    function($scope, BuyService, $routeParams, $location) {
      //查询类型
      $scope.queryTypes = [{
        text: '供应商ID',
        value: 'supplier_id'
      }, {
        text: '团期号',
        value: 'batch_no'
      }, {
        text: '主订单号',
        value: 'biz_order_id'
      }, {
        text: '退货单号',
        value: 'refund_order_id'
      }];

      //商品状态
      $scope.goodStatus = [{
        text: '全部',
        value: ''
      }, {
        text: '待退款',
        value: 1
      }, {
        text: '已提交退款',
        value: 2
      }, {
        text: '已结算',
        value: 3
      }];

      //参数初始化
      var limit = 50;
      $scope.queryType = $scope.queryTypes[0];
      $scope.order_status = $scope.goodStatus[0];
      $scope.order_sta = 2;

      var $acount = $('.allCount'),
        $selectedCount = $('.selected');


      //开始时间选择
      $('#timestamp1,#timestamp2').datetimepicker({
        showButtonPanel: false,
        showMinute: true,
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'hh:mm:ss'
      });

      //点击查询
      $scope.findList = function() {
        getReturnOrderList(0);
      };

      //导出文件
      $scope.saveToCsv = function() {
        var pa = {
          start_date: $scope.start_date || $routeParams.start_date || '',
          end_date: $scope.end_date || $routeParams.end_date || '',
          order_status: $scope.order_status.value || $routeParams.order_status || '',
        };
        var config = {
          params: pa
        };
        var types = $scope.queryType.value || $routeParams.types || 'supplier_id';
        pa[types] = $scope.modalcode || $routeParams.modalcode || '';
        var url = '?';
        for (var i in pa) {
          url += (i + '=' + pa[i] + '&');
        }
        window.location.href = '/napi/buyadmin/refund/order/export/' + url;
      };

      //获取退货订单列表
      function getReturnOrderList(start) {
        var pa = {
          start_date: $scope.start_date || $routeParams.start_date || '',
          end_date: $scope.end_date || $routeParams.end_date || '',
          order_status: $scope.order_status.value || $routeParams.order_status || '',
          limit: limit || $routeParams.limit,
          start: start || $routeParams.start || 0
        };
        var config = {
          params: pa
        };

        var types = $scope.queryType.value || $routeParams.types || 'supplier_id';
        pa[types] = $scope.modalcode || $routeParams.modalcode || '';

        //调取服务
        BuyService.orderReturn.query(config).then(function(jsn) {
          if (jsn.status === 1) {
            $scope.datalist = jsn.data.object_list;
            $acount.text(jsn.data.object_list.length);
            $selectedCount.text(0);

            var next_start = parseInt(jsn.data.next_start);
            var hasnext = jsn.data.more;
            var baseurl = '#/return/';
            var searcharg = {
              limit: limit,
              startDate: pa.start_date,
              endDate: pa.end_date,
              orderStatus: pa.order_status
            };
            searcharg[types] = pa[types];
            Pnpaginator._init($scope, next_start, limit, hasnext, baseurl, searcharg);
            $('.pagecnt').css({
              "display": "inline-block"
            });
          }
        });
      };

      //取消订单
      $scope.cancleReturnOrder = function() {
        var _this = this;
        var pas = {
          order_list: this.item.id,
          order_status: -1
        };
        SUGAR.PopOut.alert('<div class="prompt"><h3 style="text-align:center;padding:0;">确定执行该操作吗？</h3><div class="opt" style="text-align:center"><input type="button" class="btn btn-ok" value="确定" /><input  class="btn" type="button" value="取消"  style="margin-left:20px" onclick="SUGAR.PopOut.closeMask();"/> </div></div>');
        $('body').on('click', '.btn-ok', function() {
          BuyService.orderReturn.update(pas).then(function(jsn) {
            if (jsn.status === 1) {
              SUGAR.PopOut.alert('<div class="prompt"><h3>取消退货订单成功！</h3></div>');
            }
          });
        });
      };

      //跳转详情页面
      $scope.saveMessage = function(e) {
        var _this = this,
          jsn = JSON.stringify(_this.item);
        if (window.sessionStorage) {
          sessionStorage.setItem('returnOrderDetail', jsn);
        } else {
          SUGAR.PopOut.alert('<div class="prompt"><h3>请在高版本浏览器中打开！</h3></div>');
          e.preventDefault();
        }
      };
      //点击执行
      $scope.submitStatus = function() {
        var ids = '';
        $('.sub input:checked').each(function() {
          ids += $(this).data('id') + ',';
        });
        if (ids.length > 0) {
          ids = ids.substring(0, ids.length - 1);
          var pas = {
            order_list: ids,
            order_status: $scope.order_sta
          };
          SUGAR.PopOut.alert('<div class="prompt"><h3 style="text-align:center;padding:0;">确定执行该操作吗？</h3><div class="opt" style="text-align:center"><input type="button" class="btn btn-ok" value="确定" /><input  class="btn" type="button" value="取消"  style="margin-left:20px" onclick="SUGAR.PopOut.closeMask();"/> </div></div>');
          $('body').on('click', '.btn-ok', function() {
            BuyService.orderReturn.update(pas).then(function(jsn) {
              if (jsn.status === 1) {
                SUGAR.PopOut.alert('<div class="prompt"><h3>操作成功！</h3></div>');
                getReturnOrderList(0);
              }
            });
          });
        } else {
          SUGAR.PopOut.alert('<div class="prompt"><h3>至少选中一项！</h3></div>');
        }
      };

      $scope.$on('$routeUpdate', function(event, route) {
        var page = route.params.page || 0;
        var start = (parseInt(page) - 1) * limit || 0;
        getReturnOrderList(start);
      });
      //全选操作
      $('.all input').on('change', function() {
        if ($(this).is(':checked')) {
          $('.sub input').attr('checked', 'checked');
          var l=$('.sub input:checked:visible').length;
          $selectedCount.text(l);
        } else {
          $('.sub input').attr('checked', false);
          $selectedCount.text(0);
        }
      });

      $('#datalists').on('click', '.sub input', function() {
        var s = $selectedCount.eq(0).text(),c;
        $('.all input').attr('checked', false);
        if ($(this).is(':checked')) {
          c=parseInt(s)+1;
          $selectedCount.text(c);
        } else {
          c=parseInt(s)-1;
          $selectedCount.text(c);
        }
      });
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
        case -1:
          return '已取消'
          break;
      }
    }
  })
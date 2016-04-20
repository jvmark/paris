angular.module('buyReturnAddController', [])
  .controller('returnOrderAddCtrl', ['$scope', 'BuyService', '$routeParams', '$location',
    function($scope, BuyService, $routeParams, $location) {

      //比例取值
      $scope.user_apportioned_refund = 0; //应退商品金额，用户承担部分
      $scope.supplier_settle_refund = 100; //商品结算金额 供应商承担部分
      $scope.dt_apportioned_refund = 0; //商品结算金额 堆糖承担部分

      $scope.user_logistics_refund = 100; //用户邮费退款
      $scope.supplier_logistics_refund = 0; //供应商结算邮费退款
      $scope.dt_logistics_refund = 0; //堆糖结算邮费退款


      $scope.user_apportioned_return_logistics = 100; //用户回寄邮费分摊
      $scope.supplier_apportioned_return_logistics = 0; //供应商回寄邮费分摊
      $scope.dt_apportioned_return_logistics = 0; //堆糖回寄邮费分摊

      $scope.user_logistics_loss = 0; // 免邮损耗 用户
      $scope.dt_logistics_loss = 100;   // 免邮损耗 堆糖
      $scope.logistics_loss = 0; // 免邮损耗 初始化

      $scope.return_logistics_fee = 0; //回寄邮费
      $scope.disabledEdit = true;

      //商品最大值
      var maxCount = 0;
      var userFee = 0; //用户邮费
      var refund_rate = 0; //结算比例
      var goodPrice = 0; //商品结算金额
      var refundFeeJs = 0; //结算邮费
      var turePrice = 0; //商品实付金额


      //商品取值
      $scope.priceTypes1 = [{
        text: '退,商家承担',
        value: 0
      }, {
        text: '退,堆糖承担',
        value: 1
      }, {
        text: '多方共担',
        value: 2
      }, ];

      //发货邮费
      $scope.priceTypes2 = [{
        text: '不退',
        value: 0
      }, {
        text: '退,商家承担',
        value: 1
      }, {
        text: '退,堆糖承担',
        value: 2
      }, {
        text: '多方共担',
        value: 3
      }];
      //是否有商品回寄
      $scope.priceTypes3 = [{
        text: '没有',
        value: 0
      }, {
        text: '有,邮费用户自己承担',
        value: 1
      }, {
        text: '有,邮费商家承担',
        value: 2
      }, {
        text: '有,邮费堆糖承担',
        value: 3
      }, {
        text: '有,邮费多方共担',
        value: 4
      }];
      //免邮损耗
      $scope.priceTypes4 = [{
        text: '没有',
        value: 0
      }, {
        text: '有,用户承担',
        value: 1
      }, {
        text: '有,堆糖承担',
        value: 2
      }, {
        text: '多方共担',
        value: 3
      }];

      $scope.price1 = $scope.priceTypes1[0];
      $scope.price2 = $scope.priceTypes2[0];
      $scope.price3 = $scope.priceTypes3[0];
      $scope.price4 = $scope.priceTypes4[0];
      $scope.changeText = '修改金额';
      $scope.showYf = true;


      $scope.changeEdit = function(e) {
        $scope.disabledEdit = !$scope.disabledEdit;
        $scope.changeText = $scope.disabledEdit === true ? '修改金额' : '保存';
        if ($scope.disabledEdit) {
          calculatFee();
        }
      };
      //变化
      $scope.feeChange1 = function() {
        switch ($scope.price1.value) {
          case 0:
            $scope.user_apportioned_refund = 0; //应退商品金额，用户承担部分
            $scope.supplier_settle_refund = 100; //商品结算金额 供应商承担部分
            $scope.dt_apportioned_refund = 0; //商品结算金额 堆糖承担部分
            break;
          case 1:
            $scope.user_apportioned_refund = 0; //应退商品金额，用户承担部分
            $scope.supplier_settle_refund = 0; //商品结算金额 供应商承担部分
            $scope.dt_apportioned_refund = 100; //商品结算金额 堆糖承担部分
            break;
          case 2:
            $scope.user_apportioned_refund = 0; //应退商品金额，用户承担部分
            $scope.supplier_settle_refund = 50; //商品结算金额 供应商承担部分
            $scope.dt_apportioned_refund = 50; //商品结算金额 堆糖承担部分
            break;
        }
        calculatFee();
      };

      $scope.feeChange2 = function() {
        switch ($scope.price2.value) {
          case 0:
            $scope.user_logistics_refund = 100; //用户邮费退款
            $scope.supplier_logistics_refund = 0; //供应商结算邮费退款
            $scope.dt_logistics_refund = 0; //堆糖结算邮费退款
            break;
          case 1:
            $scope.user_logistics_refund = 0; //用户邮费退款
            $scope.supplier_logistics_refund = 100; //供应商结算邮费退款
            $scope.dt_logistics_refund = 0; //堆糖结算邮费退款
            break;
          case 2:
            $scope.user_logistics_refund = 0; //用户邮费退款
            $scope.supplier_logistics_refund = 0; //供应商结算邮费退款
            $scope.dt_logistics_refund = 100; //堆糖结算邮费退款
            break;
          case 3:
            $scope.user_logistics_refund = 0; //用户邮费退款
            $scope.supplier_logistics_refund = 50; //供应商结算邮费退款
            $scope.dt_logistics_refund = 50; //堆糖结算邮费退款
            break;
        }
        calculatFee();
      };

      $scope.feeChange3 = function() {
        switch ($scope.price3.value) {
          case 0:
            $scope.return_logistics_fee = 0;
            $scope.user_apportioned_return_logistics = 100; //用户回寄邮费分摊
            $scope.supplier_apportioned_return_logistics = 0; //供应商回寄邮费分摊
            $scope.dt_apportioned_return_logistics = 0; //堆糖回寄邮费分摊
            break;
          case 1:
            $scope.user_apportioned_return_logistics = 100; //用户回寄邮费分摊
            $scope.supplier_apportioned_return_logistics = 0; //供应商回寄邮费分摊
            $scope.dt_apportioned_return_logistics = 0; //堆糖回寄邮费分摊
            break;
          case 2:
            $scope.user_apportioned_return_logistics = 0; //用户回寄邮费分摊
            $scope.supplier_apportioned_return_logistics = 100; //供应商回寄邮费分摊
            $scope.dt_apportioned_return_logistics = 0; //堆糖回寄邮费分摊
            break;
          case 3:
            $scope.user_apportioned_return_logistics = 0; //用户回寄邮费分摊
            $scope.supplier_apportioned_return_logistics = 0; //供应商回寄邮费分摊
            $scope.dt_apportioned_return_logistics = 100; //堆糖回寄邮费分摊
            break;
          case 4:
            $scope.user_apportioned_return_logistics = 0; //用户回寄邮费分摊
            $scope.supplier_apportioned_return_logistics = 50; //供应商回寄邮费分摊
            $scope.dt_apportioned_return_logistics = 50; //堆糖回寄邮费分摊
            break;
        }
        calculatFee();
      };

      $scope.feeChange4 = function() {
        switch ($scope.price4.value) {
          case 0:
            $scope.logistics_loss = 0;
            $scope.user_logistics_loss = 0; //用户承担
            $scope.dt_logistics_loss = 0; //堆糖承担免邮损耗
            break;
          case 1:
            $scope.user_logistics_loss = 100; //用户承担
            $scope.dt_logistics_loss = 0; //堆糖承担免邮损耗
            break;
          case 2:
            $scope.user_logistics_loss = 0; //用户承担
            $scope.dt_logistics_loss = 100; //堆糖承担免邮损耗
            break;
          case 3:
            $scope.user_logistics_loss = 50; //用户承担
            $scope.dt_logistics_loss = 50; //堆糖承担免邮损耗
            break;
        }
        calculatFee();
      };

      //绑定基本数据
      Init();

      //tab切换
      $('#tabs-plain li').on('click', function() {
        $(this).addClass('ui-tabs-active ui-state-active').siblings('li').removeClass('ui-tabs-active ui-state-active');
        var id = $(this).find('a').data('for');
        $(id).show().siblings('.ui-tabs-panel').hide();
      });

      //初始化
      function Init() {
        if (window.sessionStorage) {
          var s = sessionStorage.getItem('returnOrderCreate');
          $scope.orderDetail = angular.fromJson(s);
          //退货数量
          $scope.quantity = $scope.orderDetail.settle_msg.quantity;

          //子订单金额
          $scope.sub_price = $scope.orderDetail.pay_order_msg.sub_order_fee;

          //子订单结算单价纪录
          turePrice = $scope.sub_price;

          //记录基数
          maxCount = $scope.quantity;
          userFee = $scope.orderDetail.pay_order_msg.main_order_logistics; //用户邮费
          refund_rate = $scope.orderDetail.settle_msg.refund_rate;

          $scope.goodprice = $scope.orderDetail.settle_msg.sub_order_settle_fee * $scope.quantity; //商品结算金额

          refundFeeJs = $scope.orderDetail.settle_msg.main_order_settle_logistics; //结算邮费
          if (parseFloat(refundFeeJs) === 0 && parseFloat(userFee) === 0) {
            $scope.showYf = false;
          }
          calculatFee();

        } else {
          SUGAR.PopOut.alert('<div class="prompt"><h3>请在高版本浏览器中打开！</h3></div>');
        }
      }

      //数字加减
      $scope.minus = function() {
        if (isNaN($scope.quantity)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>输入具体数值！</h3></div>');
          return false;
        }
        if ($scope.quantity === 1) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>已经最小了！</h3></div>');
          $('#minus').attr('disabled', true);
        } else {
          $scope.quantity--;
          $scope.sub_price = (($scope.quantity * turePrice) / maxCount).toFixed(2); //实时  实付金额
          $scope.goodprice = $scope.orderDetail.settle_msg.sub_order_settle_fee * $scope.quantity; //实时 结算金额
          calculatFee();
        }
      };

      $scope.plus = function() {
        $('#minus').attr('disabled', false);
        if (isNaN($scope.quantity)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>输入具体数值！</h3></div>');
          return false;
        }
        if ($scope.quantity < maxCount) {
          $scope.quantity++;
          $scope.sub_price = (($scope.quantity * turePrice) / maxCount).toFixed(2);
          $scope.goodprice = $scope.orderDetail.settle_msg.sub_order_settle_fee * $scope.quantity; //实时 结算金额
          calculatFee();
        } else {
          SUGAR.PopOut.alert('<div class="prompt"><h3>已经到最大值了！</h3></div>');
          return false;
        }
      };


      //数量变化
      $scope.keyUpPrice = function() {
        if (isNaN($scope.quantity)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>输入具体数值！</h3></div>');
          return false;
        }
      };

      //比例变化
      $scope.changeFee = function(e) {
        calculatFee();
      };

      //计算结果
      function calculatFee() {

        // 退款组成  商品金额        发货邮费            回寄邮费               免邮损耗
        // 承担方 用户  供应商 堆糖  用户  供应商 堆糖     用户  供应商 堆糖       用户  堆糖
        // 承担比例  b1  s1  d1     b2   s2     d2      b3    s3    d3        b4    d4
        // （公式一）应退用户金额=（1-b1）*应退商品金额+（1-b2）*用户邮费+（1-b3）*回寄邮费 - 免邮损耗*b4
        // （公式二）退货供应商结算金额=s1*商品结算金额*（1-返点）+s2*结算邮费+s3*回寄邮费  - 免邮损耗
        // （公式三）堆糖承担金额=d1*商品结算金额*（1-返点）+d2*结算邮费+d3*回寄邮费 + 免邮损耗*d4
        if (isNaN($scope.user_apportioned_refund) ||
          isNaN($scope.user_logistics_refund) ||
          isNaN($scope.user_apportioned_return_logistics) ||
          isNaN($scope.supplier_settle_refund) ||
          isNaN($scope.supplier_logistics_refund) ||
          isNaN($scope.supplier_apportioned_return_logistics) ||
          isNaN($scope.dt_apportioned_refund) ||
          isNaN($scope.dt_logistics_refund) ||
          isNaN($scope.dt_apportioned_return_logistics)) {
          $scope.price_user = '--';
          $scope.price_supplier = '--';
          $scope.price_dt = '--';
          return false;
        }

        $scope.price_user = (100 - $scope.user_apportioned_refund) * $scope.sub_price  + (100 - $scope.user_logistics_refund) * userFee  + (100 - $scope.user_apportioned_return_logistics) * $scope.return_logistics_fee  - $scope.logistics_loss* $scope.user_logistics_loss;
        $scope.price_user = $scope.price_user /100;

        $scope.price_supplier = $scope.supplier_settle_refund * $scope.goodprice * (100 - refund_rate) / 10000 + $scope.supplier_logistics_refund * refundFeeJs / 100 + $scope.supplier_apportioned_return_logistics * $scope.return_logistics_fee / 100  - ($scope.logistics_loss);

        $scope.price_dt = $scope.dt_apportioned_refund * $scope.goodprice * (100 - refund_rate) / 10000 + $scope.dt_logistics_refund * refundFeeJs / 100 + $scope.dt_apportioned_return_logistics * $scope.return_logistics_fee / 100 + $scope.logistics_loss*($scope.dt_logistics_loss/100);

      }
      //创建订单
      $scope.submitReturnOrder = function() {
        getToken(function(token) {
          var pas = {
            refund_reason: $scope.reason,
            remark: $scope.remark,
            main_order_id: $scope.orderDetail.basic_msg.main_order_id,
            sub_order_id: $scope.orderDetail.basic_msg.sub_order_id,
            quantity: $scope.quantity,
            inventory_refund: $scope.sub_price,
            return_logistics_fee: $scope.return_logistics_fee,
            user_apportioned_refund: $scope.user_apportioned_refund,
            supplier_settle_refund: $scope.supplier_settle_refund,
            dt_apportioned_refund: $scope.dt_apportioned_refund,
            user_logistics_refund: $scope.user_logistics_refund,
            supplier_logistics_refund: $scope.supplier_logistics_refund,
            dt_logistics_refund: $scope.dt_logistics_refund,
            user_apportioned_return_logistics: $scope.user_apportioned_return_logistics,
            supplier_apportioned_return_logistics: $scope.supplier_apportioned_return_logistics,
            dt_apportioned_return_logistics: $scope.dt_apportioned_return_logistics,
            dt_logistics_loss:$scope.dt_logistics_loss,
            user_logistics_loss: $scope.user_logistics_loss,
            logistics_loss : $scope.logistics_loss || 0,
            _csrf_token_: token
          };
          BuyService.orderReturn.create(pas).then(function(jsn) {
            if (jsn.status === 1) {
              SUGAR.PopOut.alert('<div class="prompt"><h3>退货单创建成功！</h3></div>');
              window.history.go(-1);
            }
          });
        });

      };

      //直接退部分商品
      $scope.submitReturnOrder1 = function() {
        getToken(function(token) {
          if (!isNaN($scope.sp1) && !isNaN($scope.sp2) && !isNaN($scope.sp3)) {
            var pas = {
              refund_reason: $scope.reason,
              remark: $scope.remark,
              main_order_id: $scope.orderDetail.basic_msg.main_order_id,
              sub_order_id: $scope.orderDetail.basic_msg.sub_order_id,
              refund_fee: $scope.sp1,
              supplier_settler_refund_fee: $scope.sp2,
              dt_apportioned_refund_fee: $scope.sp3,
              _csrf_token_: token
            };
            BuyService.orderReturn.create1(pas).then(function(jsn) {
              if (jsn.status === 1) {
                SUGAR.PopOut.alert('<div class="prompt"><h3>退货单创建成功！</h3></div>');
                setTimeout(function() {
                  window.history.go(-1);
                });
              }
            });
          } else {
            SUGAR.PopOut.alert('<div class="prompt"><h3>请正确填写数值！</h3></div>');
          }
        });
      };

      function getToken(fn) {
        // var s = window.location.host.replace(/operate.|opreatep./, '');
        var hosetArr = window.location.host.split('.'),
          s;
        if (hosetArr.length > 0) {
          if (hosetArr[0] === 'operate') {
            if (hosetArr.indexOf('s') != -1) {
              s = window.location.host.replace(/operate./, '');
            } else {
              s = window.location.host.replace(/operate./, 'www.');
            }
          } else {
            s = window.location.host.replace(/operatep./, 'p.');
          }
        } else {
          return false;
        }
        $.ajax({
            url: 'http://' + s + '/napi/security/token/',
            type: 'get',
            dataType: 'json',
            xhrFields: {
              withCredentials: true
            },
          })
          .done(function(jsn) {
            if (jsn.status === 1 && fn) {
              fn(jsn.data);
            } else {
              SUGAR.PopOut.alert('<div class="prompt"><h3>获取token失败！</h3></div>');
            }
         });
      }
      $scope.check1 = function() {
        if (isNaN($scope.sp1)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>请填写正确数值！</h3></div>');
          $scope.sp1 = 0;
          return;
        }
        if ($scope.sp1 < 0 || parseFloat($scope.sp1) > parseFloat($scope.sub_price)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>应退用户金额应大于0，且小于等于子订单金额！</h3></div>');
          $scope.sp1 = 0;
          return;
        }
      };
      $scope.check2 = function() {
        if (isNaN($scope.sp2)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>请填写正确数值！</h3></div>');
          $scope.sp2 = 0;
          return;
        }
        if ($scope.sp1 < 0 || parseFloat($scope.sp2) > parseFloat($scope.sub_price)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>大于等于0，且小于等于所填入的应退用户金额</div>');
          $scope.sp2 = 0;
          return;
        }
      };

      $scope.check3 = function() {
        if (isNaN($scope.sp3)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>请填写正确数值！</h3></div>');
          $scope.sp1 = 0;
          return;
        }
        if ($scope.sp3 < 0 || parseFloat($scope.sp3) > parseFloat($scope.sub_price)) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>大于等于0，且小于等于所填入的应退用户金额</h3></div>');
          $scope.sp3 = 0;
          return;
        }
      };
    }
  ]);
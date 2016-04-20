angular.module('buyOrderDetailController', [])
  .controller('buyOrderDetailCtrl', ['$scope', 'BuyService', '$routeParams', '$location',
    function($scope, BuyService, $routeParams, $location) {

      Init()

      //获取订单信息
      function Init() {
        var config = {
          params: {
            main_order_id: $routeParams.main_id,
            sub_order_id: $routeParams.sub_id
          }
        }
        BuyService.orderDetail.query(config).then(function(jsn) {
          if (jsn.status !== 1) {
            SUGAR.PopOut.alert('<div class="prompt"><h3>' + jsn.data + '</h3></div>');
          } else {
            $scope.orderDetails = jsn.data;
            $scope.sub_order_settle_fee=jsn.data.settle_msg.sub_order_settle_fee*jsn.data.settle_msg.quantity;
          }
        })
      }

      //报错信息
      $scope.saveMes=function(){
        var jsn=JSON.stringify($scope.orderDetails);
        if(window.sessionStorage){
          sessionStorage.setItem('returnOrderCreate',jsn);
        }else{
          SUGAR.PopOut.alert('<div class="prompt"><h3>请在高版本浏览器中打开！</h3></div>');
        }
      };
    }
  ])
  .directive('if', function($parse, $compile) {
    var compile = function($element, $attrs) {
      var cond = $parse($attrs.true);

      var link = function($scope, $ielement, $iattrs, $controller) {
        $scope.if_node = $compile($.trim($ielement.html()))($scope, angular.noop);
        $ielement.empty();
        var mark = $('<!-- IF/ELSE -->');
        $element.before(mark);
        $element.remove();

        $scope.$watch(function(scope) {
          if (cond(scope)) {
            mark.after($scope.if_node);
            $scope.else_node.detach();
          } else {
            if ($scope.else_node !== undefined) {
              mark.after($scope.else_node);
              $scope.if_node.detach();
            }
          }
        });
      }
      return link;
    }

    return {
      compile: compile,
      scope: true,
      restrict: 'E'
    }
  })
  .directive('else', function($compile) {
    var compile = function($element, $attrs) {

      var link = function($scope, $ielement, $iattrs, $controller) {
        $scope.else_node = $compile($.trim($ielement.html()))($scope, angular.noop);
        $element.remove();
      }
      return link;
    }

    return {
      compile: compile,
      restrict: 'E'
    }
  })
angular.module('buySettleController', [])
  .controller('buySettleCtrl', ['$scope', 'BuyService','$routeParams',
    function($scope, BuyService,$routeParams) {
      // 结算订单状态选项
      $scope.orderStatus = [
        {value: '', text: '全部'},
        {value: 0, text: '待结算'},
        {value: 1, text: '已结算'},
      ];
      // 执行状态选项
      $scope.actions = [
        {value: '1', text: '设为已结算'},
      ];
      //查询参数
      $scope.limit = 50;
      $scope.start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
      $scope.supplier = $routeParams.supplier_name? $routeParams.supplier_name:'';
      $scope.selectOrderStatu = $routeParams.order_status ? parseInt($routeParams.order_status):'';
      $scope.genDate = $routeParams.create_date ?$routeParams.create_date:'';
      $scope.selectAction = $scope.actions[0].value;
      $scope.pageLength = 0;
      //选中需要执行的id;
      $scope.ids = [];
      //选中需要执行的id的长度
      $scope.idsLength = 0;
      /**
       * [getSelectList checkbox单个选中，获取选中id]
       * @param       {[type]}                 id_ [此次选中id]
       * @param       {[type]}                 co_ [此次checkbox的值]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-11-23T19:42:29+0800
       */
      $scope.getSelectList = function(id_,co_){
        if(co_ === true){
          $scope.ids.push(id_);
        }else{
          $.each($scope.ids, function(i, id) {
            if(id === id_){
              $scope.ids.splice(i,1);
            }
          });
        }
        $scope.idsLength = $scope.ids.length;
      }
      /**
       * [selectAllList 全选，全部选]
       * @param       {[type]}                 co_ [此次checkbox的值]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-11-23T19:43:59+0800
       */
      $scope.selectAllList = function(co_){
        if(co_ === true){
          $scope.ids = [];
          $.each($scope.data.object_list, function(i, item) {
            $scope.ids.push(item.id);
            item.co = true;
          });
        }else{
          $scope.ids = [];
          $.each($scope.data.object_list, function(i, item) {
            item.co = false;
          });
        }
        $scope.idsLength = $scope.ids.length;
      }
      /**
       * [implement 执行按钮，调用参数]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-11-23T19:44:49+0800
       */
      $scope.implement = function(){
        if($scope.ids.length > 0){
          if(confirm('确定要将'+$scope.idsLength+'个结算单设为已结算状态吗？')){
            BuyService.settle.settleUpdate({
              'order_list': $scope.ids.join(','),
              'order_status': $scope.selectAction,
            }).then(function(jsn_){
              alert(jsn_.message);
            })
          }

        }
      }
      /**
       * [query 结算订单列表的查询]
       * @param       {[type]}                 start_ [其实个数的值]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-11-23T19:45:19+0800
       */
      $scope.query = function(start_){
        if(!$scope.genDate){
          alert('请填写结算单生成日期');
          return;
        }
        BuyService.settle.settleList({
          'supplier_name': $scope.supplier,
          'order_status': $scope.selectOrderStatu,
          'create_date': $scope.genDate,
          'start': start_,
          'limit': $scope.limit
        }).then(function(jsn_){
          $scope.pageLength = jsn_.data.object_list.length;
          $.each(jsn_.data.object_list,function(i,item){
             $.each($scope.orderStatus, function(j, orderStatu) {
              if(item.order_status === orderStatu.value){
                item.order_statu_text = orderStatu.text;
              }
            });
          })
          $scope.data = jsn_.data;
          var next_start = jsn_.data.next_start;
          var total = jsn_.data.total;
          var baseurl = '#/settle/';
          var searcharg = {
            'supplier_name': $scope.supplier,
            'order_status': $scope.selectOrderStatu,
            'create_date': $scope.genDate,
            'limit': $scope.limit
          };
          // 翻页
          Paginator._init($scope, next_start, $scope.limit, total, baseurl, searcharg);
        })
      }
      /**
       * @param       {[type]}                 event  [url修改监测]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-11-23T19:46:50+0800
       */
      $scope.$on("$routeUpdate", function(event, route) {
        var _limit = $scope.limit;
        var start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
        $scope.query(start);
      });

      function init(){
        // 结算单生成时间
        $('#timestamp').datetimepicker({
          showMinute: false,
          showSecond: false,
          showHour: false,
          showTime: false,
          dateFormat: 'yy-mm-dd',
          timeFormat: '',
        });
        if($scope.start !== 0){
          $scope.query($scope.start);
        }
      }
      init();

    }
  ]);





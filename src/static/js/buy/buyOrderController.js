angular.module('buyOrderController', [])
  .controller('buyOrderPageCtrl', ['$scope', 'BaseService', 'BuyService', '$routeParams',
    function($scope, BaseService, BuyService, $routeParams) {
      var csvData;
      var createCounterSuccess = 0;
      var createCounter = 0;
      var createTotal;
      var lastCsvData = {
        data: []
      };
      var csvTestData = "OrderID,CustomerID,EmployeeID,OrderDate,RequiredDate,ShippedDate,ShipVia,Freight,ShipName,ShipAddress,ShipCity,ShipRegion,ShipPostalCode,ShipCountry\n10248,VINET,5,1996-07-04 00:00:00.000,1996-08-01 00:00:00.000,1996-07-16 00:00:00.000,3,32.38,Vins et alcools Chevalier,59 rue de l'Abbaye,Reims,NULL,51100,France\n10249,TOMSP,6,1996-07-05 00:00:00.000,1996-08-16 00:00:00.000,1996-07-10 00:00:00.000,1,11.61,Toms Spezialitäten,Luisenstr. 48,Münster,NULL,44087,Germany";

      // 订单状态结构
      $scope.orderMaps = [{
          value: '',
          status: 'ALL',
          text: '所有'
        }, // 后端无此字段
        {
          value: -1,
          status: 'INVALID',
          text: '订单无效'
        }, {
          value: 0,
          status: 'CREATED',
          text: '已创建'
        }, {
          value: 4,
          status: 'PAID',
          text: '已支付'
        }, {
          value: 8,
          status: 'AUDITED',
          text: '已审核'
        }, {
          value: 16,
          status: 'HANDLED',
          text: '已交付'
        }, {
          value: 17,
          status: 'STOCKOUT',
          text: '缺货异常'
        }, {
          value: 32,
          status: 'DELIVERING',
          text: '已发货'
        }, {
          value: 33,
          status: 'DELIVER_EXCEPTION',
          text: '配送异常'
        }, {
          value: 35,
          status: 'DELIVER_FAILED',
          text: '未送达'
        }, {
          value: 64,
          status: 'DELIVERED',
          text: '送达'
        }, {
          value: 128,
          status: 'REFUND',
          text: '订单退款'
        }, {
          value: 256,
          status: 'CLOSED',
          text: '订单关闭'
        },
      ];

      // 默认为查询"所有"
      $scope.orderStatus = $scope.orderMaps[0].value;


      // 订单查询方式
      $scope.orderQueryMaps = [{
        value: 'bizOrderId',
        text: '订单号'
      }, {
        value: 'buyerUid',
        text: '堆糖ID(等于买家ID)'
      }, {
        value: 'inventoryIds',
        text: '商品ID'
      }];

      // 默认为查询订单号
      $scope.orderQueryMethod = $scope.orderQueryMaps[1].value;

      // 订单时间查询方式
      $scope.orderTimeQueryMaps = [{
        value: '1',
        text: '订单创建时间'
      }, {
        value: '2',
        text: '订单付款时间'
      }];

      // 默认为查询订单号
      $scope.orderTimeQueryMethod = $scope.orderTimeQueryMaps[0].value;

      // 一次查询订单数
      $scope.limits = {
        "value": 100,
        "values": [10, 25, 50, 100],
      };

      // start
      $("#csv-file").change(handleFileSelect);

      function handleFileSelect(evt) {
        var file = evt.target.files[0];
        Papa.parse(file, {
          header: true,
          delimiter: "", // auto-detect
          newline: "\r\n", // auto-detect
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: function(results) {
            csvData = results;
            createTotal = csvData.data.length;
            createlimit = parseInt(createTotal) - 1;
            var lastone = csvData.data[createlimit];
            if (isEmpty(lastone)) {
              csvData.data.splice(createlimit, createlimit);
              lastCsvData = csvData;
              createTotal = createTotal - 1;
            } else {
              lastCsvData = csvData;
            }
            var paramsString = JSON.stringify(lastCsvData.data);
            var params = {
              data: paramsString
            };
            BuyService.order.import(params).then(function(data) {
              alert('上传成功');
            });
          }
        });
      }


      function isEmpty(object) {
        for (key in object) {
          if (object[key] !== '') {
            return false;
          } else {
            return true;
          }
        }
      }

      // 开始时间选择
      $('#timestamp1').datetimepicker({
        showMinute: true,
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'hh:mm:ss'
      });
      // 结束时间选择
      $('#timestamp2').datetimepicker({
        showMinute: true,
        showSecond: true,
        dateFormat: 'yy-mm-dd',
        timeFormat: 'hh:mm:ss'
      });

      Date.prototype.format = function(format) {
        var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(), //day
          "h+": this.getHours(), //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
          "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
              RegExp.$1.length == 1 ? o[k] :
              ("00" + o[k]).substr(("" + o[k]).length));
        return format;
      };
      var end_time = new Date().format('yyyy-MM-dd hh:mm:ss');
      $scope.end_time = end_time;

      $scope.getCount = function() {
        var limit = 999999;
        var bizKey = $scope.orderQueryMethod || '';
        var bizValue = $scope.bizOrderId || '';
        var startDate = $scope.startDate || '';
        var endDate = $scope.endDate || '';
        var orderStatus = $scope.orderStatus || '';
        var timeType = $scope.orderTimeQueryMethod || '';
        var start = 0;
        var params = {
          start: start,
          limit: limit,
          startDate: startDate,
          endDate: endDate,
          orderStatus: orderStatus,
          timeType: timeType
        };
        params[bizKey] = bizValue;
        if ((!startDate || !endDate) && !orderStatus && !bizValue) {
          popMsg('不允许查询条件为空！');
          return;
        }
        var config = {
          params: params
        };
        BuyService.order.getCount(config).then(function(data) {
          popMsg(data.data);
        });
      }

      $scope.orderOut = function() {
        var limit = 999999;
        var bizKey = $scope.orderQueryMethod || '';
        var bizValue = $scope.bizOrderId || '';
        var startDate = $scope.startDate || '';
        var endDate = $scope.endDate || '';
        var orderStatus = $scope.orderStatus || '';
        var timeType = $scope.orderTimeQueryMethod || '';
        var start = 0;
        var params = {
          start: start,
          limit: limit,
          startDate: startDate,
          endDate: endDate,
          orderStatus: orderStatus,
          timeType: timeType
        };
        params[bizKey] = bizValue;
        var paramsStr = 'start=' + start + '&limit=' + limit + '&startDate=' + startDate + '&endDate=' + endDate + '&orderStatus=' + orderStatus + '&timeType=' + timeType + '&' + bizKey + '=' + bizValue;

        window.location.href = "/napi/buyadmin/order/biz/download/?" + paramsStr;
      };

      $scope.tradeOut = function() {
        var limit = 999999;
        var bizKey = $scope.orderQueryMethod || '';
        var bizValue = $scope.bizOrderId || '';
        var startDate = $scope.startDate || '';
        var endDate = $scope.endDate || '';
        var orderStatus = $scope.orderStatus || '';
        var timeType = $scope.orderTimeQueryMethod || '';
        var start = 0;
        var params = {
          start: start,
          limit: limit,
          startDate: startDate,
          endDate: endDate,
          orderStatus: orderStatus,
          timeType: timeType
        };
        params[bizKey] = bizValue;
        var paramsStr = 'start=' + start + '&limit=' + limit + '&startDate=' + startDate + '&endDate=' + endDate + '&orderStatus=' + orderStatus + '&timeType=' + timeType + '&' + bizKey + '=' + bizValue;
        console.log("/napi/buyadmin/order/biz/download/?" + paramsStr);
        window.location.href = "/napi/buyadmin/order/pay/download/?" + paramsStr;
      };

      // 查询订单
      function queryOrder(start) {
        var limit = $scope.limits.value;
        var bizKey = $scope.orderQueryMethod || '';
        var bizValue = $scope.bizOrderId || '';
        var startDate = $routeParams.startDate || '';
        var endDate = $routeParams.endDate || '';
        var orderStatus = $routeParams.orderStatus || '';
        var timeType = $scope.orderTimeQueryMethod || '';
        var params = {
          start: start,
          limit: limit,
          startDate: startDate,
          endDate: endDate,
          orderStatus: orderStatus,
          timeType: timeType
        };
        params[bizKey] = bizValue;
        var config = {
          params: params
        };

        BuyService.order.export(config).then(function(data) {
          $scope.orders = data.data.object_list;
          var csvContent = "data:text/csv;charset=utf-8,";
          var csv = Papa.unparse({
            fields: ["gmt_create", "biz_order_id", "sub_biz_order_id", "order_status", "supplier_id", "supplier_name", "inventory_id", "inventory_name", "price", "quantity", "sub_biz_order_amount", "user_logistics_fee", "receiver", "addr", "tel", "logistics_time", "logistics_name", "logistics_ticket", "refund_order_id", "batch_no", "sub_biz_order_settle_amount", "supplier_logistics_fee", "rebate_rate", "settle_order_id", "out_pay_no", "buyer_uid", "buyer_name", "payway", "memo"],
            data: data.data.object_list
          });
          csvContent = csvContent + csv;
          var encodeUri = encodeURI(csvContent);
          var next_start = data.data.next_start;
          var hasnext = data.data.more;
          var baseurl = '#/order/';
          var searcharg = {
            limit: limit,
            startDate: startDate,
            endDate: endDate,
            orderStatus: orderStatus
          };
          searcharg[bizKey] = bizValue;
          Pnpaginator._init($scope, next_start, limit, hasnext, baseurl, searcharg);
          $('.pagecnt').css({
            "display": "inline-block"
          });
        });
      }

      $scope.queryOrder = function() {
        var urlhash = window.location.hash;
        var clickhash = $('#queryOrder').attr('href');
        if (urlhash === clickhash) {
          queryOrder(0);
        } else {
          queryOrder(0);
        }
      };

      // 监听地址栏地址变化
      $scope.$on('$routeUpdate', function(event, route) {
        var limit = $scope.limits.value;
        var page = route.params.page;
        var start = (parseInt(page) - 1) * limit || 0;
        queryOrder(start);
      });

      $scope.keyDown = function(event) {
        if (event.keyCode == 13) {
          queryOrder(0);
        }
      };

      $scope.getFeedbackLink = function(order) {
        BaseService.post('/api/tool/feedback_link', {
          order_id: order
        }).then(function(result) {
          if (result.status == 1) {
            SUGAR.PopOut.alert('<div class="prompt"><h3>' + result.data.url + '</h3></div>');
          } else {
            SUGAR.PopOut.alert('<div class="prompt"><h3>' + result.message + '</h3></div>');
          }
        });
      }

      function popMsg(data_) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>' + data_ + '</h3></div>');
      }
    }
  ]);
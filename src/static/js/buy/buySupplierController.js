angular.module('buySupplierController', [])
  .controller('buySupplierCtrl', ['$scope', 'BuyService', '$routeParams','$location',
    function ($scope, BuyService, $routeParams,$location) {
      var csvData;
      var createCounterSuccess = 0;
      var createCounter = 0;
      var createTotal;
      var limit = 50;
      var start = 0;
      var lastCsvData ={data:[]};
      // 查询方式
      $scope.queryMaps = [
        {value: 'supplier_name', text: '供应商名称'},
        {value: 'supplier_id', text: '供应商ID'},
        {value: 'duitang_bd', text: '堆糖BD工号'},
      ];
      init();
      function init(){
        var _params = {};
        BuyService.supplier.queryByName(_params).then(function(data){
          $scope.total_list = data.data;
        });
      }
      //导入文件
      function handleFileSelect(evt) {
        var file = evt.target.files[0];
        Papa.parse(file, {
          header: true,
          delimiter: "",  // auto-detect
          newline: "\r\n",  // auto-detect
          dynamicTyping: true,
          complete: function(results) {
            csvData = results;
            createTotal = csvData.data.length;
            createlimit = parseInt(createTotal) - 1;
            var lastone = csvData.data[createlimit];
            if (isEmpty(lastone)) {
              csvData.data.splice(createlimit,createlimit);
              lastCsvData = csvData;
              createTotal = createTotal -1;
            } else {
              lastCsvData = csvData;
            }
            var paramsString = JSON.stringify(lastCsvData.data);
            var params = {data: paramsString};
            BuyService.supplier.import(params).then(function(data){
              alert('上传成功');
            });
          }
        });
      }

      function isEmpty(object) {
        for (key in object) {
          if ( object[key] !== '') {
            return false;
          } else {
            return true;
          }
        }
      }
      //查询
      $scope.query = function query(start_) {
        var supplierId;
        var supplierName;
        var duitangBd;
        if($scope.queryWay === 'supplier_id'){
          supplierId = $scope.queryContent;
        }else if($scope.queryWay === 'duitang_bd'){
           duitangBd = $scope.queryContent;
        }else if($scope.queryWay === 'supplier_name'){
           return;
        }
        var _params = {
          supplier_id: supplierId,
          supplier_name: supplierName,
          duitang_bd: duitangBd,
          start:start_,
          limit:limit,
        };
        BuyService.supplier.query(_params).then(function(data){
          $scope.supplier_list = data.data.object_list;
          var nextStart = data.data.next;
          var hasnext = data.data.more;
          var baseUrl = '#/supplier/';
          var searcharg = {limit:limit,supplier_name: supplierName,supplier_id:supplierId};
          //翻页
          Pnpaginator._init($scope, nextStart, limit, hasnext, baseUrl, searcharg);
          $('.pagecnt').css({"display":"inline-block"});
        });
      };
      // 监听地址栏地址变化
      $scope.$on('$routeUpdate', function(event, route) {
        var page = route.params.page || 0;
        start = (parseInt(page) -1) * limit || 0;
        $scope.query(start);
      });
      //导出文件
      $scope.supplierExport = function(){
        var supplierId;
        var supplierName;
        var duitangBd;
        if($scope.queryWay === 'supplier_id'){
          supplierId = $scope.queryContent;
        }else if($scope.queryWay === 'supplier_name'){
          supplierName = $scope.queryContent;
        }else if($scope.queryWay === 'duitang_bd'){
           duitangBd = $scope.queryContent;
        }
        var _params = {
          supplier_id: supplierId,
          supplier_name: supplierName,
          duitang_bd: duitangBd,
          start:start,
          limit:limit,
        };
        BuyService.supplier.query(_params).then(function(data){
            var csvContent = "data:text/csv;charset=utf-8,";
            var csv = Papa.unparse({
              fields: ["supplier_id", "supplier_name", "contacts","telephone","duitang_bd","user_logistics_price", "user_logistics_threshold", "supplier_logistics_price", "supplier_logistics_threshold","settle_type_desc","account","receiver","remark"],
              data: data.data.object_list
            });
            csvContent = csvContent + csv;
            var encodeUri = encodeURI(csvContent);
            window.location.href = encodeUri;
        });

      };

      $("#csv-file").change(handleFileSelect);
}]);

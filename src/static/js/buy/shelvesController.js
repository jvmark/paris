angular.module('shelvesController', [])
  .controller('shelvesCtrl', ['$scope', 'BuyService', '$routeParams','$location',
    function ($scope, BuyService, $routeParams,$location) {
      var csvData;
      var createCounterSuccess = 0;
      var createCounter = 0;
      var createTotal;
      var lastCsvData ={data:[]};
      var limit = 24;
      $scope.importWay = 'import';
       // 订单时间查询方式
      $scope.queryMaps = [
        {value: '1', text: '团期号'},
        {value: '2', text: '商品ID'}
      ];
      // 默认为查询订单号
      $scope.queryMethod = $scope.queryMaps[0].value;
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
            if($scope.importWay === "edit"){
              BuyService.inventory.edit(params).then(function(data){
                alert('上传成功');
              });
            }else if($scope.importWay === "import"){
              BuyService.inventory.import(params).then(function(data){
                alert('上传成功');
              });
            }
          }
        });
      }
    $scope.upload = function(fileId_) {
      var root = $scope.root;

      var file = $('#'+fileId_)[0].files[0];
      var formData = new FormData();
      formData.append("root", root);
      formData.append("local_file",file);
      var xhr = new XMLHttpRequest();

      // xhr.onload = function() {
      //   alert("上传成功！");
      // }
      //设置回调函数
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
          var _json = JSON.parse(xhr.responseText);
          if(_json.status == 1){
              alert("上传成功");
          }else{
              alert(_json.message);
          }
        }
      }
      if(fileId_ === 'uploadNew'){
        xhr.open("POST", "/napi/buyadmin/inventory/import/", true);
      }else if(fileId_ === 'uploadModify'){
        xhr.open("POST", "/napi/buyadmin/inventory/edit/", true);
      }

      // 发送表单数据
      xhr.send(formData);
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

    $scope.queryBatchNumber = function(start_) {
      var batch = $routeParams.batch || '';
      var inventoryId = $routeParams.inventory_id || '';
      if(!start_){
        var page = $routeParams.page || 0;
        start_ = (parseInt(page) -1) * limit || 0;
        $scope.query_batch_no = batch;
        $scope.query_inventory_id = inventoryId;
      }
      var _params = {
        batch: batch,
        start:start_,
        limit:limit,
        inventory_id: inventoryId,
      };
      var _config = {params:_params};
      console.log(_config);
      BuyService.inventory.get(_config).then(function(data){
        $scope.object_list = data.data.object_list;
        var nextStart = data.data.next_start;
        var hasnext = data.data.more;
        var baseUrl = '#/shelves/';
        var searcharg = {limit:limit,batch: batch,inventory_id: inventoryId};
        //翻页
        Pnpaginator._init($scope, nextStart, limit, hasnext, baseUrl, searcharg);
        $('.pagecnt').css({"display":"inline-block"});
      });
    };

    // 监听地址栏地址变化
    $scope.$on('$routeUpdate', function(event, route) {
      var page = route.params.page || 0;
      var start = (parseInt(page) -1) * limit || 0;
      console.log(start);
      $scope.queryBatchNumber(start);
    });

    // 生成表格
    // function makeTable ( csv ) {
    //   var rows = csv.split('\n'),
    //       table = document.createElement('table'),
    //       tr = null, td = null,
    //       tds = null;
    //   for ( var i = 0; i<rows.length; i++ ) {
    //     tr = document.createElement('tr');
    //     tds = rows[i].split(',');
    //     for ( var j = 0; j < tds.length; j++ ) {
    //        td = document.createElement('td');
    //        td.innerHTML = tds[j];
    //        tr.appendChild(td);
    //     }
    //     table.appendChild(tr);
    //   }
    //   $('#pg-table').html(table);
    // }

    $("#csv-file").change(handleFileSelect);

    // function createInventory(){
    //   var data = lastCsvData.data[createCounter];
    //   createCounter++;

    //   $.ajax({
    //     url : "/napi/buy/inventory/create/",
    //     data : data,
    //     success : function(jsn,h){
    //       if (jsn.status ===1){
    //         createCounterSuccess ++;
    //       } else {
    //         var wrongmsg = data.message || '出错了，但是后端没有提示错误信息';
    //         SUGAR.PopOut.alert('<div class="prompt"><h3>'+wrongmsg+'</h3></div>');
    //         $({}).delay(2500).queue(function (){
    //           SUGAR.PopOut.closeMask();
    //         });
    //       }

    //       if (createCounter < createTotal) {
    //         createInventory();
    //       } else {
    //         alert('总共发送个数：'+createTotal+'，成功个数：'+createCounterSuccess);
    //       }
    //     }
    //   });

      // BuyService.inventory.create(data).then(function(data){
      //   createCounterSuccess ++;
      //   if (createCounterSuccess < createTotal) {
      //     createInventory();
      //   } else {
      //     alert('总共发送个数：'+createTotal+'，成功个数：'+createCounterSuccess);
      //   }
      // });
    // }

  }]);
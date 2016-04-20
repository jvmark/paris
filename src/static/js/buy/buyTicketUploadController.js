angular.module('buyTicketUploadController', [])
  .controller('buyTicketUploadCtrl', ['$scope', 'BuyService', '$routeParams','$location',
    function ($scope, BuyService, $routeParams,$location) {
      $scope.limit = 24;
      $scope.start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
      function init(){
        getHistory($scope.start);
      }
      init();
      function getHistory (start_) {
        BuyService.order.getHistory({
          'start': start_,
          'limit': $scope.limit,
        }).then(function(jsn_){
          $scope.history = jsn_.data;
          var next_start = jsn_.data.next_start;
          var total = jsn_.data.total;
          var baseurl = '#/ticket/upload/';
          var searcharg = {'limit': $scope.limit,};
          // 翻页
          Paginator._init($scope, next_start, $scope.limit, total, baseurl, searcharg);
        });
      }
      $scope.upload = function(fileId_) {
        var root = $scope.root;
        var file = $('#'+fileId_)[0].files[0];
        var formData = new FormData();
        formData.append("root", root);
        formData.append("local_file",file);
        var xhr = new XMLHttpRequest();
        //设置回调函数
        xhr.onreadystatechange = function(){
          if(xhr.readyState == 4 && xhr.status == 200){
            var _json = JSON.parse(xhr.responseText);
            if(_json.status == 1){
                alert("上传成功");
            }else{
                alert(_json.message);
            }
            location.reload();
          }
        }
        xhr.open("POST", "/napi/buyadmin/order/import/", true);
        // 发送表单数据
        xhr.send(formData);
      }
      $scope.$on("$routeUpdate", function(event, route) {
        var _limit = $scope.limit;
        var start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
        getHistory(start);
      });
}]);

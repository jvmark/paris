angular.module('buySPUListController', [])
.controller('SPUListCtrl', ['$scope','BuyService', '$routeParams','ngDialog',function ($scope, BuyService,$routeParams,ngDialog) {
	$scope.limit = 50;
  $scope.start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
  $scope.seleCategoryId = parseInt($routeParams.categoryid)?parseInt($routeParams.categoryid):'';
  $scope.getSpuList = function(start_){
  	BuyService.spu.getSpuList({
  		'start': start_,
      'limit': $scope.limit,
      'categoryid': $scope.seleCategoryId
  	}).then(function(jsn_){
      $scope.spuList = jsn_.data;
      var next_start = jsn_.data.next_start;
      var total = jsn_.data.total;
      var baseurl = '#/SPU/list/';
      var searcharg = {
        'limit': $scope.limit,
        'categoryid': $scope.seleCategoryId
      };
      // 翻页
      Paginator._init($scope, next_start, $scope.limit, total, baseurl, searcharg);
    });
  };

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
    };
    if(fileId_ === 'uploadNew'){
      xhr.open("POST", "/napi/buyadmin/spu/spu/batchcreate/", true);
    }else if(fileId_ === 'uploadModify'){
      xhr.open("POST", "/napi/buyadmin/spu/spu/batchedit/", true);
    }
    // 发送表单数据
    xhr.send(formData);
  };

  $scope.reloadCache = function(){
    BuyService.spu.reloadCache().then(function(jsn_){alert(JSON.stringify(jsn_));});
  };
  $scope.brandDialogLimit = 3;
  $scope.addBrandDialog = function () {
    if(--$scope.brandDialogLimit < 1) {
      //打开对话框
        ngDialog.open({
          template: 'addBrand',
          scope: $scope,
        });
    }
    else {
      //开始计算重置
      setTimeout(function() {
        $scope.brandDialogLimit = 3;
      }, 1000);
    }

  }
  $scope.addBrand = function (brandsStr_) {
    BuyService.spu.addBrand({'brands': brandsStr_}).then(function(jsn_){
      alert(JSON.stringify(jsn_));
      setTimeout(function  () {
        ngDialog.close();
      },1000);
    });
  }

  $scope.$on("$routeUpdate", function(event, route) {
    var _limit = $scope.limit;
    var start = (parseInt($routeParams.page) -1) * $scope.limit || 0;
    $scope.getSpuList(start);
  });
  function init(){
    getCategoryList();
    if($scope.seleCategoryId){
     	$scope.getSpuList($scope.start);
    }
  }
  init();
	function getCategoryList(){
  	BuyService.spu.getCategoryList().then(function(jsn){
      $scope.categoryList = jsn.data;
    });
  }

}]);
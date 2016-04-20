angular.module('buyCategoryController', [])
.controller('CategoryCtrl', ['$scope','BuyService',function ($scope,BuyService) {
  //初始化
  init();
  function init(){
    getCateList();
  }

  function getCateList(){
    BuyService.category.query().then(function(jsn){
      angular.forEach(jsn.data, function(val){
        if(val.properties.length>0){
          var propertiesStr='';
          angular.forEach(val.properties,function(elv){
            propertiesStr+=elv.value+',';
          });
          if(propertiesStr.length>1) propertiesStr=propertiesStr.substring(0,propertiesStr.length-1);
          val.propertiesStr=propertiesStr;
        }
      });
      $scope.cateList=jsn.data;
    });
  }
}]);
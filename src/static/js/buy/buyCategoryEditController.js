/**
 * 类目编辑
 * @description
 * @author  johnnyjiang
 * @createTime           2015-11-28T20:52:48+0800
 */
angular.module('buyCategoryEditController', [])
  .controller('CategoryEditCtrl', ['$scope', 'BuyService', '$timeout', '$routeParams', function($scope, BuyService, $timeout, $routeParams) {
    $scope.propertyids = []; //记录checkbox选项
    init();

    function init() {
      if ($routeParams.cate_id === '' || $routeParams.cate_id === undefined) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>类目id不能为空！</h3></div>');
        return;
      }
      var _pars = {
        params: {
          id: $routeParams.cate_id
        }
      };
      BuyService.attribute.query().then(function(jsn) {
        $scope.attrList = jsn.data;
        //获取属性列表
        BuyService.category.detail(_pars).then(function(msg) {
          $scope.cateDetail = msg.data;
          //对已经有的属性设置不能编辑
          if(msg.data.properties.length>0){
            angular.forEach(msg.data.properties,function(elv){
              $scope.propertyids.push(elv.key);  //记录下已有的属性
              angular.forEach($scope.attrList,function(el){
                if(elv.key===el.id){
                  el.isDisabled=true;
                  el.isChecked=true;
                }
              });
            });
          }
        });
      });
    }

    //点击添加
    $scope.changeAttrs = function(id, e) {
      var _ele = e.target;
      if (_ele.checked) {
        $scope.propertyids.push(parseInt(_ele.value));
      } else {
        var _index = $scope.propertyids.indexOf(id);
        if (_index !== -1) {
          $scope.propertyids.splice(_index, 1);
        }
      }
    };

    //保存选项
    $scope.saveCate = function() {
      var _pars = {
        categoryid: $routeParams.cate_id,
        propertyids: $scope.propertyids.join(',')
      };
      BuyService.category.update(_pars).then(function(jsn) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>保存成功！</h3></div>');
        $timeout(function() {
          window.location.href = '/buy/#/category/';
          SUGAR.PopOut.closeMask();
        }, 1000);
      });
    };
  }]);
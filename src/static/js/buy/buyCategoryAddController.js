/**
 * 类目添加
 * @description
 * @author  johnnyjiang
 * @createTime           2015-11-28T20:09:02+0800
 */
angular.module('buyCategoryAddController', [])
  .controller('CategoryAddCtrl', ['$scope', 'BuyService', '$timeout', function($scope, BuyService, $timeout) {
    var isPass = true; //全局判断类目类目是否唯一
    $scope.propertyids = []; //记录checkbox选项
    init();

    function init() {
      //获取属性列表
      BuyService.attribute.query().then(function(jsn) {
        $scope.attrList = jsn.data;
      });
    }

    //类目名称是否唯一
    $scope.checkName = function() {
      if($scope.cateName.length<2||$scope.cateName>10){
        SUGAR.PopOut.alert('<div class="prompt"><h3>类目名称2-10个字符内</h3></div>');
        return false;
      }
      var _pars = {
        params:{
          name: $scope.cateName
        }
      };
      BuyService.category.checkName(_pars).then(function(jsn) {
        if (jsn.data) {
          isPass = false;
          SUGAR.PopOut.alert('<div class="prompt"><h3>类目名称已存在！</h3></div>');
        } else {
          isPass = true;
        }
      });
    };

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
      if ($scope.propertyids.length < 1) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>至少选择一项属性！</h3></div>');
        return;
      }
      if ($scope.cateName === '' || $scope.cateName === undefined) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>类目名称不能为空！</h3></div>');
        return;
      }
      var _pars = {
        name: $scope.cateName,
        propertyids: $scope.propertyids.join(',')
      };
      BuyService.category.create(_pars).then(function(jsn) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>保存成功！</h3></div>');
        $timeout(function() {
          window.location.href = '/buy/#/category/';
          SUGAR.PopOut.closeMask();
        }, 1000);
      });
    };
  }]);
/**
 * 获取属性列表
 * @description
 * @author  johnnyjiang
 * @createTime           2015-11-28T15:33:19+0800
 */
angular.module('buyAttributeController', [])
  .controller('AttributeCtrl', ['$scope', 'BuyService', function($scope, BuyService) {

    //初始化
    init();

    function init() {
      getAttrList();
    }

    function getAttrList() {
      BuyService.attribute.query().then(function(jsn) {
        angular.forEach(jsn.data, function(da) {
          if (da.values.length > 0) {
            var valueStr = '';
            angular.forEach(da.values, function(elv) {
              valueStr += elv.value + ',';
            });
            if (valueStr.length > 1) valueStr = valueStr.substring(0, valueStr.length - 1);
            da.valueStr = valueStr;
          }
        });
        $scope.attrList = jsn.data;
      });
    }

    //验证类目是否存在
    $scope.hasClass = function() {
      if ($scope.attrName.length > 10 || $scope.attrName < 1) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>属性名在1-10个字符范围内！</h3></div>');
        $scope.attrName = $scope.attrName.substring(0, 10);
        return;
      }
    };

    //保存属性
    $scope.saveAttrs = function() {
      if ($scope.attrName !== '' && $scope.attrName !== undefined && $scope.attrValues !== '' && $scope.attrValues !== undefined) {
        //保存
        var _pars = {
          name: $scope.attrName,
          values: $scope.attrValues
        };
        BuyService.attribute.create(_pars).then(function(jsn) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>保存成功！</h3></div>');
          $scope.isExist = false;
          $scope.propertyId = '';
          $scope.attrName = '';
          $scope.attrValues = '';
          getAttrList();
        });
      } else {
        SUGAR.PopOut.alert('<div class="prompt"><h3>属性名或属性值不能为空！</h3></div>');
      }
    };

  }]);
/**
 * 获取属性列表
 * @description
 * @author  johnnyjiang
 * @createTime           2015-11-28T15:33:19+0800
 */
angular.module('buyAPISettingsController', [])
  .controller('APISettingsCtrl', ['$scope', 'BuyService', 'BaseService', '$location', function($scope, BuyService, BaseService, $location) {
    BaseService.get('/api/settings').then(function(result) {
      console.log(result);
      if (result.status == 1) {
        $scope.settings = result.data;
      }
    });

    $scope.updateSettings = function() {
      console.log($scope.settings);
      BaseService.post('/api/settings', {
        wwwAPI: $scope.settings.apiSettings.wwwAPI,
        buyAdminAPI: $scope.settings.apiSettings.buyAdminAPI
      }).then(function(data) {
        $location.path('/login/');
        // console.log(data);
      });
    }

    $scope.cancelUpdate = function() {
      $location.path('/login/');
    }
  }]);
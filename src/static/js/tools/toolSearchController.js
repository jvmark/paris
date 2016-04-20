/**
 * 属性
 * @description
 * @author lloydsheng
 */
angular.module('toolSearchController', [])
  .controller('SearchToolCtrl', ['$scope', 'BaseService', function($scope, BaseService) {

    $scope.site = 'xiaohongshunote';

    function search() {
      if ($scope.keyword) {
        if ($scope.pageData == null) {
          start = 0;
        } else {
          start = $scope.pageData.next_start;
        }
        console.log($scope.site);

        BaseService.get('/tool/search?kw=' + $scope.keyword + '&start=' + start + '&site=' + $scope.site).then(function(result) {
          $scope.loading = false;
          if (result.status == 1) {
            if ($scope.pageData == null) {
              $scope.pageData = result.data;
            } else {
              var pageData = $scope.pageData;
              pageData.object_list = pageData.object_list.concat(result.data.object_list);
              pageData.next_start = result.data.next_start;
              pageData.more = result.data.more;
              $scope.pageData = pageData;
            }
          }
        });
      }
    }

    $scope.itemClick = function(url) {
      window.open(url, '_blank');
    }

    $scope.searchClick = function() {
      $scope.pageData = null;
      search();
    }

    $scope.moreClick = function() {
      search();
    }

  }]);;
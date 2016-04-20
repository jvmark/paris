angular.module('buySidebarController', [])
  .controller('buySidebarCtrl', ['$scope', 'BuyService', '$routeParams',
    function($scope, BuyService, $routeParams) {
      $scope.sidebarData='';
      getSidebar();

      function getSidebar() {
        BuyService.sidebar.getSidebarList().then(function(jsn) {
          $scope.sidebarData = jsn.data;
        })
      };

    }
  ]);
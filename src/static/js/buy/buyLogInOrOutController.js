angular.module('buyLogInOrOutController', [])
  .controller('buyLogInOrOutCtrl', ['$scope', 'BuyService', '$routeParams', 'ngDialog',
    function($scope, BuyService, $routeParams, ngDialog) {
      
      $scope.username = window.localStorage.getItem('username') || '用户您好';
      

      if(window.localStorage.getItem('isLogin')){
        $scope.isLogin = true;
      }else{
        $scope.isLogin = false;
        var urlPrev1 = location.href.replace(/\//g, "%2F").split('#')[1];
        location.href='/#/login/?next='+urlPrev1;
      }
      $scope.logout = function(eitem) {
        if (window.confirm('确认退出吗？')) {
          window.localStorage.removeItem('isLogin');
          window.localStorage.removeItem('username');
          window.localStorage.removeItem('userid');
          var urlPrev = location.href.replace(/\//g, "%2F").split('#')[1];
          if(urlPrev.indexOf('login')<0){
            location.href='/#/login/?next='+urlPrev;
          }
        }
          
      };
      

    }
  ]);
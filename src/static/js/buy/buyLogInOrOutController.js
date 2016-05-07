angular.module('buyLogInOrOutController', [])
  .controller('buyLogInOrOutCtrl', ['$scope', 'BuyService', '$routeParams', 'ngDialog',
    function($scope, BuyService, $routeParams, ngDialog) {
      
      $scope.username = getCookie('username') || '用户您好';

      if(getCookie('isLogin')==1){
        $scope.isLogin = true;
      }else{
        $scope.isLogin = false;
        var urlPrev1 = location.href.replace(/\//g, "%2F").split('#')[1];
        location.href='/#/login/?next='+urlPrev1;
      }
      $scope.logout = function(eitem) {
        if (window.confirm('确认退出吗？')) {
          document.cookie="isLogin="+0;
          var urlPrev = location.href.replace(/\//g, "%2F").split('#')[1];
          if(urlPrev.indexOf('login')<0){
            location.href='/#/login/?next='+urlPrev;
          }
        }
          
      };

      $scope.loginbtn = function(eitem) {
        ngDialog.open({
          template: 'logintpl',
          scope: $scope,
          disableAnimation: true,
        });
      };
      $scope.login = function(eitem) {
        BuyService.logInOrOut.login({
          "username": eitem.login_name,
          "password": eitem.pswd
        }).then(function(jsn) {
          document.cookie="isLogin="+1;
          if (jsn.status === 1) {
            ngDialog.close();
            $scope.isLogin = true;
            $scope.username = jsn.data.user.username;
          }
        })
      };
      $scope.myKeyup = function(e, loginData) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
          $scope.login(loginData);
        }
      };
      function GetUrlRelativePath(){
        var url = document.location.toString();
        var arrUrl = url.split("//");

        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

        if(relUrl.indexOf("?") != -1){
          relUrl = relUrl.split("?")[0];
        }
        return relUrl;
      }
      function getCookie(name)
      {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
      else
      return null;
      }

    }
  ]);
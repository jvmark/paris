angular.module('buyLogInOrOutController', [])
  .controller('buyLogInOrOutCtrl', ['$scope', 'BuyService', '$routeParams', 'ngDialog',
    function($scope, BuyService, $routeParams, ngDialog) {
      isLoginOrNot();

      function isLoginOrNot() {
        BuyService.logInOrOut.judgeLogStatus().then(function(jsn) {
          if (jsn.status === 2) {
            $scope.isLogin = false;
            
            // var a = GetUrlRelativePath();
            // var c = a.split('#')[1];
            // if(a!='/#/login/'){
            //   location.href = '/#/login/?next='+c;
            // }
            
          } else if (jsn.status === 1) {
            $scope.isLogin = true;
            $scope.username = jsn.data.username;
          }
        })
      };
      $scope.logout = function(eitem) {
        if (window.confirm('确认退出吗？')) {
          $scope.isLogin = false;
          BuyService.logInOrOut.logout().then(function(jsn) {
            var urlPrev = location.href.replace(/\//g, "%2F").split('#')[1];
            if(urlPrev.indexOf('login')<0){
              location.href='/#/login/?next='+urlPrev;
            }
            
          })
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
          "login_name": eitem.login_name,
          "pswd": eitem.pswd
        }).then(function(jsn) {
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

    }
  ]);
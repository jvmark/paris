angular.module('buyLoginController', [])
  .controller('buyLoginPageCtrl', ['$scope', 'BuyService', '$routeParams', 'ngDialog',
    function($scope, BuyService, $routeParams, ngDialog) {
      $scope.login = function(eitem) {
        if (eitem.login_name && eitem.pswd) {
          BuyService.logInOrOut.login({
            "username": eitem.login_name,
            "password": eitem.pswd,
            "type": eitem.type
          }).then(function(jsn) {
            window.localStorage.setItem('isLogin',true);
            window.localStorage.setItem('username',eitem.login_name);
            window.localStorage.setItem('userid',jsn.data);
            var usertype = '';
            if(eitem.type === '0'){
              usertype = '管理员';
            }else if(eitem.type === '1'){
              usertype = '学生';
            }else if(eitem.type === '2'){
              usertype = '企业';
            }
            window.localStorage.setItem('usertype',usertype);
            
            var nextUrl = GetRequest().next || 'order';
            location.href = '/#' + nextUrl;
          })
        }

      }

      function GetRequest() {
        var theRequest = new Object();
        var url = location.href;
        if (url.indexOf("?") != -1) {
          var str = url.split('?')[1];
          strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        return theRequest;
      }
    }
  ]);
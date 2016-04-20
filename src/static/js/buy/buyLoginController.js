angular.module('buyLoginController', [])
  .controller('buyLoginPageCtrl', ['$scope', 'BuyService', '$routeParams', 'ngDialog',
    function($scope, BuyService, $routeParams, ngDialog) {
      $scope.login = function(eitem) {
        if (eitem.login_name && eitem.pswd) {
          BuyService.logInOrOut.login({
            "login_name": eitem.login_name,
            "pswd": eitem.pswd
          }).then(function(jsn) {
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
/**
 * [DtApp description]
 * @type {[type]}
 */
var DtApp=angular.module('DtApp', ['baseService','ngRoute','DtUpload','baseDirective','jsonTreeDirective','ngConfirmClickDirective']);

DtApp.config(['$compileProvider', '$routeProvider', '$locationProvider',
  function($compileProvider, $routeProvider, $locationProvider) {
    $routeProvider
      .when('/:id/', {
        templateUrl: '/static/angular/js/components/components-list.html',
        controller: 'componentsCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/1/'
      });
  }
]);

/**
 * 组件列表
 * @description
 * @author               johnnyjiang
 * @email                johnnyjiang813@gmail.com
 * @createTime           2016-01-28T11:04:55+0800
 */
DtApp.controller('componentsCtrl', ['$scope','$routeParams',function ($scope,$routeParams) {
  //图片绑定
  $scope.imgSrcModel='';
  $scope.imgSrcModel1='';
  //数字限制
  $scope.numberModel='1.1111111111111111';
   $scope.jsonStr='{"a":1,"b":2}';


   var index=$routeParams.id;
   angular.element('#da-content-area .da-panel').eq(Number(index-1)).show().siblings('div').hide();
}]);
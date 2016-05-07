angular.module('huginApp', [
    'ngRoute',
    'ngDialog',
    'ngCookies',
    'baseService',
    'buyService',
    'baseFilter',
    'transImgFilter',
    'baseDirective',
    'imageUploadDirective',
    'visualImgDirective',
    'ui.sortable',
    'csvToJsonDirective',
    'buyLogInOrOutController',
    'buySidebarController',
    'buyLoginController',
    'buyWelcomeController',
    'buyAPISettingsController',
    'myChangeStuInfoController',
    'myChangeComInfoController',
    'myAddJobInfoController',
    'myAddStuInfoController',
    'myStuInfoQueryController',
    'myAddComInfoController',
    'myComInfoQueryController',
    'myJobInfoQueryController',
    'myJobInfoListController'
  ], function($httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var param = function(obj) {
      var query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

  })
  .config(['$compileProvider', '$routeProvider', '$locationProvider',
    function($compileProvider, $routeProvider, $locationProvider) {
      $routeProvider
      //登录
      .when('/login/', {
        templateUrl: '/static/js/buy/buy_login.html',
        controller: 'buyLoginPageCtrl'
      })
      .when('/welcome/', {
        templateUrl: '/static/js/buy/buy_welcome.html',
        controller: 'BuyWelcomeCtrl'
      })
      .when('/settings/api/', {
        templateUrl: '/static/js/buy/api_settings.html',
        controller: 'APISettingsCtrl'
      })
      //登录
      .when('/changeStuInfo/', {
        templateUrl: '/static/js/buy/my_change_stu_info.html',
        controller: 'changeStuInfoPageCtrl'
      })
      //登录
      .when('/changeComInfo/', {
        templateUrl: '/static/js/buy/my_change_com_info.html',
        controller: 'changeComInfoPageCtrl'
      })
      //登录
      .when('/addJobInfo/', {
        templateUrl: '/static/js/buy/my_add_job_info.html',
        controller: 'addJobInfoPageCtrl'
      })
      //登录
      .when('/addStuInfo/', {
        templateUrl: '/static/js/buy/my_add_stu_info.html',
        controller: 'addStuInfoPageCtrl'
      })
      //登录
      .when('/stuInfoQuery/', {
        templateUrl: '/static/js/buy/my_stu_info_query.html',
        controller: 'stuInfoQueryPageCtrl'
      })
      //登录
      .when('/addComInfo/', {
        templateUrl: '/static/js/buy/my_add_com_info.html',
        controller: 'addComInfoPageCtrl'
      })
      //登录
      .when('/comInfoQuery/', {
        templateUrl: '/static/js/buy/my_com_info_query.html',
        controller: 'comInfoQueryPageCtrl'
      })
      //登录
      .when('/jobInfoQuery/', {
        templateUrl: '/static/js/buy/my_job_info_query.html',
        controller: 'jobInfoQueryPageCtrl'
      })
      //登录
      .when('/jobInfoList/', {
        templateUrl: '/static/js/buy/my_job_info_list.html',
        controller: 'jobInfoListPageCtrl'
      })
      

      //重定向到订单管理
      .otherwise({
        redirectTo: '/welcome/'
      });
    }
  ]);
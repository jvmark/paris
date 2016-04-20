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
    'buyOrderController',
    'buyOrderDetailController',
    'buyReturnOrderController',
    'shelvesController',
    'buyShelvesEditController',
    'buyReturnDetailController',
    'buyReturnAddController',
    'buySupplierController',
    'buySupplierCreateController',
    'buySupplierUpdateController',
    'buyPromotionController',
    'buyPromotionUpdateController',
    'buyOrderPayOrdersController',
    'buyCouponCreateController',
    'buyCouponSendController',
    'buySettleController',
    'buySettleDownloadController',
    'buyAttributeController',
    'buyCategoryController',
    'buyCategoryAddController',
    'buyCategoryEditController',
    'buySPUListController',
    'buySPUAddController',
    'buySPUEditController',
    'buyTicketUploadController',
    'buySPUBrandAddController',
    'buyBarcodeController',
    'toolSearchController',
    'buyWelcomeController',
    'buyAPISettingsController'
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
          controller: 'buyLoginPageCtrl',
          reloadOnSearch: false
        })
        //订单管理
        .when('/order/', {
          templateUrl: '/static/js/buy/buy_order.html',
          controller: 'buyOrderPageCtrl',
          reloadOnSearch: false
        })
        //订单详情
        .when('/order/detail', {
          templateUrl: '/static/js/buy/buy_order_detail.html',
          controller: 'buyOrderDetailCtrl',
          // reloadOnSearch: false
        })
        //发货表下载
        .when('/order/payorders', {
          templateUrl: '/static/js/buy/buy_order_payorders.html',
          controller: 'buyOrderPayOrdersCtrl',
          // reloadOnSearch: false
        })

      //退单管理
      .when('/return/', {
        templateUrl: '/static/js/buy/buy_return.html',
        controller: 'returnOrderPageCtrl',
        reloadOnSearch: false
      })

      //新增退货单
      .when('/return/add', {
        templateUrl: '/static/js/buy/buy_return_add.html',
        controller: 'returnOrderAddCtrl',
        reloadOnSearch: false
      })

      //退单详情
      .when('/return/detail', {
          templateUrl: '/static/js/buy/buy_return_detail.html',
          controller: 'returnOrderDetailCtrl',
          reloadOnSearch: false
        })
        //上下架管理
        .when('/shelves/', {
          templateUrl: '/static/js/buy/buy_shelves.html',
          controller: 'shelvesCtrl',
          reloadOnSearch: false
        })
        //上下架管理编辑
        .when('/shelves/edit/', {
          templateUrl: '/static/js/buy/buy_shelves_edit.html',
          controller: 'buyShelvesEditController',
          reloadOnSearch: false
        })
        //供应商管理
        .when('/supplier/', {
          templateUrl: '/static/js/buy/buy_supplier.html',
          controller: 'buySupplierCtrl',
          reloadOnSearch: false
        })
        .when('/supplier/create/', {
          templateUrl: '/static/js/buy/buy_supplier_create.html',
          controller: 'buySupplierCreateCtrl',
          reloadOnSearch: false
        })
        .when('/supplier/update/', {
          templateUrl: '/static/js/buy/buy_supplier_update.html',
          controller: 'buySupplierUpdateCtrl',
          reloadOnSearch: false
        })
        //营销活动管理
        .when('/promotion/', {
          templateUrl: '/static/js/buy/buy_promotion.html',
          controller: 'buyPromotionCtrl'
        })
        //生成优惠券
        .when('/coupon/create', {
          templateUrl: '/static/js/buy/buy_coupon_create.html',
          controller: 'buyCouponCreateCtrl'
        })
        //发放优惠券
        .when('/coupon/send', {
          templateUrl: '/static/js/buy/buy_coupon_send.html',
          controller: 'buyCouponSendCtrl',
          reloadOnSearch: false
        })
        .when('/promotion/update/', {
          templateUrl: '/static/js/buy/buy_promotion_update.html',
          controller: 'buyPromotionUpdateCtrl'
        })
        //结算单管理
        .when('/settle/', {
          templateUrl: '/static/js/buy/buy_settle.html',
          controller: 'buySettleCtrl',
          reloadOnSearch: false
        })
        //结算单下载
        .when('/settle/download/', {
          templateUrl: '/static/js/buy/buy_settle_download.html',
          controller: 'buySettleDownloadCtrl'
        })
        //属性新增查询
        .when('/attribute/', {
          templateUrl: '/static/js/buy/buy_attribute.html',
          controller: 'AttributeCtrl'
        })
        // //类目管理
        .when('/category/', {
          templateUrl: '/static/js/buy/buy_category.html',
          controller: 'CategoryCtrl'
        })
        .when('/category/add/', {
          templateUrl: '/static/js/buy/buy_category_add.html',
          controller: 'CategoryAddCtrl'
        })
        .when('/category/edit/', {
          templateUrl: '/static/js/buy/buy_category_edit.html',
          controller: 'CategoryEditCtrl'
        })
        //spu
        .when('/SPU/list/', {
          templateUrl: '/static/js/buy/buy_spu_list.html',
          controller: 'SPUListCtrl',
          reloadOnSearch: false
        })
        .when('/SPU/add/', {
          templateUrl: '/static/js/buy/buy_spu_add.html',
          controller: 'SPUAddCtrl'
        })
        .when('/SPU/edit/', {
          templateUrl: '/static/js/buy/buy_spu_edit.html',
          controller: 'SPUEditCtrl',
          reloadOnSearch: false
        })
        .when('/ticket/upload/', {
          templateUrl: '/static/js/buy/buy_ticket_upload.html',
          controller: 'buyTicketUploadCtrl',
          reloadOnSearch: false
        })
        .when('/SPUBRAND/add/', {
          templateUrl: '/static/js/buy/buy_spubrand_add.html',
          controller: 'buySpuBrandAddCtrl',
          reloadOnSearch: false
        })
        .when('/barcode/', {
          templateUrl: '/static/js/buy/buy_barcode.html',
          controller: 'BarcodeCtrl',
          reloadOnSearch: false
        })
        .when('/tools/search/', {
          templateUrl: '/static/js/tools/tool_search.html',
          controller: 'SearchToolCtrl',
          reloadOnSearch: false
        })
        .when('/welcome/', {
          templateUrl: '/static/js/buy/buy_welcome.html',
          controller: 'BuyWelcomeCtrl',
          reloadOnSearch: false
        })
        .when('/settings/api/', {
          templateUrl: '/static/js/buy/api_settings.html',
          controller: 'APISettingsCtrl',
          reloadOnSearch: false
        })
        //重定向到订单管理
        .otherwise({
          redirectTo: '/welcome/'
        });
    }
  ]);
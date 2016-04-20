angular.module('buyService', [])
  .factory('BuyService', function(BaseService) {
    var service = {
      sidebar: {
        getSidebarList: function(params_) {
          return BaseService.get('/api/navigations/', {params: params_}).then(function(data_) {
            return data_;
          });
        }
      },
      logInOrOut: {
        judgeLogStatus: function(params_) {
          return BaseService.get('/napi/people/profile/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        logout: function(params_) {
          return BaseService.post('/napi/logout/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        login: function(params_) {
          return BaseService.post('/napi/login/', params_).then(function(data_) {
            return data_;
          });
        },
      },
      order: {
        export: function(params_) {
          return BaseService.get('/napi/buyadmin/order/export/', params_).then(function(data_) {
            return data_;
          });
        },
        import: function(params_) {
          return BaseService.post('/napi/buyadmin/order/import/', params_).then(function(data_) {
            return data_;
          });
        },
        exportTrade: function(params_) {
          return BaseService.get('/napi/buyadmin/order/export/payorder/', params_).then(function(data_) {
            return data_;
          });
        },
        getCount: function(params_) {
          return BaseService.get('/napi/buyadmin/order/count/', params_).then(function(data_) {
            return data_;
          });
        },
        getHistory: function(params_) {
          return BaseService.get('/napi/buyadmin/order/history/',  {params: params_}).then(function(data_) {
            return data_;
          });
        },
      },
      // 特殊注明 通过buy_admin系统返回的接口
      inventory: {
        get: function(params_) {
          return BaseService.get('/napi/buyadmin/inventory/list/', params_).then(function(data_) {
            return data_;
          });
        },
        create: function(params_) {
          return BaseService.post('/napi/buy/inventory/create/', params_).then(function(data_) {
            return data_;
          });
        },
        import: function(params_) {
          return BaseService.post('/napi/buyadmin/inventory/import/', params_).then(function(data_) {
            return data_;
          });
        },
        edit: function(params_) {
          return BaseService.post('/napi/buyadmin/inventory/edit/', params_).then(function(data_) {
            return data_;
          });
        },
        modify: function(params_){
          return BaseService.post('/napi/buyadmin/inventory/modify/', params_).then(function(data_) {
            return data_;
          });
        }
      },
      supplier: {
        query: function(params_) {
          return BaseService.get('/napi/buyadmin/supplier/query/', {params:params_}).then(function(data_) {
            return data_;
          });
        },
        queryByName: function(params_) {
          return BaseService.get('/napi/buyadmin/supplier/query_all/', {params:params_}).then(function(data_) {
            return data_;
          });
        },
        import: function(params_) {
          return BaseService.post('/napi/buyadmin/supplier/import/', params_).then(function(data_) {
            return data_;
          });
        },
        create: function(params_) {
          return BaseService.post('/napi/buyadmin/supplier/create/', params_).then(function(data_) {
            return data_;
          });
        },
         update: function(params_) {
          return BaseService.post('/napi/buyadmin/supplier/update/', params_).then(function(data_) {
            return data_;
          });
        },
      },
      promotion: {
        query: function(config) {
          return BaseService.get('/napi/buyadmin/promotion/query/', config).then(function(data_) {
            return data_;
          });
        },
        create: function(params_) {
          return BaseService.post('/napi/buyadmin/promotion/create/', params_).then(function(data_) {
            return data_;
          });
        },
        update: function(params_) {
          return BaseService.post('/napi/buyadmin/promotion/update/', params_).then(function(data_) {
            return data_;
          });
        },

      },
      promotionUpdate: {
        item : {},
        update : function(params_){
          return BaseService.post('/napi/buyadmin/promotion/update/', params_).then(function(data_) {
            return data_;
          });
        },
        create : function(params_){
          return BaseService.post('/napi/buyadmin/promotion/create/', params_).then(function(data_) {
            return data_;
          });
        },
        getPromotionPreview: function(params_) {
          return BaseService.post('/napi/buyadmin/promotion/preview/', params_).then(function(data_) {
            return data_;
          });
        },
      },
      caculate: {
        query : function(params_){
          return BaseService.get('/napi/buyadmin/order/return/fee/',params_).then(function(data_) {
            return data_;
          });
        }
      },
      orderDetail :{
        query : function(params_){
          return BaseService.get('/napi/buyadmin/order/detail/',params_).then(function(data_) {
            return data_;
          });
        }
      },
      payOrders :{
        list : function(params_){
          return BaseService.get('/napi/buyadmin/order/todeliver/pkglist/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
      },
      orderReturn:{
        query:function(params_){
          return BaseService.get('/napi/buyadmin/refund/order/query/',params_).then(function(data_) {
            return data_;
          });
        },
        queryDetail:function(params_){
          return BaseService.get('/napi/buyadmin/refund/order/detail/',params_).then(function(data_) {
            return data_;
          });
        },
        update:function(params_){
          return BaseService.post('/napi/buyadmin/refund/order/update/',params_).then(function(data_) {
            return data_;
          });
        },
        create:function(params_){
          return BaseService.post('/napi/buyadmin/refund/order/create/',params_).then(function(data_) {
            return data_;
          });
        },
        create1:function(params_){
          return BaseService.post(' /napi/buyadmin/refund/order/moneyback/',params_).then(function(data_) {
            return data_;
          });
        }
      },
      coupon: {
        list: function() {
          return BaseService.get('/napi/buyadmin/couponTemplate/list/').then(function(data_) {
            return data_;
          });
        },
        create : function(params_){
          return BaseService.post('/napi/buyadmin/couponTemplate/import/', params_).then(function(data_) {
            return data_;
          });
        },
        checkCoupon: function(params_) {
          return BaseService.get('/napi/buyadmin/couponTemplate/check/',{params: params_}).then(function(data_) {
            return data_;
          });
        },
        checkUser: function(params_) {
          return BaseService.get('/napi/buyadmin/couponTemplate/checkUser/',{params: params_}).then(function(data_) {
            return data_;
          });
        },
        sendCoupon : function(params_){
          return BaseService.post('/napi/buyadmin/couponTemplate/grant/', params_).then(function(data_) {
            return data_;
          });
        },
        sendCouponHistory: function(params_) {
          return BaseService.get('/napi/buyadmin/couponTemplate/history/',{params: params_}).then(function(data_) {
            return data_;
          });
        },

      },
      settle: {
        pkglist: function() {
          return BaseService.get('/napi/buyadmin/settle/order/pkglist/').then(function(data_) {
            return data_;
          });
        },
        suppliersDownload: function(params_) {
          return BaseService.get('/napi/buyadmin/settle/order/suppliers/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        accountantsDownload: function(params_) {
          return BaseService.get('/napi/buyadmin/settle/order/accountants/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        settleList: function(params_) {
          return BaseService.get('/napi/buyadmin/settle/order/list/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        settleUpdate : function(params_){
          return BaseService.post('/napi/buyadmin/settle/order/update/', params_).then(function(data_) {
            return data_;
          });
        },

      },
      //属性管理
      attribute:{
        query:function(params_){
          return BaseService.get('/napi/buyadmin/spu/properties/list/', params_).then(function(data_) {
            return data_;
          });
        },
        create:function(params_){
          return BaseService.post('/napi/buyadmin/spu/properties/createkv/', params_).then(function(data_) {
            return data_;
          });
        },
        createById:function(params_){
          return BaseService.post('/napi/buyadmin/spu/properties/addvalue/', params_).then(function(data_) {
            return data_;
          });
        }
      },
      //类目标
      category:{
        query:function(){
          return BaseService.get('/napi/buyadmin/spu/category/list/').then(function(data_) {
            return data_;
          });
        },
        detail:function(params_){
          return BaseService.get('/napi/buyadmin/spu/category/info/',params_).then(function(data_){
            return data_;
          });
        },
        checkName:function(params_){
          return BaseService.get('/napi/buyadmin/spu/category/checkname/',params_).then(function(data_) {
            return data_;
          });
        },
        create:function(params_){
          return BaseService.post('/napi/buyadmin/spu/category/create/',params_).then(function(data_) {
            return data_;
          });
        },
        update:function(params_){
          return BaseService.post('/napi/buyadmin/spu/category/update/',params_).then(function(data_) {
            return data_;
          });
        }
      },
      spu:{
        getCategoryList:function(){
          return BaseService.get('/napi/buyadmin/spu/category/list/').then(function(data_) {
            return data_;
          });
        },
        getPropertiesList:function(params_){
          return BaseService.get('/napi/buyadmin/spu/category/info/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getPropertiesInfo:function(params_){
          return BaseService.get('/napi/buyadmin/spu/properties/info/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getBrands:function(){
          return BaseService.get(' /napi/buyadmin/spu/brand/names/').then(function(data_) {
            return data_;
          });
        },
        createSpu:function(params_){
          return BaseService.post('/napi/buyadmin/spu/spu/create/',params_).then(function(data_) {
            return data_;
          });
        },
        getSpuList:function(params_){
          return BaseService.get('/napi/buyadmin/spu/spu/list/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getSpuInfo:function(params_){
          return BaseService.get('/napi/buyadmin/spu/spu/info/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        updateSpu:function(params_){
          return BaseService.post('/napi/buyadmin/spu/spu/update/', params_).then(function(data_) {
            return data_;
          });
        },
        reloadCache: function(){
          return BaseService.get('/napi/buyadmin/spu/spu/reloadCache/').then(function(data_) {
            return data_;
          });
        },
        addBrand: function(params_){
          return BaseService.post('/napi/buyadmin/spu/brand/import/', params_).then(function(data_) {
            return data_;
          });
        },

      },
      spubrand:{
        createSpuBrand: function(params_){
          return BaseService.post('/napi/buyadmin/spu/brand/create/', params_).then(function(data_){
            return data_;
          });
        },
        updateSpuBrand: function(params_){
          return BaseService.post('/napi/buyadmin/spu/brand/update/', params_).then(function(data_){
            return data_;
          });
        },
        loadById: function(params_){
          return BaseService.get('/napi/buyadmin/spu/brand/loadById/', {params: params_}).then(function(data_){
            return data_;
          });
        },
        prefixQuery: function(params_){
          return BaseService.get('/napi/buyadmin/spu/brand/prefix_query/', {params: params_}).then(function(data_){
            return data_;
          });
        },
        getBrandList: function(params_){
          return BaseService.get('/napi/buyadmin/spu/brand/list/', {params: params_}).then(function(data_){
            return data_;
          });
        },
      }
    };
    return service;
  });












angular.module('buyPromotionController', [])
  .controller('buyPromotionCtrl', ['$scope', 'BuyService', '$location',
    function($scope, BuyService, $location) {
      var search = $location.search();
      var seller_name = $scope.seller_name = search.seller_name || '';
      var output_type = $scope.output_type = search.output_type || '';
      var promotion_type = $scope.promotion_type = search.promotion_type || '';
      var limit = $scope.limit = search.limit || 24;
      var page = search.page || 1;
      var start = (parseInt(page) -1) * limit || 0;
      $scope.promotionTypes = [
        {value: '', text: '所有'},
        {value: '1', text: '限时折扣'},
        {value: '0', text: '商家满减'},
      ];
      $scope.outputTypes = [
        {value: '', text: '所有'},
        {value: '0', text: '优惠金额'},
        {value: '1', text: '附赠商品'},
        {value: '2', text: '附赠代金券'},
        {value: '3', text: '优惠折扣'},
      ];

      $scope.promotion_detail = false;

      function freshenPage() {
        var params = {
          seller_name: seller_name,
          output_type: output_type,
          promotion_type: promotion_type,
          start: start,
          limit: limit
        }
        var config = {
          params: params
        }
        BuyService.promotion.query(config).then(function(result) {
          $scope.data = result.data;
          var nextStart = $scope.data.next_start;
          var hasnext = $scope.data.more;
          var baseUrl = '#/promotion/';
          var searcharg = {limit:limit,seller_name: seller_name,output_type:output_type,promotion_type:promotion_type};
          //翻页
          Pnpaginator._init($scope, nextStart, limit, hasnext, baseUrl, searcharg);
          $('.pagecnt').css({"display":"inline-block"});
        })
      }

      freshenPage();

      $scope.query = function() {
        $location.search('seller_name', $scope.seller_name);
        $location.search('output_type', $scope.output_type);
        $location.search('promotion_type', $scope.promotion_type);
        $location.search('limit', $scope.limit);
        $location.search('start', $scope.start);
      }

      $scope.closeDetail = function() {
        $scope.promotion_detail = false;
      }

      $scope.getDetail = function() {
        $scope.promotion_detail = true;
        var output_type = this.item.output_type;
        var promotion_type = this.item.promotion_type;
        var output_text;
        var promotion_text;
        angular.forEach($scope.outputTypes, function(k, i) {
            if($scope.outputTypes[i].value === output_type.toString()){
              output_text = $scope.outputTypes[i].text ;
            }
        });
        angular.forEach($scope.promotionTypes, function(k, i) {
            if($scope.promotionTypes[i].value === promotion_type.toString()){
              promotion_text = $scope.promotionTypes[i].text ;
            }
        });
        $scope.detail = {
          id: this.item.id,
          tag_name: this.item.tag_name,
          seller_id: this.item.seller_id,
          seller_name: this.item.seller_name,
          target_type: this.item.target_type,
          promotion_type: promotion_text,
          output_text: output_text,
          rules: this.item.rules,
          inventory_id: this.item.inventory_id,
          promotion_start_at: this.item.promotion_start_at,
          promotion_end_at: this.item.promotion_end_at,
          full_desc: this.item.full_desc
        }
      }

      $scope.create = function(){
        window.open('#/promotion/update/');
      }

      $scope.update = function() {
        BuyService.promotionUpdate.item = this.item;
      }
    }
  ]);

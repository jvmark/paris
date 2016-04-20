angular.module('buyPromotionUpdateController', [])
  .controller('buyPromotionUpdateCtrl', ['$scope', 'BuyService', '$location',
    function($scope, BuyService, $location) {
      $scope.isUpdate = false;
      var search = $location.search();
      $scope.promotionTypes = [
        {value: 0, text: '商家满减'},
        {value: 1, text: '限时折扣'},
      ];
      $scope.outputTypes = [
        {value: 0, text: '优惠金额'},
        {value: 1, text: '附赠商品'},
        {value: 2, text: '附赠代金券'},
        {value: 3, text: '优惠折扣'},
      ];
      $scope.item = {};
      $scope.item.rules = [
        ['']
      ];
      $scope.item.promotion_type = $scope.promotionTypes[1].value;
      $scope.item.target_type = 0;
      $scope.item.output_type = 0;
      if (search.update) {
        $scope.isUpdate = true;
        $scope.item = BuyService.promotionUpdate.item;
        if($scope.item.rules){
          var rulesArr = $scope.item.rules.split(';');
          var rules = new Array(rulesArr.length);
          for (var i = 0; i < rulesArr.length; i++) {
            rules[i] = rulesArr[i].split('|');
          }
          $scope.item.rules = rules;
        }
        if($scope.item.status){
          $scope.item.status = true;
        }else{
          $scope.item.status = false;
        }
      }

      $('#timestamp1,#timestamp2').datetimepicker({
        timeFormat: "hh:mm:ss",
                dateFormat: "yy-mm-dd"
      });

      $scope.addRule = function() {
        var arr = new Array(1);
        $scope.item.rules.push(arr);
      }

      //新建时默认有两条rule
      // if(!search.update){
      //   $scope.addRule();
      // }

      $scope.removeRule = function() {
        $scope.item.rules.splice(this.$index, 1);
      }

      $scope.countSale = function(){
        var params = {
          promotion_type: $scope.item.promotion_type,
          seller_id: $scope.item.seller_id,
          tag_name: $scope.item.tag_name,
          seller_name: $scope.item.seller_name,
          target_type: $scope.item.target_type,
          output_type: $scope.item.output_type,
          rules: $scope.item.rules.join(';'),
          inventory_id: $scope.item.inventory_id,
          promotion_start_at: $scope.item.promotion_start_at,
          promotion_end_at: $scope.item.promotion_end_at,
          full_desc: $scope.item.full_desc,
        }
        BuyService.promotionUpdate.getPromotionPreview(params).then(function(result){
          $scope.goods = result.data;
        });
      }

      $scope.update = function() {
        var rules = $scope.item.rules;
        var newRule = new Array(rules.length)
        for (var i = 0; i < rules.length; i++) {
          if($scope.item.promotion_type === 0){
            if (!(rules[i][0] && rules[i][1] && rules[i][3])) {
              alert('第' + (i + 1) + '条规则有问题，条件、减去金额、购物车页文案是必需的。');
              return;
            }
          }
        }
        for (var i = 0; i < rules.length; i++) {
          newRule[i] = rules[i].join('|');
        }
        newRule = newRule.join(';');

        if (search.update) {
          var params = {
            id: $scope.item.id,
            promotion_type: $scope.item.promotion_type,
            status: $scope.item.status?1:0,
            tag_name: $scope.item.tag_name,
            seller_id: $scope.item.seller_id,
            seller_name: $scope.item.seller_name,
            target_type: $scope.item.target_type,
            output_type: $scope.item.output_type,
            rules: newRule,
            inventory_id: $scope.item.inventory_id,
            promotion_start_at: $scope.item.promotion_start_at,
            promotion_end_at: $scope.item.promotion_end_at,
            full_desc: $scope.item.full_desc,
          }
          BuyService.promotionUpdate.update(params).then(function(result){
            if(result.status === 1){
              alert('操作成功');
            }
          });
        } else {
          var params = {
            promotion_type: $scope.item.promotion_type,
            status: $scope.item.status?1:0,
            seller_id: $scope.item.seller_id,
            tag_name: $scope.item.tag_name,
            seller_name: $scope.item.seller_name,
            target_type: $scope.item.target_type,
            output_type: $scope.item.output_type,
            rules: newRule,
            inventory_id: $scope.item.inventory_id,
            promotion_start_at: $scope.item.promotion_start_at,
            promotion_end_at: $scope.item.promotion_end_at,
            full_desc: $scope.item.full_desc,
          }
          BuyService.promotionUpdate.create(params).then(function(result){
            if(result.status === 1){
              alert('操作成功');
            }
          });
        }
      }

    }
  ]);

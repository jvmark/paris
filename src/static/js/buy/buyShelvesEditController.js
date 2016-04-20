angular.module('buyShelvesEditController', [])
  .controller('buyShelvesEditController', ['$scope', 'BuyService', '$routeParams', '$location',
    function($scope, BuyService, $routeParams, $location) {
      function init() {
        var inventoryId = $routeParams.id || '';
        $scope.media_id = '';
        $scope.media_type = 'photo';
        $scope.photo_link = '';
        var _params = {
          inventory_id: inventoryId,
        };
        BuyService.inventory.get({
          params: _params
        }).then(function(data_) {
          $scope.inventory = data_.data.object_list[0];
          if (!$scope.inventory.pictures) {
            $scope.inventory.pictures = '';
          }
          if($scope.inventory.market_price === 0){
            $scope.inventory.market_price = '';
          }
          if ($scope.inventory.spu_id) {
            $scope.inventory.disabledSpuId = true;
          } else {
            $scope.inventory.disabledSpuId = false;
          }
          $scope.inventory.pictures = $scope.inventory.pictures.split(';');
          $scope.inventory.picturesObj = [];
          angular.forEach($scope.inventory.pictures, function(k, v) {
            $scope.inventory.pictures[v] = $scope.inventory.pictures[v].trim();
            $scope.inventory.picturesObj.push({
              'img': $scope.inventory.pictures[v]
            });
          });
          if (!$scope.inventory.detail_desc_pics) {
            $scope.inventory.detail_desc_pics = '';
          }
          $scope.inventory.detail_desc_pics = $scope.inventory.detail_desc_pics.split(';');
          $scope.inventory.detailPicturesObj = [];

          angular.forEach($scope.inventory.detail_desc_pics, function(k, v) {
            $scope.inventory.detail_desc_pics[v] = $scope.inventory.detail_desc_pics[v].trim();
            $scope.inventory.detailPicturesObj.push({
              'img': $scope.inventory.detail_desc_pics[v]
            });
          });
        });
      }
      init();
      $('#onlineTime,#offlineTime').datetimepicker({
        timeFormat: "hh:mm:ss",
        dateFormat: "yy-mm-dd"
      });
      $scope.setShelves = function() {
        if ($scope.inventory.inventory_status == 1) {
          if (!window.confirm('确认要上架该商品吗？')) {
            return;
          }
          $scope.inventory.inventory_status = 0;
        } else {
          if (!window.confirm('确认要下架该商品吗？')) {
            return;
          }
          $scope.inventory.inventory_status = 1;
        }
        var _params = {
          "inventory_id": $scope.inventory.id,
          "inventory_status": $scope.inventory.inventory_status,
        };
        BuyService.inventory.modify(_params).then(function(data) {
          alert('保存成功');
        });
      }
      $scope.saveInfo = function() {
        $scope.inventory.pictures = '';
        angular.forEach($scope.inventory.picturesObj, function(k, v) {
          if ($scope.inventory.picturesObj[v].img) {
            $scope.inventory.pictures = $scope.inventory.pictures.trim() + ';' + $scope.inventory.picturesObj[v].img;
          }
        });
        $scope.inventory.pictures = $scope.inventory.pictures.substring(1, $scope.inventory.pictures.length);
        var _params = {
          "inventory_id": $scope.inventory.id,
          "market_price": $scope.inventory.market_price,
          "inventory_caption": $scope.inventory.inventory_caption,
          "inventory_name": $scope.inventory.inventory_name,
          "inventory_desc": $scope.inventory.inventory_desc,
          "inventory_cat": $scope.inventory.inventory_cat,
          "agreement": $scope.inventory.agreement,
          "pictures": $scope.inventory.pictures,
          "overseas_intro": $scope.inventory.overseas_intro,
        };
        BuyService.inventory.modify(_params).then(function(data) {
          alert('保存成功');
        });
      }
      $scope.saveDetailInfo = function() {
        $scope.inventory.detail_desc_pics = '';
        angular.forEach($scope.inventory.detailPicturesObj, function(k, v) {
          if ($scope.inventory.detailPicturesObj[v].img) {
            $scope.inventory.detail_desc_pics = $scope.inventory.detail_desc_pics.trim() + ';' + $scope.inventory.detailPicturesObj[v].img;
          }
        });
        $scope.inventory.detail_desc_pics = $scope.inventory.detail_desc_pics.substring(1, $scope.inventory.detail_desc_pics.length);
        var _params = {
          "inventory_id": $scope.inventory.id,
          "banner_title": $scope.inventory.banner_title,
          "banner_link": $scope.inventory.banner_link,
          "related_blogs": $scope.inventory.related_blogs,
          "detail_desc_pics": $scope.inventory.detail_desc_pics,
        };
        BuyService.inventory.modify(_params).then(function(data) {
          alert('保存成功');
        });
      }
      $scope.countzero = function(){
        if (!window.confirm('即将库存清零，是否确定执行？')) {
          return;
        }
         var _params = {
          "inventory_id": $scope.inventory.id,
          "spu_id": $scope.inventory.spu_id,
          "count_erase": "清零",
        };
        BuyService.inventory.modify(_params).then(function(data) {
          alert('保存成功');
          window.location.reload();
        });
      }
      $scope.saveShelves = function() {
        if (!window.confirm('确定保存吗？')) {
          return;
        }
        if(parseInt($scope.inventory.modifyCount)){
          $scope.inventory.modifyCount = parseInt($scope.inventory.modifyCount);
        }else if($scope.inventory.modifyCount){
          alert('请输入正确的库存变动量,如-5,+5,5');
          return;
        }
        var _params = {
          "inventory_id": $scope.inventory.id,
          "inventory_attr": $scope.inventory.inventory_attr,
          "spu_id": $scope.inventory.spu_id,
          "inventory_status": $scope.inventory.inventory_status,
          "delta_count": $scope.inventory.modifyCount,
          "sec_killable": $scope.inventory.sec_killable ? $scope.inventory.sec_killable : 0,
          "cart_available": $scope.inventory.cart_available ? $scope.inventory.cart_available : 0,
          "onsale_time": $scope.inventory.onsale_time,
          "offsale_time": $scope.inventory.offsale_time,
          "batch_no": $scope.inventory.batch_no,
          "buy_limit": $scope.inventory.buy_limit
        };
        BuyService.inventory.modify(_params).then(function(data) {
          alert('保存成功');
          window.location.reload();
        });
      }
    }
  ]);
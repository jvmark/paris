angular.module('buySPUAddController', [])
  .controller('SPUAddCtrl', ['$scope', 'BuyService', '$location', 'ngDialog', function($scope, BuyService, $location, ngDialog) {
    function init() {
      $scope.name = '';
      $scope.relatedBlogs = '';
      $scope.mainPic = {};
      $scope.banners = [{
        'desc': '',
        'link': ''
      }];
      $scope.detailPics = [{
        'img': ''
      }];
      $scope.barCodes = [{
        'barCode': '',
        'count': ''
      }];
      $scope.pictureList = [{
        'img': ''
      }];
      $scope.packPicsList = [{
        'img': ''
      }];
      $scope.desc = '';
      $scope.caption = '';
      $scope.marketPrice = '';
      $scope.showBrands = false;
      $scope.seleBrand = {};
      $scope.packDesc = '';
      $scope.inventoryAttr = '';
      $scope.recommend = '';
      getCategoryList();
    }

    /**
     * [getCategoryList 获得类别的list]
     * @author      turebetty
     * @email       qin.yang@duitang.com
     * @updateTime  2015-12-02T15:09:24+0800
     */
    function getCategoryList() {
      BuyService.spu.getCategoryList().then(function(jsn) {
        $scope.categoryList = jsn.data;
      });
    }
    /**
     * [getPropertiesList 根据类别，获取属性的list]
     * @author      turebetty
     * @email       qin.yang@duitang.com
     * @updateTime  2015-12-02T15:09:56+0800
     */
    $scope.getPropertiesList = function() {
        BuyService.spu.getPropertiesList({
          'id': $scope.selectCategory
        }).then(function(jsn) {
          $scope.propertiesList = jsn.data.properties;
        });
      }
      $scope.addItem = function(obj_,empty_){
        obj_.push(empty_);
      }
      $scope.removeItem = function(obj_){
        obj_.splice(this.$index, 1);
      }
      /**
       * [selectProperty 点击属性的＋,打开选择的对话框]
       * @param       {[type]}                 id_           [该属性的id]
       * @param       {[type]}                 seleProperty_ [选择的属性已有的值]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-12-03T11:05:08+0800
       */
    $scope.selectProperty = function(id_, seleProperty_) {
        BuyService.spu.getPropertiesInfo({
          'id': id_
        }).then(function(jsn) {
          $scope.propertyInfo = jsn.data;
          //填充该值原有数据
          angular.forEach(seleProperty_, function(k, v) {
            var _propertyInfo = $scope.propertyInfo.values;
            angular.forEach(_propertyInfo, function(k, i) {
              if (seleProperty_[v].key === _propertyInfo[i].key)
                _propertyInfo[i].checked = true;
            });
          });
          //打开对话框
          ngDialog.open({
            template: 'selectProperty',
            scope: $scope,
          });
        });

      }
      /**
       * [selectPropertyInfo 选择完属性的值以后，保存，关闭对话框]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-12-03T11:07:40+0800
       */
    $scope.selectPropertyInfo = function() {
        $.each($scope.propertiesList, function(i, property) {
          if (property.key === $scope.propertyInfo.id) {
            property.selePropertyInfo = [];
            $.each($scope.propertyInfo.values, function(j, item) {
              if (item.checked) {
                property.selePropertyInfo.push(item);
              }
            });
          }
        });
        ngDialog.close();
      }
      /**
       * [nextStep 下一步，获取品牌信息]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-12-03T11:30:24+0800
       */
    $scope.nextStep = function() {
        BuyService.spu.getBrands().then(function(jsn) {
          $scope.brands = jsn.data;
        });
      }
      /**
       * [selectBrand 选择某一个品牌]
       * @param       {[type]}                 name_ [该品牌name]
       * @param       {[type]}                 id_   [该品牌id]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-12-03T11:08:38+0800
       */
    $scope.selectBrand = function(name_, id_, $event) {
        $scope.showBrands = false;
        $scope.seleBrand.name = name_;
        $scope.seleBrand.id = id_;
        $event.stopPropagation();
      }
      /**
       * [createSpu 创建spu]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-12-03T11:31:49+0800
       */
    $scope.createSpu = function() {
      //$scope.relatedBlogs为空的时候，该项剔除，否则。。
      if ($scope.relatedBlogs) {
        var relatedBloglist = $scope.relatedBlogs.split(';');
      } else {
        var relatedBloglist = [];
      }
      var re = /^\d+(\.\d{1,2})?$/;
      if ($scope.marketPrice && re.exec($scope.marketPrice) == null) {
        popMsg("市场价格格式错误");
        return 0;
      }

      var detailDesc = [];
      var banners = [];
      //$scope.banners.desc 和link 如果都为空，该项剔除，否则。。
      angular.forEach($scope.banners, function(k, v) {
          if ($scope.banners[v].desc || $scope.banners[v].link) {
            banners.push({
              'desc': $scope.banners[v].desc,
              'link': $scope.banners[v].link
            });
          }
        })
        //$scope.detailPics.img如果为空，直接返回［］，否则返回数组
      angular.forEach($scope.detailPics, function(k, v) {
          if ($scope.detailPics[v].img) {
            detailDesc.push($scope.detailPics[v].img);
          }
        })
        //将$scope.propertiesList{key属性id,selePropertyInfo,value属性名称}这样的数据结构，改成［{'key':属性id ,'value': 值id}］
      var pvs = [];
      angular.forEach($scope.propertiesList, function(k, v) {
          if (typeof($scope.propertiesList[v].selePropertyInfo) !== 'undefined' && $scope.propertiesList[v].selePropertyInfo.length !== 0) {
            var seleItem = $scope.propertiesList[v].selePropertyInfo;
            angular.forEach(seleItem, function(k, i) {
              pvs.push({
                'key': $scope.propertiesList[v].key,
                'value': seleItem[i].key,
              });
            })
          }
        })
        //匹配brandname是否存在,如果不存在，这为空
      angular.forEach($scope.brands, function(k, v) {
        if ($scope.brands[v].id === $scope.seleBrand.id && $scope.brands[v].name !== $scope.seleBrand.name) {
          $scope.seleBrand = [];
        }
      })
      var pictures = [];
      angular.forEach($scope.pictureList, function(k, v) {
        if ($scope.pictureList[v].img) {
          pictures.push($scope.pictureList[v].img);
        }
      })
      var packPics = [];
      angular.forEach($scope.packPicsList, function(k, v) {
        if ($scope.packPicsList[v].img) {
          packPics.push($scope.packPicsList[v].img);
        }
      });
      var barCodes = [];
      for (var v = $scope.barCodes.length - 1; v >= 0; v--) {
        if (($scope.barCodes[v].barCode && $scope.barCodes[v].count.trim() === "") || ($scope.barCodes[v].barCode.trim() === "" && $scope.barCodes[v].count)) {
          alert('请填写完整的条码信息');
          return 0;
        }
        if ($scope.barCodes[v].barCode || $scope.barCodes[v].count) {
          barCodes.push({
            'barCode': $scope.barCodes[v].barCode,
            'count': $scope.barCodes[v].count
          });
        }
      };
      BuyService.spu.createSpu({
        "name": $scope.name,
        "desc": $scope.desc,
        "caption": $scope.caption,
        "marketPrice": $scope.marketPrice,
        "pictures": JSON.stringify(pictures),
        "mainPic": $scope.mainPic.img,
        "categoryId": $scope.selectCategory,
        "brandId": $scope.seleBrand.id,
        "pvs": JSON.stringify(pvs),
        "relatedBlogs": JSON.stringify(relatedBloglist),
        "banners": JSON.stringify(banners),
        "barCodes": JSON.stringify(barCodes),
        "detailDesc": JSON.stringify(detailDesc),
        "packPics": JSON.stringify(packPics),
        "packDesc": $scope.packDesc,
        "inventoryAttr": $scope.inventoryAttr,
        "recommend": $scope.recommend,
      }).then(function(jsn) {
        SUGAR.PopOut.alert('<div class="prompt"><h3>创建成功</h3></div>');
        $({}).delay(1500).queue(function() {
          SUGAR.PopOut.closeMask();
          location.reload();
        });
      });
    }
    init();
    /**
     * [inputFocus 防止冒泡]
     * @author      turebetty
     * @email       qin.yang@duitang.com
     * @updateTime  2015-12-03T11:55:37+0800
     */
    $scope.inputFocus = function($event) {
      $event.stopPropagation();
    }

    function popMsg(msg_) {
      SUGAR.PopOut.alert('<div class="prompt"><h3>' + msg_ + '</h3></div>');
      $({}).delay(700).queue(function() {
        SUGAR.PopOut.closeMask();
      });
    }

    function getDomain() {
      return "";
    }
    $scope.enlarge = function(url) {
      $scope.bigImg = url;
      $scope.showImg = true;
    }

  }]);
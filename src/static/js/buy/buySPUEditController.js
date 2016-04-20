angular.module('buySPUEditController', [])
  .controller('SPUEditCtrl', ['$scope', 'BuyService', '$routeParams', '$location', 'ngDialog', function($scope, BuyService, $routeParams, $location, ngDialog) {
    var id = $routeParams.id;

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
      $scope.showBrands = false;
      $scope.seleBrand = {};
      $scope.packDesc = '';
      $scope.inventoryAttr = '';
      $scope.recommend = '';
      $scope.packPicsList = [{
        'img': ''
      }];
      getSpuInfo();
      getBrands();
    }
    /**
     * [getSpuInfo 获取spu的详细信息]
     * @author      turebetty
     * @email       qin.yang@duitang.com
     * @updateTime  2015-12-03T10:55:15+0800
     */
    function getSpuInfo() {
      BuyService.spu.getSpuInfo({
        'id': id
      }).then(function(jsn) {
        $scope.spuInfo = jsn.data;
        if (!$scope.spuInfo.barCodes) {
          $scope.spuInfo.barCodes = [{
            "barCode": "",
            "count": ""
          }];
          $scope.spuInfo.disableEditBarCode = false;
        } else {
          $scope.spuInfo.disableEditBarCode = true;
        }
        $scope.spuInfo.descPics = [];
        $scope.spuInfo.pictureList = [];
        $scope.spuInfo.packPicsList = [];
        $scope.mainPic.img = $scope.spuInfo.mainPic;
        if (!$scope.spuInfo.banners) {
          $scope.spuInfo.banners = [];
        }
        //将$scope.spuInfo.relatedBlogs数组，转化成逗号分割的字符串$scope.spuInfo.relatedBlogsStr
        angular.forEach($scope.spuInfo.relatedBlogs, function(k, v) {
          if ($scope.spuInfo.relatedBlogsStr) {
            $scope.spuInfo.relatedBlogsStr = $scope.spuInfo.relatedBlogsStr + ';' + $scope.spuInfo.relatedBlogs[v];
          } else {
            $scope.spuInfo.relatedBlogsStr = $scope.spuInfo.relatedBlogs[v].toString();
          }

        });
        //将图片放到数组对象中$scope.spuInfo.descPics{img}
        angular.forEach($scope.spuInfo.detailDesc, function(k, v) {
          $scope.spuInfo.descPics.push({
            'img': $scope.spuInfo.detailDesc[v]
          });
        });
        //将图片放到数组对象中$scope.spuInfo.pictures{img}
        angular.forEach($scope.spuInfo.pictures, function(k, v) {
          $scope.spuInfo.pictureList.push({
            'img': $scope.spuInfo.pictures[v]
          });
        });
        //将图片放到数组对象中$scope.spuInfo.packPics{img}
        angular.forEach($scope.spuInfo.packPics, function(k, v) {
          $scope.spuInfo.packPicsList.push({
            'img': $scope.spuInfo.packPics[v]
          });
        });
        //根据spu类型的id，获取属性列表
        BuyService.spu.getPropertiesList({
          'id': $scope.spuInfo.category.id
        }).then(function(jsn) {
          $scope.propertiesList = jsn.data.properties;
          //将这个spu原来的属性数据，放入属性列表里，结构为$scope.propertiesList{key属性id,values属性的值,value属性名称}
          $.each($scope.spuInfo.properties, function(k, seleObj) {
            $.each($scope.propertiesList, function(j, itemObj) {
              if (itemObj.key === seleObj.id) {
                itemObj.values = seleObj.values;

              }
            });
          });
        });
      });
    }
    /**
     * [getBrands 获取品牌名称]
     * @author      turebetty
     * @email       qin.yang@duitang.com
     * @updateTime  2015-12-03T11:04:24+0800
     */
    function getBrands() {
      BuyService.spu.getBrands().then(function(jsn) {
        $scope.brands = jsn.data;
      });
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
            property.values = [];
            $.each($scope.propertyInfo.values, function(j, item) {
              if (item.checked) {
                property.values.push(item);
              }
            });
          }
        });
        ngDialog.close();
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
        if (!$scope.spuInfo.brand) {
          $scope.spuInfo.brand = {};
        }
        $scope.spuInfo.brand.name = name_;
        $scope.spuInfo.brand.id = id_;
        $event.stopPropagation();
      }
      /**
       * [updateSpu 更新spu，保存]
       * @author      turebetty
       * @email       qin.yang@duitang.com
       * @updateTime  2015-12-03T11:09:33+0800
       */
    $scope.updateSpu = function() {
        //$scope.spuInfo.relatedBlogsStr为空的时候，该项剔除，否则。。
        if ($scope.spuInfo.relatedBlogsStr) {
          var relatedBloglist = $scope.spuInfo.relatedBlogsStr.split(';');
        } else {
          var relatedBloglist = [];
        }
        var re = /^\d+(\.\d{1,2})?$/;
        if ($scope.spuInfo.marketPrice && re.exec($scope.spuInfo.marketPrice) == null) {
          popMsg("市场价格格式错误");
          return;
        } else if ($scope.spuInfo.marketPrice <= 0) {
          alert('市场价需要大于0');
        }
        //$scope.spuInfo.descPics.img如果为空，直接返回［］，否则返回数组
        var detailDesc = [];
        angular.forEach($scope.spuInfo.descPics, function(k, v) {
            if ($scope.spuInfo.descPics[v].img) {
              detailDesc.push($scope.spuInfo.descPics[v].img);
            }
          })
          //$scope.spuInfo.banners.desc 和link 如果都为空，该项剔除，否则。。
        var banners = [];
        angular.forEach($scope.spuInfo.banners, function(k, v) {
            if ($scope.spuInfo.banners[v].desc || $scope.spuInfo.banners[v].link) {
              banners.push({
                'desc': $scope.spuInfo.banners[v].desc,
                'link': $scope.spuInfo.banners[v].link
              });
            }
          })
          //将$scope.propertiesList{key属性id,values属性的值,value属性名称}这样的数据结构，改成［{'key':属性id ,'value': 值id}］
        var pvs = [];
        angular.forEach($scope.propertiesList, function(k, v) {
            if (typeof($scope.propertiesList[v].values) !== 'undefined' && $scope.propertiesList[v].values.length !== 0) {
              var seleItem = $scope.propertiesList[v].values;
              angular.forEach(seleItem, function(k, i) {
                pvs.push({
                  'key': $scope.propertiesList[v].key,
                  'value': seleItem[i].key,
                });
              })
            }
          })
          //匹配brandname是否存在,如果不存在，这为空
        if ($scope.spuInfo.brand) {
          angular.forEach($scope.brands, function(k, v) {
            if ($scope.brands[v].name !== $scope.spuInfo.brand.name && $scope.brands[v].id === $scope.spuInfo.brand.id) {
              $scope.spuInfo.brand = [];
            }
          })
        }
        var pictures = [];
        angular.forEach($scope.spuInfo.pictureList, function(k, v) {
          if ($scope.spuInfo.pictureList[v].img) {
            pictures.push($scope.spuInfo.pictureList[v].img);
          }
        });
        var packPics = [];
        angular.forEach($scope.spuInfo.packPicsList, function(k, v) {
          if ($scope.spuInfo.packPicsList[v].img) {
            packPics.push($scope.spuInfo.packPicsList[v].img);
          }
        });

        if ($scope.spuInfo.desc === '') {
          alert('描述不能为空');
          return;
        }
        var barCodes = [];
        for (var v = $scope.spuInfo.barCodes.length - 1; v >= 0; v--) {
          if (($scope.spuInfo.barCodes[v].barCode && $scope.spuInfo.barCodes[v].count === "") || ($scope.spuInfo.barCodes[v].barCode === "" && $scope.spuInfo.barCodes[v].count)) {
            alert('请填写完整的条码信息');
            return 0;
          }
          if ($scope.spuInfo.barCodes[v].barCode || $scope.spuInfo.barCodes[v].count) {
            barCodes.push({
              'barCode': $scope.spuInfo.barCodes[v].barCode,
              'count': $scope.spuInfo.barCodes[v].count
            });
          }
        };
        BuyService.spu.updateSpu({
          "id": $scope.spuInfo.id,
          "desc": $scope.spuInfo.desc,
          "caption": $scope.spuInfo.caption,
          "marketPrice": $scope.spuInfo.marketPrice,
          "pictures": JSON.stringify(pictures),
          "name": $scope.spuInfo.name,
          "mainPic": $scope.mainPic.img,
          "categoryId": $scope.spuInfo.category.id,
          "brandId": !$scope.spuInfo.brand || !$scope.spuInfo.brand.name ? '' : $scope.spuInfo.brand.id,
          "pvs": JSON.stringify(pvs),
          "relatedBlogs": JSON.stringify(relatedBloglist),
          "banners": JSON.stringify(banners),
          "barCodes": JSON.stringify(barCodes),
          "detailDesc": JSON.stringify(detailDesc),
          "packPics": JSON.stringify(packPics),
          "packDesc": $scope.spuInfo.packDesc,
          "inventoryAttr": $scope.spuInfo.inventoryAttr,
          "recommend": $scope.spuInfo.recommend,
        }).then(function(jsn) {
          SUGAR.PopOut.alert('<div class="prompt"><h3>修改成功</h3></div>');
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
      // if($location.host()==='operate.duitang.com'){
      //   return "http://www.duitang.com";
      // }else if($location.host()==='operatep.s.duitang.com'){
      //   return "http://p.s.duitang.com";
      // }else{
      //   return "http://t000.v2.s.duitang.com";
      // }
    }

    $scope.enlarge = function(url) {
      $scope.bigImg = url;
      $scope.showImg = true;
    }
      $scope.addItem = function(obj_,empty_){
        obj_.push(empty_);
      }
      $scope.removeItem = function(obj_){
        obj_.splice(this.$index, 1);
      }

  }]);
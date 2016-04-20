var xlsx = require('node-xlsx');
var url = require('url');
var MoniterGoods = require('../models/MoniterGoods');
var Q = require('q');
var co = require('co');
var fs = require('fs');
var _ = require('underscore');
var util = require('util');
var moment = require('moment');

co(function*() {
  var goodses = yield MoniterGoods.find({});
  var priceFileds = [{
    name: 'dalingPrices',
    mall: '达令',
    linkTemplate: 'http://www.daling.com/detail-%s.html',
    idName: 'dalingID'
  }, {
    name: 'jumeiMallPrices',
    mall: '聚美商城',
    linkTemplate: 'http://item.jumei.com/%s.html',
    idName: 'jumeiMallID'
  }, {
    name: 'kalaPrices',
    mall: '考拉',
    linkTemplate: 'http://www.kaola.com/product/%s.html',
    idName: 'kalaID'
  }, {
    name: 'jumeiGlobalPrices',
    mall: '聚美免税店',
    linkTemplate: 'http://item.jumeiglobal.com/%s.html',
    idName: 'jumeiGlobalID'
  }];
  var titles = ["spu编号", "inventory编号", "商品标题", "供应商", "分类", "团期号", '商城', '链接', "价格", "结算价"];

  var time = moment('2016-04-06');
  while (time.isBefore(moment())) {
    titles.push(time.format('YYYY-MM-DD'));
    time.add(1, 'days');
  }

  var rows = [
    titles
  ];
  for (var i = 0; i < goodses.length; i++) {
    var goods = goodses[i];
    for (var j = 0; j < priceFileds.length; j++) {
      var priceItem = priceFileds[j];
      var fieldName = priceItem.name;
      var prices = goods[fieldName];
      if (prices.length) {
        var link = util.format(priceItem.linkTemplate, goods[priceItem['idName']]);
        var row = [
          goods.spuID,
          goods.inventoryID,
          goods.inventoryName,
          goods.supplierName,
          goods.inventoryCategory,
          goods.batchNO,
          priceItem.mall,
          link,
          goods.salePrice,
          goods.settlePrice,
        ];

        var time = moment('2016-04-06');
        while (time.isBefore(moment())) {
          // var title = time.format('YYYY-MM-DD');
          // console.log(title);
          var dayPrices = _.filter(prices, function(item) {
            return moment(item.moniterTime).format('YYYY-MM-DD') == time.format('YYYY-MM-DD');
          })
          var lastestPrice = _.max(dayPrices, function(item) {
            return item.moniterTime;
          });
          if (lastestPrice) {
            row.push(lastestPrice.price);
          } else {
            row.push("");
          }
          time.add(1, 'days');
        }


        rows.push(row);
      }
    }
  }
  console.log('done');
  // console.log(rows);
  var obj = {
    name: '价格监控',
    data: rows
  };
  var file = xlsx.build([obj]);

  fs.writeFileSync(util.format("价格监控0406-%s.xlsx", moment().format('MMDD')), file, 'binary');

}).catch(function(error) {
  console.log(error.stack);
  console.log(error);
})
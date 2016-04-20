var xlsx = require('node-xlsx');
var url = require('url');
var MoniterGoods = require('../models/MoniterGoods');
var Q = require('q');
var co = require('co');
var dalingClient = require('../utils/DalingClient');

var obj = xlsx.parse('/Users/lloydsheng/Desktop/price1.xls'); // parses a file
console.log(obj);

var docs = [];

function converRowToDic(row) {
  var spuID = row[0];
  var inventoryID = row[1];
  var inventoryName = row[2];
  var supplierName = row[3];
  var inventoryCategory = row[4];
  var batchNO = row[5];
  var salePrice = row[6];
  var settlePrice = row[7];
  var kalaLink = row[8];
  var dalingLink = row[9];
  var jumeiLink = row[10];
  // docs.push();

  var doc = {
    spuID: spuID,
    inventoryID: inventoryID,
    inventoryName: inventoryName,
    supplierName: supplierName,
    inventoryCategory: inventoryCategory,
    batchNO: batchNO,
    salePrice: salePrice,
    settlePrice: settlePrice
  };

  if (kalaLink) {
    kalaLink = kalaLink.replace('\n', '').trim();
    var result = url.parse(kalaLink);
    var parts = result.pathname.split('/');
    var kalaID = parts[parts.length - 1].split('.')[0].replace('%0A', '');
    doc['kalaID'] = kalaID;
    if (!isNaN(kalaID)) {
      doc['kalaID'] = kalaID;
    } else {
      console.log(row);
      console.log(kalaID);
    }
  }
  if (jumeiLink) {
    jumeiLink = jumeiLink.replace('\n', '').trim();
    if (jumeiLink.length > 0) {
      var result = url.parse(jumeiLink);
      var parts = result.pathname.split('/');
      if (result.host == 'item.jumei.com') {
        var jumeiID = parts[parts.length - 1].split('.')[0].replace('%0A', '');
        doc['jumeiMallID'] = jumeiID;
      } else if (result.host == 'item.jumeiglobal.com') {
        var jumeiID = parts[parts.length - 1].split('.')[0].replace('%0A', '');
        doc['jumeiGlobalID'] = jumeiID;
      }
    }
  }

  if (dalingLink) {
    dalingLink = dalingLink.replace('\n', '').trim();
    if (dalingLink.length > 0) {
      // console.log(dalingLink);
      var result = url.parse(dalingLink);
      // console.log(result);
      var parts = result.pathname.split('/');
      var dalingID = parts[parts.length - 1].split('.')[0];
      if (dalingID.indexOf('-') >= 0) {
        dalingID = dalingID.split('-')[1]
      }
      if (!isNaN(dalingID)) {
        doc['dalingID'] = dalingID;
      } else {
        console.log(row);
        console.log(dalingID);
      }
    }
  }
  return doc;
}

function sleep(second) {
  var deffered = Q.defer();
  setTimeout(function() {
    deffered.resolve();
  }, second * 1000);

  return deffered.promise;
}

function getDalingPrice(dalingID) {
  var deffered = Q.defer();
  var client = dalingClient;
  client.getGoodsDetail(dalingID).then(function(result) {
    if (result.status == 200) {
      deffered.resolve(result.data.price);
      // console.log(result.data.price);
    }
  }, function(error) {
    console.log(error.stack);
    deffered.reject(error);
  })
  return deffered.promise;
}

co(function*() {
  var rows = obj[0]['data'];
  rows.pop();
  var docs = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (i == 0) {
      continue;
    }
    var doc = converRowToDic(row);

    var goods = yield MoniterGoods.findOne({
      spuID: doc.spuID,
      inventoryID: doc.inventoryID
    });

    if (goods) {
      goods.dalingID = doc.dalingID;
      goods.jumeiMallID = doc.jumeiMallID;
      goods.jumeiGlobalID = doc.jumeiGlobalID;
      goods.kalaID = doc.kalaID;
      goods = yield goods.save()
      console.log('update');
    } else {
      var saveGoods = new MoniterGoods(doc);
      goods = yield saveGoods.save();
      console.log('save');
    }
  }
}).catch(function(error) {
  console.log(error);
})



// console.log(docs);

// MoniterGoods.collection.insert(docs, function(error, rows) {
//   console.log(error);
// });
// console.log(docs);
// MoniterGoods.co
var xlsx = require('node-xlsx');
var url = require('url');
var MoniterGoods = require('../models/MoniterGoods');
var Q = require('q');
var co = require('co');
var dalingClient = require('../utils/DalingClient');
var jumeiClient = require('../utils/JumeiClient');
var kaolaClient = require('../utils/kaolaClient');
var jumeiGlobalClient = require('../utils/JumeiGlobalClient');

function getDalingPrice(dalingID) {
  var deffered = Q.defer();
  var client = dalingClient;
  client.getGoodsDetail(dalingID).then(function(result) {
    if (result.status == 200) {
      deffered.resolve(result.data.price);
    }
  }, function(error) {
    console.log(error.stack);
    deffered.reject(error);
  });
  return deffered.promise;
}

function getJumeiPrice(jumeiID) {
  var deffered = Q.defer();
  var client = jumeiClient;
  client.getGoodsDetail(jumeiID).then(function(result) {
    deffered.resolve(result.price);
  }, function(error) {
    console.log(error.stack);
    deffered.reject(error);
  });
  return deffered.promise;
}

function getJumeiGobalPrice(jumeiID) {
  var deffered = Q.defer();
  var client = jumeiGlobalClient;
  client.getGoodsDetail(jumeiID).then(function(result) {
    deffered.resolve(result.jumei_price);
  }, function(error) {
    console.log(error.stack);
    deffered.reject(error);
  });
  return deffered.promise;
}

function getKaolaPrice(kalaID) {
  var deffered = Q.defer();
  var client = kaolaClient;
  client.getGoodsDetail(kalaID).then(function(result) {
    if (result.code == 0) {
      // console.log(result.body.goods.currentPrice);
      deffered.resolve(result.body.goods.currentPrice);
    }
    // console.log(result)
  }, function(error) {
    console.log(error.stack);
    deffered.reject(error);
  })
  return deffered.promise;
}

function sleep(second) {
  var deffered = Q.defer();
  setTimeout(function() {
    deffered.resolve();
  }, second * 1000);

  return deffered.promise;
}


co(function*() {
  var docs = yield MoniterGoods.find();
  // console.log(docs);
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    var update = false;
    if (doc.dalingID) {
      try {
        console.log(doc.dalingID);
        var moniterTime = new Date().getTime();
        var price = yield getDalingPrice(doc.dalingID);
        doc.dalingPrices.push({
          moniterTime: moniterTime,
          price: price
        });
        update = true;
        console.log('update daling');
      } catch (error) {
        console.log(doc.dalingID);
        console.log(error);
        // console.log(doc.jumeID);
      }
      // console.log(doc.dalingPrices);
    }

    if (doc.jumeiMallID) {
      console.log(doc.jumeiMallID);
      try {
        var moniterTime = new Date().getTime();
        var price = yield getJumeiPrice(doc.jumeiMallID);
        doc.jumeiMallPrices.push({
          moniterTime: moniterTime,
          price: price
        });
        update = true;
        console.log('update jumei mall');
      } catch (error) {
        console.log(doc.jumeiMallID);
        console.log(error);
        // console.log(doc.jumeID);
      }
    }

    if (doc.jumeiGlobalID) {
      try {
        var moniterTime = new Date().getTime();
        var price = yield getJumeiGobalPrice(doc.jumeiGlobalID);
        console.log(price);
        if (price) {
          doc.jumeiGlobalPrices.push({
            moniterTime: moniterTime,
            price: parseFloat(price)
          });
          update = true;
          console.log('update jumei global');
        }

      } catch (error) {
        console.log(error);
      }
    }

    if (doc.kalaID) {
      try {
        console.log(doc.kalaID);
        var moniterTime = new Date().getTime();
        var price = yield getKaolaPrice(doc.kalaID);
        console.log(price);
        doc.kalaPrices.push({
          moniterTime: moniterTime,
          price: price
        });
        doc.kalaPrice = null;
        update = true;
        console.log('update kala');
      } catch (error) {
        console.log(error);
      }
      // console.log(doc.kalaPrice);
    }

    if (update) {
      doc = yield doc.save();
      yield sleep(1);
    }
  }
  console.log('done');
}).catch(function(error) {
  console.log(error);
})



// console.log(docs);

// MoniterGoods.collection.insert(docs, function(error, rows) {
//   console.log(error);
// });
// console.log(docs);
// MoniterGoods.co
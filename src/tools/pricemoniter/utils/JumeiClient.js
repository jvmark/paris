var request = require('request');
var Q = require('q');
var merge = require('merge');

var client = {
  makeURL: function(path) {
    var baseURL = 'http://s.mobile.jumei.com';
    return baseURL + path;
  },
  makeStaticURL: function(path) {
    var baseURL = 'http://www.jumei.com';
    return baseURL + path;
  },
  getGoodsDetail: function(goodsId) {
    var hash = false;
    var path = '/api/v1/product/detail';
    var params = {
      "ab": "4:show|5:show",
      "app_id": "com.jumei.iphone",
      "client_v": "3.452",
      "item_id": goodsId,
      "platform": "iphone",
      "site": "sh",
      "source": "AppstoreI1",
      "type": 'jumei_mall',
      "user_tag_id": 1
    };
    if (isNaN(goodsId)) {
      path = '/i/static/getDealInfoByHashId';
      params = {
        hash_id: goodsId
      }
      hash = true;
    }
    return this.get(path, params, hash);
  },
  get: function(path, qs, hash) {
    var defered = Q.defer();
    var options = {
      url: hash ? this.makeStaticURL(path) : this.makeURL(path),
      method: 'GET',
      qs: qs
    }
    this.request(options, function(error, response, body) {
      if (error) {
        return defered.reject(error);
      }
      if (hash) {
        // console.log(body)
        if (!body.mall_product) {
          defered.reject(new Error('商品或已经下架'));
        } else {
          defered.resolve({
            price: parseFloat(body.mall_product.mall_price)
          })
        }
      } else {
        if (body.code != '0') {
          return defered.reject(new Error(body.message));
        }
        // console.log(response)
        defered.resolve({
          price: parseFloat(body.data.jumei_price)
        });
      }
    });
    return defered.promise;
  },
  request: function(options, callback) {
    var baseOptions = {
      headers: {
        'User-Agent': 'Jumei/3.452 (iPhone8,1; iphone; iPhone OS; 9.3; zh-cn) JMNative/1.0',
        'X-Jumei-UA': 'product=jumei; platform=iphone; model=iPhone; ver=3.452; source=AppstoreI1; os_ver=9.3;',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9'
      }
    }
    var finalOptions = baseOptions;
    if (options) {
      finalOptions = merge(baseOptions, options);
    }
    // console.log(finalOptions);
    request(finalOptions, function(error, response, body) {
      console.log(error);
      callback(error, response, JSON.parse(body));
    });
  }
}

// console.log(111);

//d160327p187222zc
//6730

// client.getGoodsDetail('cd160304p596').then(function(result) {
//   console.log(result);
// }, function(error) {
//   console.log(error.stack);
// })


module.exports = client;
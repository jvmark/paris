var request = require('request');
var Q = require('q');
var merge = require('merge');

var client = {
  makeURL: function(path) {
    var baseURL = 'http://www.jumeiglobal.com';
    return baseURL + path;
  },
  getGoodsDetail: function(goodsId) {
    var path = '/ajax_new/MallInfo';
    var params = {
      "mall_id": goodsId,
    };
    if (isNaN(goodsId)) {
      path = '/ajax_new/dealinfo';
      params = {
        'hash_id': goodsId
      }
    }

    return this.get(path, params);
  },
  get: function(path, qs) {
    var defered = Q.defer();
    var url = this.makeURL(path);
    var options = {
      url: url,
      method: 'GET',
      qs: qs
    }
    console.log(url);
    this.request(options, function(error, response, body) {
      // console.log(body);
      if (error) {
        return defered.reject(error);
      }
      if (response.statusCode != 200) {
        return defered.reject(new Error('请求错误：' + response.statusCode));
      }
      defered.resolve(body);
    });
    return defered.promise;
  },
  request: function(options, callback) {
    var baseOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36',
        // 'X-Jumei-UA': 'product=jumei; platform=iphone; model=iPhone; ver=3.452; source=AppstoreI1; os_ver=9.3;',
        // 'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9'
      }
    }
    var finalOptions = baseOptions;
    if (options) {
      finalOptions = merge(baseOptions, options);
    }
    console.log(finalOptions);
    request(finalOptions, function(error, response, body) {
      // console.log(error);
      callback(error, response, JSON.parse(body));
    });
  }
}

// client.getGoodsDetail('ht060320p1333080t2').then(function(result) {
//   console.log(result.jumei_price);
// }, function(error) {
//   console.log(error.stack);
// })

module.exports = client;
var request = require('request');
var Q = require('q');
var merge = require('merge');

var client = {
  makeURL: function(path) {
    var baseURL = 'http://sp.kaola.com';
    return baseURL + path;
  },
  getGoodsDetail: function(goodsId) {
    var path = '/api/goods/' + goodsId;
    var refer = JSON.stringify({
      "referLocation": 5,
      "referPage": "'homePage'",
      "referType": "activity2",
      "referZone": "C",
      "referPosition": "activity1"
    });
    return this.get(path, {
      cityCode: '310100',
      refer: refer
    });
  },
  get: function(path, qs) {
    var defered = Q.defer();
    var options = {
      url: this.makeURL(path),
      method: 'GET',
      qs: qs
    }
    this.request(options, function(error, response, body) {
      if (error) {
        return defered.reject(error);
      }
      if (body.code != 0) {
        return defered.reject(new Error(body.msg));
      }

      defered.resolve(body);
    });
    return defered.promise;
  },
  request: function(options, callback) {
    var baseOptions = {
      headers: {
        'User-Agent': 'HTSpring/2.3.0 (iPhone; iOS 9.3; Scale/2.00)',
        'ursToken': 'b9438a0663aa38f137f708910c3c1060',
        'appVersion': '2.3.0',
        'platform': 2,
        'ursId': '31028F969889DC5A7D047724D02CC4E40A262A7E2107532D3E40A02A641C93C2E44267F50C5D44AB697FC15D0A0122C3',
        'deviceModel': 'iPhone8,1',
        'appChannel': '1',
        'deviceUdID': '09de93179fdc63007be91582744f70619b467b00'
      }
    }
    var finalOptions = baseOptions;
    if (options) {
      finalOptions = merge(baseOptions, options);
    }
    // console.log(finalOptions);
    request(finalOptions, function(error, response, body) {
      callback(error, response, JSON.parse(body));
    });
  }
}

// client.getGoodsDetail(158941).then(function(result) {
//   // if (result.code == 0) {
//   console.log(result);
//   console.log(result.body.goods.currentPrice);
//   // }
//   // console.log(result)
// }, function(error) {
//   console.log(error.stack);
// })
module.exports = client;
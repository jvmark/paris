var request = require('request');
var Q = require('q');
var merge = require('merge');

var client = {
  makeURL: function(path) {
    var baseURL = 'http://m.ymall.com';
    return baseURL + path;
  },
  getGoodsDetail: function(goodsId) {
    var path = '/api/goods/special';
    return this.get(path, {
      goods_id: goodsId,
      app_page_path: 'type-goods_list',
      app_from_page: 'goods_list',
      from_search: 0
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
      if (body.status != '200') {
        return defered.reject(new Error(body.error_detail));
      }
      defered.resolve(body);
    });
    return defered.promise;
  },
  request: function(options, callback) {
    var baseOptions = {
      headers: {
        'User-Agent': '达令 5.6.5 rv:5.6.5.0 (iPhone; iPhone OS 9.3; zh_CN)',
        'IDFV': 'E6DDBA5E-703F-4B89-B59F-F179476DC3EC',
        'DEVICEMODE': 'iPhone',
        'CHANNELID': 'App Store',
        'CLIENTID': 'f670860ac153965825c79a3282d90ed6de87ccf3',
        'APPVERSION': '5.6.5',
        'DEVICESIZE': '750*1334',
        'SYSTEMVERSION': '9.3',
        'ACCESSTOKEN': '',
        'APPNAME': 'com.daling.daling',
        'MAC': '02:00:00:00:00:00',
        'UID': '',
        'PLATFORM': 'iphone',
        'IDFV': 'E6DDBA5E-703F-4B89-B59F-F179476DC3EC',
        'DLFINGER': '831530d4af53251fafdb3ac71f684c50', // 必须要的
        'DLTOKEN': 'f2a121fa9e6f5cacbb7e01f9861ce02d',
        'IDFA': 'FFE7DBC1-4ADD-4543-9B22-6C397290924D'
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

// client.getGoodsDetail(4617).then(function(result) {
//   console.log(result);
//   // if (result.status == 200) {
//   //   console.log(result.data.price);
//   // }
// }, function(error) {
//   console.log(error.stack);
// })

module.exports = client;
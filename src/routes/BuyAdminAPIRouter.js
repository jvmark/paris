var express = require('express');
var router = express.Router();
var proxy = require('express-http-proxy');
var config = require('../config').config;
var co = require('co');
var multer = require('multer');
var BuyAdminService = require('../services/BuyAdminService');

var importURLs = [
  '/order/import/',
  '/inventory/edit/',
  '/inventory/import/',
  '/spu/spu/batchcreate/',
  '/spu/spu/batchedit/'
];

for (var i = 0; i < importURLs.length; i++) {
  var url = importURLs[i];
  router.post(url, function(req, res) {
    var storage = multer.memoryStorage()
    var upload = multer({
      storage: storage
    }).single('local_file');
    upload(req, res, function(err) {
      co(function*() {
        var baseURL = null;
        if (req.session.apiSettings && req.session.apiSettings.buyAdminAPI) {
          baseURL = req.session.apiSettings.buyAdminAPI;
        }
        var service = BuyAdminService(baseURL, req.session.authInfo);
        var result = yield service.upload(req._parsedOriginalUrl.pathname, req.file);
        res.success(result.data);
      }).catch(function(error) {
        res.error(error)
      });
    })
  })
}

var downloadURLs = [
  '/order/todeliver/download/',
  '/settle/order/suppliers/',
  '/settle/order/accountants/',
  '/order/biz/download/',
  '/order/pay/download/',
  '/refund/order/export/'
];

for (var i = 0; i < downloadURLs.length; i++) {
  var url = downloadURLs[i];
  router.get(url, function(req, res) {
    co(function*() {
      var baseURL = null;
      if (req.session.apiSettings && req.session.apiSettings.buyAdminAPI) {
        baseURL = req.session.apiSettings.buyAdminAPI;
      }
      var service = BuyAdminService(baseURL, req.session.authInfo);
      var result = yield service.download(req._parsedOriginalUrl.pathname, req.query, res);
      // var response = result.response;
      // console.log(response.headers);
      // var data = new Buffer(response.body, 'binary');
      // res.writeHead(200, {
      //   'Content-Type': response.headers['content-type'],
      //   'Content-Disposition': response.headers['content-disposition'],
      //   'Content-Length': result.body.length
      // });
      // res.end(result.body);
    }).catch(function(error) {
      res.error(error)
    });
  });
}


router.get('/*', function(req, res) {
  co(function*() {
    var baseURL = null;
    if (req.session.apiSettings && req.session.apiSettings.buyAdminAPI) {
      baseURL = req.session.apiSettings.buyAdminAPI;
    }
    var service = BuyAdminService(baseURL, req.session.authInfo);
    var data = yield service.get(req._parsedOriginalUrl.pathname, req.query);
    res.success(data.data);
  }).catch(function(error) {
    res.error(error)
  });
});

router.post('/*', function(req, res) {
  co(function*() {
    // console.log(req.body);
    var baseURL = null;
    if (req.session.apiSettings && req.session.apiSettings.buyAdminAPI) {
      baseURL = req.session.apiSettings.buyAdminAPI;
    }
    var service = BuyAdminService(baseURL, req.session.authInfo);
    var data = yield service.post(req._parsedOriginalUrl.pathname, req.body);
    res.success(data.data);
  }).catch(function(error) {
    res.error(error)
  });
});

module.exports = router;
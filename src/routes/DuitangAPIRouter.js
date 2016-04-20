var express = require('express');
var router = express.Router();
var proxy = require('express-http-proxy');
var config = require('../config').config;
var co = require('co');
var multer = require('multer');

var DuitangAuthService = require('../services/DuitangAuthService');

var baseURL = null;

router.post('/logout/', function(req, res, next) {
  co(function*() {
    var baseURL = null;
    if (req.session.apiSettings && req.session.apiSettings.wwwAPI) {
      baseURL = req.session.apiSettings.wwwAPI;
    }
    var service = DuitangAuthService(baseURL, req.session.authInfo);
    var result = yield service.logout();
    // 删除 cookie
    delete req.session['authInfo'];
    res.success(result.data);
  }).catch(function(error) {
    res.error(error)
  });
});

router.post('/login/', function(req, res, next) {
  co(function*() {
    var baseURL = null;
    if (req.session.apiSettings && req.session.apiSettings.wwwAPI) {
      baseURL = req.session.apiSettings.wwwAPI;
    }
    var service = DuitangAuthService(baseURL, req.session.authInfo);
    var result = yield service.login(req.body.login_name, req.body.pswd);
    // 写 cookie
    req.session.authInfo = result.auth;
    req.session.duitangInfo = result.data;
    res.success(result.data);
  }).catch(function(error) {
    res.error(error)
  });
});

router.get('/people/profile/', function(req, res) {
  co(function*() {
    if (!req.session.authInfo) {
      var error = new Error('没有登录');
      error.api_status = 2;
      throw error;
    }
    var baseURL = null;
    if (req.session.apiSettings && req.session.apiSettings.wwwAPI) {
      baseURL = req.session.apiSettings.wwwAPI;
    }
    var service = DuitangAuthService(baseURL, req.session.authInfo);
    var result = yield service.profile();
    res.success(result.data);
  }).catch(function(error) {
    res.error(error)
  });
});

router.get('/security/token/', function(req, res) {
  co(function*() {
    var baseURL = null;
    if (req.session.apiSettings && req.session.apiSettings.wwwAPI) {
      baseURL = req.session.apiSettings.wwwAPI;
    }
    var service = DuitangAuthService(baseURL, req.session.authInfo);
    var result = yield service.get(req._parsedOriginalUrl.pathname, req.query);
    res.success(result.data);
  }).catch(function(error) {
    res.error(error)
  });
});

router.post('/upload/photo/', function(req, res) {
  var storage = multer.memoryStorage()
  var upload = multer({
    storage: storage
  }).single('img');
  upload(req, res, function(err) {
    co(function*() {
      var baseURL = null;
      if (req.session.apiSettings && req.session.apiSettings.wwwAPI) {
        baseURL = req.session.apiSettings.wwwAPI;
      }
      var service = DuitangAuthService(baseURL, req.session.authInfo);
      var result = yield service.uploadPhoto(req.file.buffer);
      res.success(result.data);
    }).catch(function(error) {
      res.error(error)
    });
  })
});

module.exports = router;
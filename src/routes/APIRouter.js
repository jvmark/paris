var express = require('express');
var router = express.Router();
var config = require('../config').config;
var co = require('co');
var Settings = require('./Settings');
var esapis = require('./esapis');
var API = require('./API');
var toolSearch = require('./ToolSearch');
var request = require('request');

router.get('/settings', Settings.settings);

router.post('/settings', Settings.updateSettings);

router.post('/esapi', esapis.post);

router.get('/navigations', API.getNavigationList);

router.get('/tool/search/', toolSearch.search);

router.post('/tool/feedback_link', function(req, res) {

  if (!req.body.order_id) {
    return res.json({
      status: 0,
      message: '参数错误'
    });
  }
  if (!req.session.duitangInfo) {
    return res.json({
      status: 0,
      message: '你需要重新登录一下才能获取反馈链接'
    });
  }
  console.log(req.session.duitangInfo);
  var url = 'http://jsform.com/f/rjmbnr?ex=' + encodeURIComponent(JSON.stringify({
    "did": req.body.order_id,
    "un": req.session.duitangInfo && req.session.duitangInfo.user.username
  }));

  request({
    method: 'POST',
    url: 'http://dwz.cn/create.php',
    form: {
      url: url
    }
  }, function(error, reponse, body) {
    if (error) {
      res.json({
        status: 0,
        message: error.message
      });
    } else {
      // console.log(body);
      body = JSON.parse(body)
      res.json({
        status: 1,
        data: {
          url: "您好，为了提高服务质量，请您在本次会话结束后对我的服务作出评价，感谢您对堆糖商店的支持" + body.tinyurl
        }
      })
    }
  });
})

module.exports = router;
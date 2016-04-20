var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var crypto = require('crypto');
var moment = require('moment');
var xlsx = require('node-xlsx');
var BuyAdminService = require('../services/BuyAdminService');
var DuitangAuthService = require('../services/DuitangAuthService');
var co = require('co');
var Q = require('q');
var uuid = require('node-uuid');
var config = require('../config').config;

var secret = 's_gu9exomWo4asamzh';
var maxDay = 15;

var duitangSupplierID = '212';
var robotUsername = '雪糕';
var robotPassword = '123456';

var baseURL = 'http://' + config.buyAdminAPIDomain;
var duitangAPI = 'http://' + config.wwwAPIDomain;

if (process.env.ENV == 'production') {
  duitangSupplierID = '240';
  robotUsername = '吃豆人的小飞船';
  robotPassword = '112112';
} else if (process.env.ENV == 'preview') {
  duitangSupplierID = '240';
  robotUsername = '吃豆人的小飞船';
  robotPassword = '112112';
}


function makeESAPIResponse(error, response, body, dataParser) {
  var cause = '';
  var result = 0;
  var esResponse = {};
  if (error) {
    cause = error.error | error.message;
  } else if (response.statusCode != 200) {
    cause = '后台接口错误 ' + response.statusCode;
  } else {
    result = 1;
    var apiResponse = JSON.parse(body);
    if (apiResponse.status == 1) {
      esResponse.data = dataParser(apiResponse.data);
    } else {
      cause = apiResponse.message;
    }
  }
  esResponse.cause = cause;
  esResponse.result = result;

  return esResponse;
}


function orderSearch(req, res) {
  var page = isNaN(req.body.Page) ? 1 : parseInt(req.body.Page);
  var pageSize = isNaN(req.body.PageSize) ? 20 : parseInt(req.body.PageSize);
  var orderStatusMap = {
    '1': '4',
    '0': '0',
    '-1': '256'
  };
  if (req.body.OrderStatus == '-1') {
    return res.render('orders', {
      orderNOs: [],
      result: 1,
      page: 1,
      total: 0
    });
  }
  var status = orderStatusMap[req.body.OrderStatus];
  console.log(status);
  var startTime = moment().subtract(maxDay, 'days');
  var endTime = moment();
  var qs = {
    order_status: status,
    start: (page - 1) * pageSize,
    limit: pageSize,
    start_time: startTime.format('YYYY-MM-DD HH:mm:ss'),
    end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
    supplier_id: duitangSupplierID
  };
  console.log(qs);
  var url = baseURL + '/napi/buyadmin/order/list/';
  console.log(url);
  console.log(baseURL + '/napi/buyadmin/order/list/');
  request({
    method: 'GET',
    url: url,
    qs: qs
  }, function(error, response, body) {
    var esResponse = makeESAPIResponse(error, response, body, function(data) {
      var apiResponse = JSON.parse(body);

      orderNOs = _.map(apiResponse.data.object_list, function(order) {
        return order.id;
      });
      total = apiResponse.data.total;

      console.log(orderNOs);
      return {
        total: total,
        orders: orderNOs,
      }
    })
    res.render('orders', {
      orderNOs: esResponse.data && esResponse.data.orders,
      cause: esResponse.cause,
      result: esResponse.result,
      page: page,
      total: esResponse.data && esResponse.data.total
    });
  });
}

function orderDetail(req, res) {
  console.log(baseURL + '/napi/buyadmin/order/list/');
  request({
    method: 'GET',
    url: baseURL + '/napi/buyadmin/order/details/',
    qs: {
      main_order_id: req.body.OrderNO
    }
  }, function(error, response, body) {
    var esResponse = makeESAPIResponse(error, response, body, function(data) {
      // WAIT_BUYER_PAY(等待买家付款)
      // WAIT_SELLER_SEND_GOODS(买家已付款)
      // WAIT_BUYER_CONFIRM_GOODS（卖家已发货)
      // TRADE_FINISHED(交易成功)
      // TRADE_CLOSED(付款以后用户退款成功，交易自动关闭)
      var orderStatusMap = {
        1: 'WAIT_BUYER_PAY',
        4: 'WAIT_SELLER_SEND_GOODS',
        32: 'WAIT_BUYER_CONFIRM_GOODs',
        64: 'TRADE_FINISHED',
        128: 'TRADE_CLOSED'
      }
      result = 1;
      order = data;
      console.log(data);
      order.es_status = 'WAIT_BUYER_PAY';
      if (orderStatusMap[order.basic_msg.order_status]) {
        order.es_status = orderStatusMap[order.basic_msg.order_status];
      }
      return order;
    });

    res.render('order_detail', {
      order: esResponse.data,
      cause: esResponse.cause,
      result: esResponse.result
    });
  });
}

function sleep(second) {
  var deffered = Q.defer();
  setTimeout(function() {
    deffered.resolve();
  }, second * 1000);

  return deffered.promise;
}

function sendGoods(req, res) {
  co(function*() {
    if (!req.body.OrderNO || !req.body.SndStyle || !req.body.BillID) {
      throw new Error('必须同时提供订单号，快递公司名和快递单号');
    }
    if (req.body.SndStyle != '天天') {
      throw new Error('不支持该快递公司');
    }
    var rows = [
      ["id",
        "order_status",
        "logistics_time",
        "logistics_name",
        "logistics_ticket",
        "refund_order_id",
        "settle_order_id"
      ]
    ];
    req.body.OrderNO.split(',').forEach(function(orderID) {
      orderID = orderID.trim();
      if (!orderID) {
        return;
      }
      rows.push([orderID,
        32,
        "",
        "tiantian",
        req.body.BillID,
        "",
        ""
      ]);
    });
    console.log(rows);
    var obj = {
      name: '回传单',
      data: rows
    };

    var file = xlsx.build([obj]);
    // var baseURL = null;
    // if (req.session.apiSettings && req.session.apiSettings.buyAdminAPI) {
    //   baseURL = req.session.apiSettings.buyAdminAPI;
    // }
    var duitangService = DuitangAuthService(duitangAPI);
    var loginResult = yield duitangService.login(robotUsername, robotPassword);
    console.log(loginResult);
    var service = BuyAdminService(baseURL, loginResult.auth);
    var filename = uuid.v4();
    var result = yield service.upload('/napi/buyadmin/order/import/', {
      fieldname: 'local_file',
      originalname: filename + '.xlsx',
      encoding: '7bit',
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: file,
      size: file.length
    });
    yield sleep(1);
    var updateResult = yield service.get('/napi/buyadmin/order/history/', {
      limit: 100,
      start: 0
    });
    if (updateResult.status == 0) {
      throw new Error('上传失败');
    }
    var fileResult = _.filter(updateResult.data.history, function(history) {
      return history.filename.indexOf(filename) == 0;
    });
    console.log(fileResult);
    if (fileResult.length == 0) {
      throw new Error('请求超时');
    }
    if (fileResult[0].status != '上传成功') {
      throw new Error(fileResult[0].status);
    }
    res.render('orders', {
      result: 1
    });
  }).catch(function(error) {
    console.log(error.stack);
    res.render('orders', {
      cause: error.message,
      result: 0
    });
  });
}

function post(req, res) {
  var uCode = req.body.uCode;
  var mType = req.body.mType;
  var Sign = req.body.Sign;
  var TimeStamp = req.body.TimeStamp;
  console.log(req.body);

  if (!uCode || !mType || !Sign || !TimeStamp) {
    return res.render('order_detail', {
      cause: 0,
      result: '错误错误，必须提供uCode，mType，Sign，TimeStamp'
    });
  }
  var origin = util.format('%smType%sTimeStamp%suCode%s%s', secret, mType, TimeStamp, uCode, secret);
  var rightSign = crypto.createHash('md5').update(origin).digest('hex').toUpperCase();
  console.log(rightSign);

  if (Sign != rightSign) {
    return res.render('order_detail', {
      cause: 0,
      result: '签名错误'
    });
  }

  if (req.body.mType.toLowerCase() == 'mordersearch') {
    return orderSearch(req, res);
  }
  if (req.body.mType.toLowerCase() == 'mgetorder') {
    return orderDetail(req, res);
  }
  if (req.body.mType.toLowerCase() == 'msndgoods') {
    return sendGoods(req, res);
  }

  return res.render('order_detail', {
    cause: 0,
    result: '不支持该方法'
  });
}

exports.post = post;
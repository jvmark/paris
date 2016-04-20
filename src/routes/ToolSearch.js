var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var _ = require('underscore');
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var moment = require('moment');

function convertXHSItem(item) {
  return {
    site: 'xiaohongshu',
    title: item.title,
    desc: item.desc,
    content: item.content,
    url: item.link,
    image: item.image,
    price: item.price,
    discount_price: item.discount_price,
    discount: item.discount,
    site_id: item.id
  }
}

function convertXHSNoteItem(item) {
  // console.log(item);
  return {
    site: 'xiaohongshunote',
    title: item.desc.slice(0, 30),
    desc: item.desc.slice(0, 30),
    content: item.desc,
    image: item.image,
    site_id: item.id
  }
}

function convertKaolaItem(item) {
  return {
    site: 'kaola',
    title: item.title,
    desc: item.title,
    content: item.subTitle,
    url: 'http://www.kaola.com/product/' + item.goodsId + '.html',
    image: item.imgUrl + '?imageView&thumbnail=200x200&quality=85',
    price: item.originalPrice,
    discount_price: item.currentPrice,
    discount: item.discount,
    site_id: item.goodsId
  }
}

function kaolaSearch(kw, page, rows, callback) {
  var url = 'http://sp.kaola.com/api/search/goods';
  var qs = {
    search: JSON.stringify({
      "key": kw,
      "spellCheck": 1,
      "isSearch": 1
    }),
    pageNo: page,
    pageSize: rows
  }
  var options = {
    url: url,
    qs: qs,
    headers: {
      'User-Agent': 'HTSpring/2.3.0 (iPhone; iOS 9.2.1; Scale/2.00)'
    }
  };
  request(options, function(error, response, body) {
    if (error || body.code == 0) {
      callback({
        status: 0,
        message: error.message
      });
    } else {
      var result = JSON.parse(body);
      // console.log(result);
      var items = _.map(result.body.result.goodsList, function(item) {
        return convertKaolaItem(item);
      });
      callback(null, {
        status: 1,
        data: {
          more: result.body.result.hasMore,
          next_start: rows * page,
          limit: 20,
          object_list: items
        }
      });
    }
  })
}

function xhsSearch(kw, page, rows, callback) {
  var url = 'http://www.xiaohongshu.com/api/v1/search/goods';
  var qs = {
    keyword: kw,
    deviceId: '0B36CFCB-949C-4BBE-955D-7C1FA9C27C24',
    lang: 'zh-Hans-CN',
    page: page,
    platform: 'iOS',
    rows: rows,
    sid: 'session.1113763817589585422',
    sigh: '584a3759937bc33b0641cae7c0665fd2',
    t: parseInt(new Date().getTime() / 1000)
  }
  var options = {
    url: url,
    qs: qs,
    headers: {
      'User-Agent': 'discover/42015 (iPhone; iOS 9.2.1; Scale/2.00)'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      callback({
        status: 0,
        message: error.message
      });
    } else {
      var result = JSON.parse(body);
      var items = _.map(result.data, function(item) {
        return convertXHSItem(item);
      });
      callback(null, {
        status: 1,
        data: {
          more: result.data.length >= rows,
          next_start: rows * page,
          limit: 20,
          object_list: items
        }
      });
    }
  })
}


function xhsNoteSearch(kw, page, rows, callback) {
  var url = 'http://www.xiaohongshu.com/api/v1/search/notes';
  var qs = {
    keyword: kw,
    deviceId: '0B36CFCB-949C-4BBE-955D-7C1FA9C27C24',
    lang: 'zh-Hans-CN',
    page: page,
    platform: 'iOS',
    rows: rows,
    sid: 'session.1113763817589585422',
    sigh: '584a3759937bc33b0641cae7c0665fd2',
    t: parseInt(new Date().getTime() / 1000)
  }
  var options = {
    url: url,
    qs: qs,
    headers: {
      'User-Agent': 'discover/42015 (iPhone; iOS 9.2.1; Scale/2.00)'
    }
  };
  request(options, function(error, response, body) {
    if (error) {
      callback({
        status: 0,
        message: error.message
      });
    } else {
      var result = JSON.parse(body);
      // console.log(result.data);
      var items = _.map(result.notes, function(item) {
        return convertXHSNoteItem(item);
      });
      callback(null, {
        status: 1,
        data: {
          more: result.notes.length >= rows,
          next_start: rows * page,
          limit: 20,
          object_list: items
        }
      });
    }
  })
}

function search(req, res) {
  console.log(req.query);
  var limit = parseInt(req.query.limit);
  limit = limit ? limit : 20;
  var page = parseInt(req.query.start / limit) + 1;
  if (req.query.site == 'xiaohongshu') {
    xhsSearch(req.query.kw, page, limit, function(error, result) {
      res.json(result);
    });
  } else if (req.query.site == 'kaola') {
    kaolaSearch(req.query.kw, page, limit, function(error, result) {
      res.json(result);
    });
  } else if (req.query.site == 'xiaohongshunote') {
    xhsNoteSearch(req.query.kw, page, limit, function(error, result) {
      res.json(result);
    });
  } else {
    res.json({
      status: 0,
      message: '不支持该站点'
    })
  }
}

exports.xhsSearch = xhsSearch;
exports.xhsNoteSearch = xhsNoteSearch;
exports.kaolaSearch = kaolaSearch;
exports.search = search;
var Q = require('q');
var request = require('request');
var util = require('util');
var config = require('../config').config;
var fs = require('fs');

var BuyAdminService = function(baseURL, authInfo) {
  return {
    get: function(path, qs) {
      var deffered = Q.defer();
      if (!baseURL) {
        // baseURL = 'http://operate.duitang.com';
        baseURL = 'http://' + config.buyAdminAPIDomain;
      }
      var url = baseURL + path;
      console.log(url);
      var j = request.jar();
      var cookie = request.cookie(util.format("%s=%s", 'sessionid', authInfo.sessionid));
      j.setCookie(cookie, url);

      request({
        url: url,
        jar: j,
        qs: qs,
        method: 'GET'
      }, function(error, response, body) {
        if (error) {
          return deffered.reject(error);
        }
        if (response.statusCode != 200) {
          return deffered.reject(new Error('请求错误 ' + response.statusCode));
        }
        var result = JSON.parse(body);
        if (result.status != 1) {
          return deffered.reject(new Error(result.message));
        }
        var cookie_string = j.getCookieString(url);
        deffered.resolve({
          status: result.status,
          data: result.data,
          cookie: cookie_string
        });
      });

      return deffered.promise;
    },
    post: function(path, params) {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.buyAdminAPIDomain;
      }
      console.log(baseURL);
      var url = baseURL + path;
      var j = request.jar();
      var cookie = request.cookie(util.format("%s=%s", 'sessionid', authInfo.sessionid));
      j.setCookie(cookie, url);

      request({
        url: url,
        jar: j,
        form: params,
        method: 'POST'
      }, function(error, response, body) {
        if (error) {
          return deffered.reject(error);
        }
        if (response.statusCode != 200) {
          return deffered.reject(new Error('请求错误 ' + response.statusCode));
        }
        var result = JSON.parse(body);
        if (result.status != 1) {
          return deffered.reject(new Error(result.message));
        }
        var cookie_string = j.getCookieString(url);
        deffered.resolve({
          status: result.status,
          data: result.data,
          cookie: cookie_string
        });
      });

      return deffered.promise;
    },
    download: function(path, qs, res) {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.buyAdminAPIDomain;
      }
      var url = baseURL + path;
      console.log(url);
      var j = request.jar();
      var cookie = request.cookie(util.format("%s=%s", 'sessionid', authInfo.sessionid));
      j.setCookie(cookie, url);

      var r = request({
        url: url,
        jar: j,
        qs: qs
      }, function(error, response, body) {
        if (error) {
          return deffered.reject(error);
        }
        if (response.statusCode != 200) {
          return deffered.reject(new Error('请求错误 ' + response.statusCode));
        }
        // console.log(response);
        // var result = JSON.parse(body);
        // if (result.status != 1) {
        //   return deffered.reject(new Error(result.message));
        // }

        deffered.resolve({
          response: response,
          body: body
        });
      });
      r.pipe(res);


      return deffered.promise;
    },
    upload: function(path, file) {
      console.log(arguments);
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.buyAdminAPIDomain;
      }
      var url = baseURL + path;
      console.log(url);
      var j = request.jar();
      var cookie = request.cookie(util.format("%s=%s", 'sessionid', authInfo.sessionid));
      j.setCookie(cookie, url);

      var r = request({
        url: url,
        jar: j,
        method: 'POST'
      }, function(error, response, body) {
        if (error) {
          return deffered.reject(error);
        }
        if (response.statusCode != 200) {
          return deffered.reject(new Error('请求错误 ' + response.statusCode));
        }
        var result = JSON.parse(body);
        if (result.status != 1) {
          return deffered.reject(new Error(result.message));
        }
        var cookie_string = j.getCookieString(url);
        deffered.resolve({
          status: result.status,
          data: result.data,
        });
      });

      var form = r.form();
      form.append(file.fieldname, file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.buffer.length
      });

      return deffered.promise;
    }
  }
}


module.exports = BuyAdminService;
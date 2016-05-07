var Q = require('q');
var request = require('request');
var util = require('util');
var config = require('../config').config;

var service = function(baseURL, authInfo) {
  return {
    logout: function() {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.wwwAPIDomain;
      }
      var j = request.jar();
      var url = baseURL + '/napi/logout/';

      request({
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
        deffered.resolve({
          status: result.status,
          data: result.data
        });
      })
      return deffered.promise;
    },
    login: function(username, password) {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.wwwAPIDomain;
      }
      var j = request.jar();
      var url = baseURL + '/napi/login/';
      request({
        url: url,
        jar: j,
        method: 'POST',
        form: {
          username: username,
          password: password,
          type:0
        }
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

        var cookie_string = j.getCookieString(url); // "key1=value1; key2=value2; ..."

        deffered.resolve({
          status: result.status,
          data: result.data,
          auth: {
            type: 'cookie',
          }
        });
      })
      return deffered.promise;
    },
    profile: function() {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.wwwAPIDomain;
      }
      var url = baseURL + '/napi/people/profile/';
      var j = request.jar();
      var cookie = request.cookie(util.format("%s=%s", 'sessionid', authInfo.sessionid));
      j.setCookie(cookie, url);

      request({
        url: url,
        jar: j
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
        var cookie_string = j.getCookieString(url); // "key1=value1; key2=value2; ..."
        deffered.resolve({
          status: result.status,
          data: result.data,
          cookie: cookie_string
        });
      });

      return deffered.promise;
    },
    get: function(path, qs) {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.wwwAPIDomain;
      }
      var url = baseURL + path;
      var j = request.jar();
      var cookie = request.cookie(util.format("%s=%s", 'sessionid', authInfo.sessionid));
      j.setCookie(cookie, url);

      request({
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
        var result = JSON.parse(body);
        if (result.status != 1) {
          return deffered.reject(new Error(result.message));
        }
        var cookie_string = j.getCookieString(url); // "key1=value1; key2=value2; ..."
        deffered.resolve({
          status: result.status,
          data: result.data,
          cookie: cookie_string
        });
      });

      return deffered.promise;
    },

    uploadPhoto: function(buffer) {
      var deffered = Q.defer();
      if (!baseURL) {
        baseURL = 'http://' + config.wwwAPIDomain;
      }
      var url = baseURL + '/napi/upload/photo/';
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

      console.log(buffer);

      var form = r.form();
      form.append('img', buffer, {
        filename: 'unicycle.jpg',
        contentType: 'image/jpg',
        knownLength: buffer.length
      });

      return deffered.promise;
    }
  }
}


module.exports = service;
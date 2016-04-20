function middleware(req, res, next) {
  if (req.path == '/' || req.path == '/napi/login/' || req.path == '/napi/logout' || req.path.indexOf('/static/') == 0 || req.path == '/api/settings' || req.path == '/api/esapi') {
    next();
    return;
  }
  if (req.session.authInfo) {
    next();
    return;
  }
  var error = new Error('没有登录');
  error.api_status = 2;
  return res.error(error);
}

module.exports = middleware;
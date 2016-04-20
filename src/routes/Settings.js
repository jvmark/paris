var url = require('url');

function settings(req, res) {
  // console.log(req.session);
  res.send({
    status: 1,
    data: {
      apiSettings: req.session.apiSettings
    }
  })
}

function updateSettings(req, res) {
  if (process.env.ENV == 'production') {
    return res.error(new Error('你不能修改线上环境的 API'));
  }
  var wwwAPI = req.body.wwwAPI;
  var buyAdminAPI = req.body.buyAdminAPI;
  if (!wwwAPI || !buyAdminAPI) {
    req.session.apiSettings = {}
    return res.success({
      apiSettings: req.session.apiSettings
    });
    // return res.error(new Error('所有字段不能为空'));
  }
  var parseResult1 = url.parse(wwwAPI);
  if (parseResult1.host == null || (!parseResult1.host.endsWith('duitang.net') && !parseResult1.host.endsWith('duitang.com'))) {
    return res.error(new Error('登录API域名必须是 duitang.com 子域名'));
  }

  var parseResult2 = url.parse(buyAdminAPI);
  if (parseResult2.host == null || (!parseResult2.host.endsWith('duitang.net') && !parseResult2.host.endsWith('duitang.com'))) {
    return res.error(new Error('有料管理API域名必须是 duitang.com 子域名'));
  }

  // if (parseResult2.host.endsWith(parseResult1.host)) {

  // }
  console.log(req.body);
  req.session.apiSettings = req.body;

  res.success({
    apiSettings: req.session.apiSettings
  });
}

module.exports = {
  settings: settings,
  updateSettings: updateSettings
}
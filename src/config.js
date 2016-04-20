// !!! 注意该配置位默认配置，请不要擅自修改，如需修改请通过 web 页面
var config = {
  wwwAPIDomain: 't000.v2.s.duitang.com',
  buyAdminAPIDomain: 'operate.t000.v2.s.duitang.com',
}

if (process.env.ENV == 'production') {
  config = {
    wwwAPIDomain: 'www.duitang.com', // www  api 域名配置，主要是登录，获取用户信息等
    buyAdminAPIDomain: 'operate.duitang.com', // buy admin api 域名配置，主要是商业后台数据操作
  }
} else if (process.env.ENV == 'preview') {
  config = {
    wwwAPIDomain: 'p.s.duitang.com', // www  api 域名配置，主要是登录，获取用户信息等
    buyAdminAPIDomain: 'operatep.s.duitang.com', // buy admin api 域名配置，主要是商业后台数据操作
  }
}

exports.config = config;
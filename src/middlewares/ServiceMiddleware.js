var BuyAdminService = require('../services/BuyAdminService');
var DuitangAuthService = require('../services/DuitangAuthService');

function middleware(req, res, next) {
  // req.services = {}
  // if (!req.session.authInfo) {
  //   next();
  // }
  // if (req.session.apiSettings) {
  //   var apiSettings = req.session.apiSettings;
  //   if (apiSettings.wwwAPI) {
  //     var duitangService = DuitangAuthService(apiSettings.wwwAPI, req.session.authInfo);
  //     req.services.duitangService = duitangService;
  //   }
  //   if (apiSettings.buyAdminAPI) {
  //     var buyAdminService = BuyAdminService(apiSettings.buyAdminAPI, req.session.authInfo);
  //     req.services.buyAdminService = buyAdminService;
  //   }
  // } else {
  //   var buyAdminService = BuyAdminService(null, req.session.authInfo);
  //   req.services.buyAdminService = duitangService;
  //   var duitangService = DuitangAuthService(null, req.session.authInfo);
  //   req.services.duitangService = duitangService;
  // }
  next();
}

module.exports = middleware;
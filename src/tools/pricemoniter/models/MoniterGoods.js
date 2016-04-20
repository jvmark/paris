var mongoose = require('../../../models/db').mongoose;

var MoniterGoods = mongoose.model('MoniterGoods', {
  spuID: String,
  inventoryID: String,
  inventoryName: String,
  supplierName: String,
  inventoryCategory: String,
  batchNO: String,
  salePrice: Number,
  settlePrice: Number,
  dalingID: String,
  kalaID: String,
  jumeiMallID: String,
  jumeiGlobalID: String,
  dalingPrices: [],
  jumeiMallPrices: [],
  jumeiGlobalPrices: [],
  kalaPrices: []
});

module.exports = MoniterGoods;
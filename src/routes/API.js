function getNavigationList(req, res) {
  // if (req.cookies.username == 'bjyy1234') {
  //   return res.json({
  //     status: 1,
  //     data: [{
  //       "name": "产品库",
  //       "items": [{
  //         "name": "条码扫描",
  //         "url": "/barcode/",
  //       }]
  //     }]
  //   })
  // }

  var items = [{
    "name": "订单系统",
    "items": [{
      "name": "订单管理",
      "url": "/order/"
    }, {
      "name": "运单号上传",
      "url": "/ticket/upload/"
    }, {
      "name": "退货单管理",
      "url": "/return/"
    }, {
      "name": "发货表下载",
      "url": "/order/payorders/"
    }, {
      "name": "结算单管理",
      "url": "/settle/"
    }, {
      "name": "结算单下载",
      "url": "/settle/download/"
    }]
  }, {
    "name": "产品库",
    "items": [{
      "name": "SPU管理",
      "url": "/SPU/list/"
    }, {
      "name": "新增SPU",
      "url": "/SPU/add/"
    }, {
      "name": "类目管理",
      "url": "/category/"
    }, {
      "name": "属性管理",
      "url": "/attribute/"
    }, {
      "name": "品牌管理",
      "url": "/SPUBRAND/add/",
    }, {
      "name": "条码扫描",
      "url": "/barcode/",
    }]
  }, {
    "name": "商品系统",
    "items": [{
      "name": "上下架管理",
      "url": "/shelves/"
    }, {
      "name": "供应商管理",
      "url": "/supplier/"
    }]
  }, {
    "name": "营销系统",
    "items": [{
      "name": "营销活动管理",
      "url": "/promotion/"
    }, {
      "name": "优惠券生成",
      "url": "/coupon/create/"
    }, {
      "name": "优惠券发放",
      "url": "/coupon/send/"
    }]
  }, {
    "name": "小工具",
    "items": [{
      "name": "外站商品搜索",
      "url": "/tools/search/"
    }]
  }];

  res.json({
    status: 1,
    data: items
  })
}


exports.getNavigationList = getNavigationList;
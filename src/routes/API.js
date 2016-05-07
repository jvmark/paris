function getNavigationList(req, res) {
  var items = [{
    "name": "学生",
    "items": [{
      "name": "个人信息修改",
      "url": "/changeStuInfo/"
    }, {
      "name": "就业信息查询",
      "url": "/jobInfoQuery/"
    }]
  }, {
    "name": "企业",
    "items": [{
      "name": "企业信息修改",
      "url": "/changeComInfo/"
    },{
      "name": "就业信息录入",
      "url": "/addJobInfo/"
    },{
      "name": "就业信息列表",
      "url": "/jobInfoList/"
    },{
      "name": "学生信息查询",
      "url": "/stuInfoQuery/"
    }]
  }, {
    "name": "管理员",
    "items": [{
      "name": "学生信息录入",
      "url": "/addStuInfo/"
    }, {
      "name": "学生信息查询",
      "url": "/stuInfoQuery/"
    }, {
      "name": "企业信息录入",
      "url": "/addComInfo/"
    }, {
      "name": "企业信息查询",
      "url": "/comInfoQuery/"
    }, {
      "name": "就业信息查询",
      "url": "/jobInfoQuery/"
    }]
  }];

  res.json({
    status: 1,
    data: items
  })
}


exports.getNavigationList = getNavigationList;
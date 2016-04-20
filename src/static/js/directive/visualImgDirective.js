angular.module('visualImgDirective', [])
/**
 * [多图上传功能]
 * @使用方式 <visual-img ng-model="spuInfo.packPicsList"  id="packPicsList"></visual-img>
 * @params   ng-model格式为[{'img': ''},{'img': ''}]的数组
 * @params   id为 唯一标示
 * @description 包括图片上传、点击放大、添加、删除、拖拽功能。
 * @author      turebetty
 * @email       qin.yang@duitang.com
 * @updateTime  2016-03-29T23:41:09+0800
 */
  .directive('visualImg', ['$http', function($http) {
    return {
      restrict: 'AE',
      scope: {
        pictureList: '=ngModel'
      },
      template: '<section class="span12"><div style="width:20px;height:20px;background:url(\'http://img4q.duitang.com/uploads/people/201508/31/20150831172927_ZyWfr.png\');background-size:cover;cursor:pointer;float:left;margin-top: 10px;margin-left: 0px" ng-click="addItem(pictureList,{img:\'\'})"></div>\
                      </div>\
                      <table style="display: block;margin-left: 0px" class="span4">\
                        <tr  style="padding:5px;" class="span12" ng-repeat="item in pictureList">\
                          <td class="span6">\
                            <input   id="{{specialId}}{{$index}}1"  type="text" style="width: 100%;" ng-model="item.img" style="width: 50%;" value="{{item.img}}">\
                          </td>\
                          <td class="span3">\
                            <div class="da-form-item" style="margin-left: 0px;">\
                              <form method="POST" enctype="multipart/form-data">\
                                <input type="file" id="{{specialId}}{{$index}}" name="local_file" class="l span2"/>\
                                <input type="submit" value="上传图片" class="btn btn-primary l" ng-click="upload($index,specialId+$index,item)"/>\
                              </form>\
                            </div>\
                          </td>\
                        </tr>\
                        <tr style="width:auto;display: inline-block;padding:10px 0 20px 20px;" ui-sortable ng-model="pictureList">\
                          <td  ng-repeat="item in pictureList" style="cursor:move;  float:left;" class="clr">\
                            <img style="margin-top:10px;border: 1px solid #ddd;width: 150px;height: 150px;float: left;"  src="{{item.img|transImg:item.img:150:150:\'c\'}}" ng-model="item.img" ng-click="enlarge(item.img)">\
                            <div style="width:20px;height:20px;background-size:cover;background:url(\'http://img4q.duitang.com/uploads/people/201508/31/20150831175107_fCBWv.png\');background-size:cover;cursor:pointer;float: left;" ng-click="removeItem(pictureList)"></div>\
                            <div style="width:20px;height:20px; float: left;"></div>\
                          </td>\
                        </tr>\
                      </table>\
                      <div ng-click="showImg=!showImg" ng-show="showImg" style="z-index: 9999; position: fixed;width:800px;height: 100%;top: 0;background:#fff;left: 50%;margin-left: -400px;">\
                        <img style="max-width: 100%;max-height: 100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);" src="{{bigImg}}">\
                      </div></section>',
      link: function(scope, iElement, iAttrs) {
        scope.specialId = iAttrs['id'];
        scope.addItem = function(obj_, empty_) {
          obj_.push(empty_);
        }
        scope.removeItem = function(obj_) {
          obj_.splice(this.$index, 1);
        }
        scope.enlarge = function(url) {
          scope.bigImg = url;
          scope.showImg = true;
        }
        scope.upload = function(fileInex_, fileId_, resultObj_) {
          var root = scope.root;

          var file = $('#' + fileId_)[0].files[0];
          var formData = new FormData();
          formData.append("root", root);
          formData.append("img", file);
          formData.append("data", 'img');
          formData.append("type", 'blog');
          var xhr = new XMLHttpRequest();
          //设置回调函数
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var _json = JSON.parse(xhr.responseText);
              if (_json.status == 1) {
                resultObj_.img = _json.data.img_url;
                alert("上传成功");
              } else {
                alert(JSON.parse(xhr.responseText).message);
              }
            }
          }
          xhr.open("POST", "/napi/upload/photo/", true);
          xhr.withCredentials = true;
          // 发送表单数据
          xhr.send(formData);
        }
      }
    };
  }]);
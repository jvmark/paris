/**
 * 图片上传组件
 * @description 图片上传组件
 * @author      johnnyjiang
 * @createTime           2016-01-20T16:31:09+0800
 */
angular.module('DtUpload', [])
  /**
   * 单图上传组件
   * @description  使用方式 <dt-image-upload ng-modal="modalA"/>
   * ps:如需添加 图片地址预览 需要加一个 <input type="text" ng-modal="modalA"/>
   * @author            johnnyjiang
   * @email                                         johnnyjiang813@gmail.com
   * @createTime           2016-01-20T18:34:26+0800
   */
  .directive('dtImageUpload', ['$http', function($http) {
    var _id = (new Date()).getTime();
    return {
      restrict: 'E',
      scope: {
        imgSrc: '=ngModel'
      },
      template: '<div id="' + _id + '" class="btn btn-primary" style="position:relative">' +
        '<input style="position: absolute;width: 100%;height: 100%;opacity: 0;left: 0;top: 0;z-index: 9999;" type="file" name="image"/><span>上传图片</span></div>',
      link: function(scope, iElement, iAttrs) {
        var _inputFile = iElement.find('input[type="file"]');
        var disPlayA = iElement.find('span');
        _inputFile.on('change', function(e) {
          var _this = this;
          if (disPlayA.find('i').length > 0) {
            disPlayA.find('i').remove();
          }
          disPlayA.text("上传中..");
          //图片上传
          uploadAjax(_this, function(jsn) {
            var data = jsn.data;
            _this.value = '';
            disPlayA.text("上传图片");
            if (data.status === 1) {
              disPlayA.append('<i class="icol-accept"></i>');
              scope.imgSrc = jsn.data.data.img_url;
            } else {
              disPlayA.append('<i class="icol-cross"></i>');
              var wrongmsg = data.message || '出错了，但是后端没有提示错误信息';
              SUGAR.PopOut.alert('<div class="prompt"><h3>' + wrongmsg + '</h3></div>');
            }
          });
        });
        //图片上传
        function uploadAjax(ele, fn) {
          ele.disabled = true;
          var _fData = new FormData();
          _fData.append('img', ele.files[0]);
          _fData.append('type', 'blog');
          _fData.append('data', 'img');
          $http({
              url: '/napi/upload/photo/',
              method: 'POST',
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              },
              data: _fData
            })
            .then(function(jsn) {
              ele.disabled = false;
              if (typeof fn === 'function') {
                fn(jsn);
              } else {
                SUGAR.PopOut.alert('<div class="prompt"><h3>callback is not function!</h3></div>');
              }
            }, function(error) {
              SUGAR.PopOut.alert('<div class="prompt"><h3>' + angular.toJson(error) + '</h3></div>');
            });
        }
      }
    };
  }]);
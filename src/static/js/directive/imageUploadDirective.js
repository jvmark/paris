angular.module('imageUploadDirective', [])
.directive('upload', ['BaseService', function(BaseService){
  return {
    restrict: 'AE',
    scope: {
      url: '=ngModel'
    },
    template:
              '<input type="text" style="width:100%" ng-model="url" >'+
              '<form id="imageUploadForm" enctype="multipart/form-data" action="/napi/upload/photo/" target="frameFile" method="post">'+
              '<input type="file" accept="image/*" id="imageUpload" name="img">'+
              '<input type="submit" id="imageUploadButton">'+
              '</form>'+
              '<iframe id="frameFile" name="frameFile" style="display: none;"></iframe>',
    link: function(scope, ele, attrs) {
      $('#imageUploadButton').click(function(){
        $('#imageUploadForm').submit(function() {
          $(this).ajaxSubmit({
            success: function(data){
              if(data.status === 1) {
                scope.$apply(function(){scope.url = data.data.img_url})
              } else {
                var wrongmsg = data.message || '出错了，但是后端没有提示错误信息';
                SUGAR.PopOut.alert('<div class="prompt"><h3>'+wrongmsg+'</h3></div>')
              }
            }
          });
        })
      })
    }
  }
}])

/**
功能：ajax上传图片
参数：link-ele为img_url显示的dom，id-ele为img_id的dom
用法：<ajax-upload link-ele="#photo_link" id-ele="#media_id">上传图片</ajax-upload>
**/
.directive('ajaxUpload', ['BaseService', function(BaseService){
  return {
    restrict: 'AE',
    template: '<div class="btn btn-sm btn-uploadpic" >上传图片</div>',
    link: function(scope, ele, attrs) {
      $('body').append('<div id="win-house" class="hide">'+
              '<div class="dn">'+
                '<div id="upload-img" class="form-container">'+
                  '<form id="da-ex-dialog-form-val" class="da-form" enctype="multipart/form-data" action="/napi/upload/photo/" method="post">'+
                    '<div id="da-validate-error" class="da-message error" style="display:none;"></div>'+
                    '<div class="da-form-inline">'+
                      '<div class="da-form-row">'+
                        '<label class="da-form-label">选择本地图片</label>'+
                        '<div class="da-form-item large">'+
                          '<input type="file" name="img" id="upload-pic" class="da-custom-file">'+
                          '<input type="text" name="type" style="display:none" value="blog">'+
                          '<span class="form-help">JPEG, JPG, PNG, GIF only</span>'+
                          '<label for="picture" class="error" generated="true" style="display:none;"></label>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '<button class="btn btn-sm btn-uploadpic-done r" style="margin:20px 80px">确认上传</button>'+
                  '</form>'+
                '</div>'+
              '</div>'+
            '</div>')
      $(document).on('click', '.btn-uploadpic', function(e){
        e.preventDefault();
        e.stopPropagation();
        var $t = $(this);
        var $Modulelist = $t.closest('.Modulelist');
        $img = $Modulelist.find('img');
        SUGAR.PopOut.alert(["上传图片",$('#upload-img')],2,{position:'absolute'});
      })
      // 确认上传图片
      .on('click', '.btn-uploadpic-done', function(e){
        e.preventDefault();
        e.stopPropagation();
        uploadPic();
      })
      // tools func start
      function uploadPic() {
        var $uploadimg_dialog = $('#upload-img'),
            $formUploadPic = $('#da-ex-dialog-form-val');
        $formUploadPic.ajaxSubmit({
          mysuccess: function(jsn) {
            $(ele).attr('img_url', jsn.data.img_url);
            $(ele).attr('photo_width', jsn.data.photo_width);
            $(ele).attr('photo_height', jsn.data.photo_height);
            $(ele).attr('photo_id', jsn.data.photo_id);
            $($(ele).attr('link-ele')).val(jsn.data.img_url);
            $($(ele).attr('id-ele')).val(jsn.data.photo_id);
            SUGAR.PopOut.closeMask();
          }
        });
      }
    }
  }
}])
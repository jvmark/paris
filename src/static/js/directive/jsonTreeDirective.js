/**
 * @description 该控件可以把json转换成树形图，且需要添加下面两个文件
 * <link rel="stylesheet" type="text/css" href="/static/libs/jsoneditor/jsoneditor.min.css">
 * <script src="/static/angular/js/directive/jsonTreeDirective.js"></script>
 * @parms       init-json为初始，ng-model为返回的值
 * @useWay      <json-tree ng-model='jsonStr' init-json="{{jsonStr}}"></json-tree>
 * @author      turebetty
 * @updateTime  2015-07-07T21:50:52+0800
 */
angular.module('jsonTreeDirective', [])
.directive('jsonTree', ['BaseService', function(BaseService){
  return {
    restrict: 'AE',
    template:
              '<div class="clr">'+
                '<div class="dn"></div>'+
                '<div id="jsonEditor" class="l" style="width: 40%; height: 400px;"></div>'+
                '<div id="splitter" class="l tc splitter">'+
                  '<a id="totree" class="convert totree" title="Copy code to tree editor" href="javascript:;">'+
                  '&gt;'+
                  '</a>'+
                  '<a id="tocode" class="convert tocode" title="Copy code to code editor" href="javascript:;">'+
                  '&lt;'+
                  '</a>'+
                '</div>'+
                '<div id="treeEditor" class="l" style="width: 40%; height: 400px;"></div>'+
              '</div>',
    link: function(scope_, ele_, attrs_) {
      $(".splitter").css({
        width: '40px',
        height: '100%',
        padding: '10px'
      });
      $(".convert").css({
        display: 'block',
        background: 'linear-gradient(to bottom, #fff, #e6e6e6)',
        padding: '10px',
        textDecoration: 'none',
        color: '#666',
        fontWeight: 'bolder',
        borderRadius: '3px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05)',
        border: '1px solid #ccc'
      });
      $(".totree").css({
        marginTop:'130px'
      });
      $(".tocode").css({
        marginTop:'10px'
      });

      // tree editor
      var container1 = document.getElementById("treeEditor");
      var options1 = {
          "mode": "tree",
          "search": true
      };
      var editor1 = new JSONEditor(container1, options1);
      try {
        var json1 = JSON.parse(attrs_['initJson']);
      }
      catch(e) {
        return false;
      }
      editor1.set(json1);
      editor1.expandAll();

      //edit json
      var container = document.getElementById("jsonEditor")
      var options = {
          "mode": "text",
          "indentation": 2
      };
      var editor = new JSONEditor(container, options);

      try {
        var json = JSON.parse(attrs_['initJson']);
      }
      catch(e) {
        alert('后台返回 json 格式错误');
        return false;
      }
      editor.set(json);
      //把json转换成树状的按钮
      $('#totree').click(function(e) {
        e.preventDefault();
        var json = $('#jsonEditor').find('textarea').val() || '';
        try {
            var json = JSON.parse($('#jsonEditor').find('textarea').val());
        }
        catch(e) {
            alert("请输入正确的 json 格式");
            return false;
        }
        //把json赋值给ngModel中所写的变量，需要用eval.
        var strName = attrs_['ngModel'];
        eval('scope_.'+strName + '=' + JSON.stringify(json));
        editor1.set(json);
        $('.expand-all').click();
      });
      //把树状图转换成json的按钮
      $('#tocode').click(function(e) {
        e.preventDefault();
        var json = editor1.get();
        editor.set(json);
        //把json赋值给ngModel中所写的变量，需要用eval.
        var strName = attrs_['ngModel'];
        eval('scope_.'+strName + '=' + JSON.stringify(json));
      });
      //监听ngModel中多写变量的值的变化，使值的变化反应在jsontree上。
      scope_.$watch(attrs_['ngModel'],function(new_, scope){
        editor.set(JSON.parse(new_));
        editor1.set(JSON.parse(new_));
      });
    }
  }
}])
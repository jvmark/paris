/**
 * @description 该控件可以把json转换成树形图，且需要添加下面两个文件
 * <link rel="stylesheet" type="text/css" href="/static/libs/jsoneditor/jsoneditor.min.css">
 * <script src="/static/angular/js/directive/jsonTreeDirective.js"></script>
 * @parms       init-json为初始，ng-model为返回的值
 * @useWay      <json-tree ng-model='jsonStr' init-json="{{jsonStr}}"></json-tree>
 * @author      turebetty
 * @updateTime  2015-07-07T21:50:52+0800
 */
angular.module('csvToJsonDirective', [])
.directive('csvToJson', ['BaseService', function(BaseService){
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
      alert('csvToJson');
    }
  }
}])
/* 
@说明：按钮点击确认
@作者：hugin 
@时间：2014-12-08
*/

angular.module('ngConfirmClickDirective', [])
  .directive('ngConfirmClick', [
    function(){
      return {
        link: function (scope, element, attr) {
          var msg = attr.ngConfirmClick || "Are you sure?";
          var clickAction = attr.confirmedClick;
          element.bind('click',function (event) {
            if ( window.confirm(msg) ) {
                scope.$eval(clickAction)
            }
          });
        }
      };
    }])
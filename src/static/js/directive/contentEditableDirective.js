/* 
@说明：table 可编辑
@作者：xxx
@时间：2014-12-08
*/

angular.module('contentEditableDirective', [])
  .directive('contentEditable', [
    function() {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          // view -> model
          elm.bind('blur', function() {
            scope.$apply(function() {
              ctrl.$setViewValue(elm.html());
            });
          });

          // model -> view
          ctrl.render = function(value) {
            elm.html(value);
          };

          // load init value from DOM
          ctrl.$setViewValue(elm.html());

          elm.bind('keydown', function(event) {
            console.log("keydown " + event.which);
            var esc = event.which == 27,
              el = event.target;

            if (esc) {
              ctrl.$setViewValue(elm.html());
              el.blur();
              event.preventDefault();
            }
          });
        }
      };
    }
  ])
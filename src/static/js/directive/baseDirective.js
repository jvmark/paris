/**
 * [createSupplier 该插件可以把数字固定成几位数]
 * @parms      取ng-model ,变成num属性里的位数
 *  @useWay      <input ng-model='jsonStr'  type='text' num_limit num='4'>
 * @author      turebetty
 * @email       qin.yang@duitang.com
 * @updateTime  2015-12-29T14:08:40+0800
 */
angular.module('baseDirective', [])
.directive('numLimit', [function(){
  return {
    restrict: 'AE',
    link: function(scope_, ele_, attrs_) {
      scope_.$watch(attrs_['ngModel'],function(new_, scope){
        var originNo = new_;
        var num = parseInt(attrs_['num']);
        if(originNo != 0 && originNo != '' && typeof(originNo) != 'undefined'){
           var no= Array(Math.max(0,(num+1)-originNo.toString().length)).join(0)+originNo;
           var returnNo = no.substr(no.length-num,num)
            ele_.val(returnNo) ;
        }
      });
    }
  }
}])
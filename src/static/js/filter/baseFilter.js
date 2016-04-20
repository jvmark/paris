angular.module('baseFilter', [])
/**
 * [把数字变成固定位数]
 * @param       {[type]}          num       需要修改数字
 * @param       {[type]}          n            需要保留位数
 *  @useWay      {{ "44" | numLimit:4}}
 * @author      turebetty
 * @email       qin.yang@duitang.com
 * @updateTime  2015-12-29T14:14:58+0800
 */
.filter("numLimit", function() {
    var filterfun = function(num, n) {
      if(num){
         return  Array(Math.max(0,(n+1)-(num).toString().length)).join(0)+num;
      }else{
        return '';
      }
    };
    return filterfun;
});









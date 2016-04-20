angular.module('transImgFilter', [])
/**
 * [图片缩略,页面中使用]
 * @param       {[string]}               ) {               var filterfun [原图路径]
 * @param       {[num]}                  ) {               var filterfun [缩略宽]
 * @param       {[num]}                  ) {               var filterfun [缩略高]
 * @param       {[string]}               ) {               var filterfun [缩略方式]
 * @return      {[string]}                    [description]
 * @useWay      {{imgUrl|transImg:imgUrl:150:150:'c'}}
 * @description
 * @author      pebusney
 * @email       jingjing.guan@duitang.com
 * @updateTime  2016-03-15T10:45:50+0800
 */
.filter("transImg", function() {
    var filterfun = function(url,t,w,h,c){
    var pathn = $.trim(url).replace(/^http(s)?:\/\//ig,''),
      pathn = pathn.split('/'),
      domain = pathn[0],
      pathn = pathn[1];

    // 只有堆糖域名下 uploads misc 目录下的图片可以缩略
    if( domain.indexOf('duitang.com') == -1 || !pathn || pathn != 'uploads' && pathn != 'misc' ){
      return url;
    }
    if(t){
      w = w || 0;
      h = h || 0;
      c = c ? '_'+c : ''
      return $.G.dtImageTrans(url).replace(/(\.[a-z_]+)$/ig,'.thumb.'+w+'_'+h+c+'$1')
    }else{
      return url.replace(/(?:\.thumb\.\w+|\.[a-z]+!\w+)(\.[a-z_]+)$/ig,'$1')
    }
  }
    return filterfun;
});
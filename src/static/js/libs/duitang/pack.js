/*
@说明：产品级公用js文件，产品级公用js 方法
@作者：balibell
@时间：2013-07-17
*/





(function (){
  //写入cookie，以供服务器端读取，判断是否至此后javascript
  document.cookie = 'js=1; path=/';
})();



/*
描述：堆糖网内部调试用用方法，等同于alert 或 console.log
通过发布脚本，识别merge start 和 merge end 去掉a方法内容定义
参数：
s        - (Str/Num) 提示字符串
*/
function aaa(s){
/*merge start*/

  if( ($.browser.mozilla || $.browser.webkit ) && typeof(console)==='object' && console.log ){
    console.log(s);
    return;
  }

  var $dbug = $('#debug-cont')
  if(!$dbug.length){
    $('<div id="debug-cont" style="height:260px;padding:8px;border:2px solid #f00;background:#fff;overflow:scroll;overflow-x:hidden;"><p><b style="color:#f00">1:// </b>'+s+'</p></div>').sidepop({
      id : 'debug',
      dockSide : 'left',
      zIndex : 9999,
      width : 400,
      scroll : 1,
      departure : 4,
      baseline : 'bottom',
      bias : 10,
      isFixed : true,
      btnset : 2
    })
    .closest('.debug').find('.SG-sidebar').css('padding-right',16)
    $dbug = $('#debug-cont').after('<a style="float:right;margin:-24px 20px 0 0" href="javascript:;" onclick="$(\'#debug-cont\').html(\'\')">清空</a>')
  }else{
    $dbug.append('<p><b style="color:#f00">'+($dbug.find('p').length+1)+':// </b>'+s+'</p>').scrollTop($dbug[0].scrollHeight);
  }
/*merge end*/
}


/*
扩展 $.G  堆糖全局工具类
*/

$.G = {
  gaq : function (trc){
    // 新增堆糖内部打点 kibana

    var uid = $.G.getUSERID(),
      uidparam = uid ? "&userid="+uid : "";
    // new Image().src = "http://da.dtxn.net/da.gif?kibana="+trc + uidparam +"&url="+encodeURIComponent(window.location.hostname+window.location.pathname);
    typeof _gaq != "undefined" && _gaq && _gaq.push(['_trackPageview', trc]);
  },
  isRedirect : function (hrf){
    hrf = hrf.split('?')[0];
    return hrf.indexOf('/dj/go2/') > -1 || hrf.indexOf('/redirect/') > -1;
  },
  addfavorite : function (url,title){
    if (document.all){
      window.external.addFavorite(url,title);
      return true;
    }else if (window.sidebar && window.sidebar.addPanel){
      window.sidebar.addPanel(title, url, "");
      return true;
    }
    return false;
  },

  /*
  描述：将一个dom节点，或者jquery节点暂时recycle 到隐藏的 #win-house
  */
  store : function ($d){
    var $whouse = $('#win-house');

    //判断有无win-house，没有则添加
    if( !$whouse.length ){
      $whouse = $('<div id="win-house" class="h0"></div>').appendTo('body');
    }

    $d && $whouse.append($d);

    return $whouse;
  },

  /*
  描述：获得当前的token 有不同的形式
  @参数： f      - (Num) f=1 token 值【f=1被禁用请改用getTokenVal】;  f=2 返回json格式; f=3 返回html str; 为null 返回键值对字符串
  */
  getToken : function (f){
    var r = {},
      ck = '',
      kv = '',
      str = '',
      $W = $(window),
      ver = $W.data('verif') || [], // 反广告垃圾
      $to = $('input','#form-token');
    if( ck = $.Bom.getCookie('csrftoken') ){
      kv = 'csrfmiddlewaretoken=' + ck;
      r['csrfmiddlewaretoken'] = ck;
    }else if( $to.length ){
      ck = $to.val();
      r['csrfmiddlewaretoken'] = ck;
      kv = $.param(r)
    }
    str = '<input type="hidden" name="csrfmiddlewaretoken" value="'+ck+'" />';

    // 这里的 ck 没有实际作用，直接判断 ver
    if( ver.length ){
      kv += '&ccode=' + ver[0];
      kv += '&ctoken=' + ver[1];
      r['ccode'] = ver[0];
      r['ctoken'] = ver[1];
      str += '<input type="hidden" name="ccode" value="'+ver[0]+'" /><input type="hidden" name="ctoken" value="'+ver[1]+'" />';
    }
    return f ? f == 3 ? str : f == 2 ? r : kv : kv;
  },


  /*
  @说明：获取当前页面的token 值
  */
  getTokenVal : function (){
    var ck = '',
      $to = $('input','#form-token');
    if( ck = $.Bom.getCookie('csrftoken') ){

    }else if( $to.length ){
      ck = $to.val();
    }
    return ck;
  },

  /*
  描述：设置session级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  setCookie : function (name,value){
    $.Bom.setSubCookie('sg',name,value);
  },

  /*
  描述：设置天级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  setDayCookie : function (name,value){
    $.Bom.setSubCookie('sgd',name,value,{expires:1});
  },

  /*
  描述：设置周级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  setWeekCookie : function (name,value){
    $.Bom.setSubCookie('sgw',name,value,{expires:7});
  },

  /*
  描述：设置月度级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  setMonthCookie : function (name,value){
    $.Bom.setSubCookie('sgm',name,value,{expires:30});
  },

  /*
  描述：设置年度级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  setYearCookie : function (name,value){
    $.Bom.setSubCookie('sgy',name,value,{expires:365});
  },


  /*
  描述：获取session级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  getCookie : function (name){
    return $.Bom.getSubCookie('sg',name);
  },

  /*
  描述：获取天级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  getDayCookie : function (name){
    return $.Bom.getSubCookie('sgd',name);
  },

  /*
  描述：获取周级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  getWeekCookie : function (name){
    return $.Bom.getSubCookie('sgw',name);
  },

  /*
  描述：获取月度级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  getMonthCookie : function (name){
    return $.Bom.getSubCookie('sgm',name);
  },

  /*
  描述：获取年度级别的Cookie， 不同级别的SubCookie —— year month week day session
  */
  getYearCookie : function (name){
    return $.Bom.getSubCookie('sgy',name);
  },

  /*
  描述：简单的水平方向marquee 效果
  参数：
  o        - (selector) Dom节点对象
  delay    - (Num)  每次marquee之间的间隔时间
  steplen  - (Num)  某一次marquee 过程的步长
  speed    - (Num)  某一次marquee 过程的速度
  */
  simpleMarqueeW : function(o,delay,steplen,speed){
    var $o = $(o),
      fc = $o.find(':first-child'),
      $p = $o.parent();

    if(fc.length){
      var delay = delay||4000, steplen=steplen||2, speed=speed||20, tm, pause = false,fc, ht;
      var start = function(){
        ht = fc.outerWidth(true);
        clearInterval(tm)
        tm=setInterval(slide, speed)
      }
      var slide = function(){
        if(pause) return;

        if($p.scrollLeft() + steplen >= ht) {
          clearInterval(tm);
          $o.append(fc);
          $p.scrollLeft(0);
          setTimeout(start, delay)
        }else{
          $p.scrollLeft($p.scrollLeft()+steplen);
        }
      }
      $o.mouseover(function (){
        pause=true
      })
      $o.mouseout(function (){
        pause=false
      })
      setTimeout(start, delay)
    }
  },

  /*
  描述：简单的垂直方向marquee 效果
  参数：
  o        - (selector) Dom节点对象
  delay    - (Num)  每次marquee之间的间隔时间
  fdelay   - (Num)  第一次执行的等待时间
  steplen  - (Num)  某一次marquee 过程的步长
  speed    - (Num)  某一次marquee 过程的速度
  */
  simpleMarqueeH : function(o,delay,fdelay,steplen,speed){
    var $o = $(o),
      fc = $o.find(':first-child');

    if(fc.length){
      var delay = delay||4000, steplen=steplen||2, speed=speed||20, tm, pause = false,fc, ht;
      var start = function(){
        ht = fc.outerHeight(true);
        clearInterval(tm)
        tm=setInterval(slide, speed)
      }
      var slide = function(){
        if(pause) return;
        if($o.scrollTop() + steplen >= ht) {
          clearInterval(tm);
          $o.append(fc);
          $o.scrollTop(0);
          setTimeout(start, delay)
        }else{
          $o.scrollTop($o.scrollTop()+steplen);
        }
      }
      $o.mouseover(function (){
        pause=true
      })
      $o.mouseout(function (){
        pause=false
      })

      setTimeout(start, fdelay)
    }
  },


  /*
  描述：平滑scroll 到指定的 anchor
  参数：
  anchor   - (Str)  anchor对应的 name 值
  diff     - (Num)  位置修正，一般为正值
  */
  scrollToAnchor : function (anchor,diff){
    var diff = diff || 0,
      $W = $(window),
      $body = $('body,html'),
      $tohsh = $('a[name='+anchor+']');

    // 分页内容容器置空，先置空内容再做 anchor 定位
    if( anchor && $tohsh.length ){
      // 此处由于导航设置fix 跟随，需要额外减去70 的高度
      var at = $tohsh.offset().top - diff || 0;
      $body.animate({scrollTop:at},200);
    }else{
      // 除了ie6 其它浏览器不要设置默认回顶部，会造成切换时页面跳动
      // 这里用到了 ActiveXObject 和 XMLHttpRequest 对象来区分 ie6
      if( !!window.ActiveXObject && !window.XMLHttpRequest ){
        $body.animate({scrollTop:at},200);
      }
    }
  },


  /*
  描述： bindChecks : 绑定主checkbox 和子checkbox 当主选中，则全选；未选中，则全不选
  依赖：
      <input id="mainck" type="checkbox" name="a" />
      <div id="checks">
        <input type="checkbox" name="a" />
        <input type="checkbox" name="a" />
        <input type="checkbox" name="a" />
        <input type="checkbox" name="a" />
      </div>
  参数：
  id          - (idselector) 主checkbox，改变它则联动改变子checkbox
  id2         - (idselector) 子checkbox的父亲节点
  f         - (Bool) 主checkbox 是否初始为选中状态
  fnb         - (Fun) before main check value haschanged
  fna         - (Fun) after main check value haschanged
  fncks       - (Fun) 子checkbox 被点击后执行的方法
  */
  bindChecks : function(id,id2,f,fnb,fna,fncks){
    var selcks = 'input[type=checkbox],[checked],[checked=false]',
      $id = $(id),
      $id2 = $(id2);

    function funa($idt){
      var av = [],
        rs = '',
        $cks = $id2.find(selcks); //重新获取子选项，可能会有被删除

      if($idt.prop('checked')){
        $cks.each(function (i,a){
          var $a = $(a),
            atv = $a.attr('value');
          $a.prop('checked',true);

          if( atv !== undefined ){
            $a.attr('dvalue',atv);
          }
          av.push($a.attr('dvalue'));
        })
        $id.prop('checked',true).add($cks).addClass('checked')
      }else{
        $cks.each(function (i,a){
          $(a).prop('checked',false);
        })
        $id.prop('checked',false).add($cks).removeClass('checked')
      }

      rs = $.trim(av.join(' ')).replace(/ /ig,',');
      $id.attr('dvalue', rs);
      $id.filter('[type=checkbox]').val(rs);
    }

    if(f){
      $id.prop('checked',true);
    }else if( f !== undefined ){
      $id.prop('checked',false);
    }else if( $id.attr('dchecked') == 'true' ){
      $id.prop('checked',true);
    }else if( !$id.prop('checked') ){
      $id.prop('checked',false);
    }
    funa($id);

    // 如果不是 checkbox 则需要先绑定此事件
    if( $id.attr('type') != 'checkbox' ){
      $id.click(function (e){
        var canpass = true;
        if( $.isFunction(fnb) ){
          canpass = fnb();
        }
        if( canpass ){
          $id.prop('checked',!$id.prop('checked'))
        }
      })
    }

    //主checkbox click 事件绑定
    $id.click(function (e){
      e.stopPropagation()
      var $this = $(this),
          canpass = true; // 是否可以进入 checkvalue 值的修改阶段， fnb 返回值影响
      if( $.isFunction(fnb) ){
        canpass = fnb.call(this,$id,$id2,selcks);
      }
      if( canpass ){
        funa($this);
        if( $.isFunction(fna) ){
          fna.call(this,$id,$id2,selcks); // 在checkvalue 值修改结束后执行的方法，一般 fna fnb 配合使用
        }
      }
    })

    //子checkbox click 事件绑定，依赖核心库文件中对 array 的扩展 remove 方法
    $id2.delegate(selcks,'click',function (e){
      e.stopPropagation()
      var $this = $(this);
      // 如果不是 checkbox 则需要下执行之
      if( $this.attr('type') != 'checkbox' ){
        $this.prop('checked',!$this.prop('checked'))
      }
      var dvv = $.trim($id.attr('dvalue')),
        arrv = dvv ? dvv.split(',') : [],
        rs = '',
        v = $this.attr('value');
      if( v !== undefined ){
        $this.attr('dvalue', v)
      }
      v = $this.attr('dvalue');

      arrv = $(arrv).filter(function (i,a){
        return a !== v
      }).get()


      var cked = $this.prop('checked');
      if( cked ){
        arrv.push(v);
        $this.addClass('checked')
      }else{
        $this.removeClass('checked')
      }

      rs = $.trim(arrv.join(' ')).replace(/ /ig,',');
      $id.attr('dvalue', rs);
      if( $id.attr('type') == 'checkbox' ){
        $id.val(rs);
      }

      if( $.isFunction(fncks) ){
        fncks.call(this,$id,$id2,selcks,cked)
      }
    })
  },


  /*
  描述：获取textarea 文本光标所在的字符位置
  参数：
  textarea        - (Obj) textarea文本框
  */
  getCursorPosition : function(textarea){
    var rangeData = {text: "", start: 0, end: 0 };
  //    textarea.focus();
    if (textarea.setSelectionRange) { // W3C
      rangeData.start= textarea.selectionStart;
      rangeData.end = textarea.selectionEnd;
      rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
    } else if (document.selection) { // IE
      var i,
        oS = document.selection.createRange(),
        // Don't: oR = textarea.createTextRange()
        oR = document.body.createTextRange();
      oR.moveToElementText(textarea);

      rangeData.text = oS.text;
      rangeData.bookmark = oS.getBookmark();

      // object.moveStart(sUnit [, iCount])
      // Return Value: Integer that returns the number of units moved.
      for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
        // Why? You can alert(textarea.value.length)
        if (textarea.value.charAt(i) == '\n') {
          i ++;
        }
      }
      rangeData.start = i;
      rangeData.end = rangeData.text.length + rangeData.start;
    }

    return rangeData;
  },

  /*
  描述：设置textarea 文本光标所在的字符位置
  参数：
  textarea        - (Obj) textarea文本框
  rangeData       - (Jsn) {start:1,end:10}
  */
  setCursorPosition : function(textarea, rangeData){
    if(!rangeData) {
      alert("You must get cursor position first.")
    }
    if (textarea.setSelectionRange) { // W3C
      textarea.focus();
      textarea.setSelectionRange(rangeData.start, rangeData.end);
    } else if (textarea.createTextRange) { // IE
      var oR = textarea.createTextRange();
      // Fixbug :
      // In IE, if cursor position at the end of textarea, the setCursorPosition function don't work
      if(textarea.value.length === rangeData.start) {
        oR.collapse(false)
        oR.select();
      } else {
        oR.moveToBookmark(rangeData.bookmark);
        oR.select();
      }
    }
  },



  /*
  @说明：获取页面上选中的文字
  */
  getSelectedText : function(){
    var W = window, D = document;
    if (W.getSelection) {
      // This technique is the most likely to be standardized.
      // getSelection() returns a Selection object, which we do not document.
      return W.getSelection().toString();
    }else if (D.getSelection) {
      // This is an older, simpler technique that returns a string
      return D.getSelection();
    }else if (D.selection) {
      // This is the IE-specific technique.
      // We do not document the IE selection property or TextRange objects.
      return D.selection.createRange().text;
    }
  },

  /*
  描述：重复执行某个方法多次
  参数：
  fn1        - (Fun) 闪烁执行的方法1
  fn2        - (Fun) 闪烁执行的方法2
  fn3        - (Fun) 闪烁结束后执行的方法3
  n          - (Num) 反复执行的次数
  t          - (Num) 闪烁间隔时间毫秒单位
  */
  blinkIt : function(fn1,fn2,fn3,n,t){
    t = t || 1000;
    if(n===0){fn3();return;}

    if($.isFunction(fn1)){
      fn1();
    }
    window.setTimeout(function (){
      $.G.blinkIt(fn2,fn1,fn3,--n,t)
    },t)
  },



  /*
  描述：递归调用一个方法
  */
  recurseDo : function(fn,arr,n,delay,callback){
    if( n == 0 ){
      if( $.isFunction(callback) ){
        callback()
      }
      return;
    }
    //fn 必须返回一个数组
    arr = fn.apply(null,arr)

    if( arr[0].length ){
      setTimeout(function (){
        $.G.recurseDo(fn,arr,--n,delay,callback)
      },delay)
    }else{
      if( $.isFunction(callback) ){
        callback()
      }
    }
  },



  /*
  描述：获取当前用户ID
  */
  getUSERID : function(){
    if( typeof USER !== 'undefined' && USER.ID ){
      return USER.ID
    }else{
      return ''
    }
  },

  /*
  描述：获取当前用户ID
  */
  isSTAFF : function(){
    if( typeof USER !== 'undefined' && USER.ISSTAFF ){
      return true
    }else{
      return false
    }
  },


  /*
  @说明：堆糖缩略图转换
  @参数：
  url      - (Str) 待处理的url地址
  t        - (Num) 转换类型  默认0-返回原图  1-返回缩略图
  w        - (Num) 返回缩略图的宽
  h        - (Num) 返回缩略图的高
  c        - (Bool) 是否截取正方形 a-左边截图  b-右边截图 c-中间截图
  */
  dtImageTrans : function(url,t,w,h,c){
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
  },


  /*
  描述： getFitSize : 在区间内给出合适的等比输出值，可参详setImgSize 的功能
  参数：
  a       - (Arr) 待处理的高宽
  b       - (Arr) 范围高宽数组
  */
  getFitSize : function(a,b){
    if(a[0]&&a[1]&&b[0]){
      if(!b[1]) b[1]=b[0];
      if(a[0]>b[0]||a[1]>b[1]) {
        var scale=a[0]/a[1],fit=scale>=b[0]/b[1];
        return fit?[b[0],parseInt(b[0]/scale)]:[parseInt(b[1]*scale),b[1]];
      }
    }
    return a;
  },


  /*
  描述： setImgSize : img 重定义宽度、高度
  参数： B       - (Obj) 待处理的img 对象
  D       - (Num) 宽度限制，图片重定义后最大宽度不得超过此值
  A       - (Num) 高度限制，图片重定义后最大高度不得超过此值
  */
  setImgSize : function(img,w,h){
    //防止onload 反复执行
    img.onload = null;

    img.removeAttribute("width");
    img.removeAttribute("height");
    var pic=img;
    //check images exist and width&height >0 and custom width >0
    if(pic&&pic.width&&pic.height&&w) {
      if(!h) h=w;
      if(pic.width>w||pic.height>h) {
        var scale=pic.width/pic.height,fit=scale>=w/h;
        img[fit?'width':'height']=fit?w:h;
        if(document.all)img[fit?'height':'width']=(fit?w:h)*(fit?1/scale:scale);
      }
    }
    img.style.visibility = 'visible';
  },


  /*
  描述：setImgSizeByAncestor 据其父层的宽度重定义img 的宽度，高度不考虑
  依赖：setImgSize 方法
  参数：
  img        - (Obj) 待处理的img 对象
  selector   - (Str) 父层的选择器，通过其找到父层节点
  */
  setImgSizeByAncestor : function(img,selector){
    //防止onload 反复执行
    img.onload = null;

    var a = $(img).parent(selector)[0];
    if(a){
      var w = parseInt($(a).css('width'));
      w = w ? w : a.offsetWidth;
      $.G.setImgSize(img,w);
    }
  },


  /*
  描述：取出字符串中第一次出现的正数，可含小数点
  参数：
  str        - (Str) 待处理字符串
  */
  getNum : function(str){
    return str ? +str.replace(/^[^\d]*(\d+\.?\d*).*/,"$1") || 0 : 0;
  },


  /*
  描述：是否来自该域名
  */
  isFromDomain : function(url){
    url = url.replace('http://','').replace('https://','')
    url = url.split('?')
    url = url[0].split('/')
    url = url[0]
    for( var i=1; i<arguments.length; i++ ){
      if( url.indexOf(arguments[i]) > -1 ){
        return true
      }
    }
    return false
  },

  /*
  描述：链接转换成 A 锚记
  参数：
  u        - (Str) 待检查链接字符串
  f        - (Bool) 是否转化为链接，false 则过滤地址不做转换
  */
  trimLink : function(u,f){
    return u.replace(
    /(?:http(?:s)?:\/\/)(?:(?:[\w-]+\.)+[\w-]+)(?:\:\d+)?(?:\/[\w-\.\/%]*)?(?:[?][\w-\.\/%!*\(\);\:@&=+$,\[\]]*)?(?:#[\w-\.\/%!*\(\);\:@&=+$,\[\]]*)?/ig,
    function (a){
      return f ? '<a href="'+a+'" target="_blank">'+a+'</a>' : ''
    })
  },

  /*
  描述：判断字符串是否链接
  */
  isLink : function(u){
    return !!u.match(/^(?:http(?:s)?:\/\/)(?:(?:[\w-]+\.)+[\w-]+)(?:\:\d+)?(?:\/[^ \t\n]*)?$/ig)
  },


  /*
  描述：解析url search字符串，删除其中的某一个参数
  */
  removeParam : function(url, pnm){
    var reg1 = new RegExp('\\?'+pnm+'(=[^&]*)?'),
        reg2 = new RegExp('\\&'+pnm+'(=[^&]*)?');

    return url.replace(reg1,'?').replace(reg2,'').replace(/\?&/,'?').replace(/\?$/,'')
  },

  /*
  描述：解析url search字符串，返回参数的 json 对象
  */
  getParams : function(url){
    var opts = {},
      name,value,i,
      url = url.split('#')[0],
      idx = url.indexOf('?'),
      search = idx > -1 ? url.substr(idx + 1) : '',
      arrtmp = search.split('&');
    for(i=0 , len = arrtmp.length;i < len;i++){
      var paramCount = arrtmp[i].indexOf('=');
      if(paramCount > 0){
        name = arrtmp[i].substring(0 , paramCount);
        value = arrtmp[i].substr(paramCount + 1);
        try{
          if (value.indexOf('+') > -1){
            value= value.replace(/\+/g,' ')
          }
          opts[name] = decodeURIComponent(value);
        }catch(exp){}
      }
    }
    return opts;
  },
  /*
    描述：增加一个hash参数，如果已经存在，替换原参数值
    */
    addHashParams : function(url, param, value) {
      var re = new RegExp('([&\\#])' +param+ '=[^& ]*','g');
      url = url.replace(re,function (a,b){
        return b == '#' ? '#' : '';
      });

      var idx = url.indexOf('#');
      url += (idx > -1 ? idx+1 != url.length ? '&' : '' : '#') + param + '=' + value;
      return url;
    },
  /*
    描述：获取一个hash参数，如果已经存在，替换原参数值
    */
    getHashParams : function(url) {
      var opts = {},
        name,value,i,
        idx = url.indexOf('#'),
        search = idx > -1 ? url.substr(idx+1) : '',
        arrtmp = search.split('&');
      for(i=0, len = arrtmp.length; i<len; i++) {
        var paramCount = arrtmp[i].indexOf('=');
        if(paramCount > 0){
            name = arrtmp[i].substring(0 , paramCount);
            value = arrtmp[i].substr(paramCount + 1);
            try{
              if (value.indexOf('+') > -1){
                value= value.replace(/\+/g,' ')
              }
              opts[name] = decodeURIComponent(value);
            }catch(exp){}
        }
      }
      return opts;
    },
  /*
  描述：增加一个参数，如果已经存在，替换原参数值
  */
  addParam : function(url,param,value){
    var re = new RegExp('([&\\?])' +param+ '=[^& ]*','g')
    url = url.replace(re,function (a,b){
      return b == '?' ? '?' : ''
    })

    var idx = url.indexOf('?');
    url += (idx > -1 ? idx+1 != url.length ? '&' : '' : '?') + param + '=' + value;
    return url
  }
}



/*
描述：数组中获取某个元素的序号
*/
if(!Array.prototype.indexOf){
  Array.prototype.indexOf = function (obj, fromIndex){
    if (fromIndex == null) {
      fromIndex = 0;
    }else if(fromIndex < 0) {
      fromIndex = Math.max(0, this.length + fromIndex);
    }
    for(var i = fromIndex; i < this.length; i++){
      if (this[i] === obj)
        return i;
    }
    return -1;
  };
}

/**
* 字符串左起字节数
* @return {String}   返回字符串左起字节数
*/
if(!String.prototype.lenB){
  String.prototype.lenB = function(){
    return this.replace(/[^\x00-\xff]/g,"**").length;
  }
}
/**
* 截取字符串左起字节数
* @param {String} o string对象
* @param {Number} n 截取个数
* @return {String}   返回左起字符串
*/
if(!String.prototype.leftB){
  String.prototype.leftB = function(n){
    var s = this,
      s2 = s.slice(0, n),
      i = s2.replace(/[^\x00-\xff]/g, "**").length;
    if (i <= n) {
      return s2;
    }
    i -= s2.length;
    switch (i) {
      case 0: return s2;
      case n: return s.slice(0, n >> 1);
      default:
        var k = n - i,
          s3 = s.slice(k, n),
          j = s3.replace(/[\x00-\xff]/g, "").length;
        return j ? s.slice(0, k) + s3.leftB(j) : s.slice(0, k);
    }
  }
}

/**
* 按需截取字符串，如有截取则按需补足，比如'...'
* @依赖: leftB 方法
* @param {String} s string对象
* @param {Number} n 截取个数
* @param {String} a 如有截取用来补足，默认为'...'
* @param {Bool}   b 是否按字节截取，true 按字符 false(默认) 按字节
* @return {String}   返回截取后的字符串
*/
if(!String.prototype.cut){
  String.prototype.cut = function(n, a, b){
    var s = this;
      r = b ? s.substr(0, n) : s.leftB(n);
    return r == s ? r : r + (typeof a === 'undefined' ? '…' : a);
  }
}

/**
* 日期字符串格式化
* @param {String} fmt 例如："yyyy-MM-dd HH:mm:ss"
* @return {String}   返回格式化后的日期字符串
*/
Date.prototype.pattern = function(fmt){
  var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
  };
  var week = {
    "0" : "\u65e5",
    "1" : "\u4e00",
    "2" : "\u4e8c",
    "3" : "\u4e09",
    "4" : "\u56db",
    "5" : "\u4e94",
    "6" : "\u516d"
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}






/*
描述：分析selector 字符串，找到其中的tagName class id
参数：
s         - (Str) 待处理selector 字符串
b         - (Bool) 指定返回格式，默认false 则返回jQuery 对象, 设为true 则返回json object
*/
//function fromSelector(s,b){
//  var a = s.split(' '),
//    targ = a[a.length-1], //找到最后一个节点选择符
//    tagname = targ.match(/^[a-z]+/ig) || 'div',
//    classname = (targ.match(/\.[a-z_-]+/ig) || '').toString().substr(1),
//    tagid = (targ.match(/#[a-z_-]+/ig) || '').toString().substr(1);
//  return b ? {"tagName":tagname,"id":tagid,"class":classname} : $('<'+tagname+'>').attr({"class":classname,"id":tagid})
//}


















/*
@说明：获取当前页面的token 并返回不同种类的返回值
@参数： f      - (Num) f=1 token 值【f=1被禁用请改用getTokenVal】;  f=2 返回json格式; f=3 返回html str; 为null 返回键值对字符串
*/
function getToken(f){
  var r = {},
    ck = '',
    kv = '',
    str = '',
    $W = $(window),
    ver = $W.data('verification') || [], // 反广告垃圾
    $to = $('input','#form-token');
  if( ck = $.Bom.getCookie('csrftoken') ){
    kv = 'csrfmiddlewaretoken=' + ck;
    r['csrfmiddlewaretoken'] = ck;
  }else if( $to.length ){
    ck = $to.val();
    r['csrfmiddlewaretoken'] = ck;
    kv = $.param(r)
  }
  str = '<input type="hidden" name="csrfmiddlewaretoken" value="'+ck+'" />';

  if( ck && ver.length ){
    kv += '&recaptcha_response_field=' + ver[0];
    kv += '&recaptcha_challenge_field=' + ver[1];
    r['recaptcha_response_field'] = ver[0];
    r['recaptcha_challenge_field'] = ver[1];
    str += '<input type="hidden" name="recaptcha_response_field" value="'+ver[0]+'" /><input type="hidden" name="recaptcha_challenge_field" value="'+ver[1]+'" />';
  }
  return f ? f == 3 ? str : f == 2 ? r : kv : kv;
}

/*
@说明：获取当前页面的token 值
*/
function getTokenVal(){
  var ck = '',
    $to = $('input','#form-token');
  if( ck = $.Bom.getCookie('csrftoken') ){

  }else if( $to.length ){
    ck = $to.val();
  }
  return ck;
}



/*
@说明：服务器返回的错误信息可能是多重结构，此方法可以将多个错误连成一句话
@参数：
msg      - (Arr|Obj) 可以是数组，也可以是object
*/
function mergeServerMessage(msg){
  var str = '';
  if( $.isArray(msg) ){
    for( var i=0; i< msg.length; i++ ){
      if( $.isArray(msg[i]) ){
        var tm = msg[i][1] || msg[i][0] || '';
        str += tm + ',';
      }
      str += msg[i] + ';';
    }
    str = str.slice(0,-1)
  }else if( $.isPlainObject(msg) ){
    for( e in msg ){
      str += msg[e].toString() + ';'
    }
    str = str.slice(0,-1)
  }else{
    str = msg
  }

  str = str || '';
  return str.split(';')[0].split(',')[0]
}






/*merge start*/
// 此块代码会在合并过程中清除
$.G.gaq = function (trc){
  aaa(trc)
  _gaq && _gaq.push(['_trackPageview', trc]);
}
/*merge end*/

/**
 * [getSecurityToken 为了保证提交不重复，需要获取token]
 * @param       {Function}               fn [callback函数]
 * @description
 * @author      turebetty
 * @email       qin.yang@duitang.com
 * @updateTime  2015-12-29T14:13:48+0800
 */
function getSecurityToken (fn) {
      var hosetArr=window.location.host.split('.'),s;
      if(hosetArr.length>0){
        if(hosetArr[0]==='operate'){
          if(hosetArr.indexOf('s')!=-1){
            s=window.location.host.replace(/operate./, '');
          }else{
            s=window.location.host.replace(/operate./, 'www.');
          }
        }else{
          s=window.location.host.replace(/operatep./, 'p.');
        }
      }else{
        return false;
      }
      $.ajax({
          url: 'http://' + s + '/napi/security/token/',
          type: 'get',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
        })
        .done(function(jsn) {
          if (jsn.status === 1 && fn) {
            fn(jsn.data);
          } else {
            SUGAR.PopOut.alert('<div class="prompt"><h3>获取token失败！</h3></div>');
          }
        })
}
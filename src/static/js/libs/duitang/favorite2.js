/*
@说明：产品级公用js文件，站内收集
@作者：balibell
@时间：2010-11-30
@依赖： pack.js 中的 $.G.getNum 方法
@依赖： part/myalbums.js 中的 专辑调用类
@依赖： part/formevent.js 中的 keyupLenLimitForU
*/


/*
jQuery 风格代码
*/
;(function($) {
  var FavoriteFirstBtn,
    LOCK = false,
    $popalbumbox, //pop 弹出框
    $txa, //转发内容输入
    $reimg, //转发的图片区域
    $list, //pop 展示album list
    $albumsel, //专辑选择器
    $formpost, //form 转发提交表单
    $poststat, //提示区域
    EDIT = false, //是否是编辑操作
    WDS = ['收集','收集到','收集'], //弹出框文案
    undefined;


  /*
  描述：弹出转发面板
  */
  function _showRepostBox($btn){
    //[] 第一个值传 null 则不会使用默认头
    SUGAR.PopOut.alert([null,$popalbumbox,''],2);
  }






  /*
  描述：禁止发布，变灰掉发布按钮
  */
  function setSubmitNo(){
    $formpost.find('a.abtn').addClass('abtn-no');
    $formpost.find('.s-sina').css({"opacity":0.5,"color":"#aaa"});
  }

  /*
  描述：重置禁用掉的发布按钮
  */
  function setSubmitYes(){
    $formpost.find('a.abtn').removeClass('abtn-no');
    $formpost.find('.s-sina').css({"opacity":1,"color":"#333"});
  }

  /*
  描述：设置对应专辑
  */
  function setAlbum(vid,v){
    $albumsel.find('input[name=album]').val(vid).end().find('a,span').html(v)
  }

  /*
  @说明：各种提交发布的错误处理
  @参数： s      - (Str) 表示状态，取值有 al-inpost al-posterror al-nogoodimg  al-postsuc
      txt    - (Str) 状态文案
  */
  function setPostStat(s,txt){
    $poststat.html(txt).attr('class',s)
  }

  /*
  @说明：重置各种
  */
  function reset(){
    $txa.val('')
    setPostStat('','');
  }



  /*
  @说明：收集成功后的流程
  @参数：
  da      - (Arr) jsn.data 数据
  WDS     - (Arr) 一些面板上的文案，区分 收集和编辑
  */
  function collectSuccess(da,fn){
    $.G.blinkIt( function () {
      setPostStat('re-postsuc',WDS[0]+'成功！');
    }, null, function () {
      SUGAR.PopOut.closeMask();
      $.isFunction(fn) && fn(da);
      reset();
    }, 1, 800 );

    var $t_h = $( '.collection' ).find( 'em' );
    if ( $t_h.length === 1 && da.blog ) {
      $t_h.each(function () {
        $t_h.html( parseInt( $t_h.html() ) + 1 );
      });
    }
  }


  /*
  @说明： 重新设置收集链接
  @参数：
  m       - (Num) 收集数加1  默认为0
  */
  function setNewLink(blogid,m){
    if( blogid ){
      var $btn = $(FavoriteFirstBtn)
      $btn.addClass('re-done').attr('href','/people/mblog/'+blogid+'/detail/').attr('target','_blank').attr('title','去看我的收集')

      //如果确认是从无到有的收集，则数字加1
      if( m ){
        var $btn_u = $btn.closest('.woo').find('.d1'),
          $btn_u1 = '',
          favornum = $('.otheralbums h4').find('span').text(),
          num = parseInt($btn_u.text()) || parseInt(favornum) || 0;

        $btn_u.html(num+1).removeClass('dn')
        if($btn.find('em').length) {
          $btn.find('i').addClass('y-done').end().find('em').html("已收集 "+(num+1));
        }

      }
    }
  }


  /*
  描述：收集流程，弹出框开始
  参数：
  $btn           - (jQ) jquery 对象，点击按钮
  blogid         - (Str) 分享detail 的id
  ownerid        - (Str) 原分享主的id
  fn             - (Fun) 完成后执行的方法
  */
  function FavoriteCollect($btn,blogid,rooterid,ownerid,fn){
    EDIT = false;
    WDS = ['收集','收集到','收集'];
    FavoriteCreatePop('/people/mblog/forward/',fn,rooterid)

    $popalbumbox.css('display','block')

    //输入框内容置为空
    reset()
    setSubmitYes();

    //通过js-favorite 判断是否是detail 或者 原创页面
    var $des = $btn.closest('.center');
    var $dga, dgat = '';
    if ($des.length) {
      $dga = $des.find('.js-favorite-blogtit');
      dgat = $dga.text();
    } else {
      $dga = $btn.closest('.woo').find('div.g');
      dgat = $('<div>'+$dga.html()+'</div>').find('a').remove().end().text();
    }
    $txa.val($.trim(dgat));

    //parentId 设置
    $('#re-inp-parent').attr('name','parent').val(blogid)

    //要转发的图片设置
    $reimg.empty().scrollTop(0)
    // var $mbpho = $des.find('img.js-favorite-blogimg')
    var $mbpho = $des.find('.js-favorite-blogimg'), //detail 页面图片
      mbw,
      mbh;
    if( $mbpho.length ){
      mbw = $mbpho.data('width'),
      mbh = $mbpho.data('height');
    }else{
      $mbpho = $btn.closest('div.woo').find('div.mbpho img');
      mbw = $mbpho.outerWidth(),
      mbh = parseInt($mbpho.attr('height'));
    }
    // 重新计算图片高宽以适应图片展示框
    if( mbw > 200 ){
      mbh = mbh * 200 / mbw,
      mbw = 200;
    }

    $i = $('<img />')
    .attr('src',$mbpho.attr('src'))
    .appendTo($reimg)

    $i.css({"width":mbw,"height":mbh,"marginTop":mbh <= 200 ? (200-mbh)/2 : 0,"cursor":mbh <= 200 ? "default" : "move"})


    $.data($reimg[0],'imgProp',{"height":mbh})


    //根据 $btn 按钮的位置，确定$popalbumbox 的展开路径
    _showRepostBox($btn)

  }



  /*
  描述：修改流程，弹出框开始
  参数：
  $btn           - (jQ) jquery 对象，点击按钮
  blogid         - (Str) 分享detail 的id
  ownerid        - (Str) 原分享主的id
  fn             - (Fun) 完成后执行的方法
  belongalbumid  - (Str) 编辑的detail 本身所属的专辑id
  belongalbumname - (Str)  编辑的detail 本身所属的专辑名
  onlyedit       - (Bool) 只修改内容不转移专辑
  */
  function FavoriteEdit($btn,blogid,rooterid,ownerid,fn,belongalbumid,belongalbumname,onlyedit){
    EDIT = onlyedit;
    WDS = ['编辑','转移到','提交'];
    FavoriteCreatePop('/blog/edit/',fn,rooterid,belongalbumid,belongalbumname,onlyedit)

    $popalbumbox.css('display','block')

    //输入框内容置为空
    reset()
    setSubmitYes();

    //通过js-favorite 判断是否是detail 或者 原创页面
    var $des = $btn.closest('.center');
    var $dga, dgat = '';
    if ($des.length) {
      $dga = $des.find('.js-favorite-blogtit');
      dgat = $dga.text();
    } else {
      $dga = $btn.closest('.woo').find('div.g');
      dgat = $('<div>'+$dga.html()+'</div>').find('a').remove().end().text();
    }
    $txa.val($.trim(dgat));

    //parentId 设置
    $('#re-inp-parent').attr('name','blog').val(blogid)

    //要转发的图片设置
    $reimg.empty().scrollTop(0)
    var $mbpho = $des.find('img.js-favorite-blogimg'); //detail 页面图片
    if( $mbpho.length ){
      var mbh = $mbpho.data('height'),
        mbw = $mbpho.data('width'),
        mbh = mbh * 200 / mbw,
        $i = $('<img />')
          .attr('src',$mbpho.attr('src'))
          .appendTo($reimg)
    }else{
      $mbpho = $btn.closest('div.woo').find('div.mbpho img');
      var mbh = parseInt($mbpho.attr('height')),
        $i = $('<img />')
          .attr('src',$mbpho.attr('src'))
          .appendTo($reimg)
    }

    $i.css({"width":200,"marginTop":mbh < 200 ? (200-mbh)/2 : 0,"cursor":mbh <= 200 ? "default" : "move"})

    $.data($reimg[0],'imgProp',{"height":mbh})

    //根据 $btn 按钮的位置，确定$popalbumbox 的展开路径
    _showRepostBox($btn)

  }


  /*
  描述：创建弹出框
  belongalbumid  - (Str) 编辑的detail 本身所属的专辑id
  onlyedit       - (Str) 仅仅只做内容编辑不允许换专辑
  */
  function FavoriteCreatePop(actionurl,fn,rooterid,belongalbumid,belongalbumname,onlyedit){
    //如果没有$popalbumbox  则创建节点
    if( !$popalbumbox || !$popalbumbox.length ){
      $popalbumbox = $('<div id="re-favorite"><form action="'+actionurl+'" target="_self"><div id="re-head"><a id="re-close" target="_self" href="javascript:;" onclick="SUGAR.PopOut.closeMask();">关闭</a><h1>'+WDS[0]+'</h1></div><div id="re-cont" class="clr"><div id="re-left" class="l"></div> <div id="re-right" class="r"> <p>'+WDS[1]+'</p> <div id="re-albumsel"><input class="dn" type="text" data-optional="1" value="0" name="album"><a id="re-albumtrig" href="javascript:;">默认专辑</a><span id="re-onlyeditwds"></span></div><textarea name="content"'+ ( WDS[0] == '编辑' && (rooterid == $.G.getUSERID() || $.G.isSTAFF() ) ? ' class="txa" ' : ' class="txa txa-no" disabled ' ) +' data-optional="1" ></textarea> <div id="re-subpan" class="u-chk clr"> <a href="javascript:;" class="abtn l "><button type="submit"><u>'+WDS[2]+'</u></button></a>'+ ( typeof BIND_SITES != undefined && BIND_SITES.sina ? '<input id="re-sycn-sina" type="checkbox" value="sina" class="chk s-sina" name="syncpost" /><label class="s-sina" title="同步到新浪微博" for="re-sycn-sina">同步</label><div class="re-mbsite s-sina">新浪</div>' : '') +'<div id="re-poststat"></div></div></div></div><input id="re-inp-parent" type="hidden" name="parent" value="" data-optional="1" /></form></div>');

      $.G.store($popalbumbox);

      //sync 同步到微博
      var cki = $.G.getYearCookie('sync');
      $('#re-sycn-sina').prop('checked',cki.indexOf('sina') === -1 ? false : true).change(function (){
        var $t = $(this),
          v = $t.attr('value');
        //分析checkbox 状态
        cki = cki.replace(new RegExp(','+v,'ig'),'');
        if( !$t.prop('checked') && cki.indexOf(v) === -1 ){
          $.G.setYearCookie('sync',cki)
        }else if( $t.prop('checked') ){
          $.G.setYearCookie('sync',cki + ',' + v)
        }
      })

      //提示区域
      $poststat = $('#re-poststat')


      //点击专辑选择器
      $albumsel = $popalbumbox.find('#re-albumsel');
      $albumsel.removeClass('re-onlyedit').find('a').myalbums({"sel_valueipt" : $albumsel.find('input[name=album]'),"sel_holder" : $popalbumbox})

      //图片外层容器节点
      $reimg = $('#re-left').mousemove(function (e){
        e.stopPropagation()
        if( $.data(this,'movelock') ) return;
        var $t = $(this),
          da = $.data(this,'imgProp') || {},
          imh = da.height;

        if( imh > 200 ){
          var y = e.pageY,
            iy = $reimg.offset().top,
            x = y-iy-50,
            x = x < 0 ? 0 : x,
            undefined;
          //aaa('scrollTop : (y【'+y+'】-iy【'+iy+'】)*imh【'+imh+'】/200 ----' + x*(imh-200)*2/200)

          $.data(this,'movelock',true)
          $t.stop().animate({scrollTop:x*(imh-200)*2/200},50,'linear',function (){
            $.data($t[0],'movelock',false)
          })
        }
      });


      //文本输入框事件绑定
      $txa = $popalbumbox.find('textarea.txa');
      //输入框字数限制
      function _lim(e){
        keyupLenLimitForU(e.currentTarget,300,true,true)
      }
      $txa.keyup(_lim).blur(_lim).focus(_lim)
      keyupLenLimitForU($txa[0],300,true,true)

      // at 功能嵌入
      $.fn.at && $txa.at({isFixed:true})



      //默认收集到 默认专辑 按钮
//			$('#fa-defaultcoll').click(function (){
//				var nw = _getnow(), //获取当前选中album 的 name 和 id 默认默认专辑
//					undefined;
//
//				FavoriteTransBlogToAlbum(nw.name,nw.id,$(this).data('blogid'))
//			})

//			$('#fa-cancelcoll').click(function (){
//				var $f = $(FavoriteFirstBtn);
//				FavoriteCancel($f,$f.data('blogid'))
//			})

      //repost 提交流程 转发表单
      $formpost = $popalbumbox.find('form').safeSubmit(function (e){
        var $form = $(this),
          msg = $txa.val(),
          albumid = $albumsel.find('input').val(),
          albumname = $('#re-albumtrig').text(),
          $abtn = $form.find('a.abtn'),
          $btn = $abtn.find('[type=submit]');

        if( $abtn.hasClass('abtn-no') ) return;
        // 方法中禁用了form 表单需要reset为可用
        //防止duplicate 提交将提交按钮设置为灰色
        setSubmitNo();
        setPostStat('re-inpost','正在提交，请稍候');

        $.ajax({
          url : $form.getFormAction(),
          data : $form.paramForm(getToken(2)),
          success : function(h){
            //转json对象
            var jsn = $.isPlainObject(h) ? h : $.parseJSON(h)

            //如果parse 失败，直接返回
            if(!jsn || typeof jsn != 'object'){
              //$('#al-done').html('<div class="prompt prompt-success"><h3>发布成功，您可以到 <a class="lkl b" href="/people/"+$.G.getUSERID()+"/" target="_blank">我的堆糖</a> 页面检查。</h3></div>')
              setPostStat('re-posterr','出现异常，可能是网络原因')
              return;
            }

            if( !jsn.data ){
              jsn.data = {}
            }

            jsn.data.content = msg;
            jsn.data.albumid = albumid;
            jsn.data.albumname = albumname;

            //判断jsn 请求是否成功返回数据
            if(jsn.success){

              //专辑、标签设置保留到cookie 中去
              var albid = $albumsel.find('[name=album]').val(),
                albnm = $albumsel.find('a').html();
              if( !EDIT && albid && albid != '0' ){
                $.Bom.removeCookie('sgt');
                $.Bom.setSubCookie('sgt','ai'+$.G.getUSERID(),albid,{expires:30})
                $.Bom.setSubCookie('sgt','an'+$.G.getUSERID(),albnm,{expires:30})
              }

              //收集成功后执行
              collectSuccess(jsn.data,fn);
              setNewLink(jsn.data && jsn.data.blog,1);


            }else if( jsn.data && jsn.data.robot_check ){
              //防止广告垃圾攻击
//              $btn.verification({"w":jsn.data.robot_check})
            }else{
              var mess = $.trim(mergeServerMessage(jsn.message));
              setPostStat('re-posterr',mess)
              setSubmitYes();

              if( mess == '你已经收集了该分享' ){
                setNewLink()
              }else{
                setSubmitYes();
              }

              // 由于收集操作暂未使用 mysuccess， 单独监控错误打点
              $.G.gaq('/_trc/Error/ajax/response_'+mess+'_forward');
            }
          },
          myerror : function (){
            setPostStat('re-posterr','网络原因导致失败，请稍候再试')
            setSubmitYes();
          }
        }).always(function (){
          //setSubmitYes();
        });
      },function (e){
        //重复发布执行的
        $.G.blinkIt(function (){
          $txa.css({"backgroundColor":"#d7ebf7"})
        },function (){
          $txa.css({"backgroundColor":"#fff"})
        },function (){
          $txa.focus();
        },4,200)
      })
    }else{
      $.G.store($popalbumbox);
    }

    if( onlyedit ){ //不允许编辑专辑
      $albumsel.addClass('re-onlyedit')
      $('#re-subpan').find('input,label,div.re-mbsite').css('visibility','hidden')
    }else{
      $albumsel.removeClass('re-onlyedit')
      $('#re-subpan').find('input,label,div.re-mbsite').css('visibility','visible')
    }

    if( typeof belongalbumid != 'undefined' ){
      belongalbumid = belongalbumid || '';
      belongalbumname = belongalbumname || '默认专辑';
      setAlbum(belongalbumid,belongalbumname)
    }else{
      //默认专辑设置，从cookie 里取数据
      var staid = $.Bom.getSubCookie('sgt','ai'+$.G.getUSERID()) || '',
        stanm = $.Bom.getSubCookie('sgt','an'+$.G.getUSERID()) || '默认专辑';
      setAlbum(staid,stanm)
    }

    $formpost.attr('action',actionurl)

    $popalbumbox.find('h1').html(WDS[0]).end().find('#re-right p').eq(0).html(WDS[1]).end().find('.abtn u').html(WDS[2])
  }


  /* 收集：瀑布流，detail，原创页面 */
  $.fn.SGfavorite = function(opt){
    opt = opt || {};
    var etype = opt.etype || 'click',
      fn = opt.callback;

    //主事件，插件启动即要执行该方法
    function __clickdo(e){
      if( $(this).hasClass('re-done') ){
        return true;
      }

      e.stopPropagation();
      e.preventDefault();
      var $t = $(this),
        da = $t.data('favorite'),
        da = da ? da : $t.closest('.collbtn').data('favorite'),
        origid = da ? da.id : 0,
        me = $.G.getUSERID(),
        ownerid = da.owner,
        rooterid = da.rooter,
        undefined;


      FavoriteFirstBtn = this;
      //$.data(FavoriteFirstBtn,'blogid',origid)

      if( da.edit == true && ( ownerid == me || $.G.isSTAFF() ) ){
        FavoriteEdit($t,origid,rooterid,ownerid,fn,da.belongalbumid,da.belongalbumname,da.onlyedit)
      }else{
        if(ownerid == me){
          alert('你收集过的，不能再收集哦~')
          return;
        }
        if( rooterid == me ){
          alert('你第一次发布的，不能再收集哦~')
          return;
        }

        //统计 list 页面上下两个按钮的favorite 次数
        var $fa = $t.parent();
        if( $fa.hasClass('collbtn') ){
          $.G.gaq('/_trc/Repost/waterfall/popstart');
        }
        FavoriteCollect($t,origid,rooterid,ownerid,fn);
      }
    }


    //如果未登录，不能继续
    if(!$.G.getUSERID()){
      if( !this.attr('title') ){
        this.attr('title','登录才能进行操作哦，点击就可以登录啦');
      }
      $(document).on(etype, this.selector, function (e){
        e.stopPropagation()
        e.preventDefault()
        SUGAR.PopOut.login();
        return;
      })
    }else{
      $(document).on(etype, this.selector, __clickdo);
    }

    return this;
  }


  /* 评论：瀑布流 */
  $.fn.SGcomment = function(opt){
    opt = opt || {};

    /*
    @说明：取消评论
    @参数：
    $btn           - (jQ) jquery 对象，点击按钮
    blogid         - (Str) 分享detail 的id
    ownerid        - (Str) 分享者id
    $lid           - (jQ) li 节点，父亲层
    $woo           - (jQ) woo 单元节点
    co             - (Num) 所在列数
    tp             - (Num) top 值
    */
    function commentCancel($btn,blogid,ownerid,$lid,$woo,co,tp){
      var $recomt = $woo.find('.re-comt');
      $woo.find('.re-comt').stop().clearQueue().animate({
        "height" : 0
      },200).queue(function (){
        $.Woo.resetCol(-118,co,tp)
        $.data($lid[0],'comment',-1)
        $recomt.find('textarea').blur();
      })
      $.data($lid[0],'comment',0)
    }


    /*
    @说明：开始评论
    @参数：
    $btn           - (jQ) jquery 对象，点击按钮
    blogid         - (Str) 分享detail 的id
    ownerid        - (Str) 分享者id
    $lid           - (jQ) li 节点，父亲层
    $woo           - (jQ) woo 单元节点
    co             - (Num) 所在列数
    tp             - (Num) top 值
    */
    function commentStart($btn,blogid,ownerid,$lid,$lidc,$woo,co,tp){
      if( typeof $.data($lid[0],'comment') == 'undefined' ){
        var $cmt = $('<li class="re-comt"><img width="24" height="24" src='+USER.smallAvatar+'><form action="/comment/add/"><div class="pb8"><textarea class="txa" name="content" placeholder="发布评论..."></textarea><a class="abtn l" href="#"><u>评论</u></a></div><input type="hidden" name="_type" value=""/><input type="hidden" value="'+blogid+'" name="comment_message_id"></form></li>');
        
        $lidc.after($cmt);
        // at 功能嵌入
        $.fn.at && $cmt.find('textarea').at({pageMembers:$woo.find('li p a:first-child')})

        $cmt.find('a.abtn').click(function (e){
          e.stopPropagation()
          e.preventDefault()

          var $t = $(this),
            $form = $t.closest('form'),
            $cmttxa = $form.find('textarea'),
            v = $.trim($cmttxa.val());


          if( !v ){
            alert('请输入内容！');
            return
          }

          //防止重复提交
          if( $t.hasClass('abtn-no') ) return;
          $t.addClass('abtn-no')
          $.ajax({
            url : '/comment/add/',
            data : $form.paramForm(getToken(2)),
            mysuccess : function(jsn,h){
              var $str = $(['<li><a href="/myhome/" target="_blank"><img src="',jsn.data.replyerImg,'" width="24" height="24"></a><p><a href="/myhome/" target="_blank">我</a><br/><span>',jsn.data.content.replace(/<br\s*\/?>/i,' ')/*.replace(/</ig,'&lt;').replace(/>/ig,'&gt;')*/.replace(/@[\u2E80-\u9FFF\d\w]{1,20}/ig,''),'</span></p></li>'].join(''));

              $cmt.before($str.css('display','none'))

              //重置textarea 输入框
              $cmttxa.val('')
              $str.slideDown(200,function (){
                $.Woo.resetCol($str.outerHeight(true),co,tp)
              });

              var $rcnt = $t.closest('.woo').find('.d3'),
                count = parseInt($rcnt.text()) || 0;
              $rcnt.html(++count).removeClass('dn')
            },
            myerror : function (){
              this.errormsg()
            }
          }).always(function (){
            //防止duplicate 提交将提交按钮重置
            $t.removeClass('abtn-no')
          });
        })
      }

      var $W = $(window),
        wh = $W.height(),
        wt = $W.scrollTop(),
        $recomt = $woo.find('.re-comt'),
        remoff = $recomt.offset(),
        remtop = remoff.top,
        distance = remtop + 118 - ( wh + wt );

      if( distance > 0 ){
        var B = $.browser,
          webkit = B.webkit,
          $body = webkit ? $('body') : $('html');
        $body.animate({scrollTop:'+=' + distance},400,function (){

        })
      }

      $recomt.stop().clearQueue().animate({
        "height" : 118
      },200).queue(function (){
        $.Woo.resetCol(118,co,tp)
        $.data($lid[0],'comment',1)
        $recomt.find('textarea').focus();
      })
      $.data($lid[0],'comment',0)
    }

    //主事件，插件启动即要执行该方法
    function __clickdo(e){
      e.stopPropagation();
      e.preventDefault();

      var $t = $(e.target).closest('a'),
        $woo = $t.closest('.woo'),
        //$lid = $woo.find('.f').last(),
        $lid = $woo.find('.f').last(),
        $lidc = $woo.find('li').not('.re-comt').last(),
        da = $t.closest('.collbtn').data('favorite'),
        da = da ? da : $lid.data('favorite'),
        cancel;

      // 没有找到 .f 表示没有地方添加评论，直接跳转去detail
      if( !$lid.length && da && da.id ){
        window.location.href = '/people/mblog/'+da.id+'/detail/#reply'
        return
      }else{
        cancel = $.data($lid[0],'comment');
      }

      // 等于0 表示正在等待中
      if( cancel === 0 ) return;

      var origid = da.id,
        ownerid = da.owner,
        zi = $.data($('#woo-holder')[0],'zindex') || 10,
        cancel = cancel == undefined || cancel < 0 ? false : true,
        cls = $woo[0].className,
        co = $.G.getNum(cls.match(/\bco\d+\b/ig).toString()),
        tp = parseInt($woo.css('top')) || 0;

      $woo.css("zIndex",++zi)
      $.data($('#woo-holder')[0],'zindex',zi)
      if( cancel ){
        commentCancel($t,origid,ownerid,$lid,$woo,co,tp);
      }else{
        commentStart($t,origid,ownerid,$lid,$lidc,$woo,co,tp);
      }
    }

    var etype = 'click';
    //如果未登录，不能继续
    if(!$.G.getUSERID()){
      this.attr('title','登录才能评论，点击下就可以登录啦');
      $(document).on(etype, this.selector, function (e){
        e.stopPropagation()
        e.preventDefault()
        SUGAR.PopOut.login();
        return;
      })
    }else{
      $(document).on(etype, this.selector, __clickdo);
    }

    return this;
  }


  /* 赞：瀑布流，detail，原创页面 */
  $.fn.SGlike = function( opt ) {
    opt = opt || {};

    /*
    ** $t : target本身
    ** blogid : blog id
    ** ownerid : ownerid
    **
    */
    function likeStart( $t, blogid ) {
      if ( $t.hasClass( 'no-sub' ) ) return;      //防止重复提交
      $t.addClass( 'no-sub' );        //在ajax请求成功之后去掉该class

      $.ajax({
        url : '/like/',
        data : 'object_id='+blogid+'&category=1&'+getToken(1),
        mysuccess : function(jsn,h){
          $t.addClass( 're-zan' );
          var $t_h = $t.closest('.woo').find( '.d2' ), // 瀑布流
            $t_d = $t.closest( '.action' ).find( 'em' ), // detail 页面的赞计数加1
            t_h_k = $t_h.html(),
            t_num = 0,
            undefined;

          if( $t.data( 'like' ) ) {
            $t.data( 'like' ).likeid = jsn.data.like_id;
          } else {
            $t.data('like',{"likeid":jsn.data.like_id+""})
          }
          if ( t_h_k ) {
            t_num = parseInt( t_h_k ) + 1;
          } else {
            t_num = 1;
          }
          $t_h.length && $t_h.html( t_num ).removeClass('dn') && ($t.find('i').length? $t.find('i').html(t_num).addClass('z-done'): $t.html(t_num).addClass('z-done'));

          // detail 页面的赞计数加1
          if ( $t_d.length ) {
            $t_d.each(function () {
              $( this ).html( parseInt( $t_d.html() ) + 1 );
            });
          }
        },
        myerror : function (){
          this.errormsg()
        }

      }).always(function(){
        $t.removeClass( 'no-sub' );
      });
    }

    function likeCancle( $t, likeid ) {
      if ( $t.hasClass( 'no-sub' ) ) return;
      if ( $t.data( 'like' ) ) {
        likeid = $t.data( 'like' ).likeid;
      }
      if( !likeid ) return
      $t.addClass( 'no-sub' );
      $.ajax({
        url : '/unlike/',
        data : 'like_id='+likeid +'&'+getToken(1),
        mysuccess : function(jsn,h){
          $t.removeClass( 're-zan' );
          var $t_h = $t.closest('.woo').find( '.d2' ), // 瀑布流
            $t_d = $t.closest( '.action' ).find( 'em' ), // detail 页面的赞计数减1
            t_h_k = $t_h.html(),
            t_num = 0,
            undefined;
          if ( parseInt( t_h_k ) > 1 ) {
            t_num = parseInt( t_h_k ) - 1;
          }else{
            t_num = 0;
          }
          //$t_h.length && $t_h.add($t).html( t_num ).removeClass('d2-done');
          $t_h.length && (t_num?$t_h.html( t_num ):$t_h.html( t_num ).addClass('dn')) && ($t.find('i').length? $t.find('i').html(t_num).removeClass('z-done'): $t.html(t_num).removeClass('z-done'));

          // detail 页面的赞计数减1
          if ( $t_d.length ) {
            $t_d.each(function () {
              $( this ).html( parseInt( $t_d.html() ) - 1 < 0 ? 0 : parseInt( $t_d.html() ) - 1 );
            });
          }
        },
        myerror : function (){
          this.errormsg()
        }
      } ).always( function(){
        $t.removeClass( 'no-sub' );
      } );
    }
    function __clickdo( e ) {
      e.stopPropagation();
      e.preventDefault();
      var $t = $( this ),
        da = $t.data('favorite'),
        da = da ? da : $t.closest('.collbtn').data('favorite'),
        origid = da.id,
        ownerid = da.owner,
        likeid = da.likeid,
        undefined;
      if( $t.hasClass('re-zan') ){
        likeCancle( $t, likeid );
      } else {
        likeStart( $t, origid );
      }

    }
    var etype = 'click';
    if( !$.G.getUSERID() ) {
      if( !this.attr('title') ){
        this.attr( 'title', '登录之后才能赞哦！' );
      }
      $(document).on(etype, this.selector, function( e ) {
        e.stopPropagation();
        e.preventDefault();
        SUGAR.PopOut.login();
        return;
      } );
    } else {
      $(document).on(etype, this.selector, __clickdo);
    }
  }

})(jQuery);








function callFavOffset($wooholder){
  if( $wooholder.length ){
    var dymoff = $wooholder.find('div.woo-pcont:visible').offset(),
      dymtop = dymoff.top,
      dymleft = dymoff.left,
      diff = parseInt($wooholder.css('marginLeft')) || 0;

    $wooholder.data('offset',{"left":dymleft-diff,"top":dymtop});
  }
}

function callFavorite(){
  //使用live 方式可以避免很多麻烦，比如js 加载的内容不需要再做一次初始化
  $('div.woo .collbtn .y').SGfavorite()
  $('div.woo .collbtn .x').SGcomment()
  $('div.woo .collbtn .z').SGlike()

  var $wooarea = $('#woo-holder'),
    $W = $(window);
  if( $wooarea.length ){
    var ie = $.browser.msie,
      ie6 = ie && $.browser.version === '6.0',
      bmod = -20, // 修正 scroll 高度判断
      bmgt = 0, // pannel 相对于 .woo 的顶部距离
      bias = 65; // the height of docktitle if u set title fixed


    function setCover($u,show){
      if(show){
        $u.addClass('woocov')
      }else{
        $u.removeClass('woocov')
      }
    }

    if( ie6 ){
      $wooarea.delegate('div.woo','mousemove',function (e){
        callFavOffset($wooarea);
        var $t = $(this),
          csstop = parseInt($t.css('top')) || 0,
          sctop = $W.scrollTop(),
          woooff = $wooarea.data('offset'),
//					wooleft = woooff.left,
          wootop = woooff.top;

        setCover($t.find('.a u'),true);
        $t.find('.collbtn').css({
          "display" : "block",
          "top" : Math.max(sctop - (wootop + csstop) - bmgt + bias,bmgt)
        })
      })
    }else{
      $wooarea.delegate('div.woo','mouseenter',function (e){
        callFavOffset($wooarea);
        var $t = $(this),
          $collbtn = $t.find('.collbtn'),
          csstop = parseInt($t.css('top')) || 0,
          sctop = $W.scrollTop(),
          woooff = $wooarea.data('offset'),
//					wooleft = woooff.left,
          wootop = woooff.top;

        setCover($t.find('.a u'),true);

        $('#collbtn').css('display','none').removeAttr('id').addClass('collbtn')
        $collbtn.attr('id','collbtn').addClass('collbtn');


        if( sctop - (wootop + csstop) + bmod + bmgt + bias > 0 ){
          var vleft = $t.offset().left;
          $collbtn.css({
            "left" : vleft,
            "position" : "fixed",
            "top" : bmgt + bias,
            "display" : "block"
          })
        }else{
          $collbtn.css({
            "position" : "absolute",
            "left" : 0,
            "top" : bmgt, // no need plusing bias here
            "display" : "block"
          })
        }
      })

      $wooarea.delegate('div.woo','mousemove',function (e){
        var $t = $(this),
          $collbtn = $t.find('.collbtn');

        if( $('#collbtn')[0] != $collbtn[0] ){
          $('#collbtn').css('display','none').removeAttr('id').addClass('collbtn')
        }
        $collbtn.attr('id','collbtn').addClass('collbtn');
      })
    }
    $wooarea.delegate('div.woo','mouseleave',function (e){
      var $t = $(this);

      setCover($t.find('.a u'),false);
      
      $t.find('.collbtn').css('display','none').removeAttr('id').addClass('collbtn');
    })
  }
}




$(function (){
  // 如果是用在瀑布流页面
  var $wooholder = $('#woo-holder')
  if( $wooholder.length ){
    var $w = $(window);

    $w.scroll(function (){
      var tp = $w.scrollTop();

      // list 收集操作区块，mouseover woo 区块时赋id collbtn，mouseout 去掉id
      var $collbtn = $('#collbtn');

      if( $collbtn.length && !ie6 ){
        var dymoff = $wooholder.data('offset'),
          bmgt = 0,  // pannel 相对于 .woo 的顶部距离
          undefined;
        if( dymoff ){
          var $t = $collbtn.closest('div.woo'),
            csstop = parseInt($t.css('top')) || 0,
//          dymleft = dymoff.left,
            dymtop = dymoff.top,
            bmod = -20,  // 修正 scroll 高度判断
            bias = 65;  // the height of docktitle if u set title fixed

          // 如果dym 顶部超出屏幕上方， collbtn 设置为fixed 状态
          if( tp - (dymtop + csstop) + bmod + bmgt + bias > 0 ){
            // var vleft = $t.offset().left + 18;
            var vleft = $t.offset().left;
            $t.find('.collbtn').css({
              "left" : vleft,
              "position" : "fixed",
              "top" : bmgt + bias,
              "display" : "block"
            })
          }else{
            $t.find('.collbtn').css({
              "position" : "absolute",
              "left" : 0,
              "top" : bmgt,
              "display" : "block"
            })
          }
        }
      }
    })
  }


})
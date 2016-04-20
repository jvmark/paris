/* 
@说明：页面级别merge js 文件，对应后台页面 瀑布流生成工具
@作者：balibell 
@时间：2013-03-28
*/


/* 瀑布流Woo 新框架 */


// 简单验证str 是否正常html 代码
function vilidateHtml(str){
  var lglt = 0,
    dqut = 0,
    squt = 0;

  // 检查链接地址是否填写
  if( str.match(/(href="\s*"|href='\s*'|href=\'[^\']*\s|href=\"[^\"]*\s)/ig) ){
    alert('链接地址未填写或地址里有空格')
    return false
  }
  

  str.replace(/[<>\"\']/ig,function (a){
    if( a === '<' ){
      lglt++
    }else if( a === '>' ){
      lglt--
    }else if( a === '"' ){
      dqut++
    }else if( a === "'" ){
      squt++
    }
  })

  if( lglt !== 0 ){
    alert('尖括号和反尖括号数量不相等')
  }else if( dqut % 2 !== 0 ){
    alert('半角双引号不成对')
  }else if( squt % 2 !== 0 ){
    alert('半角单引号不成对')
  }else{
    if( $(str).find('a').length > 0 ){
      return true
    }else{
      alert('至少要有一个Tab选项')
    }
  }
  return false
}


$(function(){
  var params = $.G.getParams(window.location.href)

  // 既不是编辑，也没有搜索关键字，直接退出
  if( !$.trim(params.kw) && !params.edit ){
    $('#woo-form-hot')
    .find('[name=kw]').val('no data')
    .find('[name=to_date]').val('2011-05-08');
    // return
  }

  // 有可能浏览器禁止了 localStorage
  var localStorage;
  try{
    localStorage = window.localStorage
  }catch(e){
    
  }

  // 如果有 localstorage 取出其中保存的 related 字符串
  var hasstorage = !!(typeof localStorage != 'undefined' && localStorage)
  if( hasstorage ){
    var wtf_related = localStorage.getItem("wtf_related"),
      wtf_title = localStorage.getItem("wtf_title"),
      wtf_desc = localStorage.getItem("wtf_desc"),
      wtf_ppath = localStorage.getItem("wtf_ppath"),
      wtf_headpic = localStorage.getItem("wtf_headpic"),
      wtf_headpicm = localStorage.getItem("wtf_headpicm"),
      wtf_headpicp = localStorage.getItem("wtf_headpicp");
    if( wtf_related ){
      $('#wtfrelated').val(wtf_related)
    }
    if( wtf_title ){
      $('#wtfnwtitle').val(wtf_title)
    }
    if( wtf_desc ){
      $('#wtfnwdesc').val(wtf_desc)
    }
    if( wtf_ppath ){
      $('#wtfpath').val(wtf_ppath)
    }
    if( wtf_headpic ){
      $('#wtfheadpic').val(wtf_headpic)
    }
    if( wtf_headpicm ){
      $('#wtfheadpicm').val(wtf_headpicm)
    }
    if( wtf_headpicp ){
      $('#wtfheadpicp').val(wtf_headpicp)
    }

    // 前提是有 localstorage
    // 如果是编辑，则锁死 kw，不能使用搜索功能
    if( params.edit ){
      $('#woo-form-hot').empty().attr('action','/ev/'+wtf_ppath)
      $('#form-searchforwfall').parent().addClass('h0')

      $('#pgdopost').find('u').html('编辑')
    }

  }





  // 分享list 动态分页
  wooInit();


  // 瀑布流排序功能
  $.isFunction(wooOrder) && wooOrder();
  /////////////////////// 增大号 按钮

  /////////////////////// gotonext 按钮事件绑定 换成 重排功能
  $('#gotonext')
  .unbind('click')
  .click(wooRepos)

  /////////////////////// gotonext 按钮事件绑定


  // 实时显示当前瀑布流已经展示的单元个数
  var $unitsnum = $('<div style="position:fixed;bottom:68px;right:10px;background:orange;padding:2px 4px 0px;font-weight:bold"></div>').appendTo('body');
  $(window).scroll(function (){
    $unitsnum.html($.Woo.masn[$.Woo.idx].unitCount);
  })


  // 对当页数据按收集数重新排序
  $('#pgreorder').click(function (e){
    e.preventDefault();
    e.stopPropagation();

    var $t = $(this),
      $area = $('#woo-holder'),
      $woos = $area.find('div.woo').not(':empty').not('.woo-wait'),
      len = $woos.length,
      bigtosmall = false;
    if( $t.hasClass('bigtosmall') ){
      bigtosmall = true
    }

    // bigtosmall=true 从大到小排序
    for( j=0; j<=len-1; j++ ){
      for ( i=0; i<len-j; i++ ){
        var $eq0 = $woos.eq(i),
          $eq1 = $woos.eq(i+1),
          cmp0 = parseInt($eq0.find('.d1').text()),
          cmp1 = parseInt($eq1.find('.d1').text());
        if( bigtosmall && cmp0 < cmp1 || !bigtosmall && cmp0 > cmp1 ){
          $eq0.before($eq1)
          $woos = $area.find('div.woo').not(':empty').not('.woo-wait')
        }
      }
    }

    $('#gotonext').click()
  })


  // 上传横幅图
  if( $.fn.uploadpic ){
    var uploadparam = {
      "sel_holder" : '.reply-addpic',
      "sel_form" : '.form-reply-uppic',
      "sel_normal" : '.reply-normal',
      "sel_error" : '.reply-uperror',
      "sel_uploading" : '.reply-uploading',
      "sel_uploaded" : '.reply-uploaded'
    };
    $('#reply-addpic-btn').uploadpic(function (jsn,$holder,opts){
      if( jsn.success && jsn.src ){
        $('#wtfheadpic').val(jsn.src)
      }
    },uploadparam)
    $('#reply-addpic-m-btn').uploadpic(function (jsn,$holder,opts){
      if( jsn.success && jsn.src ){
        $('#wtfheadpicm').val(jsn.src)
      }
    },uploadparam)
    $('#reply-addpic-p-btn').uploadpic(function (jsn,$holder,opts){
      if( jsn.success && jsn.src ){
        $('#wtfheadpicp').val(jsn.src)
      }
    },uploadparam)
  }

  // 发布弹出框
  $('#pgdopost').click(function (e){
    SUGAR.PopOut.alert(['生成瀑布流',$('#popwtfpost'),''],2);
  })


  // 预览相关导航
  $('#wtfprevrelated').click(function (e){
    var related = $('#wtfrelated').val();
    if( !vilidateHtml(related) ){
      return
    }

    var $prevtt = $('#prev_related_wrap')
    if( !$prevtt.length ){
      $prevtt = $('<div id="prev_related_wrap" class=""><div id="prev_related_cont" class="wtfrlt"></div><a id="close_related_top" href="javascript:;"></a></div>').prependTo('body')

      $('#close_related_top').click(function (e){
        $prevtt.slideUp(200,function (){
          $prevtt.css("display","none")
        })
      })
    }
    $prevtt.css({
      "display" : "none"
    }).slideDown(200,function (){
      var $wtfrelatea = $('#prev_related_cont').html(related).find('a'),
        wtfa = $wtfrelatea.length;
      $wtfrelatea.each(function(i,e){
        var $e = $(e);

        $e.attr('target','_blank')
        if( i == 0 ){
          $e.closest('li').addClass('first')
        }
        if( i == wtfa-1 ){
          $e.closest('li').addClass('last')
        }
      })
    });
  })


  // timepicker 选择延迟发布时间
  $('#wtfposttime').datetimepicker({
    showMinute: true,
    showSecond: false,
    timeFormat: 'hh:mm',
    hour : 8,
    stepHour: 1,
    stepMinute: 1,
    stepSecond: 1
  });

  // 瀑布流生成 发布
  $('#form-wtfpost').safeSubmit(function (e){
    var $area = $('#woo-holder'),
      $form = $(this),
      $abtn = $form.find('.abtn'),
      path = $.trim($('#wtfpath').val()),
      subpage = parseInt($('#wtfsubpage').val()) || 4,
      minpage = 4,
      maxpage = 100,
      unitnum = 24,
      title = $.trim($('#wtfnwtitle').val()),
      adpic = $('#wtfheadpic').val(),
      adpicm = $('#wtfheadpicm').val(),
      adpicp = $('#wtfheadpicp').val(),
      description = $.trim($('#wtfnwdesc').val()),
      units = $.Woo.WooTemp.masnUnits;


    if( !$area.find('.woo').length ){
      alert('没有内容不能发布')
      return
    }

    if( title === '' ){
      alert('请填写页面标题')
      return
    }
    if( path === '' ){
      alert('请填写页面访问路径')
      return
    }
    if( path.indexOf('-') > -1 ){
      alert('请使用下划线 "_" 代替中杠 "-"')
      return
    }

    // 对 path 进行解析
    if( path.charAt(0) === '/' ){
      path = path.substr(1)
    }
    if( path.charAt(path.length-1) !== '/' ){
      path += '/'
    }
    path = '/ev/' + path;
    if( path.indexOf(' ') > -1 ){
      alert('地址不能为空')
    }
    if( !path.match(/^\/([\w\d_-]+\/){1,3}$/ig) ){
      alert(path+'\n路径不符合要求，最多三层级。例：/ev/shop/season1/')
      return
    }


    if( subpage > maxpage || subpage < minpage ){
      alert('子页码数范围 '+minpage+' - ' + maxpage)
      return
    }

    if( !adpic ){
      alert('请上传横幅图片')
      return
    }
    if( !adpicm ){
      alert('请上传手机端横幅图片')
      return
    }
    if( !adpicp ){
      alert('请上传平板机横幅图片')
      return
    }


    // html分块
    var $woos = $area.find('div.woo').not(':empty').not('.woo-wait').filter(':lt('+(unitnum*subpage)+')'),
      $txas = $('#form-wtfpost').find('textarea.wtfpart'),
      i = 0;

    // 验证#wtfrelated 里的字符串是否符合html 格式
    var related = $.trim($('#wtfrelated').val().replace(/\/evpre\//ig,'/ev/')),
      rendrelated = '';
    if( related && !vilidateHtml(related) ){
      return
    }else if( related ){
      // 如果有 related 相关导航，进行 first last 判定
      var $wrap = $('#wtfrelated-wrap');
      if( !$wrap.length ){
        $wrap = $('<div id="wtfrelated-wrap"></div>');
        $.G.store($wrap);
      }
      $wrap.html(related);

      var $wraplis = $wrap.find('li'),
        wtfa = $wraplis.length;
      $wraplis.each(function (i,e){
        var $t = $(e);
        if( i == 0 ){
          $t.addClass('first')
        }
        if( i == wtfa-1 ){
          $t.addClass('last')
        }
        $t.find('a').attr('href',function (i,old){
          return old.replace(/(.*[^\/])$/ig,'$1/');
        })
      })

      rendrelated = $wrap.html()
    }



    // 使用js 模板拼装新页面框架
    var data = {
      path : path,
      banner : adpic,
      bannerm : adpicm,
      bannerp : adpicp,
      title : title,
      description : description,
      related : rendrelated
    };
    var html = template.render('wtf-page-frame', data);
    $('#wtfmain').val('<title>'+title+'</title>'+html);

    // 将页面上的dym 块收集并放入不同的 textarea 中，作为分页保存
    $.G.recurseDo(function (a){
      var $txa = $txas.eq(i),
        fakeresp = {
          success : true,
          data : {"blogs":[],"has_next":true,"hasrp":true,"nopth":false,"pgsource":"_","piclm":false}
        },
        blogids = [];

      if( !$txa.length ){
        $txa = $('<textarea class="wtfpart dn" name="part'+(i+1)+'" data-optional="1"></textarea>').appendTo($form)
      }
//			$(a.splice(0,unitnum)).appendTo($txa)
      $(a.splice(0,unitnum)).each(function (i,e){
        // fakeresp.data.blogs.push(units[$(e).data('id')+''])
        blogids.push($(e).data('id'))
      })
      // $txa.val(JSON.stringify(fakeresp))
      $txa.val(JSON.stringify(blogids));

      i++;
      return [a]
    },[$woos],$woos.length,10,function (){

      if( $abtn.hasClass('abtn-no') ) return;
      //防止duplicate 提交将提交按钮设置为灰色
      $abtn.addClass('abtn-no');


      var posttimer, ispostsuccess = false;
      //生成瀑布流
      $.ajax({
        url : $form.getFormAction(),
        data : $form.paramForm({"path":path},getToken(2)),
        mysuccess : function(jsn,h){
          ispostsuccess = true;
          window.clearTimeout(posttimer);
          SUGAR.PopOut.alert('<div class="prompt prompt-success"><h3>发布成功！</h3><p><a href="'+path+'" target="_blank">访问线上页面</a></p></div>')
        }
      }).always(function (){
        //防止duplicate 提交将提交按钮重置
        $abtn.removeClass('abtn-no');
      });

      posttimer = window.setTimeout(function (){

        $abtn.removeClass('abtn-no');

        if( !ispostsuccess ){
          SUGAR.PopOut.alert('<div class="prompt prompt-success"><h3>延迟发布成功！</h3><p><a href="'+path.replace(/\/ev\//ig,'/evpre/')+'" target="_blank">预览页面</a></p></div>')
        }
      },4000)
    })
  })
  // 瀑布流 发布结束



  // 指定位置插入 blogid 一般是广告插入需求
  var insertrule = {}
  $('#blogunitinsertdo').bind('click',function (e){
    var $abtn = $(this),
      $form = $('#form-insert'),
      ids = $.trim($('#blogunitinsert').val()),
      reg = /(\d{1,2}\|\d+,)*(\d{1,2}\|\d+)/ig,
      units = $.Woo.WooTemp.masnUnits;


    if( $abtn.hasClass('abtn-no') ) return;

    if( !reg.test(ids) ){
      alert('插入数据格式有问题，请检查！')
      return
    }

    var aid = ids.split(','),
      arr = [];

    for( var i=0,l=aid.length; i<l; i++ ){
      var sp = aid[i].split('|');
      insertrule[sp[1]] = sp[0]
      arr.push(sp[1])
    }

    // 防止重复提交
    $abtn.addClass('abtn-no');
    // 插入瀑布流
    $.ajax({
      type : "GET",
      url : $form.getFormAction(),
      data : $form.paramForm({"ids":arr.join(',')}),
      mysuccess : function(jsn,h){
        var da;
        if( jsn.data && (da=jsn.data.blogs) ){
          var spos = [];
          for( var i=0,l=da.length; i<l; i++ ){
            var $newdym = $('<div class="woo" data-id="'+da[i].id+'"><div class="j"><div class="mbpho"><a class="a" href="/people/mblog/'+da[i].id+'/detail/"><img src="'+da[i].isrc+'" height="'+Math.round(da[i].iht*222/da[i].iwd)+'" /></a></div></div></div>');
            var pos;
            if( pos=insertrule[da[i].id] ){
              $('#woo-holder').find('div.woo').not(':empty').not('.woo-wait').eq(pos).before($newdym)
              spos.push(pos)
            }

            units[da[i].id+''] = da[i]
          }


          wooRepos();
          SUGAR.PopOut.alert('<div class="prompt prompt-success"><h3>插入成功！</h3><p>在第 '+spos.join(',')+' 号位置</p></div>')
        }
      },
      myfailure : function (){
        insertrule = {}
      }
    }).always(function (){
      //防止duplicate 提交将提交按钮重置
      $abtn.removeClass('abtn-no');
    });
    
  })  


  var $popsubpageinsert = $('<div id="popsubpageinsert" style="padding:12px 0 40px 80px"><form id="form-subpageinsert" action="about:blank"><p>填入子瀑布流页面地址：</p><p class="gray">(形如 http://www.duitang.com/ev/goods/)</p><div class="mt8"><input class="ipt" type="text" name="suburl" value=""></div><div class="clr mt8"><a class="abtn" href="javascript:;"><button type="submit"><u>提交</u></button></a></div></form></div>');
  var subpagewoo = [];

  $.G.store($popsubpageinsert);

  $('#form-subpageinsert').safeSubmit(function (){
    var $form = $(this),
      $abtn = $form.find('.abtn');

    if( $abtn.hasClass('abtn-no') ) return;
    $abtn.addClass('abtn-no');

    var url = $.trim($form.find('[name=suburl]').val().replace(/\/ev\//ig,'/evpre/'));
    if( url.substr(0,5) != 'http:' ){
      alert('请填写正确的url地址')
      return;
    }
    if( url.substr(-1,1) != '/' ){
      url += '/'
    }

    requestSubWoo(url, 1, $abtn);
    
  })
  $('#subpageinsertbtn').click(function (e){
    e.preventDefault();
    e.stopPropagation();
    SUGAR.PopOut.alert(['合并瀑布流',$('#popsubpageinsert')]);

  })


  function requestSubWoo(url, page, $abtn){
    $.ajax({
      url : url + page + '/?_type=',
      mysuccess: function(jsn,h) {
        subpagewoo = subpagewoo.concat(jsn.data.blogs);
        if( jsn.data.has_next ){
          requestSubWoo(url,page+1, $abtn);
        }else{
          SUGAR.PopOut.alert('<div class="prompt prompt-success"><h3>请求完成，正在插入数据！</h3></div>');

          // 子瀑布流数据装载入 subpagewoo ，接下来进行瀑布流单元插入
          doWithSubData();

          $abtn.removeClass('abtn-no');
        }
      },
      myerror : function (){
        SUGAR.PopOut.alert('<div class="prompt prompt-failure"><h3>请求失败！</h3><p>'+url + page + '/'+'</p></div>');

        // 一个子页请求失败，满盘皆败；重置 subpagewoo
        subpagewoo = [];
        $abtn.removeClass('abtn-no');
      }
    });
  }

  function doWithSubData(){
    console.log(subpagewoo)

    // 去重
    for(var i=0; i<subpagewoo.length; i++){
      for(var j=i+1; j<subpagewoo.length; j++){
        if( subpagewoo[i].id == subpagewoo[j].id ){
          subpagewoo.splice(j,1)
        }
      }
    }
    if( subpagewoo.length ){
      $.Woo.pagine[0].loadFromJson(subpagewoo,true);

      wooRepos();
    }
  }
})


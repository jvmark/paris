/*
@说明：Web 产品级公用js组件，对应woo 瀑布流组件 masnunit 数据组装
@作者：balibell
@时间：2013-10-28
*/



;(function (){
  if( !$.Woo ){
    return
  }

  // 内部调用，返回是 html str 情况下统一处理方式
  function _strReturn(h){
    var rt = $.trim(h),
      fw = rt.substr(0,1);

    if(fw != '{' && fw != '['){
      if( rt.substr(0,9) === '<!doctype' ){
        return [[],true];
      }

      if( SRCD ){
        rt = rt.replace(/(<img[^>]* class=[\'\"]?i[\'\"]?[^>\"\']*)src/ig,function (a,b){
          return b + 'srcd'
        })
      }

      var $rt = $(rt).filter('.woo'),
        hasnext = $rt.attr('hasnext') === 'False' ? false : true;
      return [$rt.toArray(),hasnext];
    }else{
      // 如果不是html 返回null
      return null
    }
  }


  var ua = navigator.userAgent.toString().toLowerCase(),
    ipad = !!ua.match(/ipad/ig),
    fromblogid = $.G.getParams(window.location.search).from_blog,
    // 是否使用 srcd 替代<img /> 的src 属性，用于图片延迟加载
    // ipad 不适用，因为出过 bug
    SRCD = !ipad,
    // (function数组) 每次请求成功后，对数据进行分析处理
    ANALYZERESPONSE = [],
    // (function数组) 使用artTemplate 拼装数据
    RENDER = [],
    // (template数组) 存放不同类型的template
    TEMPLATES = [],
    // (extra数据数组) ANALYZERESPONSE 方法内填充 extra 数据供 RENDER 方法使用
    EXTRADATA = [];

  //####################################################################
  TEMPLATES = [
  '<% for (var i = 0; i < list.length; i ++) { %><% var u = list[i],aidx = $unit(u.id,u),plnk = $pricelnk(u,pgsource),imgsize=[224,0],newiht=$trans(224,u.iwd,u.iht); %><% if(!aidx) continue; %><div class="woo" data-id="<%=u.id%>"><div class="j"> \
  <div class="mbpho" <% if( !imgsize[1] ){ %>style="height:<%=newiht > 800 ? 800 : newiht%>px;"<% }else{ %>style="height:<%=imgsize[1]%>px"<% } %> ><a target="_blank" <% if( u.ourl ){ %>class="a"  href="<%=u.ourl%>"<% }else if( coupon && plnk ){ %>class="a" <% if(u.tid){ %> biz-itemid="<%=u.tid%>" data-type="0" data-rd="1" <% } %> href="<%=plnk%>"<% }else{ %>class="a"  href="/people/mblog/<%=u.id%>/detail/"<% } %>><img <%=srcd ? "srcd" : "src"%>="<%=$imgsrc(u.isrc,imgsize)%>" data-rootid="<%=u.rid%>" data-iid="<%=u.photo_id%>" height="<%=newiht%>"/><u <%= newiht > 800 ? "class=\'bottomfade\'" : ""%> style=\'margin-top:-<%=newiht%>px;height:<%= newiht > 800 ? 798 : (newiht-2)%>px;\'></u></a> \
    <div class="collbtn" data-favorite=\'{"id":"<%=u.id%>","owner":"<%=u.uid%>"}\'><a <% if( ruid == u.uid ){ %>class="y re-done" title="去看我的收集" href="/people/mblog/<%=u.id%>/detail/" target="_blank"><i class="y-done"></i><em>已收集 <% }else if( ruid == u.ruid ){ %>class="y re-done" title="去看我的收集" href="/people/mblog/<%=u.rid%>/detail/" target="_blank" ><i class="y-done"></i><em>已收集 <% }else{ %>class="y" href="#" ><i></i><em>收集 <% } %><% if(u.favc > 0) {%><%=u.favc%><% } %></em></a><a class="x btn-white" href="#"><i><%=u.repc%></i></a><a <% if( ruid == u.ruid || ruid == u.uid ){ %>class="z re-zan btn-white" href="/people/mblog/<%=u.id%>/detail/"><i class="z-done"><% }else{ %>class="z btn-white" href="#" ><i><% } %><%=u.zanc%></i></a></div> \
  </div> \
  <div class="wooscr"> \
  <div class="g"<% if (u.wait_audit) {%> style="background-color:#f14382"<% } %>><%=$content(u.msg)%></div> \
  <div class="d"><span <% if( u.favc > 0 ){ %>class="d1"><% }else{ %>class="d1 dn"><% } %><%=u.favc%></span><span <% if( u.zanc > 0 ){ %>class="d2"><% }else{ %>class="d2 dn"><% } %><%=u.zanc%></span><span <% if( u.repc > 0 ){ %>class="d3"><% }else{ %>class="d3 dn"><% } %><%=u.repc%></span><% if(!coupon && plnk){ %>&nbsp;<%=$price(u,plnk)%><% } %></div> \
<% if( coupon && plnk ){ %> \
  <%=$coupon(u,plnk)%> \
<% } %> \
  <ul> \
<% if( nopth ){ %> \
  <li class="f"></li> \
<% }else{ %> \
  <li class="f"><a target="_blank" href="/people/?user_id=<%=u.uid%>"><img width="24" height="24" src="<%=u.ava%>"></a><p><a class="p" target="_blank" href="/people/?user_id=<%=u.uid%>"<% if (u.sender_wait_audit) {%> style="color:#f14382"<% } %>><%=$cut(u.unm,16)%></a>&nbsp;<br/><span><%= u.uid == u.ruid ? "发布" : "收集" %>到&nbsp;<% if(u.albid){ %><a target="_blank" href="/album/<%=u.albid%>/"<% if (u.album_wait_audit) {%> style="color:#f14382"<% } %>><%=$cut(u.albnm,12)%></span></a><% }else{ %><a target="_blank" href="/album/people/<%=u.uid%>/">默认专辑</a><% } %></p></li> \
<% } %> \
<% for(var j=0,l=hasrp?u.cmts.length:0; j<l; j++){ %> \
  <li><a target="_blank" href="/people/?user_id=<%=u.cmts[j].id%>"><img width="24" height="24" src="<%=u.cmts[j].ava%>"></a><p><a target="_blank" href="/people/?user_id=<%=u.cmts[j].id%>"><% if( ruid == u.cmts[j].id ){ %>我<% }else{ %><%=$cut(u.cmts[j].name,16)%><% } %></a><br/><span><%=$content(u.cmts[j].cont)%></span></p></li> \
<% } %>' +
  '</ul></div>' +
  ($.G.isSTAFF() ? '<div class="clr staf"><% if(u.is_robot){ %><span class="red mr8">机器人</span><% } %><% if(u.srclnk){ %><span class="red mr8">来源</span><% } %><% if(u.sta == 7){ %><a href="javascript:;" data-confirm="/operate/audit/unblock_blog/?id=<%=u.id%>" class="mblogpass">PASS</a><a href="javascript:;" data-confirm="/operate/audit/block_photo/?id=<%=u.id%>" class="mblogblackall">屏蔽all</a><% }else if( u.sta == 6 ){ %><a href="javascript:;" data-confirm="/operate/audit/unblock_photo/?id=<%=u.id%>" class="mblogunblackall">解屏all</a><% }else{ %><a href="javascript:;" data-confirm="/operate/audit/block_photo/?id=<%=u.id%>" class="mblogblackall">屏蔽all</a><% } %><% if( list[0].common ){ %><a href="javascript:;" data-confirm="/blog/switchshopping/<%=list[0].rid%>/?opt=on" class="mbloggood">精</a><% }else if( list[0].good ){ %><a href="javascript:;" data-confirm="/blog/switchshopping/<%=list[0].rid%>/?opt=off" class="mblogungood">去精</a><% } %></div>' : '') +
'</div></div><% } %>',
  null,
  null,
  null
  ],




  //####################################################################
  RENDER = [
    function (arr){
      if( arr && arr.length && $.isPlainObject(arr[0]) ){
        var ruid = $.G.getUSERID(),
          dat = EXTRADATA[0],
          data = {
            list : arr,
            srcd : SRCD,					// 是否要使用 srcd
            ruid : ruid,					// request useid
            picsize : "224",			// dat.picsize缩略图的尺寸
            coupon : dat.coupon,			// 是否显示折扣信息
            hasrp : dat.hasrp,				// 是否采用新型的回复列表
            nopth : dat.nopth,				// 不显示收集发布动作
            pgsource : dat.pgsource			// 用于后台打点
          };

        var render = template.compile(TEMPLATES[0]);
        var html = $.trim(render(data));

        return html
      }else{
        // 如果本来就是 dom 数组则直接返回
        return arr
      }
    },
    null,
    null,
    null
  ],

  //####################################################################
  // 这里给出了两种不同的数据组装方式，
  // 第一种使用 artTemplate 将字典对象转化成 html 字符串
  // 第二种直接使用 + 号连接字符串
  // 方法返回值必须是数组 ret = [cont,hasnext,totalcount] 前两个必须有，totalcount 可选
  // ret[0]=cont 可以为字典(对应第一种组装方式)，也可以返回dom树(对应第二种组装方式)
  ANALYZERESPONSE = [
    // ANALYZERESPONSE[1] 使用第二种组装方式，return 的主体内容 ret[0] 是dom 树
    // 采用第二种方式的话，不需要使用 artTemplate 
    // 因此，RENDER TEMPLATES EXTRADATA (后两者均只为RENDER服务)都不需要
    // RENDER[1] 设为 null，其依赖的 TEMPLATES[1] 也设为 null
    // EXTRADATA 没有初始值，只在需要的时候使用
    function (h){
      var strrt = _strReturn(h);
      if( strrt ){
        return strrt;
      }

      var ret = [[],true];
      //转json对象
      //var jsn = $.parseJSON(h)
      var jsn = $.isPlainObject(h) ? h : $.parseJSON(h)
      //如果parse 失败，直接返回
      if(!jsn) return ret;


      //判断jsn 请求是否成功返回数据
      if(jsn.success){
        var ruid = $.G.getUSERID(),
          dat = jsn.data,
          undefined;

        EXTRADATA[0] = {
          "picsize" : "224",		// dat.picsize缩略图的尺寸
          "coupon" : !!dat.coupon,		// 是否显示折扣信息
          "hasrp" : !!dat.hasrp,			// 是否采用新型的回复列表
          "nopth" : !!dat.nopth,			// 不显示收集发布动作
          "pgsource" : dat.pgsource		// 用于后台打点
        }
        ret = [
          dat.blogs,
          dat.has_next,
          dat.count
        ]
      }
      return ret;
    },
    //myhome 和 搜索专辑结果页面 专辑单张封面，p 表示prepare 预加载
    function (h){
      var strrt = _strReturn(h);
      if( strrt ){
        return strrt;
      }

      var ret = [[],true];
      //转json对象
      //var jsn = $.parseJSON(h)
      var jsn = $.isPlainObject(h) ? h : $.parseJSON(h)
      //如果parse 失败，直接返回
      if(!jsn) return ret;


      //判断jsn 请求是否成功返回数据
      if(jsn.success){
        var $rt = $(null),
          dat = jsn.data;
        for(var i=0,d=dat.albums,l=d.length; i<l; i++){
          var unm = d[i].username || '',
              oClass = d[i].wait_audit ? 'ohblocked' : 'ohnoblocked',
              oText = d[i].wait_audit ? '解屏' : '屏蔽',
              unt = [
                '<div class="woo" data-id="',d[i].id,'" data-ht="328" '+( i == 0 ? 'hasnext="' + (dat.has_next ? 'True' : 'False') + '"' : '' )+'>',
                  '<div class="albbigimg">',
                    '<p class="lev2"></p>',
                    '<p class="lev1"></p>',
                    '<a href="/album/',d[i].id,'/" class="lev0" target="_blank">',
                    (function (){
                    var iu = '';
                      if(d[i].pics){
                        for(var j=0; j<1 && j<d[i].pics.length; j++){
                          if( j==0 ){
                            iu += '<img '+(SRCD ? 'srcd' : 'src' )+'="'+$.G.dtImageTrans(d[i].pics[j],true,200,200,'c')+'" alt="'+d[i].name+'"/>';
                          }else{

                          }
                        }
                      } else {
                        iu += '<img src="http://img4.duitang.com/uploads/people/201307/10/20130710134638_QtMin.jpeg" alt="'+d[i].name+'" />'
                      }
                      return iu;
                    })(),
                    '</a>',
                    '<p class="lev3"'+(d[i].wait_audit ? ' style="background-color:#f00"':'')+'></p>',
                    '<div>',d[i].name.cut(24,'…'),'</div>',
                  '</div>',
                  '<ul>',
                  '<li>',($.G.isSTAFF() ? '<a class="r blockthisalbum ' + oClass + '" title="'+d[i].id+'" href="javascript:;" style="margin-left: 40px;">' + oText + '</a>' : ''),( d[i].user_id == $.G.getUSERID() ? '<a class="r delthisalbum" title="'+d[i].id+'" href="javascript:;">删除</a>' : ''),'<span>',d[i].count,'个收集 | ',d[i].like_count,'人喜欢</span></li>',
                  '<li class="clr"><a href="/people/?user_id=',d[i].user_id,'" target="_blank">',
                  '<img src="',d[i].avatar,'" />',
                  unm.cut(14,'…'),'</a></li>',
                  '<li>'+ d[i].desc +'</li>',
                  '</ul>',
                '</div>'
              ].join('')

          $rt = $rt.add($(unt))
        }
        ret = [$rt.toArray(),dat.has_next]
      }
      return ret;
    },
    // 新专辑，哈哈
    function (h){
      var strrt = _strReturn(h);
      if( strrt ){
        return strrt;
      }

      var ret = [[],true];
      //转json对象
      //var jsn = $.parseJSON(h)
      var jsn = $.isPlainObject(h) ? h : $.parseJSON(h)
      //如果parse 失败，直接返回
      if(!jsn) return ret;


      //判断jsn 请求是否成功返回数据
      if(jsn.success){
        var $rt = $(null),
          dat = jsn.data;
        for(var i=0,d=dat.albums,l=d.length; i<l; i++){
          var abm = d[i],
              unm = abm.username || '',
              oClass = abm.wait_audit ? 'ohblocked' : 'ohnoblocked',
              oText = abm.wait_audit ? '解屏' : '屏蔽',
              unt = [
                '<div class="woo" data-id="',abm.id,'" data-ht="358" '+( i == 0 ? 'hasnext="' + (dat.has_next ? 'True' : 'False') + '"' : '' )+'>',
                  '<div class="dt-xitem-img">',
                    (function (){
                    var iu = '';
                      if(abm.pics){
                        for(var j=0; j<1 && j<abm.pics.length; j++){
                          if( j==0 ){
                            iu += '<img '+(SRCD ? 'srcd' : 'src' )+'="'+$.G.dtImageTrans(abm.pics[j],true,224,224,'c')+'" alt="'+abm.name+'"/>';
                          }else{

                          }
                        }
                      } else {
                        iu += '<img src="http://img4.duitang.com/uploads/people/201401/24/20140124115823_HJydi.png" alt="'+abm.name+'" />';
                      }
                      return iu;
                    })(),
                    '<a href="/album/',abm.id,'/" class="dt-xitem-icv" target="_blank">',
                    '</a>',
                  '</div>',
                  '<div class="dt-xitem-desc">',
                    '<div class="dt-xitem-title"><a target="_blank" href="/album/',abm.id,'/">',abm.name.cut(24,'…'),'</a></div>',
                    '<div class="dt-xitem-attr">',
                      '<p>',
                        (function(){
                          var ou = '';
                          if(abm.status==7){
                            ou += $.G.isSTAFF() ? '<a class="r blockthisalbum ohblocked ' + '" title="'+d[i].id+'" href="javascript:;">' + 'PASS' + '</a>' : '';
                          }else{
                            ou += $.G.isSTAFF() ? '<a class="r blockthisalbum ' + oClass + '" title="'+d[i].id+'" href="javascript:;">' + oText + '</a>' : '';
                          }
                          return ou;
                        })(),
                        abm.count,'个收集',
                      ' <b>·</b> ',
                        abm.like_count,'人喜欢',
                      '</p>',
                      '<p class="dt-xitem-user">',
                      'by ',
                        '<a target="_blank" href="/people/?user_id=',abm.user_id,'">',
                        abm.username,
                        '</a>',
                      '</p>',
                    '</div>',
                  '</div>',
                  '<div class="dt-xitem-bt1"></div>',
                  '<div class="dt-xitem-bt2"></div>',
                '</div>'
              ].join('');

          $rt = $rt.add($(unt));
        }
        ret = [$rt.toArray(),dat.has_next];
      }
      return ret;
    },

    //新专辑 两列式带滑出操作面板, p 表示prepare 预加载
    function (h){
      var strrt = _strReturn(h);
      if( strrt ){
        return strrt;
      }


      var ret = [[],true];
      //转json对象
      //var jsn = $.parseJSON(h)
      var jsn = $.isPlainObject(h) ? h : $.parseJSON(h)
      //如果parse 失败，直接返回
      if(!jsn) return ret;


      //如果parse 失败，直接返回
      if(jsn.success){
        var $rt = $(null),
          dat = jsn.data;
        for(var i=0,d=dat.albums,l=d.length; i<l; i++){
          var unm = d[i].username || '',
            is_like = d[i].is_like?'<a data-albumlike=\'{"id":'+d[i].id+'}\' class="albumlikebtn albumliked" href="javascript:;">取消喜欢</a>':'<a data-albumlike=\'{"id":'+d[i].id+'}\' class="albumlikebtn" href="javascript:;">喜欢</a>',
            descript = d[i].desc.replace(/<br\s*\/?>/ig,' ').cut(92,'…'),
            qpics = d[i].pics,
            plen = qpics ? qpics.length : 0,
            unt = [
              '<div data-id="',d[i].id,'" data-ht="260" class="woo" '+( i == 0 ? 'hasnext="' + (dat.has_next ? 'True' : 'False') + '"' : '' )+'>' ,
                '<p class="lev1"></p><div class="albbigimg clr"><div class="dec clr"><h2><a target="_blank" href="/album/',d[i].id,'/" title="',d[i].name,'">',d[i].name.cut(20,'…'),'</a></h2><span>',d[i].count,'个收集&nbsp;|&nbsp;',d[i].like_count,'人喜欢</span></div><a target="_blank" href="/album/',d[i].id,'/" class="lev0">',
                (function (){
                  var str = '';
                  for(var j=0; j<5 && j<plen; j++){
                    //默认提取的是80x80 的小图
                    var picj = d[i].pics[j];
                    str += j ? '<img width="80" height="80" src="'+picj+'" />' : '<img width="164" height="164" src="'+$.G.dtImageTrans(picj,true,164,164,'c')+'" />';
                  }
                  return str;
                })(),
                '</a><ul><li><a href="/people/?user_id=',d[i].user_id,'" class="nc"><img width="24" height="24" src="',d[i].avatar,'" />',unm.cut(14,'…'),'</a></li><li class="decpro"><u>&nbsp;</u>',descript,'<i>&nbsp;</i></li><li class="decfav">',is_like,'</li></ul></div>',
              '</div>'
            ].join('')
          $rt = $rt.add($(unt))
        }
        ret = [$rt.toArray(),dat.has_next]
      }
      return ret;
    },
    //测试blog拼装生成
    function (h){
      var strrt = _strReturn(h);
      if (strrt){
        return strrt;
      }
      var ret = [[],true];
      var jsn = $.isPlainObject(h) ? h : $.parseJSON(h);
      if(!jsn) return ret;
      if(jsn.success){
        var $rt  = $(null),
          dat = jsn.data;
        for(var i=0, d = dat.blogs,l=d.length; i<l; i++){
          var u = d[i],
              // aidx = $unit(u.id,u),
              // plnk = $pricelnk(u,pgsource),
              imgsize=[224,0],
              newiht = templateTool._trans(224,u.iwd,u.iht),
              inewiht = newiht > 800 ? 800 : newiht;
          var unt = ['<div class="woo" data-id="',d[i].id,'" data-ht="',d[i].inewiht,'" '+( i == 0 ? 'hasnext="' + (dat.more ? 'True' : 'False') + '"' : '' )+'><div class="j"><div class="mbpho" style="height:',inewiht,'px"><a target="_blank" class="a" href="/people/mblog/',d[i].uid,'/detail/">','<img data-rootid="',d[i].ruid,'" alt="Halloween nails" data-iid="25128630" height="',d[i].newiht,'" src="',d[i].isrc,'"><u></u></a></div><div class="wooscr"><div class="g">',d[i].msg,'</div><div class="d"><span class="d1 dn"></span><span class="d2 dn"></span><span class="d3 dn">0</span>&nbsp;</div><ul><li class="f"><a target="_blank" href="/people/?user_id=',d[i].uid,'"><img width="24" height="24" src="',d[i].ava,'"></a><p><a class="p" target="_blank" href="/people/?user_id=',d[i].uid,'">Florency</a>&nbsp;<br><span>发布到&nbsp;<a target="_blank" href="/album/',d[i].albid,'/">',d[i].albnm,'</a></span></p></li></ul></div></div></div></div>'
          ].join('');

        $rt = $rt.add($(unt))
        }
        ret = [$rt.toArray(),dat.has_next]
      }
      return ret;
    },
    //拼装新的json数据
    function (h){
      var strrt = _strReturn(h);
      if (strrt){
        return strrt;
      }
      var ret = [[],true];

      var jsn = $.isPlainObject(h) ? h : $.parseJSON(h);
      if(!jsn) return ret;
      if(jsn.status === 1){
        var $rt  = $(null),
          dat = jsn.data;
        for(var i=0, d = dat.object_list,l=d.length; i<l; i++){
          var u = d[i],
              // aidx = $unit(u.id,u),
              // plnk = $pricelnk(u,pgsource),
              imgsize=[224,0],
              newiht = templateTool._trans(224,u.photo.width,u.photo.height),
              inewiht = newiht > 800 ? 800 : newiht;
          var unt = ['<div class="woo" data-id="', d[i].id,'" data-ht=""><div class="j"><div class="mbpho" style="height:',inewiht,'px"><a target="_blank" class="a" href="/people/mblog/',d[i].id,'/detail/">','<img data-rootid="" alt="Halloween nails" data-iid="25128630" height="',newiht,'" src="',d[i].photo.path,'"><u></u></a></div><div class="wooscr"><div class="g">',d[i].msg,'</div><div class="d"><span class="d1 dn"></span><span class="d2 dn"></span><span class="d3 dn">0</span>&nbsp;</div><ul><li class="f"><a target="_blank" href="/people/?user_id=',d[i].id,'"><img width="24" height="24" src=""></a><p><a class="p" target="_blank" href="/people/?user_id=',d[i].id,'">Florency</a>&nbsp;<br><span>发布到&nbsp;<a target="_blank" href="/album/',d[i].album.id,'/">',d[i].album.name,'</a></span></p></li></ul></div></div></div></div>'].join('');
          // var unt = ['<div class="woo" data-id="', d[i].id,'" data-ht="" '+( i == 0 ? 'hasnext="' + (dat.has_next ? 'True' : 'False') + '"' : '' )+'><div class="j"><div class="mbpho" style="height:',inewiht,'px"><a target="_blank" class="a" href="/people/mblog/',d[i].id,'/detail/">','<img data-rootid="" alt="Halloween nails" data-iid="25128630" height="',newiht,'" src="',d[i].photo.path,'"><u></u></a></div><div class="wooscr"><div class="g">',d[i].msg,'</div><div class="d"><span class="d1 dn"></span><span class="d2 dn"></span><span class="d3 dn">0</span>&nbsp;</div><ul><li class="f"><a target="_blank" href="/people/',d[i].id,'/"><img width="24" height="24" src=""></a><p><a class="p" target="_blank" href="/people/',d[i].id,'/">Florency</a>&nbsp;<br><span>发布到&nbsp;<a target="_blank" href="/album/',d[i].album.id,'/">',d[i].album.name,'</a></span></p></li></ul></div></div></div></div>'].join('');
        $rt = $rt.add($(unt))
        }
        ret = [$rt.toArray(),dat.more]
      }
      return ret;
    }
  ];


  //####################################################################
  // template  内部调用方法
  template.helper('$coupon', function (u,plnk) {
    var str = '',
      p = parseFloat(u.price),
      cp = parseFloat(u.coupon_price);
    if( p && cp ){
      str = '<div class="v"><a href="'+plnk+'" target="_blank">￥'+cp+'</a><s>￥'+p+'</s><a class="q" href="'+plnk+'" target="_blank">查看详情</a><p>'+(Math.round((cp/p)*100)/10)+'折</p></div>'
    }

    return str
  });

  template.helper('$price', function (u,plnk) {
    return u.buylnk ? '<a class="bl '+(!u.price?'by':'')+'" href="'+plnk+'" target="_blank"'+ (u.tid ? 'biz-itemid="'+u.tid+'" data-type="0" data-rd="1"' : '')+ '><u class="_tb" title="去购买">'+(u.price?'￥'+u.price:'&nbsp;')+'</u></a>' : ''
  });

  template.helper('$pricelnk', function (u,pgsource) {
    var plnk = u.prelnk || '',
      djgo = $.G.isRedirect(plnk);
    if( !djgo ){
      plnk = '/dj/go2/?to='
    }
    if( u.buylnk ){
      plnk = $.G.addParam(plnk,'to',encodeURIComponent(u.buylnk))
      plnk = $.G.addParam(plnk,'mk',(pgsource?pgsource:'_')+'p_'+u.id)
    }
    return plnk
  });

  template.helper('$imgsrc', function (src,imgsize) {
    if( $.isArray(imgsize) ){
      return $.G.dtImageTrans(src,true,imgsize[0],imgsize[1],'');
    }else{
      return src
    }
  });
  // template.helper('$imgsize', function (picsize) {
  //   if( picsize ){
  //     var arr = picsize.split('_');
  //     return arr.length > 1 ? [parseInt(arr[0]),parseInt(arr[1]),arr[2] || ''] : null;
  //   }else{
  //     return null
  //   }
  // });

  template.helper('$content', function (msg) {
    var strmsg = $.G.trimLink(msg,$.G.isSTAFF()),
      tmsg = strmsg;
    return tmsg;
  });
  template.helper('$cut', function (s,num) {
    return s.cut(num,'…')
  });
  template.helper('$trans', function (wd, orgwd,orght) {
    if( 0 == orgwd ){
      return 0;
    }
    return Math.floor(orght*wd/orgwd)
  });
  template.helper('$unit', function (id,jsn) {
    id += '';

    // the third param indicates that duplication-avoid is open
    return WT.addUnit(id,jsn,true);
  });

// 拼装template前 数据预处理方法
  var templateTool = {
    _trans: function(wd, orgwd, orght) {
      if( 0 == orgwd ){
        return 0;
      }
      return Math.floor(orght*wd/orgwd)
    }
  }


  /*
  @说明：$.Woo.WooTemp 类
  */
  var WT = (function (){
    var WT = {
      ulen : 0,
      latestUnits : {},
      init : function (a,b){
        WT.analyzeResponse = a,
        WT.render = b,

        // 当前可见瀑布流的数据集合
        WT.masnUnits = {};
      },
      reset : function (){
        WT.ulen = 0,
        WT.masnUnits = {};
      },
      getLatestUnits : function (){
        return WT.latestUnits;
      },
      resetLatestUnits : function (){
        WT.latestUnits = {};
      },
      setUnitsFromLatest : function (){
        var jsnunits = WT.latestUnits;
        if( $.isPlainObject(jsnunits) ){
          WT.masnUnits = jsnunits;
        }
      },
      addUnit : function (id, jsn, avoidduplicate){
        var munits = WT.masnUnits;
        // munits 去重工作
        if( (!avoidduplicate || !munits[id]) && fromblogid != id ){
          WT.latestUnits[id] = jsn,
          munits[id] = jsn,
          WT.ulen++,
          munits[id].indx = WT.ulen-1;

          return WT.ulen;
        }else{
          // 如果有重复，返回0，则不做添加动作
          return 0
        }
      }
    }
    return WT;
  })()

  WT.init(ANALYZERESPONSE,RENDER);



  $.Woo.WooTemp = WT;

})()





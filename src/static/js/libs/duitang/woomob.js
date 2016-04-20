/*
@说明：Mobile 产品级公用js组件，对应woo in mobile 瀑布流组件
@作者：balibell
@时间：2013-10-12
*/

/*
@说明：默认的瀑布流初始方法
@参数
split			(Str) 拼装url 的split 值
*/
function wooInit(split){
  split = split || '';
  // Woo 堆糖瀑布流参数配置
  var $wooholder = $('#woo-holder');
  $wooholder.find('.woo-pager:first').append('<a id="gopre" href="javascript:;">上一页</a><a id="gonext" href="javascript:;">下一页</a>')
  .css({
    "height" : 0,
    "overflow" : "hidden"
  })

  var conf = {
    // * 每页的单元数
    "unitsnum" : 24,

    // * 每一大页子页数量
    "subpagenum" : 5,

    // 标识数组，每个标识对应一个瀑布流
    "arrform" : ["collect"], 

    // 请求地址在页码处split分开的后半截
    "arrsplit" : split,

    // 瀑布流每一列扩展宽度，此宽度包含两列之间的间距。
    "arrmasnw" : 104,

    // 瀑布流两列之间的间距。此例第一个瀑布流的可视宽度为 245-21=224
    "arrmargin" : 8,

    // 第一列特殊宽度 默认等于 arrmasnw。
    "arrfmasnw" : 0,

    // 通过 gap 可以设置同一列单元块之间的垂直间距
    "arrgap" : 8,

    /////////////////// 【上方各参数必须填写，否则后果自负】

    // 可自由选择安装 $gopre $gonext $gotop 等操作键。
    "gopre" : '#gopre',
    "gonext" : '#gonext',
//		"gotop" : '#gotop',

    // footer 选择器，只要处于瀑布流翻页器下方的都可视为 footer。
    // 它的隐藏和显示将会受到控制。
    "footer" : 'footer',

    "anchordiff" : 12,

    // window resize 时，是否重绘瀑布流，默认不重绘。此功能打开，resize.css 才有意义
    "resize" : true,

    "onOnePageOver": function(pg, idx) {
      if (pg.currentUpperPage === 1) {
        $('#gopre').hide();
        $('#gopre').css({'float': 'none', 'width': '304px', 'margin-right': '0px'});
        $('#gonext').css({'float': 'none', 'width': '304px'});
      } else if (!pg.hasNextUpperPage) {
        $('#gopre').show();
        $('#gonext').hide();
        $('#gopre').css({'float': 'none', 'width': '304px', 'margin-right': '0px'});
        $('#gonext').css({'float': 'none', 'width': '304px'});
      } else{
        $('#gopre').css({'float': 'left', 'width': '152px', 'margin-right': '12px', 'visibility': 'visible'});
        $('#gonext').css({'float': 'left', 'width': '152px'});
      }
    }
  }

  // 启动瀑布流，好短
  $.Woo(conf);
}

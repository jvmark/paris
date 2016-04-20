/*
@说明：Web 产品级公用js组件，对应woo 瀑布流组件
@作者：balibell
@时间：2013-10-29
*/

/* spm 项目 */
// ImportJavascript.url("/js/0/part/spm.js");
// ImportJavascript.url("/static/libs/duitang/masnunit.js");



/*
@说明：默认的瀑布流初始方法
@参数
arrform			- (Arr) 特征值组成的数组
splitpost		- (Str) 请求分页地址的后半截(从页码处split分开)，前半截放在form表单的action里
arrmasnw		- (Arr) 如果使用masonry masnw 表示列宽，默认 245
arrmargin		- (Arr) 列之间的 margin 宽度
arrfmasnw			- (Arr) 第一列特殊宽度 默认等于masnw
*/
function wooInit(arrform,splitpost,arrmasnw,arrmargin,arrfmasnw,nousetop,opt){
  var swaAction = function($nav) {
    if (!$nav || $nav.length ===0) {
      return;
    }
    var $navWrap = $nav.parents('.nav-wrap'),
        $navSpan;
    if (!$navWrap.length) {
      return;
    }
    $navSpan = $navWrap.find('.nav-bottom-span');
    if (!$navSpan.length) {
      return;
    }
    var w = $nav.width(),
        l = $nav.position().left,
        nw = $navSpan.width(),
        nl = $navSpan.position().left;
    // duration = Math.abs((nl + nw) - (l + w)) * 2;
    if (nw === 0) {
      $navSpan.hide().css({'left': l, 'width': w}).fadeIn(300);
    } else {
      $navSpan.stop();
      $navSpan.animate({'left': l, 'width': w, 'opacity': 1}, 300);
    }
  };
	// Woo 堆糖瀑布流参数配置
	var $wooholder = $('#woo-holder');
		ie = $.browser.msie,
		ie6 = ie && $.browser.version === '6.0';



	// 埋入翻页小工具
	!nousetop && $('<a id="gotonext" href="javascript:;" style="visibility:hidden"></a><a href="#" id="retotop"></a><a id="gotopre" href="javascript:;"></a>').sidepop({
		id : 'side-retotop',
		dockSide : 'right',
		width : 82,
		scroll : 2,
		departure : 0,
		baseline : 'bottom',
		bias : 16,
		isFixed : true,
		zIndex : 100,
		btnset : 0
	});


	// bind a 锚记 and checkbox
	var $onlypa = $('#onlyproduct-a');
	if( $onlypa.length ){
		//只查看商品复选框绑定
		$.G.bindChecks('#onlyproduct-a','#woo-form-hot,#woo-form-new',undefined,function (){
			var $swa = $('.woo-swa'),
				PAGINE = $.Woo.pagine,
				n = $swa.index($swa.filter('.woo-cur'));

			return PAGINE[n] && !PAGINE[n].loading && !PAGINE[n].lazyAdding
		},function (){
			var $swa = $('.woo-swa'),
				PAGINE = $.Woo.pagine,
				n = $swa.index($swa.filter('.woo-cur')),
				isunchk = $onlypa.hasClass('onlyproduct-0');

			if( PAGINE[n] && !PAGINE[n].loading && !PAGINE[n].lazyAdding ){
				PAGINE[n].refreshPage(1);

				// 配合 a 锚记绑定 checkbox 使用
				if( isunchk ){
					$onlypa.removeClass('onlyproduct-0 onlyproduct-0-no').addClass('onlyproduct-1 onlyproduct-1-no')
				}else{
					$onlypa.removeClass('onlyproduct-1 onlyproduct-1-no').addClass('onlyproduct-0 onlyproduct-0-no')
				}
			}
		})
	}


	var conf = {
		// * 每页的单元数
		"unitsnum" : 24,

		// * 每一大页子页数量
		"subpagenum" : 5,

		// 每次append插入dom的单元个数
		"appendnum" : 12,


    "anchordiff" : 80,

		// 标识数组，每个标识对应一个瀑布流
		"arrform" : arrform || ['hot','new'], 

		// 请求地址在页码处split分开的后半截
		"arrsplit" : splitpost || '',

		// 瀑布流每一列扩展宽度，此宽度包含两列之间的间距。
		"arrmasnw" : arrmasnw || 245,

		// 瀑布流两列之间的间距。此例第一个瀑布流的可视宽度为 245-21=224
		"arrmargin" : arrmargin || 21,

		// 第一列特殊宽度 默认等于 arrmasnw。取值为与正常宽度的diff。
		"arrfmasnw" : arrfmasnw || 0,

		// 通过 gap 可以设置同一列单元块之间的垂直间距
		"arrgap" : 0,

		/////////////////// 【上方各参数必须填写，否则后果自负】

		// 可自由选择安装 $gopre $gonext $gotop 等操作键。
		"gopre" : '#gotopre',
		"gonext" : '#gotonext',
		"gotop" : '#retotop',

		// footer 选择器，只要处于瀑布流翻页器下方的都可视为 footer。
		// 它的隐藏和显示将会受到控制。
		"footer" : '#footer',

		// 页面顶部导航 fixed 70 高度
		"anchordiff" : 70,

		// Sth you do during scrolling, say, pop out a login confirm.
		"onScroll" : function (tp){
			// tp current scrolltop
			if( !$.G.getUSERID() && (typeof ALREADYNOTICED === 'undefined' || !ALREADYNOTICED) && tp >= 1000 && window.location.pathname.match(/^\/(category|topics|album|shopping|blogs)/ig ) ){
				ALREADYNOTICED = true
				SUGAR.PopOut.login();
			}
		},

		// 每次lazyAdd 结束之后执行
		"onLazyAddOver" : function (pg, idx){
			// pg 为 Pagine 实例，pg.$pager 为底部翻页容器
			// idx 表示当前瀑布流的序号
			if( !pg.loading ){
				var $onlypa = $('#onlyproduct-a,#onlyproduct-set a')
				$onlypa.removeClass('onlyproduct-0-no onlyproduct-1-no')
			}
		},

		// 每次 tabswitch 执行
		"onTabSwitch" : function ($swtrigs,$swconts,a,pre,c){
			// $swtrigs tabswitch 触发按钮
			// $swconts tabswitch 内容区块
			// a 表示当前序号 pre 表示前一个序号 c 表示是点击或自动播放触发的tabswitch
			$swtrigs.parent().removeClass('dymswitch-'+pre + ' dymswitch-'+pre+'to'+a).addClass('dymswitch-'+a);
      swaAction($('.woo-swa').eq(a));
		},

		// 请求分页数据，请求结束后 always 执行
		"requestAlways" : function (pg, idx){
			if( !pg.lazyAdding ){
				var $onlypa = $('#onlyproduct-a,#onlyproduct-set a')
				$onlypa.removeClass('onlyproduct-0-no onlyproduct-1-no')
			}
		},

		// window resize 时，是否重绘瀑布流，默认不重绘。此功能打开，resize.css 才有意义
		"resize" : true
	}

  conf = $.extend(conf, opt);

	// 启动瀑布流，好短
	$.Woo(conf);


	// tabswitch triggers hover 事件绑定
	var $trigs = $('.woo-swa');
	$trigs.hover(function (e){
		var $t = $(this)
		if( !$t.hasClass('woo-cur') ){
			var idx = $trigs.index($t),
				$p = $t.parent(),
				cls = $p.attr('class').replace(/dymswitch-\d+\b/ig,function (a){
					return a + 'to' + idx
				})
			$p.attr('class',cls);
		}
	},function (e){
		var $t = $(this)
		if( !$t.hasClass('woo-cur') ){
			var idx = $trigs.index($t),
				$p = $t.parent(),
				cls = $p.attr('class').replace(/(dymswitch-\d+)to\d+\b/ig,function (a,b){
					return b
				})
			$p.attr('class',cls);
		}
	});

	//调用Favorite 模块，必须已经包含 favorite2.js
	// if($.isFunction(callFavorite) ){
	// 	callFavorite()
	// }

	function checkcallFavorite(){
		try {
			callFavorite()
		}
		catch(err) {
			return;
		}
	}
	
	checkcallFavorite();

	wooStaff();
}


function wooStaff(){
	/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
	/* @@@           供运营人员使用的 分享删除和屏蔽 list页面 可见                @@@ */
	/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
	if( $.G.isSTAFF() && !!$.fn.confirm ){
		var $wooholder = $('#woo-holder');
		//删除当前分享，使用 confirm 组件
		$wooholder.confirm(function (e){
			var $t = $(this),
				url = $t.data('confirm');
			$.get(url, function() {
				$t.closest('div.woo').fadeOut(150,function (){
					$(this).remove()
				})
			});
		},'a.mblogdelete',{"tipword":"确定要删除？"});

		// 删除所有
		$wooholder.confirm(function (e){
			var $t = $(this),
				url = $t.data('confirm');
			$.get(url, function() {
				$t.closest('div.woo').fadeOut(150,function (){
					$(this).remove()
				})
			});
		},'a.mblogdeleteall',{"tipword":"确定要删除all？"});

		//通过当前分享，使用 confirm 组件
		$wooholder.delegate('.mblogpass','click',function (e){
			var $t = $(this),
				url = $t.data('confirm');
			$.get(url, function() {
				$t.closest('div.woo').fadeOut(150,function (){
					$(this).remove()
				})
			});
		});

		$wooholder.delegate('a.mblogblackall', 'click', function (e){
			e.preventDefault();
			e.stopPropagation();

			var $t = $(this),
				url = $t.data('confirm');

			if( $t.hasClass('normal-no') ){
				return
			}

			$t.addClass('normal-no').css("opacity","0.5");
			$.get(url, function() {
				var dac = $t.data('confirm');
				$t.removeClass('mblogblackall normal-no').addClass('mblogunblackall').css("opacity","1").html('解屏').data('confirm',dac.replace('/block_photo/','/unblock_photo/')).closest('div.woo').css("opacity","0.1");
			});
		});

		$wooholder.delegate('a.mblogunblackall', 'click', function (e){
			e.preventDefault();
			e.stopPropagation();

			var $t = $(this),
				url = $t.data('confirm');

			if( $t.hasClass('normal-no') ){
				return
			}

			$t.addClass('normal-no').css("opacity","0.5");
			$.get(url, function() {
				var dac = $t.data('confirm');
				$t.removeClass('mblogunblackall normal-no').addClass('mblogblackall').css("opacity","1").html('屏蔽').data('confirm',dac.replace('/unblock_photo/','/block_photo/')).closest('div.woo').css("opacity","1");
			});
		});


		$wooholder.delegate('a.mbloggood','click',function (e){
			e.preventDefault();
			e.stopPropagation();

			var $t = $(this),
				wd = $t.html(),
				url = $t.data('confirm');

			if( $t.hasClass('normal-no') ){
				return
			}

			$t.addClass('normal-no').css("opacity","0.5");
			$.get(url, function() {
				var dac = $t.data('confirm');
				$t.removeClass('mbloggood normal-no').addClass('mblogungood').css("opacity","1").html('去精').data('confirm',dac.replace('?opt=on','?opt=off')).closest('div.woo').css("opacity","0.1");
			});
		});

		$wooholder.delegate('a.mblogungood','click',function (e){
			e.preventDefault();
			e.stopPropagation();

			var $t = $(this),
				wd = $t.html(),
				url = $t.data('confirm');

			if( $t.hasClass('normal-no') ){
				return
			}

			$t.addClass('normal-no').css("opacity","0.5");
			$.get(url, function() {
				var dac = $t.data('confirm');
				$t.removeClass('mblogungood normal-no').addClass('mbloggood').css("opacity","1").html('精').data('confirm',dac.replace('?opt=off','?opt=on')).closest('div.woo').css("opacity","1");
			});
		});
	}
}

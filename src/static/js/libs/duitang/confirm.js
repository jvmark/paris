/* 
@说明：确认提交或取消
@作者：balibell 
@时间：2011-04-25
*/


/* 类confirm 组件，传递fn 确认之后执行 */
;(function($) {
	$.fn.confirm = function(fn,selector,opt){
		//如果预计的第一个参数不是函数，则参数列左移一位
		if( typeof fn !== 'function' ){
			opt = selector;
			selector = fn;
			fn = $.noop;
		}
		//如果预计的第二个参数不是字符串，则参数列左移一位
		if( typeof selector !== 'string' ){
			opt = selector;
			selector = '';
		}
		//如果预计的第三个参数不是对象，extend一个空对象
		opt = $.extend({},opt);

		var _dir = opt.dir ? 1 : -1; //展开向上(1) or 向下(-1)，默认向下
		var _twd = opt.tipword || '';

		//将confirm 框弹出
		var _slideto = function (r,v){
			$tipcont.css({'display':'block','overflow':'hidden'});
			$('.PL-cfm-cont',$tipcont).stop().clearQueue().css({'marginTop':_dir*r}).animate({
				'marginTop' : _dir*v
			},300,'linear',function (){
				$tipcont
				.css('overflow','visible')
				.css('display',v > r ? 'none' : 'block')
			})
		}

		//主事件，插件启动即要执行该方法，计算confirm 框的位置，并调用_slideto 弹出
		var _clickdo = function (e){
			e.preventDefault();

			var $t = $(this), //触发confirm 操作的dom 节点
				os = $t.offset(),
				ow = $t.outerWidth(),
				oh = $t.outerHeight(),
				dw = $(document).width(),
				dh = $(document).height(),
				wt = $(window).scrollTop(),
				wl = $(window).scrollLeft(),
				ww = $(window).width(),
				wh = $(window).height(),
				w = $tipcont.outerWidth(),
				h = $tipcont.outerHeight(),
				tor = 12,
				//_dir 展开方向决定t 的值
				t = _dir === -1 ? os.top + oh + tor : os.top - h - tor,
				l = os.left-w/2+ow/2,
				undefined;
//aaa('///document height:'+ $(document).height()+'///window height:'+ $(window).height() + '///html height:' + $('html').height())
			//如果超出窗口上下边界
			var tmp1,tmp2;
			tmp1 = dh-h-tor;
			t = t < tor ? tor : (t>tmp1 ? tmp1 : t);

			//如果超出窗口左右边界
			tmp1 = dw-w-tor;
			l = l < tor ? tor : (l>tmp1 ? tmp1 : l);

			tmp1 = t-tor;
			tmp2 = l-tor;
			$('html').animate({scrollTop:tmp1 < wt ? tmp1 : (tmp1=t+tor+h-wh) > wt ? tmp1 : '+=0',scrollLeft: tmp2 < wl ? tmp2 : (tmp2=l+tor+w-ww) > wl ? tmp2 : '+=0'},300);

			$tipcont.css({top:t,left:l}).data({'this':this,'event':e,'fn':fn});
			

			//展现
			$('.PL-cfm-wds',$tipcont).html(_twd)
			_slideto(h,0);
		}

		//弹出层主容器
		var $tipcont= $('#PL-confirm');
		if(!$tipcont.length){
			$tipcont = $('<div id="PL-confirm" class="PL-confirm"><div class="PL-cfm-cont"><div class="PL-cfm-wds tc">'+_twd+'</div><div class="PL-cfm-btns tc"><a class="abtn abtn-s PL-cfm-yes dib" href="javascript:;""><u>确定</u></a><a class="abtn abtn-s PL-cfm-no dib" target="_self" href="javascript:;"><u>取消</u></a></div></div></div>').appendTo('body');

			//将confirm 框收起，只需要建立一次
			var _cancel = function (){
				var h = $tipcont.outerHeight();
				//收起
				_slideto(0,h);
			}
			$('.PL-cfm-yes',$tipcont).click(function (e){
				e.preventDefault();
				$tipcont.data("fn").call($tipcont.data('this'),$tipcont.data('event'))
			}).click(_cancel);
			$('.PL-cfm-no',$tipcont).click(_cancel);
		}
		

		if( selector ){
			this.delegate(selector,'click',_clickdo)
		}else{
			this.click(_clickdo);
		}
		return this;
	}
})(jQuery);
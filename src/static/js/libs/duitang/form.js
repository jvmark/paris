
/*
描述：form 表单相关的方法
*/


/*
描述：表单常用事件
*/
;(function($){
	var $event = $.event,
		$special = $event.special;

	/*
	描述：保证表单的安全提交，配合节点上预埋的 data-optional="1" 使用
	*/
	function safeSubmit(e){
		e.preventDefault();
		e.type = 'safeSubmit';

		if( $event.handle ){
			$event.handle.apply(this,arguments);
		}else if( $event.dispatch ){
			$event.dispatch.apply(this,arguments);
		}
	}

	$event.special.safeSubmit = {
		setup: function() {
			var t = this,
				$t = $(t);

			$event.add(t,'submit',safeSubmit);
		},
		teardown: function() {
			var t = this,
				$t = $(t);
			$event.remove(t,'submit',safeSubmit);
		}
	};

	$.fn.safeSubmit = function(data,fn1,fn2) {
		//如果预计的第三个参数不是函数，则参数列左移一位
		if( typeof fn2 !== 'function' ){
			fn2 = fn1;
			fn1 = data;
			data = null;
		}

		fn2 = fn2 || function (){
			alert('请输入内容')
		}

		return arguments.length > 0 ? this.unbind('safeSubmit').bind('safeSubmit',data,function (e){
			var t = this,
				$t = $(t),
				$ip = $('input[type=text],textarea',$t).not('[name=]').not('[data-optional]'),
				$su = $('[type=submit]',$t)
				safe = true;

			$ip.each(function (i,e){
				if( $.trim($(e).val()) === '' && safe ){
					safe = false;
				}
			})
			$su.each(function (i,e){
				if( $(e).prop('disabled') && safe ){
					safe = false;
				}
			})
			if(safe){
				fn1.call(this,arguments)
			}else{
				fn2.call(this,arguments)
			}
		}) : this.trigger('safeSubmit');
	};
})(jQuery);


;(function($){
	/*
	@说明：获取form 的action 并做encode 操作
	@参数： ajsn      - (Json) 额外添加的json object 连接成字符串
	*/
	$.fn.getFormAction = function (){
		var $t = this,
			form = $t[0];
		if( form && form.tagName.toLowerCase() === 'form' ){
			return encodeURI($t.attr('action'));
		}
		return null;
	}

	/*
	@说明：form 表单序列化为字符串
	@参数： ajsn      - (Json) 额外添加的json object 连接成字符串
	*/
	$.fn.paramForm = function(ajsn){
		var $t = $(this),
				jsn = {};

//.add('[type=checkbox]:checked,[type=radio]:checked',t)
		$t.find('input,select,textarea')
		.not('[type=submit]')   //不要试图在这里加 :disabled 过滤 (but why not?)
		.filter('[name]')
		.each(function (i,a){
			if( ($(a).attr('type') === 'checkbox' || $(a).attr('type') === 'radio') &&  $(a).prop('checked') === true || ($(a).attr('type') !== 'checkbox' && $(a).attr('type') !== 'radio') ){
				if( $.type(jsn[a.name]) !== 'undefined' ){
					jsn[a.name] += ',' + a.value
				}else{
					jsn[a.name] = a.value;
				}
			}
		})
		
		if( $.isPlainObject(ajsn) ){
			$.extend(jsn,ajsn)
		}
		return $.param(jsn);
	}
	/* 
	@说明：textarea input 限制输入
	@作者：balibell 
	@时间：2011-04-25
	@依赖：pack.js 里的 .cut() 方法
	*/
	$.fn.lengthLimit = function(options){
		this.filter('textarea,input[type=text]').each(function(){
			var $t = $(this),
				ml = $t.attr('maxlength');
			var update = function (e){
				var kc = e ? e.keyCode : null;
				if( !kc || kc === 8 || kc === 13 || kc > 36 && kc < 41 ) return

				var t = this,
					v = t.value,
					c = v.cut(ml,'');
				if(c.length < v.length ){
					t.value = c;
					t.scrollTop = t.scrollHeight;
				}
			}
			$(this).change(function (e){
				update.call(this,e)
			}).keyup(function (e){
				update.call(this,e)
			})
			update.apply(this);
		});
		return this;
	}
	/* 
	@说明：textarea input 限制输入
	@作者：balibell 
	@时间：2011-11-11
	*/
	$.fn.inputTagLimit = function(options){
		//let's begin
		var opts = $.extend(true,{},{"invalid":new RegExp("\/"),"taglen":20},options);
		this.filter('textarea,input[type=text]').each(function(){
			var $t = $(this),
				ml = opts.taglen,
				undefined;
			var update = function (e){
				var kc = e ? e.keyCode : null;
				if( !kc || kc === 8 || kc === 13 || kc > 36 && kc < 41 ) return

				var v = $t.val(),
					m = v.split(' '),
					m = m[m.length-1],
					vf = v.substring(0,v.length-m.length);

				if( v[v.length-1] != ' ' && m &&  m.lenB() > ml ){
					m = m.cut(ml,'')
					v = vf + m
				}
				$t.val(v.replace(opts.invalid,''))
				vl = $t.val().length
				$.G.setCursorPosition($t[0],{"start":vl,"end":vl})
			}
			$(this).change(function (e){
				update.call(this,e)
			}).keyup(function (e){
				update.call(this,e)
			})
			update.apply(this);
		});
		return this;
	}

	/* 
	@说明：翻页器输入数字限制
	@作者：balibell 
	@时间：2011-06-2
	@依赖：pack.js 里的 .cut() 方法
	*/
	$.fn.pagelimit = function(options){
		var $t = $(this),
			num = options.length || 0;

		function _reval(){
			var v = parseInt(this.value) || 0;
			var t = num || 0;
			if( v > t ){
				this.value = t;
			}else if( v < 1 ){
				this.value = 1;
			}else{
				this.value = v;
			}
		}

		function _update(e){
			if( !( e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 46 || e.keyCode == 8 ) ){
				_reval.call(this)
			}
		}

		$t.change(_update).keyup(_update)
		_reval.call(this)
	}

	$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
	};

})(jQuery);


/*文本框自动增长插件*/
;(function($) {
	function times(string, number) {
		for (var i = 0, r = ''; i < number; i ++) r += string;
		return r;
	}
	$.fn.autogrow = function(options){
		this.filter('textarea').each(function(){
			this.timeoutId = null;
			var $t = $(this), minHeight = $t.height();
			var shadow = $('<div></div>').css({
				position:   'absolute',
				wordWrap:   'break-word',
				top:        0,
				left:       -9999,
				display:    'none',
				width:      $t.width(),
				fontSize:   $t.css('fontSize'),
				fontFamily: $t.css('fontFamily'),
				lineHeight: $t.css('lineHeight')
			}).appendTo(document.body);

			var update = function(){
				var val = this.value.replace(/</g, '<')
				 .replace(/>/g, '>')
				 .replace(/&/g, '&')
				 .replace(/\n$/, '<br/>&nbsp;')
				 .replace(/\n/g, '<br/>')
				 .replace(/ {2,}/g, function(space) { return times('&nbsp;', space.length -1) + ' ' });
				shadow.html(val);

				$(this).css('overflow','hidden').css('height', Math.max(shadow.height() + (parseInt($t.css('lineHeight')) || 0), minHeight));
			}

			var updateTimeout = function(){
				clearTimeout(this.timeoutId);
				var that = this;
				this.timeoutId = setTimeout(function(){ update.apply(that); }, 100);
			};

			$(this).change(update).keyup(updateTimeout).keydown(updateTimeout);
			update.apply(this);
		});
		return this;
	}
})(jQuery);
/*
@说明：Web 产品级公用js组件，对应woo 瀑布流组件的排序删除功能
@作者：balibell
@时间：2013-11-20
*/


// 瀑布流排序删除
function wooOrder(){
	$('#woo-holder').delegate('div.mbpho','mouseenter',function (e){
		var $t = $(this).closest('.woo'),
			$tg = e.target;

		if( e.type == 'mouseenter' ){
			var $del = $t.find('img.wtfdel');
			var $up = $t.find('img.wtfup');


			if( !$del.length ){
				$del = $('<img class="dymoper wtfdel" src="http://img4.duitang.com/uploads/people/201201/30/20120130164210_UKyFk.gif" />').css({
					"position" : "absolute",
					"left" : 0,
					"top" : 24
				}).appendTo($t);
			}
			if( !$up.length ){
				$up = $('<img class="dymoper wtfup" src="http://img4.duitang.com/uploads/people/201208/02/20120802120241_4JffJ.png" />').css({
					"position" : "absolute",
					"left" : "auto",
					"right" : 0,
					"top" : 24
				}).appendTo($t);
			}

			$t.addClass('idx-dymdel')
		}
	})
	.delegate('div.mbpho','mouseleave',function (e){
		var $t = $(this).closest('.woo'),
			$retg = $(e.relatedTarget);

		if( $retg && $retg.length && !$retg.hasClass('dymoper') ){
			$t.removeClass('idx-dymdel')
		}
	})
	.delegate('.wtfdel','click',function (e){
		e.preventDefault();
		e.stopPropagation();
		
		var $t = $(this).closest('.woo'),
			id = $t.data('id'),
			units = $.Woo.WooTemp.masnUnits,
			unit = units ? units[id] : null;
		if( unit ){
			delete units[id]
		}
		$t.remove();
		wooRepos()
	})
	.delegate('.wtfup','click',function (e){
		e.preventDefault();
		e.stopPropagation();
		
		var $t = $(this).closest('.woo'),
			$p = $t.parent()

		$t.css({
			"top" : 0,
			"left" : 0
		})
		.prependTo($p);
		// wooRepos()
	})
}


// 瀑布流重排
function wooRepos(){
	var masn = $.Woo.masn[0],
		$d = masn.$dom;
	masn.clearColY()
	$d.find('.woo-wait').appendTo($d)
	$.Woo.resize()
}
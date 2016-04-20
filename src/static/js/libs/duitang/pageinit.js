(function($) {
  $.fn.pageInit = function(start, limit, total) {
    var $page = $(this);
    $page.find('.pagecnt').remove();
    $page.find('.pbrw').remove();
    $page.append('<ul class="pagecnt"></ul>');
    var $pager = $('.pagecnt');
    var total_page = Math.ceil(total/limit);
    var page = parseInt(start / limit)+1;
    var nextpage = parseInt(page +1);
    var prevpage = parseInt(page -1);
    var start_page = (page - 3 > 1) ? parseInt(page-3) :1;
    var end_page = (page + 3 < total_page) ? parseInt(page+3) : total_page;

    if (1 < page) {
      $pager.append('<li><a href="#page='+prevpage+'" class="pagebar pagebarprev">上一页</a></li>');
    }
    if (1 != start_page) {
      $pager.append('<li class="pagenum"><a href="#page=1">1</a></li>')
    }
    if (2 < start_page) {
      $pager.append('<li class="ell"><a href="javascript:;">...</a></li>')
    }
    for (var i=start_page; i<end_page+1; i++){
      if (i ==page) {
        $pager.append('<li class="active"><a href="javascript:;">'+i+'</a></li>')
      } else{
        $pager.append('<li><a href="#page='+i+'">'+i+'</a></li>')
      }
    }
    if (end_page != total_page){
      if (end_page < total_page -1){
        $pager.append('<li class="ell"><a href="javascript:;">...</a></li>')
      }
      $pager.append('<li class="pagenum"><a href="#page='+total_page +'">'+total_page+'</a></li>')
    }
    if (page < total_page) {
      $pager.append('<li><a href="#page='+nextpage+'" class="pagebar pagebarnext">下一页</a></li>')
    }

    // $page.append('<div class="pbrw"><b class="nowpage">'+page+'/</b><b class="totalpage">'+total_page+'页</b></div>');


  };

}(jQuery));


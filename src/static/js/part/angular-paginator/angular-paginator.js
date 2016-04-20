//翻页器 依赖于 newpaginator.html
(function(global){
  var Paginator = {
    _init: function($scope, next_start, limit, total, baseurl, searcharg) {
      var _paginator = this._caculate(next_start, limit, total);
      var $scope = $scope;
      var searcharg = searcharg;
      var baseurl = baseurl;
      this._generateHref($scope, baseurl, searcharg, _paginator);
    },
    _caculate: function(next_start, limit, total) {
      var paginator = {}
      var pageList = paginator.pageList = [];
      var totalpage = paginator.totalpage = Math.ceil(total / limit);
      var nowpage = paginator.nowpage = next_start / limit ;
      var start_page = paginator.start_page = (nowpage -3 > 1) ? nowpage -3 : 1;
      var end_page = paginator.end_page = (nowpage + 3 < totalpage) ? nowpage +3 : totalpage;

      if (nowpage !== 1) {
        paginator.prevpage = nowpage -1;
      }

      if (nowpage !== totalpage) {
        paginator.nextpage = nowpage + 1;
      }
      
      for (var i=start_page; i < end_page + 1; i++) {
        pageList.push(i);
      }
      return paginator;
    },
    _generateHref: function($scope, baseurl, searcharg, paginator) {
      $scope.turnPage = {};
      $scope.start_page = paginator.start_page;
      $scope.end_page = paginator.end_page;
      $scope.nowpage = paginator.nowpage;
      $scope.pageList = paginator.pageList;
      $scope.prevpage = paginator.prevpage;
      $scope.nextpage = paginator.nextpage;
      $scope.totalpage = paginator.totalpage;
      $scope.baseurl = baseurl;
      var _searcharg =  '';
      $.each(searcharg, function(key, value){
        var _arg = '&' + key + '=' + value;
        _searcharg = _searcharg + _arg;
      });

      if (_searcharg !== '') {
        $scope.searcharg = _searcharg;
      }
      $scope.turnPage.prevPage = baseurl + '?page=' + paginator.prevpage + $scope.searcharg;
      $scope.turnPage.firstPage = baseurl + '?page=1' + $scope.searcharg;
      $scope.turnPage.lastPage = baseurl + '?page=' + paginator.totalpage + $scope.searcharg;
      $scope.turnPage.nextPage = baseurl + '?page=' + paginator.nextpage + $scope.searcharg;
    }
  };
  global.Paginator = Paginator;
})(window);
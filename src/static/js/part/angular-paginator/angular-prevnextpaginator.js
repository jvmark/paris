//翻页器 依赖于 prevnextpaginator.html
(function(global){
  var Pnpaginator = {
    _init: function($scope, next_start, limit, hasnext, baseurl, searcharg) {
      var _paginator = this._caculate(next_start, limit, hasnext);
      var $scope = $scope;
      var searcharg = searcharg;
      var baseurl = baseurl;
      this._generateHref($scope, baseurl, searcharg, hasnext, _paginator);
    },
    _caculate: function(next_start, limit, hasnext) {
      var paginator = {};
      var nowpage = paginator.nowpage = next_start / limit ;
        
      if (nowpage === 1) {
        paginator.hasprev = false;
      } else {
        paginator.hasprev = true;
      }
      paginator.prevpage = nowpage -1;
      paginator.nextpage = nowpage + 1;
     
      return paginator;
    },
    _generateHref: function($scope, baseurl, searcharg, hasnext, paginator) {
      $scope.turnPage = {};
      $scope.nowpage = paginator.nowpage;
      $scope.prevpage = paginator.prevpage;
      $scope.nextpage = paginator.nextpage;
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
      $scope.turnPage.nextPage = baseurl + '?page=' + paginator.nextpage + $scope.searcharg;
      $scope.turnPage.hasprev = paginator.hasprev;
      $scope.turnPage.hasnext = hasnext;
    }
  };
  global.Pnpaginator = Pnpaginator;
})(window);
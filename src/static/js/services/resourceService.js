angular.module('resourceService', [])
  .factory('ResourceService', ['$resource', function($resource){
    return $resource('/_proxy/s2:51101/operate/collocation/', null,
      {
        'update': { method:'PUT' }
      });
  }]);
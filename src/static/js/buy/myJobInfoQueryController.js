angular.module('myJobInfoQueryController', [])
  .controller('jobInfoQueryPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService,ngDialog, $routeParams) {
      $scope.edit = function(eitem) {
        eitem = {
          id: 3,
          companyName: "荣光",
          companyId: 1,
          city: "深圳",
          description: "1、分布式架构设计和搭建，负载均衡 高并发 高可用的架构开发成功经验；2、熟悉多线程操作，线程池使用原理，对服务器集群部署和性能调优经验丰富。3、精通nignx 的web端服务器，熟练操作应用服务器tomcat部署和开发。精通 MYSQL 数据库优化。4、熟练使用消息中间件 Active MQ；精通redis、memcached缓存技能或session集群处理。 5、IDE工具开发平台为：IntelliJ IDEA， 熟练 SVN 的版本控制器。6、有过成功B2B电商平台架构经验，2年以上纯架构师工作经历，8年以上的J2EE版本开发经验  7、精通企业应用系统整合大架构设计和架设经验。",
          positionName: "java开发工程师",
          diplomaLimit: "本科",
          minSalary: 25000,
          maxSalary: 35000,
          extra: ""
        }
        $scope.jobInfo = angular.copy(eitem);
        $scope.updatetmp = eitem;
        //打开对话框
        ngDialog.open({
          template: 'editTemp',
          scope: $scope,
          disableAnimation: true,
        });
      }
  }]);

angular.module('myJobInfoListController', [])
  .controller('jobInfoListPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService, ngDialog, $routeParams) {
      $scope.edit = function(eitem) {
        $scope.editJob = angular.copy(eitem);
        $scope.updatetmp = eitem;
        //打开对话框
        ngDialog.open({
          template: 'editTemp',
          scope: $scope,
          disableAnimation: true,
        });
      }
      $scope.updateJobInfo = function(){
        BuyService.job.saveJobInfo({
          "id": $scope.editJob.id,
          'companyName': $scope.editJob.companyName,
          'companyId': $scope.editJob.companyId,
          'city': $scope.editJob.city,
          'description': $scope.editJob.description,
          'positionName': $scope.editJob.positionName,
          'diplomaLimit': $scope.editJob.diplomaLimit,
          'minSalary': $scope.editJob.minSalary,
          'maxSalary': $scope.editJob.maxSalary,
          'extra': $scope.editJob.extra
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
      $scope.delJobInfo = function(eitem){
        BuyService.job.delJobInfo({
          "id": eitem.id
        }).then(function(jsn) {
          alert('成功');
          // location.reload();
        })
      }
      getJobInfoForCom();
      function getJobInfoForCom(){
        BuyService.job.getJobInfoForCom({
          'companyid': window.localStorage.getItem('userid')
        }).then(function(jsn) {
          console.log(jsn);
          $scope.jobList = jsn.data;
          console.log($scope.jobList);
        })
      }

  }]);
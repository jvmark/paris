angular.module('myJobInfoQueryController', [])
  .controller('jobInfoQueryPageCtrl', ['$scope', 'BaseService', 'BuyService', 'ngDialog', '$routeParams',
    function($scope, BaseService, BuyService,ngDialog, $routeParams) {
      if(window.localStorage.getItem('usertype')==='管理员'){
        $scope.isStaff = true;
      }else{
        $scope.isStaff = false;
      }
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
      $scope.forDetail = function(eitem) {
        $scope.editJob1 = angular.copy(eitem);
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
      getJobInfoAll();
      function getJobInfoAll(){
        BuyService.job.getJobInfoAll({}).then(function(jsn) {
          console.log(jsn);
          $scope.jobList = jsn.data;
        })
      }
  }]);

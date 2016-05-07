angular.module('buyService', [])
  .factory('BuyService', function(BaseService) {
    var service = {
      sidebar: {
        getSidebarList: function(params_) {
          return BaseService.get('/api/navigations/', {params: params_}).then(function(data_) {
            return data_;
          });
        }
      },
      jobInfoQuery: {
        getjobInfoList: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        }
      },
      student: {
        saveStuInfo: function(params_) {
          return BaseService.post('/napi/student/save/', params_).then(function(data_) {
            return data_;
          });
        },
        getStuInfoAll: function(params_) {
          return BaseService.get('/napi/student/all/', params_).then(function(data_) {
            return data_;
          });
        },
        getMyStuInfo: function(params_) {
          return BaseService.get('/napi/student/by_id/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        delStuInfo: function(params_) {
          return BaseService.post('/napi/student/delete/', params_).then(function(data_) {
            return data_;
          });
        }
      },
      company: {
        saveComInfo: function(params_) {
          return BaseService.post('/napi/company/save/', params_).then(function(data_) {
            return data_;
          });
        },
        getComInfoAll: function(params_) {
          return BaseService.get('/napi/company/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        delComInfo: function(params_) {
          return BaseService.post('/napi/company/delete/', params_).then(function(data_) {
            return data_;
          });
        }
      },
      job: {
        addJobInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getJobInfoForCom: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getJobInfoAll: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        editJobInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        delJobInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        }
      },
      logInOrOut: {
        judgeLogStatus: function(params_) {
          return BaseService.get('/napi/people/profile/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        logout: function(params_) {
          return BaseService.post('/napi/logout/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        login: function(params_) {
          return BaseService.post('/napi/login/', params_).then(function(data_) {
            return data_;
          });
        },
      }
    };
    return service;
  });












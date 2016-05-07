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
        addStuInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getStuInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        editStuInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        delStuInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        }
      },
      company: {
        addComInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        getComInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        editComInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
            return data_;
          });
        },
        delComInfo: function(params_) {
          return BaseService.get('/napi/recruitment/all/', {params: params_}).then(function(data_) {
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












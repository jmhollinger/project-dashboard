/*--------------Modules--------------*/

/* Main Project Dashboard App Module */
var projectDashboard = angular.module('projectDashboard', ['ngSanitize', 'pdDirectives', 'pdControllers', 'pdServices', 'uiGmapgoogle-maps', 'ui.router', 'ui.bootstrap' ,'chart.js', 'ui.utils.masks', 'stormpath', 'stormpath.templates']);

/* Directives Module */
var pdDirectives = angular.module('pdDirectives', []);

/* Controllers Module */
var pdControllers = angular.module('pdControllers', []);

/* Services Module */
var pdServices = angular.module('pdServices', []);

/*--------------Routing--------------*/

projectDashboard.run(function($stormpath, $rootScope, $state){
  $stormpath.uiRouter({
    loginState: 'login',
    defaultPostLoginState: 'projectList'
  });
  $rootScope.$on('$sessionEnd',function () {
  $state.transitionTo('login');
    });
});

projectDashboard.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider.
      /*List View */
      state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
      }).
      state('home', {
        url: '/',
        templateUrl: 'templates/projectList.html',
        controller: 'projectList',
        sp: {authenticate: true}
      }).
    /*List View */
      state('projectList', {
        url: '/projects/list',
        templateUrl: 'templates/projectList.html',
        controller: 'projectList',
        sp: {authenticate: true}
      }).
     /*Map View */
      state('projectMap', {
        url: '/projects/map',
        templateUrl: 'templates/projectMap.html',
        controller: 'projectMap',
        sp: {authenticate: true}
      }).
      /*View Phase Page */
      state('phasePage', {
        url: '/project/{projectId:int}/phase/{phaseId:int}',
        templateUrl: 'templates/phasePage.html',
        controller: 'phasePage',
        sp: {authenticate: true}
      }).
      /*New Project*/
      state('newProject', {
        url: '/project/new',
        templateUrl: 'templates/projectNew.html',
        controller: 'projectNew',
        sp: {authenticate: true}
      }).
      /*New Phase*/
      state('newPhase', {
        url: '/project/{projectId:int}/phase/new',
        templateUrl: 'templates/phaseNew.html',
        controller: 'phaseNew',
        sp: {authenticate: true}
      }).
      /*Edit Project Page */
      state('projectEdit', {
        url: '/project/edit/{projectId:int}',
        templateUrl: 'templates/projectEdit.html',
        controller: 'projectEdit',
        sp: {authenticate: true}
      }).
      /*Edit Phase Page */
      state('phaseEdit', {
        url: '/phase/edit/{phaseId:int}',
        templateUrl: 'templates/phaseEdit.html',
        controller: 'phaseEdit',
        sp: {authenticate: true}
      }).
      /*My Account*/
      state('account', {
        url: '/account',
        templateUrl: 'templates/account.html',
        controller: 'account',
        sp: {authenticate: true}
      }).
      /*Error page*/
      state('error', {
        url: '/error',
        templateUrl: 'templates/error.html',
        sp: {authenticate: true}
      });

  }]);

/*--------------Controllers--------------*/

/* Project List */
pdControllers.controller('projectList', ['$scope', '$location', 'getData',
  function ($scope, $location, getData) {

  $scope.searchTerm = $location.search().q
  $scope.department = $location.search().dept
  $scope.division = $location.search().div
  $scope.councilDistrict = $location.search().cd
  $scope.phaseStatus = $location.search().status
  $scope.phaseType = $location.search().type

  $scope.clearFilter = function () {
  $scope.searchTerm = null
  $scope.department = null
  $scope.division = null
  $scope.departmentId = null
  $scope.divisionId = null
  $scope.councilDistrict = null
  $scope.phaseType = null
  $scope.phaseStatus = null
  $location.search({})
  }

$scope.$watchGroup(['department','division','phaseStatus','phaseType'], function(newValues, oldValues) {
if (newValues[0]){
    console.log(newValues[0])
    getData.departmentByname(newValues[0]).then(function(result) {
      $scope.departmentId = result.data.results[0].department_id
    })
  }
    else {$scope.departmentId = null}
  if (newValues[1]){
    getData.divisionByname(newValues[1]).then(function(result) {
      $scope.divisionId = result.data.results[0].division_id
    })
    }
    else {$scope.divisionId = null}
  if (newValues[2]){
    getData.statusByname(newValues[2]).then(function(result) {
      $scope.phaseStatusId = result.data.results[0].status_type_id
    })
    }
    else {$scope.phaseStatusid = null}
  if (newValues[3]){
    getData.typeByname(newValues[3]).then(function(result) {
      $scope.phaseTypeid = result.data.results[0].phase_type_id
    })
    }
    else {$scope.phaseTypeid = null}
})

 $scope.$watchGroup(['searchTerm','departmentId','divisionId','councilDistrict', 'phaseStatusid', 'phaseTypeid'], function(newValues, oldValues) {
  $location.search({q: newValues[0] ,dept : $scope.department, div : $scope.division, cd : $scope.councilDistrict, status: $scope.phaseStatus, type: $scope.phaseType})

  getData.projectSearch($scope.searchTerm , $scope.departmentId, $scope.divisionId, $scope.councilDistrict, $scope.phaseTypeid, $scope.phaseStatusid).then(function(result) {
      $scope.projects = result.data.results
      if (result.data.results.length===0) {$scope.noResults = true}
      else{$scope.noResults = false}
    })

  getData.projectStats($scope.searchTerm , $scope.departmentId, $scope.divisionId, $scope.councilDistrict, $scope.phaseStatusid, $scope.phaseTypeid).then(function(result) {
      var budgetData = []
      var scheduleData = []
      var statusData = []
      $scope.projectStats = result.data[0]
      if (result.data[0].projects === '1'){$scope.projectLabel = 'Project'} else {$scope.projectLabel = 'Projects'}
      if (result.data[0].phases === '1'){$scope.phaseLabel = 'Phase'} else {$scope.phaseLabel = 'Phases'}

      $scope.spent = (result.data[0].actual /  result.data[0].budget) * 100 + '%'
      $scope.remaining = ((result.data[0].budget - result.data[0].actual) / result.data[0].budget) * 100 + '%'
      budgetData.push(result.data[0].under_budget)
      budgetData.push(result.data[0].on_budget)
      budgetData.push(result.data[0].over_budget)
      $scope.budgetData = budgetData

      scheduleData.push(result.data[0].ahead_schedule)
      scheduleData.push(result.data[0].on_schedule)
      scheduleData.push(result.data[0].behind_schedule)
      $scope.scheduleData = scheduleData

      statusData.push(result.data[0].not_started)
      statusData.push(result.data[0].in_progress)
      statusData.push(result.data[0].completed)
      $scope.statusData = statusData

    })

  });

  getData.divisions().then(function(result) {
    $scope.divisions = result.data.results
  })

  getData.departments().then(function(result) {
    $scope.departments = result.data.results
  })

  getData.councilDistricts().then(function(result) {
    $scope.council = result.data.results
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data.results
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data.results
  })
  }]);

/* Project Map */
pdControllers.controller('projectMap', ['$scope', '$location', 'getData',
  function ($scope, $location, getData) {

  $scope.searchTerm = $location.search().q
  $scope.department = $location.search().dept
  $scope.division = $location.search().div
  $scope.councilDistrict = $location.search().cd

  $scope.clearFilter = function () {
  $scope.searchTerm = null
  $scope.department = null
  $scope.division = null
  $scope.departmentId = null
  $scope.divisionId = null
  $scope.councilDistrict = null
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true
  $location.search({})
  }

$scope.$watchGroup(['department','division'], function(newValues, oldValues) {
if (newValues[0]){
    getData.departmentByname(newValues[0]).then(function(result) {
      $scope.departmentId = result.data.results[0].department_id
    })
  }
    else {$scope.departmentId = null}
  if (newValues[1]){
    getData.divisionByname(newValues[1]).then(function(result) {
      $scope.divisionId = result.data.results[0].division_id
    })
    }
    else {$scope.divisionId = null}
})

 $scope.$watchGroup(['searchTerm','departmentId','divisionId','councilDistrict'], function(newValues, oldValues) {
  $location.search({q: newValues[0] ,dept : $scope.department, div : $scope.division, cd : newValues[3]})

  getData.projectSearch($scope.searchTerm , $scope.departmentId, $scope.divisionId, $scope.councilDistrict).then(function(result) {
      $scope.projects = result.data
      if (result.data.length===0) {$scope.noResults = true}
      else{$scope.noResults = false}
    })
  });

  getData.divisions().then(function(result) {
    $scope.divisions = result.data
  })

  getData.departments().then(function(result) {
    $scope.departments = result.data
  })

  getData.councilArray().then(function(result) {
    $scope.council = result.data
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data
  })

  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };

  }]);

/* Phase Page */
pdControllers.controller('phasePage', ['$scope', '$location', 'getData', '$stateParams',
  function ($scope, $location, getData, $stateParams) {

  getData.projectphaseByid($stateParams.projectId, $stateParams.phaseId).then(function(result) {
    $scope.phaseData = result.data.results[0]
    $scope.cdText = result.data.results[0].council_districts.toString()
    $scope.markerCoords = {"latitude": result.data.results[0].lat, "longitude": result.data.results[0].lng}
    $scope.center = {"latitude": result.data.results[0].lat, "longitude": result.data.results[0].lng}
  })

  getData.phasesByid($stateParams.projectId).then(function(result) {
    $scope.phases = result.data.results
  })

  getData.notesByid($stateParams.phaseId).then(function(result) {
    $scope.notes = result.data.results
    $scope.phaseCount = result.data.results.length
  })

  }]);

/* New Project Page */
pdControllers.controller('projectNew', ['$http','$scope', '$location', '$log', 'getData', 'addData',
  function ($http, $scope, $location, $log, getData, addData) {

  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 38.04890,
        longitude: -84.499969
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $scope.projectData.lat = marker.getPosition().lat();
          $scope.projectData.lng = marker.getPosition().lng();
          }
        }
      }

  $scope.projectData = {
    "modifiedBy" : $scope.user.fullName
  }

  $scope.today1 = function() {
    $scope.phaseData.startDate = new Date();
  };

  $scope.today2 = function() {
    $scope.phaseData.completionDate = new Date();
  };

  $scope.clear1 = function() {
    $scope.phaseData.startDate = null;
  };

  $scope.clear2 = function() {
    $scope.phaseData.completionDate = null;
  };


 $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

$scope.open2 = function() {
    $scope.popup2.opened = true;
  };

 $scope.popup1 = {
    opened: false
  };

 $scope.popup2 = {
    opened: false
  };

  getData.divisions().then(function(result) {
    $scope.divisions = result.data.results
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data.results
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data.results
  })

  getData.councilDistricts().then(function(result) {
    $scope.council = result.data.results
  })

  $scope.saveProject = function() {
    addData.newProject($scope.projectData).then(function(result) {
      $location.path('/project/' + result.data.results[0].project_id + '/phase/' + result.data.results[0].phase_id)
  })
}

  $scope.addPhase = function() {
      addData.newProject($scope.projectData).then(function(result) {
        $location.path('/project/' + result.data.results[0].project_id + '/phase/new')
    })
  }

  }]);

/* New Phase Page */
pdControllers.controller('phaseNew', ['$http','$scope', '$location', '$log', 'getData', 'addData',
  function ($http, $scope, $location, $log, getData, addData) {

  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 38.04890,
        longitude: -84.499969
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $scope.projectData.lat = marker.getPosition().lat();
          $scope.projectData.lng = marker.getPosition().lng();
          }
        }
      }

  $scope.projectData = {
    "projectId" : $location.path().split("/")[2],
    "modifiedBy" : $scope.user.fullName
  }

  $scope.today1 = function() {
    $scope.phaseData.startDate = new Date();
  };

  $scope.today2 = function() {
    $scope.phaseData.completionDate = new Date();
  };

  $scope.clear1 = function() {
    $scope.phaseData.startDate = null;
  };

  $scope.clear2 = function() {
    $scope.phaseData.completionDate = null;
  };


 $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

$scope.open2 = function() {
    $scope.popup2.opened = true;
  };

 $scope.popup1 = {
    opened: false
  };

 $scope.popup2 = {
    opened: false
  };

  getData.divisions().then(function(result) {
    $scope.divisions = result.data.results
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data.results
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data.results
  })

  getData.councilDistricts().then(function(result) {
    $scope.council = result.data.results
  })

  $scope.savePhase = function() {
    addData.newPhase($scope.projectData).then(function(result) {
      $location.path('/project/' + result.data.results[0].project_id + '/phase/' + result.data.results[0].phase_id)
  })
}

  }]);

/* Edit Project Page */
pdControllers.controller('projectEdit', ['$http','$scope', '$location', '$log', '$stateParams', 'getData', 'addData',
  function ($http, $scope, $location, $log, $stateParams, getData, addData) {

  getData.projectByid($stateParams.projectId).then(function(result) {
  $scope.projectData = {
    "projectId" : $stateParams.projectId,
    "modifiedBy" : $scope.user.fullName,
    "projectName": result.data.results[0].project_name,
    "projectDesc": result.data.results[0].project_description,
    "estBudget": result.data.results[0].estimated_total_budget,
    "funded": result.data.results[0].funded,
    "councilDistricts": result.data.results[0].council_districts,
    "lat": result.data.results[0].lat,
    "lng": result.data.results[0].lng
  }

    $scope.map = { center: { latitude: result.data.results[0].lat, longitude: result.data.results[0].lng }, zoom: 16 };
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;
    $scope.marker = {
      id: 0,
      coords: {
        latitude: result.data.results[0].lat,
        longitude: result.data.results[0].lng
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $scope.projectData.lat = marker.getPosition().lat();
          $scope.projectData.lng = marker.getPosition().lng();
          }
        }
      }

  })


  $scope.today1 = function() {
    $scope.phaseData.startDate = new Date();
  };

  $scope.today2 = function() {
    $scope.phaseData.completionDate = new Date();
  };

  $scope.clear1 = function() {
    $scope.phaseData.startDate = null;
  };

  $scope.clear2 = function() {
    $scope.phaseData.completionDate = null;
  };


 $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

$scope.open2 = function() {
    $scope.popup2.opened = true;
  };

 $scope.popup1 = {
    opened: false
  };

 $scope.popup2 = {
    opened: false
  };

  getData.divisions().then(function(result) {
    $scope.divisions = result.data.results
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data.results
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data.results
  })

  getData.councilDistricts().then(function(result) {
    $scope.council = result.data.results
  })

  $scope.saveProject = function() {
    addData.updateProject($scope.projectData).then(function(result) {
      alert("Saved!")
  })
}

  }]);

/* Edit Phase Page */
pdControllers.controller('phaseEdit', ['$http','$scope', '$location', '$log', '$stateParams', 'getData', 'addData',
  function ($http, $scope, $location, $log, $stateParams, getData, addData) {

  getData.phaseByid($stateParams.phaseId).then(function(result) {
  		console.log(result.data.results[0])
	  $scope.projectData = {
	    "phaseId" : $stateParams.phaseId,
	    "modifiedBy" : $scope.user.fullName,
      "phaseStatus.status_name": "status",
	    "phaseType.phase_name" :  "type",
      "phaseDesc" : result.data.results[0].phase_description,
	    "phaseManager" : result.data.results[0].phase_manager,
      "division.division" : result.data.results[0].division,
	    "resoNumber" : result.data.results[0].resolution_number,
	    "accounting" : result.data.results[0].accounting,
	    "rfpNumber" : result.data.results[0].rfp_number,
	    "contractor" : result.data.results[0].contractor,
	    "startDate" : result.data.results[0].start_date,
	    "completionDate" : result.data.results[0].estimated_completion,
	    "phaseBudget" : result.data.results[0].budget,
	    "workComplete" : result.data.results[0].work_complete,
	    "phaseActual" : result.data.results[0].actual,
	    "notes" : result.data.results[0].notes
	  }

  })

  $scope.today1 = function() {
    $scope.projectData.startDate = new Date();
  };

  $scope.today2 = function() {
    $scope.projectData.completionDate = new Date();
  };

  $scope.clear1 = function() {
    $scope.projectData.startDate = null;
  };

  $scope.clear2 = function() {
    $scope.projectData.completionDate = null;
  };


  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  getData.divisions().then(function(result) {
    $scope.divisions = result.data.results
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data.results
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data.results
  })

  getData.councilDistricts().then(function(result) {
    $scope.council = result.data.results
  })

  $scope.savePhase = function() {
    addData.updatePhase($scope.projectData).then(function(result) {
      alert("Saved!")
  })
}

  }]);


/* Account */
pdControllers.controller('account', ['$scope', '$location',
  function ($scope, $location) {

  $scope.title = 'Account'

  }]);

/*--------------Directives--------------*/


pdDirectives.directive('statusFlag', function () {
    return {
        restrict: 'AE',
        scope: {
          value: '@metricValue'
        },
        template:
          '<span class="btn btn-responsive"  ng-class="{\'btn-success\' : value > .1 , \'btn-info\' : value <= .1 && value >= -.1, \'btn-danger\' : value < -.1 }">{{value | percent : 2}}</span>'
    };
});

pdDirectives.directive('budgetBar', function () {
    return {
        restrict: 'AE',
        scope: {
          spent: '@spent',
          remaining: '@remaining',
          total: '@total'
        },
        template:
          '<div class="progress">' +
          '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ng-style="{\'width\' : spent}">' +
          '</div>' +
          '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" ng-style="{\'width\' : remaining}">' +
          '</div></div>'
    };
});


/*--------------Filters--------------*/

/* titlecase filter */
projectDashboard.filter('titlecase', function () {
  return function (input) {
    var bigwords = /\b(LFUCG|ac|aka|llc|hvac|[a-z]\/[a-z]|i|ii|iii|iv|v|vi|vii|viii|ix)\b/i;
  var smallwords = /\b(an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|to|vs)\b/i;
    var words = input.toLowerCase().split(' ');
    for (var i = 0; i < words.length; i++) {
      if (words[i].match(bigwords) !== null) {words[i] = words[i].toUpperCase()}
      else if (words[i].match(smallwords) !== null) {words[i] = words[i].toLowerCase()}
      else {words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)}
    }
    return words.join(' ');
  }
});

/* percent filter */
projectDashboard.filter('percent', function () {
  return function (input, decimals) {
  var per = input * 100
  return per.toFixed(decimals) + '%'
  }
  })

/*--------------Services--------------*/

/*getData*/

pdServices.factory('inputTools', ['$http', function($http){
return{
  clean: function(input){
    var wordarray = input.trim().split(/\s+/gim)
    for (i = 0; i < wordarray.length; i++) {
    wordarray[i] = wordarray[i].replace(/[\W]|[_]|/gim,"").toUpperCase()
    }
    return wordarray.toString().replace(/,+/gim,",").replace(/,$/gim,"").replace(/,/gim,"%26")}
}
}])

pdServices.factory('addData', ['$http', 'inputTools', function($http, inputTools){
  return {
    newProject: function(formData){
      return $http({
                    method: "post",
                    url: "https://lexington-project-dashboard.herokuapp.com/api/v1/project",
                    data: formData
                })
    },
    newPhase: function(formData){
          return $http({
                    method: "post",
                    url: "https://lexington-project-dashboard.herokuapp.com/api/v1/phase",
                    data: formData
                })
    },
    updateProject: function(formData){
      return $http({
                    method: "put",
                    url: "https://lexington-project-dashboard.herokuapp.com/api/v1/project",
                    data: formData
                })
    },
    updatePhase: function(formData){
      return $http({
                    method: "put",
                    url: "https://lexington-project-dashboard.herokuapp.com/api/v1/phase",
                    data: formData
                })
    },
}}]);

pdServices.factory('getData', ['$http', 'inputTools', function($http, inputTools){
  return {
    councilDistricts: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/council-districts")
    },
    departments: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/departments")
    },
    departmentByid: function(dept_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/department/id/" + dept_id)
    },
    departmentByname: function(dept_name){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/department/name/" + dept_name)
    },
    divisionByid: function (div_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/division/id/" + div_id)
    },
    divisionByname: function (div_name){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/division/name/" + div_name)
    },
    divisions: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/divisions")
    },
    phase_types: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/phase-types")
    },
    typeByname: function(type_name){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/phase-types/name/" + type_name)
    },
    status_types: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/status-types")
    },
    statusByname: function(status_name){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/status-types/name/" + status_name)
    },
    projects: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/projects")
    },
    projectSearch: function(q, dept, div, cd, type, status){
      var paramArray = []
      if (q){
        var cleanQ = inputTools.clean(q)
        paramArray.push("q=" + cleanQ)
      } else {
      }
      if (dept){
        paramArray.push("dept=" + dept)
      } else {
      }
      if (div){
        paramArray.push("div=" + div)
      } else {
      }
      if (cd){
        paramArray.push("cd=" + cd)
      } else {
      }
      if (type){
        paramArray.push("type=" + type)
      } else {
      }
      if (status){
        paramArray.push("status=" + status)
      } else {
      }

      var query_string = paramArray.toString().replace(/,/g,"&")

      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/search?" + query_string)
    },
    projectStats: function(q, dept, div, cd){
      var paramArray = []
      if (q){
        var cleanQ = inputTools.clean(q)
        paramArray.push("q=" + cleanQ)
      } else {
      }
      if (dept){
        paramArray.push("dept=" + dept)
      } else {
      }
      if (div){
        paramArray.push("div=" + div)
      } else {
      }
      if (cd){
        paramArray.push("cd=" + cd)
      } else {
      }

      var query_string = paramArray.toString().replace(/,/g,"&")

      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/search-summary?" + query_string)
    },
    projectphaseByid: function(project_id, phase_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/" + project_id + "/phase/" + phase_id)
    },
    phasesByid: function(project_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project-phases/" + project_id)
    },
    notesByid: function(phase_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/phase-notes/" + phase_id)
    },
    projectByid: function(id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/id/" + id)
    },
    phaseByid: function(id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/phase/id/" + id)
    }

}}])

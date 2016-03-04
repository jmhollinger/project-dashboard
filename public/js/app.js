/*--------------Modules--------------*/

/* Main Project Dashboard App Module */
var projectDashboard = angular.module('projectDashboard', [ 'ngSanitize', 'pdDirectives', 'pdControllers', 'pdServices', 'uiGmapgoogle-maps', 'ui.router', 'ui.bootstrap' ,'chart.js']);

/* Directives Module */
var pdDirectives = angular.module('pdDirectives', []);

/* Controllers Module */
var pdControllers = angular.module('pdControllers', []);

/* Services Module */
var pdServices = angular.module('pdServices', []);

/*--------------Routing--------------*/

projectDashboard.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

      $urlRouterProvider.otherwise('/error');
      
      $stateProvider.
      /*List View */
      state('home', {
        url: '',
        templateUrl: 'templates/projectList.html',
        controller: 'projectList'
      }).
    /*List View */
      state('projectList', {
        url: '/projects/list',
        templateUrl: 'templates/projectList.html',
        controller: 'projectList'
      }).
     /*Map View */
      state('projectMap', {
        url: '/projects/map',
        templateUrl: 'templates/projectMap.html',
        controller: 'projectMap'
      }).
      /*View Phase Page */
      state('phasePage', {
        url: '/project/{projectId:int}/phase/{phaseId:int}',
        templateUrl: 'templates/phasePage.html',
        controller: 'phasePage'
      }).
       /*View Project Page */
      state('projectEdit', {
        url: '/project/edit/{projectId:int}',
        templateUrl: 'templates/projectEdit.html',
        controller: 'projectEdit'
      }).
      /*New Project*/
      state('newProject', {
        url: '/projects/new',
        templateUrl: 'templates/projectNew.html',
        controller: 'projectNew'
      }).
      /*Update Project*/
      state('updateProject', {        
        url: '/projects/update',
        templateUrl: 'templates/projectUpdate.html',
        controller: 'projectUpdate'
      }).
      /*My Account*/
      state('account', {        
        url: '/account',
        templateUrl: 'templates/account.html',
        controller: 'account'
      }).
      /*Error page*/
      state('error', {
        url: '/error',
        templateUrl: 'templates/error.html'
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
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true
  $location.search({})
  }

//Update Dept and Div ID
$scope.$watchGroup(['department','division'], function(newValues, oldValues) { 
if (newValues[0]){
    getData.departmentByname(newValues[0]).then(function(result) {
      $scope.departmentId = result.data.response[0].department_id
    })
  }
    else {$scope.departmentId = null}
  if (newValues[1]){
    getData.divisionByname(newValues[1]).then(function(result) {
      $scope.divisionId = result.data.response[0].division_id
    })
    } 
    else {$scope.divisionId = null}
})

//Update Query
 $scope.$watchGroup(['searchTerm','departmentId','divisionId','councilDistrict', 'phaseStatus', 'phaseType'], function(newValues, oldValues) { 
  $location.search({q: newValues[0] ,dept : $scope.department, div : $scope.division, cd : newValues[3], status: newValues[4], type: newValues[5]})

  getData.projectSearch($scope.searchTerm , $scope.departmentId, $scope.divisionId, $scope.councilDistrict).then(function(result) {
      $scope.projects = result.data
      if (result.data.length===0) {$scope.noResults = true}
      else{$scope.noResults = false}
    })

  getData.projectStats($scope.searchTerm , $scope.departmentId, $scope.divisionId, $scope.councilDistrict, $scope.phaseStatus, $scope.phaseType).then(function(result) {
      $scope.projectStats = result.data[0]
      if (result.data[0].projects === '1'){$scope.projectLabel = 'Project'} else {$scope.projectLabel = 'Projects'}
      if (result.data[0].phases === '1'){$scope.phaseLabel = 'Phase'} else {$scope.phaseLabel = 'Phases'}
      $scope.finData = [result.data[0].budget - result.data[0].actual, result.data[0].actual]
      $scope.finLabels = ["Remaining", "Spent"]
    })

  });

//Data
  getData.divisions().then(function(result) {
    $scope.divisions = result.data
  })

  getData.departments().then(function(result) {
    $scope.departments = result.data
  })

  getData.councilDistricts().then(function(result) {
    $scope.council = result.data
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data
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
      $scope.departmentId = result.data.response[0].department_id
    })
  }
    else {$scope.departmentId = null}
  if (newValues[1]){
    getData.divisionByname(newValues[1]).then(function(result) {
      $scope.divisionId = result.data.response[0].division_id
    })
    } 
    else {$scope.divisionId = null}
})

//Update Query
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

  getData.phaseByid($stateParams.projectId, $stateParams.phaseId).then(function(result) {
    $scope.phaseCount = result.data.phases.length
    $scope.phases = result.data.phases
    $scope.phaseData = result.data.phaseData[0]
    $scope.cdText = result.data.phaseData[0].council_districts.toString()
    $scope.markerCoords = {"latitude": result.data.phaseData[0].lat, "longitude": result.data.phaseData[0].lng}
    $scope.center = {"latitude": result.data.phaseData[0].lat, "longitude": result.data.phaseData[0].lng}
  })

  }]);

/* Project Edit Page */
pdControllers.controller('projectEdit', ['$scope', '$location', 'getData', '$stateParams',
  function ($scope, $location, getData, $stateParams) {

  getData.phaseByid($stateParams.projectId).then(function(result) {
    $scope.projects = result.data
    $scope.projectName = result.data[0].project_name
    $scope.projectDesc = result.data[0].project_description
    $scope.projectId = result.data[0].project_id
    $scope.councilDistricts = result.data[0].council_districts
    $scope.total = result.data[0].estimated_total_budget
    $scope.funded = result.data[0].funded
    $scope.markerCoords = {"latitude": result.data[0].lat, "longitude": result.data[0].lng}
    $scope.center = {"latitude": result.data[0].lat, "longitude": result.data[0].lng}
  })

  $scope.marker = {
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          console.log(marker.getPosition().lat());
          console.log(marker.getPosition().lng());
          }
        }
      }
 

  }]);

/* Account */
pdControllers.controller('Account', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Account'

  }]);

/* New Project Page */
pdControllers.controller('projectNew', ['$http','$scope', '$location', '$log', 'getData', 'addData',
  function ($http, $scope, $location, $log, getData, addData) {

  $scope.onSelect = function ($item, $model, $label) {
    if (Object.keys($item)[1] === 'phase_name'){
      $scope.phaseData.phaseType.id = $item.phase_type_id
      }
    else if (Object.keys($item)[1] === 'division'){
      $scope.phaseData.division.id = $item.division_id
      }
    else {}
  }

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
    "modifiedBy" : $scope.user
  }

  $scope.today1 = function() {
    $scope.phaseData.startDate = new Date();
  };


  $scope.clear1 = function() {
    $scope.phaseData.startDate = null;
  };

  $scope.today2 = function() {
    $scope.phaseData.completionDate = new Date();
  };

  $scope.clear2 = function() {
    $scope.phaseData.completionDate = null;
  };

 $scope.popup1 = {
    opened: false
  };

 $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

 $scope.popup2 = {
    opened: false
  };

 $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  getData.divisions().then(function(result) {
    $scope.divisions = result.data
  })

  getData.phase_types().then(function(result) {
    $scope.phaseTypes = result.data
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data
  })

  $scope.save = function() { 
    addData.newProject($scope.projectData).then(function(result) {
      console.log("Request Received!")
      console.log(result.data)
  })
}

  }]);

/* Update Project */
pdControllers.controller('projectUpdate', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Update'

  }]);

/*--------------Directives--------------*/


pdDirectives.directive('statusFlag', function () {
    return {
        restrict: 'AE',
        scope: {
          label: '@'
        },
        template:
          '<span class="btn btn-success">{{label}}</span>'
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
      else if (words[i].match(smallwords) !== null)	{words[i] = words[i].toLowerCase()}
      else {words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)}
    }
    return words.join(' ');
  }
});

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
                    url: "https://lexington-project-dashboard.herokuapp.com/api/v1/create/project",
                    data: formData
                })
    }
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
    status_types: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/status-types")
    },
    projects: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/projects")
    },
    projectSearch: function(q, dept, div, cd){
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

      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/projectQuery?" + query_string)
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

      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/projectStats?" + query_string)
    },
    phaseByid: function(project_id, phase_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/" + project_id + "/phase/" + phase_id)
    },
    projectMap: function(){
    var projects = 
    [
        {
          "id": 0,
          "coords": {
            "latitude": 38.015350,
            "longitude": -84.523202
          },
          "properties": {
            "project": "Southland Drive Sidewalks",
            "phase": "Design",
            "status": "In Progress",
            "budget": "40%",
            "schedule": "25%",
            "workComplete": "30%",
            "stateLink": 'projectPage'
          }
        },
        {
          "id": 1,
          "coords": {
            "latitude": 38.043722,
            "longitude": -84.496031
          },
          "properties" : {
            "project": "Town Branch Commons",
            "phase": "Design",
            "status": "In Progress",
            "budget": "40%",
            "schedule": "25%",
            "workComplete": "30%",
            "stateLink": "projectPage"
          }
        }
      ]
    return projects
    }
}}])


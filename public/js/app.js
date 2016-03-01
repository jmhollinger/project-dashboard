/*--------------Modules--------------*/

/* Main Project Dashboard App Module */
var projectDashboard = angular.module('projectDashboard', [ 'ngSanitize', 'pdDirectives', 'pdControllers', 'pdServices', 'uiGmapgoogle-maps', 'ui.router', 'ui.bootstrap' ,'ngCsv']);

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
     /*View Project Page */
      state('projectPage', {
        url: '/project/{projectId:int}',
        templateUrl: 'templates/projectPage.html',
        controller: 'projectPage'
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
  $scope.departmentName = $location.search().dept
  $scope.divisionName = $location.search().div
  $scope.councilDistrict = $location.search().cd
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true

  /*$scope.updateFilter = function() {
    $location.search({q: $scope.searchTerm, dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
}

  $scope.onSelect = function ($item, $model, $label) {
    if (Object.keys($item)[1] === 'department'){
      $scope.departmentId = $item.department_id
      $location.search({q: $scope.searchTerm ,dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
      }
    else if (Object.keys($item)[1] === 'division'){
      $scope.divisionId = $item.division_id
      $location.search({q: $scope.searchTerm ,dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
      }
    else {}
  }*/


  $scope.clearFilter = function () {
  $scope.searchTerm = null
  $scope.departmentId = null
  $scope.departmentName = null
  $scope.divisionId = null
  $scope.divisionName = null
  $scope.councilDistrict = null
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true
  $location.search({})
  }
 
//Update Query
 $scope.$watchGroup(['searchTerm','divisionName', 'departmentName','councilDistrict'], function(newValues, oldValues) {
  
  $location.search({q: $scope.searchTerm ,dept : $scope.departmentName, div : $scope.divisionName, cd : $scope.councilDistrict})

  getDate.divisionByname($scope.divisionName).then(function(result) {
      $scope.divisionId = result.data[0].division_id
    })

  getDate.departmentByname($scope.departmentName).then(function(result) {
      $scope.departmentId = result.data[0].department_id
    })

  getData.projectSearch($scope.searchTerm, $scope.departmentId, $scope.divisionId, $scope.councilDistrict).then(function(result) {
      $scope.projects = result.data
      if (result.data.length===0) {$scope.noResults = true}
      else{$scope.noResults = false}
    })
  });

  getData.divisions().then(function(result) {
    $scope.divisions = result.data
  })

  getData.divisionByid($scope.divisionId).then(function(result) {
    $scope.divisionName = result.data[0].division
  })

  getData.departments().then(function(result) {
    $scope.departments = result.data
  })

  getData.departmentByid($scope.departmentId).then(function(result) {
    $scope.departmentName = result.data[0].department
  })

  getData.councilArray().then(function(result) {
    $scope.council = result.data
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data
  })

  }]);

/* Project Map */
pdControllers.controller('projectMap', ['$scope', '$location', 'getData',
  function ($scope, $location, getData) {

  $scope.searchTerm = $location.search().q
  $scope.departmentId = $location.search().dept
  $scope.divisionId = $location.search().div
  $scope.councilDistrict = $location.search().cd
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true

  $scope.updateFilter = function() {
    $location.search({q: $scope.searchTerm, dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
}

  $scope.onSelect = function ($item, $model, $label) {
    if (Object.keys($item)[1] === 'department'){
      $scope.departmentId = $item.department_id
      $location.search({q: $scope.searchTerm ,dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
      }
    else if (Object.keys($item)[1] === 'division'){
      $scope.divisionId = $item.division_id
      $location.search({q: $scope.searchTerm ,dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
      }
    else {}
  }

  $scope.clearFilter = function () {
  $scope.searchTerm = null
  $scope.departmentId = null
  $scope.departmentName = null
  $scope.divisionId = null
  $scope.divisionName = null
  $scope.councilDistrict = null
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true
  $location.search({})
  }

  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };
  
  getData.projects().then(function(result) {
    $scope.projects = result.data
  })

  $scope.projectMarkers = getData.projectMap()
  
  getData.divisions().then(function(result) {
    $scope.divisions = result.data
  })

  getData.divisionByid($scope.divisionId).then(function(result) {
    $scope.divisionName = result.data[0].division
  })

  getData.departments().then(function(result) {
    $scope.departments = result.data
  })

  getData.departmentByid($scope.departmentId).then(function(result) {
    $scope.departmentName = result.data[0].department
  })

  getData.councilArray().then(function(result) {
    $scope.council = result.data
  })

  }]);

/* Project Page */
pdControllers.controller('projectPage', ['$scope', '$location', 'getData', '$stateParams',
  function ($scope, $location, getData, $stateParams) {

  getData.projectByid($stateParams.projectId).then(function(result) {
    $scope.projects = result.data
    $scope.projectName = result.data[0].project_name
    $scope.projectDesc = result.data[0].project_description
    $scope.projectId = result.data[0].project_id
    $scope.councilDistricts = result.data[0].council_districts.toString()
    $scope.total = result.data[0].estimated_total_budget
    $scope.funded = result.data[0].funded
    $scope.markerCoords = {"latitude": result.data[0].lat, "longitude": result.data[0].lng}
    $scope.center = {"latitude": result.data[0].lat, "longitude": result.data[0].lng}
  })

 

  }]);

/* Project Edit Page */
pdControllers.controller('projectEdit', ['$scope', '$location', 'getData', '$stateParams',
  function ($scope, $location, getData, $stateParams) {

  getData.projectByid($stateParams.projectId).then(function(result) {
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
pdControllers.controller('projectNew', ['$http','$scope', '$location', '$log', 'getData',
  function ($http, $scope, $location, $log, getData) {

  $scope.onSelect = function ($item, $model, $label) {
    if (Object.keys($item)[1] === 'phase_name'){
      $scope.phaseData.phaseType.id = $item.phase_type_id
      }
    else if (Object.keys($item)[1] === 'division'){
      $scope.phaseData.division.id = $item.division_id
      }
    else {}
  }

  $scope.user= 'Jonathan Hollinger'

  $scope.projectForm = true
  
  $scope.phaseForm = false
  
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
    "submittedBy" : $scope.user
  }

  $scope.phaseData = {
    "submittedBy" : $scope.user,
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
    $scope.phases = result.data
  })

  getData.status_types().then(function(result) {
    $scope.statusTypes = result.data
  })

  }]);

/* Update Project */
pdControllers.controller('projectUpdate', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Update'

  }]);

/*--------------Directives--------------*/


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

pdServices.factory('getData', ['$http', 'inputTools', function($http, inputTools){
  return {
    councilDistricts: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/council-districts")
    },
    councilArray: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/council-districts/array")
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
    projectByid: function(project_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/" + project_id)
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


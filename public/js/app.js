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
        url: '/project/:projectID',
        templateUrl: 'templates/projectPage.html',
        controller: 'projectPage'
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
pdControllers.controller('projectList', ['$scope', '$location',
  function ($scope, $location) {

  }]);

/* Project Map */
pdControllers.controller('projectMap', ['$scope', '$location', 'getData',
  function ($scope, $location, getData) {

  $scope.searchTerm = $location.search().q
  $scope.departmentId = $location.search().dept
  $scope.divisionId = $location.search().div
  $scope.councilDistrict = $location.search().cd
  $scope.showC = $location.search().showC
  $scope.showNs = $location.search().showNs
  $scope.showIp = $location.search().showIp
  $scope.divisionName = 
  $scope.departmentName =


  $scope.updateFilter = function() {
    $location.search({q: $scope.searchTerm, dept : $scope.departmentId, div : $scope.divisionId, cd : $scope.councilDistrict, showC : $scope.showC,
    showIp: $scope.showIp, showNs : $scope.showNs})
    console.log("Fire Query")
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
    console.log("Fire Query") 
  }
  $scope.clearFilter = function () {
  $scope.searchTerm = null
  $scope.departmentId = null
  $scope.divisionId = null
  $scope.councilDistrict = null
  $scope.showC = true
  $scope.showNs = true
  $scope.showIp = true
  $location.search({})
  }

  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };
  
  $scope.projectMarkers = getData.projectMap()
  
  getData.divisions().then(function(result) {
    $scope.divisions = result.data
  })

  getData.divisionByid($scope.divisionId).then(function(result) {
    $scope.divisionName = result.data[0].division
  })

  getData.departmentByid($scope.departmentId).then(function(result) {
    $scope.departmentName = result.data[0]
  })

  getData.departments().then(function(result) {
    $scope.departments = result.data
  })

  $scope.council = getData.councilDistricts()
  }]);

/* Project Page */
pdControllers.controller('projectPage', ['$scope', '$location',
  function ($scope, $location) {
  $scope.center = {"latitude": 38.015350, "longitude": -84.523202}
  $scope.coords = {"latitude": 38.015350, "longitude": -84.523202}
  $scope.currentTab = 'Design'
  }]);

/* Account */
pdControllers.controller('Account', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Account'

  }]);

/* New Project Page */
pdControllers.controller('projectNew', ['$http','$scope', '$location', '$log', 'getData',
  function ($http, $scope, $location, $log, getData) {

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
    "submittedBy" : $scope.user,
    "lat" : 38.046373,
    "lng" : -84.497034
  }

  $scope.phaseData = {
    "submittedBy" : $scope.user,
    "phaseName" : null
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

 $scope.phases = getData.phases()
 $scope.divisions = getData.divisions()
  
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

/*--------------Services--------------*/

/*getData*/

pdServices.factory('getData', ['$http', function($http, search){
  return {
    councilDistricts: function(){
      var districts = ["1","2","3","4","5","6","7","8","9","10","11","12"]
      return districts
    },
    departments: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/departments")
    },
    departmentByid: function(dept_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/department/" + dept_id)
    },
    divisionByid: function (div_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/division/" + div_id)
    },
    divisions: function(){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/divisions")
    },
phases: function(){
var phases = ['Construction', 'Utility Relocation', 'Right-of-Way Acquisition', 'Design', 'Implementation']  
return phases
},
status: function(){
var status = ['Construction', 'Utility Relocation', 'Right-of-Way Acquisition', 'Design', 'Implementation']  
return phases
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


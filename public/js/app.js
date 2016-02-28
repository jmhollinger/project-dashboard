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
  
  $scope.onSelect = function ($item, $model, $label) {
    if (Object.keys($item)[1] === 'department'){
      $scope.departmentId = $item.department_id
      console.log($item.department_id)
      }
    else if (Object.keys($item)[1] === 'division'){
      $scope.divisionId = $item.division_id
      console.log($item.division_id)
      }
    else {}
  }

  $scope.selectDepartment = function ($item, $model, $label) {
  $scope.departmentId = $item.department_id
  console.log('Department: ' + $item.department_id)
  }

  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };
  $scope.projectMarkers = getData.projectMap()
  $scope.divisions = getData.divisions()
  $scope.departments = getData.departments()
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
    departments: function(){
      return [
{
"department_id": 8,
"department": "Mayor's Office"
},
{
"department_id": 5,
"department": "Law"
},
{
"department_id": 7,
"department": "Social Services"
},
{
"department_id": 3,
"department": "Finance"
},
{
"department_id": 4,
"department": "General Services"
},
{
"department_id": 2,
"department": "Environmental Quality and Public Works"
},
{
"department_id": 10,
"department": "Chief Information Officer"
},
{
"department_id": 6,
"department": "Public Safety"
},
{
"department_id": 9,
"department": "Chief Administrative Office"
},
{
"department_id": 1,
"department": "Planning, Preservation, and Development"
}
]
    },
    councilDistricts: function(){
      return ["1","2","3","4","5","6","7","8","9","10","11","12"]
    },
    divisions: function(){
      var divisions = [
  {
    "division_id": 7,
    "division": "Planning"
  },
  {
    "division_id": 8,
    "division": "Purchase of Development Rights"
  },
  {
    "division_id": 9,
    "division": "Office of Affordable Housing"
  },
  {
    "division_id": 10,
    "division": "Code Enforcement"
  },
  {
    "division_id": 11,
    "division": "Historic Preservation"
  },
  {
    "division_id": 12,
    "division": "Environmental Services"
  },
  {
    "division_id": 13,
    "division": "Waste Management"
  },
  {
    "division_id": 14,
    "division": "Water Quality"
  },
  {
    "division_id": 15,
    "division": "Streets and Roads"
  },
  {
    "division_id": 16,
    "division": "Traffic Engineering"
  },
  {
    "division_id": 19,
    "division": "Accounting"
  },
  {
    "division_id": 20,
    "division": "Budgeting"
  },
  {
    "division_id": 21,
    "division": "Revenue"
  },
  {
    "division_id": 22,
    "division": "Purchasing"
  },
  {
    "division_id": 24,
    "division": "Facilities and Fleet Management"
  },
  {
    "division_id": 25,
    "division": "Parks and Recreation"
  },
  {
    "division_id": 27,
    "division": "Corporate Counsel"
  },
  {
    "division_id": 28,
    "division": "Litigation"
  },
  {
    "division_id": 29,
    "division": "Claims Management"
  },
  {
    "division_id": 31,
    "division": "Police"
  },
  {
    "division_id": 32,
    "division": "Fire and Emergency Services"
  },
  {
    "division_id": 33,
    "division": "Community Corrections"
  },
  {
    "division_id": 34,
    "division": "Emergency Management"
  },
  {
    "division_id": 35,
    "division": "E911"
  },
  {
    "division_id": 36,
    "division": "Adult and Tenant Services"
  },
  {
    "division_id": 37,
    "division": "Family Services"
  },
  {
    "division_id": 38,
    "division": "Youth Services"
  },
  {
    "division_id": 40,
    "division": "Partners for Youth"
  },
  {
    "division_id": 41,
    "division": "Office of Project Management"
  },
  {
    "division_id": 42,
    "division": "Office of Economic Development"
  },
  {
    "division_id": 43,
    "division": "Mayor's Office"
  },
  {
    "division_id": 44,
    "division": "CAO's Office"
  },
  {
    "division_id": 45,
    "division": "Grants and Special Programs"
  },
  {
    "division_id": 46,
    "division": "Internal Audit"
  },
  {
    "division_id": 47,
    "division": "Council Clerk"
  },
  {
    "division_id": 48,
    "division": "Government Communications"
  },
  {
    "division_id": 49,
    "division": "Risk Management"
  },
  {
    "division_id": 50,
    "division": "Computer Services"
  },
  {
    "division_id": 51,
    "division": "Enterprise Solutions"
  },
  {
    "division_id": 52,
    "division": "CIO's Office"
  },
  {
    "division_id": 6,
    "division": "Building Inspection"
  },
  {
    "division_id": 5,
    "division": "Engineering"
  },
  {
    "division_id": 18,
    "division": "Finance Commissioner's Office"
  },
  {
    "division_id": 17,
    "division": "EQ and Public Works Commissioner's Office"
  },
  {
    "division_id": 23,
    "division": "General Services Commissioner's Office"
  },
  {
    "division_id": 26,
    "division": "Law Commissioner's Office"
  },
  {
    "division_id": 30,
    "division": "Public Safety Commissioner's Office"
  },
  {
    "division_id": 39,
    "division": "Social Services Commissioner's Office"
  },
  {
    "division_id": 4,
    "division": "Planning Commissioner's Office"
  }
]
      return divisions
    },
phases: function(){
var phases = ['Construction', 'Utility Relocation', 'Right-of-Way Acquisition', 'Design', 'Implementation']  
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


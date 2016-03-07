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
      console.log(result.data.results[0].status_type_id)
      $scope.phaseStatusId = result.data.results[0].status_type_id
    })
    } 
    else {$scope.phaseStatusid = null}
  if (newValues[3]){
    getData.typeByname(newValues[3]).then(function(result) {
      console.log(result.data.results[0].phase_type_id)
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
      $scope.projectStats = result.data[0]
      if (result.data[0].projects === '1'){$scope.projectLabel = 'Project'} else {$scope.projectLabel = 'Projects'}
      if (result.data[0].phases === '1'){$scope.phaseLabel = 'Phase'} else {$scope.phaseLabel = 'Phases'}
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

  getData.phaseByid($stateParams.projectId, $stateParams.phaseId).then(function(result) {
    console.log(result.data)
    $scope.phaseData = result.data.results[0]
    $scope.cdText = result.data.results[0].council_districts
    $scope.markerCoords = {"latitude": result.data.results[0].lat, "longitude": result.data.results[0].lng}
    $scope.center = {"latitude": result.data.results[0].lat, "longitude": result.data.results[0].lng}
  })

  getData.phasesByid($stateParams.projectId).then(function(result) {
    console.log(result.data)
    $scope.phases = result.data.results
  })

  getData.notesByid($stateParams.phaseId).then(function(result) {
    console.log(result.data)
    $scope.notes = result.data.results
    $scope.phaseCount = result.data.results.length
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
    "modifiedBy" : 'Jonathan Hollinger'
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

  $scope.save = function() { 
    addData.newProject($scope.projectData).then(function(result) {
      $scope.saveSuccess = true
      $location.path('/project/' + result.data.response[0].project_id + '/phase/' + result.data.response[0].phase_id)
  })
}

  }]);

/* Update Project */
pdControllers.controller('projectUpdate', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Update'

  }]);

/* Update phase */
pdControllers.controller('phaseUpdate', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Update'

  }]);

/* Account */
pdControllers.controller('Account', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Account'

  }]);
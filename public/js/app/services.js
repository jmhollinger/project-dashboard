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

      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/projectStats?" + query_string)
    },
    phaseByid: function(project_id, phase_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project/" + project_id + "/phase/" + phase_id)
    },
    phasesByid: function(project_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/project-phases/" + project_id)
    },
    notesByid: function(phase_id){
      return $http.get("https://lexington-project-dashboard.herokuapp.com/api/v1/phase-notes/" + phase_id)
    }

}}])
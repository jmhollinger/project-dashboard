/*--------------Modules--------------*/

/* Main Project Dashboard App Module */
var projectDashboard = angular.module('projectDashboard', [ 'ngRoute', 'ngSanitize', 'pdDirectives', 'pdControllers', 'pdServices', 'uiGmapgoogle-maps', 'ngCsv']);

/* Directives Module */
var pdDirectives = angular.module('pdDirectives', []);

/* Controllers Module */
var pdControllers = angular.module('pdControllers', []);

/* Services Module */
var pdServices = angular.module('pdServices', []);

/*--------------Routing--------------*/

projectDashboard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    /*List View */
      when('/projects/list', {
        templateUrl: 'templates/projectList.html',
        controller: 'projectList'
      }).
     /*Map View */
      when('/projects/map', {
        templateUrl: 'templates/projectMap.html',
        controller: 'projectMap'
      }).
     /*View Project Page */
      when('/projects/id/:param', {
        templateUrl: 'templates/projectPage.html',
        controller: 'projectPage'
      }).
      /*New Project*/
      when('/projects/new', {
        templateUrl: 'templates/projectNew.html',
        controller: 'projectNew'
      }).
     /*New Project Phase*/
      when('/phase/new', {
        templateUrl: 'templates/projectNew.html',
        controller: 'projectNew'
      }).
      /*Update Project*/
      when('/projects/update', {
        templateUrl: 'templates/projectUpdate.html',
        controller: 'projectUpdate'
      }).
      when('/', {
        templateUrl: 'templates/projectList.html',
        controller: 'projectList'
      }).
      otherwise({
        templateUrl: 'templates/error.html'
      });

  }]);

/*--------------Controllers--------------*/

/* Project List */
pdControllers.controller('projectList', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project List'
  $scope.view = 'list'

  }]);

/* Project Map */
pdControllers.controller('projectMap', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Map'

  }]);

/* Project Page */
pdControllers.controller('projectPage', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Page'

  }]);

/* New Project Page */
pdControllers.controller('projectNew', ['$http','$scope', '$location', 'uuid',
  function ($http, $scope, $location, uuid) {
  
  $scope.display = true

  //Generate UUID
  uuid.generate().then(function(data){
         $scope.uuid = data.uuid;
       })

  $scope.lat = '38'
  $scope.lng = '-84'
  $scope.user= 'Jonathan Hollinger'
  $scope.councilDistricts = []

  $scope.projectData = {
    "submittedBy" : $scope.user,
    "lat" : $scope.lat,
    "lng" : $scope.lng,
  }

  $scope.phaseData = {
    "submittedBy" : $scope.user,
  }

  }]);

/* New Project Phase */
pdControllers.controller('phaseNew', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  

  $scope.title = 'New Phase'

  }]);

/* Update Project */
pdControllers.controller('phaseUpdate', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Update'

  }]);




/* Bulding Permit Search */
pdControllers.controller('PermitSearchCtrl', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
	$scope.sort = $location.search().sort + ' ' + $location.search().dir
	$scope.sortfield = $location.search().sort
	$scope.sortdir =  $location.search().dir
	$scope.keyword = $location.search().q
	$scope.limit = $location.search().limit
    $scope.page = $location.search().page

    $scope.fields = [
  	{field: 'Date', display: "Date", sortlow: "Oldest", sorthigh: "Newest" },
  	{field: 'Address', display: "Address", sortlow: "A", sorthigh: "Z" },
  	{field: 'PermitType', display: "Permit Type", sortlow: "A", sorthigh: "Z" },
  	{field: 'ConstructionCost', display: "Construction Cost", sortlow: "Low", sorthigh: "High" },
  	{field: 'OwnerName', display: "Owner", sortlow: "A", sorthigh: "Z" },
  	{field: 'Contractor', display: "Contractor", sortlow: "A", sorthigh: "Z" }
  	]
  	
  	$scope.first = function(){$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: 1})}
  	$scope.prev = function() {if ($scope.disableprev) {} else {$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: parseInt($location.search().page) - 1})}}
	$scope.next = function() {if ($scope.disablenext) {} else {$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: parseInt($location.search().page) + 1})}}
  	$scope.last = function(){$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: $scope.totalpages})}

  	CKAN.query(bi_resource, $location.search().q, $location.search().sort, $location.search().dir, $location.search().limit, ($location.search().page - 1) * $location.search().limit).success(function(data) {
  			 $scope.rows = data.result.records
  	})

  	$scope.exportfields = ["_id", "ID","Date", "Address", "Suite", "PermitType", "ConstructionCost", "OwnerName", "Contractor", "CleanAddress", "MatchType", "MatchAddress", "parcelId", "lat", "lng"]

  	CKAN.dump(bi_resource, $scope.exportfields, $location.search().q, $location.search().sort, $location.search().dir).success(function(data) {
  			 $scope.export = JSON.parse(JSON.stringify( data.result.records, $scope.exportfields))
  	})
  	
  	CKAN.count(bi_resource, $location.search().q).success(function(data) {
  		  	$scope.RecordCount = data.result.records[0].count;
  		  	$scope.totalpages = Math.ceil($scope.RecordCount / $location.search().limit)
         	$scope.disablefirst = pagination.controls(parseInt($location.search().page), $scope.totalpages)[0]
         	$scope.disableprev = pagination.controls(parseInt($location.search().page), $scope.totalpages)[1]
         	$scope.disablenext = pagination.controls(parseInt($location.search().page), $scope.totalpages)[2]
         	$scope.disablelast = pagination.controls(parseInt($location.search().page), $scope.totalpages)[3]
  	})
  }]);

/* Code Cases Search */
pdControllers.controller('CodeSearchCtrl', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
	$scope.sort = $location.search().sort + ' ' + $location.search().dir
	$scope.sortfield = $location.search().sort
	$scope.sortdir =  $location.search().dir
	$scope.keyword = $location.search().q
	$scope.limit = $location.search().limit
    $scope.page = $location.search().page

  	$scope.fields = [
  	{field: 'DateOpened', display: "Date Opened", sortlow: "Oldest", sorthigh: "Newest" },
  	{field: 'Address', display: "Address", sortlow: "A", sorthigh: "Z" },
  	{field: 'CaseType', display: "Case Type", sortlow: "A", sorthigh: "Z" },
  	{field: 'Status', display: "Status", sortlow: "Low", sorthigh: "High" },
  	{field: 'StatusDate', display: "Status Date", sortlow: "Oldest", sorthigh: "Newest" }]

  	$scope.first = function(){$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: 1})}
  	$scope.prev = function() {if ($scope.disableprev) {} else {$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: parseInt($location.search().page) - 1})}}
	$scope.next = function() {if ($scope.disablenext) {} else {$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: parseInt($location.search().page) + 1})}}
  	$scope.last = function(){$location.search({q : $scope.keyword, sort : $scope.sort.split(" ")[0], dir: $scope.sort.split(" ")[1], limit: $scope.limit, page: $scope.totalpages})}

  	CKAN.query(ce_resource, $location.search().q, $location.search().sort, $location.search().dir, $location.search().limit, ($location.search().page - 1) * $location.search().limit).success(function(data) {
  			 $scope.rows = data.result.records
  	})

  	$scope.exportfields = ["_id", "CaseNo", "DateOpened", "Address", "CaseType", "Closed", "Status", "StatusDate", "CleanAddress", "MatchType", "MatchAddress","parcelId", "lat", "lng"]

  	CKAN.dump(ce_resource, $scope.exportfields, $location.search().q, $location.search().sort, $location.search().dir).success(function(data) {
  			 $scope.export = JSON.parse(JSON.stringify( data.result.records, $scope.exportfields))
  	})
  	
  	CKAN.count(ce_resource, $location.search().q).success(function(data) {
  		  	$scope.RecordCount = data.result.records[0].count;
  		  	$scope.totalpages = Math.ceil($scope.RecordCount / $location.search().limit)
         	$scope.disablefirst = pagination.controls(parseInt($location.search().page), $scope.totalpages)[0]
         	$scope.disableprev = pagination.controls(parseInt($location.search().page), $scope.totalpages)[1]
         	$scope.disablenext = pagination.controls(parseInt($location.search().page), $scope.totalpages)[2]
         	$scope.disablelast = pagination.controls(parseInt($location.search().page), $scope.totalpages)[3]
  	})
  }]);

/* ROW Permit Search */
pdControllers.controller('ROWSearchCtrl', ['$scope', '$http',
  function ($scope, $http) {
  var DataURL = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT * FROM "' + row_resource + '" ORDER BY "IssueDate" DESC, "_id " DESC LIMIT 500'
  var CountURL = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT COUNT(*) FROM "' + row_resource + '"'

  $http.get(DataURL).success(function(data) {
  $scope.rowCollection = data.result.records;
  $scope.displayedCollection = [].concat($scope.rowCollection);
    });

  $scope.getters={
  Address: function (value) {return value.Address.replace(/[^a-z]/gi,'')}};

  $http.get(CountURL).success(function(data) {
  $scope.RecordCount = data.result.records[0].count;
    });
}]);


/* Bulding Permit Record */
pdControllers.controller('PermitDetailCtrl', ['$scope', '$routeParams', 'CKAN',
  function ($scope, $routeParams, CKAN) {
	CKAN.record(bi_resource, $routeParams.param).success(function(data){
	     $scope.DetailData = data.result.records;
	     var lng = data.result.records[0].lat
	     var lat = data.result.records[0].lng
	     $scope.map = { center: { latitude: lat, longitude: lng }, zoom: 17 };
	     $scope.marker = { id: 0, coords: { latitude: lat, longitude: lng }}
	     $scope.infowindow = {show: true}	
     })

    $scope.RecordType = 'Building Permit'
    $scope.Meta = 'Building permits are issued by the Division of Building Inspection and the Division of Planning for a variety of activities including construction and certification of compliance with zoning. The permit information above is submitted by the applicant.'
    $scope.Contact = 'If you have questions or concerns about building permits, please contact the the Division of Building Inspection at (859) 425-2255.'
}]);


/* Code Case Record */
pdControllers.controller('CodeDetailCtrl', ['$scope', '$routeParams', 'CKAN',
  function ($scope, $routeParams, CKAN) {
	
	CKAN.record(ce_resource, $routeParams.param).success(function(data){
	     $scope.DetailData = data.result.records;
	     var lng = data.result.records[0].lat
	     var lat = data.result.records[0].lng
	     $scope.map = { center: { latitude: lat, longitude: lng }, zoom: 17 };
	     $scope.marker = { id: 0, coords: { latitude: lat, longitude: lng }}
	     $scope.infowindow = {show: true}	
     }) 

    $scope.RecordType = 'Code Enforcement Case'
    $scope.Meta = 'Code enforcement cases are opened based on citizen complaints for violations of nuisance code, the International Property Maintenance Code, and sidewalk regulations.'
    $scope.Contact = 'If you have questions or concerns about code enforcement cases, please contact the the Division of Code Enforcement at (859) 425-2255.'
}]);

/* ROW Permit Record */
pdControllers.controller('ROWDetailCtrl', ['$scope', '$http', '$routeParams',
  function ($scope, $http, $routeParams) {
  var DataURL = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT * FROM "' + row_resource + '" WHERE "_id"  =' + $routeParams.param
    $http.get(DataURL).success(function(data) {
    $scope.DetailData = data.result.records;
    var lng = data.result.records[0].lat
    var lat = data.result.records[0].lng
    $scope.map = { center: { latitude: lat, longitude: lng }, zoom: 17 };
    $scope.marker = { id: 0, coords: { latitude: lat, longitude: lng }}
    $scope.infowindow = {show: true}
   });
    $scope.RecordType = 'Right of Way Permit'
    $scope.Meta = 'Right-of-Way Permits are issued by the Division of Engineering for work performed by utility companies and other entities within the public right-of-way.'
    $scope.Contact = 'If you have questions or concerns about right-of-way permits, please contact the the Division of Engineering, Right-of-Way Section at (859) 425-2255.'
}]);

/*--------------Directives--------------*/

pdDirectives.directive('paginate', function () {
    return {
        restrict: 'A',
        template:
          '<p class="text-center">Page {{page | number}} of {{totalpages | number}}</p>' +
          '<p class="text-center">Your search returned {{RecordCount | number}} records.</p>' +
          '<ul class="pagination">' +
            '<li ng-class="{\'disabled\': disablefirst}" class="pointer" ng-click=\'first()\'><a>First</a></li>' +
            '<li ng-class="{\'disabled\': disableprev}" class="pointer" ng-click=\'prev()\'><a>Previous</a></li>' +
            '<li ng-class="{\'disabled\': disablenext}" class="pointer" ng-click=\'next()\'><a>Next</a></li>' +
            '<li ng-class="{\'disabled\': disablelast}" class="pointer" ng-click=\'last()\'><a>Last</a></li>' +
          '</ul>'
    };
});

pdDirectives.directive('map', function () {
    return {
        restrict: 'A',
        template:
          '<div id="map-canvas"></div>' +
          '<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDXqhUx3ZQwPBtAVsXg6tz9N_2yvrRydcQ&sensor=true&libraries=places&language=en"></script>' +
          '<script>function initialize(){var o=[],e={overviewMapControl:!0,rotateControl:!0,scaleControl:!0,mapTypeControl:!0,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,position:google.maps.ControlPosition.TOP_CENTER},zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.DEFAULT}},t=new google.maps.Map(document.getElementById("map-canvas"),e),n=new google.maps.LatLngBounds(new google.maps.LatLng(37.921971,-84.663139),new google.maps.LatLng(38.155595,-84.334923));t.fitBounds(n),t.data.loadGeoJson("data/firestations.geojson"),t.data.setStyle({icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"red",fillOpacity:.4,scale:6,strokeColor:"red",strokeWeight:2}});var a=new google.maps.InfoWindow;t.data.addListener("click",function(o){a.setContent("<h4>"+o.feature.getProperty("MORE")+"</h4><p>"+o.feature.getProperty("ADDRESS")+"</p>"),a.setPosition(o.latLng),a.open(t)});var l=document.getElementById("pac-input"),s=new google.maps.places.SearchBox(l);google.maps.event.addListener(s,"places_changed",function(){var e=s.getPlaces();if(0!=e.length){for(var n,a=0;n=o[a];a++)n.setMap(null);o=[];for(var l,g=new google.maps.LatLngBounds,a=0;l=e[a];a++){var i={url:l.icon,size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)},n=new google.maps.Marker({map:t,icon:i,title:l.name,position:l.geometry.location});o.push(n),g.extend(l.geometry.location)}t.fitBounds(g),t.setZoom(14)}}),google.maps.event.addListener(t,"bounds_changed",function(){var o=t.getBounds();s.setBounds(o)})}google.maps.event.addDomListener(window,"load",initialize);</script>'
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

/*--------------Services--------------*/

/*Generate UUID*/

pdServices.factory('uuid', ['$http', function($http, search){
  return {
    generate: function(){
      return $http.get('http://localhost:3000/api/v1/create/uuid').then(function(response) {return response.data}
        )
    }
}
}])

pdServices.factory('CKAN', ['$http','search', function($http, search){
	return {
		query: function(dataset, terms, sortfield, sortdir, limit, offset){
		if (!terms){
			var fulltext = ''}
		else {
			var fulltext = ' WHERE "_full_text" @@ to_tsquery(\'' + search.clean(terms) + '\') '}	
			var dataurl1 = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT * FROM "' + dataset + '"' + fulltext + 'ORDER BY "' + sortfield + '" ' + sortdir + ', "_id" DESC' + ' LIMIT ' + limit + ' OFFSET ' + offset
		return $http.get(dataurl1)
		},
		dump: function(dataset, fields, terms, sortfield, sortdir){
		var f = ''
		var l = fields.length - 1  
		for (i = 0; i < l; i++) { 
		    f += '"' + fields[i] + '", '}
	 
	 	var f2 = f + '"' + fields[l] + '"'
		
		if (!terms){
			var fulltext = ''}
		else {
			var fulltext = ' WHERE "_full_text" @@ to_tsquery(\'' + search.clean(terms) + '\') '}	
			var dataurl1 = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT ' + f2 + ' FROM "' + dataset + '"' + fulltext + 'ORDER BY "' + sortfield + '" ' + sortdir + ', "_id" DESC'
		return $http.get(dataurl1)
		},
		record: function(dataset, id){
			var dataurl2 = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT * FROM "' + dataset + '" WHERE "_id" = ' + id
		return $http.get(dataurl2)
		},
		count: function(dataset, terms){
		if (!terms){
			var fulltext = ''}
		else {
			var fulltext = ' WHERE "_full_text" @@ to_tsquery(\'' + search.clean(terms) + '\') '}	
			var dataurl3 = 'http://www.civicdata.com/api/action/datastore_search_sql?sql=SELECT COUNT(*) FROM "' + dataset + '"' + fulltext
		return $http.get(dataurl3)
		},
}
}])

/* Cleans Search Input for CKAN API */
pdServices.factory('searchbox', [function(){
	return {
	input: function(input){
	var wordarray = input.trim().split(/\s+/gim)  
	for (i = 0; i < wordarray.length; i++) { 
	wordarray[i] = wordarray[i].replace(/[\W]|[_]|/gim,"").toUpperCase()
	}
	return wordarray.toString().replace(/,+/gim,",").replace(/,$/gim,"").replace(/,/gim,"%26")}	
}
}])


pdServices.factory('search', ['$location', function($location){
	return {
		go: function (base, keyword, sortfield, sortdir, limit, page ){
		if (keyword === ''){
  			var link = '/' + base + '/' + 'null' + '/' + sortfield + '/' + sortdir + '/' + limit + '/' + page}
  		else { 	
    		var link = '/' + base + '/' + keyword + '/' + sortfield + '/' + sortdir + '/' + limit + '/' + page}
		return $location.path(link)
		},
		checknull: function (input){
  		if (input === 'null')
  		{return ''}
  		else {return input}
  		},
  		clean: function(input){
		var wordarray = input.trim().split(/\s+/gim)  
		for (i = 0; i < wordarray.length; i++) { 
		wordarray[i] = wordarray[i].replace(/[\W]|[_]|/gim,"").toUpperCase()
		}
		return wordarray.toString().replace(/,+/gim,",").replace(/,$/gim,"").replace(/,/gim,"%26")}	
}
}])

/* Disabled pagination button, returns an arrary of boolean values in the order of [first, prev, next, last] */
pdServices.factory('pagination', [function(){
  return {
  controls: function(page, totalpages){
        if (totalpages === 1 && page === 1){
        var result = [true, true, true, true]
        }
        else if (totalpages > 1 && page === 1){
        var result = [true, true, false, false] 
        }
        else if (totalpages > 1  && page === totalpages){
        var result = [false, false, true, true] 
        }
        else {
        var result = [false, false, false, false] 
        }
      return result
  }    
}}])

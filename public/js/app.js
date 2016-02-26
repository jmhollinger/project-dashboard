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
        url: '/projects/id/:param',
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

      /*Home*/
      state('home', {
        url: '/',
        templateUrl: 'templates/projectList.html',
        controller: 'projectList'
      }).
      /*Error page*/
      state('error', {
        url: '/error',
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
  $scope.map = { center: { latitude: 38.048902, longitude: -84.499969 }, zoom: 12 };

  $scope.projectMarkers = [
    {
      "id": 0,
      "coords": {
        "latitude": 38.015350,
        "longitude": -84.523202,
          
      },
      "window": {
        "title": "Southland Drive Sidewalks"
      }
    },
    {
      "id": 1,
      "coords": {
        "latitude": 38.043722,
        "longitude": -84.496031,
      },
      "window" : {
        "title": "Town Branch Commons"
      }
    }
  ]

  }]);

/* Project Page */
pdControllers.controller('projectPage', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Page'

  }]);

/* Account */
pdControllers.controller('Account', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Account'

  }]);

/* New Project Page */
pdControllers.controller('projectNew', ['$http','$scope', '$location', '$log',
  function ($http, $scope, $location, $log) {

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

 $scope.divisions = ['Planning', 'Engineering', 'Streets & Roads']
 $scope.phases = ['Design', 'Construction', 'Utility Relocation', 'Right-Of-Way Acquisition', 'Implementation'];

  }]);

/* Update Project */
pdControllers.controller('projectUpdate', ['$scope', '$location', 'CKAN', 'search', 'pagination',
  function ($scope, $location, CKAN, search, pagination) {
  
  $scope.title = 'Project Update'

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

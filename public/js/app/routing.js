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
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
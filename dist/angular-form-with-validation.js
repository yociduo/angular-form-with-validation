angular.module('angular-form-with-validation', [
    'angular.form',
    'angular.form.tpls'
]);

angular.module('angular.form', [])
.directive('formArea', function () {
    return {
        restrict: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'fwv/template/form/area.html';
        },
        replace: true,
        scope: {

        },
        transclude: true,
        link: function ($scope, $element, $attrs) {

        }
    };
});

angular.module('angular.form.tpls', [
    'fwv/template/form/area.html'
]);

angular.module('fwv/template/form/area.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/area.html',
        '<ng-form role="form" name="form" novalidate ng-transclude>\n' + 
        '</ng-form>' +
        '');
}]);
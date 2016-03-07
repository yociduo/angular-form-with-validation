angular.module('angular-form-with-validation', [
    'angular.form',
    'angular.form.tpls'
]);

angular.module('angular.form', [])
    .constant('angularFormConfig', {
        controlClass: 'col-md-12',
        controlLabelClass: 'col-md-12'
    })
    .controller('AngularFormController', ['$scope', '$attrs', 'angularFormConfig', function ($scope, $attrs, angularFormConfig) {
        var ctrl = this;

        ctrl.formModel = $scope.formModel;
        ctrl.formValidation = $scope.formValidation;
        ctrl.formControlClass = $scope.formControlClass = angular.isDefined($attrs.formControlClass) ?
            $attrs.formControlClass : angularFormConfig.controlClass,
        ctrl.formControlLabelClass = $scope.formControlLabelClass = angular.isDefined($attrs.formControlLabelClass) ?
            $attrs.formControlLabelClass : angularFormConfig.controlLabelClass,
        ctrl.formUntitledCount = 0;

        $scope.$watch('formValidation', function (newValue, oldValue) {
            ctrl.formValidation = newValue;
        });
    }])
    .directive('formArea', function () {
        return {
            restrict: 'E',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'fwv/template/form/area.html';
            },
            replace: true,
            scope: {
                formValidation: '=',
                formModel: '='
            },
            transclude: true,
            controller: 'AngularFormController',
            link: function ($scope, $element, $attrs) {
                $scope.formModel = angular.isDefined($scope.formModel) ? $scope.formModel : new Object();
                $scope.formValidation = $scope.form;
            }
        };
    })
    .directive('formInput', function () {
        return {
            require: '^formArea',
            restric: 'E',
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'fwv/template/form/input.html';
            },
            replace: true,
            scope: {},
            controller: function () { },
            transclude: true,
            link: function ($scope, $element, $attrs, $ctrl) {
                var ctrl = $scope.ctrl = $ctrl;
                $scope.controlName = angular.isDefined($attrs.controlName) && $attrs.controlName.length > 0 ?
                    $attrs.controlName : 'untitled' + ++ctrl.formUntitledCount;
                $scope.controlLabel = angular.isDefined($attrs.controlLabel) ? $attrs.controlLabel : 'Untitled';
                $scope.controlClass = angular.isDefined($attrs.controlClass) ? $attrs.controlClass : ctrl.formControlClass;
                $scope.controlLabelClass = angular.isDefined($attrs.controlLabelClass) ? $attrs.controlLabelClass : ctrl.formControlLabelClass;
            }
        };
    });

angular.module('angular.form.tpls', [
    'fwv/template/form/area.html',
    'fwv/template/form/input.html'
]);

angular.module('fwv/template/form/area.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/area.html',
        '<ng-form role="form" name="form" novalidate ng-transclude>\n' +
        '</ng-form>' +
        '');
}]);

angular.module('fwv/template/form/input.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/input.html',
        '<div class=\"form-group\">\n' + 
        '    <label class=\"control-label\" ng-class=\"controlLabelClass\">{{ controlLabel }}</label>\n' + 
        '    <div ng-class=\"controlClass\">\n' + 
        '        <input type=\"text\" name=\"{{ controlName }}\" class=\"form-control\" ng-model=\"ctrl.formModel[controlName]\" />\n' + 
        '    </div>\n' +
        '</div>\n' +
        '');
}]);
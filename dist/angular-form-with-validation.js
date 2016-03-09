angular.module('angular-form-with-validation', [
    'angular.form',
    'angular.form.constant',
    'angular.form.filter',
    'angular.form.tpls',
    'angular.form.control'
]);

angular.module('angular.form.constant', [])
.constant('angularFormConfig', {
    controlClass: 'col-md-12',
    controlLabelClass: 'col-md-12',
    successClass: 'has-success',
    errorClass: 'has-error',
    successIconClass: 'glyphicon glyphicon-ok',
    errorIconClass: 'glyphicon glyphicon-remove'
});

angular.module('angular.form.filter', [])
.filter('formGroupValidation', ['angularFormConfig', function (angularFormConfig) {
    return function (input) {
        if (input) {
            if ((!input.$pristine && input.$untouched || input.$touched) && input.$invalid) {
                return angularFormConfig.errorClass;
            } else if ((!input.$pristine && input.$untouched || input.$touched) && input.$valid) {
                return angularFormConfig.successClass;
            }
        }
        return '';
    };
}])
.filter('formIconValidation', ['angularFormConfig', function (angularFormConfig) {
    return function (input) {
        if (input) {
            if ((!input.$pristine && input.$untouched || input.$touched) && input.$invalid) {
                return angularFormConfig.errorIconClass;
            } else if ((!input.$pristine && input.$untouched || input.$touched) && input.$valid) {
                return angularFormConfig.successIconClass;
            }
        }
        return '';
    };
}])
.filter('formShowMessage', function () {
    return function (input) {
        if (input) {
            if (input.$error && (input.$touched || (!input.$pristine && input.$untouched))) {
                return !$.isEmptyObject(input.$error);
            }
        }
        return false;
    };
})
.filter('formErrorMessage', function () {
    return function (input) {
        if (input) {
            if (input.$error && (input.$touched || (!input.$pristine && input.$untouched))) {
                if (input.$error['required']) {
                    return 'This field is required.';
                } else if (input.$error['maxlength']) {
                    return 'This field is too long.';
                } else if (input.$error['minlength']) {
                    return 'This field is too short.';
                } else if (input.$error['number-only']) {
                    return 'This field is number only';
                } else if (input.$error['number-small']) {
                    return 'This number is too small';
                } else if (input.$error['number-big']) {
                    return 'This number is too big';
                } else if (input.$error['date-format']) {
                    return 'This field must be a date';
                } else if (input.$error['date-from-small-to']) {
                    return 'Date from must be smaller than date to.';
                } else if (input.$error['date-to-large-from']) {
                    return 'Date to must be larger than date from.';
                } else if (input.$error['pattern']) {
                    return 'This field\'s format is wrong.';
                } else if (input.$error['uploading-file']) {
                    return 'Upload this file now.';
                }
            }
        }
        return '';
    };
});

angular.module('angular.form', [])
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
        controller: 'AngularFormController',
        transclude: true,
        link: function ($scope, $element, $attrs) {
            $scope.formModel = angular.isDefined($scope.formModel) ? $scope.formModel : new Object();
            $scope.formValidation = $scope.form;
        }
    };
});

angular.module('angular.form.control', [
    'angular.form.control.static',
    'angular.form.control.input'
])
.directive('formControl', function () {
    return {
        require: '^formArea',
        restrict: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || (angular.isDefined(attrs.controlIcon) ?
                'fwv/template/form/control-icon.html' : 'fwv/template/form/control.html');
        },
        replace: true,
        scope: {
            controlRequired: '@',
            controlMinlength: '@',
            controlMaxlength: '@',
            controlHelp: '@',
            controlIcon: '@'
        },
        transclude: true,
        controller: function () { },
        link: function ($scope, $element, $attrs, $ctrl) {
            var ctrl = $scope.ctrl = $ctrl;
            $scope.controlName = angular.isDefined($attrs.controlName) && $attrs.controlName.length > 0 ?
                $attrs.controlName : 'untitled' + ++ctrl.formUntitledCount;
            $scope.controlLabel = angular.isDefined($attrs.controlLabel) ? $attrs.controlLabel : 'Untitled';
            $scope.controlClass = angular.isDefined($attrs.controlClass) ? $attrs.controlClass : ctrl.formControlClass;
            $scope.controlLabelClass = angular.isDefined($attrs.controlLabelClass) ? $attrs.controlLabelClass : ctrl.formControlLabelClass;
            $scope.controlPattern = angular.isDefined($attrs.controlPattern) ? eval($attrs.controlPattern) : undefined;

            if (angular.isDefined($attrs.controlType)) {
                switch ($attrs.controlType) {
                    case 'static': $scope.controlStatic = true; break;
                    case 'input': $scope.controlInput = true; break;
                }
            }
        }
    };
});

angular.module('angular.form.control.static', [])
.directive('formStatic', function () {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'fwv/template/form/static.html';
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
});

angular.module('angular.form.control.input', [])
.directive('formInput', function () {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || 'fwv/template/form/input.html';
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
});

angular.module('angular.form.tpls', [
    'fwv/template/form/area.html',
    'fwv/template/form/control.html',
    'fwv/template/form/control-icon.html',
    'fwv/template/form/static.html',
    'fwv/template/form/input.html'
]);

angular.module('fwv/template/form/area.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/area.html',
        '<ng-form role="form" name="form" novalidate ng-transclude>\n' +
        '</ng-form>' +
        '');
}]);

angular.module('fwv/template/form/control.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/control.html',
        '<div class=\"form-group\" ng-class=\"ctrl.formValidation[controlName] | formGroupValidation\">\n' +
        '   <label class=\"control-label\" ng-class=\"controlLabelClass\">{{ controlLabel }}</label>\n' +
        '   <div ng-class=\"controlClass\">\n' +
        '       <form-static ng-if=\"controlStatic\"></form-static>\n' +
        '       <form-input ng-if=\"controlInput\"></form-input>\n' +
        '       <span class=\"help-block\" ng-if=\"controlHelp.length > 0 || (ctrl.formValidation[controlName] | formShowMessage)\">\n' +
        '           {{ (ctrl.formValidation[controlName] | formShowMessage) ? (ctrl.formValidation[controlName] | formErrorMessage) : controlHelp }}\n' +
        '       </span>\n' +
        '   </div>\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/control-icon.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/control-icon.html',
        '<div class=\"form-group\" ng-class=\"ctrl.formValidation[controlName] | formGroupValidation\">\n' +
        '   <label class=\"control-label\" ng-class=\"controlLabelClass\">{{ controlLabel }}</label>\n' +
        '   <div ng-class=\"controlClass\">\n' +
        '       <div class=\"input-icon\" ng-class=\"controlIcon\">\n' +
        '           <i ng-class=\"ctrl.formValidation[controlName] | formIconValidation\" />\n' +
        '           <form-static ng-if=\"controlStatic\"></form-static>\n' +
        '           <form-input ng-if=\"controlInput\"></form-input>\n' +
        '           <span class=\"help-block\" ng-if=\"controlHelp.length > 0 || (ctrl.formValidation[controlName] | formShowMessage)\">\n' +
        '               {{ (ctrl.formValidation[controlName] | formShowMessage) ? (ctrl.formValidation[controlName] | formErrorMessage) : controlHelp }}\n' +
        '           </span>\n' +
        '       </div>\n' +
        '   </div>\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/static.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/static.html',
        '<p class=\"form-control-static\"> {{ ctrl.formModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/input.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/input.html',
        '<input type=\"text\" name=\"{{ controlName }}\" class=\"form-control\"\n' +
        '       ng-model=\"ctrl.formModel[controlName]\"\n' +
        '       ng-required=\"controlRequired\"\n' +
        '       ng-pattern=\"controlPattern\"\n' +
        '       ng-minlength=\"controlMinlength\"\n' +
        '       ng-maxlength=\"controlMaxlength\" />\n' +
        '');
}]);
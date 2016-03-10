angular.module('angular-form-with-validation', [
    'angular.form',
    'angular.form.constant',
    'angular.form.filter',
    'angular.form.tpls',
    'angular.form.control',
    'angular.form.controls'
]);

angular.module('angular.form.constant', [])
.constant('angularFormConfig', {
    controlClass: 'col-md-12',
    controlLabelClass: 'col-md-12',
    successClass: 'has-success',
    errorClass: 'has-error',
    successIconClass: 'glyphicon glyphicon-ok',
    errorIconClass: 'glyphicon glyphicon-remove',
    templateUrl: {
        formArea: 'fwv/template/form/area.html',
        formControl: 'fwv/template/form/control.html',
        formControlIcon: 'fwv/template/form/control-icon.html'
    },
    errorMessage: {
        // Todo:
    }
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
.controller('AngularFormController', ['$scope', '$attrs', 'angularFormConfig',
    function ($scope, $attrs, angularFormConfig) {
        var ctrl = this;
        // Model where we set the form value. All form control in the form should use the same ng-model.
        ctrl.ngModel = $scope.ngModel;
        // form-control-class (Default: col-md-12)
        ctrl.formControlClass = $scope.formControlClass = $attrs.formControlClass || angularFormConfig.controlClass;
        // form-control-label-class (Default: col-md-12)
        ctrl.formControlLabelClass = $scope.formControlLabelClass = $attrs.formControlLabelClass || angularFormConfig.controlLabelClass;
        // form untitled count
        ctrl.formUntitledCount = 0;

        /*
        $scope.formValidation = $scope.form;
        ctrl.formValidation = $scope.formValidation;

        $scope.$watch('formValidation', function (newValue, oldValue) {
            ctrl.formValidation = newValue;
        });
        */
    }])
.directive('formArea', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: ['formArea', 'ngModel'],
        restrict: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formArea;
        },
        replace: true,
        scope: {
            ngModel: '='
        },
        controller: 'AngularFormController',
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.control', [])
.directive('formControl', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formArea',
        restrict: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || (angular.isDefined(attrs.controlIcon) ?
                angularFormConfig.templateUrl.formControlIcon : angularFormConfig.templateUrl.formControl);
        },
        replace: true,
        scope: {
            //controlRequired: '@',
            //controlMinlength: '@',
            //controlMaxlength: '@',
            //controlHelp: '@',
            //controlIcon: '@'
        },
        transclude: true,
        controller: function () { },
        link: function ($scope, $element, $attrs, $ctrl) {
            var ctrl = $scope.ctrl = $ctrl;
            // control-name (Default: untitled + (i++))
            $scope.controlName = angular.isDefined($attrs.controlName) && $attrs.controlName.length > 0 ?
                $attrs.controlName : 'untitled' + ++ctrl.formUntitledCount;
            // control-label (Default: Untitled)
            $scope.controlLabel = $attrs.controlLabel || 'Untitled';
            // control-class (Default: form-control-class)
            $scope.controlClass = $attrs.controlClass || ctrl.formControlClass;
            // control-label-class (Default: form-control-label-class)
            $scope.controlLabelClass = $attrs.controlLabelClass || ctrl.formControlLabelClass;
            // control-input-type (Default: text)
            $scope.controlInputType = $attrs.controlInputType || 'text';

            // control-[type] enable (Default: undefined)
            if (angular.isDefined($attrs.controlType)) {
                switch ($attrs.controlType) {
                    case 'static': $scope.controlStatic = true; break;
                    case 'input': $scope.controlInput = true; break;
                        // TODO: ADD MORE TYPE
                }
            }
        }
    };
}]);

angular.module('angular.form.controls', [
    'angular.form.controls.static',
    'angular.form.controls.input',
]);

angular.module('angular.form.controls.static', [])
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

angular.module('angular.form.controls.input', [])
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
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/input.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/input.html',
        '<input type=\"{{ controlInputType }}\" name=\"{{ controlName }}\" class=\"form-control\"\n' +
        '       ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '       ng-required=\"controlRequired\"\n' +
        '       ng-pattern=\"controlPattern\"\n' +
        '       ng-minlength=\"controlMinlength\"\n' +
        '       ng-maxlength=\"controlMaxlength\" />\n' +
        '');
}]);
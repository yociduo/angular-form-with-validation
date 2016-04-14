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
    styles: {
        formControlClass: 'col-md-12',
        formControlLabelClass: 'col-md-12',
        successClass: 'has-success',
        errorClass: 'has-error',
        successIconClass: 'glyphicon glyphicon-ok',
        errorIconClass: 'glyphicon glyphicon-remove',
    },
    templateUrl: {
        formArea: 'fwv/template/form/area.html',
        formControl: 'fwv/template/form/control.html',
        formControlIcon: 'fwv/template/form/control-icon.html'
    },
    options: {
        disableValidation: false,
        controlLabel: 'Untitled',
        controlType: 'input',
        controlInputType: 'text',
        controlDisabled: false,
        controlReadonly: false
    },
    errorMessage: {
        // Todo: Optimize to constant module
    }
});

angular.module('angular.form.filter', [])
.filter('formGroupValidation', ['angularFormConfig', function (angularFormConfig) {
    return function (input) {
        if (input) {
            if ((!input.$pristine && input.$untouched || input.$touched) && input.$invalid) {
                return angularFormConfig.styles.errorClass;
            } else if ((!input.$pristine && input.$untouched || input.$touched) && input.$valid) {
                return angularFormConfig.styles.successClass;
            }
        }
        return '';
    };
}])
.filter('formIconValidation', ['angularFormConfig', function (angularFormConfig) {
    return function (input) {
        if (input) {
            if ((!input.$pristine && input.$untouched || input.$touched) && input.$invalid) {
                return angularFormConfig.styles.errorIconClass;
            } else if ((!input.$pristine && input.$untouched || input.$touched) && input.$valid) {
                return angularFormConfig.styles.successIconClass;
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
                // Todo: Optimize to constant module
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
.controller('AngularFormController', ['$scope', '$attrs', '$timeout', '$log', 'angularFormConfig',
    function ($scope, $attrs, $timeout, $log, angularFormConfig) {
        var self = this,
            optionsUsed = $scope.optionsUsed = !!$attrs.formOptions;

        if (!$scope.formOptions) {
            $scope.formOptions = {};
        }

        [
            'disableValidation',            // disable-validation (Type: boolean, Default: false)
            'formControls',                 // form-controls (Type: Array, Default: null)
            'formControlClass',             // form-control-class (Type: string, Default: col-md-12)
            'formControlLabelClass',        // form-control-label-class (Type: string, Default: col-md-12)
            'formControlDisabled',          // form-control-disabled (Type: boolean, Default: false)
            'formControlReadonly',          // form-control-readonly (Type: boolean, Default: false)
        ].forEach(function (key) {
            switch (key) {
                case 'disableValidation':   // get default from options, controls can inherits from this
                case 'formControlReadonly':
                case 'formControlDisabled':
                    if (optionsUsed && angular.isDefined($scope.formOptions[key]) && typeof ($scope.formOptions[key]) == 'boolean') {
                        self[key] = $scope.formOptions[key];
                    } else if (!!$attrs[key] && typeof ($scope[key]) == 'boolean') {
                            self[key] = $scope[key];
                    } else {
                        self[key] = angularFormConfig.options[key];
                    }
                    break;
                case 'formControls':            // form controls in options defined
                    $scope[key] = angular.isArray($scope.formOptions[key]) ?
                        $scope.formOptions[key] : null;
                    break;
                case 'formControlClass':        // get default from styles, controls can inherits from this
                case 'formControlLabelClass':
                    if (optionsUsed && angular.isDefined($scope.formOptions[key])) {
                        self[key] = $scope[key] = $scope.formOptions[key];
                    } else {
                        self[key] = $scope[key] = $attrs.formControlClass || angularFormConfig.styles[key];
                    }
                    break;
            }
        });

        // Model where we set the form value. All form control in the form should use the same ng-model.
        self.ngModel = $scope.ngModel;
        // form untitled counter
        self.formUntitledCount = 0;

        // set form validation model to the ctrl and options
        if (!self.disableValidation) {
            $timeout(function () {
                self.formValidation = $scope.form;
                if (optionsUsed) {
                    $scope.formOptions.formValidation = $scope.form;
                }
            });
        }
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
            ngModel: '=',
            formOptions: '=?',
            disableValidation: '=?',
            formDisabled: '=?',
            formReadonly: '=?',
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
            // Todo:
            return attrs.templateUrl || (angular.isDefined(attrs.controlIcon) ?
                angularFormConfig.templateUrl.formControlIcon : angularFormConfig.templateUrl.formControl);
        },
        replace: true,
        scope: {
            controlOptions: '=?',
        },
        transclude: true,
        controller: function () { },
        link: function ($scope, $element, $attrs, $ctrl) {
            var optionsUsed = $scope.optionsUsed = !!$attrs.controlOptions,
                ctrl = $scope.ctrl = $ctrl;

            if (!$scope.controlOptions) {
                $scope.controlOptions = {};
            }

            [
                'controlName',          // control-name (Default: untitled + (i++))
                'controlType',          // control-type (Default: input)
                'controlLabel',         // control-label (Default: Untitled)
                'controlInputType',     // control-input-type (Default: text)
                'controlClass',         // control-class (Default: form-control-class)
                'controlLabelClass',    // control-label-class (Default: form-control-label-class)
                'controlDisabled',      // control-disabled (Default: false)
                'controlReadonly',      // control-readonly (Default: false)
                'controlRequired',      // control-required (Default: null)
                'controlMinlength',     // control-minlength (Default: null)
                'controlMaxlength',     // control-maxlength (Default: null)
                'controlHelp',          // control-help (Default: null)
                'controlIcon',          // control-icon (Default: null)
                'controlPattern',       // control-pattern (Default: null)
            ].forEach(function (key) {
                switch (key) {
                    case 'controlName':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key]) && $scope.controlOptions[key].length > 0) {
                            $scope[key] = $scope.controlOptions[key];
                        } else if (angular.isDefined($attrs.controlName) && $attrs.controlName.length > 0) {
                            $scope[key] = $attrs.controlName;
                        } else {
                            $scope[key] = '_untitled' + ++ctrl.formUntitledCount;
                        }
                        break;
                    case 'controlLabel':
                    case 'controlType':
                    case 'controlInputType':
                        if (optionsUsed) {
                            $scope[key] = $scope.controlOptions[key] || angularFormConfig.options[key];
                        } else {
                            $scope[key] = $attrs[key] || angularFormConfig.options[key];
                        }
                        break;
                    case 'controlClass': // inherit from parent
                    case 'controlLabelClass':
                    case 'controlDisabled':
                    case 'controlReadonly':
                        if (optionsUsed) {
                            $scope[key] = $scope.controlOptions[key] || ctrl['formC' + key.substr(1)];
                        } else {
                            $scope[key] = $attrs[key] || ctrl['formC' + key.substr(1)];
                        }
                        break;
                    case 'controlRequired':
                    case 'controlMinlength':
                    case 'controlMaxlength':
                    case 'controlHelp':
                    case 'controlIcon':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key])) {
                            $scope[key] = $scope.controlOptions[key];
                        } else if (angular.isDefined($attrs[key])) {
                            $scope[key] = $attrs[key];
                        }
                        break;
                    case 'controlPattern':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key])) {
                            $scope[key] = $scope.controlOptions[key];
                        } else if (angular.isDefined($attrs[key])) {
                            $scope[key] = eval($attrs[key]);
                        }
                        break;
                }
            });

            // control-[type] enable (Default: undefined)
            switch ($scope.controlType) {
                case 'static': $scope.controlStatic = true; break;
                case 'input': $scope.controlInput = true; break;
                    // TODO: ADD MORE TYPE
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
        '<ng-form role=\"form\" name=\"form\" novalidate>\n' +
        '   <div class=\"form-body\">\n' +
        '       <form-control ng-if=\"optionsUsed\" ng-repeat=\"control in formControls\"\n' +
        '       control-options=\"control\"></form-control>\n' +
        '   </div>\n' +
        '   <ng-transclude></ng-transclude>\n' +
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
        '       ng-disabled=\"controlDisabled\"\n' +
        '       ng-readonly=\"controlReadonly\"\n' +
        '       ng-required=\"controlRequired\"\n' +
        '       ng-pattern=\"controlPattern\"\n' +
        '       ng-minlength=\"controlMinlength\"\n' +
        '       ng-maxlength=\"controlMaxlength\" />\n' +
        '');
}]);
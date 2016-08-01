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
    },
    templateUrl: {
        formArea: 'fwv/template/form/area.html',
        formControl: 'fwv/template/form/control.html',
        formStatic: 'fwv/template/form/static.html',
        formInput: 'fwv/template/form/input.html',
        formInputGroup: 'fwv/template/form/input-group.html',
        formTextarea: 'fwv/template/form/textarea.html',
        formSelect: 'fwv/template/form/select.html',
        formMutipleSelect: 'fwv/template/form/mutiple-select.html',
    },
    options: {
        disableValidation: false,
        formControlDisabled: false,
        formControlReadonly: false,
        controlLabel: 'Untitled',
        controlType: 'input',
        controlInputType: 'text',
        controlGroupOptions: {},
        controlRows: 4,
        controlSelectOptions: {},
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
})
.filter('formHtml', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

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
            'formControlDisabled',          // form-control-disabled (Type: boolean, Default: false)
            'formControlReadonly',          // form-control-readonly (Type: boolean, Default: false)
            'formControls',                 // form-controls (Type: Array, Default: null)
            'formControlClass',             // form-control-class (Type: string, Default: col-md-12)
            'formControlLabelClass',        // form-control-label-class (Type: string, Default: col-md-12)
        ].forEach(function (key) {
            switch (key) {
                case 'disableValidation':   // get default from options, controls can inherits from this
                case 'formControlDisabled':
                case 'formControlReadonly':
                    if (optionsUsed && angular.isDefined($scope.formOptions[key])) {
                        $scope.$watch('formOptions.' + key, function (newValue) {
                            if (typeof (newValue) === 'boolean') {
                                self[key] = newValue;
                            } else {
                                self[key] = angularFormConfig.options[key];
                            }
                        });
                    } else if (!!$attrs[key]) {
                        $scope.$watch(key, function (newValue) {
                            if (typeof (newValue) === 'boolean') {
                                self[key] = newValue;
                            } else {
                                self[key] = angularFormConfig.options[key];
                            }
                        });
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
                        self[key] = $scope.formOptions[key] || angularFormConfig.styles[key];
                    } else {
                        self[key] = $attrs[key] || angularFormConfig.styles[key];
                    }
                    break;
            }
        });

        // Model where we set the form value. All form control in the form should use the same ng-model.
        self.ngModel = $scope.ngModel;
        // form untitled counter
        self.formUntitledCount = 0;

        // set form validation model to the ctrl and options
        $timeout(function () {
            if (!self.disableValidation) {
                self.formValidation = $scope.form;
                if (optionsUsed) {
                    $scope.formOptions.formValidation = $scope.form;
                }
            }
        });
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
            formControlDisabled: '=?',
            formControlReadonly: '=?',
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
            return attrs.templateUrl || angularFormConfig.templateUrl.formControl;
        },
        replace: true,
        scope: {
            controlOptions: '=?',
            controlDisabled: '=?',
            controlReadonly: '=?',
            controlGroupOptions: '=?',
            controlSelectOptions: '=?',
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
                'controlName',          // control-name (Default: _untitled + (i++))
                'controlLabel',         // control-label (Default: Untitled)
                'controlType',          // control-type (Default: input)
                'controlInputType',     // control-input-type (Default: text)
                'controlPlaceholder',   // control-placeholder (Default: null)
                'controlClass',         // control-class (Default: form-control-class)
                'controlLabelClass',    // control-label-class (Default: form-control-label-class)
                'controlDisabled',      // control-disabled (Default: false)
                'controlReadonly',      // control-readonly (Default: false)
                'controlRequired',      // control-required (Default: null)
                'controlMinlength',     // control-minlength (Default: null)
                'controlMaxlength',     // control-maxlength (Default: null)
                'controlHelp',          // control-help (Default: null)
                'controlPattern',       // control-pattern (Default: null)
            ].forEach(function (key) {
                switch (key) {
                    case 'controlName':         // get from untitled
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key]) && $scope.controlOptions[key].length > 0) {
                            $scope[key] = $scope.controlOptions[key];
                        } else if (angular.isDefined($attrs.controlName) && $attrs.controlName.length > 0) {
                            $scope[key] = $attrs.controlName;
                        } else {
                            $scope[key] = '_untitled' + ++ctrl.formUntitledCount;
                        }
                        break;
                    case 'controlLabel':        // get from config
                    case 'controlType':
                    case 'controlInputType':
                    case 'controlPlaceholder':
                        if (optionsUsed) {
                            $scope[key] = $scope.controlOptions[key] || angularFormConfig.options[key];
                        } else {
                            $scope[key] = $attrs[key] || angularFormConfig.options[key];
                        }
                        break;
                    case 'controlClass':        // inherit from parent
                    case 'controlLabelClass':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key])) {
                            $scope[key] = $scope.controlOptions[key];
                        } else {
                            $scope[key] = $attrs[key] || ctrl['formC' + key.substr(1)];
                        }
                        break;
                    case 'controlDisabled':     // inherit from parent
                    case 'controlReadonly':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key])) {
                            $scope.$watch('controlOptions.' + key, function (newValue) {
                                if (typeof (newValue) === 'boolean') {
                                    $scope[key] = newValue;
                                } else {
                                    $scope[key] = ctrl['formC' + key.substr(1)];
                                }
                            });
                        } else if (!!$attrs[key]) {
                            $scope.$watch(key, function (newValue) {
                                if (typeof (newValue) === 'boolean') {
                                    $scope[key] = newValue;
                                } else {
                                    $scope[key] = ctrl['formC' + key.substr(1)];
                                }
                            });
                        } else {
                            $scope.$watch('ctrl.formC' + key.substr(1), function (newValue) {
                                $scope[key] = newValue;
                            });
                        }
                        break;
                    case 'controlRequired':     // form validation
                    case 'controlMinlength':
                    case 'controlMaxlength':
                    case 'controlHelp':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key])) {
                            $scope[key] = $scope.controlOptions[key];
                        } else if (angular.isDefined($attrs[key])) {
                            $scope[key] = $attrs[key];
                        }
                        break;
                    case 'controlPattern':     // form validation regex match
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
                case 'input-group': $scope.controlInputGroup = true;
                    if (optionsUsed && angular.isDefined($scope.controlOptions.controlGroupOptions)) {
                        $scope.controlGroupOptions = $scope.controlOptions.controlGroupOptions;
                    } else {
                        $scope.controlGroupOptions = $scope.controlGroupOptions || angularFormConfig.options.controlGroupOptions;
                    }
                    break;
                case 'textarea': $scope.controlTextArea = true;
                    if (optionsUsed) {
                        $scope.controlRows = $scope.controlOptions.controlRows || handpickFormConfig.options.controlRows;
                    } else {
                        $scope.controlRows = $attrs.controlRows || angularFormConfig.options.controlRows;
                    }
                    break;
                case 'select': $scope.controlSelect = true;
                    if (optionsUsed && angular.isDefined($scope.controlOptions.controlSelectOptions)) {
                        $scope.controlSelectOptions = $scope.controlOptions.controlSelectOptions;
                    } else {
                        $scope.controlSelectOptions = $scope.controlSelectOptions || angularFormConfig.options.controlSelectOptions;
                    }
                    break;
                case 'mutiple-select': $scope.controlMutipleSelect = true;
                    if (optionsUsed && angular.isDefined($scope.controlOptions.controlSelectOptions)) {
                        $scope.controlSelectOptions = $scope.controlOptions.controlSelectOptions;
                    } else {
                        $scope.controlSelectOptions = $scope.controlSelectOptions || angularFormConfig.options.controlSelectOptions;
                    }
                    break;
            break;
            // TODO: ADD MORE TYPE
        }
    }
};
}]);

angular.module('angular.form.controls', [
    'angular.form.controls.static',
    'angular.form.controls.input',
    'angular.form.controls.input-group',
    'angular.form.controls.textarea',
    'angular.form.controls.select',
    'angular.form.controls.mutiple-select',
]);

angular.module('angular.form.controls.static', [])
.directive('formStatic', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formStatic;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.input', [])
.directive('formInput', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formInput;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.input-group', [])
.directive('formInputGroup', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formInputGroup;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.textarea', [])
.directive('formTextarea', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formTextarea;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.select', [])
.directive('formSelect', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formSelect;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.mutiple-select', [])
.directive('formMutipleSelect', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formMutipleSelect;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.tpls', [
    'fwv/template/form/area.html',
    'fwv/template/form/control.html',
    'fwv/template/form/static.html',
    'fwv/template/form/input.html',
    'fwv/template/form/input-group.html',
    'fwv/template/form/textarea.html',
    'fwv/template/form/select.html',
    'fwv/template/form/mutiple-select.html',
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
        '       <form-input-group ng-if=\"controlInputGroup\"></form-input-group>\n' +
        '       <form-textarea ng-if=\"controlTextArea\"></form-textarea>\n' +
        '       <form-select ng-if=\"controlSelect\"></form-select>\n' +
        '       <form-mutiple-select ng-if=\"controlMutipleSelect\"></form-mutiple-select>\n' +
        '       <span class=\"help-block\" ng-if=\"controlHelp.length > 0 || (ctrl.formValidation[controlName] | formShowMessage)\">\n' +
        '           {{ (ctrl.formValidation[controlName] | formShowMessage) ? (ctrl.formValidation[controlName] | formErrorMessage) : controlHelp }}\n' +
        '       </span>\n' +
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
        '       placeholder=\"{{controlPlaceholder}}\"\n' +
        '       ng-disabled=\"controlDisabled\"\n' +
        '       ng-readonly=\"controlReadonly\"\n' +
        '       ng-required=\"controlRequired\"\n' +
        '       ng-pattern=\"controlPattern\"\n' +
        '       ng-minlength=\"controlMinlength\"\n' +
        '       ng-maxlength=\"controlMaxlength\" />\n' +
        '');
}]);

angular.module('fwv/template/form/input-group.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/input-group.html',
        '<div class=\"input-group\">\n' +
        '   <div ng-if=\"controlGroupOptions.before\" class=\"input-group-{{controlGroupOptions.before.type}}\" ng-bind-html=\"controlGroupOptions.before.html|formHtml\"></div>\n' +
        '    <input type=\"{{ controlInputType }}\" name=\"{{ controlName }}\" class=\"form-control\"\n' +
        '           ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '           placeholder=\"{{controlPlaceholder}}\"\n' +
        '           ng-disabled=\"controlDisabled\"\n' +
        '           ng-readonly=\"controlReadonly\"\n' +
        '           ng-required=\"controlRequired\"\n' +
        '           ng-pattern=\"controlPattern\"\n' +
        '           ng-minlength=\"controlMinlength\"\n' +
        '           ng-maxlength=\"controlMaxlength\" />\n' +
        '   <div ng-if=\"controlGroupOptions.after\" class=\"input-group-{{controlGroupOptions.after.type}}\" ng-bind-html=\"controlGroupOptions.after.html|formHtml\"></div>\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/textarea.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/textarea.html',
        '<textarea type=\"{{controlInputType}}\" name=\"{{controlName}}\" class=\"form-control\"\n' +
        '       ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '       placeholder=\"{{controlPlaceholder}}\"\n' +
        '       ng-disabled=\"controlDisabled\"\n' +
        '       ng-readonly=\"controlReadonly\"\n' +
        '       ng-required=\"controlRequired\"\n' +
        '       ng-pattern=\"controlPattern\"\n' +
        '       ng-minlength=\"controlMinlength\"\n' +
        '       ng-maxlength=\"controlMaxlength\"\n' +
        '       rows=\"{{controlRows}}\">\n' +
        '</textarea>\n' +
        '');
}]);

angular.module('fwv/template/form/select.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/select.html',
        '<select name=\"{{controlName}}\" class=\"form-control\"\n' +
        '        ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '        ng-disabled=\"controlDisabled\"\n' +
        '        ng-readonly=\"controlReadonly\"\n' +
        '        ng-required=\"controlRequired\"\n' +
        '        ng-pattern=\"controlPattern\"\n' +
        '        ng-options=\"{{controlSelectOptions.ngOptions}}\"\n' +
        '</select>\n' +
        '');
}]);

angular.module('fwv/template/form/mutiple-select.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/mutiple-select.html',
        '<select name=\"{{controlName}}\" class=\"form-control\" multiple\n' +
        '        ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '        ng-disabled=\"controlDisabled\"\n' +
        '        ng-readonly=\"controlReadonly\"\n' +
        '        ng-required=\"controlRequired\"\n' +
        '        ng-pattern=\"controlPattern\"\n' +
        '        ng-options=\"{{controlSelectOptions.ngOptions}}\"\n' +
        '</select>\n' +
        '');
}]);
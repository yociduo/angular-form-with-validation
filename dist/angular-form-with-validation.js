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
        controlTagClass: 'label label-success',
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
        formRadio: 'fwv/template/form/radio.html',
        formCheckbox: 'fwv/template/form/checkbox.html',
        formCheckboxList: 'fwv/template/form/checkbox-list.html',
        formTags: 'fwv/template/form/tags.html',
        formDatePicker: 'fwv/template/form/date-picker.html',
        formTimePicker: 'fwv/template/form/time-picker.html',
        formDatetimePicker: 'fwv/template/form/datetime-picker.html',
        formDateRange: 'fwv/template/form/date-range.html',
        formAutoComplete: 'fwv/template/form/auto-complete.html',
        formTreeView: 'fwv/template/form/tree-view.html',
        formRichText: 'fwv/template/form/rich-text.html',
        formFileUpload: 'fwv/template/form/file-upload.html',
        formFileUploadAndCrop: 'fwv/template/form/file-upload-and-crop.html',
    },
    options: {
        disableValidation: false,
        formControlDisabled: false,
        formControlReadonly: false,
        controlLabel: 'Untitled',
        controlType: 'input',
        controlInputType: 'text',
        controlRows: 4,
        controlGeneralOptions: {
            options: []
        },
        controlCheckboxLabel: 'Default',
        controlRichTextOptions: {
            height: 300,
            placeholder: 'Please write here...',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['view', ['codeview']],
            ]
        },
        controlJcropOptions: { p: { w: 150, h: 150 } },
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
            controlGeneralOptions: '=?',
            controlRichTextOptions: '=?',
            controlJcropOptions: '=?',
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
                'controlName',              // control-name (Default: _untitled + (i++))
                'controlLabel',             // control-label (Default: Untitled)
                'controlType',              // control-type (Default: input)
                'controlInputType',         // control-input-type (Default: text)
                'controlPlaceholder',       // control-placeholder (Default: null)
                'controlClass',             // control-class (Default: form-control-class)
                'controlLabelClass',        // control-label-class (Default: form-control-label-class)
                'controlTagClass',          // control-tag-class (Default: label label-success)
                'controlDisabled',          // control-disabled (Default: false)
                'controlReadonly',          // control-readonly (Default: false)
                'controlRequired',          // control-required (Default: null)
                'controlMinlength',         // control-minlength (Default: null)
                'controlMaxlength',         // control-maxlength (Default: null)
                'controlHelp',              // control-help (Default: null)
                'controlPattern',           // control-pattern (Default: null)
                'controlGeneralOptions',    // control-general-opitons (Default: { options: [] })
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
                    case 'controlTagClass':     // get form styles
                        if (optionsUsed) {
                            $scope[key] = $scope.controlOptions[key] || angularFormConfig.styles[key];
                        } else {
                            $scope[key] = $attrs[key] || angularFormConfig.styles[key];
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
                    case 'controlGeneralOptions':
                        if (optionsUsed && angular.isDefined($scope.controlOptions[key])) {
                            $scope[key] = $scope.controlOptions[key];
                        } else {
                            $scope[key] = $scope[key] || angularFormConfig.options[key];
                        }
                        break;
                }
            });

            // control-[type] enable (Default: undefined)
            switch ($scope.controlType) {
                case 'static': $scope.controlStatic = true; break;
                case 'input': $scope.controlInput = true; break;
                case 'password': $scope.controlInput = true; $scope.controlInputType = 'password'; break;
                case 'input-group': $scope.controlInputGroup = true; break;
                case 'textarea': $scope.controlTextArea = true;
                    if (optionsUsed) {
                        $scope.controlRows = $scope.controlOptions.controlRows || handpickFormConfig.options.controlRows;
                    } else {
                        $scope.controlRows = $attrs.controlRows || angularFormConfig.options.controlRows;
                    }
                    break;
                case 'select': $scope.controlSelect = true; break;
                case 'mutiple-select': $scope.controlMutipleSelect = true; break;
                case 'radio': $scope.controlRadio = true; break;
                case 'checkbox': $scope.controlCheckbox = true;
                    if (optionsUsed) {
                        $scope.controlCheckboxLabel = $scope.controlOptions.controlCheckboxLabel || angularFormConfig.options.controlCheckboxLabel;
                    } else {
                        $scope.controlCheckboxLabel = $attrs.controlCheckboxLabel || angularFormConfig.options.controlCheckboxLabel;
                    }
                    break;
                case 'checkbox-list': $scope.controlCheckboxList = true; break;
                case 'tags': $scope.controlTags = true; break;
                case 'date-picker': $scope.controlDatePicker = true; break;
                case 'date-range': $scope.controlDateRange = true; break;
                case 'time-picker': $scope.controlTimePicker = true; break;
                case 'range-slider': $scope.controlRangeSlider = true; break;
                case 'auto-complete': $scope.controlAutoComplete = true; break;
                case 'tree-view': $scope.controlTreeView = true; break;
                case 'rich-text': $scope.controlRichText = true;
                    if (optionsUsed && angular.isDefined($scope.controlOptions.controlRichTextOptions)) {
                        $scope.controlRichTextOptions = $scope.controlOptions.controlRichTextOptions;
                    } else {
                        $scope.controlRichTextOptions = $scope.controlRichTextOptions || angularFormConfig.options.controlRichTextOptions;
                    }
                    break;
                case 'file-upload': $scope.controlFileUpload = true; break;
                case 'file-upload-and-crop': $scope.controlFileUploadAndCrop = true;
                    if (optionsUsed && angular.isDefined($scope.controlOptions.controlJcropOptions)) {
                        $scope.controlJcropOptions = $scope.controlOptions.controlJcropOptions;
                    } else {
                        $scope.controlJcropOptions = $scope.controlJcropOptions || angularFormConfig.options.controlJcropOptions;
                    }
                    break;
                case 'hidden-key':
                default: $scope.controlHidden = true; break;
            }

            // set current control touched
            $scope.controlSetTouched = function () {
                if (ctrl.formValidation) {
                    ctrl.formValidation.$setDirty();
                    ctrl.formValidation[$scope.controlName].$setTouched();
                }
            }
        }
    };
}])
.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});

angular.module('angular.form.controls', [
    'angular.form.controls.static',
    'angular.form.controls.input',
    'angular.form.controls.input-group',
    'angular.form.controls.textarea',
    'angular.form.controls.select',
    'angular.form.controls.mutiple-select',
    'angular.form.controls.radio',
    'angular.form.controls.checkbox',
    'angular.form.controls.checkbox-list',
    'angular.form.controls.tags',
    'angular.form.controls.date-picker',
    'angular.form.controls.datetime-picker',
    'angular.form.controls.time-picker',
    'angular.form.controls.date-range',
    'angular.form.controls.auto-complete',
    'angular.form.controls.tree-view',
    'angular.form.controls.rich-text',
    'angular.form.controls.file-upload',
    'angular.form.controls.file-upload-and-crop',
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
        link: function ($scope, $element, $attrs) {
            (!$scope.ctrl.ngModel[$scope.controlName]) && ($scope.ctrl.ngModel[$scope.controlName] = '');
        }
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

angular.module('angular.form.controls.radio', [])
.directive('formRadio', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formRadio;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.checkbox', [])
.directive('formCheckbox', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formCheckbox;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.checkbox-list', [])
.directive('formCheckboxList', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formCheckboxList;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

// Todo: fix empty throw exception issue
angular.module('angular.form.controls.tags', [])
.directive('formTags', ['angularFormConfig', '$timeout', function (angularFormConfig, $timeout) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formTags;
        },
        replace: false,
        transclude: false,
        link: function ($scope, $element, $attrs) {
            var ctrl = $scope.$parent.ctrl,
                tagsinput = $element.find('select');

            $scope.init = false;

            tagsinput.on('itemAdded', function (event) {
                if ($scope.init) {
                    $scope.controlSetTouched();
                    $scope.$apply();
                }
            });

            tagsinput.on('itemRemoved', function (event) {
                if ($scope.init) {
                    $scope.controlSetTouched();
                    $scope.$apply();
                }
            });

            $timeout(function () {
                $scope.init = true;
            });
        }
    };
}]);

angular.module('angular.form.controls.date-picker', [])
.directive('formDatePicker', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formDatePicker;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.time-picker', [])
.directive('formTimePicker', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formTimePicker;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.datetime-picker', [])
.directive('formDatetimePicker', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formDatetimePicker;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) {
            $scope.controlDatetimeOptions = {
                dropdownSelector: '#dropdown2',
                startView: 'year',
                minView: 'day',
            }
        }
    };
}]);

angular.module('angular.form.controls.date-range', [])
.directive('formDateRange', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formDateRange;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.auto-complete', [])
.directive('formAutoComplete', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formAutoComplete;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.tree-view', [])
.directive('formTreeView', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formTreeView;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) {
            if (!$.jstree) { return; }

            angular.forEach($scope.controlGeneralOptions.options, function (option) {
                option.state = {
                    opened: true,
                    selected: $scope.ctrl.ngModel[$scope.controlName] &&
                        $scope.ctrl.ngModel[$scope.controlName].indexOf(option.id) > -1
                };
            });

            $element.find('.tree-view').jstree({
                plugins: ['checkbox', 'types'],
                core: {
                    themes: { responsive: false },
                    dblclick_toggle: false,
                    data: $scope.controlGeneralOptions.options
                },
                checkbox: {
                    three_state: false,
                    keep_selected_style: false,
                    cascade: '',
                },
                types: {
                    'default': { 'icon': 'fa fa-folder icon-state-warning icon-lg' },
                    'file': { 'icon': 'fa fa-file icon-state-warning icon-lg' }
                }
            }).bind('select_node.jstree', function (e, data) {
                if (data.event) {
                    data.instance.select_node(data.node.parents);

                    $scope.ctrl.ngModel[$scope.controlName].push(data.node.id);
                    angular.forEach(data.node.parents, function (pid) {
                        pid !== '#' &&
                        $scope.ctrl.ngModel[$scope.controlName].indexOf(pid) === -1 &&
                        $scope.ctrl.ngModel[$scope.controlName].push(pid);
                    });

                    $scope.controlSetTouched();
                    $scope.$apply();
                }
            }).bind('deselect_node.jstree', function (e, data) {
                if (data.event) {
                    data.instance.deselect_node(data.node.children_d);

                    var removeIdxs = [];
                    angular.forEach($scope.ctrl.ngModel[$scope.controlName], function (id, index) {
                        if (data.selected.indexOf(id) === -1) {
                            removeIdxs.push(index);
                        }
                    });

                    for (var i = 0; i < removeIdxs.length; i++) {
                        $scope.ctrl.ngModel[$scope.controlName].splice(removeIdxs[i] - i, 1);
                    }

                    $scope.controlSetTouched();
                    $scope.$apply();
                }
            });

            // Todo: change this function
            $scope.$watch('ctrl.ngModel[controlName]', function (newValue) {
                if (newValue) {
                    $element.find('.tree-view').jstree(true).deselect_all();
                    $element.find('.tree-view').jstree(true).select_node(newValue);
                } else {
                    $scope.ctrl.ngModel[$scope.controlName] = [];
                }
            });
        }
    };
}]);

angular.module('angular.form.controls.rich-text', [])
.directive('formRichText', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formRichText;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.file-upload', [])
.directive('formFileUpload', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.formFileUpload;
        },
        replace: true,
        transclude: true,
        link: function ($scope, $element, $attrs) { }
    };
}]);

angular.module('angular.form.controls.file-upload-and-crop', [])
.directive('formFileUploadAndCrop', ['angularFormConfig', function (angularFormConfig) {
    return {
        require: '^formControl',
        restric: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || angularFormConfig.templateUrl.controlFileUploadAndCrop;
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
    'fwv/template/form/radio.html',
    'fwv/template/form/checkbox.html',
    'fwv/template/form/checkbox-list.html',
    'fwv/template/form/tags.html',
    'fwv/template/form/date-picker.html',
    'fwv/template/form/time-picker.html',
    'fwv/template/form/datetime-picker.html',
    'fwv/template/form/date-range.html',
    'fwv/template/form/auto-complete.html',
    'fwv/template/form/tree-view.html',
    'fwv/template/form/rich-text.html',
    'fwv/template/form/file-upload.html',
    'fwv/template/form/file-upload-and-crop.html',
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
        '<div class=\"form-group\" ng-class=\"ctrl.formValidation[controlName] | formGroupValidation\" ng-hide=\"controlHidden\">\n' +
        '   <label class=\"control-label\" ng-class=\"controlLabelClass\">{{ controlLabel }}</label>\n' +
        '   <div ng-class=\"controlClass\">\n' +
        '       <form-static ng-if=\"controlStatic\"></form-static>\n' +
        '       <form-input ng-if=\"controlInput\"></form-input>\n' +
        '       <form-input-group ng-if=\"controlInputGroup\"></form-input-group>\n' +
        '       <form-textarea ng-if=\"controlTextArea\"></form-textarea>\n' +
        '       <form-select ng-if=\"controlSelect\"></form-select>\n' +
        '       <form-mutiple-select ng-if=\"controlMutipleSelect\"></form-mutiple-select>\n' +
        '       <form-radio ng-if=\"controlRadio\"></form-radio>\n' +
        '       <form-checkbox ng-if=\"controlCheckbox\"></form-checkbox>\n' +
        '       <form-checkbox-list ng-if=\"controlCheckboxList\"></form-checkbox-list>\n' +
        '       <form-tree-view ng-if=\"controlTreeView\"></form-tree-view>\n' +
        '       <form-tags ng-if=\"controlTags\"></form-tags>\n' +
        '       <form-date-picker ng-if=\"controlDatePicker\"></form-date-picker>\n' +
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
        '   <div ng-if=\"controlGeneralOptions.before\" class=\"input-group-{{controlGeneralOptions.before.type}}\" ng-bind-html=\"controlGeneralOptions.before.html|formHtml\"></div>\n' +
        '    <input type=\"{{ controlInputType }}\" name=\"{{ controlName }}\" class=\"form-control\"\n' +
        '           ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '           placeholder=\"{{controlPlaceholder}}\"\n' +
        '           ng-disabled=\"controlDisabled\"\n' +
        '           ng-readonly=\"controlReadonly\"\n' +
        '           ng-required=\"controlRequired\"\n' +
        '           ng-pattern=\"controlPattern\"\n' +
        '           ng-minlength=\"controlMinlength\"\n' +
        '           ng-maxlength=\"controlMaxlength\" />\n' +
        '   <div ng-if=\"controlGeneralOptions.after\" class=\"input-group-{{controlGeneralOptions.after.type}}\" ng-bind-html=\"controlGeneralOptions.after.html|formHtml\"></div>\n' +
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
        '<select name=\"{{controlName}}\" class=\"form-control\" convert-to-number\n' +
        '        ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '        ng-disabled=\"controlDisabled\"\n' +
        '        ng-readonly=\"controlReadonly\"\n' +
        '        ng-required=\"controlRequired\"\n' +
        '        ng-pattern=\"controlPattern\">\n' +
        '   <option value=\"\" ng-if=\"controlPlaceholder\">{{controlPlaceholder}}</option>\n' +
        '   <option value=\"{{option.value}}\" ng-repeat=\"option in controlGeneralOptions.options\">{{option.key}}</option>\n' +
        '</select>\n' +
        '');
}]);

angular.module('fwv/template/form/mutiple-select.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/mutiple-select.html',
        '<select name=\"{{controlName}}\" class=\"form-control\" multiple convert-to-number\n' +
        '        ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '        ng-disabled=\"controlDisabled\"\n' +
        '        ng-readonly=\"controlReadonly\"\n' +
        '        ng-required=\"controlRequired\"\n' +
        '        ng-pattern=\"controlPattern\">\n' +
        '   <option value=\"{{option.value}}\" ng-repeat=\"option in controlGeneralOptions.options\">{{option.key}}</option>\n' +
        '</select>\n' +
        '');
}]);

angular.module('fwv/template/form/radio.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/radio.html',
        '<div ng-class=\"controlGeneralOptions.listClass\">\n' +
        '    <label ng-repeat=\"option in controlGeneralOptions.options\"' +
        '           ng-class=\"controlGeneralOptions.itemClass\">\n' +
        '       <input type=\"radio\" name=\"{{controlName}}_{{$index}}\"\n' +
        '              ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '              ng-disabled=\"controlDisabled\"\n' +
        '              ng-readonly=\"controlReadonly\"\n' +
        '              ng-change=\"controlSetTouched()\"\n' +
        '              ng-value=\"{{option.value}}\" /> {{option.key}}\n' +
        '    </label>\n' +
        '    <input type=\"{{ controlInputType }}\" name=\"{{ controlName }}\" class=\"hidden\"\n' +
        '           ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '           ng-required=\"controlRequired\"\n />\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/checkbox.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/checkbox.html',
        '<div>\n' +
        '    <label class=\"checkbox-inline\">\n' +
        '       <input type=\"checkbox\" name=\"{{ controlName }}\"\n' +
        '              ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '              ng-disabled=\"controlDisabled\"\n' +
        '              ng-readonly=\"controlReadonly\"\n /> {{controlCheckboxLabel}}\n' +
        '    </label>\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/checkbox-list.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/checkbox-list.html',
        '<div ng-class=\"controlGeneralOptions.listClass\">\n' +
        '    <label ng-repeat=\"option in controlGeneralOptions.options\"' +
        '           ng-class=\"controlGeneralOptions.itemClass\">\n' +
        '       <input type=\"checkbox\" name=\"{{controlName}}_{{$index}}\"\n' +
        '              checklist-model=\"ctrl.ngModel[controlName]\"\n' +
        '              checklist-value=\"option.value\"\n' +
        '              ng-disabled=\"controlDisabled\"\n' +
        '              ng-readonly=\"controlReadonly\"\n' +
        '              ng-change=\"controlSetTouched()\"/> {{option.key}}\n' +
        '    </label>\n' +
        '    <input type=\"{{ controlInputType }}\" name=\"{{ controlName }}\" class=\"hidden\"\n' +
        '           ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '           ng-required=\"controlRequired\"\n />\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/tags.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/tags.html',
        '<bootstrap-tagsinput name=\"{{controlName}}\" class=\"full-width\"\n' +
        '                     tagclass=\"{{controlTagClass}}\"\n' +
        '                     ng-model=\"ctrl.ngModel[controlName]\">\n' +
        '</bootstrap-tagsinput>\n' +
        '');
}]);

angular.module('fwv/template/form/date-picker.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/date-picker.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/time-picker.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/time-picker.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/datetime-picker.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/datetime-picker.html',
        '<div class=\"dropdown\">\n' +
        '    <a class=\"dropdown-toggle\" id=\"dropdown2\" role=\"button\" data-toggle=\"dropdown\" data-target=\"#\" href=\"#\">\n' +
        '        <div class=\"input-group\">\n' +
        '            <input type=\"text\" name=\"{{controlName}}\" class=\"form-control\"\n' +
        '                   ng-model=\"ctrl.ngModel[controlName]\">\n' +
        '            <span class=\"input-group-addon\">\n' +
        '                <i class=\"glyphicon glyphicon-calendar\"></i>\n' +
        '            </span>\n' +
        '        </div>\n' +
        '    </a>\n' +
        '    <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n' +
        '        <datetimepicker ng-model=\"ctrl.ngModel[controlName]\"\n' +
        '                        data-datetimepicker-config=\"controlDatetimeOptions\" /> \n' +
        '    </ul>\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/date-range.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/date-range.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/auto-complete.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/auto-complete.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/tree-view.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/tree-view.html',
        '<div class=\"margin-top-10\">\n' +
        '    <div class=\"tree-view\"></div>\n' +
        '    <input type=\"text\" name=\"{{controlName}}\" ng-model=\"ctrl.ngModel[controlName]\" class=\"hidden\" />\n' +
        '</div>\n' +
        '');
}]);

angular.module('fwv/template/form/rich-text.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/rich-text.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/file-upload.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/file-upload.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);

angular.module('fwv/template/form/file-upload-and-crop.html', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('fwv/template/form/file-upload-and-crop.html',
        '<p class=\"form-control-static\"> {{ ctrl.ngModel[controlName] }} </p>\n' +
        '');
}]);
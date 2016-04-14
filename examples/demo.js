'use strict';

// declare a dependency on the angular-form-with-validation
var app = angular.module('demo', [
    'angular-form-with-validation'
]);

app.controller('DemoCtrl', function ($scope) {
    $scope.disableValidation = true;
    $scope.formControlDisabled = false;
    $scope.formControlReadonly = false;
    $scope.controlDisabled = true;
    $scope.controlReadonly = true;

    $scope.formModel1 = {
        staticControl: 'email@example.com',
        disabled: 'Disabled',
        readonly: 'Readonly'
    };

    $scope.formModel2 = {
        static: 'static text',
        _untitled1: 'untitled1',
        disabled: 'Disabled',
        readonly: 'Readonly'
    };

    $scope.formModel3 = {
        static: 'static text',
        _untitled1: 'untitled1',
        disabled: 'Disabled',
        readonly: 'Readonly'
    };

    $scope.formOptions3 = {
        disableValidation: false,
        formControlClass: 'col-md-9',
        formControlLabelClass: 'col-md-3',
        formControlDisabled: false,
        formControlReadonly: false,
        formControls: [
            { controlType: 'static', controlName: 'static', controlLabel: 'Static Control' },
            { controlType: 'input', controlName: 'input', controlLabel: 'Input' },
            { controlType: 'input', controlName: 'inputRequired', controlLabel: 'Required', controlRequired: true },
            { controlType: 'input', controlName: 'inputMinlength', controlLabel: 'Min Length 6', controlRequired: true, controlMinlength: 6 },
            { controlType: 'input', controlName: 'inputMaxlength', controlLabel: 'Max Length 6', controlMaxlength: 6 },
            { controlType: 'input', controlName: 'inputPattern', controlLabel: 'Number only', controlPattern: /^\d+$/ },
            { controlType: 'input' },
            { controlType: 'input', controlName: 'blockHelp', controlLabel: 'Block Help', controlRequired: true, controlHelp: 'A block of help text.' },
            { controlType: 'input', controlName: 'withIcon', controlLabel: 'With Icon', controlRequired: true, controlIcon: 'right' },
            { controlType: 'input', controlName: 'withIconLeft', controlLabel: 'With Icon Left', controlRequired: true, controlIcon: 'left' },
            { controlType: 'input', controlName: 'password', controlLabel: 'Password', controlInputType: 'password' },
            { controlType: 'input', controlName: 'disabled', controlLabel: 'Disabled', controlDisabled: true },
            { controlType: 'input', controlName: 'readonly', controlLabel: 'Readonly', controlReadonly: true },
        ],
    };

    $scope.toggleFormControlDisabled = function () {
        $scope.formControlDisabled = !$scope.formControlDisabled;
        $scope.formOptions3.formControlDisabled = !$scope.formOptions3.formControlDisabled;
    };

    $scope.toggleFormControlReadonly = function () {
        $scope.formControlReadonly = !$scope.formControlReadonly;
        $scope.formOptions3.formControlReadonly = !$scope.formOptions3.formControlReadonly;
    };

    $scope.toggleControlDisabled = function () {
        $scope.controlDisabled = !$scope.controlDisabled;
        $scope.formOptions3.formControls[11].controlDisabled = !$scope.formOptions3.formControls[11].controlDisabled;
    };

    $scope.toggleControlReadonly = function () {
        $scope.controlReadonly = !$scope.controlReadonly;
        $scope.formOptions3.formControls[12].controlReadonly = !$scope.formOptions3.formControls[12].controlReadonly;
    };

    $scope.setFormFieldTouch = function (form) {
        angular.forEach(form, function (that) {
            if (angular.isObject(that) && angular.isFunction(that.$setTouched)) {
                that.$setTouched();
            }
        });
    };

    $scope.setFormPristine = function (form) {
        form.$setPristine();
        form.$setUntouched();
    };

    $scope.submit = function () {
        if ($scope.formOptions3.formValidation.$valid) {
            if ($scope.formOptions3.formValidation.$pristine) {
                alert('Form is pristine!');
            } else {
                $scope.formOptions3.formValidation.$setSubmitted();
                alert('Form is submitted!')
            }
        } else {
            $scope.setFormFieldTouch($scope.formOptions3.formValidation)
        }
    };

    $scope.reset = function () {
        $scope.setFormPristine($scope.formOptions2.formValidation);
    };
});
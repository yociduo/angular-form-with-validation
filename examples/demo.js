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

    $scope.formModel = {
        staticControl: 'email@example.com',
        disabled: 'Disabled',
        readonly: 'Readonly',
        select: 1,
        mutipleSelect: [1, 2, 3],
        radio: 1,
    };

    $scope.groupOptions = {
        before: {
            type: 'addon',
            html: '<i class=\"glyphicon glyphicon-user\"></i>'
        },
        after: {
            type: 'btn',
            html: '<button type=\"button\" class=\"btn btn-default\">Action</button>'
        }
    };

    $scope.selectOptions = {
        options: [
            { key: 'Please Select...', value: 0 },
            { key: 'Options 1', value: 1 },
            { key: 'Options 2', value: 2 },
            { key: 'Options 3', value: 3 },
            { key: 'Options 4', value: 4 },
            { key: 'Options 5', value: 5 },
        ],
        ngOptions: 'option.value*1 as option.key for option in controlSelectOptions.options',
    };

    $scope.radioOptions = {
        options: [
            { key: 'Options 1', value: 1 },
            { key: 'Options 2', value: 2 },
            { key: 'Options 3', value: 3 },
        ],
        listClass: '',
        itemClass: 'checkbox-inline'
    };

    $scope.toggleFormControlDisabled = function () {
        $scope.formControlDisabled = !$scope.formControlDisabled;
    };

    $scope.toggleFormControlReadonly = function () {
        $scope.formControlReadonly = !$scope.formControlReadonly;
    };

    $scope.toggleControlDisabled = function () {
        $scope.controlDisabled = !$scope.controlDisabled;
    };

    $scope.toggleControlReadonly = function () {
        $scope.controlReadonly = !$scope.controlReadonly;
    };
});
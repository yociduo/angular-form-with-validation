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
        select: null,
        mutipleSelect: [1, 2, 3],
        radio: 1,
        checkbox: true,
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
            { key: 'Options 1', value: 1 },
            { key: 'Options 2', value: 2 },
            { key: 'Options 3', value: 3 },
            { key: 'Options 4', value: 4 },
            { key: 'Options 5', value: 5 },
        ]
    };

    $scope.radioOptions = {
        options: [
            { key: 'Options 1', value: 1 },
            { key: 'Options 2', value: 2 },
            { key: 'Options 3', value: 3 },
        ],
        listClass: '',
        itemClass: 'radio-inline'
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
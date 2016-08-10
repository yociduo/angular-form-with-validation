'use strict';

// declare a dependency on the angular-form-with-validation
var app = angular.module('demo', [
    'angular-form-with-validation',
    'checklist-model',
    'bootstrap-tagsinput',
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
        checkboxes: [1, 2],
        treeView: [1, 2],
        tags: ['Tag1', 'Tag2'],
        datePicker: '2016-08-09T00:00:00.000',
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

    $scope.checkboxOptions = {
        options: [
            { key: 'Options 1', value: 1 },
            { key: 'Options 2', value: 2 },
            { key: 'Options 3', value: 3 },
        ],
        listClass: '',
        itemClass: 'checkbox-inline'
    };

    $scope.treeViewOptions = {
        options: [
            { id: 1, parent: '#', text: 'root 1' },
            { id: 2, parent: '#', text: 'root 2' },
            { id: 3, parent: 1, text: 'child 1' },
            { id: 4, parent: 1, text: 'child 2' },
            { id: 5, parent: 2, text: 'child 3' },
            { id: 6, parent: 2, text: 'child 4' },
        ]
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
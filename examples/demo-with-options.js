'use strict';

// declare a dependency on the angular-form-with-validation
var app = angular.module('demo', [
    'angular-form-with-validation',
    'checklist-model',
    'bootstrap-tagsinput'
]);

app.controller('DemoWithOptionsCtrl', function ($scope) {
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
        tagsInput: ['Tag1', 'Tag2']
    };

    $scope.formOptions = {
        disableValidation: false,
        formControlDisabled: false,
        formControlReadonly: false,
        formControlClass: 'col-md-6',
        formControlLabelClass: 'col-md-3',
        formControls: [
            { controlType: 'hidden-key', controlName: 'hidden' },
            { controlType: 'static', controlName: 'staticControl', controlLabel: 'Static Control' },
            { controlType: 'input', controlName: 'input', controlLabel: 'Input', controlPlaceholder: 'placeholder...' },
            { controlType: 'password', controlName: 'password', controlLabel: 'Password', controlPlaceholder: 'password...' },
            { controlType: 'input', controlName: 'disabled', controlLabel: 'Disabled', controlDisabled: true },
            { controlType: 'input', controlName: 'readonly', controlLabel: 'Readonly', controlReadonly: false },
            {
                controlType: 'input-group', controlName: 'inputGroup', controlLabel: 'Input Group', controlGeneralOptions: {
                    before: { type: 'addon', html: '<i class=\"glyphicon glyphicon-user\"></i>' },
                    after: { type: 'btn', html: '<button type=\"button\" class=\"btn btn-default\">Action</button>' }
                }
            },
            { controlType: 'textarea', controlName: 'textarea', controlLabel: 'Textarea', controlRows: 6 },
            {
                controlType: 'select', controlName: 'select', controlLabel: 'Select', controlPlaceholder: 'Please select...', controlGeneralOptions: {
                    options: [
                        { key: 'Options 1', value: 1 },
                        { key: 'Options 2', value: 2 },
                        { key: 'Options 3', value: 3 },
                        { key: 'Options 4', value: 4 },
                        { key: 'Options 5', value: 5 },
                    ]
                }
            },
            {
                controlType: 'mutiple-select', controlName: 'mutipleSelect', controlLabel: 'Mutiple Select', controlGeneralOptions: {
                    options: [
                        { key: 'Options 1', value: 1 },
                        { key: 'Options 2', value: 2 },
                        { key: 'Options 3', value: 3 },
                        { key: 'Options 4', value: 4 },
                        { key: 'Options 5', value: 5 },
                    ]
                }
            },
            {
                controlType: 'radio', controlName: 'radio', controlLabel: 'Radios', controlGeneralOptions: {
                    options: [
                        { key: 'Options 1', value: 1 },
                        { key: 'Options 2', value: 2 },
                        { key: 'Options 3', value: 3 },
                    ],
                    listClass: '',
                    itemClass: 'radio-inline'
                }
            },
            { controlType: 'checkbox', controlName: 'checkbox', controlLabel: 'Checkbox', controlCheckLabel: 'Test Options' },
            {
                controlType: 'checkbox-list', controlName: 'checkboxes', controlLabel: 'Checkbox List', controlGeneralOptions: {
                    options: [
                        { key: 'Options 1', value: 1 },
                        { key: 'Options 2', value: 2 },
                        { key: 'Options 3', value: 3 },
                    ],
                    listClass: '',
                    itemClass: 'checkbox-inline'
                }
            },
            {
                controlType: 'tree-view', controlName: 'treeView', controlLabel: 'Tree View', controlGeneralOptions: {
                    options: [
                        { id: 1, parent: '#', text: 'root 1' },
                        { id: 2, parent: '#', text: 'root 2' },
                        { id: 3, parent: 1, text: 'child 1' },
                        { id: 4, parent: 1, text: 'child 2' },
                        { id: 5, parent: 2, text: 'child 3' },
                        { id: 6, parent: 2, text: 'child 4' },
                    ]
                }
            },
            { controlType: 'tags-input', controlName: 'tagsInput', controlLabel: 'Tags Input' }
        ]
    };

    $scope.toggleFormControlDisabled = function () {
        $scope.formOptions.formControlDisabled = !$scope.formOptions.formControlDisabled;
    };

    $scope.toggleFormControlReadonly = function () {
        $scope.formOptions.formControlReadonly = !$scope.formOptions.formControlReadonly;
    };

    $scope.toggleControlDisabled = function () {
        $scope.formControls[2].controlDisabled = !$scope.formControls[2].controlDisabled;
    };

    $scope.toggleControlReadonly = function () {
        $scope.formControls[3].controlReadonly = !$scope.formControls[2].controlReadonly;
    };
});
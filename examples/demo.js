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
        readonly: 'Readonly'
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
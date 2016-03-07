'use strict';

var app = angular.module('demo', [
    'angular-form-with-validation'
]);

app.controller('DemoCtrl', function ($scope) {
    $scope.formModel = {
        test: '1000',
        untitled1: 'untitled1',
        untitled2: 'untitled2',
        untitled3: 'untitled3'
    };
    $scope.formValidation = new Object;
});
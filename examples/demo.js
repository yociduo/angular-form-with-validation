﻿'use strict';

// declare a dependency on the angular-form-with-validation
var app = angular.module('demo', [
    'angular-form-with-validation'
]);

app.controller('DemoCtrl', function ($scope) {
    $scope.formModel1 = {
        input: 'input1',
        untitled1: 'untitled1',
        untitled2: 'untitled2',
        untitled3: 'untitled3'
    };

    $scope.formModel2 = {
        static: 'static text',
        untitled1: 'untitled1',
        untitled2: 'untitled2',
        untitled3: 'untitled3'
    };

    $scope.formOptions2 = {
        validateForm: true
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
        if ($scope.formOptions2.formValidation.$valid) {
            if ($scope.formOptions2.formValidation.$pristine) {
                alert('Form is pristine!');
            } else {
                $scope.formOptions2.formValidation.$setSubmitted();
                alert('Form is submitted!')
            }
        } else {
            $scope.setFormFieldTouch($scope.formOptions2.formValidation)
        }
    };

    $scope.reset = function () {
        $scope.setFormPristine($scope.formOptions2.formValidation);
    };
});
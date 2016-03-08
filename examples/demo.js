'use strict';

var app = angular.module('demo', [
    'angular-form-with-validation'
]);

app.controller('DemoCtrl', function ($scope) {
    $scope.formModel = {
        static: 'static text',
        untitled1: 'untitled1',
        untitled2: 'untitled2',
        untitled3: 'untitled3'
    };

    $scope.formValidation = new Object;

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
        if ($scope.formValidation.$valid) {
            if ($scope.formValidation.$pristine) {
                alert('Form is pristine!');
            } else {
                $scope.formValidation.$setSubmitted();
                alert('Form is submitted!')
            }
        } else {
            $scope.setFormFieldTouch($scope.formValidation)
        }
    };

    $scope.reset = function () {
        $scope.setFormPristine($scope.formValidation);
    };
});
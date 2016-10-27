'use strict';

var app = angular.module('Eventugram');

app.controller('NotificationController', ['$scope', '$location', 'ProfileService', 'NotificationService', function ($scope, $location, ProfileService, NotificationService) {
    ProfileService.getUserProfile()
        .then(function (response) {
            $scope.notifications = response.notifications;
        });

    $scope.sawNotification = function (id) {
        NotificationService.markAsSeen(id);
    };

    $scope.viewPost = function (id) {
        $location.path('/singlePost/' + id);
    }
}]);
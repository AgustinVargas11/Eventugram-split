'use strict';

var app = angular.module('Eventugram');

app.controller('BottomSheetController', ['$scope', '$mdBottomSheet', '$location', 'DialogService', 'ProfileService', 'UserService', 'NotificationService', function ($scope, $mdBottomSheet, $location, DialogService, ProfileService, UserService, NotificationService) {

    function createNotificationCondition(type) {
        var notifications = $scope.user.notifications;
        var firstMessage = notifications[0];
        if (notifications.length)
            return !firstMessage.seen && firstMessage.type === type && firstMessage.user !== UserService.getUserId();
    }
    ProfileService.getUserProfile()
        .then(function (response) {
            $scope.user = response;
        })
        .then(function () {
            $scope.items = [
                {
                    name: 'inbox',
                    icon: 'inbox',
                    use: function () {
                        $location.path('/messages');
                        var notifications = $scope.user.notifications;
                        var firstMessage = notifications[0];

                        if (notifications.length)
                            NotificationService.markAsSeen(firstMessage._id);
                        $mdBottomSheet.hide();
                    },
                    notificationCondition: function () {
                        return createNotificationCondition('message');
                    }
                },
                {
                    name: 'add post',
                    icon: 'add_a_photo',
                    use: function (ev) {
                        DialogService.newPost(ev);
                        $mdBottomSheet.hide();
                    }
                },
                {
                    name: 'notifications',
                    icon: 'notifications',
                    use: function () {
                        $location.path('/notifications');
                        $mdBottomSheet.hide();
                    },
                    notificationCondition: function () {
                        return createNotificationCondition('like');
                    }
                }
            ];
        }).catch(function(e) {console.log(e)});
}]);
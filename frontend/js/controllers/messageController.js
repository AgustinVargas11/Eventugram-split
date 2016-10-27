'use strict';

var app = angular.module('Eventugram');

app.controller('MessageController', ['$scope', '$location', 'MessageService', 'ProfileService', 'UserService', function ($scope, $location, MessageService, ProfileService, UserService) {

    function getProfileInfo() {
        ProfileService.getFollowing()
            .then(function (response) {
                // make an array of all followers
                $scope.allUsers = response.following.map(function (a) {
                    return a;
                });
            });
    }

    function getConversations() {
        MessageService.getConversations()
            .then(function (response) {
                $scope.conversations = response;
            })
    }

    $scope.whoIsRecipient = function (conversation) {
        var user1 = conversation.users[0];
        var user2 = conversation.users[1];

        conversation.recipient = (user1._id === UserService.getUserId()) ? user2 : user1;
        conversation.user = (user1._id === UserService.getUserId()) ? user1 : user2;
    };

    if ($location.path() === '/messages')
        getConversations();

    if ($location.path() === '/newmessage')
        getProfileInfo();

    $scope.messageObj = {};

    $scope.recipientSearch = function () {
        return $scope.allUsers;
    };

    // toggle new message input and select a recipient to send to
    $scope.selectUser = function (recipient) {
        $scope.newMessage = !$scope.newMessage;
        $scope.recipient = recipient;
    };

    $scope.sendMessage = function (userId) {
        $scope.messageObj.message.recipient = userId;

        MessageService.sendNewMessage($scope.messageObj)
            .then(function (response) {
                $location.path('/conversation/' + response._id);
                getConversations();
            });
    };

    $scope.viewConversation = function (id) {
        $location.path('/conversation/' + id)
    }
}]);
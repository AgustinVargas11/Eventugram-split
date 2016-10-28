'use strict';

var app = angular.module('Eventugram');

app.controller('ConversationController', ['$scope', '$routeParams', '$timeout', '$location', '$anchorScroll', 'MessageService', 'UserService', 'io', function ($scope, $routeParams, $timeout, $location, $anchorScroll, MessageService, UserService, io) {

    var user = UserService.getUserId();
    // scroll to the bottom of the chatbox
    function scrollToBottom() {
        $location.hash('last');
        $anchorScroll();
    }

    // mark message as read and give feedback to user
    $scope.markAsRead = function (message) {
        if (user === message.message.recipient._id)
            MessageService.markAsRead(message._id)
                .then(function (response) {
                    $scope.read = true;
                }).catch(function (e) {
                console.log(e)
            });
    };

    $timeout(scrollToBottom, 250);

    // determine if the person viewing the message is the one who started the conversation or the recipient
    MessageService.getOneConversation($routeParams.id)
        .then(function (response) {
            var conversation = $scope.conversation = response;
            var user1 = conversation.users[0];
            var user2 = conversation.users[1];

            $scope.recipient = (user1._id === user) ? user2 : user1;
            $scope.user = (user1._id === user) ? user1 : user2;
        })
        .then(function () {
            io.connect();
            io.joinPrivateChat($scope.conversation._id);
            io.listen($scope.addMessage);
        }).catch(function (e) {
        console.log(e)
    });

    $scope.sendNewMessage = function (userId, convoId) {
        $scope.messageObj.message.recipient = userId;
        $scope.messageObj.message.user = $scope.user;
        var message = angular.copy($scope.messageObj);

        io.sendChatMessage(message, convoId);
        newMessageForm.reset();
        delete message.message.user.profileImageRaw;
        MessageService.sendNewMessage(message);
    };

    $scope.addMessage = function (message) {
        $scope.conversation.messages.push(message);
        $scope.markAsRead(message);
        $timeout(scrollToBottom, 250);
        $scope.$apply();
    };
}]);
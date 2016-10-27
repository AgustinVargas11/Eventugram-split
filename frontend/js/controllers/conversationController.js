'use strict';

var app = angular.module('Eventugram');

app.controller('ConversationController', ['$scope', '$routeParams', '$timeout', 'MessageService', 'UserService', 'io', function ($scope, $routeParams, $timeout, MessageService, UserService, io) {

    // scroll to the bottom of the chatbox
    function scrollToBottom() {
        var chatBox = document.getElementById('chatBox');
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // mark message as read and give feedback to user
    $scope.markAsRead = function (message) {
        if (UserService.getUserId() === message.message.recipient._id)
            MessageService.markAsRead(message._id)
                .then(function (response) {
                    $scope.read = true;
                });
    };

    $timeout(scrollToBottom, 120);

    // determine if the person viewing the message is the one who started the conversation or the recipient
    MessageService.getOneConversation($routeParams.id)
        .then(function (response) {
            var conversation = $scope.conversation = response;
            var user1 = conversation.users[0];
            var user2 = conversation.users[1];

            $scope.recipient = (user1._id === UserService.getUserId()) ? user2 : user1;
            $scope.user = (user1._id === UserService.getUserId()) ? user1 : user2;
        })
        .then(function () {
            io.connect();
            io.joinPrivateChat($scope.conversation._id);
            io.listen($scope.addMessage);
        });

    $scope.sendNewMessage = function (userId, convoId) {
        $scope.messageObj.message.recipient = userId;
        $scope.messageObj.message.user = $scope.user;
        var message = angular.copy($scope.messageObj);

        io.sendChatMessage(message, convoId);
        newMessageForm.reset();
        delete $scope.messageObj.message.user.profileImageRaw;
        MessageService.sendNewMessage($scope.messageObj);
    };

    $scope.addMessage = function (message) {
        $scope.conversation.messages.push(message);
        $scope.markAsRead(message);
        scrollToBottom();
        $scope.$apply();
    };
}]);
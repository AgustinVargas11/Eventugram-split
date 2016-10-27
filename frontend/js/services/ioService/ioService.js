'use strict';

var app = angular.module('Eventugram');

app.service('io', function () {
    var socket = null;

    this.connect = function () {
        socket = io('/');
    };

    this.sendChatMessage = function (message, id) {
        socket.emit('newMessage', message, id);
    };

    this.listen = function (callBack) {
        socket.on('incomingMessage', function (data) {
            callBack(data);
        })
    };

    this.joinPrivateChat = function(conversationId) {
        console.log(conversationId)
        socket.emit('privateChat', {chat: conversationId})
    }
});
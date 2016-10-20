'use strict';

var app = angular.module('Eventugram');

app.service('MessageService', ['$http', function ($http) {

    this.sendNewMessage = function(message) {
        return $http.post('/api/message/', message)
            .then(function(response) {
                console.log(response);
                return response.data;
            })
    };

    this.getOneConversation = function(id) {
        return $http.get('/api/message/conversations/' + id)
            .then(function(response) {
                console.log(response);
                return response.data;
            })
    };

    this.getConversations = function() {
        return $http.get('/api/message/conversations')
            .then(function(response) {
                console.log(response);
                return response.data;
            })
    };
}]);
'use strict';

var app = angular.module('Eventugram');

app.service('MessageService', ['$http', function ($http) {

    this.sendNewMessage = function (message) {
        return $http.post('/api/message/', message)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)})
    };

    this.getOneConversation = function (id) {
        return $http.get('/api/message/conversations/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)})
    };

    this.getConversations = function () {
        return $http.get('/api/message/conversations')
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)})
    };

    this.markAsRead = function (id) {
        return $http.put('/api/message/markasread/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)});
    };
}]);
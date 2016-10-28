'use strict';

var app = angular.module('Eventugram');

app.service('PostService', ['$http', function ($http) {
    this.getFollowingPosts = function () {
        return $http.get('/api/post/')
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)})
    };

    this.getOnePost = function (id) {
        return $http.get('/api/post/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)});
    };

    this.addComment = function (comment, id) {
        return $http.put('/api/post/' + id + '/comment', comment)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)});
    };

    this.toggleLike = function (id) {
        return $http.put('/api/post/' + id + '/like/').catch(function(e) {console.log(e)});
    };

    this.deletePost = function (id) {
        return $http.delete('/api/post/delete/' + id)
            .then(function (response) {
                return response.data;
            }).catch(function(e) {console.log(e)})
    };

    this.deleteComment = function (postId, commentId) {
        return $http.delete('/api/post/' + postId + '/comment/' + commentId).catch(function(e) {console.log(e)})
    }
}]);
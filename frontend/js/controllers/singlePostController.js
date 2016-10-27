'use strict';

var app = angular.module('Eventugram');

app.controller('SinglePostController', ['$scope', '$routeParams', '$timeout', '$location', 'PostService', 'UserService', function ($scope, $routeParams, $timeout, $location, PostService, UserService) {

    var userId = UserService.getUserId();

    (function () {
        PostService.getOnePost($routeParams.postId)
            .then(function (response) {
                $scope.post = response;
                $scope.didUserLike = function (likes) {
                    if (likes.indexOf(userId) >= 0)
                        return true;
                    else
                        return false;
                };

            })
    }());

    // hide large heart
    function hideHeart(post) {
        return post.doubleClick = false;
    }

    $scope.addComment = function (post, id) {
        PostService.addComment(post.newComment, id)
            .then(function (response) {
                if (response) {
                    var comment = {
                        user: {username: UserService.getUsername()},
                        comment: response
                    };
                    $scope.post.comments.push(comment);
                }
            });
        post.newComment = '';
    };

    $scope.likePost = function (post, id) {
        PostService.toggleLike(id);

        var liked = $scope.didUserLike(post.likes);
        var like = userId;
        if (!liked) {
            post.likes.push(like);
            post.doubleClick = true;
            $timeout(hideHeart, 1900, true, post);
        } else {
            $timeout.cancel(hideHeart);
            post.likes.splice(post.likes.indexOf(like), 1);
        }
    };

    $scope.options = [
        {
            name: 'delete',
            use: function (id) {
                PostService.deletePost(id)
                    .then(function (response) {
                        if (response)
                            $location.path('/main')
                    })
            }
        }
    ];
}]);
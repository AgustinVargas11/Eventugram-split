'use strict';

var app = angular.module('Eventugram');

app.controller('MainController', ['$scope', '$rootScope', '$mdBottomSheet', '$timeout', 'PostService', 'UserService', function ($scope, $rootScope, $mdBottomSheet, $timeout, PostService, UserService) {

    var userId = UserService.getUserId();

    $scope.showGridBottomSheet = function () {
        $mdBottomSheet.show({
            templateUrl: '/js/controllers/bottomSheetController/bottomSheet.html',
            controller: 'BottomSheetController',
            clickOutsideToClose: true
        });
    };

    function getPosts() {
        PostService.getFollowingPosts()
            .then(function (response) {
                $scope.posts = response;
                console.log(response)
            });
    }

    // hide large heart
    function hideHeart(post) {
        return post.doubleClick = false;
    }

    getPosts();
    // wait for refresh to be emitted then run callback
    $rootScope.$on('refresh', getPosts);

    $scope.addComment = function (post, id, index) {
        PostService.addComment(post.newComment, id)
            .then(function (response) {
                if (response) {
                    var comment = {
                        user: {
                            username: UserService.getUsername()
                        },
                        comment: response
                    };
                    $scope.posts[index].comments.push(comment);
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

    $scope.didUserLike = function (likes) {
        var user = UserService.getUserId();
        return (likes.indexOf(user) >= 0);
    };

    $scope.options = [
        {
            name: 'delete',
            use: function (id, index) {
                var deletedPost = $scope.posts.splice(index, 1);
                PostService.deletePost(id)
                    .then(function (response) {
                        if (response.statusText === 500)
                            $scope.posts.splice(index, 0, deletedPost);
                    });
            }
        }
    ];

}]);

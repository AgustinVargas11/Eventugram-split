'use strict';

var app = angular.module('Eventugram');

app.controller('MainController', ['$scope', '$rootScope', '$mdBottomSheet', '$timeout', 'PostService', 'UserService', function ($scope, $rootScope, $mdBottomSheet, $timeout, PostService, UserService) {

    var userId = $scope.userId = UserService.getUserId();

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
                        _id: response._id,
                        comment: response.comment,
                        user: {
                            _id: response.user,
                            username: UserService.getUsername()
                        }
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
        if (!likes)
            return;
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
                        if (response.status !== 200)
                            $scope.posts.splice(index, 0, deletedPost);
                    });
            }
        }
    ];

    $scope.deleteComment = function (postId, commentId, postIndex, commentIndex, limited) {
        // when ng-repeat is limited to some number a new array containing only the wanted amount
        // is made, so indexes do not match up with the original array
        // console.log(postIndex);
        if (limited)
            // commentIndex = $scope.posts[postIndex].comments.length - commentIndex;

        console.log(commentIndex)

        var deletedComment = $scope.posts[postIndex].comments.splice(commentIndex, 1);

        PostService.deleteComment(postId, commentId)
            .then(function (response) {
                // if (response.status !== 200)
                //     $scope.posts[postIndex].comments.splice(commentIndex, 0, deletedComment);
            });
    };
}]);

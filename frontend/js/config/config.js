'use strict';

var app = angular.module('Eventugram');

app.config(function ($routeProvider) {
    $routeProvider
        .when("/login", {
            templateUrl: "./templates/login.html",
            controller: "LoginController"
        })
        .when("/", {
            templateUrl: "./templates/signup.html",
            controller: "SignupController",
            resolve: {
                check: function ($location, UserService) {
                    if (UserService.isLoggedIn()) {
                        $location.path('/main');
                    }
                }
            }
        })
        .when("/main", {
            templateUrl: "./templates/main.html",
            controller: "MainController",
            resolve: {
                check: function ($location, UserService) {
                    if (!UserService.isLoggedIn()) {
                        $location.path('/');
                    }
                }
            }
        })
        .when("/profile", {
            templateUrl: "./templates/profile.html",
            controller: "ProfileController"
        })
        .when("/profile/edit", {
            templateUrl: "./templates/editProfile.html",
            controller: "ProfileController"
        })
        .when("/friends", {
            templateUrl: "./templates/friends.html",
            controller: "FriendsController"
        })
        .when("/user/:userId", {
            templateUrl: "./templates/friendProfile.html",
            controller: "UserProfileController"
        })
        .when("/singlePost/:postId", {
            templateUrl: "./templates/singlePost.html",
            controller: "SinglePostController"
        })
        .when("/messages", {
            templateUrl: "./templates/messages.html",
            controller: "MessageController"
        })
        .when("/newmessage", {
            templateUrl: "./templates/newMessage.html",
            controller: "MessageController"
        })
        .when("/conversation/:id", {
            templateUrl: "./templates/conversation.html",
            controller: "ConversationController"
        })
        .when("/notifications", {
            templateUrl: "./templates/notifications.html",
            controller: "NotificationController"
        })
        .otherwise("/");
});

app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '800',
            'hue-1': '600',
            'hue-2': '400',
            'hue-3': 'A100'
        })
        .accentPalette('teal', {
            'default': '400',
            'hue-1': '600',
            'hue-2': '300'
        });
}]);

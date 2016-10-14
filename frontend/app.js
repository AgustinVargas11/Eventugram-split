'use strict';

var app = angular.module('Eventugram', ["ngRoute", "ngMaterial"]);

app.config(function($routeProvider){
    $routeProvider
    .when("/login", {
        templateUrl: "./login/login.html",
        controller: "LoginController"
    })
    .otherwise("/signup", {
        templateUrl: "./signup/signup.html",
        controller: "SignupController"
    });
})
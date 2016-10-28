angular.module("Eventugram.auth")

    .service("UserService", ["$http", "TokenService", "$location", function ($http, TokenService, $location) {
        var self = this;

        this.signup = function (userObj) {
            return $http.post("/auth/signup", userObj).then(function (response) {
                if (response.data._id && response.data.username === userObj.username.toLowerCase()) {
                    $location.path("/login");
                } else {
                    return response.data;
                }
            }).catch(function(e) {console.log(e)})
        };

        this.getUsername = function() {
            return localStorage['username'];
        };

        this.getUserId = function() {
            return localStorage['loggedInUserId'];
        };

        this.signin = function (userObj) {
            return $http.post("/auth/login", userObj).then(function (response) {
                if (response) {
                    if (response.data.token) {
                        TokenService.saveToken(response.data.token);
                        localStorage['loggedInUserId'] = response.data.user._id;
                        localStorage['username'] = response.data.user.username;
                        $location.path("/main");
                    } else {
                        return response.data;
                    }
                }
            }).catch(function(e) {console.log(e)});
        };

        this.logout = function () {
            TokenService.removeToken();
            localStorage.removeItem('loggedInUserId');
            localStorage.removeItem('username');
            $location.path('/');
        };

        this.isLoggedIn = function () {
            return !!TokenService.getToken();
        };
    }]);
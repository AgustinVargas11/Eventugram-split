angular.module("Eventugram.auth")

    .factory("AuthInterceptor", ['$location', '$q', 'TokenService' ,function ($location, $q, TokenService) {
        return {
            request: function (config) {
                var token = TokenService.getToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = "Bearer " + token;
                }
                return config;
            },
            responseError: function (response) {
                console.log(response)
                if (response.status === 401) {
                    TokenService.removeToken();
                    $location.path('/');
                    return response;
                }
                $q.reject(response);
            }
        };
    }]);
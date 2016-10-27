'use strict';

var app = angular.module('Eventugram');

app.service('DialogService', ['$mdDialog', 'Upload', function ($mdDialog) {

    var self = this;
    this.changeProfileImage = function (ev, imageUrl) {
        var template = '/js/services/dialogService/dialogTemplates/changeProfilePicture.html';
        self.data = imageUrl;
        self.url = '/api/user/userprofile/profileimage';

        return $mdDialog.show({
            controller: DialogController,
            templateUrl: template,
            parent: angular.element(profile),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false
        }).then(function(response) {
            return {success: true};
        });
    };

    this.newPost = function (ev) {
        var template = '/js/services/dialogService/dialogTemplates/newpost.html';
        self.url = '/api/post/';
        return $mdDialog.show({
            controller: DialogController,
            templateUrl: template,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false
        });
    };

    function DialogController($scope, $mdDialog, Upload) {

        $scope.uploadImage = function (file) {
            var data = {};
            if ($scope.newPost) {
                data.caption = $scope.newPost.caption;
            }
            data.file = file;

            Upload.upload({
                url: self.url,
                data: data
            }).then(function (response) {
                console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
            }, function (response) {
                console.log('Error status: ' + response.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.closeDialog();
                $scope.$emit('refresh');
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.imageUrl = self.data;
        $scope.closeDialog = function () {
            $mdDialog.hide();
        }
    }
}]);

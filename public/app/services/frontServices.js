angular.module('frontServices', [])

//send an http request from service	to store article on mongod
.factory('frontService', function ($http) {
    var service = {};

    service.getSlides = function (articleurl) {

        return $http.get('/api/article/' + articleurl);
    }
    return service;
});
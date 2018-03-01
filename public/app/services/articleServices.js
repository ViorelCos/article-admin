angular.module('articleServices', [])

//send an http request from service	to store article on mongod
.factory('articleService', function ($http) {
    var service = {};

    service.storeArticle = function (article) {
        return $http.post('/api/createarticle', article)
    }

    service.deleteArticle = function (article) {
        return $http.post('/api/deletearticle', article)
    }

    service.getArticles = function () {
        return $http.post('/api/getarticles')
    }
    return service;
});
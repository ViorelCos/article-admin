angular.module('slideServices', [])

//send an http request from service	to store article on mongod
.factory('slideService', function ($http) {
    var service = {};

    service.storeSlide = function (ArticleID, slide) {
        var data = {
            ArticleID: ArticleID,
            slide : slide
        }
        console.log(data);
        return $http.post('/api/createslide', data)
    }

    service.deleteSlide = function (ArticleID, slide) {
        var data = {
            ArticleID: ArticleID,
            slide : slide
        }
        return $http.post('/api/deleteslide', data)
    }

    service.getSlides = function (ArticleID) {
        var data = { 
            ArticleID: ArticleID 
        };
        return $http.post('/api/getslide', data)
    }
    return service;
});
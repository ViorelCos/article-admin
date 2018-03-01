angular.module('awsServices', [])

// Factor: Files handles image uoload/download functions
// Get all the file info you need and send an http request from service	
.factory('imagesService', function ($http) {
    var service = {};

    service.storeImage = function (imageData, fileName) {
      var imageExtension = imageData.split(';')[0].split('/');
      imageExtension = imageExtension[imageExtension.length - 1];

      var newImage = {
        imageName: fileName,
        imageBody: imageData,
        imageExtension: imageExtension,
        bucketName: 'giftspire'
      }
      console.log("response reach awsServcie");
      return $http.post('/api/uploadfile', newImage)
    }

    service.getImage = function (fileName) {
      
      var newImage = {
        bucketName: 'giftspire'
      }
      
      return $http.post('/api/getobject').then(function(err, data){
        if(err) console.log(err);
        else console.log(data);
      });

    }

    service.deleteImage = function (article) {
      
      var Image = {
        bucketName: 'giftspire',
        item: article
      }
      
      return $http.post('/api/deleteobjects', Image);
    }

    return service;
});
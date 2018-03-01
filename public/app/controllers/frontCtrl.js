angular.module('frontController', ['awsServices', 'frontServices'])

// Controller: frontCtrl is used to manage Front-end
.controller('frontCtrl', function($scope, $routeParams, imagesService, frontService) {
    app = this;

    app.draft = true;
    // get slides from database
    frontService.getSlides($routeParams.articleurl).then(function(data){
        if (data.data.success) {
            app.draft = data.data.data.draft;
            app.slides = data.data.data.slides;
            console.log(app.draft);
            if(app.slides)
            {
                for (var i = 0; i < app.slides.length; i++) {
                    var target = app.slides[i];
                    for (var j = i - 1; j >= 0 && (app.slides[j].id > target.id); j--) {
                        app.slides[j+1] = app.slides[j];
                    }
                    app.slides[j+1] = target
                }
            }
        }
        else{
            console.log("loading Error");
        }
    });
});
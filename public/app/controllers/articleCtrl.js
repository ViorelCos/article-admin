angular.module('articleController', ['awsServices', 'articleServices', 'slideServices'])

// Controller: articleCtrl is used to manage articles  
.controller('articleCtrl', function($scope, imagesService, articleService, slideService, $timeout) {

    var app = this;
    
    app.draft = true;
    app.isArticleTable = true;
    app.isSlideCreateButton = false;
    app.fileread = {}; // object for slide image
    app.filename = {}; // filename for slide image file
    app.newSlide = {};
    app.loading = false; // wait for upload
    app.successMsg = false;
    app.errorMsg = false;
    app.articles = []; // get all articles
    app.slides = []; // get slide list in given article 
    app.newArticle = {}; // temp article for modal
    app.selectedArticleID = "";// get article id when you click slides list button on article table.

    // Function: show slides table
    this.onShowSlides= function(article){
        app.isArticleTable = false;
        app.selectedArticleID = article._id;
        getSlides();
    }

    //Function: show articles table
    this.onShowArticles = function(){
        app.isArticleTable = true;
        app.selectedArticleID  = "";
        getArticles();
    }

    //Fucntion: drop modal when click slide create button
    this.onCreateSlideModal = function() {
        app.isSlideCreateButton = true;
        app.newSlide = {};
        $("#myModal1").modal({ backdrop: "static" }); // Open modal
    }

    // get slides from database
    function getSlides() {

        slideService.getSlides(app.selectedArticleID).then(function(data){
            app.slides = data.data.data;
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
        });
    }

    //  Function: change selected Slide
    this.onSlideEdit = function(slide) {
        app.fileread = {};
        app.filename = {};
        app.newSlide = slide;
        $("#myModal1").modal({ backdrop: "static" }); // Open modal
        $("#fileurl")["0"].value = ""; // initialize file input
    }

    // Function: delete selected Slide
    this.onSlideDelete = function(slide) {
        app.slides[slide.id] = {id : slide.id , name : "" , text : "", imagekey : "" };// update DOM
        app.loading = true;
        
        slideService.deleteSlide(app.selectedArticleID, slide).then(function(data){
            if (data.data.success) {
                //delete image on sw3
                imagesService.deleteImage(slide).then(function(data) {
                    console.log(data);
                    app.loading = false;
                    if(data.data.success == true){
                        app.successMsg = data.data.message;
                        $scope.alert = 'alert alert-success'; // Set error message ng-class
                    }
                    else{
                        app.errorMsg = data.data.message;
                        $scope.alert = 'alert alert-danger'; // Set error message ng-class
                    }
                    $timeout(function() {
                        app.successMsg = false;
                        app.errorMsg = false;
                        getSlides();
                    }, 2000);
                    console.log(data.data.message);
                });
            } else {
                app.loading = false;
                console.log("Delete slide is in fail.");
            }
        });
    }

    // // Function: update selected slide
    this.onSlideUpdate = function() {
        app.loading = true;
        
        var slide = {
            "id": app.newSlide.id,
            "name": app.newSlide.name,
            "text": app.newSlide.text,
            "imagekey": app.fileName
        };

        if(app.isSlideCreateButton){
            app.slides.push(slide);
        }
        app.isSlideCreateButton = false;

        slideService.storeSlide(app.selectedArticleID, slide).then(function(data){
            if (data.data.success) {
                //store image on sw3
                if(app.fileName != "" && app.fileName != undefined){
                    console.log("sdfsdfsdf");
                    imagesService.storeImage(app.fileread, app.fileName).then(function(data) {
                        // Check if image was retrieved
                        app.loading = false;
                        if(data.data.success == true){
                            app.successMsg = data.data.message;
                            $scope.alert = 'alert alert-success'; // Set error message ng-class
                        }
                        else{
                            app.errorMsg = data.data.message;
                            $scope.alert = 'alert alert-danger'; // Set error message ng-class
                        }
                        $timeout(function() {
                            app.successMsg = false;
                            app.errorMsg = false;
                            getSlides();
                        }, 2000);
                    });
                }
                else{
                    $timeout(function() {
                        app.loading = false;
                        getSlides();
                    }, 2000);
                }

            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
                $scope.alert = 'alert alert-danger'; // Set error message ng-class
                $timeout(function() {
                    app.successMsg = false;
                    app.errorMsg = false;
                }, 2000);
            }
        });
    }

    // Function: get all articles from database
    function getArticles() {
        articleService.getArticles().then(function(data){
            if(data.data.success == true){
                app.articles = data.data.data;
            }
            else{
                console.log(data.data.message);
            }
        });
    }

    getArticles();

    //Function: change selected Article
    this.onEditArticleModal = function(article) {
        app.newArticle = article;
        $("#myModal1").modal({ backdrop: "static" }); // Open modal
    }

    this.onCreateArticleModal = function() {
        app.newArticle = {};
        $("#myModal1").modal({ backdrop: "static" }); // Open modal
    }

    this.onArticleUpdate = function(newArticle) {
        app.loading = true;
        articleService.storeArticle(newArticle).then(function(data){
            if (data.data.success) {     
                app.successMsg = data.data.message;
                $scope.alert = 'alert alert-success'; // Set error message ng-class
            } else {
                app.errorMsg = data.data.message;
                $scope.alert = 'alert alert-danger'; // Set error message ng-class
            }
            app.loading = false;
            $timeout(function() {
                app.successMsg = false;
                app.errorMsg = false;
                getArticles();
            }, 2000);
        });
    }
    // Function: delete selected article
    this.onArticleDelete = function(article) {
        app.loading = true;
        articleService.deleteArticle(article).then(function(data){
            if (data.data.success) {     
                app.successMsg = data.data.message;
                $scope.alert = 'alert alert-success'; // Set error message ng-class
            } else {
                app.errorMsg = data.data.message;
                $scope.alert = 'alert alert-danger'; // Set error message ng-class
            }
            app.loading = false;
            $timeout(function() {
                app.successMsg = false;
                app.errorMsg = false;
                getArticles();
            }, 2000);
        });
    }
})
// Convert a file as a Base64 string
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACgAAAAZACAYAAAC1rBvAAAAACXBIW...
.directive('fileread', function(imagesService){
    return {
      restrict: 'A',
      link: function ($scope, elem, attrs) {

        elem.bind("change", function (changeEvent) {
            
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            var fileread = loadEvent.target.result;

            //make imagekey(file name)
            
            var tempArray = elem[0].value.split('\\');
            var fileName = tempArray[tempArray.length - 1];

            var date = new Date();
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            fileName = year + "/" + month + "/" + day + "." + fileName;

            $scope.article.fileName = fileName;
            $scope.article.fileread = fileread;
 
            // console.log(fileread);
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
});
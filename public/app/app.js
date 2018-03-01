angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'awsServices', 'emailController', 'managementController', 'articleController', 'frontController'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});

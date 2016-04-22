var routerApp = angular.module('routerApp', ['ui.router', 'ngAnimate', 'ui.bootstrap']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/landing');

    $stateProvider

        .state('landing', {
            url: '/landing',
            views: {
                '': {
                    templateUrl: './partials/partial-landing.html'
                },
                'columnOne@landing': {
                    templateUrl: './partials/partial-login.html',
                    controller: 'loginController',
                    authenticate:false

                },
                'columnTwo@landing': {
                    templateUrl: './partials/partial-registration.html',
                    controller: 'registrationController',
                    authenticate:false

                }
            },
            authenticate:false
        })

        .state('about', {
            url: '/about',
            templateUrl: './partials/partial-about.html',
            authenticate: false
        })

        .state("success", {
            url: "/success",
            templateUrl: "./partials/partial-login-success.html",
            authenticate: true
        })


});

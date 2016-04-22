
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

        .state('about', {
            url: '/about',
            templateUrl: './partials/partial-about.html',
            authenticate: true
        })

        .state('mygroups', {
            url: '/',
            templateUrl: './partials/partial-groups.html',
            authenticate: true
        })

        .state('map', {
            url: '/map',
            templateUrl: './partials/partial-mapdisplaygroups.html',
            authenticate: true
        })

        .state('groups', {
            url: '/groups',
            templateUrl: './partials/partial-groups.html',
            controller: 'groupController',
            authenticate: true
        })

        .state('mygroups.usergrouplist', {
            url: '/grouplist',
            templateUrl: './partials/partial-usergrouplist.html',
            controller: 'groupController',
            authenticate: true
        })

        .state('mygroups.usergroupupdate', {
            url: '/groupupdate',
            templateUrl: './partials/partial-usergroupupdate.html',
            controller: 'groupController',
            authenticate: true
        })

        .state('mygroups.grouplist', {
            url: '/grouplist',
            templateUrl: './partials/partial-grouplist.html',
            controller: 'groupController',
            authenticate: true
        })

        .state('mygroups.groupupdate', {
            url: '/groupupdate',
            templateUrl: './partials/partial-groupupdate.html',
            controller: 'groupController',
            authenticate: true
        })

        .state('mygroups.groupcreate', {
            url: '/groupcreate',
            templateUrl: './partials/partial-groupcreate.html',
            controller: 'groupController',
            authenticate: true
        })

        .state('mygroups.groupfind', {
            url: '/groupfind',
            templateUrl: './partials/partial-groupfind.html',
            controller: 'groupController',
            authenticate: true
        })
        .state('mygroups.groupAPIDoc', {
            url: '/apidocumentation',
            templateUrl: './partials/partial-groupAPIDoc.html',
            controller: 'groupController',
            authenticate: true
        })
});

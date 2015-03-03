var app = angular.module('unicornSiteManager', [
    'ngRoute',
    'ui.bootstrap',
    'kendo.directives',
    'angular-meteor'
]);

app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'client/views/dashboard.ng.html',
            controller: 'DashboardCtrl'
        }).
        when('/manager', {
            templateUrl: 'client/views/manager.ng.html',
            controller: 'ManagerCtrl'
        }).
        when('/login', {templateUrl: 'client/views/login.ng.html', controller: 'LoginCtrl'}).
        otherwise({redirectTo: '/#/'});
});

//-------------------------------------------------------------------------------------------------
// DEMO: Realtime
//-------------------------------------------------------------------------------------------------

app.controller('DashboardCtrl', function ($scope, UnicornSiteService) {
    $scope.unicornSites = UnicornSiteService.getUnicornSites();
});

app.controller('ManagerCtrl', function ($scope, UnicornSiteService) {
    $scope.currentUnicornSite = null;
    $scope.newUnicornSite = { name: '', status: '' };
    $scope.unicornSites = UnicornSiteService.getUnicornSites();

    $scope.setCurrentUnicornSite = function (id, unicornSite) {
        unicornSite.id = id;
        $scope.currentUnicornSite = unicornSite ;
    };
    
    $scope.addUnicornSite = function () {
        UnicornSiteService.addUnicornSite(angular.copy($scope.newUnicornSite));
        $scope.resetForm();
    };

    $scope.updateUnicornSite = function (id) {
        UnicornSiteService.updateUnicornSite(id);
    };

    $scope.removeUnicornSite = function (id) {
        UnicornSiteService.removeUnicornSite(id);
    };

    $scope.resetForm = function () {
        $scope.currentUnicornSite = null;
        $scope.newUnicornSite = { name: '', status: '' };
    };
});

app.factory('UnicornSiteService', function ($meteor) {
    var unicornSites = $meteor.collection(Unicorns).subscribe('unicorns');

    var getUnicornSites = function () {
        return unicornSites;
    };

    var addUnicornSite = function (unicorn) {
        unicornSites.save(unicorn);
    };

    var updateUnicornSite = function (id) {
        unicornSites.save(unicornSites[id]);
    };

    var removeUnicornSite = function (id) {
        unicornSites.remove(id);
    };

    return {
        getUnicornSites: getUnicornSites,
        addUnicornSite: addUnicornSite,
        updateUnicornSite: updateUnicornSite,
        removeUnicornSite: removeUnicornSite
    }
});

//-------------------------------------------------------------------------------------------------
// DEMO: Authentication
//-------------------------------------------------------------------------------------------------

app.controller('MainCtrl', function ($scope, $location, AuthService) {
    $scope.logout = function () {
        AuthService.logout();
    };

    $scope.$on('onLogin', function () {
        $scope.currentUser = AuthService.getCurrentUser();
        $location.path('/');
    });

    $scope.$on('onLogout', function () {
        $scope.currentUser = null;
        $location.path('/login');
    });

    $scope.currentUser = AuthService.getCurrentUser();
});

app.controller('LoginCtrl', function ($scope, $location, AuthService) {
    $scope.user = { email: '', password: '' };

    $scope.login = function (email, password) {
        AuthService.login(email, password);
    };

    $scope.register = function (email, password) {
        AuthService.register(email, password);
    };

    $scope.reset = function () {
        $scope.user = { email: '', password: '' };
    };
});

app.factory('AuthService', function ($rootScope) {
    var getCurrentUser = function () {
        return $rootScope.currentUser;
    };

    var login = function (email, password) {
        Meteor.loginWithPassword(email, password, function() {
            $rootScope.$broadcast('onLogin');
        });
    };

    var logout = function () {
        Meteor.logout(function() {
            $rootScope.$broadcast('onLogout');
        });
    };

    var register = function (email, password) {
        Accounts.createUser({
            username : email,
            email : email,
            password : password
        });
    };

    $rootScope.$watch('currentUser', function(newValue, oldalue) {
       if (newValue && !oldalue) {
           $rootScope.$broadcast('onLogin');
       }
       else if (oldalue && !newValue) {
           $rootScope.$broadcast('onLogout');
       }
    });

    return {
        getCurrentUser: getCurrentUser,
        login: login,
        logout: logout,
        register: register
    }
});

kendo.bind(document.body);

$(window).resize(function () {
    kendo.resize(document.body);
});
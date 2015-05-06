var app = angular.module('authero', ['ngRoute']);

app.config(function($routeProvider, $httpProvider) {

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $routeProvider
    .when('/', {
      templateUrl: 'home.html', 
      controller: 'mainController'
    })
    // .when('/schedule', {
    //   templateUrl: 'schedule.html', 
    //   controller: 'mainController'
    // })
    .otherwise({ redirectTo: '/' });
});

app.controller('mainController', ['$scope', '$http', function($scope, $http) {

    $scope.toggleFanMenu = function() {
        if ($('.fans .switch').css('display') == 'none') {
            $('.fans .switch').css( "display", "block" );
        }
        else {
            $('.fans .switch').css( "display", "none" );
        }
    };

    $scope.toggleTempMenu = function() {
        if ($('.setting .switch').css('display') == 'none') {
            $('.setting .switch').css( "display", "block" );
        }
        else {
            $('.setting .switch').css( "display", "none" );
        }
    };

    // sets target temp up one degree
    $scope.tempUp = function() {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/tempUp'}).
            success(function(data, status) {
                console.log('success');
                $scope.getTargetTemp();
            }).
            error(function(data, status) {
                console.log('error');
            });
    };

    // sets target temp down one degree
    $scope.tempDown = function() {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/tempDown'}).
            success(function(data, status) {
                console.log('success');
                $scope.getTargetTemp();
            }).
            error(function(data, status) {
                console.log('error');
            });
    };

    // returns the current target temp
    $scope.getTargetTemp = function() {
        $http({method: 'GET', url: $scope.server_url + 'thermostat/targetTemp'}).
            success(function(data, status) {
                $scope.targetTemp = data['targetTemp'];
            }).
            error(function(data, status) {
                $scope.targetTemp = data['targetTemp'] || "error";
            });
    };

    // sets the target temp to parameter temp
    $scope.setTargetTemp = function(temp) {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/targetTemp?targetTemp=' + temp}).
            success(function(data, status) {
                console.log('success');
                $scope.targetTemp = temp;
            }).
            error(function(data, status) {
                console.log('error');
            });
    };

    // returns JSON of all rooms and their temps
    $scope.getCurrentTemp = function() {
        $http({method: 'GET', url: $scope.server_url + 'thermostat/currentTemp'}).
            success(function(data, status) {
                $scope.currentTemps = data;
            }).
            error(function(data, status) {
                $scope.currentTemps = data || "error";
            });
    };

    // returns fan state (ON, OFF, AUTO)
    $scope.getFanState = function() {
        $http({method: 'GET', url: $scope.server_url + 'thermostat/fanState'}).
            success(function(data, status) {
                $scope.currentTemps = data['fanState'];
            }).
            error(function(data, status) {
                $scope.currentTemps = data['fanState'] || "error";
            });
    };

    // sets fan state to parameter state (ON, OFF, AUTO)
    $scope.setFanState = function(state) {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/fanState?fanState=' + state}).
            success(function(data, status) {
                console.log('success');
                $scope.fanState = state;
                $scope.toggleFanMenu();
            }).
            error(function(data, status) {
                console.log('error');
                $scope.fanState = state;
                $scope.toggleFanMenu();
            });
    };

    // returns temp mode (HEAT, COOL, AUTO)
    $scope.getTempMode = function() {
        $http({method: 'GET', url: $scope.server_url + 'thermostat/tempMode'}).
            success(function(data, status) {
                $scope.currentTemps = data['tempMode'];
            }).
            error(function(data, status) {
                $scope.currentTemps = data['tempMode'] || "error";
            });
    };

    // sets temp mode to parameter mode (HEAT, COOL, AUTO)
    $scope.setTempMode = function(mode) {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/tempMode?tempMode=' + mode}).
            success(function(data, status) {
                console.log('success');
                $scope.tempMode = mode;
                $scope.toggleTempMenu();
            }).
            error(function(data, status) {
                console.log('error');
                $scope.tempMode = mode;
                $scope.toggleTempMenu();
            });
    };

    $scope.server_url = 'http://robertrdunn.com:8080/';

    $scope.currentTemps = 'init';
    $scope.targetTemp = 'init';
    $scope.fanState = 'init';
    $scope.tempMode = 'init';

    // initialize some variables with calls to the web API
    // $scope.getTargetTemp();
    // $scope.getCurrentTemp();
    // $scope.getFanState();
    // $scope.getTempMode();

    $scope.currentTemps = { '0': '72', '1': '70', 'average': '71' };    // temp data
    $scope.targetTemp = { 'targetTemp': '75' };                         // temp data
    $scope.targetTemp = $scope.targetTemp['targetTemp'];                // temp data
    $scope.fanState = "ON";                                            // temp data
    $scope.tempMode = "COOL";                                           // temp data

}]);
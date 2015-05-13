var app = angular.module('authero', ['ngRoute']);

app.config(function($routeProvider, $httpProvider) {

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $httpProvider.defaults.useXDomain = true;

    $routeProvider
    .when('/', {
      templateUrl: 'login.html', 
      controller: 'mainController'
    })
    .when('/schedule', {
      templateUrl: 'schedule.html', 
      controller: 'mainController'
    })
    .when('/home', {
      templateUrl: 'home.html', 
      controller: 'mainController'
    })
    .otherwise({ redirectTo: '/' });
});

app.factory('tempCache', function($cacheFactory) {
    return $cacheFactory('templogs');
});

app.controller('mainController', ['$scope', '$http', 'tempCache', function($scope, $http, tempCache) {

    $http.defaults.useXDomain = true;
    $scope.username = '';
    $scope.password = '';

    // show/hide the fan mode menu
    $scope.toggleFanMenu = function() {
        if ($('.fans .switch').css('display') == 'none') {
            $('.fans .switch').css( "display", "block" );
        }
        else {
            $('.fans .switch').css( "display", "none" );
        }
    };

    // show.hide the temp mode menu
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
        console.log('temp up');
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
        console.log('temp down');
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
                $scope.fanState = data['fanState'];
            }).
            error(function(data, status) {
                $scope.fanState = data['fanState'] || "error";
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
                $scope.tempMode = data['tempMode'];
            }).
            error(function(data, status) {
                $scope.tempMode = data['tempMode'] || "error";
            });
    };

    // sets temp mode to parameter mode (HEAT, COOL, AUTO)
    $scope.setTempMode = function(mode) {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/tempMode', data: { tempMode: mode }}).
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

    // creates a new schedule, then updates schedule list on client side
    $scope.createSchedule = function(new_schedule) {
        $http({method: 'POST', url: $scope.server_url + 'schedule/create/', data: new_schedule}).
            success(function(data, status) {
                console.log('success');
                $scope.getSchedules();
            }).
            error(function(data, status) {
                console.log('error');
            });
    };

    // returns all schedules in the database
    $scope.getSchedules = function() {
        $http({method: 'GET', url: $scope.server_url + 'schedule/list/'}).
            success(function(data, status) {
                $scope.schedules = angular.fromJson(data['schedules']);
                for (var i = 0; i < $scope.schedules.length; i++) {
                    $scope.schedules[i] = angular.fromJson($scope.schedules[i]);
                }
            }).
            error(function(data, status) {
                $scope.schedules = data['schedules'] || "error";
            });
    };

    // selects a schedule to use
    $scope.selectSchedule = function(schedule) {
        $http({method: 'PUT', url: $scope.server_url + 'thermostat/selectSchedule/', data: { 'scheduleName': schedule }}).
            success(function(data, status) {
                console.log('success');
            }).
            error(function(data, status) {
                console.log('error');
            });
    };

    // login function that uses data from the login form
    $scope.login = function() {
        $http({method: 'GET', url: $scope.server_url + 'user/login/', data: { 'username': $scope.username, 'password': $scope.password }}).
            success(function(data, status) {
                console.log('success');
                location.href = "/authero/#/home";
            }).
            error(function(data, status) {
                console.log('error');
                console.log($scope.username);
                console.log($scope.password);
            });
    };

    // get the temperature logs for use in graphs
    $scope.getTempLog = function() {

        // check and see if there's something already in the cache
        // if not call the web API
        var cache = tempCache.get('templogs');
        if (cache) {
            $scope.tempLog = cache;
            $('#myChart').css( "height", "250px" );
            $('#graph_loading').css( "display", "none" );
            // if (document.getElementById("myChart").getContext("2d") !== null) {
            //    $scope.drawTempGraph('1'); 
            // }
        }
        else {
            $http({method: 'GET', url: $scope.server_url + 'thermostat/temperatureLog/'}).
                success(function(data, status) {
                    tempCache.put('templogs', data);
                    $scope.tempLog = tempCache.get('templogs');;
                    console.log(data);
                    $('#myChart').css( "height", "250px" );
                    $('#graph_loading').css( "display", "none" );
                    $scope.drawTempGraph('1');
                }).
                error(function(data, status) {
                    $scope.tempLog = data || "error";
                });            
        }

    };

    // draw a temperature log graph for a certain day
    $scope.drawTempGraph = function(day) {
        var ctx = document.getElementById("myChart").getContext("2d");
        var new_data = [];
        var new_labels = [];
        var old_values = [];

        // use only one (time, temp) set per hour
        for (var i = 0; i < $scope.tempLog[day].length; i++) {
            if ($.inArray($scope.tempLog[day][i]['time'].split(':')[0], old_values) == -1) {
                new_labels.push($scope.tempLog[day][i]['time']);
                new_data.push($scope.tempLog[day][i]['temp']);
                old_values.push($scope.tempLog[day][i]['time'].split(':')[0]);
            }
        }

        var the_data = {
                    label: "Sunday",
                    fillColor: "rgba(42,54,59,0.5)",
                    strokeColor: "rgba(0,0,0,1)",
                    pointColor: "rgba(0,0,0,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(0,0,0,1)",
                    data: new_data
                };

        var data = {
            labels: new_labels,
            datasets: [
                the_data
            ]
        };
        var options = {
            scaleLineColor: "rgba(0,0,0,.4)",
            scaleFontColor: "#2A363B",

            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,

            //String - Colour of the grid lines
            scaleGridLineColor : "rgba(0,0,0,.15)",

            //Number - Width of the grid lines
            scaleGridLineWidth : 1,

            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,

            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,

            //Boolean - Whether the line is curved between points
            bezierCurve : true,

            //Number - Tension of the bezier curve between points
            bezierCurveTension : 0.4,

            //Boolean - Whether to show a dot for each point
            pointDot : true,

            //Number - Radius of each point dot in pixels
            pointDotRadius : 4,

            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth : 1,

            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius : 20,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke : true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth : 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill : true,

            //String - A legend template
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

        };

        // draw the graph
        var myLineChart = new Chart(ctx).Line(data, options);
    };

    // $scope.server_url = 'http://robertrdunn.com:8080/';
    $scope.server_url = 'http://authero.chickenkiller.com:8080/';

    $scope.currentTemps = ' ';
    $scope.targetTemp = ' ';
    $scope.fanState = ' ';
    $scope.tempMode = ' ';
    $scope.schedules = ' ';
    $scope.tempLog = ' ';

    // initialize some variables with calls to the web API
    $scope.getTargetTemp();
    $scope.getCurrentTemp();
    $scope.getFanState();
    $scope.getTempMode();
    $scope.getSchedules();
    $scope.getTempLog();

    // $scope.currentTemps = { '0': '72', '1': '70', 'average': '71' };    // temp data
    // $scope.targetTemp = { 'targetTemp': '75' };                         // temp data
    // $scope.targetTemp = $scope.targetTemp['targetTemp'];                // temp data
    // $scope.fanState = "ON";                                            // temp data
    // $scope.tempMode = "COOL";                                           // temp data

}]);

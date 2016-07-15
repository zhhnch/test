app.controller('cronTabController', [
    '$scope',
    function ($scope) {
        var _cronTabOptions = {};
        var _flatOptions = {
            showFields: ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'],
            second: ['everyTime', 'cycle','range','appoint'],
            minute: ['everyTime', 'cycle', 'range', 'appoint'],
            hour:   ['everyTime', 'cycle', 'range', 'appoint'],
            day:    ['everyTime', 'unAppoint', 'cycle', 'range', 'allWeekDay', 'recentWeekDay', 'lastDayOfMonth', 'appoint'],
            month:  ['everyTime', 'cycle', 'range', 'appoint'],
            week:   ['everyTime', 'unAppoint', 'range', 'dayOfWeek', 'lastWeekDayOfMonth', 'appoint'],
            year:   ['everyTime', 'unAppoint', 'cycle', 'range', 'appoint']
        };
        $scope.models = {};
        $scope.values = {};
        $scope.expression = '';

        $scope.setValues = function(time){
            if($scope.models[time]){
                var method = $scope.models[time].selected;
                if(method && methods[method]){
                    $scope.values[time] = methods[method]($scope.models[time][method]);
                    var keys = Object.keys($scope.values);
                    var values = keys.map(function(key){
                        return $scope.values[key];
                    });
                    $scope.expression = values.join(' ');
                    console.log($scope.expression);
                }
            }
        };

        $scope.setAllValues = function(){
            _cronTabOptions.showFields.forEach(function(field){
                $scope.setValues(field);
            });
        };

        $scope.cronTab = function(options){
            _cronTabOptions = _cronExtend(_cronExtend({}, options), _flatOptions);
            _initCronTab(_cronTabOptions);
        };

        function _initCronTab(cronTabOptions){
            $scope.expression = '';
            cronTabOptions.showFields.forEach(function(field){
                $scope.models[field] = {};
                $scope.values[field] = '';
                cronTabOptions[field].forEach(function(key){
                    $scope.models[field][key] = [];
                });
            });
        }

        function _cronExtend(target, src){
            for (var key in src ) {
                if (src[key] !== undefined ) {
                    ( _flatOptions[ key ] ? target : {})[ key ] = src[ key ];
                }
            }
            return target;
        }

        var methods = {
            /**
             * 通配 *
             */
            everyTime: function () {
                return '*';
            },
            /**
             * 周期 /
             */
            cycle: function (cycle) {
                return cycle.start + '/' + cycle.interval;
            },
            /**
             * 范围 -
             */
            range: function (range) {
                return range.begin + '-' + range.until;
            },
            /**
             * 不指定 ?
             */
            unAppoint: function () {
                return '?';
            },
            /**
             * 指定 ,
             */
            appoint: function (values) {
                var str = '';
                if(Array.isArray(values)){
                    values = values.filter(function(item){
                        return (item !==false && 'undefined' !== typeof(item));
                    });
                    str = values.join(',');
                }
                return str;
            },
            /**
             *  工作日 W
             */
            allWeekDay: function () {
                return 'W';
            },
            /**
             * 月最后一天 L
             */
            lastDayOfMonth: function () {
                return 'L';
            },
            /**
             * nW
             */
            recentWeekDay: function (day) {
                return day + 'W';
            },
            /**
             *  nL
             */
            lastWeekDayOfMonth: function (day) {
                return day + 'L';
            },
            /**
             *  #
             */
            dayOfWeek: function (dayAndWeek) {
                return dayAndWeek.day + '#' + dayAndWeek.week;
            }
        };
    }
]);

app.directive('cronTab', function () {
    return {
        restrict: 'EA',
        require: ['?ngModel'],
        controller: 'cronTabController',
        link: function (scope, element, attr, ctrls) {
            scope.cronTab();
            element.delegate('input', 'change', [], function(){
                //scope.setValues();
                scope.setAllValues();
            });
        }
    };
});

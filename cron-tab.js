bss_wrap.controller('cronTabController', [
    '$scope',
    function ($scope) {
        var _conf = {
            expReg: {
                everyTime: /^[*]$/,
                cycle: /^(\d\d*)[\/](\d\d*)$/,
                range: /^(\d\d*)[-](\d\d*)$/,
                appoint: /^(\d\d*)([,](\d\d*))*$/,
                unAppoint: /^\u0020|[?]$/,
                recentWeekDay: /^(\d\d*)[W]$/,
                allWeekDay: /^[W]$/,
                lastDayOfMonth: /^[L]$/,
                dayOfWeek: /^(\d\d*)[#](\d\d*)$/,
                lastWeekDayOfMonth: /^(\d\d*)[L]$/
            }
        };
        var _flatModels = {
            second: {
                required: true,
                allowMethods: ['everyTime', 'cycle', 'range', 'appoint'],
                defaultMethod: 'appoint',
                everyTime: '*',
                cycle_start: 1,
                cycle_interval: 2,
                range_begin: 0,
                range_end: 1,
                unAppoint: '?',
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 0,
                maxValue: 59
            },
            minute: {
                required: true,
                allowMethods: ['everyTime', 'cycle', 'range', 'appoint'],
                defaultMethod: 'appoint',
                everyTime: '*',
                cycle_start: 1,
                cycle_interval: 2,
                range_begin: 0,
                range_end: 1,
                unAppoint: '?',
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 0,
                maxValue: 59
            },
            hour: {
                required: true,
                allowMethods: ['everyTime', 'cycle', 'range', 'appoint'],
                defaultMethod: 'everyTime',
                everyTime: '*',
                cycle_start: 1,
                cycle_interval: 2,
                range_begin: 0,
                range_end: 1,
                unAppoint: '?',
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 0,
                maxValue: 59
            },
            day: {
                required: true,
                allowMethods: ['everyTime', 'unAppoint', 'cycle', 'range', 'allWeekDay', 'recentWeekDay', 'lastDayOfMonth', 'appoint'],
                defaultMethod: 'unAppoint',
                everyTime: '*',
                cycle_start: 1,
                cycle_interval: 2,
                range_begin: 0,
                range_end: 1,
                recentWeekDay: 1,
                unAppoint: '?',
                allWeekDay: 'W',
                lastDayOfMonth: 'L',
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 1,
                maxValue: 31
            },
            month: {
                required: true,
                allowMethods: ['everyTime', 'cycle', 'range', 'appoint'],
                defaultMethod: 'everyTime',
                everyTime: '*',
                cycle_start: 1,
                cycle_interval: 2,
                range_begin: 0,
                range_end: 1,
                recentWeekDay: 1,
                unAppoint: '?',
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 1,
                maxValue: 12
            },
            week: {
                required: true,
                allowMethods: ['everyTime', 'unAppoint', 'range', 'dayOfWeek', 'lastWeekDayOfMonth', 'appoint'],
                defaultMethod: 'unAppoint',
                everyTime: '*',
                range_begin: 0,
                range_end: 1,
                unAppoint: '?',
                allWeekDay: 'W',
                dayOfWeek_day: 1,
                dayOfWeek_week: 1,
                lastWeekDayOfMonth: 1,
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 1,
                maxValue: 7
            },
            year: {
                required: false,
                allowMethods: ['everyTime', 'unAppoint', 'cycle', 'range', 'appoint'],
                defaultMethod: 'unAppoint',
                everyTime: '*',
                cycle_start: 2016,
                cycle_interval: 1,
                range_begin: 2016,
                range_end: 2017,
                unAppoint: '?',
                appoint: {},
                realValue: '',
                curMethod: '',
                minValue: 1970,
                maxValue: 2099
            }
        };
        var _flatOptions = {
            showFields: ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'],
            lang: ''
        };
        var _cronOptions = {};
        $scope.models = {};
        $scope.expression = '';
        $scope.setValue = function (time) {
            if ($scope.models[time]) {
                var method = $scope.models[time].curMethod;
                if (method && _realValueFactory.hasOwnProperty(method)) {
                    var modelValue = $scope.models[time];
                    var realValue = _realValueFactory[method](modelValue);
                    if (false === realValue) {
                        $scope.models[time].realValue = _realValueFactory.unAppoint($scope.models[time]);
                    } else {
                        $scope.models[time].realValue = realValue;
                    }
                }
            }
        };

        /**
         * 日/周 必须有一个不指定值
         * @param dayOrWeek
         */
        $scope.toggleDayOrWeek = function (dayOrWeek) {
            if (dayOrWeek === 'day' && $scope.models.day.curMethod !== 'unAppoint') {
                $scope.$apply(function () {
                    $scope.models.week.curMethod = 'unAppoint';
                });
            } else if (dayOrWeek === 'week' && $scope.models.week.curMethod !== 'unAppoint') {
                $scope.$apply(function () {
                    $scope.models.day.curMethod = 'unAppoint';
                });
            }
        };

        /**
         * 生成cron表达式
         */
        $scope.buildExpression = function () {
            var values = [];
            _cronOptions.showFields.forEach(function (field) {
                if ($scope.models[field].required || (!$scope.models[field].required && $scope.models[field].realValue)) {
                    values.push($scope.models[field].realValue);
                }
            });
            $scope.expression = values.join(' ');
            console.log($scope.expression);
        };


        $scope.setAllValues = function () {
            _cronOptions.showFields.forEach(function (field) {
                $scope.setValue(field);
            });
        };

        /**
         *
         * @param {String} exp cron表达式
         * @param {Object} opt
         * @param {Object} models 表单初始化值
         */
        $scope.initCronTab = function (exp, opt, models) {
            _cronOptions = _cronExtend(_cronExtend({}, _flatOptions), opt, _flatOptions);
            _cronOptions.showFields.forEach(function (k) {
                $scope.models[k] = _cronExtend({}, _flatModels[k]);
                $scope.models[k].curMethod = $scope.models[k].defaultMethod;
                if (models && models[k]) {
                    $scope.models[k] = _cronExtend($scope.models[k], models[k], _flatModels[k]);
                }
            });
            if (exp) {
                $scope.setExp(exp);
            }
        };

        /**
         *
         * @param exp
         */
        $scope.setExp = function (exp) {
            var models = parseExp(exp);
            _cronOptions.showFields.forEach(function (k) {
                _cronExtend($scope.models[k], models[k], _flatModels[k]);
            });
        };

        function parseExp(exp) {
            var arr = exp.split(' ');
            var model = {};
            var i = 0;
            for (; i < arr.length; i++) {
                var key = _cronOptions.showFields[i];
                model[key] = {};
                Object.keys(_conf.expReg).forEach(function (method) {
                    if (_conf.expReg[method].test(arr[i])) {
                        model[key] = _parserFactory[method](arr[i]);
                        model[key].curMethod = method;
                        model[key].realValue = arr[i];
                    }
                });
                if (!Object.keys(model[key]).length) {
                    model[key] = _parserFactory.unAppoint(arr[i]);
                    model[key].curMethod = 'unAppoint';
                    model[key].realValue = arr[i];
                }
            }
            return model;
        }

        var _parserFactory = {

            everyTime: function () {
                return {
                    everyTime: '*'
                };
            },

            cycle: function (subExp) {
                var arr = subExp.split('/');
                return {
                    cycle_start: arr[0],
                    cycle_interval: arr[1]
                };
            },

            range: function (subExp) {
                var arr = subExp.split('-');
                return {
                    range_begin: arr[0],
                    range_end: arr[1]
                };
            },

            appoint: function (subExp) {
                var arr = subExp.split(',');
                var appoint = {};
                arr.forEach(function (val) {
                    appoint[val] = val;
                });
                return {
                    appoint: appoint
                };
            },

            unAppoint: function (subExp) {
                return {unAppoint: subExp};
            },

            recentWeekDay: function (subExp) {
                var arr = subExp.split('W');
                return {
                    recentWeekDay: arr[0]
                };
            },

            allWeekDay: function () {
                return {
                    allWeekDay: 'W'
                };
            },

            lastDayOfMonth: function () {
                return {
                    lastDayOfMonth: 'L'
                };
            },

            dayOfWeek: function (subExp) {
                var arr = subExp.split('#');
                return {
                    dayOfWeek_week: arr[0],
                    dayOfWeek_day: arr[1]
                };
            },

            lastWeekDayOfMonth: function (subExp) {
                var arr = subExp.split('L');
                return {
                    recentWeekDay: arr[0]
                };
            }
        };

        function _cronExtend(target, src, flat) {
            target = angular.isObject(target) ? target : {};
            if (angular.isObject(src)) {
                Object.keys(src).forEach(function (key) {
                    if (!flat || (flat && flat.hasOwnProperty(key))) {
                        target[key] = src[key];
                    }
                });
            }
            return target;
        }

        var _realValueFactory = {
            /**
             * 通配 *
             */
            everyTime: function () {
                return '*';
            },
            /**
             * 周期 /
             */
            cycle: function (model) {
                var rs = false;
                if (model.cycle_start >= 0 && model.cycle_interval >= 0) {
                    rs = model.cycle_start + '/' + model.cycle_interval;
                }
                return rs;
            },
            /**
             * 范围 -
             */
            range: function (model) {
                var rs = false;
                if (model.range_begin >= 0 && model.range_end >= 0) {
                    rs = model.range_begin + '-' + model.range_end;
                }
                return rs;
            },
            /**
             * 不指定 ?
             */
            unAppoint: function (model) {
                var tag = '?';
                if (!model.required) {
                    tag = '';
                }
                return tag;
            },
            /**
             * 指定 ,
             */
            appoint: function (model) {
                var values = Object.keys(model.appoint);
                values = values.filter(function (val) {
                    return !(false === model.appoint[val] || ('undefined' === typeof(model.appoint[val])));
                });
                return values.join(',');
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
            recentWeekDay: function (model) {
                var rs;
                var day = model.recentWeekDay;
                if (day > 0) {
                    rs = day + 'W';
                } else {
                    rs = false;
                }
                return rs;
            },
            /**
             *  nL
             */
            lastWeekDayOfMonth: function (model) {
                var rs;
                var day = model.lastWeekDayOfMonth;
                if (day > 0) {
                    rs = day + 'L';
                } else {
                    rs = false;
                }
                return rs;
            },
            /**
             *  #
             */
            dayOfWeek: function (model) {
                var rs;
                if (!model.dayOfWeek_week || !model.dayOfWeek_day) {
                    rs = false;
                } else {
                    rs = model.dayOfWeek_week + '#' + model.dayOfWeek_day;
                }
                return rs;
            }
        };
    }
]);

bss_wrap.directive('cronTab', function () {
    return {
        restrict: 'EA',
        require: ['?ngModel'],
        controller: 'cronTabController',
        link: function (scope, element, attr, ctrls) {
            scope.initCronTab('0 5 0/12 ? 1/3 ? 2014-2016');
            element.delegate('input', 'change', [], function (event) {
                event.stopPropagation();
                var time = event.target.getAttribute('name');
                if (time === 'day' || time === 'week') {
                    scope.toggleDayOrWeek(time);
                }
                scope.setAllValues();
                scope.buildExpression();
            });
            element.on('$destroy', function () {
                element.undelegate('input', 'change');
            });
        }
    };
});

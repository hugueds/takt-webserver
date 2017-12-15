(function () {
    angular.module('appFilters', [])

        .filter('takt', function () {
            return function (ms) {
                var negative = false;
                var takt;
                if (ms < 0) {
                    negative = true;
                    ms = ms * -1;
                }
                var hr = 0;
                var min = (ms / 1000 / 60) << 0;
                var sec = (ms / 1000) % 60;

                if (sec < 10)
                    takt = min + ":0" + sec;
                else
                    takt = min + ":" + sec;

                if (negative)
                    takt = "-" + takt;

                return takt;
            }
        })

        .filter('yesNo', function () {
            return function (value) {
                if (value) {
                    return 'SIM';
                }
                return 'NÃO';
            }
        })

        .filter('minutes', function() {
            return function(value) {
                return (value/1000/60) << 0
            }
        })
        
        .filter('seconds', function() {
            return function(value) {
                return (value / 1000) % 60;
            }
        })
        
        ;
})();
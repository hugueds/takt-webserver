(function() {
    angular.module('takt-controller', ['socket-service', 'takt-service'])
        .controller('MainCtrl', mainCtrl)
        .controller('Adjust', adjustCtrl)
})();

function mainCtrl($scope, $filter, socket) {
    var instance = 'takt-1'; //Hard Coded

    $scope.popidWagon = [];

    $scope.cfgWagonAmount = 8; //initial value

    for (var i = 1; i <= $scope.cfgWagonAmount; i++)
        $scope.popidWagon.push(i);


    $scope.wagonColor = function(wagon, quantity) {
        var color = { green: 0.75, yellow: 0.9, red: 1 };
        var prct = wagon / $scope.cfgWagonAmount;
        var wagonColor = null;
        quantity--;
        if (quantity >= wagon)
            wagonColor = "wagon-used";
        else if (prct < color.green)
            wagonColor = "wagon-green";
        else if (prct <= color.yellow && prct < color.red)
            wagonColor = "wagon-warning";
        else
            wagonColor = "wagon-danger";
        return wagonColor;
    };

    socket.on(instance, function(data) {
        if (data == null) {
            $scope.error = "Sem Conexao...";
            return 1;
        }
        $scope.takt = data;
        $scope.instName = data.instName;
        $scope.lineTakt = data.lineTakt;
        $scope.lineStopTime = data.lineStopTime;
        $scope.produced = data.produced || 0;
        $scope.objective = data.objective;
        $scope.lineStopPlan = data.lineStopPlan;
        $scope.logTimer = data.logTimer;
        $scope.logStopTime = data.logStopTime || 0;
        $scope.logStopPlan = data.logStopPlan;
        $scope.andon = data.andon;
        $scope.andonMsg = data.andonMsg;
        $scope.cfgTakt = data.cfgTakt; //Takt configurado na linha
        $scope.cfgWagonNumber = data.cfgWagonNumber; //Numero de vagoes
        $scope.cfgWagonAmount = data.cfgWagonAmount; //Numero de Popids por vagao
        $scope.wagons = data.wagon;
        $scope.error = data.error;
        $scope.taktNegative = false;
        if (data.lineTakt <= 0)
            $scope.taktNegative = true;
    });

    socket.on('newConnection', function(data) {
        console.log(data.toString());
    });

    $scope.reconnect = function() {
        socket.emit('plc-reconnect', { conn: "Reconnection Request" });
        console.log('Tentando reconectar com o PLC...');
    };
}

function adjustCtrl($scope, $log, config, socket) {
    var instance = 'takt-1'; //Hard Coded

    socket.on(instance, function(data) {
        $scope.logStopTime = data.logStopTime;
        $scope.wagons = data.wagon;
    });

    $scope.t = {};
    $scope.st = {};

    $scope.st.h = '00';
    $scope.st.m = '00';
    $scope.st.s = '00';

    $scope.t.h = '00';
    $scope.t.m = '00';
    $scope.t.s = '00';

    $scope.setTime = function(instance, t, wagon) {
        var ms = converToMs(t);
        $scope.ms = ms;
        console.log(ms + ' ' + wagon.number)
        config.updateWagonTime(instance, wagon, ms);
    };

    $scope.setStopTime = function(instance, t) {
        var ms = converToMs(t);
        $scope.stopTimeMs = ms;
        config.updateStopTime(instance, ms);
    };

    $scope.increase = function(t, type) {
        if (type == 0) {
            t = parseInt(t.h, 10);
            t++;
            $scope.t.h = t.toString();
        } else if (type == 1) {
            t = parseInt(t.m, 10);
            t++;
            if (t >= 60)
                return;
            if (t < 10)
                $scope.t.m = "0" + t.toString();
            else
                $scope.t.m = t.toString();
        } else {
            t = parseInt(t.s, 10);
            t++;
            if (t >= 60)
                return;
            if (t < 10)
                $scope.t.s = "0" + t.toString();
            else
                $scope.t.s = t.toString();
        }
    };

    $scope.decrease = function(t, type) {
        if (type == 0) {
            t = parseInt(t.h, 10);
            t--;
            if (t < 0) return;
            $scope.t.h = t.toString();
        } else if (type == 1) {
            t = parseInt(t.m, 10);
            t--;
            if (t < 0) return;
            if (t < 10) $scope.t.m = "0" + t.toString();
            else $scope.t.m = t.toString();
        } else {
            t = parseInt(t.s, 10);
            t--;
            if (t < 0) return;
            if (t < 10) $scope.t.s = "0" + t.toString();
            else $scope.t.s = t.toString();
        }
    };

    $scope.updateWagon = function(instance, wagon) {
        config.updateWagon(instance, wagon);
    };

    function converToMs(time) {
        var ms;
        ms = time.h * 36000000;
        ms += time.m * 60000;
        ms += time.s * 1000;

        return ms;
    }

    $scope.reconnect = function() {
        var asw = confirm("Deseja reestabelecer conexão com PLC ?");
        if (!asw) return false;
        console.log('Tentando reconectar com o PLC...');
        socket.emit('plc-reconnect', { conn: "Reconnection Request" });
        return true;
    }

    $scope.storage = function() {;
    }
}
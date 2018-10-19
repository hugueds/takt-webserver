(function () {
    angular.module('takt-controller', ['socket-service', 'takt-service'])
        .controller('MainCtrl', mainController)
        .controller('AdjustCtrl', adjustController)
        .controller('WelcomeCtrl', welcomeController)
        .controller('ConfigCtrl', configController)
})();

function mainController($scope, $filter, socket, $interval, instances) {

    var idx = 0;
    var instanceSize = 0;
    var paralamaInstance = 17;
    $scope.showAvailability = false;
    $scope.popidWagon = [];
    $scope.device = instances.getDevice();
    $scope.instances = instances.getInstances();
    $scope.wagonParalama = [];

    $interval(getPrideData, 1000);
    $interval(updateInstance, 10000);

    function getPrideData() {
        if ($scope.instances && $scope.instances.length > 0) {
            if ($scope.instances[idx].id == paralamaInstance) {
                $scope.showAvailability = true;
            }
            socket.emit('get-takt', $scope.instances[idx].id);
            socket.emit('get-wagon-call', $scope.instances[idx].id);
        }
        generateWagons($scope.cfgWagonAmount);
    }

    function updateInstance() {
        if ($scope.instances && $scope.instances.length > 0) {
            instanceSize = $scope.instances.length;
            idx++;
            if (idx > instanceSize - 1) {
                idx = 0;
            }
        }
    }

    socket.on('wagon-call', function (data) {
        if ($scope.instances[idx].id == paralamaInstance) {
            $scope.wagonParalama[0] = data[17].active;
            $scope.wagonParalama[1] = data[18].active;
        }

    });

    $scope.wagonAndonStatus = function (wagon) {
        console.log(wagon);
    }

    $scope.deliverWagon = function (wagon) {
        console.log(wagon);
        // socket.emit(wagon-delivered, wagon)
    }

    socket.on('server-takt-instance', function (data) { console.log(data.remainingTime) });



    $scope.wagonColor = function (wagon, quantity) {
        var color = { green: 0.75, yellow: 0.9, red: 1 };
        var prct = wagon / $scope.cfgWagonAmount;
        var wagonColor = null;
        quantity--;
        if (quantity >= wagon) wagonColor = "wagon-used";
        else if (prct < color.green) wagonColor = "wagon-green";
        else if (prct <= color.yellow && prct < color.red) wagonColor = "wagon-warning";
        else wagonColor = "wagon-danger";
        return wagonColor;
    };

    socket.on('put-takt', formatPlcData);

    socket.on('newConnection', function (data) {
        console.log("NOVA CONEXÃO > " + data.toString());
    });

    $scope.reconnect = function () {
        socket.emit('plc-reconnect', { conn: "Reconnection Request" });
        console.log('Tentando reconectar com o PLC...');
    };

    function formatPlcData(data) {

        if (data == null) {
            $scope.error = "Sem Conexao...";
            return;
        }

        $scope.andon = data.andon;
        $scope.takt = data;
        $scope.cfgWagonNumber = data.cfgWagonNumber; //Numero de vagoes
        $scope.cfgWagonAmount = data.cfgWagonAmount; //Numero de Popids por vagao
        $scope.wagons = data.wagon;
        $scope.error = data.error;
        $scope.taktNegative = false;

        $scope.takt.produced = $scope.takt.produced ? $scope.takt.produced : 0;

        if (data.lineTakt <= 0) {
            $scope.taktNegative = true;
        }


    }

    function generateWagons(amount) {
        $scope.popidWagon = [];
        for (var i = 1; i <= amount; i++)
            $scope.popidWagon.push(i);
    }


}

function adjustController($scope, $log, adjust, socket, instances) {

    instances.getAvailableInstances().then(function () {
        $scope.availableInstances = instances.availableInstances.filter(d => d.name !== "");
    });

    var time = { h: '00', m: '00', s: '00' };

    $scope.t = time;
    $scope.st = time;

    $scope.setTime = function (instance, t, wagon) {
        var ms = converToMs(t);
        $scope.ms = ms;
        console.log(ms + ' ' + wagon.number)
        adjust.updateWagonTime(instance, wagon, ms);
    };

    $scope.setStopTime = function (instance, t) {
        var ms = converToMs(t);
        $scope.stopTimeMs = ms;
        adjust.updateStopTime(instance, ms);
    };

    $scope.increase = function (t, type) {
        if (type == 0) {
            t = parseInt(t.h, 10);
            t++;
            $scope.t.h = t.toString();
        } else if (type == 1) {
            t = parseInt(t.m, 10);
            t++;
            if (t >= 60) {
                return;
            }

            if (t < 10) {
                $scope.t.m = "0" + t.toString();
            } else {
                $scope.t.m = t.toString();
            }
        } else {
            t = parseInt(t.s, 10);
            t++;
            if (t >= 60) {
                return;
            }
            if (t < 10) {
                $scope.t.s = "0" + t.toString();
            } else {
                $scope.t.s = t.toString();
            }

        }
    };

    $scope.decrease = function (t, type) {
        if (type == 0) {
            t = parseInt(t.h, 10);
            t--;
            if (t < 0) {
                return;
            }
            $scope.t.h = t.toString();
        } else if (type == 1) {
            t = parseInt(t.m, 10);
            t--;
            if (t < 0) {
                return;
            }
            if (t < 10) {
                $scope.t.m = "0" + t.toString();
            } else {
                $scope.t.m = t.toString();
            }
        } else {
            t = parseInt(t.s, 10);
            t--;
            if (t < 0) {
                return;
            }
            if (t < 10) {
                $scope.t.s = "0" + t.toString();
            } else {
                $scope.t.s = t.toString();
            }
        }
    };

    $scope.updateWagon = function (instance, wagon) {
        adjust.updateWagon(instance, wagon);
    };

    function converToMs(time) {
        var ms = time.h * 60 * 60 * 1000;
        ms += time.m * 60 * 1000;
        return ms += time.s * 1000;
    }

    $scope.reconnect = function () {
        var asw = confirm("Deseja reestabelecer conexão com PLC ?");
        if (!asw) return false;
        console.log('Tentando reconectar com o PLC...');
        socket.emit('plc-reconnect', { conn: "Reconnection Request" });
        return true;
    }
}

function welcomeController($scope, socket, instances) {

    init();

    $scope.selectedInstances = [];

    $scope.deviceName = "";

    $scope.pickInstance = function (instance) {
        var idx = $scope.availableInstances.indexOf(instance);
        $scope.availableInstances.splice(idx, 1);
        $scope.selectedInstances.push(instance);
    }

    $scope.removeInstance = function (instance) {
        var idx = $scope.selectedInstances.indexOf(instance);
        $scope.selectedInstances.splice(idx, 1);
        $scope.availableInstances.push(instance);
    }

    $scope.saveChanges = function (deviceName, selectedInstances) {
        if (selectedInstances) {
            console.error("Erro, nao foram selecionadas instancias");
        }
        deviceName = !deviceName ? 'Default' : deviceName;
        instances.setInstances(deviceName, selectedInstances);
        console.log('Alterações realizadas com sucesso!');
    }

    function init() {
        instances.getAvailableInstances().then(function () {
            $scope.availableInstances = instances.availableInstances.filter(i => i.name !== "");
        });
    }

}

function configController($scope, instances, config) {

    $scope.instances = [];
    $scope.selectedInstance = 0;
    $scope.selectedWagon = 0;
    $scope.selectedOperation = 0;
    $scope.configInstance = {};

    instances.getAvailableInstances().then(function () {
        $scope.instances = instances.availableInstances;
    });

    $scope.getInstance = function (instance) {
        config.getConfigInstance(instance).then(function () {
            $scope.configInstance = config.configInstance;
            $scope.selectedWagon = 0;
            $scope.selectedOperation = 0;
            $scope.time = null;
        });
    }

    $scope.saveInstance = function () {
        var newConfig = $scope.configInstance;
        var selectedInstance = $scope.selectedInstance;
        var selectedWagon = $scope.selectedWagon;
        var selectedOperation = $scope.selectedOperation;
        var cfg = {
            "instance": Number(selectedInstance),
            "wagonIndex": Number(selectedWagon),
            "operationIndex": Number(selectedOperation),
            "config": {
                "name": newConfig.name,
                "cycleNumber": Number(newConfig.cycleNumber),
                "wagonNR": Number(newConfig.wagonNR),
                "parallelInstance": Number(newConfig.parallelInstance),
                "wagon": {
                    "enabled": selectedWagon > 0 ? newConfig.wagon[selectedWagon - 1].enabled : 0,
                    "name": selectedWagon > 0 ? newConfig.wagon[selectedWagon - 1].name : "",
                    "numOperations": selectedWagon > 0 ? newConfig.wagon[selectedWagon - 1].numOperations : 0,
                    "operation": {
                        "enabled": selectedOperation > 0 ? newConfig.wagon[selectedWagon - 1].operations[selectedOperation - 1].enabled : 0,
                        "name": selectedOperation > 0 ? newConfig.wagon[selectedWagon - 1].operations[selectedOperation - 1].name : "",
                        "stdTime": selectedOperation > 0 ? newConfig.wagon[selectedWagon - 1].operations[selectedOperation - 1].stdTime : 0
                    }
                }
            }

        };

        console.log(cfg);

        config.updateInstance(cfg).then(function () {
            console.log('Instância: ' + selectedInstance + ' atualizada');
            // window.location.reload();
        });
    }

    $scope.t = function () {
        console.log($scope.time)
    }

    $scope.updateTime = function () {
        if (!$scope.time.s) {
            $scope.time.s = 0;
        }
        if (!$scope.time.m) {
            $scope.time.m = 0;
        }
        if ($scope.time.s > 59) {
            $scope.time.s = 59;
        }
        if ($scope.time.m > 59) {
            $scope.time.m = 59;
        }

        var wagon = $scope.selectedWagon - 1;
        var operation = $scope.selectedOperation - 1;

        $scope.configInstance.wagon[wagon].operations[operation].stdTime = converToMs($scope.time);

        function converToMs(time) {
            var ms = time.m * 60 * 1000;
            ms += time.s * 1000;
            return ms;
        }

        setTimeout(function () {
            $scope.$apply();
        }, 1000);

    }





}
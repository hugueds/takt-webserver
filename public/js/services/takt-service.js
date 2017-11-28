(function() {
    angular.module('takt-service', ['ngStorage'])
        .factory('config', configService)
        .factory('instances', instanceService)
})();

function configService($http) {
    var o = {
        wagons: []
    };

    o.getWagon = function() {
        return $http.get('/wagons')
            .success(function(data) {
                angular.copy(data, o.wagons);
            })
            .error(function(err) { console.error(err) });
    };

    //Atualiza a quantidade de popids consumidos no comboio
    o.updateWagon = function(instance, wagon) {
        return $http.post('/instance/' + instance + '/wagon/' + (wagon.number - 1) + '/quantity', { quantity: wagon.quantity }) //HARD CODED PARA UMA INSTANCIA
            .success(function(data) {
                console.log("Dados Atualizados ", data);
            })
            .error(function(err) { console.error(err) });
    };

    //Atualiza o Stop Time da instancia
    o.updateStopTime = function(instance, time) {
        return $http.post('/instance/' + instance + '/stop-time', { time: time }) //HARD CODED PARA UMA INSTANCIA
            .success(function(data) {
                console.log("Stop time has been updated", data);
            })
            .error(function(err) { console.error(err); });
    };

    //Atualiza o Timer da instancia de acordo com o comboio selecionado
    o.updateWagonTime = function(instance, wagon, time) {
        return $http.post('/instance/' + instance + '/wagon/' + (wagon.number - 1) + '/timer', { timer: time }) //HARD CODED PARA UMA INSTANCIA
            .success(function(data) {
                console.log(data);
            })
            .error(function(err) { console.error(err); });
    };

    return o;
}

function instanceService($http, $q, $state, $localStorage, $window) {

    var local = $localStorage;

    var avaliableInstances = [
        { id: 0, name: "KIT FA 1.1" },
        { id: 1, name: "KIT LE / LD" },
        { id: 2, name: "KIT FA 0" },
        { id: 3, name: "FA 0.2 - FA 0.4" },
        { id: 4, name: "FA 1.1.3" },
        { id: 5, name: "FA 4.1 - 4.2" },
        { id: 6, name: "FA 4.3 - 4.4" },
        { id: 7, name: "FA 5.1" },
        //{id : 8, name: "FA 5.2 - 5.4"}		
    ]

    var o = {
        device: "",
        avaliableInstances: avaliableInstances,
        instances: [],
        registered: false
    }

    o.getAvaliableInstances = function() {
        return o.avaliableInstances;
    }

    o.getInstances = function() {
        return local.instances;
    }

    o.getDevice = function() {
        return local.device;
    }

    o.checkInstance = function() {
        var defer = $q.defer();
        if (local.instances) {
            o.setInstances(o.device, o.instances);
            defer.resolve(true);
        } else {
            defer.resolve(false);
        }
        return defer.promise;
    }

    o.setInstances = function(device, instances) {
        if (instances.length > 0) {
            local.device = device;
            local.instances = instances;
            o.registered = true;
            return setTimeout(function() { location = window.location.origin; }, 100);
        }
    }

    o.unsetInstances = function() {
        o.instances = [];
        o.registered = false;
        local.instances = "";
        local.device = "";
        return;
    }

    return o;
}
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

function instanceService($http, $q, $state, $localStorage, $window){

    var local = $localStorage;   

    var avaliableInstances = [
        {id : 0, name: "KIT FA 1.1" },
        {id : 1, name: "KIT LE / LD"},
        {id : 2, name: "KIT FA 0"}
    ]

    var o = {
        device : "",   
        avaliableInstances : avaliableInstances,     
        instances : [],
        registered : false
    }

    o.getAvaliableInstances = function(){
        return $http.get('/instances')
        .success(function (data) {
            angular.copy(data, o.avaliableInstances);
        })
        .error(function(){
            console.log("Erro durante requisicao das instancias");
        });
    }

    o.getInstances = function(){                
            return local.instances;        
    }

    o.checkInstance = function(){
        var defer = $q.defer();
        if (local.instances){            
            o.setInstances(o.device, o.instances);
            defer.resolve(true);
        } else {
            defer.resolve(false);
        }
        return defer.promise;                
    }

    o.setInstances = function(device, instances){
        if (instances.length > 0){            
            local.device = device;
            local.instances = instances;
            o.registered = true;
            return setTimeout(function(){ location = "http://10.8.66.81/"; } ,100);            
        } 
    }

    o.unsetInstances = function(){
        // o.avaliableInstances = avaliableInstances;
        o.instances = [];        
        o.registered = false;
        local.instances = "";
        local.device = "";
        return;
    }   

    return o;
}
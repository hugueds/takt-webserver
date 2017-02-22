(function() {
    angular.module('takt-service', [])
        .factory('config', configService)
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
(function() {
    angular.module('takt-service', [])
        .factory('config', configService)
})();

function configService($http) {
    var o = {
        addr: String,
        wagons: []
    };

    o.getWagon = function() {
        return $http.get('/wagons')
            .success(function(data) {
                angular.copy(data, o.wagons);
            })
            .error(function(err) {
                console.log(err)
            });
    };

    o.getServers = function() {
        return $http.get('/servers')
            .success(function() {
                console.log('Getting servers...');
            })
            .error(function(err) {
                console.error('error retrieving config')
            });
    };

    //Atualiza a quantidade de popids consumidos no comboio
    o.updateWagon = function(wagon, quantity) {
        return $http.post('/instance/1/wagon/' + wagon + '/quantity', { quantity: quantity }) //HARD CODED PARA UMA INSTANCIA
            .success(function(data) {
                console.log("Dados Atualizados " + data);
            })
            .error(function(err) {
                console.error(err)
            });
    };


    //Atualiza o Stop Time da instancia
    o.updateStopTime = function(time) {
        return $http.post('/instance/1/stop-time', { time: time }) //HARD CODED PARA UMA INSTANCIA
            .success(function(data) {
                console.log(data);
            })
            .error(function(err) {
                throw err;
            });
    };

    //Atualiza o Timer da instancia de acordo com o comboio selecionado
    o.updateWagonTime = function(wagon, time) {
        return $http.post('/instance/1/wagon/' + wagon + '/timer', { timer: time }) //HARD CODED PARA UMA INSTANCIA
            .success(function(data) {
                console.log(data);
            })
            .error(function(err) {
                throw err;
            });
    };

    return o;
}
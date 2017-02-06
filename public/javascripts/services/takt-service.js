angular.module('takt-service',[])

.factory('config',['$http', function ($http) {
 	var o = {
 		addr : String
 		,wagons : []
 	};



 	o.getWagon = () => {
 		return $http.get('/wagons')
 		.success((data) =>{
 			angular.copy(data, o.wagons);
 		})
 		.error((err) => console.log(err));
 	};

 	o.getServers = () => {
 		return $http.get('/servers')
 		.success(() =>{
      		;
    	})
 		.error( () => { console.log('error retrieving config')});
 	};

 	//Atualiza a quantidade de popids consumidos no comboio
 	o.updateWagon = (wagon, quantity) => {
 		return $http.post('/instance/1/wagon/'+wagon+'/quantity', {quantity : quantity}) //HARD CODED PARA UMA INSTANCIA
 		.success((data) =>{
 			console.log("Dados Atualizados " + data);
 		})
 		.error((err) => {
 			console.log(err)
 		});
 	};

 	
 	//Atualiza o Stop Time da instancia
 	o.updateStopTime = (time) => {
 		return $http.post('/instance/1/stop-time', {time : time})  //HARD CODED PARA UMA INSTANCIA
 		.success((data) => {
 			console.log(data);
 		})
 		.error((err) => {
 			throw err;
 		});
 	};

 	//Atualiza o Timer da instancia de acordo com o comboio selecionado
 	o.updateWagonTime = (wagon, time) => {
 		return $http.post('/instance/1/wagon/'+wagon+'/timer', {timer : time}) //HARD CODED PARA UMA INSTANCIA
 		.success((data) => {
 			console.log(data);
 		})
 		.error((err) => {
 			throw err;
 		});
 	};

 	return o;

 }]);


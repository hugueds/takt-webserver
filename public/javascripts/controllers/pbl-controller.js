angular.module('pbl-controller', ['socket-service'])
.controller('PickByLight', ['$scope', 'socket', 'pbl', function($scope, socket, pbl){

	$scope.storage = function(){
		pbl.localstorage();
		console.log('ok');
	}

	// $scope.parts = pbl.getMissingParts();
	$scope.parts = [ //PARTS FORÇADAS PARA DEMONSTRAÇÃO
		{ id : 1, number: 123456, buffer: 59, module : 20, date: new Date().toISOString()}
		,{id : 2, number: 111111, buffer: 59, module : 22, date: new Date().toISOString()}
		,{id : 3, number: 222222, buffer: 59, module : 24, date: new Date().toISOString()}
		,{id : 4, number: 333333, buffer: 59, module : 26, date: new Date().toISOString()}
		,{id : 4, number: 444444, buffer: 59, module : 28, date: new Date().toISOString()}
	]

	var Barcode = function(barcode){
		this.part = barcode.part || null;
		this.buffer = barcode.buffer || null;
		this.module = barcode.module || 1;
		this.quantity = barcode.quantity || null;
		return this;
	};

	socket.on('missing-part', function(data){
		$scope.parts.push(data);
		pbl.addMissingPart(data);
		console.log("Peça inserida na lista de faltantes");
	});
	
	$scope.removePart= function(part){
		//pbl.removeMissingPart(id);
		var index = $scope.parts.indexOf(part);
		$scope.parts.splice(index, 1);
	};
	
	socket.on('serial', function(data){
		var dataType = checkData(data);
		
 		$scope.serial = data;
 		if (dataType == 1){
 			$scope.barcode.number = data;
 		}
 		else if (dataType == 2){
 			$scope.barcode.buffer = data;
 			$scope.barcode.module = data;
 		}
 		else if (dataType == 3){
 			$scope.barcode.quantity = data;
 		}
 		console.log('Received from Scanner: ' + data);
 	});
	

 	$scope.addPart = function(barcode){
 		var read = new Barcode(barcode);
 		if (!(read.part && read.buffer && read.module && read.quantity)){
 			console.log(read);
 			return console.log("FALTA ALGUMA COISA AI "+barcode);
 		}
 		//Envia para o methodo PUT a nova quantidade de peças
 		console.log("Atualizando peças");
 		$scope.barcode = {};
 	}

	$scope.reset = function(){
		$scope.barcode = {};
	}

	function checkData(serial){
		;
	}
	
	;
}]);


/*
.controller('PartController',['$scope', 'socket',  function($scope, socket){
	;
}])
.controller('BufferController',['$scope', 'socket',  function($scope, socket){
	;
}])
.controller('PartLocationController',['$scope', 'socket',  function($scope, socket){
	$scope.parts = []; //Get All parts from services

	$scope.getAllPartLocations = function(){
		;
	};

	$scope.addPartLocation = function(partLocation){
		;
	}

	$scope.updatePartLocation = function(partLocation){
		;
	}

	$scope.removePartLocation = function(id){
		;
	}

}]);
*/



/*
Significado locação (etiquetas geradas no SIMAS)

Exemplo: 59CTX11SF 22
Onde:
59 = buffer
CT = chassis truck
X = peça volumosa
11 = Função 1.1
SF = abreviação da pré-montagem
22 = módulo do buffer em que a peça fica alocada
*/
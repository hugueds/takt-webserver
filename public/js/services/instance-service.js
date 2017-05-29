// function instanceService($http, $q, $state, $localStorage){

//     var local = $localStorage;

//     var avaliableInstances = [
//         {id : 0, name: "Kit FA 1.1"},
//         {id : 1, name: "FA1.1 LE / LD"},
//         {id : 2, name: "Kit FA 0"},
//         {id : 3, name: ""},
//         {id : 4, name: ""},
//         {id : 5, name: ""},
//         {id : 6, name: ""},
//         {id : 7, name: ""}
//     ];

//     var o = {
//         device : "",
//         avaliableInstances : avaliableInstances,
//         instances : []
//     }


//     o.checkInstance = function(){
//         var defer = $q.defer();
//         if (local.instances){            
//             o.setInstances(local.instances);
//             defer.resolve(true);
//         } else {
//             defer.resolve(false);
//         }
//         return defer.promise;                
//     }


//     o.setInstances = function(instances, device){
//         if (instances.length > 0){
//             o.device = device;
//             o.instances = instances;            
//             $state.go('takt');
//         }        
//     }

//     o.removeInstances = function(){
//         o.instances = [],
//         local.instances = "";
//     }   

//     return o;
// }
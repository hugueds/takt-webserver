var angular;
var app = angular.module('MainApp', ['ui.router']);

app.config([
  '$stateProvider'
  ,'$urlRouterProvider'
  ,function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
      url: '/home',
      views: {
        '': {
          templateUrl: 'templates/home.html',
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['lts', 
            function(lts){ 
              return lts.getAll(); 
            }]
          }
        },
        'modal@home' : {templateUrl : 'templates/modal.html'}
      },

    })

    ,$stateProvider.state('lts', {
      url: '/lts/:id',
      templateUrl: '/lt.html',
      controller: 'LTCtrl'
    })

    , $urlRouterProvider.otherwise('home');
    

  }]);




app.controller('MainCtrl', ['$scope','$http', 'lts', function($scope, $http, lts){

  $scope.teste = 'helloaa';
  $scope.lts = lts.lt;
  $scope.modal = {};
  $scope.search_lt = '';

  var functions = ['0', '1.1', '1.2' , '2', '3.1', '3.2', '4', '5'];
  $scope.functions = functions;

  $scope.lt_num = null;

  $scope.addLT = function () {

    var lt_num = $scope.lt_num.toString();

    if (lt_num.length == 7){
      var zero = '0';
      lt_num = zero.concat(lt_num);
    }

    if (lt_num.length != 8) {
     alert('A LT DEVE CONTER 8 DIGITOS');
     return;
   }

   var lt_func;

   if (lt_num[0] == '0'){
    lt_func = lt_num.substring(0,2);
  }
  else{
    lt_func = lt_num[0] + "." + lt_num[1];
  }

  var lt_station = lt_num.substring(2,3);        
  var lt_position = lt_num.substring(3,4);         
  var lt_equip = lt_num.substring(4,6);
  var lt_prog = lt_num.substring(6,8);

  lts.create({
   num: lt_num,
   func : lt_func,
   station: lt_station,
   position: lt_position,
   equip: lt_equip,
   program: lt_prog,
   ssb: 0,
   soquet: 0,
   torq: 0,
   b_size: 0
 });

  $scope.lt_num = null;

};

$scope.sort = function(func){
  lts.getFunction(func);
};

$scope.search = function (lt){
  lts.search_lt(lt);
};

$scope.getAll = function(){
  lts.getAll();
};

$scope.order = function(x){
  $scope.orderSel = x;
};

$scope.to_modal = function(id){
  $scope.modal = id;
};

$scope.update_lt = function(lt){

  var newLT = $scope.modal;
  
  lts.edit(lt, newLT); 

  
};

$scope.delete_lt = function(id){
  var answer = confirm("Tem certeza que deseja excluir esta LT do sistema?");
  if (!answer)
    return;
  lts.delete(id);
};

}]);





app.factory('lts', ['$http', function($http){

 var o = {
  lt: [],
};

o.getAll = function(){
  return $http.get('/lts')
  .success(function(data){
   angular.copy(data, o.lt);
 });
};

o.getFunction = function(func){
  return $http.get('/getfunction/' + func)
  .success(function(data){
    angular.copy(data, o.lt);
  });
};

o.search_lt = function(lt){
  return $http.get('/search/' + lt)
  .success(function(data){
    angular.copy(data, o.lt);
  });
};

o.create = 	function(lt) {
  return $http.post('/lts', lt)
  .success(function (data) {
    o.lt.push(data);
  });
};


o.edit = function(lt, newLT) {
  return $http.put('/lts/' + lt._id + '/updatelt', newLT)
  .success(function(res){
    o.getAll();
    console.log("OK");    

  });
};

o.delete = function(id){
  return $http.delete('/lts/'+id).
  success(function(res){
    console.log("REMOVING ID #"+id);
    o.getAll();
  });
};


return o;

}]);

//commit test
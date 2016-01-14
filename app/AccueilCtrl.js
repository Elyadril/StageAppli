app.controller('AccueilCtrl', function ($scope, $modal, $filter,$routeParams, Data) {
	var mail = ($routeParams.mail);
    $scope.agendas = {};
    Data.get('agendas').then(function(data){
        $scope.agendas = data.data;
    });
	$scope.inscriptions = {};
	Data.get('inscriptions/'+mail).then(function(data){
		$scope.inscriptions = data.data;
	});
    $scope.deleteInscription = function(idRDV){
        if(confirm("Etes-vous sur de vouloir supprimer l'inscription ?")){
            Data.delete("inscription/"+mail+"/"+idRDV).then(function(result){
                $scope.inscriptions = _.without($scope.inscriptions, _.findWhere($scope.inscriptions, {idRDV:idRDV}));
            });
        }
    };
    $scope.open = function (agendas,size) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/AccueilEdit.html',
          controller: 'AccueilEditCtrl',
          size: size,
          resolve: {
           agendas: function () {
              return agendas;
            }
          }
        });
        modalInstance.result.then(function(selectedObject) {
            if(selectedObject.save == "insert"){
                $scope.agendas.push(selectedObject);
                $scope.agendas = $filter('orderBy')($scope.agendas, 'idAgenda', 'reverse');
            }else if(selectedObject.save == "update"){
                p.description = selectedObject.description;
                p.price = selectedObject.price;
                p.stock = selectedObject.stock;
                p.packing = selectedObject.packing;
            }
        });
    };
    
 
});


app.controller('AccueilEditCtrl', function ($scope, $modalInstance, agendas, Data) {

  $scope.agendas = angular.copy(agendas);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
        $scope.title = (agendas.id > 0) ? 'Edit Product' : 'Nouveau agenda';
        $scope.buttonText = (agendas.id > 0) ? 'Gestion des Agendas' : 'Gestion des Agendas';

        var original = agendas;
        $scope.isClean = function() {
            return angular.equals(original, $scope.agendas);
        }
        $scope.saveProduct = function (product) {
            product.uid = $scope.uid;
            if(product.id > 0){
                Data.put('products/'+product.id, product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                product.status = 'Active';
                Data.post('products', product).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(product);
                        x.save = 'insert';
                        x.id = result.data;
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }
        };
});

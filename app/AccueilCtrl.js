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
	$scope.changeAgendaStatus = function(idAgenda){
        agenda.status = (agenda.status=="Active" ? "Inactive" : "Active");
        Data.put("products/"+agenda.idAgenda,{status:agenda.status});
    };
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
                $scope.agendas = $filter('orderBy')($scope.agendas, 'libAgenda');
            }else if(selectedObject.save == "update"){
                agendas.mail = selectedObject.mail;
                agendas.nbJourOuverture = selectedObject.nbJourOuverture;
                agendas.nbJourLimite = selectedObject.nbJourLimite;
                agendas.inscriptionMax = selectedObject.inscriptionMax;
				agendas.dateCreation = selectedObject.dateCreation;
            }
        });
    };
});


app.controller('AccueilEditCtrl', function ($scope, $modalInstance, agendas, Data) {

  $scope.agendas = angular.copy(agendas);
        
        $scope.cancel = function () {
            $modalInstance.dismiss('Close');
        };
		
		
		$scope.deleteAgenda = function (idAgenda) {
		if(confirm("Etes-vous sur de vouloir supprimer l'agenda ?")){
			Data.delete("agendas/" +idAgenda).then(function(result){
				$scope.agendas = _.without($scope.agendas, _.findWhere($scope.agendas, {idAgenda:idAgenda}));
			});
          }
	    };       

        var original = agendas;
        $scope.isClean = function() {
            return angular.equals(original, $scope.agendas);
        }
        $scope.saveAgenda = function ($idAgenda) {
            agendas.uid = $scope.uid;
            if(agendas.idAgenda > 0){
                Data.put('agendas/'+agenda.idAgenda+ "/"+agenda.libAgenda+"/"+agenda.nbJourOuverture+"/"+agenda.nbJourLimite+"/"+inscritpionMax).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(agendas);
                        x.save = 'update';
                        $modalInstance.close(x);
                    }else{
                        console.log(result);
                    }
                });
            }else{
                agendas.status = 'Active';
                Data.post('agendas', agenda).then(function (result) {
                    if(result.status != 'error'){
                        var x = angular.copy(agendas);
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





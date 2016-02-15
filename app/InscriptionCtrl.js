app.controller('InscriptionCtrl', function ($scope, $uibModal,$rootScope,$routeParams,$location,Data) {
	
$rootScope.idAgenda = ($routeParams.idAgenda);
$rootScope.DateDebut = ($routeParams.DateDebut);

	//*** Information de l'agenda choisi ***//
    $scope.agenda = {};
	    Data.get('agendas/' +$rootScope.idAgenda).then(function(data) {
		    $scope.agenda = data.data[0];
	});
	//
	
	//*** Retour calendrier de l'agenda ***//
	$scope.retourAgenda = function (idAgenda) {
		$rootScope.idAgenda = idAgenda;        	
		$location.path('/agenda/' + $rootScope.idAgenda);          
    };
	//
	
	//*** Charge les rendez-vous de la date choisie avec les inscrits ***//
	$scope.chargeRDV = function () {
		$scope.rendez_vous = [];
		Data.get('agenda/'+$rootScope.idAgenda+'/inscription/'+$rootScope.DateDebut).then(function(data) {
			$scope.rendez_vous = data.data;
			$scope.rendez_vous.forEach(function(rdv){
				Data.get('inscriptions/rdv/' +rdv.idRDV).then(function(data) {
					rdv.inscriptions = data.data;
				});	
			});		
		});
	}
	//
	
	//*** Recuperation des rendez-vous de la date choisie avec les inscrits éventuels ***//
	$scope.chargeRDV();
	//
	
	//*** Suppression d'une inscription par le gestionnaire ***//
	$scope.deleteInscription = function(mail,idRDV){
        if(confirm("Etes-vous sur de vouloir supprimer l'inscription ?")){
            Data.delete("inscription/"+mail+"/"+idRDV).then(function(result){				  
				$scope.chargeRDV();
            });
        }
    };
	//
	
	//*** Suppression d'un rendez-vous par le gestionnaire ***//
	$scope.deleteRDV = function(idRDV) {
		if(confirm("Etes-vous sur de vouloir supprimer ce rendez-vous ?")){
			Data.delete("rendez_vous/"+ idRDV).then(function(result){
				$scope.chargeRDV();
			});
		}
	};
	//
	
	//*** Verification de la date d'ouverture ***//
	
	//
	
	//*** Ouverture popup des inscriptions ***//
	$scope.openIns = function (rdv,size) {
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/InscriptionEdit.html',
			controller: 'InscriptionEditCtrl',
			size: size,
			resolve: {
				rdv: function () {															
						return rdv;					
				},
				agenda: function () {
					return $scope.agenda;
				}
			}
		});	
		modalInstance.result.then(function() {
			$scope.chargeRDV();
		});
     };
	//
	
});

app.controller('InscriptionEditCtrl', function ($scope,$rootScope, $uibModalInstance,rdv,agenda, Data) {
	
	$scope.mail = $rootScope.personne.mail;
	$scope.agenda = agenda;
	
	$scope.cancel = function () {
            $uibModalInstance.dismiss('Close');						
        };
		
	//*** Ajout d'une inscription ***//
	$scope.ajoutInscription = function (mail) {
		Data.post('ajoutInscription', {'mail':mail,'idRDV':rdv.idRDV}).then(function (result) {
			if(result.status != 'error'){                      
					$uibModalInstance.close();                   
			}
			else{
					console.log(result);
			}	
		});	
	};
	//
});
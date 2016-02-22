app.controller('InscriptionCtrl', function ($scope, $uibModal,$rootScope,$routeParams,$location,Data) {
	
$rootScope.idAgenda = ($routeParams.idAgenda);
$rootScope.DateDebut = ($routeParams.DateDebut);

	//*** Information de l'agenda choisi ***//
    $scope.agenda = {};
	Data.get('agendas/' +$rootScope.idAgenda).then(function(data) {
		$scope.agenda = data.data[0];
		//*** Recuperation des rendez-vous de la date choisie avec les inscrits éventuels ***//
		$scope.chargeRDV();
		//
		
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
					rdv.info = $rootScope.desactiveInscription(rdv, $rootScope.personne, false);
					if (rdv.info)
						rdv.cacher = true;
					else 
						rdv.cacher = false;
				});	
			});		
		});
	}
	//
	
	//*** Desactive les inscriptions selon le controle effectif ***//
	$rootScope.desactiveInscription = function(rdv, personne, bypass) {
		var result = rdv.inscriptions.length >= $scope.agenda.inscriptionMax;
		if(result) {
			return  "Nombre limite atteint.";
		}
		
		
		var dateOuverture =  new Date(new Date(rdv.DateDebut).getTime() - ($scope.agenda.nbJourOuverture * 1000*60*60*24));
		result = new Date() < dateOuverture;
		if(result) {
			return "Ouverture le " + dateOuverture.toLocaleString();
		}
		
		
		var dateFermeture = new Date(new Date(rdv.DateDebut).getTime() - ($scope.agenda.nbJourLimite * 1000*60*60*24));
		result = new Date() > dateFermeture;
		if(result) {
			return "Fermeture le " + dateFermeture.toLocaleString();
		}
		
		if(!$scope.agenda.autoIns || bypass) {
			var dateReinscriptionMax = new Date(new Date(rdv.DateDebut).getTime() + ($scope.agenda.nbJourReins * 1000*60*60*24));
			var dateReinscriptionMin = new Date(new Date(rdv.DateDebut).getTime() - ($scope.agenda.nbJourReins * 1000*60*60*24));
			rdv.info = "";
			if (personne.inscriptions) {
				for(var i = 0; i < personne.inscriptions.length; i++) {
					var inscription = personne.inscriptions[i];
					if (inscription.idRDV == rdv.idRDV) {
						return "Déjà inscrit sur ce créneau";
						
					} 
					result = inscription.idAgenda == $rootScope.idAgenda && new Date(rdv.DateDebut) >= dateReinscriptionMin && new Date(rdv.DateDebut) < dateReinscriptionMax;
					//rdv.info += rdv.DateDebut.toLocaleString() + "  >= " + dateReinscriptionMin.toLocaleString() + " && " + rdv.DateDebut.toLocaleString() + " < " + dateReinscriptionMax.toLocaleString() + "    ";
					if(result) {
						return "Reinscription impossible, déjà inscrit le " + new Date(inscription.DateDebut).toLocaleString();
					}
				}
			}
		}		
		return false;
	};
	
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
		Data.get('personnes/' +mail).then(function(data) {
			if(data && data.data) {
				var personne = data.data[0];
				Data.get('inscriptionPers/'+mail).then(function(data){				
					personne.inscriptions = data.data; 	
					var info = $rootScope.desactiveInscription(rdv, personne, true);
					
					if (info) {
						alert(info);
					} else {
						Data.post('ajoutInscription', {'mail':mail,'idRDV':rdv.idRDV}).then(function (result) {
							$uibModalInstance.close();    
							if(result.status == 'error'){                                     
								alert(result.message);

							}	
						});	
					}
					
	            });		
				
			}
	
		 });
	};
	//
});
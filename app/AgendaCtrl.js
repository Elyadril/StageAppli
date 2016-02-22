app.controller('AgendaCtrl', function ($scope, $uibModal,$rootScope,$routeParams,$location,$http,Data) {

$rootScope.idAgenda = ($routeParams.idAgenda);

    $scope.disabled = function(date, mode) {
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };
	
	//*** Informations de l'agenda en cours ***//
    $scope.agenda = [];
		Data.get('agendas/' +$rootScope.idAgenda).then(function(data) {
		$scope.agenda = data.data[0];
	});
	//
	
	//*** Liste des gestionnaires de l'agenda ***//
    $scope.gestionnaires = [];
		Data.get('gestionnaires/' + $rootScope.idAgenda).then(function(data) {
		$scope.gestionnaires = data.data;
	});
    //
	
	//*** Rendez-vous de l'agenda en cours ***//
	$scope.rendez_vous = [];
		Data.get('rendez_vous/agenda/' + $rootScope.idAgenda).then(function(data) {
		$scope.rendez_vous = data.data;
	});
    //
	
	//*** Retour à l'ecran d'accueil ***//
	$scope.retourAccueil = function () {       
		$location.path('/');
	};
    //
	
	//*** Accès à la page des inscriptions ***//
	$scope.accesInscriptions = function (DateDebut) {
		$location.path('/agenda/'+ $rootScope.idAgenda+'/inscription/'+DateDebut);
	};
    //
		
	//*** Ouverture popup de Gestion des gestionnaires ***//
	$scope.openG = function (gestionnaires, size) {		
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/GestionnaireEdit.html',
			controller: 'GestionnairesEditCtrl',
			size: size,
			resolve: {
				gestionnaires: function () {				
					return Data.get('gestionnaires/' + $rootScope.idAgenda).then(function(data) {
						return data.data;
	            });					
				}
			}
		});
		modalInstance.result.then(function() {
			Data.get('gestionnaires/' + $rootScope.idAgenda).then(function(data) {
				$scope.gestionnaires = data.data;				
			});
		});
	};
	//
	
	//*** Ouverture popup d'ajout d'un nouveau rendez-vous ***//
	$scope.openRDV = function (rendez_vous, size) {
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/RendezVousEdit.html',
			controller: 'RendezVousEditCtrl',
			size: size,
			resolve: {
				rendez_vous: function () {				
					return rendez_vous;			
				}
			}
		});
		modalInstance.result.then(function() {
			Data.get('rendez_vous/agenda/' + $rootScope.idAgenda).then(function(data) {
				$scope.rendez_vous = data.data;
			});
		});
    };
	//
	
	//*** Ouverture popup de duplication ***//
	$scope.openDupl = function (rendez_vous, size) {
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/Duplication.html',
			controller: 'DuplicationCtrl',
			size: size,
			resolve: {
				rendez_vous: function() {
					return rendez_vous;
				}
			}
		});
		modalInstance.result.then(function() {
			Data.get('rendez_vous/agenda/' + $rootScope.idAgenda).then(function(data) {
				$scope.rendez_vous = data.data;
			});
		});
	};
	//
	
	//*** Colonnes du tableau du calendrier des agendas ***//
	$scope.columns = [
		{text:"Janvier" ,value:"-01-"},
		{text:"Fevrier", value:"-02-"},
		{text:"Mars", value:"-03-"},
		{text:"Avril", value:"-04-"},
		{text:"Mai",value:"-05-"},
		{text:"Juin",value:"-06-"},
		{text:"Juillet",value:"-07-"},
		{text:"Aout",value:"-08-"},
		{text:"Septembre",value:"-09-"},
		{text:"Octobre",value:"-10-"},
		{text:"Novembre",value:"-11-"},
		{text:"Decembre",value:"-12-"}                   
	];
    //
});

app.controller('GestionnairesEditCtrl', function ($scope,$rootScope, $uibModalInstance, gestionnaires, Data) {
	
	$scope.gestionnaires= angular.copy(gestionnaires);
	$scope.gestionnaires = gestionnaires;
  	    
	$scope.mail = "";
	$scope.cancel = function () {
            $uibModalInstance.close();
        };
	
	//*** Ajout de gestionnaires par le créateur de l'agenda ou l'admin ***//
	$scope.ajoutGestionnaires = function (mail)  {		
		if(confirm("Etes-vous sur d'ajouter ce gestionnaire ?")) {
			Data.post('ajoutGestionnaires', {'mail':mail,'idAgenda':$rootScope.idAgenda}).then(function (result) {
				if(result.status != 'error'){
					$scope.mail = "";
					Data.get('gestionnaires/' + $rootScope.idAgenda).then(function(data) {
						$scope.gestionnaires = data.data;
					});
				}
				else{
					console.log(result);
				}
			});
		};
	};
	//

    //*** Suppression de gestionnaires par le créateur de l'agenda ou l'admin ***//
	$scope.deleteGestionnaire = function (mail) {
		if(confirm("Etes-vous sur de vouloir supprimer l'agenda ?")){
			Data.delete("gestionnaires/" + mail +"/"+$rootScope.idAgenda).then(function(result){
				if(result.status != 'error'){
					$scope.mail="";
					Data.get('gestionnaires/' + $rootScope.idAgenda).then(function(data) {
				     $scope.gestionnaires = data.data;
				});
				}
				else{
					alert("Ce gestionnaire ne peut pas être supprimer !")
				}
				
			});
		}	
	};    
});

app.controller('RendezVousEditCtrl', function ($scope,$rootScope, $uibModalInstance,rendez_vous, Data) {
	
		$scope.rdv = {};
		$scope.cancel = function () {
            $uibModalInstance.close();
        };
  
	$scope.disabled = function(date, mode) {
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };
 
	$scope.openD = function() {
		$scope.popupD.opened = true;
    };
 
    $scope.popupD = {
		opened: false
    };
	
	$scope.openF = function() {
		$scope.initDateFin();
		
	$scope.popupF.opened = true;
    };
 
	$scope.initDateFin = function() {
		if (!$scope.rdv.DateFin && $scope.rdv.DateDebut) {
			$scope.rdv.DateFin = $scope.rdv.DateDebut; 
		}
	};
 
    $scope.popupF = {
		opened: false
	}; 
 
	$scope.ajoutRendezVous = function (rdv)  {   
		Data.post('ajoutRendezVous', {'DateDebut':rdv.DateDebut,'DateFin':rdv.DateFin,'idAgenda':$rootScope.idAgenda}).then(function (result) {
			if(result.status != 'error'){
				var inter = $scope.rdv.DateFin - $scope.rdv.DateDebut;
				$scope.rdv.DateDebut = $scope.rdv.DateFin;
				$scope.rdv.DateFin = new Date($scope.rdv.DateDebut.getTime() + inter);
				Data.get('rendez_vous/agenda/' + $rootScope.idAgenda).then(function(data) {
					$scope.rendez_vous = data.data;
				});
			} else {
				console.log(result);
			}
		});
	};
 
});

	


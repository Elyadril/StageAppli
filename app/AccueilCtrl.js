app.controller('AccueilCtrl', function ($scope,$uibModal,$rootScope,$routeParams,$cookies,$location,$http,Data) {

	if ($routeParams.cle) {
		$cookies.put('cle',$routeParams.cle);
		$rootScope.connect($routeParams.cle);		
	}
	$scope.mail = "";
    
	//*** Liste des agendas ***//
    Data.get('agendas').then(function(data){
        $scope.agendas = data.data;
    });
	//
	
	//*** Connexion de l'utilisateur ***//    
	$scope.connexion = function() {  
		Data.get('personneCle/' + $scope.mail).then(function(data) {
			$scope.mail="";
			alert(data.message);	         			
		});
	};	
	//
	
	//*** Suppression d'une inscription ***//	
    $scope.deleteInscription = function(idRDV){
		if(confirm("Etes-vous sur de vouloir supprimer l'inscription ?")){
			Data.delete("inscription/"+$rootScope.personne.mail+"/"+idRDV).then(function(result){				  
				Data.get('inscriptionPers/' +$rootScope.personne.mail).then(function(data){
					$rootScope.personne.inscriptions = data.data;
				});
			});
		}
	};
	//	
	
	//*** Connexion vers le calendrier de rendez-vous de l'agenda choisi ***//
	$scope.connexionAgenda = function (idAgenda) {
        $rootScope.idAgenda = idAgenda;       	
		$location.path('/agenda/' + $rootScope.idAgenda);
	};
	//
		
	
	//*** Ouverture Gestion des Agendas ***//
    $scope.openA = function (agendas,size) {
        var modalInstance = $uibModal.open({
          templateUrl: 'partials/AccueilEdit.html',
          controller: 'AccueilEditCtrl',
          size: size,
          resolve: {
			  agendas: function () {
				  return Data.get('agendas').then(function(data) {
						return data.data;
						});
				}
			}
        });
		//*** Retour après fermeture de la Gestion Popup ***//
        modalInstance.result.then(function() {
			
            Data.get('agendas').then(function(data){
				$scope.agendas = data.data;
				
			});
		});
    };
	//
	
	//*** Ouverture popup des Createurs ***//
	$scope.openC = function (createurs,size) {	
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/CreateurEdit.html',
			controller: 'CreateurEditCtrl',
			size: size,
			resolve: {
				createurs: function () {
					
	            return Data.get('createurs').then(function(data) {
		        return data.data;
	            });
					
				}
			}
		});
		
	};
	//
});

app.controller('AccueilEditCtrl', function ($scope,$rootScope, $uibModalInstance, agendas, Data) {

  $scope.agendas = angular.copy(agendas);
  
		$scope.agenda = {}; 
		$scope.agenda.idAgenda = 0;   
        $scope.cancel = function () {
            $uibModalInstance.close();			
        };
		
		//*** Suppression d'un agenda ***//
		$scope.deleteAgenda = function (idAgenda) {
			if(confirm("Etes-vous sur de vouloir supprimer l'agenda ?")){
				Data.delete("agendas/" +idAgenda).then(function(result){
					if(result.status != 'error'){					
						$scope.agendas = _.without($scope.agendas, _.findWhere($scope.agendas, {idAgenda:idAgenda}));
					}
					else {
						alert("Cette agenda contient des rendez-vous , il ne peut être pas supprimer !")
					}				
				});
			}
		};       
        //
		
        //*** Ajouter d'un nouvel agenda par un créateur ***//
        $scope.saveAgenda = function (agenda) {
			agenda.dateCreation = new Date().toISOString().slice(0,19).replace('T',' ');
			agenda.mail = $rootScope.personne.mail;
            if(agenda.idAgenda > 0){			
                Data.put('agendas/'+agenda.idAgenda, agenda).then(function (result) {
                    if(result.status != 'error'){
                        //$scope.agendas = [];
						//Data.get('agendas/' + agenda.idAgenda).then(function(data){
						//$scope.agendas = data.data;
						//});
						var x = angular.copy(agendas)
						x.save = 'Update';
                    }
					else {					
                        console.log(result);
                    }	
                });
            }
			else {               
                Data.post('agendas', agenda).then(function (result) {
                    if(result.status != 'error'){
						//$scope.agendas = [];
						//Data.get('agendas').then(function(data){
						//$scope.agendas = data.data;
						//});
						var x = angular.copy(agendas);
						x.save = 'insert';
						x.id = result.data;
                    }
					else {
                        console.log(result);						
                    }
                });
			};
		};
		//
});

app.controller('CreateurEditCtrl', function ($scope,$rootScope, $uibModalInstance, createurs, Data) {
	
	$scope.createurs = angular.copy(createurs);
	
		$scope.createur = {};
		$scope.mail = "";
		$scope.cancel = function () {
            $uibModalInstance.dismiss('Close');
        };
		
	    //*** Ajout de créateur d'agendas par l'admin ***//
		$scope.ajoutcreateurs = function (mail)  {
			if(confirm("Etes-vous sur d'ajouter ce Créateur ?")) {
				Data.put('ajoutcreateurs/'+ mail).then(function (result) {
					if(result.status == 'error'){                        
                        console.log(result);
                    }
					else {
						$scope.mail = "";
						Data.get('createurs').then(function(data) {
						$scope.createurs = data.data;
						});
					}
				});
			};
		};
		//
		
		//*** Suppression d'un créateur d'agenda par l'admin ***//
		$scope.supprcreateurs = function (mail)  {
			if(confirm("Etes-vous sur de supprimer ce Créateur ?")) {
				Data.put('supprcreateurs/'+ mail).then(function (result) {
					if(result.status == 'error'){                        
                        console.log(result);
                    }
					else{
						Data.get('createurs').then(function(data) {
						$scope.createurs = data.data;
						});
					}
				});
			};
		};
		//
});

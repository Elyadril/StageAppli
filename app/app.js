var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate','ngCookies','multipleDatePicker']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      title: 'Accueil',
      templateUrl: 'partials/Accueil.html',
      controller: 'AccueilCtrl' 
    })
	.when('/:cle', {
		title: 'Accueil',
		templateUrl: 'partials/Accueil.html',
		controller: 'AccueilCtrl'
	})
	.when('/agenda/:idAgenda', {
		title: 'Agenda',
		templateUrl: 'partials/Agenda.html',
		controller: 'AgendaCtrl'
	})
	.when('/agenda/:idAgenda/inscription/:DateDebut', {
		title: 'Inscription',
		templateUrl: 'partials/Inscription.html',
		controller: 'InscriptionCtrl'
	})	
    .otherwise({
      redirectTo: '/'
    });;
}]);


app.run(function($rootScope,$routeParams,$cookies,Data,$location) {
	
	//*** Connexion de l'utilisateur *** //
	$rootScope.connect = function (cle) {      
	      Data.get('personne/' +cle).then(function(data) {
			if(data.data && data.data.length != 0) {				
		        $rootScope.personne = data.data[0];
			    Data.get('inscriptionPers/'+$rootScope.personne.mail).then(function(data){
					$rootScope.personne.inscriptions = data.data; //*** recupère les inscriptions de la personne connectée ***//
					for(var i = 0; i < $rootScope.personne.inscriptions.length ; i++) {
						var inscription = $rootScope.personne.inscriptions[i];
						var dateFermeture = new Date(new Date(inscription.DateDebut).getTime() - (inscription.nbJourLimite * 1000*60*60*24));
						result = new Date() > dateFermeture;
						inscription.cacher = result;
						if(result) {
							inscription.info = "Pour annuler ce rendez-vous , contacter l'administrateur";
						}
					}
	            });
				Data.get('gestionAg/'+$rootScope.personne.mail).then(function(data){
					$rootScope.personne.gestionAg = data.data; //*** récupère les agendas géré ***//
					$rootScope.personne.isGestionnaire = function (idAgenda) {
						for (var i = 0; i < $rootScope.personne.gestionAg.length; i++) {
							if ($rootScope.personne.gestionAg[i]["idAgenda"] === idAgenda) {
								return true;
							}
						}
							return false;
					}
				});
				
			}
			else {
				alert("clé invalide !");
				$rootScope.deconnect();
			}
	      });		         			
	};
    //
	
	//*** Deconnexion de l'utilisateur en cours ***//
    $rootScope.deconnect = function () {
			$rootScope.personne = "";
			$cookies.remove('cle');
			$location.path('/');
	};	
	//
	
	var cle = $cookies.get('cle');
	if(cle) {
		$rootScope.connect(cle);		
	}
});
moment.locale('fr');
var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate','ngCookies','multipleDatePicker']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
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


app.run(function($rootScope,$cookies,Data,$location) {
	
	//*** Connexion de l'utilisateur *** //
	$rootScope.connect = function (mail) {      
	      Data.get('personnes/' +mail).then(function(data) {
			if(data.data.length != 0) {				
		        $rootScope.personne = data.data[0];
			    Data.get('inscriptionPers/'+$rootScope.personne.mail).then(function(data){
					$rootScope.personne.inscriptions = data.data; //*** recupère les inscriptions de la personne connectée ***//
	            });
				Data.get('gestionAg/'+$rootScope.personne.mail).then(function(data){
					$rootScope.personne.gestionAg = data.data; //*** récupère les agendas géré ***//
				});
				$rootScope.personne.isGestionnaire = function (idAgenda) {
				for (var i = 0; i < $rootScope.personne.gestionAg.length; i++) {
					if ($rootScope.personne.gestionAg[i]["idAgenda"] === idAgenda) {
						return true;
					}
				}
					return false;
				}
				$cookies.put('mail',$rootScope.personne.mail);
			}
			else {
				alert("mail invalide");
			}
	      });		         			
	};
    //
	
	//*** Deconnexion de l'utilisateur en cours ***//
    $rootScope.deconnect = function () {
			$rootScope.personne = "";
			$cookies.remove('mail');
			$location.path('/');
	};	
	//
	
	var mail = $cookies.get('mail');
	if(mail) {
		$rootScope.connect(mail);		
	}
});
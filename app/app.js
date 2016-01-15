var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/:mail', {
      title: 'Accueil',
      templateUrl: 'partials/Accueil.html',
      controller: 'AccueilCtrl'	  
    })
	.when('/', {
		title: 'Accueil',
		templateUrl: 'partials/AccueilLogin.html',
        controller: 'AccueilCtrl'	
	})
    .otherwise({
      redirectTo: '/'
    });;
}]);
    
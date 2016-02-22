<?php
require '.././libs/Slim/Slim.php';
require_once 'dbHelper.php';
include '../libs/mail/mail.php';

date_default_timezone_set('Europe/Paris');

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
$app = \Slim\Slim::getInstance();
$db = new dbHelper();

/**
 * Database Helper Function templates
 */
/*
select(table name, where clause as associative array)
insert(table name, data as associative array, mandatory column names as array)
update(table name, column names as associative array, where clause as associative array, required columns as array)
delete(table name, where clause as array)
*/

$app->get('/agendas', function() { 
    global $db;
    $rows = $db->selectEquals("agenda","idAgenda, libAgenda, mail, nbJourOuverture, nbJourLimite,nbJourReins, inscriptionMax,cacheNom,autoIns,commentaire",array());
    echoResponse(200, $rows);
});
$app->get('/gestionnaires/:idAgenda', function($idAgenda) {
	global $db;
	$rows = $db->selectEquals("gestionnaire_agendas","mail,idAgenda",array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
$app->get('/gestionAg/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("gestionnaire_agendas","mail,idAgenda",array('mail'=>$mail));
	echoResponse(200, $rows);
});
$app->get('/personnes/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("personne","mail, nom, prenom, grade, createurAg, admin", array('mail'=>$mail));
	echoResponse(200, $rows);
});
$app->get('/personneCle/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("personne","cle", array('mail'=>$mail));
	if($rows["status"]=="success") {
			$rows["message"] = "Vous allez recevoir un mail";
			mail_type($mail, $rows["data"][0]["cle"]);
			
		}
		else {
			$rows["message"] = "Adresse mail inconnu.";
		}
	echoResponse(200, $rows);
});
$app->get('/personne/:cle', function($cle) {
	global $db;
	$rows = $db->selectEquals("personne","mail, nom, prenom, grade, createurAg, admin", array('cle'=>$cle));
	echoResponse(200, $rows);
});
$app->get('/createurs', function() {
	global $db;
	$rows = $db->selectEquals("personne","mail, nom, prenom, grade, createurAg, admin", array('createurAg'=>1));
	echoResponse(200, $rows);
});
$app->get('/admin', function() {
	global $db;
	$rows = $db->selectEquals("personne","mail, nom, prenom, grade, createurAg, admin", array('admin'=>1));
	echoResponse(200, $rows);
});
$app->get('/inscriptions/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("inscription","mail, idRDV,dateInscription", array('mail'=>$mail));
	echoResponse(200, $rows);
});
$app->get('/agendas/:idAgenda', function($idAgenda){
	global $db;
	$rows = $db->selectEquals("agenda","idAgenda, libAgenda, mail, nbJourOuverture, nbJourLimite,nbJourReins, inscriptionMax,cacheNom,autoIns,commentaire", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
 
$app->get('/rendez_vous/agenda/:idAgenda', function($idAgenda) {   
 global $db;
 $rows = $db->selectEquals("rendez_vous","distinct DATE(DateDebut) as DateDebut", array('idAgenda'=>$idAgenda));
 echoResponse(200, $rows);
});
$app->get('/agenda/:idAgenda/inscription/:DateDebut', function($idAgenda,$DateDebut) {   
	global $db;
	$rows = $db->inscriptions($idAgenda,$DateDebut);
	echoResponse(200, $rows);
});
$app->get('/inscriptions/rdv/:idRDV', function($idRDV) {
	global $db;
	$rows = $db->selectEquals("inscription","mail,idRDV,DateInscription", array('idRDV'=>$idRDV));
	echoResponse(200, $rows);
});
$app->get('/inscriptionPers/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("inscriptionPers","mail,idRDV,DateDebut,DateFin,libAgenda,idAgenda,nbJourLimite", array('mail'=>$mail));
	echoResponse(200, $rows);
});
 function verifnbInscrit($idRDV) {
	global $db;
	$rows = $db->selectEquals("nbInscription","idAgenda,idRDV,DateDebut,DateFin,nbInscrits,inscriptionMax", array('idRDV'=>$idRDV));
	return $rows["data"][0];
};
$app->get('/rendez_vousD/:DateDebut', function($DateDebut) {
	global $db;
	$rows = $db->selectEquals("rendez_vous","idRDV,DateDebut,DateFin,idAgenda", array('DateDebut'=>$DateDebut));
	echoResponse(200, $rows);
});
$app->post('/agendas', function() use ($app) {
    $data = json_decode($app->request->getBody());
    $mandatory = array('libAgenda','mail','nbJourOuverture','nbJourLimite','nbJourReins','inscriptionMax','dateCreation');
    global $db;
    $rows = $db->insert("agenda", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Agenda crée !";
		echoResponse(200, $rows);
});
$app->post('/ajoutInscription', function() use ($app) {
	$data = json_decode($app->request->getBody());
	$mandatory = array('mail','idRDV');
	$nbInscription = verifnbInscrit($data->idRDV);
	if($nbInscription["nbInscrits"] < $nbInscription["inscriptionMax"]){
		global $db;
		$rows = $db->insert("inscription", $data, $mandatory);
		if($rows["status"]=="success") {
			$rows["message"] = "Inscription ajoutée !";
		}
		else {
			$rows["message"] = "Déjà inscrit !";
		}
	}
    else {
		$rows["status"] = "error";
		$rows["message"] = "Nombre limite atteint !";		
	}
	echoResponse(200, $rows);
});
$app->put('/agendas/:idAgenda', function($idAgenda) use ($app) { 
    $data = json_decode($app->request->getBody());
    $condition = array('idAgenda'=>$idAgenda);
    $mandatory = array();
    global $db;
    $rows = $db->update("agenda", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Agenda modifié !";
		echoResponse(200, $rows);
});
$app->put('/ajoutcreateurs/:mail', function($mail) use ($app) {
	$data = array("createurAg"=>1);
	$condition = array('mail'=>$mail);
	$mandatory = array();
	global $db;
	$rows = $db->update("personne", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Createur ajouté !";
		echoResponse(200, $rows);
});
$app->put('/supprcreateurs/:mail', function($mail) use ($app) {
	$data = array("createurAg"=>0);
	$condition = array('mail'=>$mail);
	$mandatory = array();
	global $db;
	$rows = $db->update("personne", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Createur supprimer !";
		echoResponse(200, $rows);
});
$app->post('/ajoutGestionnaires', function() use ($app) {
	$data = json_decode($app->request->getBody());
    $mandatory = array('mail','idAgenda');
    global $db;
    $rows = $db->insert("gestionnaire_agendas", $data, $mandatory);
	
    if($rows["status"]=="success")
       $rows["message"] = "gestionnaire ajouté !";
		echoResponse(200, $rows);
});
$app->put('/supprGestionnaires', function() use ($app) {
	$data = json_decode($app->request->getBody());
	$condition = array();
	$mandatory = array('mail','idAgenda');
	global $db;
	$rows = $db->update("gestionnaire_agendas", $data, $condition, $mandatory	);
    if($rows["status"]=="success")
        $rows["message"] = "Gestionnaire supprimé !";
		echoResponse(200, $rows);
});
$app->post('/ajoutRendezVous', function() use ($app) {
	$data = json_decode($app->request->getBody());
	$mandatory = array('DateDebut','DateFin','idAgenda');
	$data->DateDebut = date('Y-m-d H:i:s', strtotime($data->DateDebut));
	$data->DateFin   = date('Y-m-d H:i:s', strtotime($data->DateFin));
	global $db;
	$rows = $db->insert("rendez_vous", $data, $mandatory);
	if($rows["status"]=="success")
       $rows["message"] = "Rendez-vous ajouté !";
		echoResponse(200, $rows);
});
$app->delete('/agendas/:idAgenda', function($idAgenda) { 
    global $db;
    $rows = $db->delete("agenda", array('idAgenda'=>$idAgenda));
    if($rows["status"]=="success")
        $rows["message"] = "Agenda effacé";
		echoResponse(200, $rows);
});
$app->delete('/rendez_vous/:idRDV', function($idRDV) {
	global $db;
	$rows = $db->delete("rendez_vous", array('idRDV'=>$idRDV));
	if($rows["status"]=="success")
		$rows["message"] = "Rendez-vous effacé";
		echoResponse(200, $rows);
});
$app->delete('/inscription/:mail/:idRDV' , function($mail,$idRDV) {
	global $db;
	$rows = $db->delete("inscription", array('mail'=>$mail,'idRDV'=>$idRDV));
	if($rows["status"]=="success")
        $rows["message"] = "Inscription bien effacé !";
		echoResponse(200, $rows);
});
$app->delete('/gestionnaires/:mail/:idAgenda', function($mail,$idAgenda) {
	global $db;
	$rows = $db->delete("gestionnaire_agendas", array('mail'=>$mail,'idAgenda'=>$idAgenda));
	if($rows["status"]=="success")
		$rows["message"] = "Gestionnaire supprimé ! ";
		echoResponse(200, $rows);
});
function echoResponse($status_code, $response) {
    global $app;
    $app->status($status_code);
    $app->contentType('application/json');
    echo json_encode($response,JSON_NUMERIC_CHECK);
}

$app->run();
?>
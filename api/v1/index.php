<?php
require '.././libs/Slim/Slim.php';
require_once 'dbHelper.php';

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
    $rows = $db->selectEquals("agenda","idAgenda, libAgenda, mail, nbJourOuverture, nbJourLimite, inscriptionMax",array());
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
	$rows = $db->selectEquals("agenda","idAgenda, libAgenda, mail, nbJourOuverture, nbJourLimite, inscriptionMax,cacheNom,autoIns,commentaire", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
$app->get('/rendez_vous/agenda/:idAgenda', function($idAgenda) {   
	global $db;
	$rows = $db->selectEquals("rendez_vous","distinct DateDebut", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
$app->get('/agenda/:idAgenda/inscription/:DateDebut', function($idAgenda,$DateDebut) {   
	global $db;
	$rows = $db->selectEquals("rendez_vous","idRDV,DateDebut, HeureDebut,HeureFin", array('idAgenda'=>$idAgenda,'DateDebut'=>$DateDebut));
	echoResponse(200, $rows);
});
$app->get('/inscriptions/rdv/:idRDV', function($idRDV) {
	global $db;
	$rows = $db->selectEquals("inscription","mail,idRDV,DateInscription", array('idRDV'=>$idRDV));
	echoResponse(200, $rows);
});
$app->get('/inscriptionPers/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("inscriptionPers","mail,idRDV,DateDebut,HeureDebut,HeureFin,libAgenda", array('mail'=>$mail));
	echoResponse(200, $rows);
});
$app->get('/nbInscription/:idAgenda', function($idAgenda) {
	global $db;
	$rows = $db->selectEquals("nbInscription","idAgenda,idRDV,DateDebut,HeureDebut,HeureFin,nbInscrits,inscriptionMax", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
$app->get('/rendez_vous/:DateDebut', function($DateDebut) {
	global $db;
	$rows = $db->selectEquals("rendez_vous","idRDV,DateDebut,distinct HeureDebut,DateFin,distinct HeureFin,idAgenda", array('DateDebut'=>$DateDebut));
});
$app->get('/rendez_vous/:idRDV', function($idRDV) {
	global $db;
	$rows = $db->selectEquals("rendez_vous","idRDV,DateDebut,distinct HeureDebut,DateFin,distinct HeureFin,idAgenda", array('idRDV'=>$idRDV));
});
$app->post('/agendas', function() use ($app) {
    $data = json_decode($app->request->getBody());
    $mandatory = array('libAgenda','mail','nbJourOuverture','nbJourLimite','inscriptionMax','dateCreation');
    global $db;
    $rows = $db->insert("agenda", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Agenda crée !";
		echoResponse(200, $rows);
});
$app->post('/ajoutInscription', function() use ($app) {
	$data = json_decode($app->request->getBody());
	$mandatory = array('mail','idRDV');
	global $db; 
	$rows = $db->insert("inscription", $data, $mandatory);
	if($rows["status"]=="success")
		$rows["message"] = "Inscription ajoutée !";
		echoResponse(200, $rows);
});
$app->put('/agendas/:idAgenda', function($idAgenda) use ($app) { 
    $data = json_decode($app->request->getBody());
    $condition = array('idAgenda'=>$idAgenda);
    $mandatory = array();
    global $db;
    $rows = $db->update("agenda", $data, $condition, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Agenda crée !";
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
	$mandatory = array('DateDebut','HeureDebut','DateFin','HeureFin','idAgenda');
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
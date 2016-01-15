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


// Products
$app->get('/agendas', function() { 
    global $db;
    $rows = $db->selectEquals("agenda","idAgenda, libAgenda, mail, nbJourOuverture, nbJourLimite, inscriptionMax",array());
    echoResponse(200, $rows);
});

$app->get('/inscriptions/:mail', function($mail) {
	global $db;
	$rows = $db->selectEquals("inscription","mail, idRDV,dateInscription", array('mail'=>$mail));
	echoResponse(200, $rows);
});
$app->get('/agendas/:idAgenda', function($idAgenda){
	global $db;
	$rows = $db->selectEquals("agenda","idAgenda, libAgenda, mail, nbJourOuverture, nbJourLimite, inscriptionMax", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});

$app->get('/rendez_vous/agenda/:idAgenda', function($idAgenda) {   
	global $db;
	$rows = $db->selectEquals("rendez_vous","idRDV,DateDebut,DateFin,idAgenda", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
$app->get('/gestionnaires/:idAgenda', function($idAgenda) {
	global $db;
	$rows = $db->selectEquals("gestionnaire_agendas","mail,idAgenda", array('idAgenda'=>$idAgenda));
	echoResponse(200, $rows);
});
$app->get('/inscriptions/rdv/:idRDV', function($idRDV) {
	global $db;
	$rows = $db->selectEquals("inscription","mail,idRDV,DateInscription", array('idRDV'=>$idRDV));
	echoResponse(200, $rows);
});

$app->post('/agendas', function() use ($app) { 
    $data = json_decode($app->request->getBody());
    $mandatory = array('name');
    global $db;
    $rows = $db->insert("agenda", $data, $mandatory);
    if($rows["status"]=="success")
        $rows["message"] = "Product added successfully.";
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


$app->delete('/agendas/:idAgenda', function($idAgenda) { 
    global $db;
    $rows = $db->delete("agenda", array('idAgenda'=>$idAgenda));
    if($rows["status"]=="success")
        $rows["message"] = "Agenda effacé";
    echoResponse(200, $rows);
});
$app->delete('/inscription/:mail/:idRDV' , function($mail,$idRDV) {
	global $db;
	$rows = $db->delete("inscription", array('mail'=>$mail,'idRDV'=>$idRDV));
	if($rows["status"]=="success")
        $rows["message"] = "Inscription bien effacé !";
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
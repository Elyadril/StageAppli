<?php
function mail_type($mail, $cle) {
	//$mail = 'david.tamisier@intradef.gouv.fr'; // Déclaration de l'adresse de destination.
	//if (!preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $mail)) // On filtre les serveurs qui rencontrent des bogues.
	//{
	//	$passage_ligne = "\r\n";
	//}
	//else
	//{
		$passage_ligne = "\n";
	//}
	//=====Déclaration des messages au format texte et au format HTML.
	//$message_txt = "Salut à tous, voici un e-mail envoyé par un script PHP.";
	$message_html = "<html><head><style>".
	".titre {background-color: #337AB7;color: #FFF;font-size: 30px;margin: 20px;padding:10px;}".
	".pied {background-color: #337AB7;color: #FFF;font-size: 10px;text-align: center;margin: 20px;padding:10px;}".
	".corp {background-color: #FFF;color: #337AB7;font-size: 22px;margin: 20px;padding:20px;}".
	".connect {color: #FFF;background-color: #D9534F;border-color: #D43F3A;font-size: 22px;margin:10px;padding:10px;text-decoration: none;}".
	".connect:hover{background-color: #C9302C;border-color: #761C19;}".
	"<div class=\"titre\">Bienvenue sur l'application Rendez-vous des E.M.S.</div>".
	"<div class=\"corp\">Pour pouvoir vous inscrire à un rendez-vous, utilisez le lien suivant :".
	"<a class=\"connect\" href=\"http://localhost:8080/StageAppli/#/". $cle ."\"> Connexion </a> </div>".
	"<div class=\"pied\"><span>EMS/BFAO - 2016</span><div>";
	//==========
	 
	//=====Création de la boundary
	$boundary = "-----=".md5(rand());
	//==========
	 
	//=====Définition du sujet.
	$sujet = "Rendez-vous : Lien de connexion";
	//=========
	 
	//=====Création du header de l'e-mail.
	$header = "From: <choups.mat@gmail.com>".$passage_ligne;
	//$header.= "Reply-to: \"WeaponsB\" <ems.webmaster.fct@intradef.gouv.fr>".$passage_ligne;
	$header.= "MIME-Version: 1.0".$passage_ligne;
	$header.= "Content-Type: multipart/alternative;".$passage_ligne." boundary=\"$boundary\"".$passage_ligne;
	//==========
	 
	//=====Création du message.
	$message = $passage_ligne."--".$boundary.$passage_ligne;
	//=====Ajout du message au format texte.
	//$message.= "Content-Type: text/plain; charset=\"ISO-8859-1\"".$passage_ligne;
	//$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
	//$message.= $passage_ligne.$message_txt.$passage_ligne;
	//==========
	$message.= $passage_ligne."--".$boundary.$passage_ligne;
	//=====Ajout du message au format HTML
	$message.= "Content-Type: text/html; charset=\"ISO-8859-1\"".$passage_ligne;
	$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
	$message.= $passage_ligne.$message_html.$passage_ligne;
	//==========
	$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
	$message.= $passage_ligne."--".$boundary."--".$passage_ligne;
	//==========
	 
	//=====Envoi de l'e-mail.
	mail($mail,$sujet,$message,$header,'O DeliveryMode=b');
	//==========

};
?>
